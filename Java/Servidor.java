import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/** Servidor HTTP local usando apenas recursos do JDK, sem bibliotecas externas. */
public class Servidor {
    private static final Map<String,String> CLASSES = Map.of(
        "primo","NumeroPrimo", "somatorio","Somatorio", "fibonacci","Fibonacci",
        "mdc","MDC", "quicksort","QuickSort", "contagem","Contagem");
    private static final Map<String,String> ASSETS = Map.of(
        "/","index.html", "/index.html","index.html", "/style.css","style.css",
        "/app.js","app.js", "/algoritmos.js","algoritmos.js", "/favicon.svg","favicon.svg");

    public static void main(String[] args) throws IOException {
        Path raiz = Path.of("").toAbsolutePath();
        if (!Files.isRegularFile(raiz.resolve("Web/index.html")))
            throw new IllegalStateException("Inicie na pasta Entregavel-2, que contém Java e Web.");
        int porta = args.length == 0 ? 8080 : Integer.parseInt(args[0]);
        HttpServer servidor = HttpServer.create(new InetSocketAddress("127.0.0.1", porta), 0);
        servidor.createContext("/", e -> atender(e, raiz));
        servidor.start();
        System.out.println("Aplicação pronta: http://127.0.0.1:" + porta);
        System.out.println("Java executa neste terminal; JavaScript executa no navegador.");
        System.out.println("Para encerrar, pressione Ctrl+C.");
    }

    private static void atender(HttpExchange e, Path raiz) throws IOException {
        try {
            String rota = e.getRequestURI().getPath();
            if (rota.equals("/api/executar")) {
                if (!e.getRequestMethod().equals("POST")) {
                    e.getResponseHeaders().set("Allow","POST");
                    responder(e,405,"application/json","{\"erro\":\"Use POST.\"}"); return;
                }
                String origin = e.getRequestHeaders().getFirst("Origin");
                String host = e.getRequestHeaders().getFirst("Host");
                if (origin != null && !origin.equals("http://" + host)) {
                    responder(e,403,"application/json","{\"erro\":\"Origem não permitida.\"}"); return;
                }
                byte[] corpo = e.getRequestBody().readNBytes(16385);
                if (corpo.length > 16384) {
                    responder(e,413,"application/json","{\"erro\":\"Entrada muito grande.\"}"); return;
                }
                Map<String,String> dados = parametros(new String(corpo,StandardCharsets.UTF_8));
                String algoritmo = dados.getOrDefault("algoritmo","");
                String resultado = executar(algoritmo,dados);
                System.out.println("[JAVA] " + algoritmo + " executado.");
                responder(e,200,"application/json",resultado); return;
            }
            if (!e.getRequestMethod().equals("GET")) {
                responder(e,405,"text/plain","Método não permitido."); return;
            }
            if (rota.startsWith("/codigo/")) {
                String classe = CLASSES.get(rota.substring(8));
                if (classe == null) { responder(e,404,"text/plain","Algoritmo não encontrado."); return; }
                responder(e,200,"text/plain",Files.readString(raiz.resolve("Java/"+classe+".java"))); return;
            }
            if (rota.equals("/instrucoes")) {
                responder(e,200,"text/plain",Files.readString(raiz.resolve("README.md"))); return;
            }
            String arquivo = ASSETS.get(rota);
            if (arquivo == null) { responder(e,404,"text/plain","Página não encontrada."); return; }
            String tipo = arquivo.endsWith(".css") ? "text/css" : arquivo.endsWith(".js") ? "text/javascript"
                : arquivo.endsWith(".svg") ? "image/svg+xml" : "text/html";
            responder(e,200,tipo,Files.readString(raiz.resolve("Web/"+arquivo)));
        } catch (IllegalArgumentException ex) {
            responder(e,400,"application/json","{\"erro\":"+json(ex.getMessage())+"}");
        } catch (Exception ex) {
            ex.printStackTrace();
            responder(e,500,"application/json","{\"erro\":\"Falha no servidor Java. Confira o terminal.\"}");
        } finally { e.close(); }
    }

    private static String executar(String algoritmo, Map<String,String> p) {
        switch (algoritmo) {
            case "primo": {
                int n = inteiro(p,"numero",1,1000000);
                boolean primo = NumeroPrimo.ehPrimo(n);
                return escalar(n,primo?"É um número primo.":"Não é um número primo.","Verificação executada por NumeroPrimo.java.");
            }
            case "somatorio": {
                int[] v = vetor(p,"numeros");
                return escalar(Somatorio.calcularSomatorio(v),"Soma dos valores",v.length+" valores somados em Java.");
            }
            case "fibonacci": {
                int n = inteiro(p,"n",2,78);
                return sequencia(Arrays.toString(Fibonacci.gerar(n)),n+" termos gerados em Java, começando em 0.");
            }
            case "mdc": {
                int a = inteiro(p,"a",0,1000000000), b = inteiro(p,"b",0,1000000000);
                if (a==0 && b==0) throw new IllegalArgumentException("Informe pelo menos um número maior que zero.");
                return escalar(MDC.calcularMDC(a,b),"Máximo divisor comum","MDC("+a+", "+b+") calculado em Java.");
            }
            case "quicksort": {
                int[] v = vetor(p,"vetor");
                QuickSort.quickSort(v,0,v.length-1);
                return sequencia(Arrays.toString(v),v.length+" valores ordenados em Java. Repetições são preservadas.");
            }
            case "contagem": {
                int[] v = vetor(p,"dados"); int n = inteiro(p,"n",-1000000000,1000000000);
                return escalar(Contagem.contar(v,n),"Valores dentro do intervalo",
                    "Intervalo: "+v[0]+" até "+n+", inclusive. Repetições contam separadamente. Execução em Java.");
            }
            default: throw new IllegalArgumentException("Algoritmo desconhecido.");
        }
    }
    private static Map<String,String> parametros(String corpo) {
        Map<String,String> dados = new HashMap<>();
        for (String par:corpo.split("&")) {
            String[] partes = par.split("=",2);
            if (partes.length==2) dados.put(URLDecoder.decode(partes[0],StandardCharsets.UTF_8),URLDecoder.decode(partes[1],StandardCharsets.UTF_8));
        }
        return dados;
    }
    private static int inteiro(Map<String,String> p,String campo,int min,int max) {
        String valor = p.getOrDefault(campo,"").trim();
        if (!valor.matches("[+-]?\\d+")) throw new IllegalArgumentException("Informe um inteiro válido em "+campo+".");
        long n;
        try { n = Long.parseLong(valor); }
        catch (NumberFormatException ex) { throw new IllegalArgumentException("Valor fora do limite em "+campo+"."); }
        if (n<min || n>max) throw new IllegalArgumentException(campo+" deve estar entre "+min+" e "+max+".");
        return (int)n;
    }
    private static int[] vetor(Map<String,String> p,String campo) {
        String raw = p.getOrDefault(campo,"").trim();
        if (raw.isEmpty()) throw new IllegalArgumentException("Preencha "+campo+".");
        String[] partes = raw.split("[\\s,;]+",-1);
        if (partes.length>500) throw new IllegalArgumentException("Use até 500 valores.");
        int[] v = new int[partes.length];
        for(int i=0;i<partes.length;i++) v[i]=inteiro(Map.of("valor",partes[i]),"valor",-1000000000,1000000000);
        return v;
    }
    private static String escalar(long v,String titulo,String detalhe) {
        return "{\"language\":\"java\",\"big\":"+v+",\"verdict\":"+json(titulo)+",\"detail\":"+json(detalhe)+"}";
    }
    private static String sequencia(String valores,String detalhe) {
        return "{\"language\":\"java\",\"sequence\":"+valores+",\"detail\":"+json(detalhe)+"}";
    }
    private static String json(String s) {
        return "\""+s.replace("\\","\\\\").replace("\"","\\\"").replace("\n","\\n").replace("\r","\\r").replace("\t","\\t")+"\"";
    }
    private static void responder(HttpExchange e,int status,String tipo,String texto) throws IOException {
        byte[] bytes=texto.getBytes(StandardCharsets.UTF_8);
        e.getResponseHeaders().set("Content-Type",tipo+"; charset=utf-8");
        e.getResponseHeaders().set("Cache-Control","no-store");
        e.getResponseHeaders().set("X-Content-Type-Options","nosniff");
        e.sendResponseHeaders(status,bytes.length);
        e.getResponseBody().write(bytes);
    }
}

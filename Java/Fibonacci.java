import java.util.Arrays;
public class Fibonacci {
    // Mesma sequência da entrega 1, agora retornada para a interface.
    public static long[] gerar(int n) {
        long[] resultado = new long[n];
        long primeiro = 0, segundo = 1;
        resultado[0] = primeiro;
        resultado[1] = segundo;
        for (int i = 2; i < n; i++) {
            long proximo = primeiro + segundo;
            resultado[i] = proximo;
            primeiro = segundo;
            segundo = proximo;
        }
        return resultado;
    }
    public static void main(String[] args) {
        System.out.println(Arrays.toString(gerar(10)));
    }
}

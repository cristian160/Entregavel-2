# Entregável 2 — Algoritmos em Java e JavaScript

Aplicação web de Cristian Henrique, baseada nos algoritmos da atividade 1:
https://github.com/cristian160/Entreg-vel-1---Algoritmos

## Execução nas duas linguagens

A interface permite selecionar **JavaScript** ou **Java** para executar os seis algoritmos: Número Primo, Somatório, Fibonacci, MDC, QuickSort e Contagem.

- JavaScript: a página chama as funções de `Web/algoritmos.js` no navegador.
- Java: a página envia os valores por HTTP para `Servidor.java`, que chama a classe Java correspondente e devolve o resultado em JSON. O cálculo não é simulado em JavaScript.
- O servidor também entrega o HTML, o CSS e o JavaScript na mesma origem.
- Cada execução Java escreve `[JAVA] nome-do-algoritmo executado.` no terminal.
- A opção “Ver código do algoritmo” acompanha a linguagem selecionada.

## 1. Preparar o VS Code

1. Extraia o ZIP inteiro. Abra a pasta `Entregavel-2` em **Arquivo > Abrir Pasta** no VS Code. Essa pasta deve conter `Java`, `Web`, `iniciar.bat` e este README.
2. Tenha um **JDK 21** instalado. O código é compatível com Java 17 ou superior.
3. Para editar e depurar Java, instale a extensão **Extension Pack for Java**, da Microsoft, no VS Code.
4. Abra **Terminal > Novo Terminal** e confira:

```powershell
java -version
javac -version
```

Ambos devem mostrar a versão instalada. Se `javac` não for reconhecido, configure o JDK no PATH e reabra o VS Code. JRE sozinho não contém o compilador.

Referência de configuração: https://code.visualstudio.com/docs/java/java-tutorial

## 2. Iniciar no Windows

No terminal do VS Code, dentro da pasta `Entregavel-2`, execute:

```powershell
.\iniciar.bat
```

O script compila todos os arquivos de `Java` na pasta `bin` e inicia o servidor.

Abra **http://127.0.0.1:8080** no navegador. Mantenha o terminal aberto.
Escolha um algoritmo, a linguagem, preencha os valores e clique em **Executar algoritmo**.

**Nesta versão, use o endereço acima. Abrir index.html por duplo clique ou usar Live Server não inicia o servidor Java.**

Alternativa manual, uma linha por vez:

```powershell
javac -encoding UTF-8 -d bin Java/*.java
java -cp bin Servidor
```

Para macOS/Linux:

```sh
sh iniciar.sh
```

Para parar o servidor, pressione Ctrl+C no terminal.
Se editar uma classe Java, pare e execute `iniciar.bat` novamente para recompilar. Para editar HTML/CSS/JS, salve e atualize o navegador.

## 3. Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| Java/NumeroPrimo.java | Verificação de número primo |
| Java/Somatorio.java | Soma dos valores |
| Java/Fibonacci.java | Geração da sequência |
| Java/MDC.java | Algoritmo de Euclides |
| Java/QuickSort.java | Ordenação com pivô |
| Java/Contagem.java | Contagem dos elementos no intervalo |
| Java/Servidor.java | Servidor HTTP, validação e chamadas às classes |
| Web/index.html | Formulário e seletor de linguagem |
| Web/style.css | Aparência e layout responsivo |
| Web/algoritmos.js | Seis implementações JavaScript |
| Web/app.js | Eventos, validação, requisições e apresentação dos resultados |
| .vscode/launch.json | Configuração para iniciar/depurar pelo VS Code |
| iniciar.bat | Compilação e inicialização no Windows |
| iniciar.sh | Compilação e inicialização no macOS/Linux |

Não é necessário Maven, Spring, npm, Node.js nem banco de dados.

## 4. Integração com a entrega 1

As classes NumeroPrimo, MDC, QuickSort e Contagem foram reaproveitadas da entrega 1. Somatorio passou a acumular e retornar `long`, mantendo a lógica do laço. Fibonacci foi encapsulado em `gerar`, retornando um vetor `long[]`, mantendo a sequência iniciada em 0 e 1. Esses ajustes permitem que o servidor receba o resultado e evitam estouro de `int`.

As funções JavaScript originais foram reaproveitadas; o arquivo original de somatório JS estava vazio e foi completado com a mesma lógica da versão Java. Os exemplos de terminal de Java continuam disponíveis nos métodos `main` de cada classe.

## 5. Conferência nas duas linguagens

Execute cada linha da tabela uma vez em JavaScript e outra em Java:

| Algoritmo | Entrada | Resultado esperado |
| --- | --- | --- |
| Primo | 17 | É primo |
| Primo | 1 | Não é primo |
| Somatório | 10, 20, 30, 40 | 100 |
| Somatório | 1000000000, 1000000000, 1000000000 | 3000000000 |
| Fibonacci | 10 | 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 |
| MDC | 48 e 18 | 6 |
| QuickSort | 10, 7, 8, 9, 1, 5 | 1, 5, 7, 8, 9, 10 |
| Contagem | 2, 5, 3, 8, 4, 1; N=6 | 4 |

Limites iguais nas duas linguagens: listas com até 500 inteiros de −1 bilhão a 1 bilhão, Fibonacci de 2 a 78 termos, primo de 1 a 1 milhão e MDC com inteiros não negativos até 1 bilhão. MDC(0,0) é rejeitado. Contagem usa o primeiro elemento como limite inferior e N como superior, inclusive. Repetições contam e intervalo invertido retorna zero.

## 6. Gravar o vídeo de depuração

Use câmera mostrando você e captura da tela do VS Code, conforme o enunciado. Sugestão: `Java/Contagem.java`.

1. Em Executar e Depurar, selecione **Depurar Contagem (vídeo)**.
2. Coloque um breakpoint na chamada `int resultado = contar(dados, n);`, no `main`, e pressione F5.
3. Com a execução pausada antes da chamada, abra **Console de Depuração / Debug Console** e execute `n = 8`. Execute `dados[1] = 7` para demonstrar alteração de um elemento do vetor. As alterações valem apenas para essa execução.
4. Pressione F11 (**Step Into**) para entrar em `contar`, sem breakpoint dentro da função.
5. Pressione F10 (**Step Over**) para acompanhar a função passo a passo e observar `quantidade`.
6. Para a demonstração do breakpoint condicional, crie um breakpoint em `quantidade++;`, abra **Editar Breakpoint**, selecione expressão e informe `valor == 4`. Continue com F5. Ele deve parar apenas quando esse valor estiver sendo contado.

Para depurar Java chamado pela página, inicie a configuração **Servidor Java + interface Web** com F5 (sem outro servidor já aberto), coloque um breakpoint na função Java desejada e execute o algoritmo em Java na página. A página aguarda por até 10 segundos; se demorar mais no debug, mostrará um erro de tempo limite, mas você pode continuar a depuração no VS Code.

## 7. Publicar como Entregavel-2 no GitHub

Se ainda não criou o repositório, crie um repositório vazio chamado `Entregavel-2` na conta `cristian160`. Se o professor precisa acessar sem convite, escolha Public. Não adicione README online, pois este projeto já inclui um.

No terminal, na pasta que contém este README, execute uma linha por vez:

```sh
git init
git add .
git commit -m "Entregavel 2: interface web com Java e JavaScript"
git branch -M main
git remote add origin https://github.com/cristian160/Entregavel-2.git
git push -u origin main
```

Se pedir autenticação, entre na sua conta. Se pedir identidade no commit, configure `git config user.name "Seu nome"` e `git config user.email "Seu email do GitHub"`, e repita o commit.

Se você JÁ publicou a versão anterior: copie os arquivos deste ZIP para a pasta local do repositório existente, preservando `.git`. A raiz deve conter `Java`, `Web` e `iniciar.bat`. Arquivos antigos da interface na raiz podem ser removidos após confirmar que suas cópias atualizadas estão em `Web`. Não rode `git init` ou `git remote add` novamente. Use:

```sh
git add .
git commit -m "Integra os algoritmos Java ao front-end"
git push
```

A pasta `bin` e os arquivos `.class` são ignorados: envie o código-fonte.
Link do repositório após publicar: https://github.com/cristian160/Entregavel-2
Adicione aqui o link real do seu vídeo quando terminar de gravá-lo.

O GitHub armazena os arquivos. GitHub Pages não executa o servidor Java; o professor deve baixar o projeto e iniciá-lo com o JDK, ou seria necessário contratar/configurar uma hospedagem compatível com Java para execução online.

## Problemas comuns

- **Porta ocupada / Address already in use:** encerre outra instância do servidor com Ctrl+C. Alternativa: `java -cp bin Servidor 8081` e abra http://127.0.0.1:8081.
- **Não foi possível acessar o Java:** mantenha o servidor aberto e acesse a página pelo endereço exibido no terminal.
- **Arquivo não encontrado:** abra a pasta completa Entregavel-2, não somente Java ou Web.
- **Mudança Java não aparece:** reinicie pelo script para recompilar.
- **Breakpoint não para:** inicie pelo F5 com a configuração Java, não apenas pelo script do terminal.

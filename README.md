# Entregável 2 — Aplicação Web de Algoritmos

**Autor:** Cristian Henrique

## Objetivo

Desenvolver uma aplicação com interface web para acessar e executar os algoritmos implementados na atividade 1, utilizando Java e JavaScript.

## Tecnologias utilizadas

- HTML: estrutura da interface.
- CSS: estilização e layout responsivo.
- JavaScript: interação com a página e execução dos algoritmos no navegador.
- Java: servidor HTTP e execução dos algoritmos no servidor local.

## Algoritmos implementados

Os seis algoritmos estão disponíveis nas duas linguagens:

| Algoritmo | Função |
|---|---|
| Número primo | Verifica se um número inteiro positivo é primo. |
| Somatório | Calcula a soma dos valores informados. |
| Fibonacci | Gera a quantidade solicitada de termos da sequência, começando em 0 e 1. |
| MDC | Calcula o máximo divisor comum de dois números pelo algoritmo de Euclides. |
| QuickSort | Ordena os valores de um vetor em ordem crescente. |
| Contagem | Conta os elementos do vetor entre seu primeiro valor e o limite N, incluindo os extremos. |

## Funcionamento

A interface permite escolher o algoritmo, selecionar a linguagem e informar os valores de entrada.

- **JavaScript:** os cálculos são executados diretamente no navegador.
- **Java:** a interface envia uma requisição ao servidor local, que executa a classe Java correspondente e retorna o resultado em JSON.

A aplicação também valida as entradas e permite visualizar o código do algoritmo na linguagem selecionada.

## Estrutura do projeto

| Arquivo ou pasta | Conteúdo |
|---|---|
| `Java/` | Classes dos algoritmos e servidor HTTP. |
| `Web/` | Interface HTML, CSS e arquivos JavaScript. |
| `.vscode/` | Configurações de execução e depuração no VS Code. |
| `iniciar.bat` | Script de compilação e inicialização para Windows. |
| `iniciar.sh` | Script de compilação e inicialização para Linux e macOS. |

## Como executar

### Requisitos

- JDK 17 ou superior, com os comandos `java` e `javac` disponíveis no terminal.
- Navegador atualizado.

Não é necessário instalar bibliotecas externas, Maven ou Node.js.

### Windows

1. Baixe ou clone o repositório.
2. Abra um terminal na pasta que contém `iniciar.bat`.
3. Execute:

```powershell
.\iniciar.bat
```

### Linux e macOS

Abra um terminal na pasta que contém `iniciar.sh` e execute:

```sh
sh iniciar.sh
```

### Acessar a aplicação

Com o servidor em execução, abra:

http://127.0.0.1:8080

Selecione um algoritmo, escolha Java ou JavaScript, informe os valores e clique em **Executar algoritmo**.

Mantenha o terminal aberto durante o uso. Para encerrar o servidor, pressione **Ctrl + C**.

A execução em Java exige o servidor ativo. Abrir somente o arquivo HTML ou utilizar GitHub Pages não inicia o servidor Java.

## Exemplos de execução

| Algoritmo | Entrada | Resultado esperado |
|---|---|---|
| Número primo | `17` | É primo |
| Somatório | `10, 20, 30, 40` | `100` |
| Fibonacci | `10` termos | `0, 1, 1, 2, 3, 5, 8, 13, 21, 34` |
| MDC | `48` e `18` | `6` |
| QuickSort | `10, 7, 8, 9, 1, 5` | `1, 5, 7, 8, 9, 10` |
| Contagem | Vetor `2, 5, 3, 8, 4, 1` e limite `6` | `4` |

Os resultados esperados são os mesmos nas duas linguagens.

## Vídeo de depuração

**Link:** inserir o link do vídeo.

## Atividade 1

Repositório com os códigos da primeira atividade:

https://github.com/cristian160/Entreg-vel-1---Algoritmos

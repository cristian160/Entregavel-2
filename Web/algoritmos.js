// Funções do repositório original; somatório portado de Java e Fibonacci encapsulado.

function ehPrimo(numero) {
    if (numero <= 1) {
        return false;
    }

    for (let i = 2; i < numero; i++) {
        if (numero % i === 0) {
            return false;
        }
    }

    return true;
}

function calcularMDC(a, b) {
    while (b !== 0) {
        let resto = a % b;

        a = b;
        b = resto;
    }

    return a;
}

function quickSort(vetor) {
    if (vetor.length <= 1) {
        return vetor;
    }

    let pivo = vetor[0];

    let menores = [];
    let maiores = [];

    for (let i = 1; i < vetor.length; i++) {
        if (vetor[i] <= pivo) {
            menores.push(vetor[i]);
        } else {
            maiores.push(vetor[i]);
        }
    }

    return [
        ...quickSort(menores),
        pivo,
        ...quickSort(maiores)
    ];
}

function contar(dados, n) {
    let primeiro = dados[0];

    let quantidade = 0;

    for (let valor of dados) {
        if (valor >= primeiro && valor <= n) {
            quantidade++;
        }
    }

    return quantidade;
}

function calcularSomatorio(numeros) {
    let soma = 0;
    for (let numero of numeros) {
        soma = soma + numero;
    }
    return soma;
}

function fibonacci(n) {
    let primeiro = 0;
    let segundo = 1;
    let resultado = [primeiro, segundo];
    for (let i = 2; i < n; i++) {
        let proximo = primeiro + segundo;
        resultado.push(proximo);
        primeiro = segundo;
        segundo = proximo;
    }
    return resultado;
}

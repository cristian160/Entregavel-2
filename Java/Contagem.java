public class Contagem {

    public static int contar(
        int[] dados,
        int n
    ) {

        int primeiro = dados[0];

        int quantidade = 0;

        for (int valor : dados) {

            if (
                valor >= primeiro &&
                valor <= n
            ) {

                quantidade++;
            }
        }

        return quantidade;
    }

    public static void main(String[] args) {

        int[] dados = {
            2,
            5,
            3,
            8,
            4,
            1
        };

        int n = 6;

        int resultado = contar(dados, n);

        System.out.println(
            "Quantidade de valores: " + resultado
        );
    }
}
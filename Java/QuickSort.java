import java.util.Arrays;

public class QuickSort {

    public static void quickSort(
        int[] vetor,
        int inicio,
        int fim
    ) {

        if (inicio < fim) {

            int posicaoPivo = particionar(
                vetor,
                inicio,
                fim
            );

            quickSort(
                vetor,
                inicio,
                posicaoPivo - 1
            );

            quickSort(
                vetor,
                posicaoPivo + 1,
                fim
            );
        }
    }

    public static int particionar(
        int[] vetor,
        int inicio,
        int fim
    ) {

        int pivo = vetor[fim];

        int i = inicio - 1;

        for (int j = inicio; j < fim; j++) {

            if (vetor[j] <= pivo) {

                i++;

                int auxiliar = vetor[i];

                vetor[i] = vetor[j];

                vetor[j] = auxiliar;
            }
        }

        int auxiliar = vetor[i + 1];

        vetor[i + 1] = vetor[fim];

        vetor[fim] = auxiliar;

        return i + 1;
    }

    public static void main(String[] args) {

        int[] vetor = {
            10,
            7,
            8,
            9,
            1,
            5
        };

        System.out.println(
            "Antes: " + Arrays.toString(vetor)
        );

        quickSort(
            vetor,
            0,
            vetor.length - 1
        );

        System.out.println(
            "Depois: " + Arrays.toString(vetor)
        );
    }
}
public class MDC {

    public static int calcularMDC(int a, int b) {

        while (b != 0) {

            int resto = a % b;

            a = b;
            b = resto;
        }

        return a;
    }

    public static void main(String[] args) {

        int a = 48;
        int b = 18;

        int resultado = calcularMDC(a, b);

        System.out.println(
            "MDC de " + a + " e " + b + ": " + resultado
        );
    }
}
namespace ReelComponent {
    export class ReelConfig {
        /**
         * Кол-во слотов на баране
         */
        public static readonly ROWS = 3;

        public static readonly COLS = 5;
        /**
         * Размеры символа на барабане.
         * @type {{width: number; height: number}}
         */
        public static readonly SYMBOL_SIZE = {
            width: 228,
            height: 188
        };
        /**
         * Символы, которые при появлении бликуют
         */
        public static readonly BLINKING_SYMBOLS = [0];

    }
}

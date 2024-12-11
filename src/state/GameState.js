//ENUM
export class GameState {
    static #_MENU = 0;
    static #_WATER_FLOWING = 1;
    static #_GAME_OVER = 2;
    static #_WON = 3;
    static #_PLAYING = 4;
    static #_size = 5;

    static get MENU() { return this.#_MENU; }
    static get WATER_FLOWING() { return this.#_WATER_FLOWING; }
    static get GAME_OVER() { return this.#_GAME_OVER; }
    static get WON() { return this.#_WON; }
    static get PLAYING() { return this.#_PLAYING; }

    static get size() { return this.#_size; }
}
//ENUM
export class WaterFlowing {
    static #_LEFT = 0;
    static #_RIGHT = 1;
    static #_UP = 2;
    static #_DOWN = 3;
    static #_size = 4;

    static get LEFT() { return this.#_LEFT; }
    static get RIGHT() { return this.#_RIGHT; }
    static get UP() { return this.#_UP; }
    static get DOWN() { return this.#_DOWN; }

    static get size() { return this.#_size; }
}
//ENUM
export class PipeHolder {
    static #_CONVEYOR = 0;
    static #_BOARD = 1;
    static #_size = 2;

    static get CONVEYOR() { return this.#_CONVEYOR; }
    static get BOARD() { return this.#_BOARD; }

    static get size() { return this.#_size; }
}
import Phaser from 'phaser';

export class Button {

    DEFAULT_TEXT_STYLE = {
        fontSize: '32px',
        fill: '#000000'
    };
    DEFAULT_ON_POINTER_OVER_STYLE = {
        fill: '#FFFFFF'
    };
    DEFAULT_ORIGIN = [0.5,0.5];
    gameObject = null;
    scene = null;
    text = null;
    textStyle = null;
    origin = null;
    onPointerOverStyle = null;
    #position = [0,0];

    set position(newPosition) {
        this.#position = newPosition;
    }
    get position () {
        return this.#position;
    }

    constructor (scene, text, position, textStyle, origin) {
        this.scene = scene;
        this.text = text;
        this.position = [position[0], position[1]];
        if (textStyle == null) this.textStyle = this.DEFAULT_TEXT_STYLE
        else this.textStyle = textStyle;
        if (origin == null) this.origin = this.DEFAULT_ORIGIN;
        else this.origin = [origin[0],origin[1]];

        this.onPointerOverStyle = this.DEFAULT_ON_POINTER_OVER_STYLE;

        this.createButton();
    }

    createButton () {
        this.gameObject = this.scene.add.text(this.position[0], this.position[1], this.text, this.textStyle)
        .setOrigin(...this.origin)
        .setInteractive();
        
        this.setupEvents();
    }   

    setupEvents() {
        this.gameObject.on('pointerover', () => {
            this.gameObject.setStyle(this.onPointerOverStyle);
        })
        .on('pointerout', () => {
            this.gameObject.setStyle( this.textStyle);
        })
    }

    addOnClick(onClickFunction) {
        if (onClickFunction == null) return;
        
        this.gameObject.on('pointerdown', onClickFunction);
    }
}
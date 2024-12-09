import Phaser from 'phaser';

export class Cell extends Phaser.GameObjects.Sprite {
    matrixPosition = null;
    localPosition = null;
    pipe = null;

    constructor(scene, position, texture, matrixPosition) {
        if (position == null) return;

        super(scene, position[0], position[1], texture, null)
        .setOrigin(0)
        .setInteractive();

        this.localPosition = [...position];
        this.matrixPosition = matrixPosition;
        
        this.setupEvents();
    }

    setupEvents() {
        this.on('pointerdown', this.onClick);
    }

    onClick() {
        this.scene.events.emit('cellClicked', this);
    }
}
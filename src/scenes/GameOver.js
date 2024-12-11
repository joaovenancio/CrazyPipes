import { Scene } from 'phaser';

export class GameOver extends Scene
{
    gameplayConfig = null;

    constructor ()
    {
        super('GameOver');
    }

    preload() {
        this.loadGlobalVariables();
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(this.game.config.width/2, this.game.config.height/2, 'background').setAlpha(0.5);

        this.add.text(this.game.config.width/2, this.game.config.height/2, 'Game Over: ' + this.gameplayConfig.score, {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {


            this.scene.start('MainMenu');

        });
    }

    loadGlobalVariables() {
        
        this.gameplayConfig = this.registry.get('gameplaySettings');
        this.screenCenter = this.registry.get('screenCenter');

    }
}

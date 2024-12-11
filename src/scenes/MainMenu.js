import { Scene } from 'phaser';
import { Button } from '../interface_elements/Button';

export class MainMenu extends Scene
{
    screenCenter = null;
    fontSize = '70px';
    textColor = '#000000';

    constructor () {
        super('MainMenu');
    }


    init() {
        
    }

    preload () {
        this.loadGlobalVariables();
    }

    create () {   
        this.setupTitle();
        this.setupButtons();
    }


    setupButtons() {
        let textStyle = {fontSize: this.fontSize, fill: this.textColor}
        let buttonPosition = [...this.screenCenter];
        buttonPosition[1] += 50;
        let button = new Button(this, 'START', buttonPosition, textStyle, null);
        button.addOnClick(this.startGame.bind(this));
    }

    setupTitle() {
        let textStyle = {fontSize: '100px', fill: this.textColor, stroke: '#FFFFFF', strokeThickness: 8, align: 'center', fontFamily: 'Arial Black'};
        let buttonPosition = [...this.screenCenter];
        buttonPosition[1] -= 80;

        this.add.text(buttonPosition[0], buttonPosition[1], 'CRAZY PIPES!', textStyle)
        .setOrigin(0.5);
    }

    loadGlobalVariables() {
        
        this.gameplayConfig = this.registry.get('gameplaySettings');
        this.screenCenter = this.registry.get('screenCenter');

    }
    
    startGame() {
        console.log('clikc');
        this.scene.start('Game');
    }

}

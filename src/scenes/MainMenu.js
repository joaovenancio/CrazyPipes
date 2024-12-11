import { Scene } from 'phaser';
import { Button } from '../interface_elements/Button';
import { Cell } from '../board/Cell';
import { Board } from '../board/Board';
import { Pipe } from '../pipe/Pipe';
import { PipeManager, PIPES } from '../pipe/PipeManager';
import { PipeHolder } from '../pipe/PipeHolder';
import { SinglyLinkedList } from '../data_structures/SinglyLinkedList';
import { Conveyor } from '../conveyour/Conveyor';
import { Timer } from '../timer/Timer';
import { GameState } from '../state/GameState';

export class MainMenu extends Scene
{
    screenCenter = null;
    fontSize = '70px';
    textColor = '#000000';

    constructor ()
    {
        super('MainMenu');
    }


    init() {
        
    }

    preload ()
    {
        this.loadGlobalVariables();
    }

    create ()
    {   
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
        let textStyle = {fontSize: '100px', fill: this.textColor};
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

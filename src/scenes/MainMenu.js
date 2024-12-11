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

    }

    loadGlobalVariables() {
        
        this.gameplayConfig = this.registry.get('gameplaySettings');
        this.screenCenter = this.registry.get('screenCenter');

        this.conveyorY = this.conveyorY * this.gameplayConfig.board.scale
        this.gameState = this.gameplayConfig.state;

    }
    
}

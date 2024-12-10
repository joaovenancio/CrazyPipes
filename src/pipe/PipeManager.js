import Phaser from 'phaser'
import { Pipe } from './Pipe';
import { PipeHolder } from './PipeHolder';
import { SinglyLinkedList } from '../data_structures/SinglyLinkedList';


export const PIPES = {
    SRAIGHT_LR: {
        isWaterAllowed : {
            up : false,
            down : false,
            left : true,
            right : true
        },
        textureKey : 'pipeStraight',
        textureIndex : 0,
        rotation : 90
    },
    SRAIGHT_UD: {
        isWaterAllowed : {
            up : true,
            down : true,
            left : false,
            right : false
        }
    },
    CURVED: {
        
    },
    CROSS: {

    },
    START: {

    }
}

export class PipeManager extends Phaser.Physics.Arcade.Group {
    
    gameplayConfig = null;
    nextPipe = null;
    pipesOnBoard = new SinglyLinkedList ();
    conveyorPipes = new SinglyLinkedList ();
    static abra = 3;
    conveyorFirst = null;
    conveyorLast = null;
    
    constructor (scene, groupConfig, gameplayConfig) {

        super(scene.physics.world, scene, null, groupConfig);

        this.gameplayConfig = gameplayConfig;

    }

    conveyorCreated = false;

    createPipe(pipeType, position, typeOfPipeHolder) {

        let newPipe = new Pipe(this.scene, position, pipeType);
        newPipe.setOrigin(0);

        this.add(newPipe, true);
        
        if (typeOfPipeHolder == null) return newPipe;

        switch  (typeOfPipeHolder) {
            case PipeHolder.CONVEYOR:
                this.addToConveyor(newPipe);
                break;
            case PipeHolder.BOARD:
                this.addToBoard(newPipe); //TO-DO
                break;
        }
        
        return newPipe;

    }

    invertConveyorPipesList () {

        let pipe = null;
        const pipesListInverted = new SinglyLinkedList();

        while ( this.conveyorPipes.length > 0) {
            pipe = this.conveyorPipes.pop().val;
            pipesListInverted.push(pipe);
        }
        
        this.conveyorPipes = pipesListInverted;
        
    }

    addToConveyor(pipe) {

        if (this.conveyorPipes.length >= this.gameplayConfig.board.qtyLines) {
            console.warn('PipeManager -> addToConveyor(pipe): Conveyour is full. Returning only the pipe');
            return pipe;
        }

        this.conveyorPipes.push(pipe);
        
    }

    updatePipesInConveyor() {
//        let pipe = this.createPipe(PIPES.SRAIGHT_LR, [0,0] , PipeHolder.CONVEYOR);
        
        let pipes = this.conveyorPipes.toArray();
        
        let pipe = this.conveyorPipes.last();
        pipe.moveTo( [this.gameplayConfig.conveyor.pipePositions[pipes.length-1][0], this.gameplayConfig.conveyor.pipePositions[pipes.length-1][1]], 600);


        //pipe.moveTo( [...this.gameplayConfig.conveyor.pipePositions[0]], 600);

        let currentPipe = this.gameplayConfig.board.qtyLines-1;
        for (let i = 0; i < pipes.length; i++) {
            let position = this.gameplayConfig.conveyor.pipePositions[i];
            if (position == null) continue;
            pipes[currentPipe].moveTo( [position[0], position[1]], 600);
            currentPipe--;
        }

       // return pipe;
    }

    addToBoard(pipe) {
        
    }

    getFirstPipe() {
        //let pipe = this.pipesOnConveyor.get(this.gameplayConfig.board.qtyLines-1);
        var pipeMan = this.conveyorPipes.first();
        console.log(this.conveyorPipes);

        pipeMan.moveTo([pipeMan.x,pipeMan.y + 500], 4000);
        
        this.conveyorPipes.shift(0);

        return pipeMan;
    }



}
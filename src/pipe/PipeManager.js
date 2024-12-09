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
    pipesOnConveyor = new SinglyLinkedList ();
    static abra = 3;
    conveyorFirst = null;
    conveyorLast = null;
    
    constructor (scene, groupConfig, gameplayConfig) {
        super(scene.physics.world, scene, null, groupConfig);

        this.gameplayConfig = gameplayConfig;
        

    }

    conveyorCreated = false;

    createPipe(pipeType, position, pipeHolder) {

        let pipe = new Pipe(this.scene, position, pipeType);
        //pipe.scale = this.gameplayConfig.board.scale ;
        pipe.setOrigin(0);

        this.add(pipe, true);

        //console.log(this.children.size);
        
        if (pipeHolder == null) return pipe;

        switch  (pipeHolder) {
            case PipeHolder.CONVEYOR:
                this.addToConveyor(pipe);
                break;
            case PipeHolder.BOARD:
                this.addToBoard(pipe);
                break;
        }
        
        return pipe;
    }

    addToConveyor(pipe) {
        if (this.pipesOnConveyor.length >= this.gameplayConfig.board.qtyLines) {
            console.warn('PipeManager -> addToConveyor(pipe): Conveyour is full. Returning only the pipe');
            return pipe;
        }

        this.pipesOnConveyor.push(pipe);
        
    }

    updatePipesInConveyor() {
//        let pipe = this.createPipe(PIPES.SRAIGHT_LR, [0,0] , PipeHolder.CONVEYOR);
        
        let pipes = this.pipesOnConveyor.toArray();
        
        let pipe = this.pipesOnConveyor.last();
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
        var pipeMan = this.pipesOnConveyor.first();
        console.log(this.pipesOnConveyor);

        pipeMan.moveTo([pipeMan.x,pipeMan.y + 500], 4000);
        
        this.pipesOnConveyor.shift(0);

        return pipeMan;
    }



}
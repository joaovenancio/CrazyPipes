import Phaser from 'phaser'
import { Pipe } from './Pipe';

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

    }
}

export class PipeManager extends Phaser.Physics.Arcade.Group {
    
    gameplayConfig = null;
    nextPipe = null;
    pipesOnBoard = [];
    pipesOnConveyor = [];
    
    constructor (scene, groupConfig, gameplayConfig) {
        super(scene.physics.world, scene, null, groupConfig);

        this.gameplayConfig = gameplayConfig;
        

    }

    createPipe(pipeType, position) {

        let pipe = new Pipe(this.scene, position, pipeType);
        //pipe.scale = this.gameplayConfig.board.scale;
        pipe.setOrigin(0);

        this.add(pipe, true);

        console.log(this.children.size);

        return pipe;
    }


    movePipeTo(pipe, position, miliSeconds) {
        pipe.moveTo(position, miliSeconds);
    }

}
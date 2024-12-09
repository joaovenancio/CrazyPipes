import {Sprite} from 'phaser'

export class Pipe extends Phaser.GameObjects.Sprite {
    
    isWaterAllowed = {
        up : false,
        down : false,
        left : false,
        right : false
    }

    isWaterFlowing = false;



    constructor (scene, position, pipeConfig) {
        console.log(pipeConfig.textureKey);

        super(scene, position[0], position[1], pipeConfig.textureKey, pipeConfig.textureIndex);
        //console.log(Number.isInteger(test));
        this.isWaterAllowed = pipeConfig.isWaterAllowed;

        this.isWaterFlowing = false;

        console.log(this.x + ' | ' + this.y);

    }

  
}
import Phaser from 'phaser'
import { WaterFlowing } from './WaterFlowing';

const MOVE_FRAMES_PER_SECONDS = 60;

//This should be a base classe, for all the different types of pipes inheiret from it. It would make things so much more easier
export class Pipe extends Phaser.Physics.Arcade.Sprite {
    
    isWaterAllowed = {
        up : false,
        down : false,
        left : false,
        right : false
    }

    isWaterFlowing = false;
    isMoving = false;
    currentAnimationIndex = 0;
    moveToPosition = [0,0];
    moveDestinationTolerance = 0.5;
    cell = null;
    waterFlowing = null;
    pipeOrientation = '';
    pipeName = '';

    spritesheetAnimation = [];
    animationQtyFrames = 0;
    pipeConfig = null;

    physics = null;

    constructor (scene, position, pipeConfig) {
        //debugger
        super(scene, position[0], position[1], pipeConfig.textureKey, pipeConfig.textureIndex);

        this.physics = scene.physics;
        this.pipeConfig = pipeConfig;
        this.flipX = pipeConfig.flipX;
        this.flipY = pipeConfig.flipY;
        this.pipeName = pipeConfig.pipeName;
        //console.log(this.physics)
        //console.log(Number.isInteger(test));
        this.isWaterAllowed = {...pipeConfig.isWaterAllowed};
        this.pipeOrientation = pipeConfig.pipeOrientation;
        console.log(this.isWaterAllowed);

        this.spritesheetAnimation = pipeConfig.spritesheetAnimation;
        this.currentAnimationIndex = pipeConfig.textureIndex;
        this.waterFlowing = pipeConfig.waterFlowing;

        this.isWaterFlowing = false;

        //console.log(this.x + ' | ' + this.y);

        //this.addToUpdateList();
        //this.body.immovable = true;
    }

    preUpdate(delta, time) {
        super.preUpdate(delta, time);

        this.goTowardsPosition();
        
    }

    goTowardsPosition() {
        if (!this.isMoving) return;
        if (Phaser.Math.Distance.Between(this.x, this.y, ...this.moveToPosition) > this.moveDestinationTolerance) return;

        this.body.reset(this.x, this.y);
        this.isMoving = false;
        console.log('moving');
        this.scene.events.emit('pipeFinishedMoving', this)
    }

    moveTo(position, miliSeconds) {
        this.moveToPosition = position;
        this.isMoving = true;
        this.physics.moveTo(this, position[0], position[1] , MOVE_FRAMES_PER_SECONDS, miliSeconds);
    }

    startFlow() {
        this.isWaterFlowing = true;
        //
        if (this.pipeName === 'SRAIGHT_LR') {

            if (this.waterFlowing === WaterFlowing.LEFT) this.flipX = true;
            this.isWaterAllowed.left = false;
            this.isWaterAllowed.right = false;

        } 
        else if (this.pipeName === 'SRAIGHT_UD') {

            if (this.waterFlowing === WaterFlowing.DOWN) this.flipY = true;
            this.isWaterAllowed.up = false;
            this.isWaterAllowed.down = false;

        } 
        else if (this.pipeName === 'CURVE_LU') {
            
            if (this.waterFlowing === WaterFlowing.LEFT) {

                console.log('CHANGESSSSSSSSSSSSSSSSSSSSSSSSS');
                this.spritesheetAnimation = [8,13];
                this.currentAnimationIndex = 7;

            }

            this.isWaterAllowed.up = false;
            this.isWaterAllowed.left = false;

        } 
        else if (this.pipeName === 'CURVE_LD') {

            if (this.waterFlowing === WaterFlowing.LEFT) {

                this.spritesheetAnimation = [8,13];
                this.currentAnimationIndex = 7;


            }

            this.isWaterAllowed.down = false;
            this.isWaterAllowed.left = false;
            console.log("@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else if (this.pipeName === 'CURVE_RU') {
            if (this.waterFlowing === WaterFlowing.RIGHT) {

                this.spritesheetAnimation = [8,13];
                this.currentAnimationIndex = 7;


            }
        }
        else if (this.pipeName === 'CURVE_RD') {
            if (this.waterFlowing === WaterFlowing.RIGHT) {

                this.spritesheetAnimation = [8,13];
                this.currentAnimationIndex = 7;


            }
        }

        
        
    }

    flow() {
        this.currentAnimationIndex++;

        if (this.currentAnimationIndex > this.spritesheetAnimation[1]) return;

        this.setFrame(this.currentAnimationIndex);
        //Emit game over or next pipe (get points)
    }

  
}
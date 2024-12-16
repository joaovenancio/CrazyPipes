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
    };
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
        super(scene, position[0], position[1], pipeConfig.textureKey, pipeConfig.textureIndex);

        this.physics = scene.physics;
        this.pipeConfig = pipeConfig;
        this.flipX = pipeConfig.flipX;
        this.flipY = pipeConfig.flipY;
        this.pipeName = pipeConfig.pipeName;
        this.isWaterAllowed = {...pipeConfig.isWaterAllowed};
        this.pipeOrientation = pipeConfig.pipeOrientation;
        this.spritesheetAnimation = pipeConfig.spritesheetAnimation;
        this.currentAnimationIndex = pipeConfig.textureIndex;
        this.waterFlowing = pipeConfig.waterFlowing;
        this.isWaterFlowing = false;
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
        this.scene.events.emit('pipeFinishedMoving', this);
    }

    moveTo(position, miliSeconds) {
        this.moveToPosition = position;
        this.isMoving = true;
        this.physics.moveTo(this, position[0], position[1] , MOVE_FRAMES_PER_SECONDS, miliSeconds);
    }

    startFlow() {
        this.isWaterFlowing = true;
        
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
        else if (this.pipeName === 'CROSS') {
            if (this.isWaterAllowed.right && this.isWaterAllowed.left) {
                this.spritesheetAnimation = [14,20];
                this.currentAnimationIndex = 14;

                if (this.waterFlowing === WaterFlowing.UP) this.flipY = true;
                else this.flipY = false;

            }
            else if (this.isWaterAllowed.up && this.isWaterAllowed.down) {
                this.spritesheetAnimation = [0,6];
                this.currentAnimationIndex = 0;

                if (this.waterFlowing === WaterFlowing.LEFT) this.flipX = true;
                else this.flipX = false;
            }
            else if (this.waterFlowing === WaterFlowing.UP) {
                this.spritesheetAnimation = [7,13];
                this.currentAnimationIndex = 7;
                this.flipX = false;
                this.flipY = true;
            }
            else if (this.waterFlowing === WaterFlowing.DOWN) {
                this.spritesheetAnimation = [7,13];
                this.currentAnimationIndex = 7;
                this.flipX = false;
                this.flipY = false;
            }
            else if (this.waterFlowing === WaterFlowing.RIGHT) {
                this.spritesheetAnimation = [21,27];
                this.currentAnimationIndex = 21;
                this.flipX = true;
                this.flipY = false;
            }
            else if (this.waterFlowing === WaterFlowing.LEFT) {
                this.spritesheetAnimation = [21,27];
                this.currentAnimationIndex = 21;
                this.flipX = false;
                this.flipY = false;
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
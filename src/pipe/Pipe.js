import Phaser from 'phaser'

const MOVE_FRAMES_PER_SECONDS = 60;


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

    physics = null;

    constructor (scene, position, pipeConfig) {
        //debugger
        super(scene, position[0], position[1], pipeConfig.textureKey, pipeConfig.textureIndex);

        this.physics = scene.physics;
        //console.log(this.physics)
        //console.log(Number.isInteger(test));
        this.isWaterAllowed = pipeConfig.isWaterAllowed;

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
        //
    }

    flow() {
        //Emit game over or next pipe (get points)
    }

  
}
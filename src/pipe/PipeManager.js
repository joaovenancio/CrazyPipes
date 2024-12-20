import Phaser from 'phaser'
import { Pipe } from './Pipe';
import { PipeHolder } from './PipeHolder';
import { SinglyLinkedList } from '../data_structures/SinglyLinkedList';
import { WaterFlowing } from './WaterFlowing';


export const PIPES = {
    SRAIGHT_LR: {
        pipeOrientation : 'straight',
        pipeName : 'SRAIGHT_LR',
        isWaterAllowed : {
            up : false,
            down : false,
            left : true,
            right : true
        },
        waterFlowing : null,
        textureKey : 'pipeStraight',
        textureIndex : 0,
        spritesheetAnimation : [0,6],
        animationQtyFrames: 6,
    },
    SRAIGHT_UD: {
        pipeOrientation : 'straight',
        pipeName : 'SRAIGHT_UD',
        isWaterAllowed : {
            up : true,
            down : true,
            left : false,
            right : false
        },
        waterFlowing : null,
        textureKey : 'pipeStraightUD',
        textureIndex : 0,
        spritesheetAnimation : [0,6],
        animationQtyFrames: 6,
    },
    CURVE_LU: {
        pipeOrientation : 'curve',
        pipeName : 'CURVE_LU',
        isWaterAllowed : {
            up : true,
            down : false,
            left : true,
            right : false
        },
        waterFlowing : null,
        textureKey : 'pipeCurve',
        textureIndex : 0,
        spritesheetAnimation : [0,6],
        animationQtyFrames: 6,
    },
    CURVE_LD : {
        pipeOrientation : 'curve',
        pipeName : 'CURVE_LD',
        isWaterAllowed : {
            up : false,
            down : true,
            left : true,
            right : false
        },
        waterFlowing : null,
        textureKey : 'pipeCurve',
        textureIndex : 0,
        spritesheetAnimation : [0,6],
        animationQtyFrames: 6,
        flipX : false,
        flipY : true
    },
    CURVE_RU: {
        pipeOrientation : 'curve',
        pipeName : 'CURVE_RU',
        isWaterAllowed : {
            up : true,
            down : false,
            left : false,
            right : true
        },
        waterFlowing : null,
        textureKey : 'pipeCurve',
        textureIndex : 0,
        spritesheetAnimation : [0,6],
        animationQtyFrames: 6,
        flipX : true,
        flipY : false
    },
    CURVE_RD : {
        pipeOrientation : 'curve',
        pipeName : 'CURVE_RD',
        isWaterAllowed : {
            up : false,
            down : true,
            left : false,
            right : true
        },
        waterFlowing : null,
        textureKey : 'pipeCurve',
        textureIndex : 0,
        spritesheetAnimation : [0,6],
        animationQtyFrames: 6,
        flipX : true,
        flipY : true
    },
    CROSS: {
        pipeOrientation : 'cross',
        pipeName : 'CROSS',
        isWaterAllowed : {
            up : true,
            down : true,
            left : true,
            right : true
        },
        waterFlowing : null,
        textureKey : 'pipeCross',
        textureIndex : 0,
        spritesheetAnimation : [0,6],
        animationQtyFrames: 6,
        flipX : false,
        flipY : false
    },
    START_L: {
        isWaterAllowed : {
            up : false,
            down : false,
            left : true,
            right : false
        },
        waterFlowing : WaterFlowing.LEFT,
        textureKey : 'pipeStart',
        textureIndex : 14,
        spritesheetAnimation : [14,20],
        animationQtyFrames: 6
    },
    START_R: {
        isWaterAllowed : {
            up : false,
            down : false,
            left : false,
            right : true
        },
        waterFlowing : WaterFlowing.RIGHT,
        textureKey : 'pipeStart',
        textureIndex : 21,
        spritesheetAnimation : [21,28],
        animationQtyFrames: 6
    },
    START_U: {
        isWaterAllowed : {
            up : true,
            down : false,
            left : false,
            right : false
        },
        waterFlowing : WaterFlowing.UP,
        textureKey : 'pipeStart',
        textureIndex : 7,
        spritesheetAnimation : [7,13],
        animationQtyFrames: 6
    },
    START_D: {
        isWaterAllowed : {
            up : false,
            down : true,
            left : false,
            right : false
        },
        waterFlowing : WaterFlowing.DOWN,
        textureKey : 'pipeStart',
        textureIndex : 0,
        spritesheetAnimation : [0,6],
        animationQtyFrames: 6
    },
    length : 7
}

export class PipeManager extends Phaser.Physics.Arcade.Group {
    
    gameplayConfig = null;
    pipesOnBoard = new SinglyLinkedList ();
    conveyorPipes = new SinglyLinkedList ();
    static abra = 3;
    conveyorFirst = null;
    conveyorLast = null;
    currentPipe = null;
    conveyorCreated = false;
    pipeMovementOnConveyorSpeed = 600;
    
    constructor (scene, groupConfig, gameplayConfig) {
        super(scene.physics.world, scene, null, groupConfig);

        this.gameplayConfig = gameplayConfig;
    }


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

    getNextPipe(cells) {  //TO-DO
        let nextPipe = null;

        let currentMatrixPosition = this.currentPipe.cell.matrixPosition;
        let nextPosition = [...currentMatrixPosition];
        let currentFlowDirection = this.currentPipe.waterFlowing;

        switch (currentFlowDirection) {
            case WaterFlowing.RIGHT:
                nextPosition[1]++;
                break;

            case WaterFlowing.LEFT:
                nextPosition[1]--;
                break;

            case WaterFlowing.UP:
                nextPosition[0]--;
                break;

            case WaterFlowing.DOWN:
                nextPosition[0]++;
                break;
        }

        if ( cells[nextPosition[0]] == null ) return null;
        let nextCell = cells[nextPosition[0]][nextPosition[1]];

        if ( nextCell == null ) return null;
        nextPipe = nextCell.pipe;

        if ( nextPipe == null) return null;

        switch (currentFlowDirection) {
            case WaterFlowing.RIGHT:
                if (nextPipe.pipeOrientation === 'straight') {
                    if (this.setFlowWaterRight(nextPipe)) return nextPipe;
                } 
                else if (nextPipe.pipeOrientation === 'curve') {
                    if (!nextPipe.isWaterAllowed.left) return null;

                    if (nextPipe.pipeName === 'CURVE_LU') {
                        nextPipe.isWaterAllowed.left = false;
                        nextPipe.isWaterAllowed.up = false;
                        nextPipe.waterFlowing = WaterFlowing.UP;

                        return nextPipe;
                    } 
                    else if (nextPipe.pipeName === 'CURVE_LD') {
                        nextPipe.isWaterAllowed.left = false;
                        nextPipe.isWaterAllowed.down = false;
                        nextPipe.waterFlowing = WaterFlowing.DOWN;

                        return nextPipe;
                    }
                } 
                else if (nextPipe.pipeOrientation === 'cross') {
                    if (this.setFlowWaterRight(nextPipe)) return nextPipe;
                }
            break;

            case WaterFlowing.LEFT:
                if (nextPipe.pipeOrientation === 'straight') {
                    if (this.setFlowWaterLeft(nextPipe)) return nextPipe;
                } 
                else if (nextPipe.pipeOrientation === 'curve') {
                    if (!nextPipe.isWaterAllowed.right) return null;

                    if (nextPipe.pipeName === 'CURVE_RU') {
                        nextPipe.isWaterAllowed.right = false;
                        nextPipe.isWaterAllowed.up = false;
                        nextPipe.waterFlowing = WaterFlowing.UP;

                        return nextPipe;
                    } 
                    else if (nextPipe.pipeName === 'CURVE_RD') {
                        nextPipe.isWaterAllowed.right = false;
                        nextPipe.isWaterAllowed.down = false;
                        nextPipe.waterFlowing = WaterFlowing.DOWN;

                        return nextPipe;
                    }
                } 
                else if (nextPipe.pipeOrientation === 'cross') {
                    if (this.setFlowWaterLeft(nextPipe)) return nextPipe;
                }
                break;

                case WaterFlowing.UP:
                    if (nextPipe.pipeOrientation === 'straight') {
                        if (this.setFlowWaterUP(nextPipe)) return nextPipe;
                    } 
                    else if (nextPipe.pipeOrientation === 'curve') {
                        if (!nextPipe.isWaterAllowed.down) return null;

                        if (nextPipe.pipeName === 'CURVE_LD') {
                            nextPipe.isWaterAllowed.left = false;
                            nextPipe.isWaterAllowed.down = false;
                            nextPipe.waterFlowing = WaterFlowing.LEFT;
    
                            return nextPipe;
                        }
                        else if (nextPipe.pipeName === 'CURVE_RD') {
                            nextPipe.isWaterAllowed.right = false;
                            nextPipe.isWaterAllowed.down = false;
                            nextPipe.waterFlowing = WaterFlowing.RIGHT;
    
                            return nextPipe;
                        }
                    } 
                    else if (nextPipe.pipeOrientation === 'cross') {
                        if (this.setFlowWaterUP(nextPipe)) return nextPipe;
                    }
                break;

            case WaterFlowing.DOWN:
                if (nextPipe.pipeOrientation === 'straight') {
                    if (this.setFlowWaterDown(nextPipe)) return nextPipe;
                } 
                else if (nextPipe.pipeOrientation === 'curve') {
                    if (!nextPipe.isWaterAllowed.up) return null;
                    
                    if (nextPipe.pipeName === 'CURVE_LU') {
                        nextPipe.isWaterAllowed.right = false;
                        nextPipe.isWaterAllowed.up = false;
                        nextPipe.waterFlowing = WaterFlowing.LEFT;

                        return nextPipe;
                    } 
                    else if (nextPipe.pipeName === 'CURVE_RU') {
                        nextPipe.isWaterAllowed.right = false;
                        nextPipe.isWaterAllowed.up = false;
                        nextPipe.waterFlowing = WaterFlowing.RIGHT;

                        return nextPipe;
                    } 

                } 
                else if (nextPipe.pipeOrientation === 'cross') {
                    if (this.setFlowWaterDown(nextPipe)) return nextPipe;
                }
                break;
        }
        
        return null;
    }

    setFlowWaterUP(nextPipe) {
        if (! nextPipe.isWaterAllowed.down ) return false;

        nextPipe.isWaterAllowed.down = false;
        nextPipe.isWaterAllowed.up = false;
        nextPipe.waterFlowing = WaterFlowing.UP;

        return true;
    }

    setFlowWaterCurveUP(nextPipe) {
        if ( nextPipe.isWaterAllowed.left || nextPipe.isWaterAllowed.right ) {
            nextPipe.isWaterAllowed.left = false;
            nextPipe.isWaterAllowed.right = false;
            nextPipe.isWaterAllowed.up = false;
            nextPipe.waterFlowing = WaterFlowing.UP;

            return true;
        } 

        return false;
    }
    

    setFlowWaterLeft(nextPipe) {
        if (!nextPipe.isWaterAllowed.right) return false;

        nextPipe.isWaterAllowed.right = false;
        nextPipe.isWaterAllowed.left = false;
        nextPipe.waterFlowing = WaterFlowing.LEFT;
        
        return true;
    }

    setFlowWaterDown (nextPipe) {
        if (!nextPipe.isWaterAllowed.up) return false;

        nextPipe.isWaterAllowed.up = false;
        nextPipe.isWaterAllowed.down = false;
        nextPipe.waterFlowing = WaterFlowing.DOWN;

        return true;
    }

    setFlowWaterCurveDown (nextPipe) {
        if (!nextPipe.isWaterAllowed.left ||
            !nextPipe.isWaterAllowed.right
        ) return false;

        nextPipe.isWaterAllowed.down = false;
        nextPipe.waterFlowing = WaterFlowing.DOWN;

        if (nextPipe.isWaterAllowed.left) nextPipe.isWaterAllowed.left = false;
        else nextPipe.isWaterAllowed.right = false;

        return true;
    }

    setFlowWaterRight (nextPipe) {
        if (!nextPipe.isWaterAllowed.left) return false;

        nextPipe.isWaterAllowed.right = false;
        nextPipe.isWaterAllowed.left = false;
        nextPipe.waterFlowing = WaterFlowing.RIGHT;

        return true;
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
        let pipes = this.conveyorPipes.toArray();
        let pipe = this.conveyorPipes.last();
        pipe.moveTo( [this.gameplayConfig.conveyor.pipePositions[pipes.length-1][0], this.gameplayConfig.conveyor.pipePositions[pipes.length-1][1]], this.pipeMovementOnConveyorSpeed);

        let currentPipe = this.gameplayConfig.board.qtyLines-1;
        for (let i = 0; i < pipes.length; i++) {
            let position = this.gameplayConfig.conveyor.pipePositions[i];
            if (position == null) continue;
            pipes[currentPipe].moveTo( [position[0], position[1]], this.pipeMovementOnConveyorSpeed);
            currentPipe--;
        }
    }

    addToBoard(pipe) {
        
    }

    getFirstPipe() {
        var pipeMan = this.conveyorPipes.first();
        pipeMan.moveTo([pipeMan.x,pipeMan.y + 500], 4000);
        
        this.conveyorPipes.shift(0);

        return pipeMan;
    }
}
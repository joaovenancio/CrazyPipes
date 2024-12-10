import { Cell } from "./Cell";


export class Board {
    scene = null;
    size = [0,0];
    container = null; //Phaser.GameObjects.Container
    cells = [[]];
    gameplayConfig = null;

    constructor (scene, size, textureKey, cellHorizontalPadding, cellVerticalPadding, gameplayConfig) {
        this.scene = scene;
        this.size = [size[0], size[1]]
        this.cells = [[]];
        this.container = scene.add.container(0,0);
        this.gameplayConfig = gameplayConfig;
        
        this.container.scale = gameplayConfig.board.scale;


        this.setupCells(textureKey,cellHorizontalPadding,cellVerticalPadding);
        //let startingPosition = [image.width/2, image.height/2];
        
    }

    setupCells(textureKey,cellHorizontalPadding,cellVerticalPadding) {
        var startingPosition = [0,0]; //X,Y
        var position = [0,0]; //X,Y
        var horizontalPadding;
        var verticalPadding;
        var isFirstCell = true;
        
        for (var line = 0; line < this.size[0]; line++) {
            for (var column = 0; column < this.size[1]; column++) {

                var cell = new Cell(this.scene, position, textureKey, [line,column]);

                if (isFirstCell) {
                    horizontalPadding = cell.width + cellHorizontalPadding;
                    verticalPadding = cell.height + cellVerticalPadding;
                    isFirstCell = false;
                }

                this.container.add(cell, true);

                if (this.cells[line] == null) this.cells[line] = [];
                this.cells[line][column] = cell;    

                position[0]+= horizontalPadding;   
            }

            position[0] = startingPosition[0];
            position[1] += verticalPadding;
        }
    }

    centralize() {
        let screenCenter = this.scene.registry.get('screenCenter');
        let containerWidth = this.container.getBounds().width;
        let containerHeight = this.container.getBounds().height

        let newXPos = screenCenter[0] - containerWidth/2;
        let newYPos = screenCenter[1] - containerHeight/2;

        this.container.x = newXPos;
        this.container.y = newYPos + this.gameplayConfig.board.paddingY;

        this.gameplayConfig.board.y = this.container.y;
        this.gameplayConfig.board.x = this.container.x;
    }
}
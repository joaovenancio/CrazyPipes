import Phaser from 'phaser';

//conveyorContainer = this;

export class Conveyor extends Phaser.GameObjects.Container {

    gameplayConfig = null;
    conveyorQtyColumnsPerLine = 3; //Could retrieve spritesheet width and calculate it by dividing by its indivdual size
    tableSpriteIndex = 10;
    conveyorY = -8;
    //conveyorX = -128;

    constructor(scene, x, y, gameplayConfig) {

        super(scene, x, y);
        this.scene.add.existing(this);

        this.gameplayConfig = gameplayConfig;

    }

    render () {

        let conveyorPart = this.scene.add.sprite(0, 0, 'conveyor', 0);

        this.conveyorSpriteHeight = conveyorPart.height;
        this.conveyorSpriteWidth = conveyorPart.width;

        this.renderTop(conveyorPart, this.conveyorSpriteWidth);
        this.renderBody(conveyorPart, this.conveyorSpriteWidth, this.conveyorSpriteHeight);
        this.renderTable(conveyorPart,this.conveyorSpriteWidth, this.conveyorSpriteHeight);
        this.renderBottom(conveyorPart, this.conveyorSpriteWidth, this.conveyorSpriteHeight);

        this.setToDefaultPosition();

        this.updateConfigVariables();

        return this;

    }

    updateConfigVariables () {

        this.gameplayConfig.conveyor.conveyorSpriteWidth = this.conveyorSpriteWidth;
        this.gameplayConfig.conveyor.conveyorSpriteHeight = this.conveyorSpriteHeight

    }

    renderTop(conveyorPart, spriteWidht) {

        this.add(conveyorPart);

        for (let column = 1; column < this.conveyorQtyColumnsPerLine; column++) {

            let spriteLocationX = spriteWidht * column;

            conveyorPart = this.scene.add.sprite(spriteLocationX, 0, 'conveyor', column);

            this.add(conveyorPart);

        }

    }

    renderBody (conveyorPart, spriteWidht, spriteHeight) {

        const spriteIndexStart = this.conveyorQtyColumnsPerLine;

        for (let line = 0; line < this.gameplayConfig.board.qtyLines-1; line ++) {

            for (let column = 0; column < this.conveyorQtyColumnsPerLine; column++) {

                var spriteLocationX = spriteWidht * column;
                var spriteLocationY = spriteHeight * (line + 1);

                conveyorPart = this.scene.add.sprite(spriteLocationX, spriteLocationY, 'conveyor', spriteIndexStart + column);

                this.add(conveyorPart);

            }

        }

    }

    renderTable(conveyorPart, spriteWidht, spriteHeight) {

        let posY = spriteHeight * this.gameplayConfig.board.qtyLines;

        conveyorPart = this.scene.add.sprite(spriteWidht, posY , 'conveyor', this.tableSpriteIndex);

        this.add(conveyorPart);

    }

    renderBottom (conveyorPart, spriteWidht, spriteHeight) {

        const spriteIndexStart = this.conveyorQtyColumnsPerLine * 2;

        for (let column = 0; column < this.conveyorQtyColumnsPerLine; column++) {
            var spriteLocationX = spriteWidht * column;
            var spriteLocationY = spriteHeight * this.gameplayConfig.board.qtyLines;
            
            conveyorPart = this.scene.add.sprite(spriteLocationX, spriteLocationY, 'conveyor', spriteIndexStart + column);

            this.add(conveyorPart);

        }
        
    }


    setToDefaultPosition() {

        this.scale = this.gameplayConfig.board.scale;

        this.y = this.gameplayConfig.board.y + this.conveyorY;
        this.x = this.gameplayConfig.board.x - this.getBounds().width;

    }


}
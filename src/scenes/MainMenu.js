import { Scene } from 'phaser';
import { Button } from '../interface_elements/Button';
import { Cell } from '../board/Cell';
import { Board } from '../board/Board';
import { Pipe } from '../pipe/Pipe';
import { PipeManager, PIPES } from '../pipe/PipeManager';

export class MainMenu extends Scene
{
    gameplayConfig = null;
    conveyorX = -128;
    conveyorY = -8;
    conveyorContainer = null;
    conveyorQtyColumnsPerLine = 3; //Could retrieve spritesheet width and calculate it by dividing by its indivdual size
    tableSpriteIndex = 10;
    conveyorSpriteHeight = 0;
    conveyorSpriteWidth = 0;
    statusBarScale = 5;
    statusPositionX = 0;
    statusPositionY = -30;
    boardPositionX;
    board = null;
    screenCenter = null;
    backgroundBox = null;
    pipeManager = null;
    nextPipe = null;



    PIPE_MANAGER_CONFIG = {
        classType : Pipe,
        runChildUpdate : true
    }



    constructor ()
    {
        super('MainMenu');
    }





    init() {
        this.initializeGlobalEvents();
    }

    preload ()
    {
        this.loadVariables();
    }

    create ()
    {   
        this.setupBackground();
        //this.setupTexts();
        this.setupBoard();

        let boardBounds = this.board.container.getBounds();
        let boardScale = this.gameplayConfig.board.scale;
        this.backgroundBox.displayWidth = boardBounds.width + ((16 + 7) * boardScale);
        this.backgroundBox.displayHeight = boardBounds.height + ((16 + 16) * boardScale);

        this.setupConveyor();
        this.setupStatusBar();
        this.setupPipeManager();
        this.setupPipeQueue(); //TO-DO

        
        // let textStyle = {fontSize: this.fontSize, fill: this.textColor}
        // let button = new Button(this, 'This is a test', screenCenter, textStyle, null);
        // button.addOnClick();

        // this.input.once('pointerdown', () => {

        //     this.scene.start('Game');

        // });


        this.setupAudio();
        //this.sound.get('musicPookatori').play();
        //this.sound.get('musicHoliznaEncounter').play();

    }






    setupPipeQueue() {
        console.log('xai');
        
        let pipe = null;

        for (let line = 0; line < this.gameplayConfig.board.qtyLines; line++) {

            //let pipe = this.setupNewPipe([this.conveyorPartWidth, this.conveyorPartHeight * line]);

            let conveyourCenter = this.conveyorSpriteWidth/2;
            let conveyourLine =  (this.conveyorSpriteHeight * line) + (this.conveyorSpriteHeight/2) ;

            console.log(conveyourCenter);
            console.log(conveyourLine);

            pipe = this.setupNewPipe([conveyourCenter, conveyourLine]);
            //let pipe = this.setupNewPipe([16/2, 16 * line + (16/2)]);
            

            this.conveyorContainer.add(pipe, true);

            // this.board.container.add(pipe, true);


            //this.conveyorPartHeight

        }

        this.nextPipe = pipe;
    }

    setupAudio() {
        this.sound.add('musicHoliznaEncounter', {loop: true} );
        //this.sound.add('musicPookatori', {loop: true} );
    }

    setupPipeManager () {
        this.pipeManager = this.add.existing(new PipeManager(this, this.PIPE_MANAGER_CONFIG, this.gameplayConfig));
        
        //this.pipeManager.create(Object.keys(PIPES).length);

        //this.pipeManager.createPipe(PIPES.SRAIGHT_LR, [40,500]);
        //!!!
        //console.log(this.pipeManager.);
    }

    onCellClick (cell) {

        if (cell.pipe != null)  {
            this.occupiedCellClicked(cell); //TO-DO
            return;
        };

        this.freeCellClicked(cell); //TO-DO
    }

    freeCellClicked(cell) {
        if (this.pipeManager == null) return;
        
        let pipe = this.setupNewPipe(cell.localPosition);
        cell.pipe = pipe;

        this.board.container.add(pipe, true);
        
        this.sound.play('sfxPipePlace');
        console.log('pipe created!!');
    }

    occupiedCellClicked(cell) {
        return;
    }

    setupNewPipe(position) {
        let newPipe = this.pipeManager.createPipe(PIPES.SRAIGHT_LR, position);

        

        return newPipe;
    }



    setupConveyor () {
        this.conveyorContainer = this.add.container(0,0);
        let conveyorPart = this.add.sprite(0, 0, 'conveyor', 0);

        let spriteHeight = conveyorPart.height;
        let spriteWidht = conveyorPart.width;

        this.conveyorSpriteHeight = conveyorPart.height;
        this.conveyorSpriteWidth = conveyorPart.width;

        this.renderConveyorStart(conveyorPart, spriteWidht);
        this.renderConveyorBody(conveyorPart, spriteWidht, spriteHeight);
        this.renderConveyorTable(conveyorPart,spriteWidht, spriteHeight);
        this.renderConveyorEnd(conveyorPart, spriteWidht, spriteHeight);

        this.positionConveyorContainer();

        return this.conveyorContainer;
    }

    renderConveyorTable(conveyorPart, spriteWidht, spriteHeight) {
        conveyorPart = this.add.sprite(
            spriteWidht,
            spriteHeight * this.gameplayConfig.board.qtyLines,
            'conveyor',
            this.tableSpriteIndex
        );

        this.conveyorContainer.add(conveyorPart);
    }

    renderConveyorEnd (conveyorPart, spriteWidht, spriteHeight) {

        const spriteIndexStart = this.conveyorQtyColumnsPerLine * 2;

        for (let column = 0; column < this.conveyorQtyColumnsPerLine; column++) {
            var spriteLocationX = spriteWidht * column;
            var spriteLocationY = spriteHeight * this.gameplayConfig.board.qtyLines;
            
            conveyorPart = this.add.sprite(spriteLocationX, spriteLocationY, 'conveyor', spriteIndexStart + column);

            this.conveyorContainer.add(conveyorPart);
        }
    }

    renderConveyorBody (conveyorPart, spriteWidht, spriteHeight) {

        const spriteIndexStart = this.conveyorQtyColumnsPerLine;

        for (let line = 0; line < this.gameplayConfig.board.qtyLines-1; line ++) {
            for (let column = 0; column < this.conveyorQtyColumnsPerLine; column++) {

                var spriteLocationX = spriteWidht * column;
                var spriteLocationY = spriteHeight * (line + 1);

                conveyorPart = this.add.sprite(spriteLocationX, spriteLocationY, 'conveyor', spriteIndexStart + column);

                this.conveyorContainer.add(conveyorPart);
            }
        }
    }

    renderConveyorStart(conveyorPart, spriteWidht) {

        this.conveyorContainer.add(conveyorPart);

        for (let column = 1; column < this.conveyorQtyColumnsPerLine; column++) {
            let spriteLocationX = spriteWidht * column;

            conveyorPart = this.add.sprite(spriteLocationX, 0, 'conveyor', column);

            this.conveyorContainer.add(conveyorPart);
        }
    }

    positionConveyorContainer() {

        this.conveyorContainer.scale = this.gameplayConfig.board.scale;

        this.conveyorContainer.y = this.board.container.y + this.conveyorY;
        this.conveyorContainer.x = this.board.container.x - this.conveyorContainer.getBounds().width;

    }

    setupBoard() {

        let container = this.add.container(0,0);
        this.board = new Board(this, [this.gameplayConfig.board.qtyLines, this.gameplayConfig.board.qtyColumns], container, 'square', 0,0);
        
        container.scale = this.gameplayConfig.board.scale;
        this.board.centralize();
        container.y += this.gameplayConfig.board.paddingY;
        this.boardPositionY = container.y;
        this.boardPositionX = container.x;

    }

    loadVariables() {
        
        this.gameplayConfig = this.registry.get('gameplaySettings');
        this.screenCenter = this.registry.get('screenCenter');

        this.conveyorY = this.conveyorY * this.gameplayConfig.board.scale

    }

    initializeGlobalEvents() {
        this.events.removeListener('cellClicked', this.onCellClick.bind(this));
        this.events.addListener('cellClicked', this.onCellClick.bind(this));
    }

    setupBackground() {
        this.add.image(...this.screenCenter, 'background');

        this.backgroundBox = this.add.image(this.screenCenter[0], this.screenCenter[1] + this.gameplayConfig.board.paddingY, 'box').setOrigin(0.5);
    }

    setupTexts() {
        // this.add.text(...screenCenter, 'Main Menu', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5);
    }

    setupStatusBar() {
        let statusBar = this.add.image(this.statusPositionX, this.statusPositionY, 'statusBar').setOrigin(0);
        statusBar.setScale(this.statusBarScale);
    }
}

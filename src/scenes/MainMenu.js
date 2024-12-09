import { Scene } from 'phaser';
import { Button } from '../interface_elements/Button';
import { Cell } from '../board/Cell';
import { Board } from '../board/Board';
import { Pipe } from '../pipe/Pipe';
import { PipeManager, PIPES } from '../pipe/PipeManager';
import { PipeHolder } from '../pipe/PipeHolder';
import { SinglyLinkedList } from '../data_structures/SinglyLinkedList';

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
    currentPipe = [0,0];



    PIPE_MANAGER_CONFIG = {
        immovable: true
        // classType : Pipe,
        // runChildUpdate : true
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
        //console.log('xai');
        
        let pipe = null;

        for (let line = 0; line < this.gameplayConfig.board.qtyLines; line++) {

            //let pipe = this.setupNewPipe([this.conveyorPartWidth, this.conveyorPartHeight * line]);

            let conveyourCenter = this.conveyorSpriteWidth/2;
            let conveyourLine =  (this.conveyorSpriteHeight * line) + (this.conveyorSpriteHeight/2) ;

            // console.log(conveyourCenter);
            // console.log(conveyourLine);
            let conveyorPosition = [conveyourCenter, conveyourLine];
            
            pipe = this.setupNewPipe(conveyorPosition, PipeHolder.CONVEYOR);
            //let pipe = this.setupNewPipe([16/2, 16 * line + (16/2)]);
            
            this.updatePipePositionsVariable(line, conveyorPosition)
            
            this.conveyorContainer.add(pipe, true);


            //this.physics.moveTo(pipe, 1, 1, 60, 1000);
            // this.board.container.add(pipe, true);
            

            //this.conveyorPartHeight

        }

        let pipesList = this.pipeManager.pipesOnConveyor;
        const pipesListInverted = new SinglyLinkedList();

        while ( pipesList.length > 0) {
            pipe = pipesList.pop().val;
            pipesListInverted.push(pipe);
        }
        
        console.log(pipesListInverted);
        
        this.pipeManager.pipesOnConveyor = pipesListInverted;
        

        this.pipeManager.nextPipe = pipe;
        //this.pipeManager.conveyorCreated = true;


        
        //console.log(this.pipeManager.updatePipesInConveyor());
    }

    setupAudio() {
        this.sound.add('musicHoliznaEncounter', {loop: true} );
        //this.sound.add('musicPookatori', {loop: true} );
    }

    setupPipeManager () {
        this.pipeManager = this.physics.add.existing(new PipeManager(this, this.PIPE_MANAGER_CONFIG, this.gameplayConfig), true);
        //this.physics.add.
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
        
        let pipe = this.setupNewPipe(cell.localPosition, PipeHolder.BOARD);
        cell.pipe = pipe;

        this.board.container.add(pipe, true);
        
        this.sound.play('sfxPipePlace');





        pipe = this.pipeManager.getFirstPipe();
        

        let pipePosition = [...this.gameplayConfig.conveyor.pipePositions[0]];
        pipePosition[1] -= this.conveyorSpriteHeight;
        pipe = this.setupNewPipe(pipePosition, PipeHolder.CONVEYOR);
        this.pipeManager.updatePipesInConveyor();
        
        console.log(pipe)
        this.conveyorContainer.add(pipe, true);
        //console.log('pipe created!!');
    }

    occupiedCellClicked(cell) {
        return;
    }

    setupNewPipe(position, PipeHolder) {
        let newPipe = this.pipeManager.createPipe(PIPES.SRAIGHT_LR, position, PipeHolder);

        

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

    updatePipePositionsVariable(line, position) {
        console.log(this.gameplayConfig);
        let pipePositons = this.gameplayConfig.conveyor.pipePositions;

        pipePositons[line] = [...position]
    }
}

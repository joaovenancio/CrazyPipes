import { Scene } from 'phaser';
import { Button } from '../interface_elements/Button';
import { Cell } from '../board/Cell';
import { Board } from '../board/Board';
import { Pipe } from '../pipe/Pipe';
import { PipeManager, PIPES } from '../pipe/PipeManager';
import { PipeHolder } from '../pipe/PipeHolder';
import { SinglyLinkedList } from '../data_structures/SinglyLinkedList';
import { Conveyor } from '../conveyour/Conveyor';

export class MainMenu extends Scene
{
    gameplayConfig = null;
    
    conveyor = null;
    
    
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
        this.loadGlobalVariables();
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
        this.setupPipeQueue(); 
        //this.menu();
        this.setupAudio(); 

        //this.sound.get('musicPookatori').play();
        //this.sound.get('musicHoliznaEncounter').play();

        this.setupStartingPipe();//TO-DO 
        this.startCountdown();

    }


    setupStartingPipe() {

        let boardLines = this.gameplayConfig.board.qtyLines;

        let posX = Phaser.Math.Between( 0, boardLines-2);
        let posY = Phaser.Math.Between( 0, this.gameplayConfig.board.qtyColumns-1);

        let cell = this.board.cells[posX][posY];

        let possiblePipes = this.getPossibleStartPipeTypes(posX, posY, boardLines);

        let pipeType = possiblePipes[Phaser.Math.Between( 0, possiblePipes.length-1)]; 

        let startingPipe = this.pipeManager.createPipe(pipeType, cell.localPosition, PipeHolder.BOARD) ;

        this.board.container.add(startingPipe);

        cell.pipe = startingPipe;
        startingPipe.cell = cell;
        
    }

    getPossibleStartPipeTypes(posX, posY, boardLines) {

        let possiblePiples = [];

        if (posX === 0) {
            possiblePiples.push(PIPES.START_D);
        } else {
            possiblePiples.push(PIPES.START_D, PIPES.START_U);
        }   

        if (posY === 0) {
            possiblePiples.push(PIPES.START_R);
        } else if (posY === boardLines-1) {
            possiblePiples.push(PIPES.START_L);
        } else {
            possiblePiples.push(PIPES.START_R);
            possiblePiples.push(PIPES.START_L);
        }       

        return possiblePiples;

    }

    startCountdown () {

        this.startWaterFlow();
    }

    startWaterFlow() {

    }

    initializeGlobalEvents() {

        this.events.removeListener('cellClicked', this.onCellClick.bind(this));
        this.events.addListener('cellClicked', this.onCellClick.bind(this));

    }



    menu () {
        // let textStyle = {fontSize: this.fontSize, fill: this.textColor}
        // let button = new Button(this, 'This is a test', screenCenter, textStyle, null);
        // button.addOnClick();

        // this.input.once('pointerdown', () => {

        //     this.scene.start('Game');

        // });
    }

    setupConveyor() {

        this.conveyor = new Conveyor(this, 0 , 0 , this.gameplayConfig);
        this.conveyor.render();
        
    }

    getPipeQueuePosition(line) {
        let conveyorHeight = this.gameplayConfig.conveyor.conveyorSpriteHeight;

        let conveyourCenterX = (this.gameplayConfig.conveyor.conveyorSpriteWidth) / 2;
        let conveyourCenterYByLine =  (conveyorHeight * line) + (conveyorHeight / 2) ;

        return [conveyourCenterX, conveyourCenterYByLine];
    }

    setupPipeQueue() {

        let pipe = null;

        for (let line = 0; line < this.gameplayConfig.board.qtyLines; line++) {

            let pipePosition = this.getPipeQueuePosition(line);
            this.updatePipePositionsVariable(line, pipePosition)
            
            this.conveyor.add(
                this.setupNewPipe(pipePosition, PipeHolder.CONVEYOR), //this.setupNewPipe([16/2, 16 * line + (16/2)]);
                true
            );

        }
        
        this.pipeManager.invertConveyorPipesList();

        this.pipeManager.nextPipe = pipe; //Do we need this?

    }

    setupAudio() {

        this.sound.add('musicHoliznaEncounter', {loop: true} );
        //this.sound.add('musicPookatori', {loop: true} );

    }

    setupPipeManager () {

        this.pipeManager = this.physics.add.existing(new PipeManager(this, this.PIPE_MANAGER_CONFIG, this.gameplayConfig), true);

    }

    setupNewPipe(position, typeOfPipeHolder) {

        let newPipe = this.pipeManager.createPipe(PIPES.SRAIGHT_LR, position, typeOfPipeHolder);

        return newPipe;
        
    }    

    setupBoard() {

        this.board = new Board(this, [this.gameplayConfig.board.qtyLines, this.gameplayConfig.board.qtyColumns], 'square', 0,0, this.gameplayConfig);
        
        this.board.centralize();

        this.boardPositionY = this.board.container.y;
        this.boardPositionX = this.board.container.x;

    }

    loadGlobalVariables() {
        
        this.gameplayConfig = this.registry.get('gameplaySettings');
        this.screenCenter = this.registry.get('screenCenter');

        this.conveyorY = this.conveyorY * this.gameplayConfig.board.scale

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

    updatePipePositionsVariable(line, position) { //Should be on conveyor?

        let pipePositons = this.gameplayConfig.conveyor.pipePositions;

        pipePositons[line] = [...position]

    }

    freeCellClicked(cell) {

        if (this.pipeManager == null) return;
        
        this.sound.play('sfxPipePlace');

        let pipe = this.setupNewPipe(cell.localPosition, PipeHolder.BOARD);
        this.board.container.add(pipe, true);

        cell.pipe = pipe;
        
        this.createNewConveyorPipe();
        
    }

    createNewConveyorPipe() {

        let pipe = this.pipeManager.getFirstPipe();

        let lastPipePosition = [...this.gameplayConfig.conveyor.pipePositions[0]];
        lastPipePosition[1] -= this.conveyorSpriteHeight;
        pipe = this.setupNewPipe(lastPipePosition, PipeHolder.CONVEYOR);

        this.pipeManager.updatePipesInConveyor();
        
        this.conveyor.add(pipe, true);
        
    }

    occupiedCellClicked(cell) {
        return;
    }



    onCellClick (cell) {

        if (cell.pipe != null)  {
            this.occupiedCellClicked(cell); //TO-DO
            return;
        };

        this.freeCellClicked(cell); //TO-DO
    }
}

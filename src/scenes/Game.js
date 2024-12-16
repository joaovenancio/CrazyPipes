import { Scene } from 'phaser';
import { Board } from '../board/Board';
import { PipeManager, PIPES } from '../pipe/PipeManager';
import { PipeHolder } from '../pipe/PipeHolder';
import { Conveyor } from '../conveyour/Conveyor';
import { Timer } from '../timer/Timer';
import { GameState } from '../state/GameState';

export class Game extends Scene {

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
    timer = null;
    countdownTimer = null;
    gameState = null;
    scoreTextPositionY = 20;
    scoreText = null;
    points = 0;
    secondsPassed = 0;
    firstPipe = null;


    constructor ()
    {
        super('Game');
    }


    init() {
        this.initializeGlobalEvents();
    }

    preload ()
    {
        this.loadGlobalVariables();
    }

    create () {   
        this.setupStartingVariables();
        this.setupBackground();
        this.setupBoard();
        this.setupBackgroundBox();
        this.setupConveyor();
        this.setupStatusBar();
        this.setupTexts();
        this.setupPipeManager();  
        this.setupPipeQueue(); 
        this.setupAudio();
        this.setupStartingPipe();

        this.timer = new Timer(this.gameplayConfig.pipeFillTime);

        this.startAudio();
        this.play();
    }
    
    update(time, delta) {
        switch (this.gameState) {
            case GameState.WATER_FLOWING:
                this.runWaterOnPipes(delta);
                break;
            case GameState.PLAYING: 
                this.runCountdown(delta);
                break
        }
    }


    runWaterOnPipes(delta) {
        if (this.timer.tick(delta)) { //True if defined time has passed
            this.secondsPassed++;
            this.sound.play('tick');

            if (this.secondsPassed > this.gameplayConfig.pipeTotalFillTime) {
                let nextPipe = this.pipeManager.getNextPipe(this.board.cells);
                this.pipeManager.currentPipe = nextPipe;

                if ( nextPipe === null) {
                    this.gameOver();
                    return;
                }

                this.addPoints();
                nextPipe.startFlow();
                this.secondsPassed = 0;

                return;
            }

            this.pipeManager.currentPipe.flow();
        }
    }

    runCountdown(delta) {
        if (!this.countdownTimer.tick(delta)) return false;

        this.countdown--;
        this.scoreText.text = this.countdown;
        this.sound.play('tickCountdown');

        if (this.countdown === 0) {
            this.gameState = GameState.WATER_FLOWING;
            this.scoreText.text = 'Score: ' + this.points;
        }
    }

    setupStartingVariables() {
        this.conveyor = null;
        this.conveyorSpriteHeight = 0;
        this.conveyorSpriteWidth = 0;
        this.statusBarScale = 5;
        this.statusPositionX = 0;
        this.statusPositionY = -30;
        this.boardPositionX;
        this.board = null;
        this.backgroundBox = null;
        this.pipeManager = null;
        this.nextPipe = null;
        this.timer = null;
        this.points = 0;
        this.scoreTextPositionY = 20;
        this.countdownTimer = new Timer(1000);
        this.countdown = this.gameplayConfig.countdown;
        this.secondsPassed = 0;
    }

    setupBackgroundBox() {
        let boardBounds = this.board.container.getBounds();
        let boardScale = this.gameplayConfig.board.scale;
        this.backgroundBox.displayWidth = boardBounds.width + ((16 + 7) * boardScale);
        this.backgroundBox.displayHeight = boardBounds.height + ((16 + 16) * boardScale);
    }

    setupTexts() {
        let textStyle = {fontSize: '50px', fill: '#000000', fontFamily: 'Arial Black', stroke: '#FFFFFF', strokeThickness: 4, align: 'center'};

        this.scoreText = this.add.text(this.screenCenter[0], this.scoreTextPositionY, this.countdown, textStyle)
        .setOrigin(0.5,0);
    }

    startAudio() {
        //this.sound.get('musicPookatori').play();
        this.sound.get('musicHoliznaEncounter').play();
    }

    addPoints() {
        this.points += this.gameplayConfig.correctPipePoints;
        this.sound.play('sfxCorrect');
        this.scoreText.text = 'Score: ' + this.points;
    }

    gameOver() {
        this.gameState = GameState.GAME_OVER;
        this.events.removeListener('cellClicked');
        this.sound.play('sfxWrong');
        this.gameplayConfig.score = this.points;

        console.log('Game -> GameOver(): Final score = ' + this.points);
        this.scene.start('GameOver');
    }

    setupStartingPipe() {
        let boardLines = this.gameplayConfig.board.qtyLines;
        let boardColumns = this.gameplayConfig.board.qtyColumns;

        let posX = Phaser.Math.Between( 0, boardLines-2);
        let posY = Phaser.Math.Between( 0, boardColumns-1);
        let cell = this.board.cells[posX][posY];

        let possiblePipes = this.getPossibleStartPipeTypes(posX, posY, boardColumns);
        let pipeType = possiblePipes[Phaser.Math.Between( 0, possiblePipes.length-1)]; 

        let startingPipe = this.pipeManager.createPipe(pipeType, cell.localPosition, PipeHolder.BOARD) ;
        startingPipe.isWaterFlowing = true;
        this.board.container.add(startingPipe);
        this.pipeManager.currentPipe = startingPipe;

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

    play () {
        this.gameState = GameState.PLAYING;
    }

    initializeGlobalEvents() {
        this.events.removeListener('cellClicked', this.onCellClick.bind(this)); //TO-DO: Do i need it here?
        this.events.addListener('cellClicked', this.onCellClick.bind(this));
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
                this.setupNewPipe(pipePosition, PipeHolder.CONVEYOR),
                true
            );
        }
        
        this.pipeManager.invertConveyorPipesList();
        this.pipeManager.nextPipe = pipe; //TO-DO: Do we need this?
    }

    setupAudio() {
        this.sound.add('musicHoliznaEncounter', {loop: true} );
        //this.sound.add('musicPookatori', {loop: true} );
    }

    setupPipeManager () {
        this.pipeManager = this.physics.add.existing(new PipeManager(this,  {
            immovable: true
            // classType : Pipe,
            // runChildUpdate : true
        }, this.gameplayConfig), true);
    }

    setupNewPipe(position, typeOfPipeHolder, typeOfPipe) {
        let pipeConfig = typeOfPipe; 
        
        if (typeOfPipe == null) {
            switch (Phaser.Math.Between( 1, PIPES.length)) {
                case 1:
                    pipeConfig = PIPES.SRAIGHT_LR;
                    break;  
                case 2:
                    pipeConfig = PIPES.SRAIGHT_UD;
                    break;
                case 3:
                    pipeConfig = PIPES.CURVE_LD;
                    break;
                case 4:
                    pipeConfig = PIPES.CURVE_LU;
                    break;    
                case 5:
                    pipeConfig = PIPES.CURVE_RD;
                    break;    
                case 6:
                    pipeConfig = PIPES.CURVE_RU;
                    break;
                case 7:
                    pipeConfig = PIPES.CROSS;
                    break;
            }
        }

        return this.pipeManager.createPipe(pipeConfig, position, typeOfPipeHolder);
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
        this.gameState = this.gameplayConfig.state;
    }

    setupBackground() {
        this.add.image(...this.screenCenter, 'background');
        this.backgroundBox = this.add.image(this.screenCenter[0], this.screenCenter[1] + this.gameplayConfig.board.paddingY, 'box').setOrigin(0.5);
    }

    setupStatusBar() {
        let statusBar = this.add.image(this.statusPositionX, this.statusPositionY, 'statusBar').setOrigin(0);
        statusBar.setScale(this.statusBarScale);
    }

    updatePipePositionsVariable(line, position) { //Should this be on conveyor?
        let pipePositons = this.gameplayConfig.conveyor.pipePositions;
        pipePositons[line] = [...position]
    }

    freeCellClicked(cell) {
        if (this.pipeManager == null) return;
        
        this.sound.play('sfxPipePlace');    
        this.createNewConveyorPipe();

        let pipe = this.setupNewPipe(cell.localPosition, PipeHolder.BOARD, this.firstPipe.pipeConfig);
        this.board.container.add(pipe, true);
        cell.pipe = pipe;
        pipe.cell = cell;
        
        this.firstPipe.destroy(); //Or do some animation with it
    }

    createNewConveyorPipe() {
        this.firstPipe = this.pipeManager.getFirstPipe();

        let lastPipePosition = [...this.gameplayConfig.conveyor.pipePositions[0]];
        lastPipePosition[1] -= this.conveyorSpriteHeight;
        let pipe = this.setupNewPipe(lastPipePosition, PipeHolder.CONVEYOR);

        this.pipeManager.updatePipesInConveyor();   
        this.conveyor.add(pipe, true);
    }

    occupiedCellClicked(cell) {

        if (cell.pipe.isWaterFlowing) {
            //No pipe sfx here
            return;
        }

        this.sound.play('sfxPipeExplosion');
        this.points -= this.gameplayConfig.wrongPipePoints;

        if (this.gameState === GameState.WATER_FLOWING) this.scoreText.text = 'Score: ' + this.points;

        cell.pipe.cell = null;
        cell.pipe.destroy();

        this.createNewConveyorPipe();

        let pipe = this.setupNewPipe(cell.localPosition, PipeHolder.BOARD, this.firstPipe.pipeConfig);
        this.board.container.add(pipe, true);
        cell.pipe = pipe;
        pipe.cell = cell;
        
        this.firstPipe.destroy(); //Or some animtion
    }

    onCellClick (cell) {
        if (cell.pipe != null)  {
            this.occupiedCellClicked(cell);
            return;
        };

        this.freeCellClicked(cell);
    }
}
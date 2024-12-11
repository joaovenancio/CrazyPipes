import { Scene } from 'phaser';
import { GameState } from '../state/GameState';

const DEFAULT_GAMEPLAY_SETTINGS = {
    pipeFillTime : 800,
    pipeTotalFillTime : 6,
    board : {
        scale : 1,
        qtyLines : 7,
        qtyColumns : 9,
        scale : 4.5,
        positionY : 500,
        paddingY : 60,
        x: 0,
        y: 0
    },
    conveyor : {
        pipePositions : [[]],
        conveyorSpriteWidth: 0,
        conveyorSpriteHeight : 0

    },
    state: GameState.MENU,
    correctPipePoints : 100,
    wrongPipePoints : 50,
    countdown : 10,
    score : 0
};

const DEFAULT_GAME_SETTINGS = {
    
}

export class Preloader extends Scene
{


    constructor () {
        super('Preloader');
    }

    init () {
        this.add.image(this.game.config.width/2, this.game.config.height/2, 'background');
        this.add.rectangle(this.game.config.width/2, this.game.config.height/2, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(this.game.config.width/2-230, this.game.config.height/2, 4, 28, 0xffffff);

        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload () {
        this.load.setPath('assets');

        this.loadImages();
        this.loadSpriteSheets();
        this.loadPipes();
        this.loadSFX();
        this.loadMusics();
    }

    create () {
        this.registry.set('screenCenter', [this.game.config.width/2, this.game.config.height/2]);
        this.registry.set('gameSettings', {...DEFAULT_GAME_SETTINGS});
        this.registry.set('gameplaySettings', {...DEFAULT_GAMEPLAY_SETTINGS});

        this.scene.start('MainMenu');
    }

    loadImages() {
        this.load.image('logo', 'logo.png');
        this.load.image('square', 'square.png');
        this.load.image('statusBar', 'ui/status_bar.png');
        this.load.image('box', 'ui/box.png');
    }


    loadMusics() {
        //this.load.audio('musicPookatori', 'music/pookatori-and-friends-kevin-macleod-main-version.mp3');
        this.load.audio('musicHoliznaEncounter', 'music/holizna-cc0-random-encounter.mp3');
        this.load.audio('musicHoliznaMini', 'music/holizna-cc0-mini-boss.mp3');

        

    }


    loadSFX() {

        this.load.audio('tick', 'sfx/371176__samsterbirdies__button-ting.wav');
        this.load.audio('tickCountdown', 'sfx/tickCountdown-breviceps.wav');

        this.load.audio('sfxPipeExplosion', 'sfx/explosion-maodin204.wav');
        this.load.audio('sfxCorrect', 'sfx/correct-maodin204.wav');
        this.load.audio('sfxWrong', 'sfx/wrong-japanyoshithegamer.wav');


        
        
    }

    loadSpriteSheets() {
        this.load.spritesheet('conveyor', 'conveyor/conveyor-16x16.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        
    }

    loadPipes() {
        this.load.spritesheet('pipeStraight', 'pipes/pipe-straight-Sheet.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('pipeStraightUD', 'pipes/pipe-straight-ud-Sheet.png', {
            frameWidth: 16,
            frameHeight: 16
        })


        this.load.spritesheet('pipeCurve', 'pipes/pipe-curve-Sheet.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('pipeCross', 'pipes/pipe-cross-Sheet.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('pipeStart', 'pipes/pipe-start-Sheet.png', {
            frameWidth: 16,
            frameHeight: 16
        })


        this.load.audio('sfxPipePlace', 'pipes/sfx/sfx-put_pipe.mp3');
    }

    setupPipeAnimations() {
    }
}

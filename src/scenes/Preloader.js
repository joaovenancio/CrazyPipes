import { Scene } from 'phaser';
import { GameState } from '../state/GameState';

const DEFAULT_GAMEPLAY_SETTINGS = {
    pipeFillTime : 1000,
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
    state: GameState.MENU
};

const DEFAULT_GAME_SETTINGS = {
    
}

export class Preloader extends Scene
{


    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        this.load.setPath('assets');

        this.loadImages();
        this.loadSpriteSheets();
        this.loadPipes();
        this.loadMusics();
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.

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
        // this.anims.create({
        //     key: 'pipeStraightFlowingWater',
        //     frames: this.anims.generateFrameNumbers('pipeStraight', {start: 1, end: 6}),
        //     frameRate: 6,
        //     repeat: false
        // })
    }
}

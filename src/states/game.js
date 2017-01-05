import Crosshairs from '../prefabs/crosshairs';
import Target from '../prefabs/target';

const ANGLE = 30;

class Game extends Phaser.State {

  constructor() {
    super();

    this.background = null;
    this.bird = null;
    this.pipes = null;

    this.space = null;
  }

  init() {
    this.game.renderer.renderSession.roundPixels = true;

    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.physics.arcade.gravity.y = 200;
  }

  preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('pipe-top', 'assets/pipe_top.png');
    this.load.image('pipe-botton', 'assets/pipe_bottom.png');

    this.load.spritesheet('bird', 'assets/bird.png', 19, 14);
  }

  create() {
    this.background = this.game.add.sprite(0, 0, 'background');

    this.bird = this.game.add.sprite(10, this.game.world.height / 2, 'bird');
    this.bird.animations.add('fly', [0, 1, 2], 10, true);
    this.bird.anchor.set(0.5);
    this.physics.enable(this.bird);


    this.space = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    this.space.onDown.add(this.fly,this);
    // //add background image
    // this.background = this.game.add.sprite(0,0,'background');
    // this.background.height = this.game.world.height;
    // this.background.width = this.game.world.width;


    // //setup UI
    // this.countdownText = this.add.text(this.game.world.centerX, 0, '', {
    //   font: '40px Arial', fill: '#ffffff', align: 'center'
    // });
    // this.countdownText.anchor.set(0.5,0);

    // //set up click listeners
    // this.game.input.onDown.add(this.shoot, this);

    // //setup audio
    // this.gunshot = this.game.add.audio('gunshot');

    // //setup prefabs
    // this.crosshairs = new Crosshairs(this.game);
    // this.target = new Target(this.game,this.game.world.centerX,this.game.world.centerY);
    // this.game.add.existing(this.crosshairs);
    // this.game.add.existing(this.target);

    // //setup a timer to end the game
    // this.endGameTimer = this.game.time.create();
    // this.endGameTimer.add(Phaser.Timer.SECOND * 15, this.endGame,this);
    // this.endGameTimer.start();
  }

  fly() {
    this.bird.angle = -ANGLE;
    this.bird.body.velocity.y = -100;
  }

  drop() {
    this.bird.angle = ANGLE;
  }

  // shoot(click) {
  //   this.gunshot.play();
  // }

  update() {
    this.bird.play('fly');
    // if (this.space.isDown) {
    //   this.fly();
    // } else {
      // this.drop();
    // }
    // this.bird.angle = ANGLE;
    // this.countdownText.setText( (this.endGameTimer.duration/1000).toFixed(1));
  }

  // endGame() {
  // this.game.state.start('gameover');
  // }

}

export default Game;

import Crosshairs from '../prefabs/crosshairs';
import Target from '../prefabs/target';

const ANGLE = 30;

const SPACE = 64
const Y = [-128, -96, -64, -32, 0]

class Game extends Phaser.State {

  constructor() {
    super();

    this.background = null;
    this.ground = null;
    this.bird = null;
    this.pipes = null;

    this.jumpAudio = null;

    this.space = null;

    this.score = 0;
    this.scores = null;

    this.timer = null;

    this.audio = {};
  }

  init() {
    this.game.renderer.renderSession.roundPixels = true;

    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.physics.arcade.gravity.y = 200;
  }

  preload() {
    // Images
    this.load.image('background', 'assets/background.png');
    this.load.image('pipe-top', 'assets/pipe_top.png');
    this.load.image('pipe-bottom', 'assets/pipe_bottom.png');
    this.load.image('ground', 'assets/ground.png');
    // Numbers
    for (let i = 0; i < 10; i++) {
      this.load.image(i, 'assets/numbers/' + i + '.png');
    }

    // Spritesheet
    this.load.spritesheet('bird', 'assets/bird.png', 19, 14);

    // Audio
    this.load.audio('die', 'assets/audio/die.wav');
    this.load.audio('hit', 'assets/audio/hit.wav');
    this.load.audio('point', 'assets/audio/point.wav');
    this.load.audio('swooshing', 'assets/audio/swooshing.wav');
    this.load.audio('wing', 'assets/audio/wing.wav');
  }

  create() {
    // Background
    this.background = this.game.add.sprite(0, 0, 'background');

    // Bird
    this.bird = this.game.add.sprite(10, this.game.world.height / 2, 'bird');
    this.bird.animations.add('fly', [0, 1, 2], 10, false);
    this.bird.anchor.set(0.3, 0.5);
    this.bird.alive = true;
    this.physics.enable(this.bird);
    this.bird.body.immovable = true;

    // Pipe
    this.pipes = this.add.physicsGroup();
    this.addPipe(144);
    this.timer = this.time.events.loop(1500, () => this.addPipe(144));

    // Ground
    this.ground = this.game.add.sprite(0, 240, 'ground');
    this.physics.enable(this.ground);
    this.ground.body.velocity.x = -100;
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    // Audio
    this.audio.wing = this.game.add.audio('wing');
    this.audio.point = this.game.add.audio('point');
    this.audio.hit = this.game.add.audio('hit');
    this.audio.die = this.game.add.audio('die');
    this.audio.hit.onStop.add(() => this.audio.die.play());
    this.audio.swooshing = this.game.add.audio('swooshing');

    // score
    this.scores = this.game.add.group();
    this.scores.x = this.scores.y = 5;
    this.scores.create(0, 0, '0');


    // Input -- Space
    this.space = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    this.space.onDown.add(this.jump, this);
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

  addPipe(x) {
    let y = Y[Math.floor(Math.random() * Y.length)];

    let pipeTop = this.game.add.sprite(x, y, 'pipe-top');
    pipeTop.checkWorldBounds = true;
    pipeTop.outOfBoundsKill = true;
    // pipeTop.body.velocity.x 21= -100; 

    let pipeBottom = this.game.add.sprite(x, y + 160 + SPACE, 'pipe-bottom');
    pipeBottom.checkWorldBounds = true;
    pipeBottom.outOfBoundsKill = true;
    // pipeBottom.body.velocity.x = -100; 

    this.pipes.addMultiple([pipeTop, pipeBottom], true);
    this.pipes.setAll('body.velocity.x', -100);
    this.pipes.setAll('body.allowGravity', false);
    this.pipes.setAll('body.immovable', true);
  }

  jump() {
    if (this.bird.alive) {
      let animation = this.game.add.tween(this.bird);
      animation.to({ angle: -ANGLE }, 100);
      animation.start();
      this.bird.body.velocity.y = -100;
      this.audio.wing.play();
    }
  }

  drop() {
    this.bird.angle = ANGLE;
  }

  hitPipe() {
    if (this.bird.alive === false) return;

    this.audio.hit.play();

    // Set bird alive to false
    this.bird.alive = false;

    // remove the timer
    this.game.time.events.remove(this.timer);

    // Stop moving the pipes and ground
    this.pipes.setAll('body.velocity.x', 0)
    this.ground.body.velocity = 0;

    // Dead animation
    this.bird.body.gravity.y = 400;
    let animation = this.game.add.tween(this.bird);
    animation.to({ angle: 90 }, 500, Phaser.Easing.Exponential.In);
    animation.start();

  }

  passPipe(pipe) {
    if (!pipe.pass && pipe.key === "pipe-top") {
      if (this.bird.x - pipe.x >= pipe.width) {
        pipe.pass = true;
        this.score++;
        this.audio.point.play();
        this.scores.removeAll(true, true);
        let text = this.score.toString();
        for (let i = 0; i < text.length; i++) {
          this.scores.create(12 * i, 0, text[i]);
        }
      }
    }
  }

  update() {
    this.game.physics.arcade.collide(this.bird, this.pipes, this.hitPipe, null, this);

    if (this.ground.x <= -24) this.ground.x = 0;


    if (this.bird.alive) {
      this.bird.play('fly');
      if (this.bird.angle < 90) {
        this.bird.angle++;
      }

      this.pipes.forEachAlive(this.passPipe, this);
    }

    // this.pipes.forEach()
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

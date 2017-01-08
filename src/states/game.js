import Crosshairs from '../prefabs/crosshairs';
import Target from '../prefabs/target';
import Util from '../util';

const ANGLE = 30;
const SPACE = 64;
const Y = [-128, -96, -64, -32];

class Game extends Phaser.State {

  constructor() {
    super();

    this.background = null;
    this.ground = null;

    this.bird = null;
    this.tween = null;

    this.pipes = null;

    this.space = null;

    this.score = 0;
    this.scores = null;
    this.ready = null;

    this.gameOver = null;
    this.over = null;
    this.restart = null;
    this.board = null;
    this.medal = null;

    this.timer = null;

    this.audio = {};
  }

  init() {
    this.game.renderer.renderSession.roundPixels = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.physics.arcade.gravity.y = 400;

    this.game.add.tween(this.game.world).to({ alpha: 1 }, 200, Phaser.Easing.Default.In, true);
  }

  create() {
    this.createGameObj();
    this.initGameObjState();
  }

  update() {
    this.game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    this.game.physics.arcade.collide(this.bird, this.ground, this.hitGround, null, this);

    if (this.ground.x <= -24) this.ground.x = 0;

    if (this.bird.alive) {
      if (this.bird.body.allowGravity && this.bird.angle < 90) {
        this.bird.angle += 2;
      } else {
        this.bird.play('fly');
      }

      this.pipes.forEachAlive(this.passPipe, this);
    }
  }

  createGameObj() {
    let add = this.game.add;
    let world = this.game.world;

    // background
    this.background = add.sprite(0, 0, 'day');

    // pipe
    this.pipes = this.add.physicsGroup();

    // ground
    this.ground = add.sprite(0, 240, 'ground');
    this.physics.enable(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    // bird
    this.bird = add.sprite(30, 0, 'bird', 1);
    this.bird.animations.add('fly', [0, 1, 2, 0, 1, 2], 10, false);
    this.bird.anchor.set(0.3, 0.5);
    this.physics.enable(this.bird);
    this.bird.body.collideWorldBounds = true;


    // audio
    ['wing', 'point', 'hit', 'die', 'swooshing'].forEach(el => this.audio[el] = add.audio(el));

    // score
    this.scores = add.group();
    this.scores.y = 20;
    this.scores.create(0, 0, '0');
    Util.hcenter(this.scores, world);

    // ready
    this.ready = add.group();
    this.ready.create(0, 0, 'ready');
    this.ready.create(17.5, 50, 'tap');
    Util.center(this.ready, world);

    // game over
    this.gameOver = add.group();
    this.over = add.sprite(0, 0, 'over');
    this.board = add.sprite(0, 40, 'board');
    this.restart = add.button(0, 120, 'start', () => {
      let tween = add.tween(this.restart).to({ y: this.restart.y + 5 }, 100, Phaser.Easing.Default.In, true, 0, 0, true);
      tween.onComplete.add(this.onRestart, this);
    });
    this.gameOver.addMultiple([this.over, this.board, this.restart], true);
    this.gameOver.forEach((obj) => Util.hcenter(obj, this.gameOver));
    Util.center(this.gameOver, world);


    // input -- space
    this.space = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    this.space.onDown.add(this.jump, this);
  }

  initGameObjState() {
    // ground
    this.ground.body.velocity.x = -100;

    // bird
    Util.vcenter(this.bird, this.game.world);
    this.bird.body.immovable = false;
    this.bird.angle = 0;
    this.bird.alive = true;
    this.bird.body.gravity.y = 0;
    this.bird.body.allowGravity = false;
    this.tween = this.tween || this.game.add.tween(this.bird).to({ y: this.bird.y - 10 }, 400, Phaser.Easing.Default.In, false, 0, -1, true);
    this.tween.isPaused ? this.tween.resume() : this.tween.start();

    // score
    this.score = 0;
    this.setScore(this.scores, this.score);
    this.scores.visible = true;

    // pipes
    this.pipes.removeAll();

    // ready
    this.ready.visible = true;

    // game over
    this.gameOver.visible = false;
    this.gameOver.setAll('alpha', 0);

    // input - space
    this.space.onDown.add(this.onStart, this);
  }

  onStart() {
    this.space.onDown.remove(this.onStart, this);
    this.ready.visible = false;

    this.bird.body.allowGravity = true;
    this.tween.pause();

    this.addPipe(144);
    this.timer = this.time.events.loop(1500, () => this.addPipe(144));
  }

  onRestart() {
    this.audio.swooshing.play();
    let add = this.game.add;
    let tween = this.game.add.tween(this.game.world).to({ alpha: 0 }, 100, Phaser.Easing.Default.In, true);
    tween.onComplete.add(() => {
      this.initGameObjState();
      this.game.add.tween(this.game.world).to({ alpha: 1 }, 100, Phaser.Easing.Default.In, true);
    })
  }

  addPipe(x) {
    let y = Y[Math.floor(Math.random() * Y.length)];

    let pipeTop = this.game.add.sprite(x, y, 'pipe-top');

    let pipeBottom = this.game.add.sprite(x, y + 160 + SPACE, 'pipe-bottom');

    this.pipes.addMultiple([pipeTop, pipeBottom], true);
    this.pipes.setAll('checkWorldBounds', true);
    this.pipes.setAll('outOfBoundsKill', true);
    this.pipes.setAll('body.velocity.x', -100);
    this.pipes.setAll('body.allowGravity', false);
    this.pipes.setAll('body.immovable', true);
  }

  jump() {
    if (!this.bird.alive) return;

    let animation = this.game.add.tween(this.bird);
    animation.to({ angle: -ANGLE }, 100);
    animation.start();
    this.bird.body.velocity.y = -150;
    this.audio.wing.play();
    this.bird.play('fly');
  }

  hitPipe() {
    if (this.bird.alive === false) return;

    this.shock();

    this.audio.hit.onStop.removeAll();
    this.audio.hit.onStop.add(() => this.audio.die.play());
    this.audio.hit.play();

    // Set bird alive to false
    this.bird.alive = false;
    this.bird.body.immovable = true;

    // remove the timer
    this.game.time.events.remove(this.timer);

    // stop moving the pipes and ground
    this.pipes.setAll('body.velocity.x', 0)
    this.ground.body.velocity.x = 0;

    // die animation
    this.bird.body.gravity.y = 400;
    let tween = this.game.add.tween(this.bird);
    tween.to({ angle: 90 }, 500, Phaser.Easing.Exponential.In);
    this.bird.body.immovable = false;
    tween.start();

    tween.onComplete.add(this.onGameOver, this);

  }

  hitGround() {
    if (this.bird.alive === false) return;

    this.shock();

    this.audio.hit.onStop.removeAll();
    this.audio.hit.play();

    // Set bird alive to false
    this.bird.alive = false;

    // remove the timer
    this.game.time.events.remove(this.timer);

    // Stop moving the pipes and ground
    this.pipes.setAll('body.velocity.x', 0)
    this.ground.body.velocity.x = 0;

    this.time.events.repeat(500, 0, () => this.onGameOver());
  }

  shock() {
    this.game.camera.flash();
    this.game.camera.shake(0.02);
  }

  onGameOver() {
    let add = this.game.add;
    this.scores.visible = false;
    this.gameOver.visible = true;

    // tween for game over text
    let overY = this.over.y;
    this.over.y -= 10;
    let overTween = add.tween(this.over).to({ y: overY, alpha: 1 }, 300);

    // tween for board
    let boardY = this.board.y;
    this.board.y += 20;
    let boardTween = add.tween(this.board).to({ y: boardY, alpha: 1 }, 300, Phaser.Easing.Default.In, false, 500);

    // tween for restart button
    let restartTween = add.tween(this.restart).to({ alpha: 1 }, 200, Phaser.Easing.Default.In, false, 200);

    overTween.onComplete.add(() => {
      boardTween.start();
    })

    boardTween.onStart.add(() => this.audio.swooshing.play())
    boardTween.onComplete.add(() => {
      restartTween.start();
    })

    this.audio.swooshing.play();
    overTween.start();
  }

  passPipe(pipe) {
    if (!pipe.pass && pipe.key === "pipe-top") {
      if (this.bird.x - pipe.x >= pipe.width) {
        pipe.pass = true;
        this.score++;
        this.audio.point.play();
        this.setScore(this.score);
      }
    }
  }

  setScore(score) {
    this.scores.removeAll(true, true);
    let text = this.score.toString();
    for (let i = 0; i < text.length; i++) {
      this.scores.create(12 * i, 0, text[i]);
    }
    Util.hcenter(this.scores, this.game.world);
  }
}

export default Game;

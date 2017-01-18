import Pipe from '../prefabs/pipe';
import Ground from '../prefabs/ground';
import Bird from '../prefabs/bird';
import Score from '../prefabs/score';
import Ready from '../prefabs/ready';
import GameOver from '../prefabs/gameover';

import Util from '../util';

const ANGLE = 30;
const SPACE = 64;

class Game extends Phaser.State {

    constructor() {
        super();

        this.background = null;
        this.ground = null;
        this.bird = null;
        this.pipes = null;
        this.score = null;
        this.ready = null;
        this.gameOver = null;
        this.timer = null;
        this.audio = {};
    }

    init() {
        this.game.renderer.renderSession.roundPixels = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.physics.arcade.gravity.y = 800;

        this.game.add.tween(this.game.world).to({ alpha: 1 }, 200, Phaser.Easing.Default.In, true);
    }

    create() {
        let game = this.game;
        let world = this.game.world;
        let add = this.game.add;

        // background
        this.background = add.sprite(0, 0, 'day');

        // audio
        ['point', 'hit', 'die', 'swooshing'].forEach(el => this.audio[el] = add.audio(el));

        // pipes
        this.pipes = add.physicsGroup();

        // ground
        this.ground = new Ground(game, world);
        add.existing(this.ground);

        // bird
        this.bird = new Bird(game, 30, 0, 'bird');
        add.existing(this.bird);

        // score
        this.score = new Score(game, '', world);
        this.score.y = 20;
        Util.hcenter(this.score, world);

        // ready
        this.ready = new Ready(game, world);

        // game over
        this.gameOver = new GameOver(game, world, this.onRestart, this);

        // mouse
        this.input.onTap.add(this.onTap, this);
    }

    update() {
        this.pipes.forEachAlive((pipe) => {
            if (this.game.physics.arcade.overlap(this.bird, pipe, this.hitPipe, null, this)) return;
            this.passPipe(pipe);
        });

        this.game.physics.arcade.collide(this.bird, this.ground, this.hitGround, null, this);
    }

    onTap() {
        if (this.ready.visible) {
            this.ready.hide();
            this.bird.start();
            new Pipe(this.game, this.pipes);
            this.timer = this.time.events.loop(1500, () => new Pipe(this.game, this.pipes));
        }

        this.bird.fly();
    }

    onRestart() {
        // this.audio.swooshing.play();
        let add = this.game.add;
        let tween = this.game.add.tween(this.game.world).to({ alpha: 0 }, 100, Phaser.Easing.Default.In, true);
        tween.onComplete.add(() => {
            this.bird.reset();
            this.ground.reset();
            this.ready.show();
            this.gameOver.hide();
            this.score.score = 0;
            this.score.show();
            this.pipes.removeAll();
            this.game.add.tween(this.game.world).to({ alpha: 1 }, 100, Phaser.Easing.Default.In, true);
        })
    }

    hitPipe() {
        if (this.bird.alive === false) return;

        this.shock();

        this.audio.hit.onStop.removeAll();
        this.audio.hit.onStop.add(() => this.audio.die.play());
        this.audio.hit.play();

        this.bird.die(this.onGameOver, this);

        this.game.time.events.remove(this.timer);

        this.pipes.forEachAlive(pipe => pipe.stop());
        this.ground.stop();

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

        // stop moving the pipes and ground
        this.pipes.forEachAlive(pipe => pipe.stop());
        this.ground.stop();

        this.time.events.repeat(500, 0, () => this.onGameOver());
    }

    shock() {
        this.game.camera.flash();
        this.game.camera.shake(0.02);
    }

    onGameOver() {
        this.score.hide();
        this.gameOver.setScore(this.score.score);
        this.gameOver.show();
    }

    passPipe(pipe) {
        if (!pipe.pass) {
            if (this.bird.x - pipe.topPipe.x >= pipe.width) {
                pipe.pass = true;
                this.score.score++;
                Util.hcenter(this.score, this.game.world);
                this.audio.point.play();
            }
        }
    }
}

export default Game;

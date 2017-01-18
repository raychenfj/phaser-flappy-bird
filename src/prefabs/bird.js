import Util from '../util';

export default class Bird extends Phaser.Sprite {
    constructor(game, x, y, key) {
        super(game, x, y, key, 1);

        this.alive = true;
        this.animations.add('fly', [0, 1, 2, 0, 1, 2], 5, false);
        Util.vcenter(this, this.game.world);
        this.anchor.set(0.3, 0.5);
        this.game.physics.enable(this);
        this.body.allowGravity = false;
        this.body.immovable = false;
        this.body.collideWorldBounds = true;

        this.wing = game.add.audio('wing');

        this.tween = this.game.add.tween(this).to({ y: this.y - 10 }, 400, Phaser.Easing.Default.In, false, 0, -1, true);
        this.tween.start();
    }

    fly() {
        if (this.body && this.body.allowGravity) {
            if (!this.alive) return;

            let tween = this.game.add.tween(this);
            tween.to({ angle: -30 }, 100);
            tween.start();
            this.body.velocity.y = -200;
            this.wing.play();
            this.play('fly');
            this.tween.pause();
        } else {
            this.tween.resume();
        }
        this.play('fly');
    }

    update() {
        if (!this.body || !this.body.allowGravity) this.fly();
        else if (this.alive) this.angle += 2;
    }

    start() {
        this.body.allowGravity = true;
        this.tween.pause();
    }

    die(callback, callbackContext) {
        this.alive = false;
        // this.body.immovable = immovable;

        // die animation
        let tween = this.game.add.tween(this);
        tween.to({ angle: 90 }, 500, Phaser.Easing.Exponential.In);
        this.body.immovable = false;
        tween.start();
        tween.onComplete.add(callback, callbackContext);
    }

    reset() {
        this.body.allowGravity = false;
        this.body.immovable = false;
        Util.vcenter(this, this.game.world);
        this.angle = 0;
        this.alive = true;
        this.body.gravity.y = 0;
    }
} 
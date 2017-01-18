export default class Ground extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0, 'ground');

        this.game.physics.enable(this);
        this.y = game.world.height - this.height;
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.body.velocity.x = -100;
    }

    stop() {
        this.body.velocity.x = 0;
    }

    reset() {
        this.body.velocity.x = -60;
    }

    update() {
        super.update();
        this.x = this.x <= this.game.world.width - this.width ? 0 : this.x;
    }
}
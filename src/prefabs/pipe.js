export default class Pipe extends Phaser.Group {
    constructor(game, parent) {
        super(game, parent);
        let world = game.world;

        this.enableBody = true;
        
        this.topPipe = this.create(world.width, 0, 'pipe-top');
        this.topPipe.y = (Math.floor(Math.random() * 5) + 1) * world.height / 8 - this.topPipe.height;

        this.bottomPipe = this.create(world.width, 0, 'pipe-bottom');
        this.bottomPipe.y = this.topPipe.y + this.topPipe.height + world.height / 8 * 2;

        this.pass = false;

        this.setAll('body.allowGravity', false);
        this.setAll('body.immovable', true);
        this.setAll('body.velocity.x', -100);
        this.setAll('checkWorldBounds', true);
        this.setAll('outOfBoundsKill', true);
    }

    stop() {
        this.setAll('body.velocity.x', 0);
    }
}
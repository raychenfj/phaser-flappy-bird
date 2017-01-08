import Util from '../util';

class Menu extends Phaser.State {

    constructor() {
        super();

        this.background = null;
        this.ground = null;
        this.bird = null;
        this.title = null;
        this.start = null;
        this.swooshing = null;
    }

    init() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    create() {
        let add = this.game.add;
        let world = this.game.world;

        // background
        this.background = add.sprite(0, 0, 'day');

        // ground
        this.ground = add.sprite(0, 240, 'ground');
        this.physics.enable(this.ground);
        this.ground.body.velocity.x = -100;

        // flappy bird title
        this.title = add.sprite(0, 0, "title");
        Util.hcenter(this.title, world);
        this.title.y = 50;

        // bird
        this.bird = add.sprite(62.5, 0, 'bird');
        this.bird.animations.add('fly', [0, 1, 2], 10, false);
        Util.center(this.bird, world);
        add.tween(this.bird).to({ y: this.bird.y - 10 }, 400, Phaser.Easing.Default.In, true, 0, -1, true);

        // start button
        this.start = add.button(0, 0, 'start', () => {
            let tween = add.tween(this.start).to({ y: this.start.y + 5 }, 100, Phaser.Easing.Default.In, true, 0, 0, true);
            tween.onComplete.add(this.startGame, this);
        });
        Util.hcenter(this.start, world);
        this.start.y = 180;

        // audio
        this.swooshing = add.audio('swooshing');
    }

    update() {
        this.bird.play('fly');
        if (this.ground.x <= -24) this.ground.x = 0;
    }

    startGame() {
        this.swooshing.play();
        let tween = this.game.add.tween(this.game.world).to({ alpha: 0 }, 200, Phaser.Easing.Default.In, true);
        tween.onComplete.add(() => {
            this.game.state.start('game')
        });
    }
}

export default Menu;

import StartButton from './start-button';
import Util from '../util';

export default class MainMenu extends Phaser.Group {
    constructor(game, parent) {
        super(game, parent, 'main menu', false, false);

        let add = game.add;
        let world = game.world;

        this.title = this.create(0, 0, 'title');
        Util.hcenter(this.title, world);
        this.title.y = 50;

        this.start = new StartButton(game, 0, 180, this.onStartGame, this);

        // this.swooshing = add.audio('swooshing');

        this.addMultiple([this.title, this.start], true);
    }

    onStartGame() {
        // this.swooshing.play();
        let tween = this.game.add.tween(this.game.world).to({ alpha: 0 }, 200, Phaser.Easing.Default.In, true);
        tween.onComplete.add(() => {
            this.game.state.start('game')
        });
    }
}
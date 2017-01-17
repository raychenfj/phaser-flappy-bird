import Util from '../util';

export default class StartButton extends Phaser.Button {

    constructor(game, x, y, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
        // callback decorator
        let swooshing = game.add.audio('swooshing');
        let decorator = () => {
            swooshing.play();
            let tween = game.add.tween(this).to({ y: y + 5 }, 100, Phaser.Easing.Default.In, true, 0, 0, true);
            tween.onComplete.add(callback, callbackContext);
        }

        super(game, x, y, 'start', decorator, callbackContext, overFrame, outFrame, downFrame, upFrame);

        this.x ? 0 : Util.hcenter(this, game.world);
    }
}
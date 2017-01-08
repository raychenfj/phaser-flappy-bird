class Boot extends Phaser.State {

    constructor() {
        super();
    }

    init() {
        this.game.renderer.renderSession.roundPixels = true;
    }

    create() {
        this.game.input.maxPointers = 1;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        //setup device scaling
        if (!this.game.device.desktop) {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.minWidth = 144;
            this.game.scale.minHeight = 256;
            this.game.scale.maxWidth = 432;
            this.game.scale.maxHeight = 768;
            this.game.scale.forceOrientation(true);
        } else {
            this.game.scale.minWidth = this.game.scale.maxWidth = 432;
            this.game.scale.minHeight = this.game.scale.maxHeight = 768;
        }

        this.game.state.start('preloader');
    }
}

export default Boot;

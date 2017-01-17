import Util from '../util';

export default class Ready extends Phaser.Group {
    constructor(game, parent) {
        super(game, parent)

        this.ready = this.create(0, 0, 'ready');
        this.tap = this.create(0, 50, 'tap');
        Util.hcenter(this.tap, this);
        Util.center(this, parent);
    }

    hide(){
        this.visible = false;
    }

    show(){
        this.visible = true;
    }
}
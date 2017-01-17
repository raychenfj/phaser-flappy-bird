import Util from '../util';

export default class Score extends Phaser.Group {
    constructor(game, type, parent, name) {
        type = type || '';
        super(game, parent, name, false, false);
        this.type = type;
        this._score = 0;
        this.parent = parent;
        this.create(0, 0, this.type + '0');
    }

    get score() {
        return this._score;
    }

    set score(score) {
        this._score = Math.round(score);
        let text = this._score.toString();
        this.removeAll();
        let x = 0;
        let originWidth = this.width;
        for (let i = 0; i < text.length; i++) {
            x += this.create(x, 0, this.type + text[i]).width;
        }
    }

    reset() {
        this.score = 0;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }
}
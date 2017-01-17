import Score from './score';

const localStorageKey = 'flappy-bird-best';

export default class Board extends Phaser.Group {
    constructor(game, parent, name) {
        super(game, parent, name, false, false);

        this.board = this.create(0, 0, 'board');
        this.score = new Score(game, 'md', this);
        this.score.y = 17;
        this.score.x = 101 - this.score.width;
        this.best = new Score(game, 'md', this);
        let best = localStorage.getItem(localStorageKey);
        if (best) {
            this.best.score = Number.parseInt(best);
        }
        this.best.y = 38;
        this.best.x = 101 - this.best.width;
        this.medal = null;
    }

    setScore(score) {
        this.score.score = score;
        let medal = '';
        if (score >= 10 && score < 20) {
            medal = 'bronze';
        } else if (score >= 20 && score < 20) {
            medal = 'silver';
        } else if (score >= 30 && score < 20) {
            medal = 'gold';
        } else if (score >= 40) {
            medal = 'platinum';
        }
        if (medal) {
            this.medal = this.create(14, 21, medal);
        }

        if (score > this.best.score) {
            // only update the localstoreage , but not update best score here, the tween in gameover.js will do this
            localStorage.setItem(localStorageKey, score);
        }
    }
}
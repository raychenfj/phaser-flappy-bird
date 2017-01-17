import Boot from './states/boot';
import Game from './states/game';
import Menu from './states/menu';
import Preloader from './states/preloader';


const game = new Phaser.Game(144, 256, Phaser.AUTO, 'phaser-flappy-bird-game', null, true);

game.state.add('boot', new Boot());
game.state.add('preloader', new Preloader());
game.state.add('menu', new Menu());
game.state.add('game', new Game());

game.state.start('boot');

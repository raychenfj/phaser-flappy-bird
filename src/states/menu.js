import Util from '../util';
import Ground from '../prefabs/ground';
import MainMenu from '../prefabs/main-menu';
import Bird from '../prefabs/bird';

class Menu extends Phaser.State {

    constructor() {
        super();

        this.background = null;
        this.ground = null;
        this.mainMenu = null;
        this.title = null;
    }

    init() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    create() {
        let add = this.game.add;
        let world = this.game.world;
        let game = this.game;

        this.background = add.sprite(0,0,'day');

        this.ground = new Ground(game);
        add.existing(this.ground);

        this.mainMenu = new MainMenu(game,world);

        this.bird = new Bird(game,0,0,'bird');
        add.existing(this.bird);
        Util.hcenter(this.bird,world);
    }
}

export default Menu;

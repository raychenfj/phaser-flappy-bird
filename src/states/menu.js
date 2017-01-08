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

        // this.background.height = this.game.world.height;
        // this.background.width = this.game.world.width;

        // //add some fancy transition effects
        // this.ready = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'text_ready');
        // this.ready.anchor.set(0.5,0.5);
        // this.ready.visible=false;
        // this.go = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'text_go');
        // this.go.anchor.set(0.5,0.5);
        // this.go.visible=false;

        // //add intro text
        // this.menuText = this.add.text(this.game.world.centerX,this.game.world.centerY, 'Click to play', {
        //   font: '42px Arial', fill: '#ffffff', align: 'center'
        // });
        // this.menuText.anchor.set(0.5);

        // this.input.onDown.add(this.onInputDown, this);
        // this.canContinueToNextState = true;
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
        // tween.start();
    }

    //create some cool tweens and apply them to 'this.ready' and 'this.go'
    onInputDown() {
        // if( ! this.canContinueToNextState){ //do not allow tweens to be created multiple times simultaneously
        //   return;
        // }

        // this.canContinueToNextState = false;
        // this.ready.visible = true;
        // this.menuText.visible = false;
        // this.go.angle = -15;

        // //create some tweens - http://phaser.io/docs/2.6.2/Phaser.Tween.html#to
        // const ready_tween = this.game.add.tween(this.ready.scale)
        //   .to({ x: 1.5, y: 1.5}, 500, Phaser.Easing.Linear.In,false,0,-1,true);

        // const go_tween = this.game.add.tween(this.go)
        //   .to({ angle: 15}, 200, Phaser.Easing.Linear.In,false,0,-1,true);

        // //when the 'ready' tween is done, hide it and show 'go'. perform a shaking/rotating tween on 'go'. When 'go' is done, start the game
        // var go_tween_repeat_num = 3; //how many times these tweens should loop
        // var ready_tween_repeat_num = 3;

        // const go_tween_loop = function(){
        //   go_tween_repeat_num -= 0.5;
        //   if(go_tween_repeat_num < 1){
        //     this.go.visible = false;
        //     this.game.state.start('game');
        //   }
        // };
        // const ready_tween_loop = function(){
        //   ready_tween_repeat_num -= 0.5;
        //   if(ready_tween_repeat_num < 1){
        //     this.ready.visible = false;
        //     this.go.visible = true;

        //     go_tween.start();
        //   }
        // };
        // ready_tween.onLoop.add(ready_tween_loop, this);
        // go_tween.onLoop.add(go_tween_loop, this);


        // ready_tween.start();
    }

}

export default Menu;

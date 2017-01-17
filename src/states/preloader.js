class Preloader extends Phaser.State {

  constructor() {
    super();
    this.asset = null;
    this.ready = false;
  }

  preload() {
    //Setup loading and its events
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.loadResources();
  }

  loadResources() {
    let image = this.load.image.bind(this.load);
    let spritesheet = this.load.spritesheet.bind(this.load);
    let audio = this.load.audio.bind(this.load);

    // Images
    image('day', 'assets/background/day.png');
    image('pipe-top', 'assets/pipes/pipe_top.png');
    image('pipe-bottom', 'assets/pipes/pipe_bottom.png');
    image('ground', 'assets/background/ground.png');
    image('board', 'assets/board.png');

    // Text
    ['title', 'ready', 'tap', 'over'].forEach(el => image(el, `assets/text/${el}.png`));

    // Numbers
    for (let i = 0; i < 10; i++) {
      image(i, 'assets/numbers/' + i + '.png');
      image('md'+i, 'assets/numbers/md' + i + '.png');
    }

    // Buttons
    image('start', 'assets/buttons/start.png');

    // Spritesheet
    spritesheet('bird', 'assets/birds/bird.png', 19, 14);

    // Audio
    ['die', 'hit', 'point', 'swooshing', 'wing'].forEach(el => audio(el, `assets/audio/${el}.wav`));

    // Medals
    ['bronze','gold','platinum','silver'].forEach(el=>image(el,`assets/medals/${el}.png`));
  }

  onLoadComplete() {
    this.game.state.start('menu');
  }
}

export default Preloader;

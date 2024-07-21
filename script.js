//roach game!
import Items from './items.js';

var player;
var spider;
var cursors;
var gameOver = false;
var timer;

const moveSystem = (player) => {
   const player_pos = new Phaser.Math.Vector2(player.x, player.y)

   let mousePlayerDiff = player_pos.subtract(game.input.mousePointer.position)
   const mpd_mag = mousePlayerDiff.length()
    mousePlayerDiff.normalize()

    var roach_speed = 2 * mpd_mag

    player.setVelocityX(-mousePlayerDiff.x * roach_speed);
    player.setVelocityY(-mousePlayerDiff.y * roach_speed);

    Phaser.Actions.Rotate(player, game.loop.frame * .1)
}


const spawnItem = (ctx) => {
    console.log('spawn ctx', ctx);
    const item = new Items(ctx);
    const newItem =  item.createNewItem();
    ctx.physics.add.collider(player, newItem);
    ctx.items.forEach(item => {
        ctx.physics.add.collider(item, newItem);
        ctx.physics.add.collider(spider, newItem);
    })
    ctx.items.push(newItem);

}

class MainScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('roach', 'assets/roach_32.png')
        this.load.image('spider', 'assets/spider_64.png')

        ///////scenery
        this.load.image('can-i', 'assets/soda-can.png');
        this.load.image('leaf_s-m', 'assets/maple-leaf.png');
        this.load.image('leaf_l-m', 'assets/leaf_64.png');
        this.load.image('rock-i', 'assets/rock_48.png');
        this.load.image('stone-i', 'assets/stone_96.png');


        ////shader
        this.load.glsl('fire', 'assets/shader/shader0.frag');

    }

    create() {

        this.items = []
        this.timer = this.time.addEvent({
            delay: 2400,                // ms
            callback: () => spawnItem(this),
            //args: [],
            callbackScope: this,
            loop: true
        });

        this.add.image(400, 300, 'sky');

        player = this.physics.add.image(100, 450, 'roach');
        player.setCollideWorldBounds(true);

        spider = this.physics.add.image(300, 150, 'spider');
        spider.setCollideWorldBounds(true);

        this.physics.add.collider(player, spider);

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
    }


    update() {
        if (gameOver) {
            return;
        }

        moveSystem(player)
    }


}
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false,
            debug: false
        }
    },
    scene: MainScene
};

var game = new Phaser.Game(config);

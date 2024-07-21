//roach game!
import Items from './items.js';

var player;
var playerHealth;
var spider;
var spiderRadius;
var cursors;
var gameOver = false;
var timer;

const findAngle = (mousePlayerDiff, player) => {
    let angle = Phaser.Math.Angle.Between(0, 0, mousePlayerDiff.x, mousePlayerDiff.y);
    let degree = Phaser.Math.RadToDeg(angle); 
    handleAnimation(degree, player)
}

const handleAnimation = (angle, player) => {
        // Define the angle ranges for each direction
        if (angle >= -45 && angle < 45) {
            player.anims.play('left', true);

           // console.log('left');
            // Right animation
        } else if (angle >= 45 && angle < 135) {
            player.anims.play('up', true);

            //console.log('up');
            // Down animation
        } else if (angle >= 135 || angle < -135) {
            player.anims.play('right', true);

            //console.log('right');
            // Left animation
        } else if (angle >= -135 && angle < -45) {
            player.anims.play('down', true);

            //console.log('down');
            // Up animation
        }
}

const moveSystem = (player) => {
    let player_pos = new Phaser.Math.Vector2(player.x,player.y)
    let spider_pos = new Phaser.Math.Vector2(spider.x,spider.y)
    let mousePlayerDiff = player_pos.clone()

    mousePlayerDiff.subtract(game.input.mousePointer.position)
    findAngle(mousePlayerDiff, player);


    let mpd_mag = mousePlayerDiff.length()
    mousePlayerDiff.normalize()

    let playerSpiderDiff = player_pos.clone()
    playerSpiderDiff.subtract(spider_pos)

    let psd_mag = playerSpiderDiff.length()
    playerSpiderDiff.normalize()

    var roach_speed  = mpd_mag
    var spider_speed = 2.4*psd_mag

    player.setVelocityX(-mousePlayerDiff.x * roach_speed);
    player.setVelocityY(-mousePlayerDiff.y * roach_speed); 

    if(psd_mag < 128)
    {
        spider.setVelocityX(playerSpiderDiff.x * spider_speed);
        spider.setVelocityY(playerSpiderDiff.y * spider_speed); 
    }
}


const spawnItem = (ctx) => {
    const item = new Items(ctx);
    const newItem =  item.createNewItem();
    ctx.physics.add.collider(player, newItem);
    ctx.physics.add.collider(spider, newItem);

    ctx.items.forEach(item => {
        ctx.physics.add.collider(item, newItem);
    })
    ctx.items.push(newItem);

}




class HealthBar {

    constructor (scene, x, y)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 76 / 100;

        this.draw();

        scene.add.existing(this.bar);
    }

    decrease (amount)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 80, 16);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);

        if (this.value < 30)
        {
            this.bar.fillStyle(0xff0000);
        }
        else
        {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

}

class MainScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', 'assets/background.png');
        //this.load.image('roach', 'assets/roach_32.png')
        this.load.image('spider', 'assets/spider_64.png')
        this.load.spritesheet("roach", "assets/cockroach-spritesheet.png", 
            {frameWidth: 64, frameHeight: 64});

        ///////scenery
        this.load.image('can-i', 'assets/soda-can.png');
        this.load.image('leaf_s-m', 'assets/maple-leaf.png');
        this.load.image('leaf_l-m', 'assets/green-leaf.png');
        this.load.image('rock-i', 'assets/rock_48.png');
        this.load.image('stone-i', 'assets/stone_96.png');


        ////shader
        // this.load.glsl('fire', 'assets/shader/shader0.frag');

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


        this.graphics = this.add.graphics();

        const color = 0xffff00;
        const thickness = 2;
        const alpha = 1;

        this.graphics.lineStyle(thickness, color, alpha);

        const a = new Phaser.Geom.Point(0, 0);
        const radius = 128;

        spiderRadius = this.graphics.strokeCircle(a.x, a.y, radius);

        player = this.physics.add.sprite(64, 64, 'roach');
        player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('roach', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('roach', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });        
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('roach', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });        
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('roach', { start: 6, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        playerHealth = new HealthBar(this,-36,-43)


        spider = this.physics.add.image(300, 150, 'spider');
        spider.setCollideWorldBounds(true);
        this.physics.add.collider(
            player,
            spider,
            null,
            (pl, sp) => {
                playerHealth.value = (playerHealth.value - 1)
                playerHealth.draw()
                if(playerHealth.value < 0 ) { gameOver = true; }
            }
        )

        // this.physics.add.collider(player, spider);

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
    }


    update() {
        if (gameOver) {
            this.add.text(250, 250, 'Game Over', {backgroundColor:'red', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: 100 }, );  
            cursors = this.input.keyboard.createCursorKeys();
            if(cursors.space.isDown){
                location.reload();
            }
            return;
        }

        spiderRadius.x = spider.x
        spiderRadius.y = spider.y
        playerHealth.bar.x = player.x
        playerHealth.bar.y = player.y

        moveSystem(player)


    }


}
var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 800,
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

//roach game!



var player;
var spider;
var cursors;
var gameOver = false;
var timer;


const getRandCoord = (ctx) => {
    return new Phaser.Math.Vector2(800*Math.random(),600*Math.random())
}
var ItemNames = ['stone-i','rock-i','leaf_l-m','leaf_s-m','can-i']
var NumItems = 8

const genItems = (ctx) => {
    for(let i=0;i<NumItems;i++)
    {
        let pos = getRandCoord()
        ctx.items.push(ctx.add.image(pos.x,pos.y, ItemNames[Math.floor(Math.random()*5)]))

    }
}


const moveSystem = () => {

    if((game.loop.frame)%30 == 0)
    {
        player_pos = new Phaser.Math.Vector2(player.x,player.y)

        mousePlayerDiff = player_pos.subtract(game.input.mousePointer.position)
        mpd_mag = mousePlayerDiff.length()
        mousePlayerDiff.normalize()



        var roach_speed =  mpd_mag

        player.setVelocityX(-mousePlayerDiff.x * roach_speed);
        player.setVelocityY(-mousePlayerDiff.y * roach_speed); 

        Phaser.Actions.Rotate(player,game.loop.frame*.1)

    }

}

const createItem = (ctx) => {
    const mapLocation = getRandCoord();
    const itemName = ItemNames[Math.floor(Math.random()*5)]
    let newItem = ctx.physics.add.image(mapLocation.x, mapLocation.y, itemName);
    newItem.angle = 360 * Math.random();
    newItem.setCollideWorldBounds(true);
    if (itemName.slice(-1) === 'i'){
        newItem.body.immovable = true;
    } 
        ctx.physics.add.collider(player, newItem);
    
    return newItem;
}

const spawnItem = (ctx) => {
    console.log('item Placed');
    const newItem = createItem(ctx);
    ctx.items.forEach(item => {
        ctx.physics.add.collider(item, newItem);
    })
    ctx.items.push(newItem);

}

class MainScene extends Phaser.Scene 
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('roach','assets/roach_32.png')
        this.load.image('spider','assets/spider_64.png')

        ///////scenery
        this.load.image('can-i', 'assets/can_32.png');
        this.load.image('leaf_s-m', 'assets/leaf_32.png');
        this.load.image('leaf_l-m', 'assets/leaf_64.png');
        this.load.image('rock-i', 'assets/rock_48.png');
        this.load.image('stone-i', 'assets/stone_96.png');


        ////shader
        this.load.glsl('fire','assets/shader/shader0.frag');

    }

 create ()
{

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


 update ()
{
    if (gameOver)
    {
        return;
    }

    moveSystem()
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

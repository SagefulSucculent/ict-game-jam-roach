//roach game!



var player;
var spider;
var cursors;
var gameOver = false;



const getRandCoord = (ctx) => {
    return new Phaser.Math.Vector2(800*Math.random(),600*Math.random())
}
var ItemNames = ['stone','rock','leaf_l','leaf_s','can']
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
        this.load.image('can', 'assets/can_32.png');
        this.load.image('leaf_s', 'assets/leaf_32.png');
        this.load.image('leaf_l', 'assets/leaf_64.png');
        this.load.image('rock', 'assets/rock_48.png');
        this.load.image('stone', 'assets/stone_96.png');


        ////shader
        this.load.glsl('fire','assets/shader/shader0.frag');

    }

 create ()
{

    this.items = []
    
    this.add.image(400, 300, 'sky');
    genItems(this);
    this.items.forEach(i=>{
        i.angle = 360 * Math.random()
        console.log(i.angle)      
    })

    player = this.physics.add.image(100, 450, 'roach');
    player.setBounce(0.2);
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

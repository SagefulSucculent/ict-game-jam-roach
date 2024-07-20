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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);



function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('roach','assets/roach_32.png')

    ///////scenery
    this.load.image('can', 'assets/can_32.png');
    this.load.image('leaf_s', 'assets/leaf_32.png');
    this.load.image('leaf_l', 'assets/leaf_64.png');
    this.load.image('rock', 'assets/rock_48.png');
    this.load.image('stone', 'assets/stone_96.png');

}


const getRandCoord = () => {
    return new Phaser.Math.Vector2(600*Math.random(),800*Math.random())
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

function create ()
{
    //  A simple background for our game
    this.items = []

    this.add.image(400, 300, 'sky');
    genItems(this);
    //console.log(this.items)
    this.items.forEach(i=>{
        i.angle = 360 * Math.random()
        console.log(i.angle)
        
    })

    player = this.physics.add.image(100, 450, 'roach');


    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);



    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

}


function update ()
{
    if (gameOver)
    {
        return;
    }

    moveSystem()

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

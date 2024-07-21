class Items {
    constructor(ctx) {
        this.ctx = ctx
        this.names = ['stone-i', 'rock-i', 'leaf_l-m', 'leaf_s-m', 'can-i'];
    }
    getRandomName() {
        return this.names[Math.floor(Math.random() * this.names.length)];
    }

    getRandCoord = () => {
        return new Phaser.Math.Vector2(800 * Math.random(), 600 * Math.random())
    }
    
    createNewItem() {
        console.log('ctx', this.ctx)
        const mapLocation = this.getRandCoord();
        const itemName = this.getRandomName();
        let newItem = this.ctx.physics.add.image(mapLocation.x, mapLocation.y, itemName);
        newItem.angle = 360 * Math.random();
        newItem.setCollideWorldBounds(true);
        if (itemName.slice(-1) === 'i') {
            newItem.body.immovable = true;
        }
        

        return newItem;
    }
}

export default Items;
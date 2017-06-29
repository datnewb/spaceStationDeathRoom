class Shooter {
    constructor(sprite, index) {
        this.sprite = sprite;
        this.sprite.position.x = SHOOTERINFO[index][0];
        this.sprite.position.y = SHOOTERINFO[index][1];
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.shootStart = randomInt(LEVEL.shooterRandomStartMin, LEVEL.shooterRandomStartMax);
        this.shootTime = game.time.now + this.shootStart;

        this.sprite.angle = SHOOTERINFO[index][2];
        this.shootDirection = this.sprite.angle;

        this.takenIndex = index;
        this.shouldFire = false;

        this.bulletSpawnX = this.sprite.width / 2 * Math.cos(degToRad(this.shootDirection)) + this.sprite.position.x;
        this.bulletSpawnY = this.sprite.height / 2 * Math.sin(degToRad(this.shootDirection)) + this.sprite.position.y;

        this.hitSprite = null;
    }

    update() {
        if (game.time.now >= this.shootTime) {
            this.shouldFire = true;
        }
    }

    hasFired() {
        this.shouldFire = false;
        this.shootTime = game.time.now + LEVEL.shooterInterval;

        console.log("current time is " + game.time.now);
        console.log("next shoot time is " + this.shootTime);
    }

    hit() {
        if (this.hitSprite != null) {
            this.hitSprite.visible = true;
        }
        else {
            this.hitSprite = game.add.sprite(this.sprite.position.x, this.sprite.position.y, 'shield');
        }
    }
}
class SpaceMan {
    constructor(sprite) {
        this.sprite = sprite;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        game.physics.arcade.enable(this.sprite);
        this.sprite.body.bounce.x = 1.0;
        this.sprite.body.bounce.y = 1.0;
        this.sprite.body.collideWorldBounds = true;
        
        this.spinSpeed = 2;

        this.isFiring = false;
        this.canFire = true;

        this.weapon = new Lazer();

        this.hasFlashed = false;
        this.flashFrames = 0;
    }

    update() {
        // Spin the player
        if (!this.isFiring || this.weapon.keepRotationWhileFiring) {
            this.sprite.angle += this.spinSpeed;
        }

        // Check if gun is still firing
        if (this.isFiring) {
            if (this.weapon.keepRotationWhileFiring) {
                this.updateVelocity();
            }

            if (game.time.now >= this.fireTime + this.weapon.fireStay) {
                this.isFiring = false;

                if (this.weapon.weaponType == WEAPONS.LAZER) {
                    this.weapon.stopFiring();
                }
            }

            if (this.weapon.weaponType == WEAPONS.LAZER) {
                this.weapon.updatePositionAndRotation(this.sprite.position, this.sprite.rotation);
            }
        }

        if (this.hasFlashed) {
            this.flashFrames++;
            if (this.flashFrames >= 5) {
                this.sprite.tint = 0xffffff;
                this.hasFlashed = false;
                this.flashFrames = 0;
            }
        }

        // Check if the gun can fire again
        if (!this.canFire) {
            if (game.time.now >= this.fireTime + this.weapon.fireCooldown) {
                this.canFire = true;

                this.sprite.tint = 0xaaaaff;
                this.hasFlashed = true;
            }
        }
    }

    fire() {
        if (!this.isFiring && this.canFire) {
            game.camera.shake(0.01, 50);
            
            this.isFiring = true;
            this.canFire = false;
            this.fireTime = game.time.now;

            if (!this.weapon.keepRotationWhileFiring) {
                this.updateVelocity();
            }

            if (this.weapon.weaponType == WEAPONS.LAZER) {
                this.weapon.fire(this.sprite.position, this.sprite.rotation);
            }
        }
    }

    updateVelocity() {
        var moveAngleDeg = this.sprite.angle - 180;
        var moveAngleRad = degToRad(moveAngleDeg);
        var moveX = this.weapon.moveSpeed * Math.cos(moveAngleRad);
        var moveY = this.weapon.moveSpeed * Math.sin(moveAngleRad);

        this.sprite.body.velocity.x = moveX;
        this.sprite.body.velocity.y = moveY;
    }
}
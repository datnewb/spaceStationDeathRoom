class SpaceMan {
    constructor(sprite) {
        this.sprite = sprite;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        game.physics.arcade.enable(this.sprite);
        this.sprite.body.bounce.x = 1.0;
        this.sprite.body.bounce.y = 1.0;
        this.sprite.body.collideWorldBounds = true;
        
        this.spinSpeed = 3;

        this.isFiring = false;
        this.canFire = true;

        this.weapon = new Lazer();
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

        // Check if the gun can fire again
        if (!this.canFire) {
            if (game.time.now >= this.fireTime + this.weapon.fireCooldown) {
                this.canFire = true;
            }
        }
    }

    fire() {
        if (!this.isFiring) {
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
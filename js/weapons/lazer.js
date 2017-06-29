class Lazer {
    constructor() {
        this.weaponType = WEAPONS.LAZER;

        this.moveSpeed = 200;
        this.fireStay = 1000;
        this.fireCooldown = 2500;
        this.keepRotationWhileFiring = true;

        this.sprite = null;
    }

    fire(position, rotation) {
        this.sprite = game.add.sprite(position.x, position.y, 'lazer');
        this.sprite.anchor.x = -0.01;
        this.sprite.anchor.y = 0.35;

        var lazerSound = game.add.audio('sfx_lazer');
        lazerSound.play('', 0, 0.5, false);

        this.updatePositionAndRotation(position, rotation);
    }

    stopFiring() {
        this.sprite.kill();
        this.sprite = null;
    }

    updatePositionAndRotation(position, rotation) {
        if (this.sprite != null) {
            this.sprite.position = position;
            this.sprite.rotation = rotation;
        }
    }
}
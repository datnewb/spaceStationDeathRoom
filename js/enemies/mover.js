class Mover {
    constructor(sprite, index) {
        this.sprite = sprite;
        this.sprite.position.x = MOVERSPAWNS[index][0];
        this.sprite.position.y = MOVERSPAWNS[index][1];
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.body.bounce.x = 1.0;
        this.sprite.body.bounce.y = 1.0;

        var moveStart = randomInt(LEVEL.moverRandomStartMin, LEVEL.moverRandomStartMax);
        this.moveStart = game.time.now + moveStart;

        this.moveStop = 0;

        this.isMoving = false;
    }

    update() {
        if (this.isMoving) {
            if (game.time.now >= this.moveStop) {
                // Stop moving
                this.sprite.body.velocity.x = 0;
                this.sprite.body.velocity.y = 0;
                this.moveStart = game.time.now + LEVEL.moverStopTime;
                this.isMoving = false;
            }
        }
        else {
            if (game.time.now >= this.moveStart) {
                // Start moving at a random direction
                var moveAngle = degToRad(randomInt(-180, 180));
                this.sprite.body.velocity.x = LEVEL.moverSpeed * Math.cos(moveAngle);
                this.sprite.body.velocity.y = LEVEL.moverSpeed * Math.sin(moveAngle);

                this.moveStop = game.time.now + LEVEL.moverMoveTime;
                this.isMoving = true;
            }
        }
    }

    kill() {
        this.sprite.kill();
    }
}
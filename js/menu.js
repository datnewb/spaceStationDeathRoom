var menuState = {

    hasFired : false,
    fireTime : null,
    spaceman : null,
    lazer : null,
    bgm : null,

    create : function() {
        this.spaceman = game.add.sprite(150, SCREEN_CENTER.Y + 50, 'title_spaceman');
        this.spaceman.anchor.x = 0.5;
        this.spaceman.anchor.y = 0.5;
        game.physics.arcade.enable(this.spaceman);

        this.lazer = game.add.sprite(0, 0, 'title_lazer');
        this.lazer.anchor.x = -0.07;
        this.lazer.anchor.y = 0.35;
        this.lazer.visible = false;
        this.spaceman.addChild(this.lazer);

        var title = game.add.sprite(SCREEN_CENTER.X, 100, 'title');
        title.anchor.x = 0.55;

        var start = game.add.sprite(SCREEN_WIDTH - 64, SCREEN_HEIGHT - 64, 'start');
        start.anchor.x = 1;
        start.anchor.y = 1;

        game.input.inputEnabled = true;
        game.input.onTap.add(this.fire, this);

        this.bgm = game.add.audio('music_title');
        this.bgm.play('', 0, 0.25, true);
    },

    update : function() {
        if (this.hasFired) {
            if (game.time.now >= this.fireTime) {
                this.goToPlayMode();
            }

            var velocity = 2000;
            var moveAngle = degToRad(this.spaceman.angle + 180);
            this.spaceman.body.velocity.x = velocity * Math.cos(moveAngle);
            this.spaceman.body.velocity.y = velocity * Math.sin(moveAngle);
        }
        else {
            this.spaceman.angle += 0.05;
        }
    },

    fire : function() {
        if (this.hasFired) {
            return;
        }

        this.fireTime = game.time.now + 2000;
        this.hasFired = true;

        this.lazer.visible = true;

        var lazerSound = game.add.audio('sfx_lazer');
        lazerSound.play('', 0, 0.5, false);

        this.bgm.stop();
    },

    goToPlayMode : function() {
        game.state.start(APPSTATE.PLAY);
    }

};
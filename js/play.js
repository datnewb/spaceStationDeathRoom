var playState = {

    spaceman            : null,

    groupBounds         : null,

    groupMovers         : null,
    moversList          : null,

    groupShooters       : null,
    shootersList        : null,

    groupShooterBullets : null,

    scoreScreen         : null,
    scoreScreenText     : null,

    startText           : null,

    scoreText           : null,

    comboText           : null,
    comboTextTime       : null,

    canRetry            : false,

    musicScoreScreen    : null,

    create : function() {

        // Background
        game.add.sprite(0, 0, 'background');

        // Bounds
        groupBounds = game.add.group();
        groupBounds.enableBody = true;
        
        var leftBound = groupBounds.create(0, 0, 'bounds_lr');
        leftBound.body.immovable = true;

        var rightBound = groupBounds.create(SCREEN_WIDTH, 0, 'bounds_lr');
        rightBound.anchor.x = 1;
        rightBound.body.immovable = true;

        var topBound = groupBounds.create(0, -110, 'bounds_tb');
        topBound.body.immovable = true;

        var bottomBound = groupBounds.create(0, SCREEN_HEIGHT - 45, 'bounds_tb');
        bottomBound.body.immovable = true;

        comboText = game.add.text(100, SCREEN_CENTER.Y + 10, '4x', { fontSize: '48px', fill: '#444' });
        comboText.visible = false;

        scoreText = game.add.text(SCREEN_WIDTH - 85, SCREEN_CENTER.Y - 3, ' ', { fontSize: '36px', fill: '#444' });
        scoreText.anchor.x = 1;

        // Moving enemies
        groupMovers = game.add.group();
        groupMovers.enableBody = true;

        moversList = new Array();

        // Shooting enemies
        groupShooters = game.add.group();

        shootersList = new Array();

        // Shooter bullets
        groupShooterBullets = game.add.group();
        groupShooterBullets.enableBody = true;

        // Player object
        spaceman = new SpaceMan(game.add.sprite(SCREEN_CENTER.X, SCREEN_CENTER.Y, 'spaceman'));

        // Score screen
        scoreScreen = game.add.sprite(SCREEN_CENTER.X, SCREEN_CENTER.Y, 'screen_score');
        scoreScreen.anchor.x = 0.5;
        scoreScreen.anchor.y = 0.5;
        scoreScreen.scale.y = 0;

        scoreScreenText = game.add.text(-SCREEN_CENTER.X + 60, -140, '0000', { fontSize: '72px', fill: '#fff' });
        scoreScreenText.anchor.y = 0.5;
        scoreScreen.addChild(scoreScreenText);

        startText = game.add.sprite(SCREEN_CENTER.X, 600, 'fire');
        startText.anchor.x = 0.5;
        startText.anchor.y = 0.5;

        // Touch the screen to fire
        game.input.inputEnabled = true;
        game.input.onTap.add(this.fire, this);

        LEVEL.reset();
        SCORE.resetScore();
    },

    update : function() {
        game.physics.arcade.collide(spaceman.sprite, groupBounds);
        game.physics.arcade.collide(groupMovers, groupBounds);
        game.physics.arcade.collide(groupMovers);
        game.physics.arcade.collide(groupShooterBullets, groupShooterBullets, this.bulletCollideBullet, null, this);
        game.physics.arcade.collide(groupShooterBullets, groupMovers, this.bulletCollideMover, null, this);

        game.physics.arcade.collide(groupShooterBullets, groupBounds, this.bulletCollideBounds, null, this);
        game.physics.arcade.collide(spaceman.sprite, groupShooterBullets, this.spacemanCollideBullet, null, this);
        game.physics.arcade.collide(spaceman.sprite, groupMovers, this.spacemanCollideMover, null, this);

        if (spaceman.sprite.alive) {
            spaceman.update();

            if (spaceman.isFiring) {
                for(var i = 0; i < moversList.length; i++) {
                    if (this.rayCheckRect(spaceman.weapon.sprite.position, spaceman.sprite.rotation, moversList[i].sprite.getBounds())) {
                        if (moversList[i].sprite.alive) {
                            this.killMover(moversList[i]);
                        }
                    }
                }
            }

            this.updateComboVisual();
        }
        

        if (LEVEL.hasStarted) {
            if (game.time.now >= LEVEL.moverNextSpawnTime && LEVEL.currentMoverCount < LEVEL.moverCount) {
                this.spawnEnemies();
            }
        }

        for (var i = 0; i < moversList.length; i++) {
            if (moversList[i].sprite.alive) {
                moversList[i].update();
            }
        }

        for (var i = 0; i < shootersList.length; i++) {
            shootersList[i].update();
            if (shootersList[i].shouldFire) {

                var bullet = groupShooterBullets.create(shootersList[i].bulletSpawnX, shootersList[i].bulletSpawnY, 'shooter_bullet');
                var shootDirection = degToRad(shootersList[i].shootDirection + randomInt(-45, 46));
                bullet.body.velocity.x = LEVEL.shooterBulletSpeed * Math.cos(shootDirection);
                bullet.body.velocity.y = LEVEL.shooterBulletSpeed * Math.sin(shootDirection);
                bullet.body.bounce.x = 1.0;
                bullet.body.bounce.y = 1.0;
                bullet.anchor.x = 0.5;
                bullet.anchor.y = 0.5;

                var shootSfx = game.add.audio('sfx_shooter');
                shootSfx.play('', 0, 1, false);

                shootersList[i].hasFired();
            }
        }
    },

    fire : function() {
        if (!spaceman.sprite.alive) {
            if (this.canRetry) {
                this.retry();
            }
            return;
        }

        if (!LEVEL.hasStarted) {
            // Start spawning enemies
            LEVEL.moverNextSpawnTime = game.time.now + LEVEL.moverSpawnIntervalPerLevel;
            LEVEL.hasStarted = true;

            startText.kill();
        }

        SCORE.combo = 0;
        
        spaceman.fire();
    },

    killMover : function(mover) {
        mover.kill();

        SCORE.combo++
        SCORE.addScore(10 * SCORE.combo);

        scoreText.text = SCORE.score;

        LEVEL.addKills();

        game.camera.shake(0.01 * SCORE.combo, 150);
    },

    rayCheckRect : function(origin, rotation, targetRect) {
        var xDir = Math.cos(rotation);
        var yDir = Math.sin(rotation);

        var xEnd = origin.x + xDir * 1000;
        var yEnd = origin.y + yDir * 1000;

        var line = new Phaser.Line(origin.x, origin.y, xEnd, yEnd);

        return Phaser.Line.intersectsRectangle(line, targetRect);
    },

    spawnEnemies : function() {
        // get spawn point nearest player to exclude it from spawning
        var excludedSpawn = 0;
        var minDistance = 2000;
        for (var i = 0; i < MOVERSPAWNS.length; i++) {
            var xDist = spaceman.sprite.position.x - MOVERSPAWNS[i][0];
            var yDist = spaceman.sprite.position.y - MOVERSPAWNS[i][1];
            var dist = Math.sqrt(xDist * xDist + yDist * yDist);

            if (minDistance > dist) {
                minDistance = dist;
                excludedSpawn = i;
            }
        }

        var finishedSpawners = new Array();
        // spawn movers
        var i = 0;
        for (; i < 5 && i + LEVEL.currentMoverCount < LEVEL.moverCount; i++) {
            var index = excludedSpawn;
            while (index == excludedSpawn || finishedSpawners.includes(index)) {
                index = randomInt(0, MOVERSPAWNS.length);
            }

            var moverSprite = groupMovers.create(0, 0, 'mover');
            moversList[i + LEVEL.currentMoverCount] = new Mover(moverSprite, index);

            finishedSpawners[i] = index;
        }

        LEVEL.currentMoverCount += i;
        LEVEL.moverNextSpawnTime = game.time.now + LEVEL.moverSpawnInterval;

        // spawn shooters
        var addedShooters = 0;
        if (LEVEL.currentShooterCount < LEVEL.shooterCount) {
            var takenShooters = new Array();
            for (var x = 0; x < shootersList.length; x++) {
                takenShooters[x] = shootersList[x].takenIndex;
            }

            for (var x = LEVEL.currentShooterCount; x < LEVEL.shooterCount; x++) {
                var index = -1;
                while(index < 0 || takenShooters.includes(index)) {
                    index = randomInt(0, SHOOTERINFO.length);
                }

                takenShooters[x] = index;

                var shooterSprite = groupShooters.create(0, 0, 'shooter');
                shootersList[x] = new Shooter(shooterSprite, index);

                addedShooters++;
            }

            LEVEL.currentShooterCount += addedShooters;
        }

        if (addedShooters > 0 || i > 0) {
            var spawnSfx = game.add.audio('sfx_spawn');
            spawnSfx.play('', 0, 1, false);
        }
    },

    bulletCollideBounds : function(bullet, bound) {
        bullet.kill();
    },

    bulletCollideBullet : function(bullet1, bullet2) {
        bullet1.kill();
        bullet2.kill();
    },

    bulletCollideMover : function(bullet, mover) {
        bullet.kill();
    },

    spacemanCollideBullet : function(spaceman, bullet) {
        bullet.kill();

        this.killSpaceman();
    },

    spacemanCollideMover : function(spaceman, mover) {
        this.killSpaceman();
    },

    killSpaceman : function() {
        game.camera.shake(0.01, 250);

        spaceman.sprite.kill();
        if (spaceman.weapon.sprite != null) {
            spaceman.weapon.stopFiring();
        }

        var deathSfx = game.add.audio('sfx_death');
        deathSfx.play('', 0, 1, false);

        this.showScoreScreen();

        var deathSprite = game.add.sprite(spaceman.sprite.position.x, spaceman.sprite.position.y, 'teleport');
        deathSprite.anchor.x = 0.5;
        deathSprite.anchor.y = 0.5;
        deathSprite.scale.x = 0;
        deathSprite.scale.y = 0;
        
        var deathSpriteTween = game.add.tween(deathSprite.scale).to({ x : 1, y : 1 }, 200, Phaser.Easing.Cubic.Out, true, 0);
        deathSpriteTween.onComplete.add(deathSprite.kill, deathSprite);
    },

    playShowScoreScreenAudio : function() {
        var scoreScreenSfx = game.add.audio('sfx_score');
        scoreScreenSfx.play('', 0, 1, false);
    },

    showScoreScreen : function() {
        this.hideComboVisual();
        this.hideScoreVisual();

        scoreScreenText.text = SCORE.score;

        this.canRetry = false;

        musicScoreScreen = game.add.audio('music_score');
        musicScoreScreen.play('', 0, 1, true);
        
        var scoreScreenTween = game.add.tween(scoreScreen.scale).to({ y : 1 }, 100, Phaser.Easing.Cubic.In, true, 2000);
        scoreScreenTween.onComplete.add(this.allowRetry, this);
        scoreScreenTween.onStart.add(this.playShowScoreScreenAudio, this);
    },

    showComboVisual : function() {
        comboText.visible = true;
        comboTextTime = game.time.now + 3500;
    },

    hideComboVisual : function() {
        comboText.visible = false;
    },

    updateComboVisual : function() {
        if (comboText.visible) {
            comboText.text = SCORE.combo + "x";
            if (game.time.now >= comboTextTime || SCORE.combo <= 1) {
                this.hideComboVisual();
            }
        }
        else {
            if (SCORE.combo > 1) {
                this.showComboVisual();
            }
        }
    },

    hideScoreVisual : function() {
        scoreText.visible = false;
    },

    retry : function() {
        if (this.canRetry) {
            musicScoreScreen.stop();
            game.state.start(APPSTATE.PLAY);
        }
    },

    allowRetry : function() {
        this.canRetry = true;
    },

    mainmenu : function() {
        game.state.start(APPSTATE.MENU);
    }
};
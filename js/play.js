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

    create : function() {
        // Bounds
        groupBounds = game.add.group();
        groupBounds.enableBody = true;
        
        var leftBound = groupBounds.create(0, 0, 'bounds_lr');
        leftBound.body.immovable = true;

        var rightBound = groupBounds.create(SCREEN_WIDTH, 0, 'bounds_lr');
        rightBound.anchor.x = 1;
        rightBound.body.immovable = true;

        var topBound = groupBounds.create(0, -100, 'bounds_tb');
        topBound.body.immovable = true;

        var bottomBound = groupBounds.create(0, SCREEN_HEIGHT, 'bounds_tb');
        bottomBound.anchor.y = 1;
        bottomBound.body.immovable = true;

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

        // Fire button
        var btnFire = game.add.sprite(SCREEN_CENTER.X, SCREEN_HEIGHT - 32, 'btn_fire');
        btnFire.anchor.x = 0.5;
        btnFire.anchor.y = 1;
        btnFire.inputEnabled = true;
        btnFire.events.onInputDown.add(this.fire, this);

        // Score screen
        scoreScreen = game.add.sprite(SCREEN_CENTER.X, SCREEN_CENTER.Y, 'screen_score');
        scoreScreen.anchor.x = 0.5;
        scoreScreen.anchor.y = 0.5;
        scoreScreen.visible = false;

        scoreScreenText = game.add.text(0, -105, '0000', { fontSize: '24px', fill: '#fff' });
        scoreScreenText.anchor.x = 0.5;
        scoreScreenText.anchor.y = 0.5;
        scoreScreen.addChild(scoreScreenText);

        var btnRetry = game.add.sprite(0, 0, 'btn_retry');
        btnRetry.anchor.x = 0.5;
        btnRetry.anchor.y = 0.5;
        btnRetry.inputEnabled = true;
        btnRetry.events.onInputDown.add(this.retry, this);
        scoreScreen.addChild(btnRetry);

        var btnMainMenu = game.add.sprite(0, 100, 'btn_mainmenu');
        btnMainMenu.anchor.x = 0.5;
        btnMainMenu.anchor.y = 0.5;
        btnMainMenu.inputEnabled = true;    
        btnMainMenu.events.onInputDown.add(this.mainmenu, this);
        scoreScreen.addChild(btnMainMenu);

        startText = game.add.text(SCREEN_CENTER.X, 600, 'PRESS THE BUTTON TO START', { fontSize: '24px', fill: '#fff' });
        startText.anchor.x = 0.5;
        startText.anchor.y = 0.5;

        comboText = game.add.text(16, 16, '4x', { fontSize: '44px', fill: '#fff' });
        comboText.visible = false;

        scoreText = game.add.text(100, 16, '0', { fontSize: '36px', fill: '#fff' });

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

                shootersList[i].hasFired();
            }
        }

        this.updateComboVisual();
    },

    fire : function() {
        if (!spaceman.sprite.alive) {
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
        if (LEVEL.currentShooterCount < LEVEL.shooterCount) {
            var takenShooters = new Array();
            for (var x = 0; x < shootersList.length; x++) {
                takenShooters[x] = shootersList[x].takenIndex;
            }

            var addedShooters = 0;
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
        spaceman.sprite.kill();
        if (spaceman.weapon.sprite != null) {
            spaceman.weapon.stopFiring();
        }

        this.showScoreScreen();
    },

    showScoreScreen : function() {
        scoreScreenText.text = SCORE.score;
        scoreScreen.visible = true;
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

    retry : function() {
        console.log('retry pressed');
        game.state.start(APPSTATE.PLAY);
    },

    mainmenu : function() {
        console.log('main menu pressed');
        game.state.start(APPSTATE.MENU);
    }
};
var bootState = {

    create : function() {
        game.scale.pageAlignHorizontally = true;
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

        var gameScale = window.innerHeight / SCREEN_HEIGHT;
        game.scale.setUserScale(gameScale, gameScale, 0, 0, true, true);

        // Start Arcade physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Go to preloading state
        game.state.start(APPSTATE.LOAD);
    }

};
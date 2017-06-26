var bootState = {

    create : function() {
        // Start Arcade physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Go to preloading state
        game.state.start(APPSTATE.LOAD);
    }

};
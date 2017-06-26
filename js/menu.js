var menuState = {

    create : function() {
        game.add.sprite(0, 100, 'title');

        var btnStart = game.add.sprite(SCREEN_CENTER.X, 650, 'btn_start');
        btnStart.anchor.x = 0.5;
        btnStart.anchor.y = 0.5;
        btnStart.inputEnabled = true;
        btnStart.events.onInputDown.add(this.goToPlayMode, this);
    },

    update : function() {
        
    },

    goToPlayMode : function() {
        game.state.start(APPSTATE.PLAY);
    }

};
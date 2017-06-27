var loadState = {

    preload : function() {
        game.load.image('title', 'assets/art/title.png');
        game.load.image('title_spaceman', 'assets/art/title_spaceman.png');
        game.load.image('title_lazer', 'assets/art/title_lazer.png');
        game.load.image('start', 'assets/art/start.png');
        game.load.image('black', 'assets/art/black.png');

        game.load.image('spaceman', 'assets/art/spaceman.png');
        game.load.image('lazer', 'assets/art/lazer.png');
        game.load.image('bounds_lr', 'assets/art/bounds_lr.png');
        game.load.image('bounds_tb', 'assets/art/bounds_tb.png');
        game.load.image('mover', 'assets/art/mover.png');
        game.load.image('shooter', 'assets/art/shooter.png');
        game.load.image('shooter_bullet', 'assets/art/shooter_bullet.png');

        game.load.image('screen_score', 'assets/art/screen_score.png');
        game.load.image('btn_retry', 'assets/art/btn_retry.png');
        game.load.image('btn_mainmenu', 'assets/art/btn_mainmenu.png');
    },

    create : function() {
        game.state.start(APPSTATE.MENU);
    }

};
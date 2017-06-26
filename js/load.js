var loadState = {

    preload : function() {
        game.load.image('title', 'assets/title.png');
        game.load.image('btn_start', 'assets/btn_start.png');

        game.load.image('spaceman', 'assets/spaceman.png');
        game.load.image('btn_fire', 'assets/btn_fire.png');
        game.load.image('lazer', 'assets/lazer.png');
        game.load.image('bounds_lr', 'assets/bounds_lr.png');
        game.load.image('bounds_tb', 'assets/bounds_tb.png');
        game.load.image('mover', 'assets/mover.png');
        game.load.image('shooter', 'assets/shooter.png');
        game.load.image('shooter_bullet', 'assets/shooter_bullet.png');
        game.load.image('spawnvisual', 'assets/spawnvisual.png');

        game.load.image('screen_score', 'assets/screen_score.png');
        game.load.image('btn_retry', 'assets/btn_retry.png');
        game.load.image('btn_mainmenu', 'assets/btn_mainmenu.png');
    },

    create : function() {
        game.state.start(APPSTATE.MENU);
    }

};
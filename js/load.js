var loadState = {

    preload : function() {
        game.load.image('title', 'assets/art/title.png');
        game.load.image('title_spaceman', 'assets/art/title_spaceman.png');
        game.load.image('title_lazer', 'assets/art/title_lazer.png');
        game.load.image('start', 'assets/art/start.png');

        game.load.image('background', 'assets/art/background.png');
        game.load.image('fire', 'assets/art/fire.png');
        game.load.image('spaceman', 'assets/art/spaceman.png');
        game.load.image('lazer', 'assets/art/lazer.png');
        game.load.image('bounds_lr', 'assets/art/bounds_lr.png');
        game.load.image('bounds_tb', 'assets/art/bounds_tb.png');
        game.load.image('mover', 'assets/art/mover.png');
        game.load.image('shooter', 'assets/art/shooter.png');
        game.load.image('shooter_bullet', 'assets/art/shooter_bullet.png');
        game.load.image('explosion', 'assets/art/explosion.png');
        game.load.image('teleport', 'assets/art/teleport.png');

        game.load.image('screen_score', 'assets/art/screen_score.png');

        game.load.audio('music_title', ['assets/audio/ambient/title.mp3', 'assets/audio/ambient/title.ogg']);
        game.load.audio('music_score', ['assets/audio/ambient/scoreScreen.mp3', 'assets/audio/ambient/scoreScreen.ogg']);
        game.load.audio('sfx_lazer', ['assets/audio/lazer.mp3', 'assets/audio/lazer.ogg']);
        game.load.audio('sfx_explosion', ['assets/audio/explosion.mp3', 'assets.audio/explosion.ogg']);
        game.load.audio('sfx_shooter', ['assets/audio/shooter.mp3', 'assets/audio/shooter.ogg']);
        game.load.audio('sfx_score', ['assets/audio/scoreScreen.mp3', 'assets/audio/scoreScreen.ogg']);
        game.load.audio('sfx_death', ['assets/audio/death.mp3', 'assets/audio/death.ogg']);
        game.load.audio('sfx_spawn', ['assets/audio/spawn.mp3', 'assets/audio/spawn.ogg']);
    },

    create : function() {
        game.state.start(APPSTATE.MENU);
    }

};
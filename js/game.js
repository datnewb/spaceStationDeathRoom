var SCREEN_WIDTH = 480;
var SCREEN_HEIGHT = 835;

var SCREEN_CENTER = {
    X : (SCREEN_WIDTH / 2),
    Y : (SCREEN_HEIGHT / 2)
};

var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO, 'gameDiv');

var APPSTATE = {
    BOOT : 'boot',
    LOAD : 'load',
    MENU : 'menu',
    PLAY : 'play'
};

// Do global stuff in this state
game.state.add(APPSTATE.BOOT, bootState);
// Load all necessary assets in this state
game.state.add(APPSTATE.LOAD, loadState);
// Main menu state
game.state.add(APPSTATE.MENU, menuState);
// Game state
game.state.add(APPSTATE.PLAY, playState);

// Load boot state on start
game.state.start(APPSTATE.BOOT);
var SCORE = {
    score : 0,
    combo : 0,

    resetScore : function() {
        this.score = 0;
        this.combo = 0;
    },

    addScore : function(scoreToAdd) {
        console.log("SCORE ADDED");
        this.score += scoreToAdd;
    }
};
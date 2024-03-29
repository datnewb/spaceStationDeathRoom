var MAXSHOOTERS = 8;
var MAXMOVERS = 25;

var LEVEL = {
    reset : function() {
        this.shooterCount = 0;
        this.currentShooterCount = 0;
        this.shooterIntervalMin = 1500;
        this.shooterInterval = 4000;
        this.shooterIntervalDecrease = 350;
        this.shooterRandomStartMin = 2000;
        this.shooterRandomStartMax = 4000;

        this.shooterBulletSpeed = 150;
        this.shooterBulletSpeedMax = 400;
        this.shooterBulletSpeedIncrease = 45;

        this.moverCount = 1;
        this.currentMoverCount = 0;
        this.moverSpeedMax = 400;
        this.moverSpeed = 100;
        this.moverSpeedIncrease = 30;

        this.moverMoveTime = 1000;
        this.moverRandomStartMin = 0;
        this.moverRandomStartMax = 3000;

        this.moverStopTimeMin = 500;
        this.moverStopTime = 4000;
        this.moverStopTimeDecrease = 500;

        this.moverSpawnIntervalPerLevel = 4000;
        this.moverSpawnIntervalMin = 2000;
        this.moverSpawnInterval = 4000;
        this.moverSpawnIntervalDecrease = 400;
        this.moverNextSpawnTime = 0;
        
        this.currentMoverKills = 0;

        this.hasStarted = false;
    },

    addKills : function() {
        this.currentMoverKills++;
        if (this.currentMoverKills >= this.moverCount) {
            this.nextLevel();
        }
    },

    nextLevel : function() {
        this.currentMoverKills = 0;
        this.currentMoverCount = 0;
        this.moverCount++;
        // Normal level progression
        if (this.shooterCount < MAXSHOOTERS) {
            if (this.moverCount >= this.shooterCount + 4) {
                this.shooterCount++;
                this.moverCount = this.shooterCount;
            }
        }
        // Unlimited
        else {
            if (this.moverCount >= MAXMOVERS) {
                this.moverCount -= 3;

                this.moverSpeed = Math.min(this.moverSpeed + this.moverSpeedIncrease, this.moverSpeedMax);
                this.shooterBulletSpeed = Math.min(this.shooterBulletSpeed + this.shooterBulletSpeedIncrease, this.shooterBulletSpeedMax);

                this.moverStopTime = Math.max(this.moverStopTime - this.moverStopTimeDecrease, this.moverStopTimeMin);
                this.shooterInterval = Math.max(this.shooterInterval - this.shooterIntervalDecrease, this.shooterIntervalMin);
                this.moverSpawnInterval = Math.max(this.moverSpawnInterval - this.moverSpawnIntervalDecrease, this.moverSpawnIntervalMin);
            }
        }

        this.moverNextSpawnTime = game.time.now + this.moverSpawnIntervalPerLevel;
    },
};

var MOVERSPAWNS = [
    [130, 170],
    [370, 170],
    [130, 423],
    [370, 423],
    [130, 676],
    [370, 676]
];

var SHOOTERINFO = [
    // contains x, y, shoot direction, shoot position x and y
    [120, 60, 90],
    [360, 60, 90],
    [120, 773, -90],
    [360, 773, -90],
    [48, 250, 0],
    [48, 603, 0],
    [432, 250, 180],
    [432, 603, 180]
];
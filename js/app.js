
var skins = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
// Enemies our player must avoid
var lostTheGame = false;
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.hitBoxWidth = 80;
    this.hitBoxHeight = 30;
    this.initialSpeed = 100;
    this.speed = this.initialSpeed;
    this.x = -10;
    this.y = -100;
    this.hitBox = {x: this.x, y: this.y, width: this.hitBoxWidth, height: this.hitBoxHeight};
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= 505){
        this.x = this.x + this.speed*dt;
    } else {
        this.x = -100;
    }
    // update the enemy hitbox
    updateHitBox(this.x, this.y, this.hitBox);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // collision detection logic from
    // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if(this.hitBox.x < player.hitBox.x + player.hitBox.width
        && this.hitBox.x + this.hitBox.width > player.hitBox.x
        && this.hitBox.y < player.hitBox.y + player.hitBox.height
        && this.hitBox.height + this.hitBox.y > player.hitBox.y){
        // You hit a bug!
        // We're passing true to resetPlayer because the player died
        playerEvent(true);
    }
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    // starting position of the player, we want to keep this
    // for position resets
    this.initialX = 200;
    this.initialY = 400;
    this.hitBoxWidth = 50;
    this.hitBoxHeight = 60;

    this.skindex = 0;
    this.sprite = skins[this.skindex];

    this.x = this.initialX;
    this.y = this.initialY;
    // start with 3 lives
    this.lives = 3;
    this.score = 0;
    // set the hitbox
    this.hitBox = {x: this.x, y: this.y, width: this.hitBoxWidth, height: this.hitBoxHeight};
};

Player.prototype.handleInput = function(keyCode){
    switch(keyCode){
        case 'left':
            if(this.x > 0) {
                this.x = this.x - 100;
            }
            break;
        case 'up':
            if(this.y > 0) {
               this.y = this.y - 90;
            }
            break;
        case 'right':
            if(this.x < 400) {
                this.x = this.x + 100;
            }
            break;
        case 'down':
            if(this.y < 400) {
               this.y = this.y + 90;
            }
            break;
        case 'prev-skin':
            if(this.skindex <= 0){
                this.skindex = skins.length - 1;
            } else{
                this.skindex = this.skindex - 1;
            }
            break;
        case 'next-skin':
            if(this.skindex >= skins.length-1){
                this.skindex = (skins.length-1) - this.skindex;
            } else{
                this.skindex = this.skindex + 1;
            }
            break;
        case 'enter':
            if(lostTheGame){
                resetGame();
            }
            break;

    }

};

Player.prototype.update = function () {
    if(this.y <= 0){
        // the player has reached the top of the board
        // we're sending false because the player won
        playerEvent(false);
    }
    // update the player's hit box
    updateHitBox(this.x, this.y, this.hitBox);
    // update skin if necessary
    this.sprite = skins[this.skindex];
    this.render();
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    ctx.font = "30px Arial";
    ctx.fillText("Score: "+ this.score, 10, 80);
    ctx.fillText("Lives: " + this.lives, 400, 80);

    if(lostTheGame){

        ctx.font = "50px Arial";
        ctx.fillText("Game Over", 130, 300);
        ctx.font = "40px Arial";
        ctx.fillText("Press Enter to Play Again", 30, 360);

    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemyTop = new Enemy();
enemyTop.y = 73;
var enemyMiddle = new Enemy();
enemyMiddle.y = 146;
enemyMiddle.initialSpeed = 50;
enemyMiddle.sprite = 'images/enemy-bug-blue.png';
var enemyBottom = new Enemy();
enemyBottom.y = 292;
enemyBottom.x = 260;
enemyBottom.sprite = 'images/enemy-bug-green.png';
var player = new Player();
allEnemies = [enemyTop, enemyMiddle, enemyBottom];


// Resets the player's position to the start
var resetPlayer = function () {
    player.x = player.initialX;
    player.y = player.initialY;
};

// Something happened to the player
// isDeath is a boolean to identify whether or not
// we're reseting due to collision, or win condition
var playerEvent = function(isDeath){

    if(isDeath){
        lossConditions();
    } else{
        winConditions();
    }

};

// generic hitbox update function
// this reduces duplicate code since both enemies
// and the player have hitboxes, and they update
// the same way
var updateHitBox = function(x, y, hitBox){
    hitBox.x = x;
    hitBox.y = y;
};

var lossConditions = function(){
    // You died, lose a life
    player.lives = player.lives - 1;
    console.log("You have " + player.lives + " lives left");
    if(player.lives <= 0){
        lostTheGame = true;
        player.hitBox.width = 0;
        player.hitBox.height = 0;
        allEnemies.forEach(function(enemy){
            enemy.hitBox.width = 0;
            enemy.hitBox.height = 0;
        });
    } else{
        resetPlayer();
    }

};

var winConditions = function () {
    // if you've already lost the game, you can't win
    if (!lostTheGame){
        // Hot Dog, we have a weiner!
        player.score = player.score + 1;
        console.log("Level UP! Score = " + player.score);
        // make it more challenging, increase enemy speeds by 1.5
        allEnemies.forEach(function(enemy) {
            enemy.speed = enemy.speed * 1.5;
        });
        resetPlayer();
    }
};

var resetGame = function() {
    player.hitBox.width = player.hitBoxWidth;
    player.hitBox.height = player.hitBoxHeight;
    player.x = player.initialX;
    player.y = player.initialY;
    player.lives = 3;
    player.score = 0;
    allEnemies.forEach(function(enemy){
        enemy.speed = enemy.initialSpeed;
        enemy.hitBox.width = enemy.hitBoxWidth;
        enemy.hitBox.height = enemy.hitBoxHeight;
    });
    lostTheGame = false;
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        33: 'next-skin',
        34: 'prev-skin',
        13: 'enter'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});



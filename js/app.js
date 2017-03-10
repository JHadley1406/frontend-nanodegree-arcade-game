// Enemies our player must avoid
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

    // check for collisions
    // we're passing the death event since this kills the player
    // and we're passing 'this' because this is the actor we want to check against
    this.collisionCheck('death');

    if (this.x <= 505){
        this.x = this.x + this.speed*dt;
    } else {
        this.x = -100;
    }
    // update the enemy hitbox
    this.hitBox.x = this.x;
    this.hitBox.y = this.y;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

Enemy.prototype.collisionCheck = function(event) {
    // collision detection logic from
    // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (this.hitBox.x < player.hitBox.x + player.hitBox.width
        && this.hitBox.x + this.hitBox.width > player.hitBox.x
        && this.hitBox.y < player.hitBox.y + player.hitBox.height
        && this.hitBox.height + this.hitBox.y > player.hitBox.y) {
        //collision detected! Triggering player event
        player.playerEvent(event);
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // The Game Over flag, initially set to false
    this.lostTheGame = false;
    // Place all the skins in an array so the user can cycle through them
    this.skins = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
    // starting position of the player, we want to keep this
    // for position resets
    this.initialX = 200;
    this.initialY = 400;
    // Initial hitbox size
    this.hitBoxWidth = 50;
    this.hitBoxHeight = 60;

    // Set the player skin to the first one in the array
    this.skindex = 0;
    this.sprite = this.skins[this.skindex];

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
            // cycle the skin index (or skindex) to the previous value
            // or if we're at the first index, move to the last index
            if(this.skindex <= 0){
                this.skindex = this.skins.length - 1;
            } else{
                this.skindex = this.skindex - 1;
            }
            break;
        case 'next-skin':
            // cycle the skin index to the next skin
            // or if we're at the last index already, move to the first
            if(this.skindex >= this.skins.length-1){
                this.skindex = (this.skins.length-1) - this.skindex;
            } else{
                this.skindex = this.skindex + 1;
            }
            break;
        case 'enter':
            // This is only used if the user has lost the game
            // otherwise we just ignore it
            if(this.lostTheGame){
                this.resetGame();
            }
            break;

    }

};

Player.prototype.update = function () {
    if(this.y <= 0){
        // the player has reached the top of the board
        // we're sending the win string because this is a win condition
        this.playerEvent('win');
    }
    // update the player's hit box
    this.hitBox.x = this.x;
    this.hitBox.y = this.y;
    // update skin if necessary
    this.sprite = this.skins[this.skindex];
    this.render();
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    ctx.font = "30px Arial";
    ctx.fillText("Score: "+ this.score, 10, 80);
    ctx.fillText("Lives: " + this.lives, 400, 80);

    // If the player has lost, we want to display a Game Over message
    if(this.lostTheGame){

        ctx.font = "50px Arial";
        ctx.fillText("Game Over", 130, 300);
        ctx.font = "40px Arial";
        ctx.fillText("Press Enter to Play Again", 30, 360);

    }
};

// Something happened to the player
// Event is the event text passed in by the caller
// Right now we're only checking for a win or a death
// But this will make it easier to add other events in the future
Player.prototype.playerEvent = function(event){
    switch(event){
        case 'death':
            this.lossCondition();
            break;
        case 'win':
            this.winCondition();
            break;
    }
};

// Resets the player's position to the start
Player.prototype.resetPosition = function () {
    this.x = this.initialX;
    this.y = this.initialY;
};

Player.prototype.winCondition = function () {
    // if you've already lost the game, you can't win
    if (!this.lostTheGame){
        // Hot Dog, we have a weiner!
        this.score = this.score + 1;
        console.log("Level UP! Score = " + this.score);
        // make it more challenging, increase enemy speeds by 1.5
        allEnemies.forEach(function(enemy) {
            enemy.speed = enemy.speed * 1.5;
        });
        this.resetPosition();
    }
};


// Called when the player loses a life
Player.prototype.lossCondition = function(){
    // You died, lose a life
    this.lives = this.lives - 1;
    console.log("You have " + this.lives + " lives left");
    // If the player is out of lives, we set the lost flag,
    // and set all hitboxes to 0 size
    if(this.lives <= 0){
        this.lostTheGame = true;
        this.hitBox.width = 0;
        this.hitBox.height = 0;
        allEnemies.forEach(function(enemy){
            enemy.hitBox.width = 0;
            enemy.hitBox.height = 0;
        });
    } else{
        // if the player has lives left we just reset their position
        this.resetPosition();
    }

};

// When a player starts over, we reset all the initial values
Player.prototype.resetGame = function() {
    this.hitBox.width = this.hitBoxWidth;
    this.hitBox.height = this.hitBoxHeight;
    this.x = this.initialX;
    this.y = this.initialY;
    this.lives = 3;
    this.score = 0;
    allEnemies.forEach(function(enemy){
        enemy.speed = enemy.initialSpeed;
        enemy.hitBox.width = enemy.hitBoxWidth;
        enemy.hitBox.height = enemy.hitBoxHeight;
    });
    // don't forget to turn off the lost flag
    this.lostTheGame = false;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemyTop = new Enemy();
enemyTop.y = 73;
var enemyMiddle = new Enemy();
enemyMiddle.y = 146;
enemyMiddle.initialSpeed = 50;
enemyMiddle.speed = 50;
enemyMiddle.sprite = 'images/enemy-bug-blue.png';
var enemyBottom = new Enemy();
enemyBottom.y = 292;
enemyBottom.x = 260;
enemyBottom.sprite = 'images/enemy-bug-green.png';
var player = new Player();
allEnemies = [enemyTop, enemyMiddle, enemyBottom];


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



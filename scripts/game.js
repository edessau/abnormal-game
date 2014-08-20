// Declare myGame, the object that contains our game's states
var myGame = {
  //Define the GamePlay property, which is our gameplay state
  GamePlay: function(game) {}
};

// Define the prototype for the GamePlay state
myGame.GamePlay.prototype = {
    preload: function() {
      //Preload images so they can be displayed properly
      this.load.image('background', 'assets/background.png');
      this.load.spritesheet('player', 'assets/character3.png', 200, 500);
      this.load.image('beads', 'assets/purplebeads.png');

    },
    create: function() {
      //Create everything that will be used in your game
      
      // scale the game to the full height of the window
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
      this.scale.setScreenSize(true);

      // Background
      this.add.sprite(0, 0, 'background');

      // spawn myGame.player at the bottom of the page
      myGame.player = this.add.sprite(this.input.mouse.x, GAME_HEIGHT - this.height - 64, 'player');
      
      // add blinking animation ( animationName, animation frame order )
      myGame.player.animations.add('blink', [0, 0, 1, 2, 2, 2, 2, 1, 0, 0]);
      
      
      //Give player physics so it can collide
      this.physics.enable(myGame.player, Phaser.Physics.ARCADE);

      // Timer to spawn meat
      this.spawnTimer = 0;
      
      //reset timer every 1000ms
      myGame.timerReset = 1000;
      
      //number of seconds passed
      myGame.secondsPassed = 0;

      // Score = 0
      myGame.score = 0;
      
      //set up the font style for the text that will be added
      this._fontStyle = { font: "32px Arial", fill: "#000", align: "center" };
      
      //Add score text to the game
      myGame.scoreText = this.add.text(90, 24, "0", this._fontStyle);

      // Create meat group
      myGame.beadsGroup = this.add.group();
      
      //Spawn meat
      spawnbeads(this);
    },
    update: function() {
      //Update things here
      
      //myGame.player location -- move with mouse on the X plane
      myGame.player.x = this.input.x - myGame.player.width/2;
      // Y will always be the bottom of the screen - player's height - 64px
      myGame.player.y = GAME_HEIGHT - myGame.player.height - 80;      
    
      // Meat spawn timer - add the time that has elapsed since last update function
      this.spawnTimer += this.time.elapsed;
      
      //if the timer is greater than the reset variable...
      if(this.spawnTimer > myGame.timerReset) {
          //Reset it
          this.spawnTimer = 0;
          
          //Spawn candy
          spawnbeads(this);
          
          // play blinking animation ( animationName, framerate, loop? )
          myGame.player.animations.play('blink', 30, false);
          
          //Add 1 to seconds passed
          myGame.secondsPassed++;
          
          //If seconds passed are divisible by 60 (no leftover numbers) and timer reset > 300
          if ((myGame.secondsPassed % 60 == 0) && (myGame.timerReset > 300)) {
            // Make the game spawn meat faster
            myGame.timerReset - 100;
          }
      }
      
      //Make the meat fall 5px
      myGame.beadsGroup.forEach(function(beads) {
        beads.y += 5;
      });
      
      //Player should eat meat when the two collide
      this.physics.arcade.overlap(myGame.player, myGame.beadsGroup, eatbeads);
      
    }
};

var spawnbeads = function(game) {
  //random drop x location
  var dropX = Math.floor(Math.random() * GAME_WIDTH);
  
  //Spawn meat at dropX above the screen, using the image 'meat'
  var beads = game.add.sprite(dropX, 30, 'beads');
  
  // Give meat physics so it can collide
  game.physics.enable(beads, Phaser.Physics.ARCADE);

  // Check if out of bounds
  beads.checkWorldBounds = true;
  
  //Remove meat if out of bounds
  beads.events.onOutOfBounds.add(beads.kill);
  
  //Add meat to meat group
  myGame.beadsGroup.add(beads);
};


var eatbeads = function(player, beads) {
  // If meat is hit, remove it!
  beads.kill();
  
  //increase score
  myGame.score += 1;
  
  //set text to the score
  myGame.scoreText.setText(myGame.score);
};
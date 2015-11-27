(function() {
  'use strict';

  function Game() {}

  var TILE_SIZE = 172;

  var cards = [];
  var images = [];
  var style = { font: "bold 14px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "top" };
  
  var firstClick, secondClick;
  var noMatch, clickTime;
  var score = 40;

  Game.prototype = {
    preload: function() {      
      this.load.image('back', 'assets/back170.png');
      this.load.image('0', 'assets/chair 1.png');
      this.load.image('1', 'assets/EyeWash1.png');
      this.load.image('2', 'assets/FireA1.png');
      this.load.image('3', 'assets/Laser1.png');
      this.load.image('4', 'assets/NoSmoke1.png');
      this.load.image('5', 'assets/Overhead1.png');
      this.load.image('6', 'assets/Trip1.png');
      this.load.image('7', 'assets/chair1 1.png');
      //this.load.image('8', 'assets/8.png');
      //this.load.image('9', 'assets/9.png');
        //this.background = #0000
    },

    create: function () {      
      for (var i = 0; i < 8; i++) {
        images.push(this.game.add.sprite(0,0,''+i));
        images.push(this.game.add.sprite(0,0,''+i));
      }
      
      this.shuffle(images);

      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          var idx = i*4+j;
          cards[idx] = this.game.add.sprite(j*TILE_SIZE,i*TILE_SIZE,'back');
          cards[idx].index = idx;
          images[idx].x = j*TILE_SIZE;
          images[idx].y = i*TILE_SIZE;
          images[idx].visible = false;

          cards[idx].inputEnabled = true;
          cards[idx].events.onInputDown.add(this.doClick);
          cards[idx].events.onInputOver.add(function(sprite) { sprite.alpha = 0.5; });
          cards[idx].events.onInputOut.add(function(sprite) { sprite.alpha = 1.0; });
        }
      }      
    },

    doClick: function (sprite) {
      if (firstClick == null) {
        firstClick = sprite.index; 
      }
      else if (secondClick == null) {
        secondClick = sprite.index;
        if (images[firstClick].key === images[secondClick].key) {
          // we have a match
          score += 50;
          firstClick = null; secondClick = null;
        }
        else {
          // no match
          score -= 5;
          noMatch = true;          
        }
      }
      else {
        return; // don't allow a third click, instead wait for the update loop to flip back after 0.5 seconds
      }

      clickTime = sprite.game.time.totalElapsedSeconds();
      sprite.visible = false;
      images[sprite.index].visible = true;
    },

    update: function () {
      if (noMatch) {
        if (this.game.time.totalElapsedSeconds() - clickTime > 0.7) {
          noMatch = false;
          cards[firstClick].visible = true;
          cards[secondClick].visible = true;
          images[firstClick].visible = false;
          images[secondClick].visible = false;
          firstClick = null; secondClick = null;
          noMatch = false;
        }
      }
    },

    render: function() {
      this.game.debug.text('Score: ' + score, 800, 20)
      //game.debug.text('Elapsed seconds: ' + this.game.time.totalElapsedSeconds(), 800, 32, 'rgb(0,150,255)');
        
    },

    shuffle: function(o) {
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;      
    }
  };

  var game = new Phaser.Game(1020, 710, Phaser.AUTO, 'pairs-game');
  game.state.add('game', Game);
  game.state.start('game');

}());
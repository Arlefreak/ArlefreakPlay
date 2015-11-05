(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables

window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'standup');

  // Game States
  game.state.add('about', require('./states/about'));
  game.state.add('boot', require('./states/boot'));
  game.state.add('characterSelect', require('./states/characterSelect'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  game.state.add('settings', require('./states/settings'));
  
  game.state.start('boot');
};

},{"./states/about":2,"./states/boot":3,"./states/characterSelect":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8,"./states/settings":9}],2:[function(require,module,exports){
'use strict';

function About() {}
About.prototype = {
  create: function() {
    this.createContent();

    this.switchSound = this.game.add.audio('switch');
    this.switchSound.play();

    this.LIGHT_RADIUS = 400;
    this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    var lightSprite = this.game.add.image(0, 0, this.shadowTexture);
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    this.updateShadowTexture();

    this.backButton = this.game.add.button(5, 5, 'gui', function() {
      this.back();
    }, this, 'back_hover', 'back', 'back_click');

    this.backButton.scale.set(2);
  },
  createContent: function() {
    this.tilespriteBrickWall = this.game.add.tileSprite(0, 0, 800, 600, 'tiles', 'wallBricks');
    this.tilespriteWoodStand = this.game.add.tileSprite(0, 0, 800, 28, 'tiles', 'woodStand');
    this.tilespriteWoodStand.y = this.game.world.height;
    this.tilespriteWoodStand.anchor.set(0, 1);

    this.tilespriteBrickWall.scale.set(4);
    this.tilespriteWoodStand.scale.set(4);

    this.dialog = this.game.add.group();

    this.dialogSprite = this.game.add.sprite(0, 0, 'gui');
    this.dialogSprite.anchor.setTo(0.5, 0.5);
    this.dialogSprite.scale.set(6, 4);
    this.dialogSprite.frameName = 'dialog';

    this.bmpText = this.game.add.bitmapText(0, 0, 'carrier_command', '@Arlefreak & @abovethec', 20);
    this.bmpText.align = 'center';
    this.bmpText.updateText();
    this.bmpText.x = -this.bmpText.textWidth / 2;
    this.bmpText.y = -this.bmpText.textHeight / 2;
    this.bmpText.tint = '#e3e3e3';

    this.dialog.add(this.dialogSprite);
    this.dialog.add(this.bmpText);
    this.dialog.x = this.game.world.centerX;
    this.dialog.y = 100;

    this.game.add.tween(this.dialog).to({
      y: '-5'
    }, 200, Phaser.Easing.Back.InOut, true, 0, 200, true);

    var sprite2 = this.game.add.sprite(this.game.world.centerX + 200, this.game.world.height + 30, 'conejo');
    sprite2.animations.add('idle', Phaser.Animation.generateFrameNames('Idle_', 0, 4), 6, true);
    sprite2.animations.add('click', Phaser.Animation.generateFrameNames('Click_0', 0, 11), 15, false).onComplete.add(function() {
      this.selectCharacter();
    }, this);
    sprite2.animations.play('idle');
    sprite2.scale.set(-8, 8);
    sprite2.anchor.setTo(0.5, 1);
    sprite2.inputEnabled = true;
    sprite2.input.pixelPerfectClick = true;
    sprite2.events.onInputDown.add(function() {
      this.click2Sound.play();
      sprite2.animations.play('click');
    }, this);

    var sprite = this.game.add.sprite(this.game.world.centerX - 200, this.game.world.height + 30, 'carballo');
    sprite.animations.add('idle', Phaser.Animation.generateFrameNames('Idle_', 0, 4), 6, true);
    sprite.animations.add('click', Phaser.Animation.generateFrameNames('Click_0', 0, 11), 15, false).onComplete.add(function() {
      this.selectCharacter();
    }, this);
    sprite.animations.play('idle');
    sprite.scale.set(-8, 8);
    sprite.anchor.setTo(0.5, 1);
    sprite.inputEnabled = true;
    sprite.input.pixelPerfectClick = true;
    sprite.events.onInputDown.add(function() {
      this.click2Sound.play();
      sprite.animations.play('click');
    }, this);

    this.leftButton = this.game.add.button(this.game.world.centerX - 200, this.game.world.centerY - 105, 'gui', function() {
      window.open('https://twitter.com/arlefreak', '_blank');
    }, this, 'twitter_hover', 'twitter', 'twitter_click');
    this.rightButton = this.game.add.button(this.game.world.centerX + 200, this.game.world.centerY - 105, 'gui', function() {
      window.open('https://twitter.com/abovethec', '_blank');
    }, this, 'twitter_hover', 'twitter', 'twitter_click');
    this.leftButton.scale.set(4);
    this.rightButton.scale.set(4);
    this.rightButton.anchor.setTo(0.5, 0.5);
    this.leftButton.anchor.setTo(0.5, 0.5);
  },
  updateShadowTexture: function() {
    this.shadowTexture.context.fillStyle = 'rgb(80, 80, 80)';
    this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

    // Draw circle of light
    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
    this.shadowTexture.context.arc(this.game.world.centerX, this.game.world.centerY,
      this.LIGHT_RADIUS, 0, Math.PI * 2);
    this.shadowTexture.context.fill();

    // This just tells the engine it should update the texture cache
    this.shadowTexture.dirty = true;
  },
  back: function() {
    this.game.state.start('menu');
  }
};
module.exports = About;

},{}],3:[function(require,module,exports){
'use strict';

function Boot() {}

Boot.prototype = {
  preload: function() {
    this.load.image('preloaderBG', 'assets/loadingBg.png');
    this.load.image('preloader', 'assets/loading.png');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],4:[function(require,module,exports){
'use strict';

function CharacterSelect() {}
CharacterSelect.prototype = {
  create: function() {
    this.charactersCant = 6;
    this.CHARACTERINDEX = 0;
    this.createContent();

    this.characters = this.game.add.group();
    this.characters.x = 0;
    this.characters.y = 0;

    this.switchSound = this.game.add.audio('switch');
    this.switchSound.play();

    this.clickSound = this.game.add.audio('click');
    this.click2Sound = this.game.add.audio('click2');


    for (var i = this.charactersCant - 1; i >= 0; i--) {
      var sprite = null;
      switch (i) {
        case 0:
          sprite = this.game.add.sprite(this.game.world.centerX * (i + 1), this.game.world.height + 10, 'delfin');
          break;
        case 1:
          sprite = this.game.add.sprite(this.game.world.centerX * (i + 1), this.game.world.height + 10, 'oso');
          break;
        case 2:
          sprite = this.game.add.sprite(this.game.world.centerX * (i + 1), this.game.world.height + 10, 'bird');
          break;
        case 3:
          sprite = this.game.add.sprite(this.game.world.centerX * (i + 1), this.game.world.height + 10, 'cat');
          break;
        case 4:
          sprite = this.game.add.sprite(this.game.world.centerX * (i + 1), this.game.world.height + 10, 'carballo');
          break;
        case 5:
          sprite = this.game.add.sprite(this.game.world.centerX * (i + 1), this.game.world.height + 10, 'conejo');
          break;
        default:
          sprite = this.game.add.sprite(this.game.world.centerX * (i + 1), this.game.world.height + 10, 'delfin');
          break;
      }
      sprite.animations.add('idle', Phaser.Animation.generateFrameNames('Idle_', 0, 3), 6, true);
      sprite.animations.add('click', Phaser.Animation.generateFrameNames('Click_0', 0, 11), 15, false).onComplete.add(function() {
        this.selectCharacter();
      }, this);
      sprite.animations.play('idle');
      sprite.scale.set(-8, 8);
      sprite.anchor.setTo(0.5, 1);
      sprite.inputEnabled = true;
      sprite.input.pixelPerfectClick = true;
      sprite.events.onInputDown.add(function() {
        this.click2Sound.play();
        sprite.animations.play('click');
      }, this);
      if (i > 3) {
        sprite.tint = '#000000';
      }
      this.characters.add(sprite);
    }

    this.micSprite = this.game.add.sprite(0, 0, 'misc');
    this.micSprite.anchor.setTo(0.5, 1);
    this.micSprite.scale.set(8);
    this.micSprite.frameName = 'mic';
    this.micSprite.x = this.game.world.centerX - 100;
    this.micSprite.y = this.game.world.height - 50;

    this.leftButton = this.game.add.button(160, this.game.world.centerY, 'gui', this.characterLeft, this, 'flecha_hover', 'flecha', 'flecha_click');
    this.rightButton = this.game.add.button(this.game.world.width - 160, this.game.world.centerY, 'gui', this.characterRight, this, 'flecha_hover', 'flecha', 'flecha_click');
    this.leftButton.scale.set(-6, 6);
    this.rightButton.scale.set(6);
    this.rightButton.anchor.setTo(0.5, 0.5);
    this.leftButton.anchor.setTo(0.5, 0.5);

    this.LIGHT_RADIUS = 400;
    this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    var lightSprite = this.game.add.image(0, 0, this.shadowTexture);
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    this.updateShadowTexture();

    this.backButton = this.game.add.button(5, 5, 'gui', function() {
      this.back();
    }, this, 'back_hover', 'back', 'back_click');
    this.backButton.scale.set(2);
  },
  createContent: function() {
    this.tilespriteBrickWall = this.game.add.tileSprite(0, 0, 800, 600, 'tiles', 'wallBricks');
    this.tilespriteWoodStand = this.game.add.tileSprite(0, 0, 800, 28, 'tiles', 'woodStand');
    this.tilespriteWoodStand.y = this.game.world.height;
    this.tilespriteWoodStand.anchor.set(0, 1);

    this.tilespriteBrickWall.scale.set(4);
    this.tilespriteWoodStand.scale.set(4);

    this.dialog = this.game.add.group();

    this.dialogSprite = this.game.add.sprite(0, 0, 'gui');
    this.dialogSprite.anchor.setTo(0.5, 0.5);
    this.dialogSprite.scale.set(6, 4);
    this.dialogSprite.frameName = 'dialog';

    this.bmpText = this.game.add.bitmapText(0, 0, 'carrier_command', 'Choose a character', 20);
    this.bmpText.align = 'center';
    this.bmpText.updateText();
    this.bmpText.x = -this.bmpText.textWidth / 2;
    this.bmpText.y = -this.bmpText.textHeight / 2;
    this.bmpText.tint = '#e3e3e3';

    this.dialog.add(this.dialogSprite);
    this.dialog.add(this.bmpText);
    this.dialog.x = this.game.world.centerX;
    this.dialog.y = 100;

    this.game.add.tween(this.dialog).to({
      y: '-5'
    }, 200, Phaser.Easing.Back.InOut, true, 0, 200, true);
  },
  updateShadowTexture: function() {
    this.shadowTexture.context.fillStyle = 'rgb(80, 80, 80)';
    this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

    // Draw circle of light
    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
    this.shadowTexture.context.arc(this.game.world.centerX, this.game.world.centerY,
      this.LIGHT_RADIUS, 0, Math.PI * 2);
    this.shadowTexture.context.fill();

    // This just tells the engine it should update the texture cache
    this.shadowTexture.dirty = true;
  },
  characterRight: function() {
    this.clickSound.play();
    if (this.CHARACTERINDEX < this.charactersCant - 1) {
      this.CHARACTERINDEX++;
      this.game.add.tween(this.characters).to({
        x: (this.game.world.width / 2) * -this.CHARACTERINDEX
      }, 500, Phaser.Easing.Quadratic.Out, true);
    } else {
      this.CHARACTERINDEX = 0;
      this.game.add.tween(this.characters).to({
        x: 0
      }, 500, Phaser.Easing.Quadratic.Out, true);
    }
  },
  characterLeft: function() {
    this.clickSound.play();
    if (this.CHARACTERINDEX > 0) {
      this.CHARACTERINDEX--;
      this.game.add.tween(this.characters).to({
        x: (this.game.world.width / 2) * -this.CHARACTERINDEX
      }, 500, Phaser.Easing.Quadratic.Out, true);
    } else {
      this.CHARACTERINDEX = this.charactersCant - 1;
      this.game.add.tween(this.characters).to({
        x: (this.game.world.width / 2) * -(this.charactersCant - 1)
      }, 500, Phaser.Easing.Quadratic.Out, true);
    }
  },
  selectCharacter: function() {
    if (this.CHARACTERINDEX < 4) {
      this.game.state.start('play', true, false, this.CHARACTERINDEX);
    }
  },
  back: function() {
    this.game.state.start('menu');
  }
};
module.exports = CharacterSelect;

},{}],5:[function(require,module,exports){
'use strict';

function GameOver() {}

GameOver.prototype = {
  init: function(CHARACTERINDEX) {
    console.log(CHARACTERINDEX);
    this.CHARACTERINDEX = CHARACTERINDEX;
  },
  create: function() {
    this.getScore();
    this.createContent();
    this.createPlayer();

    this.switchSound = this.game.add.audio('switch');
    this.switchSound.play();

    this.micSprite = this.game.add.sprite(0, 0, 'misc');
    this.micSprite.anchor.setTo(0.5, 1);
    this.micSprite.scale.set(8);
    this.micSprite.frameName = 'mic';
    this.micSprite.x = this.game.world.centerX - 100;
    this.micSprite.y = this.game.world.height - 50;

    this.LIGHT_RADIUS = 400;
    this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    var lightSprite = this.game.add.image(0, 0, this.shadowTexture);
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    this.updateShadowTexture();
    this.backButton = this.game.add.button(5, 5, 'gui', function() {
      this.back();
    }, this, 'back_hover', 'back', 'back_click');

    this.backButton.scale.set(2);
  },
  update: function() {
    if (this.game.input.activePointer.justPressed()) {
      this.game.state.start('menu');
    }
  },
  updateShadowTexture: function() {
    this.shadowTexture.context.fillStyle = 'rgb(80, 80, 80)';
    this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

    // Draw circle of light
    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
    this.shadowTexture.context.arc(this.game.world.centerX, this.game.world.centerY,
      this.LIGHT_RADIUS, 0, Math.PI * 2);
    this.shadowTexture.context.fill();

    // This just tells the engine it should update the texture cache
    this.shadowTexture.dirty = true;
  },
  createContent: function() {
    this.tilespriteBrickWall = this.game.add.tileSprite(0, 0, 800, 600, 'tiles', 'wallBricks');
    this.tilespriteWoodStand = this.game.add.tileSprite(0, 0, 800, 28, 'tiles', 'woodStand');
    this.tilespriteWoodStand.y = this.game.world.height;
    this.tilespriteWoodStand.anchor.set(0, 1);

    this.tilespriteBrickWall.scale.set(4);
    this.tilespriteWoodStand.scale.set(4);

    this.dialog = this.game.add.group();

    this.dialogSprite = this.game.add.sprite(0, 0, 'gui');
    this.dialogSprite.anchor.setTo(0.5, 0.5);
    this.dialogSprite.scale.set(6, 4);
    this.dialogSprite.frameName = 'dialog';

    this.bmpText = this.game.add.bitmapText(0, 0, 'carrier_command', 'Game over\n\nHigh Score:' + this.highScore + '\n\nScore:' + this.lastScore, 19);
    if (!this.CHARACTERINDEX) {
      this.bmpText.setText('High Score:' + this.highScore + '\n\nLast Score:' + this.lastScore);
    }
    this.bmpText.align = 'center';
    this.bmpText.updateText();
    this.bmpText.x = -this.bmpText.textWidth / 2;
    this.bmpText.y = -this.bmpText.textHeight / 2;
    this.bmpText.tint = '#e3e3e3';

    this.dialog.add(this.dialogSprite);
    this.dialog.add(this.bmpText);
    this.dialog.x = this.game.world.centerX;
    this.dialog.y = 100;

    this.game.add.tween(this.dialog).to({
      y: '-5'
    }, 200, Phaser.Easing.Back.InOut, true, 0, 200, true);
  },
  createPlayer: function() {
    var tmpTexturePlayer = this.game.add.bitmapData(200, 300);
    switch (this.CHARACTERINDEX) {
      case 0:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'delfin');
        break;
      case 1:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'oso');
        break;
      case 2:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'bird');
        break;
      case 3:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'cat');
        break;
      case 4:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'cat');
        break;
      case 5:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'cat');
        break;
      default:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'delfin');
        break;
    }
    tmpTexturePlayer.context.fillRect(0, 0, 200, 300);

    this.player.scale.set(-8, 8);
    this.player.anchor.setTo(0.5, 1);
    this.player.inputEnabled = true;
    this.player.input.pixelPerfectClick = true;
    this.player.animations.add('idle', Phaser.Animation.generateFrameNames('Idle_', 0, 3), 6, true);
    this.player.animations.add('correct', Phaser.Animation.generateFrameNames('Correct_', 0, 3), 6, false).onComplete.add(function() {
      this.player.animations.play('idle');
    }, this);
    this.player.animations.add('error', Phaser.Animation.generateFrameNames('Error_', 0, 3), 6, false).onComplete.add(function() {
      this.player.animations.play('idle');
    }, this);
    this.player.animations.add('click', Phaser.Animation.generateFrameNames('Click_0', 0, 11), 15, false).onComplete.add(function() {
      this.player.animations.play('idle');
    }, this);
    this.player.animations.play('idle');
    this.player.events.onInputDown.add(function() {
      this.player.animations.play('click');
    }, this);
  },
  getScore: function() {
    this.lastScore = localStorage.getItem('lastScore');
    this.highScore = localStorage.getItem('highScore');
    if (typeof(this.highScore) === 'undefined' || this.highScore === null || isNaN(this.highScore)) {
      this.highScore = 0;
      this.lastScore = 0;
      localStorage.setItem('highScore', this.highScore);
      localStorage.setItem('lastScore', this.lastScore);
    }
    this.highScore = parseInt(this.highScore, 10);
    this.lastScore = parseInt(this.lastScore, 10);
    if (this.highScore < this.lastScore) {
      this.highScore = this.lastScore;
      localStorage.setItem('highScore', this.lastScore);
    }
  },
  back: function() {
    this.game.state.start('menu');
  }
};
module.exports = GameOver;

},{}],6:[function(require,module,exports){
'use strict';

function Menu() {}

Menu.prototype = {
  create: function() {
    this.createContent();

    this.switchSound = this.game.add.audio('switch');
    this.switchSound.play();

    this.clickSound = this.game.add.audio('click');
    this.click2Sound = this.game.add.audio('click2');

    this.playButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 80, 'gui', function() {
      this.transition('characterSelect');
    }, this, 'play_hover', 'play', 'play_click');
    this.settingsButton = this.game.add.button(160, this.game.world.centerY + 180, 'gui', function() {
      this.transition('settings');
    }, this, 'settings_hover', 'settings', 'settings_click');
    this.rankButton = this.game.add.button(this.game.world.width - 160, this.game.world.centerY + 180, 'gui', function() {
      this.transition('gameover');
    }, this, 'rank_hover', 'rank', 'rank_click');
    this.aboutButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 180, 'gui', function() {
      this.transition('about');
    }, this, 'info_hover', 'info', 'info_click');

    this.buttonGroup = this.game.add.group();
    this.buttonGroup.add(this.playButton);
    this.buttonGroup.add(this.settingsButton);
    this.buttonGroup.add(this.rankButton);
    this.buttonGroup.add(this.aboutButton);

    this.playButton.scale.set(1.2);
    this.settingsButton.scale.set(3);
    this.rankButton.scale.set(3);
    this.aboutButton.scale.set(3);
    this.playButton.anchor.setTo(0.5, 0.5);
    this.settingsButton.anchor.setTo(0.5, 0.5);
    this.rankButton.anchor.setTo(0.5, 0.5);
    this.aboutButton.anchor.setTo(0.5, 0.5);

    this.LIGHT_RADIUS = 400;
    this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    var lightSprite = this.game.add.image(0, 0, this.shadowTexture);
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    this.updateShadowTexture();
  },
  createContent: function() {
    this.tilespriteBrickWall = this.game.add.tileSprite(0, 0, 800, 600, 'tiles', 'wallBricks');
    this.tilespriteWoodStand = this.game.add.tileSprite(0, 0, 800, 28, 'tiles', 'woodStand');
    this.tilespriteWoodStand.y = this.game.world.height;
    this.tilespriteWoodStand.anchor.set(0, 1);

    this.tilespriteBrickWall.scale.set(4);
    this.tilespriteWoodStand.scale.set(4);

    this.tilespriteTelon = this.game.add.tileSprite(0, 0, 800, 90, 'tiles', 'telon');
    this.tilespriteTelonBottom = this.game.add.tileSprite(0, 0, 800, 5, 'tiles', 'telonbottom');
    this.tilespriteTelonBottom.y = this.game.world.height - 50;
    this.tilespriteTelonBottom.anchor.set(0, 1);
    this.tilespriteTelon.scale.set(6);
    this.tilespriteTelonBottom.scale.set(6);

    this.telonSprite = this.game.add.sprite(0, 0, 'letrero');
    this.telonSprite.anchor.setTo(0.5, 0.5);
    this.telonSprite.scale.set(5);
    this.telonSprite.frameName = 'letrero1';
    this.telonSprite.x = this.game.world.centerX;
    this.telonSprite.y = this.game.world.centerY - 120;
    this.telonSprite.animations.add('idle');
    this.telonSprite.animations.play('idle', 2, true);

    this.telonText = this.game.add.bitmapText(0, 0, 'carrier_command', "Joke's\n\non\n\nYou", 20);
    this.telonText.align = 'center';
    this.telonText.updateText();
    this.telonText.x = this.game.world.centerX -this.telonText.textWidth / 2;
    this.telonText.y = this.game.world.centerY -this.telonText.textHeight * 1.2;
    this.telonText.tint = '#ff0000';

    this.telon = this.game.add.group();
    this.telon.add(this.tilespriteTelon);
    this.telon.add(this.tilespriteTelonBottom);
    this.telon.add(this.telonSprite);
    this.telon.add(this.telonText);
  },
  updateShadowTexture: function() {
    this.shadowTexture.context.fillStyle = 'rgb(80, 80, 80)';
    this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

    // Draw circle of light
    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
    this.shadowTexture.context.arc(this.game.world.centerX, this.game.world.centerY,
      this.LIGHT_RADIUS, 0, Math.PI * 2);
    this.shadowTexture.context.fill();

    // This just tells the engine it should update the texture cache
    this.shadowTexture.dirty = true;
  },
  transition: function(sceneName) {
    this.game.add.tween(this.telon).to({
      y: (-this.game.world.width * 0.7)
    }, 1000, Phaser.Easing.Quadratic.Out, true).onComplete.add(function() {
      this.game.state.start(sceneName);
    }, this);

    this.game.add.tween(this.buttonGroup).to({
      y: (-this.game.world.width * 0.7)
    }, 1000, Phaser.Easing.Quadratic.Out, true);
  }
};

module.exports = Menu;

},{}],7:[function(require,module,exports){
'use strict';

function Play() {}
Play.prototype = {
  init: function(CHARACTERINDEX) {
    this.CHARACTERINDEX = CHARACTERINDEX;
  },
  create: function() {
    this.clickSound = this.game.add.audio('click');
    this.booSound = this.game.add.audio('boo');
    this.laughsSound = this.game.add.audio('laughs');
    this.punchLineSound = this.game.add.audio('punchline');
    this.splatSound = this.game.add.audio('splat');
    this.createContent();
    this.createPlayer();
    this.score = 0;
    this.puzzleJson = {};
    this.puzzleJson = Phaser.Utils.extend(true, {}, this.game.cache.getJSON('puzzlesJson'));
    this.level = 1;
    this.errors = 0;
    this.puzzleQGroup = this.game.add.group();
    this.puzzleQGroup.mask = this.maskDialog;

    this.puzzleAnswerGroup = this.game.add.group();
    this.currentPuzzle = {};
    this.puzzleQGroup.x = -this.dialog.width / 2.5;
    this.puzzleAnswerGroup.x = -120;
    this.dialog.add(this.puzzleQGroup);
    this.dialog.add(this.puzzleAnswerGroup);

    this.micSprite = this.game.add.sprite(0, 0, 'misc');
    this.micSprite.anchor.setTo(0.5, 1);
    this.micSprite.scale.set(8);
    this.micSprite.frameName = 'mic';
    this.micSprite.x = this.game.world.centerX - 100;
    this.micSprite.y = this.game.world.height - 50;

    this.lifeGroup = this.add.group();
    for (var i = 5; i >= 0; i--) {
      var sprite = this.add.sprite(50*i, 0, 'gui');
      sprite.frameName  = 'heart__0';
      sprite.scale.set(4);
      this.lifeGroup.add(sprite);
    }
    this.lifeGroup.x = this.game.world.centerX - (this.lifeGroup.width/2);
    this.lifeGroup.y = 130;


    this.LIGHT_RADIUS = 400;
    this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    var lightSprite = this.game.add.image(0, 0, this.shadowTexture);
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    this.updateShadowTexture();

    this.game.time.events.add(Phaser.Timer.SECOND * 1, this.startGame, this);
    //this.game.time.events.repeat(Phaser.Timer.SECOND * 2, 10, this.createPuzzle, this);

    this.returnToMenuKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.returnToMenuKey.onDown.add(this.toMenu, this);

    this.backButton = this.game.add.button(5, 5, 'gui', function() {
      this.back();
    }, this, 'back_hover', 'back', 'back_click');
    this.backButton.scale.set(2);
  },
  clickListener: function() {
    this.game.state.start('gameover', true, false, this.CHARACTERINDEX);
  },
  createContent: function() {
    this.tilespriteBrickWall = this.game.add.tileSprite(0, 0, 800, 600, 'tiles', 'wallBricks');
    this.tilespriteWoodStand = this.game.add.tileSprite(0, 0, 800, 28, 'tiles', 'woodStand');
    this.tilespriteWoodStand.y = this.game.world.height;
    this.tilespriteWoodStand.anchor.set(0, 1);

    this.tilespriteBrickWall.scale.set(4);
    this.tilespriteWoodStand.scale.set(4);

    this.tomatosGroup = this.game.add.group();
    this.dialog = this.game.add.group();

    this.dialogSprite = this.game.add.sprite(0, 0, 'gui');
    this.dialogSprite.anchor.setTo(0.5, 0.5);
    this.dialogSprite.scale.set(6, 4);
    this.dialogSprite.frameName = 'dialog';

    this.handSprite = this.game.add.sprite(200, 0, 'gui');
    this.handSprite.anchor.setTo(0.5, 0.5);
    this.handSprite.scale.set(4);
    this.handSprite.frameName = 'hand0';
    this.handSprite.animations.add('idle', Phaser.Animation.generateFrameNames('hand', 0, 1), 2, true);
    this.handSprite.animations.play('idle');
    this.handSprite.alpha = 0;

    this.maskDialog = this.game.add.graphics(0, 0);
    this.maskDialog.beginFill(300, 200, 0, 0);
    this.maskDialog.drawRect(-this.dialogSprite.width * 0.95 / 2, -this.dialogSprite.height * 0.8 / 2, this.dialogSprite.width * 0.95, this.dialogSprite.height * 0.8);
    this.maskDialog.endFill();
    this.maskDialog.alpha = 0;

    this.bmpText = this.game.add.bitmapText(0, 0, 'carrier_command', 'Tap the \n\nmissing tile', 20);
    this.bmpText.align = 'center';
    this.bmpText.updateText();
    this.bmpText.x = -this.bmpText.textWidth / 2;
    this.bmpText.y = -this.bmpText.textHeight / 2;
    this.bmpText.tint = '#e3e3e3';

    this.dialog.add(this.dialogSprite);
    this.dialog.add(this.bmpText);
    this.dialog.add(this.maskDialog);
    this.dialog.add(this.handSprite);
    this.dialog.x = this.game.world.centerX;
    this.dialog.y = 100;

    this.game.add.tween(this.dialog).to({
      y: '-5'
    }, 200, Phaser.Easing.Back.InOut, true, 0, 200, true);
  },
  createPlayer: function() {
    var tmpTexturePlayer = this.game.add.bitmapData(200, 300);
    switch (this.CHARACTERINDEX) {
      case 0:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'delfin');
        break;
      case 1:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'oso');
        break;
      case 2:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'bird');
        break;
      case 3:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'cat');
        break;
      case 4:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'carballo');
        break;
      case 5:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'conejo');
        break;
      default:
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'delfin');
        break;
    }
    tmpTexturePlayer.context.fillRect(0, 0, 200, 300);

    this.player.scale.set(-8, 8);
    this.player.anchor.setTo(0.5, 1);
    this.player.inputEnabled = true;
    this.player.input.pixelPerfectClick = true;
    this.player.animations.add('idle', Phaser.Animation.generateFrameNames('Idle_', 0, 3), 6, true);
    this.player.animations.add('correct', Phaser.Animation.generateFrameNames('Correct_', 0, 3), 6, false).onComplete.add(function() {
      this.player.animations.play('idle');
    }, this);
    this.player.animations.add('error', Phaser.Animation.generateFrameNames('Error_', 0, 3), 6, false).onComplete.add(function() {
      this.player.animations.play('idle');
    }, this);
    this.player.animations.add('click', Phaser.Animation.generateFrameNames('Click_0', 0, 11), 15, false).onComplete.add(function() {
      this.player.animations.play('idle');
    }, this);
    this.player.animations.play('idle');
    this.player.events.onInputDown.add(function() {
      this.clickSound.play();
      this.player.animations.play('click');
    }, this);
  },
  updateShadowTexture: function() {
    this.shadowTexture.context.fillStyle = 'rgb(80, 80, 80)';
    this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

    // Draw circle of light
    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
    this.shadowTexture.context.arc(this.game.world.centerX, this.game.world.centerY, this.LIGHT_RADIUS, 0, Math.PI * 2);
    this.shadowTexture.context.fill();

    // This just tells the engine it should update the texture cache
    this.shadowTexture.dirty = true;
  },
  toMenu: function() {
    localStorage.setItem('lastScore', this.score);
    this.game.state.start('gameover', true, false, this.CHARACTERINDEX);
  },
  startGame: function() {
    this.game.add.tween(this.bmpText).to({
      alpha: 0
    }, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
      this.bmpText.destroy();
      this.createPuzzle();
    }, this);
  },
  createPuzzle: function() {
    this.puzzleQGroup.x = this.dialogSprite.width;
    console.log('createPuzzle');
    var i = 0;
    var piece = {};
    this.puzzleQGroup.callAll('kill');
    this.puzzleAnswerGroup.callAll('kill');
    if (this.puzzleJson['level' + this.level].length === 0) {
      this.level++;
      if (this.level === 3) {
        this.toMenu();
      }
    }
    Phaser.Utils.shuffle(this.puzzleJson['level' + this.level]);
    this.currentPuzzle = this.puzzleJson['level' + this.level].pop();
    for (i = this.currentPuzzle.question.length - 1; i >= 0; i--) {
      piece = this.puzzleQGroup.getFirstExists(false);
      if (piece) {
        piece.revive();
      } else {
        piece = this.game.add.image(0, 0, 'patrones');
        piece.anchor.setTo(0.5, 0.5);
        piece.scale.set(5);
        this.puzzleQGroup.add(piece);
      }
      piece.alpha = 0;
      piece.x = 80 * i;
      piece.frameName = this.currentPuzzle.question[i];
      this.game.add.tween(piece).to({
        alpha: 1
      }, 500, Phaser.Easing.Linear.None, true);
    }

    this.game.add.tween(this.puzzleQGroup).to({
      x: -this.game.world.width
    }, 5000, Phaser.Easing.Linear.None, true).onComplete.add(this.createAnswers, this);
  },
  createAnswers: function() {
    var i = 0;
    var piece = {};
    for (i = this.currentPuzzle.decoy.length - 1; i >= 0; i--) {
      piece = this.puzzleAnswerGroup.getFirstExists(false);
      if (piece) {
        piece.revive();
      } else {
        piece = this.game.add.image(0, 0, 'patrones');
        piece.anchor.setTo(0.5, 0.5);
        piece.scale.set(5);
        this.puzzleAnswerGroup.add(piece);
      }
      piece.alpha = 0;
      piece.x = 80 * i;
      piece.frameName = this.currentPuzzle.decoy[i];

      piece.inputEnabled = true;
      piece.input.pixelPerfectClick = true;
      piece.events.onInputDown.add(this.checkAnswer, this);
      this.game.add.tween(piece).to({
        alpha: 1
      }, 500, Phaser.Easing.Linear.None, true);
      this.game.add.tween(this.handSprite).to({
        alpha: 1
      }, 500, Phaser.Easing.Linear.None, true);
    }
  },
  throwTomatoes: function(num) {
    console.log('throwTomatoes');
    for (var i = num - 1; i >= 0; i--) {
      var piece = this.tomatosGroup.getFirstExists(false);
      if (piece) {
        piece.revive();
      } else {
        piece = this.game.add.sprite(0, 0, 'misc');
        piece.scale.set(4);
        //this.clickSound.play();
        piece.animations.add('floor', Phaser.Animation.generateFrameNames('tomato_floor_', 0, 4), 6, false);
        piece.animations.add('wall', Phaser.Animation.generateFrameNames('tomato_Wall_', 0, 4), 6, false);
        this.tomatosGroup.add(piece);
      }
      piece.frameName = 'tomato_floor_0';

      piece.x = 0;
      piece.y = this.game.world.height;

      var xTarget = this.game.world.randomX;
      var yTarget = this.game.world.randomY;
      var time = 1000;
      this.game.add.tween(piece)
        .to({
          x: xTarget,
          y: yTarget - 100
        }, time * 0.5, Phaser.Easing.Sinusoidal.Out)
        .to({
          x: xTarget,
          y: yTarget
        }, 500, Phaser.Easing.Sinusoidal.In)
        .start().onComplete.add(function() {
          if (yTarget > 100) {
            this.splatSound.play();
            piece.animations.play('wall');
          } else {
            this.splatSound.play();
            piece.animations.play('floor');
          }
        }, this);
      this.game.add.tween(piece.scale)
        .to({
          x: 4,
          y: 4
        }, time * 0.5, Phaser.Easing.Sinusoidal.Out)
        .to({
          x: 2,
          y: 2
        }, time * 0.1, Phaser.Easing.Sinusoidal.In)
        .start();
    }
  },
  checkAnswer: function(clicked) {
    this.clickSound.play();
    this.handSprite.alpha = 0;
    if (clicked.frameName === this.currentPuzzle.answer) {
      console.log('Correct!');
      this.laughsSound.play();
      this.player.animations.play('correct');
      this.score += 100;
    } else {
      console.log('Wrong!');
      this.booSound.play();
      this.punchLineSound.play();
      this.lifeGroup.getFirstAlive().kill();
      this.errors++;
      if (this.errors === 6) {
        this.toMenu();
      } else {
        this.throwTomatoes(this.errors);
        this.player.animations.play('error');
      }
    }
    this.createPuzzle();
  },
  back: function() {
    this.game.state.start('menu');
  }
};

module.exports = Play;

},{}],8:[function(require,module,exports){
'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.game.stage.backgroundColor = '#AA55AA';
    this.assetBG = this.add.image(this.game.world.centerX, this.game.world.centerY, 'preloaderBG');
    this.asset = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloader');
    this.assetBG.anchor.setTo(0.5, 0.5);
    this.asset.x -= this.asset.width / 2;
    this.asset.y -= this.asset.height / 2;

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.atlasJSONHash('tiles', 'assets/tiles.png', 'assets/tiles.json');
    this.load.atlasJSONHash('patrones', 'assets/patrones.png', 'assets/patrones.json');
    this.load.atlasJSONHash('delfin', 'assets/delfin.png', 'assets/delfin.json');
    this.load.atlasJSONHash('oso', 'assets/oso.png', 'assets/oso.json');
    this.load.atlasJSONHash('cat', 'assets/cat.png', 'assets/cat.json');
    this.load.atlasJSONHash('bird', 'assets/bird.png', 'assets/bird.json');
    this.load.atlasJSONHash('carballo', 'assets/carballo.png', 'assets/carballo.json');
    this.load.atlasJSONHash('conejo', 'assets/conejo.png', 'assets/conejo.json');
    this.load.atlasJSONHash('letrero', 'assets/letrero.png', 'assets/letrero.json');
    this.load.atlasJSONHash('gui', 'assets/gui.png', 'assets/gui.json');
    this.load.atlasJSONHash('misc', 'assets/misc.png', 'assets/misc.json');
    this.load.bitmapFont('carrier_command', 'assets/carrier_command.png', 'assets/carrier_command.xml');
    this.load.json('puzzlesJson', 'assets/puzzles.json');

    this.load.audio('background', ['assets/mp3/background.mp3', 'assets/ogg/background.ogg']);
    this.load.audio('boo', ['assets/mp3/boo.mp3', 'assets/ogg/boo.ogg']);
    this.load.audio('click', ['assets/mp3/click1.mp3', 'assets/ogg/click1.ogg']);
    this.load.audio('click2', ['assets/mp3/click2.mp3', 'assets/ogg/click2.ogg']);
    this.load.audio('switch', ['assets/mp3/switch.mp3', 'assets/ogg/switch.ogg']);
    this.load.audio('laughs', ['assets/mp3/laughs.mp3', 'assets/ogg/laughs.ogg']);
    this.load.audio('punchline', ['assets/mp3/punchline.mp3', 'assets/ogg/punchline.ogg']);
    this.load.audio('splat', ['assets/mp3/splat.mp3', 'assets/ogg/splat.ogg']);
  },
  create: function() {
    Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
    this.asset.cropEnabled = false;
    this.music = this.game.add.audio('background', 0.5, true);
    this.musicSetting = localStorage.getItem('music');
    //if (this.musicSetting === 'true' || this.musicSetting) {
      this.music.play();
    //}
  },
  update: function() {
    if (!!this.ready) {
      this.game.state.start('menu');
      //this.game.state.start('characterSelect');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}],9:[function(require,module,exports){
'use strict';

function Settings() {}
Settings.prototype = {
  create: function() {
    this.createContent();
    this.musicSetting = localStorage.getItem('music');
    this.fxSetting = localStorage.getItem('fx');

    this.music = this.game.add.audio('background', 0.5, true);

    this.switchSound = this.game.add.audio('switch');
    this.switchSound.play();

    this.LIGHT_RADIUS = 400;
    this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    var lightSprite = this.game.add.image(0, 0, this.shadowTexture);
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    this.updateShadowTexture();

    this.backButton = this.game.add.button(5, 5, 'gui', function() {
      this.back();
    }, this, 'back_hover', 'back', 'back_click');
    this.fxButton = this.game.add.button(this.game.world.width - 160, this.game.world.centerY, 'gui', function() {
      this.manageFx();
    }, this, 'bocina_hover', 'bocina', 'bocina_click');
    this.musicButton = this.game.add.button(160, this.game.world.centerY, 'gui', function() {
      this.manageMusic();
    }, this, 'fx_hover', 'fx', 'fx_click');

    this.buttonGroup = this.game.add.group();
    this.buttonGroup.add(this.musicButton);
    this.buttonGroup.add(this.fxButton);

    this.tacheMusic = this.game.add.image(160, this.game.world.centerY, 'gui');
    this.tacheFx = this.game.add.image(this.game.world.width - 160, this.game.world.centerY, 'gui');

    this.tacheMusic.frameName = 'tache';
    this.tacheFx.frameName = 'tache';

    if (this.musicSetting === 'false' || !this.musicSetting) {
      this.tacheMusic.alpha = 0;
    } else {
      this.tacheMusic.alpha = 1;
    }

    if (this.fxSetting === 'false' || !this.fxSetting) {
      this.tacheMusic.alpha = 0;
    } else {
      this.tacheMusic.alpha = 1;
    }

    this.tacheMusic.alpha = 0;
    this.tacheFx.alpha = 0;

    this.tacheMusic.anchor.setTo(0.5);
    this.tacheFx.anchor.setTo(0.5);

    this.tacheMusic.scale.set(5);
    this.tacheFx.scale.set(5);

    this.musicButton.scale.set(5);
    this.fxButton.scale.set(5);
    this.backButton.scale.set(2);
    this.musicButton.anchor.setTo(0.5, 0.5);
    this.fxButton.anchor.setTo(0.5, 0.5);
  },
  createContent: function() {
    this.tilespriteBrickWall = this.game.add.tileSprite(0, 0, 800, 600, 'tiles', 'wallBricks');
    this.tilespriteWoodStand = this.game.add.tileSprite(0, 0, 800, 28, 'tiles', 'woodStand');
    this.tilespriteWoodStand.y = this.game.world.height;
    this.tilespriteWoodStand.anchor.set(0, 1);

    this.tilespriteBrickWall.scale.set(4);
    this.tilespriteWoodStand.scale.set(4);

    this.dialog = this.game.add.group();

    this.dialogSprite = this.game.add.sprite(0, 0, 'gui');
    this.dialogSprite.anchor.setTo(0.5, 0.5);
    this.dialogSprite.scale.set(6, 4);
    this.dialogSprite.frameName = 'dialog';

    this.bmpText = this.game.add.bitmapText(0, 0, 'carrier_command', 'Settings', 20);
    this.bmpText.align = 'center';
    this.bmpText.updateText();
    this.bmpText.x = -this.bmpText.textWidth / 2;
    this.bmpText.y = -this.bmpText.textHeight / 2;
    this.bmpText.tint = '#e3e3e3';

    this.dialog.add(this.dialogSprite);
    this.dialog.add(this.bmpText);
    this.dialog.x = this.game.world.centerX;
    this.dialog.y = 100;

    this.game.add.tween(this.dialog).to({
      y: '-5'
    }, 200, Phaser.Easing.Back.InOut, true, 0, 200, true);

    var sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.height + 10, 'oso');
    sprite.animations.add('idle', Phaser.Animation.generateFrameNames('Idle_', 0, 4), 6, true);
    sprite.animations.add('click', Phaser.Animation.generateFrameNames('Click_0', 0, 11), 15, false).onComplete.add(function() {
      this.selectCharacter();
    }, this);
    sprite.animations.play('idle');
    sprite.scale.set(-8, 8);
    sprite.anchor.setTo(0.5, 1);
    sprite.inputEnabled = true;
    sprite.input.pixelPerfectClick = true;
    sprite.events.onInputDown.add(function() {
      this.click2Sound.play();
      sprite.animations.play('click');
    }, this);

    this.micSprite = this.game.add.sprite(0, 0, 'misc');
    this.micSprite.anchor.setTo(0.5, 1);
    this.micSprite.scale.set(8);
    this.micSprite.frameName = 'mic';
    this.micSprite.x = this.game.world.centerX - 100;
    this.micSprite.y = this.game.world.height - 50;
  },
  updateShadowTexture: function() {
    this.shadowTexture.context.fillStyle = 'rgb(80, 80, 80)';
    this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

    // Draw circle of light
    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
    this.shadowTexture.context.arc(this.game.world.centerX, this.game.world.centerY,
      this.LIGHT_RADIUS, 0, Math.PI * 2);
    this.shadowTexture.context.fill();

    // This just tells the engine it should update the texture cache
    this.shadowTexture.dirty = true;
  },
  manageMusic: function() {
    console.log('Managae Music');
    this.musicSetting = localStorage.getItem('music');
    if (this.musicSetting === 'false' || !this.musicSetting) {
      this.tacheMusic.alpha = 0;
      this.music.play();
      localStorage.setItem('music', 'true');
    } else {
      this.tacheMusic.alpha = 1;
      this.game.sound.stopAll();
      localStorage.setItem('music', 'false');
    }
  },
  manageFx: function() {
    console.log('Managae Fx');
    this.fxSetting = localStorage.getItem('fx');
    if (this.fxSetting === 'false' || !this.fxSetting) {
      this.tacheFx.alpha = 0;
      localStorage.setItem('fx', 'true');

    } else {
      this.tacheFx.alpha = 1;
      localStorage.setItem('fx', 'false');
    }
  },
  back: function() {
    this.game.state.start('menu');
  }
};
module.exports = Settings;

},{}]},{},[1])
var AsteroidGame = (function() {
  function Ship() {
    this.x = 450;
    this.y = 200;

    this.move = function(velocity_array, ctx) {
      this.x += velocity_array[0];
      this.y += velocity_array[1]
    };

    this.draw = function(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, 360, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "blue";
    }
  }

  function Asteroid() {
    var that = this;

    this.x = Math.floor(Math.random()*900+1);
    this.y = Math.floor(Math.random()*400+1);
    this.velocity = {'x': Math.floor(Math.random()*20+1) - Math.floor(Math.random()*20+1),
                       'y': Math.floor(Math.random()*20+1) - Math.floor(Math.random()*20+1)}


    this.draw = function(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, 360, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "red";
    };

    this.update = function(ctx) {
      this.x += this.velocity['x']
      this.y += this.velocity['y']
      if (this.x >= 900) {
        this.x -= 900;
      };
      if (this.x < 0) {
        this.x += 900;
      };
      if (this.y >= 400) {
        this.y -= 400;
      };
      if (this.y < 0) {
        this.y += 400;
      }
    }
  }

  function Game() {
    return {
      asteroids: [],
      ship: null,
      initialize: function(ctx) {
        var that = this;
        _.times(30, function() {
          that.asteroids.push(new Asteroid());
        });
        this.ship = new Ship();
      },

      draw: function(ctx) {
        ctx.clearRect(0, 0, 900, 900);
        _.each(this.asteroids, function(asteroid) {
          asteroid.draw(ctx)
        });
        this.ship.draw(ctx);
      },
      update: function(ctx) {
        var that = this
        _.each(this.asteroids, function(asteroid) {
          asteroid.update(ctx);
          that.draw(ctx);
        });

      },
      start: function(ctx) {
        this.initialize(ctx);
        this.draw(ctx);
      }
    }
  }

  return {
    Asteroid: Asteroid,
    Game: Game,
    Ship: Ship
  };
})();




$(function draw() {
  $('body').append('<canvas id="asteroids" width ="900" height="400"></canvas>');
  var canvas = document.getElementById('asteroids');
  var ctx = canvas.getContext('2d');
  game = new AsteroidGame.Game

  game.start(ctx)

  setInterval(function() { game.update(ctx) }, 60);

  $('html').keydown(function(event) {
    if(event.keyCode == 38) {
      game.ship.move([0, -15]);
    }
    if(event.keyCode == 39) {
      game.ship.move([15, 0]);
    }
    if(event.keyCode == 40) {
      game.ship.move([0, 15]);
    }
    if(event.keyCode == 37) {
      game.ship.move([-15, 0]);
    }
  });
})
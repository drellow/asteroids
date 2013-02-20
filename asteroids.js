var AsteroidGame = (function() {
  function Ship() {
    this.x = 450;
    this.y = 200;
    this.velocity = .05;
    this.direction = [0,0]

    this.move = function(ctx) {
      this.x += this.velocity * this.direction[0];
      this.y += this.velocity * this.direction[1];

      if (this.x >= 1420) {
        this.x -= 1400;
      };
      if (this.x < -20) {
        this.x += 1400;
      };
      if (this.y >= 1420) {
        this.y -= 1400;
      };
      if (this.y < -20) {
        this.y += 1400;
      }
    };

    this.draw = function(ctx) {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, 360, true);
      ctx.closePath();
      ctx.fill();
    }
  }

  function Asteroid() {
    var that = this;
    that.size = Math.floor(Math.random()*10+3)

    that.x = Math.floor(Math.random()*1300+1);
    that.y = Math.floor(Math.random()*800+1);
    that.velocity = {'x': Math.floor(Math.random()*4+1) - Math.floor(Math.random()*4+1),
                       'y': Math.floor(Math.random()*4+1) - Math.floor(Math.random()*4+1)}

    that.setVelocity = function() {
      that.velocity = {'x': Math.floor(Math.random()*4+1) - Math.floor(Math.random()*4+1),
                       'y': Math.floor(Math.random()*4+1) - Math.floor(Math.random()*4+1)}

      console.log(that.velocity['x']);
      console.log(that.velocity['y']);

      if (that.velocity['x'] == 0) {
        that.setVelocity
      }

      if (that.velocity['y'] == 0) {
        that.setVelocity
      }
    }


    this.draw = function(ctx) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(this.x, this.y, that.size, 0, 360, true);
      ctx.closePath();
      ctx.fill();
    };

    this.update = function(ctx) {
      this.x += this.velocity['x']
      this.y += this.velocity['y']

      if (this.x >= 1420) {
        this.x -= 1400;
      };
      if (this.x < -20) {
        this.x += 1400;
      };
      if (this.y >= 1420) {
        this.y -= 1400;
      };
      if (this.y < -20) {
        this.y += 1400;
      }
    }
  }


  function Game(ctx) {
    var that = this;
    that.asteroids = [];
    that.bullets = [];
    that.ship = new Ship();
    that.planet = new Planet();
    that.death = false;

      _.times(60, function() {
        that.asteroids.push(new Asteroid());
      })

    that.makeBullet = function(directionArray, ctx) {
      var bullet = new Bullet(that.ship, directionArray, ctx);

      that.bullets.push(bullet);
    }

    that.draw = function(ctx) {
      ctx.clearRect(0, 0, 1400, 1400);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 1400, 800);
      that.planet.draw(ctx);
      _.each(that.asteroids, function(asteroid) {
        asteroid.draw(ctx);
      });
      _.each(that.bullets, function(bullet) {
        bullet.draw(ctx);
      })
      that.ship.draw(ctx);
    }

    that.checkAsteroidCollision = function(bullet) {
      _.each(that.asteroids, function(asteroid) {
        if (Math.sqrt(((bullet.x - asteroid.x) * (bullet.x - asteroid.x)) + ((bullet.y - asteroid.y) * (bullet.y - asteroid.y))) < (asteroid.size)) {
          asteroid.setVelocity();
          // asteroid.velocity['x'] = bullet.direction[0];
          // asteroid.velocity['y'] = bullet.direction[1];
          that.bullets = _.without(that.bullets, bullet)
        }
      })
    }

    that.update = function(ctx) {
      _.each(that.bullets, function(bullet) {
          that.checkAsteroidCollision(bullet);
          that.checkBulletOffScreen(bullet);
          bullet.move(ctx);
          that.draw(ctx);
      })
      _.each(that.asteroids, function(asteroid) {
        asteroid.update(ctx);
        that.ship.move();
        that.draw(ctx);
        that.checkDeath(ctx);
        // that.checkPlanetCollision(asteroid);
      });
    }

    that.checkPlanetCollision = function(asteroid) {
      _.each(that.asteroids, function(asteroid) {
          if (Math.sqrt(((that.planet.x - asteroid.x) * (that.planet.x - asteroid.x)) + ((that.planet.y - asteroid.y) * (that.planet.y - asteroid.y))) < (asteroid.size + that.planet.size)) {
            that.asteroids = _.without(that.asteroids, asteroid)
          }
      })
    }

    that.checkBulletOffScreen = function(bullet, ctx) {
      if ((bullet.x > 1420) || (bullet.x < -20)  || (bullet.y > 1420) || (bullet.y < -20)) {
        that.bullets = _.without(that.bullets, bullet)
      }
    }

    that.checkDeath = function(ctx) {
      _.each(that.asteroids, function(asteroid) {
        if (Math.sqrt(((that.ship.x - asteroid.x) * (that.ship.x - asteroid.x)) + ((that.ship.y - asteroid.y) * (that.ship.y - asteroid.y))) < asteroid.size) {
          that.drawDeath(ctx);
          that.death = true
        }
      })
    }

    that.drawDeath = function(ctx) {
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 1400, 800);
    }
  }

  function Planet(ship, ctx) {
    var that = this;
    that.x = Math.floor(Math.random()*1400);
    that.y = Math.floor(Math.random()*800);
    that.size = 300;

    that.draw = function(ctx) {
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.arc(that.x, that.y, that.size, 0, 360, true);
      ctx.closePath();
      ctx.fill();
    }
  }

  function Bullet(ship, direction, ctx) {
    var that = this;
    that.x = ship.x;
    that.y = ship.y;
    that.velocity = 6;
    that.direction = direction;

    that.move = function(ctx) {
      that.x += direction[0] * that.velocity;
      that.y += direction[1] * that.velocity;
    }

    that.draw = function(ctx) {
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(that.x, that.y, 2, 0, 360, true);
      ctx.closePath();
      ctx.fill();
    }
  }

  return {
    Asteroid: Asteroid,
    Game: Game,
    Ship: Ship
  };
})();




$(function draw() {
  $('body').append('<canvas id="asteroids" width ="1400" height="800" background="space.jpg"></canvas>');
  var canvas = document.getElementById('asteroids');
  var ctx = canvas.getContext('2d');
  var timer = 0
  game = new AsteroidGame.Game

  game.draw(ctx)

  setInterval(function() {
      if (game.death == false) {
        game.update(ctx)
      }
    }, 20);

  setInterval(function() {
    fireTimer = true
  }, 240);

  setInterval(function() {
    timer ++
    $('.timer').html(timer);
  }, 1400)

  $('html').keydown(function(event) {
    if(event.keyCode == 38) {
      game.ship.direction[1] += -1;
    }
    if(event.keyCode == 39) {
      game.ship.direction[0] += 1;
    }
    if(event.keyCode == 40) {
      game.ship.direction[1] += 1;
    }
    if(event.keyCode == 37) {
      game.ship.direction[0] += -1;
    }

    if(event.keyCode == 32) {
      game.ship.direction = [0,0];
    }

    if (fireTimer == true){
      if(event.keyCode == 87) {
        game.makeBullet([0,-1]);
        fireTimer = false
      }
      if(event.keyCode == 68) {
        game.makeBullet([1,0]);
        fireTimer = false
      }
      if(event.keyCode == 83) {
        game.makeBullet([0,1]);
        fireTimer = false
      }
      if(event.keyCode == 65) {
        game.makeBullet([-1,0]);
        fireTimer = false
      }
    }
  });
})
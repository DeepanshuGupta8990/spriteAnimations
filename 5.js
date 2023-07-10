/**@type {HTMLCanvasElement}*/
document.addEventListener('DOMContentLoaded', () => {
   const canvas = document.getElementById('canvas1');
   const ctx = canvas.getContext("2d");
   canvas.width = 500;
   canvas.height = 700;

   let lastTime = 0;

   class Game {
      constructor(ctx, width, height) {
         this.ctx = ctx;
         this.width = width;
         this.height = height;
         this.enemies = [];
         this.enemyInterval = 400;
         this.enemyTimer = 0;
         this.enemyType = ['worm','ghost','spider'];
      }
      update(deltaTime) {
         this.enemies = this.enemies.filter((object)=>{
            return (!object.markedFordelete)
         })
         if(this.enemyTimer>this.enemyInterval){
            this.#addNewEnemy();
            this.enemyTimer = 0;
         }else{
            this.enemyTimer += deltaTime;
         }
         this.enemies.forEach((object) => {
            object.update(deltaTime);
         })
      }
      draw() {
         this.enemies.forEach((object) => {
            object.draw(this.ctx);
         })
      }
      #addNewEnemy() {
         const randomEnemy = this.enemyType[Math.floor(Math.random()*this.enemyType.length)];
         if(randomEnemy === 'worm'){
            this.enemies.push(new Worm(this));
         }else if(randomEnemy === 'ghost'){
            this.enemies.push(new Ghost(this));
         }else if(randomEnemy === 'spider'){
            this.enemies.push(new Spider(this));
         }
         let newEnemiesList1 = this.enemies.filter((obj)=> obj.spriteWidth === 310);
         let newEnemiesList2 = this.enemies.filter((obj)=> obj.spriteWidth !== 310)
         newEnemiesList2.sort(function(a,b){
            return a.y-b.y;
         })
         this.enemies = [...newEnemiesList2,...newEnemiesList1]
      }
   }

   class Enemy {
      constructor(game) {
         this.game = game;
         this.markedFordelete = false;
         this.frameX = 0;
         this.maxframe = 5;
         this.frameInterval = 100;
         this.frameTimer = 0;
      }
      update(deltaTime) {
         this.x -= this.speed*deltaTime;
         if(this.frameTimer>this.frameInterval){
          if(this.frameX<this.maxframe){
            this.frameX++;
          }else{
            this.frameX = 0;
          }
          this.frameTimer = 0;
         }else{
            this.frameTimer += deltaTime
         }
         if(this.x<0-this.width){
            this.markedFordelete = true;
         }
      }
      draw(ctx) {
         ctx.drawImage(this.image,this.frameX*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height)
      }
   }

   class Worm extends Enemy{
     constructor(game){
      super(game);
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth/2;
      this.height = this.spriteHeight/2;
      this.x = this.game.width;
      this.y = this.game.height-this.height;
      this.image = worm;
      this.speed = Math.random()*0.1+0.1;
     }
   }

   class Ghost extends Enemy{
     constructor(game){
      super(game);
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth/2;
      this.height = this.spriteHeight/2;
      this.x = this.game.width;
      this.y = Math.random() * (this.game.height-this.width)*0.8;
      this.image = ghost;
      this.speed = Math.random()*0.2+0.1;
      this.opacity = Math.random()*0.4+0.4;
      this.angle = 0;
     }
     update(deltaTime){
      super.update(deltaTime);
      this.y += Math.sin(this.angle)*2;
      this.angle += 0.05;
     }
     draw(ctx){
      ctx.save();
      ctx.globalAlpha = this.opacity
      super.draw(ctx);
      ctx.restore()
     }
   }

   class Spider extends Enemy{
      constructor(game){
       super(game);
       this.spriteWidth = 310;
       this.spriteHeight = 175;
       this.width = this.spriteWidth/2;
       this.height = this.spriteHeight/2;
       this.x = Math.random()*(this.game.width-this.width);
       this.y = 0-this.height;
       this.image = spider;
       this.speed = 0;
       this.vy = 1;
       this.maxLength = Math.random()*this.game.width-20
      }
      update(deltaTime){
         super.update(deltaTime);
         this.y += this.vy
         if(this.y>this.maxLength){
            this.vy = -this.vy;
         }
      }
      draw(ctx){
         ctx.beginPath();
         ctx.moveTo(this.x+this.width/2,0);
         ctx.lineTo(this.x+this.width/2,this.y+10)
         super.draw(ctx);
         ctx.stroke()
      }
    }

   const game = new Game(ctx, canvas.width, canvas.height)
   function animate(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      game.update(deltaTime);
      game.draw();
      requestAnimationFrame(animate);
   }
   animate(0);
})
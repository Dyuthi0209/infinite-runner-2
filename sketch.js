var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var bg;

var gameOver, restart;

var scoreImg, scoreImage;

var play, playImg;

var winner, winnerImg;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
winnerImg = loadImage("youwin.png")

  bg = loadImage("bg.jpg");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  scoreImage= loadImage("score.png");

  playImg=loadImage("play.png")
  
}

function setup() {
  createCanvas(600,200);
  
scoreImg= createSprite(570,30,20,20)
scoreImg.addImage("score", scoreImage);
scoreImg.scale=0.07;

  trex = createSprite(50,190,20,50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.1;

  ground = createSprite(200,265,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.3;

  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale=0.5

  winner = createSprite(300,55)
  winner.addImage(winnerImg);
  winner.scale=0.2;
  
  gameOver.visible = false;
  restart.visible = false;
  winner.visible=false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(bg);
  fill("black")
  textSize(20)
  text( score, 555,40);

  fill("black")
  textSize(15)
  text("Get your score to 750 to win!", 10,20)
 

  camera.position.x = displayWidth/4.3;
  camera.position.y = displayHeight/7.5
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 100) {
      trex.velocityY = -12;
    }
  
    if(keyDown("UP_ARROW") && trex.y >= 100) {
      trex.velocityY = -12;
    }

    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if(score===750){
      gameState = WIN;
    }
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  else if(gameState===WIN){
winner.visible=true;
restart.visible=true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    
    obstacle.velocityX = -(6 + 3*score/100);
   //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.6;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  winner.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
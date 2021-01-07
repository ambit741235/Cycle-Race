var path,mainCyclist;
var pathImg,mainRacerImg1,mainRacerImg2;

var pinkCG, yellowCG, redCG, cycleBell, oppPink1Img, oppYellow1Img, oppRed1Img, oppPink2Img, oppYellow2Img, oppRed2Img;

var player1, player2, player3;

var gameOver, gameOverImg, restart, restartButton;

var obstacles, obstaclesGroup;

var obstacles1, obstacles2, obstacles3;

var END =0;
var PLAY =1;
var gameState = PLAY;

var distance=0;

function preload(){
  pathImg = loadImage("images/Road.png");
  
  mainRacerImg1 = loadAnimation("images/mainPlayer1.png","images/mainPlayer2.png");
  mainRacerImg2= loadAnimation("images/mainPlayer3.png");
  
  oppPink1Img = loadAnimation("images/opponent1.png","images/opponent2.png");
  oppYellow1Img = loadAnimation("images/opponent4.png","images/opponent5.png");
  oppRed1Img = loadAnimation("images/opponent7.png","images/opponent8.png");
  
  oppPink2Img = loadAnimation("images/opponent3.png");
  oppYellow2Img = loadAnimation("images/opponent6.png");
  oppRed2Img = loadAnimation("images/opponent9.png");
  
  gameOverImg = loadImage("images/gameOver.png");
  cycleBell = loadSound("sound/bell.mp3");
  
  obstacles1 = loadImage("images/obstacle1.png");
  obstacles2 = loadImage("images/obstacle2.png");
  obstacles3 = loadImage("images/obstacle3.png");

  restartButton = loadImage("images/restart.png");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  // Moving background
  path=createSprite(width/2,/*200*/height/2);
  path.addImage(pathImg);
  path.velocityX = -(6 + 2 * distance/150);
  
  //creating boy running
  mainCyclist  = createSprite(width/2,height-20,20,20);
  mainCyclist.addAnimation("SahilRunning",mainRacerImg1);
  mainCyclist.scale=0.07;
  
  gameOver = createSprite(width/2,height/2,10,10);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  restart = createSprite(width/2,(height/2)+65,10,10);
  restart.addImage(restartButton);
  restart.scale = 0.07;
  restart.visible = false;
  
  pinkCG = createGroup();
  yellowCG = createGroup();
  redCG = createGroup();
  obstaclesGroup = createGroup();
}

function draw() {
  background(0);
  
  drawSprites();
  textSize(20);
  fill(255);
  text("Distance: "+ distance,width/2,30);
  
  if(gameState===PLAY){
    distance = distance + Math.round(getFrameRate()/50);
    mainCyclist.y = World.mouseY;
  
    edges= createEdgeSprites();
    mainCyclist.collide(edges);
    
    var select_oppPlayer = Math.round(random(1,3));
    if(frameCount % 150 == 0){
      if(select_oppPlayer == 1){
        pinkCyclists();
      }else if(select_oppPlayer == 2){
        yellowCyclists();
      }else {
        redCyclists();
      }
    }
    spawnObstacles();
    console.log(select_oppPlayer);
    
    if(keyDown("space")){
      cycleBell.play();
    }
    
    if(pinkCG.isTouching(mainCyclist)){
      gameState = END;
      player1.velocityX = 0;
      player1.addAnimation("opponentPlayer1",oppPink2Img);
    }
    if(yellowCG.isTouching(mainCyclist)){
      gameState = END;
      player2.velocityX = 0;
      player2.addAnimation("opponentPlayer2",oppYellow2Img);
    }
    if(redCG.isTouching(mainCyclist)){
      gameState = END;
      player3.velocityX = 0;
      player3.addAnimation("opponentPlayer3",oppRed2Img);
    }
    if(obstaclesGroup.isTouching(mainCyclist)){
      gameState = END;
      obstacles.velocityX = 0;
      pinkCG.destroyEach();
      yellowCG.destroyEach();
      redCG.destroyEach();
    }
    
    //code to reset the background
    if(path.x < 0 ){
     path.x = width/2;
    }
    
  }else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    textSize(20);
    fill(255);
    text("Press Up Arrow to Restart the game!",(width/2)-140,/*height-200*/(height/2)-(-35));
    text("Or, Press Restart Button to Restart the game!",(width/2)-200,(height/2)-(-50));
    
    path.velocityX = 0;
    mainCyclist.velocityX = 0;
    mainCyclist.addAnimation("SahilRunning",mainRacerImg2);
    
    pinkCG.setVelocityXEach(0);
    pinkCG.setLifetimeEach(-1);
    
    yellowCG.setVelocityXEach(0);
    yellowCG.setLifetimeEach(-1);
    
    redCG.setVelocityXEach(0);
    redCG.setLifetimeEach(-1);
    
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    
    if(keyDown("UP_ARROW") || mousePressedOver(restart)){
      reset();
    }
    if (touches.length > 0) {
      if (restart.overlapPoint(touches[0].x, touches[0].y)) {
        reset();
        touches = []
      }
    }
  }
}

function pinkCyclists(){
  player1 = createSprite(1100,Math.round(random(50,width-50)),10,10);
  player1.scale = 0.06;
  player1.velocityX = -(6 + 2 * distance/150);
  player1.addAnimation("opponentPlayer1",oppPink1Img);
  player1.setLifetime = 170;
  pinkCG.add(player1);
}

function yellowCyclists(){
  player2 = createSprite(1100,Math.round(random(50,width-50)),10,10);
  player2.scale = 0.06;
  player2.velocityX = -(6 + 2 * distance/150);
  player2.addAnimation("opponentPlayer2",oppYellow1Img);
  player2.setLifetime = 170;
  yellowCG.add(player2);
}

function redCyclists(){
  player3 = createSprite(1100,Math.round(random(50,width-50)),10,10);
  player3.scale = 0.06;
  player3.velocityX = -(6 + 2 * distance/150);
  player3.addAnimation("opponentPlayer3",oppRed1Img);
  player3.setLifetime = 170;
  redCG.add(player3);
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  pinkCG.destroyEach();
  yellowCG.destroyEach();
  redCG.destroyEach();
  obstaclesGroup.destroyEach();
  
  distance = 0;
  
  mainCyclist.addAnimation("SahilRunning",mainRacerImg1);
  path.velocityX = -(6 + 2 * distance/150);
  
}

function spawnObstacles(){
  if(frameCount % 60 == 0){
    obstacles = createSprite(1100,Math.round(random(50,width-50)),10,10);
    obstacles.velocityX = -(6 + 2 * distance/150);
    obstacles.scale = 0.1;
    var rand = Math.round(random(1,3));
    switch(rand){
      case 1: obstacles.addImage(obstacles1);
              break;
      case 2: obstacles.addImage(obstacles2);
              break;
      case 3: obstacles.addImage(obstacles3);
              break;
      default: break;
    }
    obstacles.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;

    obstacles.depth = restart.depth;
    restart.depth = restart.depth + 1;
    obstaclesGroup.add(obstacles);
  }
}

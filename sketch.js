var Play=1;
var End=0;

var estadoJogo= Play;

var trex ,trex_running ,trex_collided;
var soloImage;
var pontos;

function preload(){
  trex_running=loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided=loadImage("trex_collided.png");
  soloImage=loadImage("ground2.png");
  nuvemImage=loadImage("cloud.png");
  obstaculo1=loadImage("obstacle1.png");
  obstaculo2=loadImage("obstacle2.png");
  obstaculo3=loadImage("obstacle3.png");
  obstaculo4=loadImage("obstacle4.png");
  obstaculo5=loadImage("obstacle5.png");
  obstaculo6=loadImage("obstacle6.png");
  fimImg=loadImage("gameOver.png");
  reinicio=loadImage("restart.png")

  somPulo=loadSound("jump.mp3");
  somMorte=loadSound("die.mp3");
  somPoint=loadSound("checkPoint.mp3");

}

function setup(){
  createCanvas(600,200)
  

 trex=createSprite(50,160,20,50);
 trex.addAnimation("running", trex_running);
 trex.addAnimation("collided", trex_collided);
 trex.scale=0.5;
 trex.x=50;

 solo=createSprite(200,180,400,20);
 solo.addImage("solo", soloImage);
 solo.x=solo.width/2;

 fim=createSprite(200,200);
 fim.addImage("fim", fimImg);

 restart=createSprite(300,140);
 restart.addImage(reinicio);

 solo_invisivel=createSprite(200,190,400,10);
 solo_invisivel.visible=false;

 var rand=Math.round(random(1,100));
 
 pontos=0;

 GrupoObstaculos= new Group();
 GrupoNuvens= new Group();

 trex.setCollider("circle",0,0,40);
 trex.debug=true;
}

function draw(){
  background("white")
  text("Pontuação:"+pontos,500,50);
  trex.collided(solo_invisivel);

  if(mousePressedOver(restart)){
    console.log("reiniciar o jogo");
    reset();
  }
  
  drawSprites();

  trex.collide(solo_invisivel);

  if(estadoJogo==Play){
    fim.visible=false;
    restart.visible=false;
    
    solo.velocityX= -(2 + 3*pontos/100);
    pontos=pontos+ Math.round(frameCount/60);
    
    if(pontos>0 && pontos % 100==0){
      somPoint.play();
    }

    if(solo.x<0){
      solo.x=solo.width/2;
    }

    if(keyDown("space") && trex.y>150){
      trex.velocityY=-15;
      somPulo.play();
    }
    trex.velocityY=trex.velocityY+1;
    gerarNuvens();
    gerarObstaculos();
    
    if(GrupoObstaculos.isTouching(trex)){
      estadoJogo=End;
      fim.visible=true;
      restart.visible=true;
      somMorte.play();
    }
  }
  if(estadoJogo==End){
    solo.velocityX=0;
    GrupoNuvens.setVelocityXEach(0);
    GrupoObstaculos.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    GrupoNuvens.setLifetimeEach(-1);
    GrupoObstaculos.setLifetimeEach(-1);
    trex.velocityY=0;
  }
}

function gerarNuvens(){
  if(frameCount % 60 ==0){
    nuvem=createSprite(600,100,40,10);
    nuvem.velocityX=-3;
    nuvem.addImage(nuvemImage);
    nuvem.y=Math.round(random(10,60));
    nuvem.scale=0.4;
  
    nuvem.depth=trex.depth;
    trex.depth=trex.depth+1;

    nuvem.lifetime=220;
    GrupoNuvens.add (nuvem);
  }
}


function gerarObstaculos(){
  if(frameCount % 60==0){
    var obstaculos= createSprite(600,165,10,40);
    obstaculos.velocityX= -(6 + pontos/100);

    var rand=Math.round(random(1,6));
    switch(rand){
      case 1:obstaculos.addImage(obstaculo1);
              break ;
      case 2:obstaculos.addImage(obstaculo2);
              break ;
      case 3:obstaculos.addImage(obstaculo3);
              break ;
      case 4:obstaculos.addImage(obstaculo4);
              break ;
      case 5:obstaculos.addImage(obstaculo5);
              break ;
      case 6:obstaculos.addImage(obstaculo6);
              break ;

    }

    obstaculos.scale=0.5;
    obstaculos.lifetime=300;
    GrupoObstaculos.add(obstaculos);
  }
}

function reset(){
  estadoJogo=Play;
  fim.visible=false;
  restart.visible=false;
  trex.changeAnimation("running", trex_running);
  GrupoObstaculos.destroyEach();
  GrupoNuvens.destroyEach();
  pontos=0;
}
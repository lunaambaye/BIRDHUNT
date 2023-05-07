var context;
var order;
var WIDTH = 1400;
var HEIGHT = 800;
var mouseXPosition;
var mouseYPosition;
var stage;
var animation;
var deathAnimation;
var spriteSheet;
var BirdXPos=100;
var BirdYPos=100;
var BirdXSpeed = 1.5;
var BirdYSpeed = 1.75;
var score = 0;
var stringscore=0;
var gameTimer;
var gameTime = 60;
var timerText;



window.onload = loadpage;


function loadpage()
{
    // size and hight for canvas
      //bring in create js library 

    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = WIDTH;
    context.canvas.height = HEIGHT;
    stage = new createjs.Stage("myCanvas");


	
    //load
    queue = new createjs.LoadQueue(false);
    queue.on("complete", queueLoaded, this);
   

   //set up to load all needed attributes 

    queue.loadManifest([
        {id: 'backgroundImage', src: 'Images/background.png'},
        {id: 'crossHair', src: 'Images/crosshair.png'},
        {id: 'duck', src: 'Images/flying.png'},
        {id: 'death', src: 'Images/death.png'},
    ]);
    queue.load();

  //timer update 
    gameTimer = setInterval(updateTime, 1000);

}




function queueLoaded(event)
{

    // Add background image
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"))
    stage.addChild(backgroundImage);

    //Add Score
    stringscore = new createjs.Text("Score: " + score.toString(), "36px Arial", "#FFF");
    stringscore.x = 10;
    stringscore.y = 10;
    stage.addChild(stringscore);

    //Add Timer
    timerText = new createjs.Text("Time Remaining: " + gameTime.toString(), "36px Arial", "#FFF");
    timerText.x = 1040;
    timerText.y = 10;
    stage.addChild(timerText);

    

    // Create flying spritesheet
    spriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('duck')],
        "frames": {"width": 111, "height": 114},
        "animations": { "flap": [0,5, true, 1] }
    });


    // Create death spritesheet
   deathspr = new createjs.SpriteSheet({
    	"images": [queue.getResult('death')],
    	"frames": {"width": 78, "height" : 120},
    	"animations": {"die": [10,20, false, 1] }
    });


    // Create sprite
    createBird();

   /*
    // Create crosshair
    crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    crossHair.x = WIDTH/2;
    crossHair.y = HEIGHT/2;
    stage.addChild(crossHair);
    */

    // Add ticker
    createjs.Ticker.setFPS(20);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);

    // 
    window.onmousedown = onMouseDown;
}
function createBird()
{
    animation = new createjs.Sprite(spriteSheet, "flap");
    animation.regX = 55;
    animation.regY = 57;
    animation.x = BirdXPos;
    animation.y = BirdYPos;
    animation.gotoAndPlay("flap");
    stage.addChildAt(animation,1);

}

function deathfly()
{
  deathAnimation = new createjs.Sprite(deathspr, "die");
  deathAnimation.regX = 55;
  deathAnimation.regY = 57;
  deathAnimation.x = BirdXPos;
  deathAnimation.y = BirdYPos;
  deathAnimation.gotoAndPlay("die");
  stage.addChild(deathAnimation);
}

function tickEvent()
{
	//Make sure Bird is within game boundaries and move Bird B
	if(BirdXPos < WIDTH && BirdXPos > 0)// keeps the duck on the screen
	{
		BirdXPos += BirdXSpeed;
	} else 
	{
		BirdXSpeed = BirdXSpeed * (-1);
		BirdXPos += BirdXSpeed;
	}
	if(BirdYPos < HEIGHT && BirdYPos > 0)
	{
		BirdYPos += BirdYSpeed;
	} else
	{
		BirdYSpeed = BirdYSpeed * (-1);
		BirdYPos += BirdYSpeed;
	}

	animation.x = BirdXPos;
	animation.y = BirdYPos;

	
}


function onMouseMove(event)
{
    //Make sure mouse is center of crosshair
    crossHair.x = event.clientX-45;
    crossHair.y = event.clientY-45;
}


function onMouseDown(event)
{
    
    //Display CrossHair
    crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    crossHair.x = event.clientX-45;
    crossHair.y = event.clientY-45;
    stage.addChild(crossHair);
    createjs.Tween.get(crossHair).to({alpha: 0},1000);
    
    

    //Increase speed of Bird slightly
    BirdXSpeed *= 1.05;
    BirdYSpeed *= 1.06;

    //Obtain Shot position
    var shotX = Math.round(event.clientX);
    var shotY = Math.round(event.clientY);
  

    var hitX = false;
    var hitY = false;


   for (var x =-20; x < 21; x++){
  if (shotX + x == Math.round(animation.x)){
  hitX = true; 
}

if (shotY + x == Math.round(animation.y)){
  hitY = true; 
}

}
if ( hitY && hitX) {
  
  stage.removeChild(animation);
    	deathfly();
    	score += 3;
    	stringscore.text = "Keep it up! \n Score: " + score.toString();
    	
        //Make it harder next time
    	BirdYSpeed *= 1.25;
    	BirdXSpeed *= 1.3;

    	//Create new Bird
    	var timeToCreate = Math.floor((Math.random()*3500)+1);
	    setTimeout(createBird,timeToCreate);



    } else
    {
    	//Miss
    	score -= 1;
    	stringscore.text = "Try not to Miss again!  \nScore: " + score.toString();

    }
}

function updateTime()
{
	gameTime -= 1 ;
	if(gameTime < 1)
	{
  window.location.replace("index3.html");     
	}
	else
	{
		timerText.text = "Time Remaining: " + gameTime
    
	}
}

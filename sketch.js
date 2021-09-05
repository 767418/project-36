var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var feedTheDog;
var feedTime;

var lastFed;
var feed;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock());
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feedTheDog=createButton("Feed The Dog");
  feedTheDog.position(700, 95);
  feedTheDog.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  feedTime=database.ref("FeedTime");
  feedTime.on("value", function(data){
    lastFed=data.val()
  });
  
  if (lastFed >= 12) {
    text("lastFed: "+lastFed%12+"PM", 50, 50);
  } else if (lastFed < 12) {
    text("lastFed: "+lastFed+"AM", 50, 50);
  }

 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  database.ref('/').update({
    Food:foodS
  });

  //change lastFed
  var foodStockVal=foodObj.getFoodStock();
  if (foodStockVal <= 0) {
    foodObj.updateFoodStock(foodStockVal*0);
  } else {
    foodObj.updateFoodStock(foodStockVal-1);
  }
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime: hour()
  });
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  });
}

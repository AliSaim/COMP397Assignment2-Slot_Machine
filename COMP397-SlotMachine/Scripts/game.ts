/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />



// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage: createjs.Stage;
var stats: Stats;
var assets: createjs.LoadQueue;
var manifest = [
    { id: "background", src: "assets/images/slotmachine.png" },
    { id: "clicked", src: "assets/audio/clicked.wav" }
];

var atlas = {

    "images": [
        "assets/images/atlas.png"
    ],

    "frames": [
        [2, 2, 80, 112, 0, 0, 0],
        [84, 2, 80, 105, 0, 0, 0],
        [166, 2, 95, 97, 0, 0, 0],
        [263, 2, 93, 97, 0, -1, -1],
        [358, 2, 95, 96, 0, 0, 0],
        [455, 2, 80, 88, 0, 0, 0],
        [537, 2, 80, 85, 0, 0, 0],
        [619, 2, 80, 84, 0, 0, 0],
        [701, 2, 80, 78, 0, 0, 0],
        [783, 2, 76, 76, 0, -2, -4],
        [861, 2, 65, 67, 0, 0, 0],
        [928, 2, 65, 67, 0, 0, 0],
        [995, 2, 65, 67, 0, 0, 0],
        [1062, 2, 65, 66, 0, 0, 0],
        [1129, 2, 65, 66, 0, 0, 0],
        [1196, 2, 65, 66, 0, 0, 0],
        [1263, 2, 65, 66, 0, 0, 0],
        [1330, 2, 65, 66, 0, 0, 0],
        [1397, 2, 80, 62, 0, 0, 0]
    ],

    "animations": {
        "777": [6],
        "cup": [0],
        "flag": [1],
        "resetbutton": [2],
        "powerbutton": [3],
        "spin": [4],
        "stadium": [5],
        "blank": [7],
        "whistle": [8],
        "ball": [9],
        "bet100": [10],
        "bet50": [11],
        "bet500": [12],
        "bet1": [13],
        "bet10": [14],
        "bet2": [15],
        "bet25": [16],
        "bet5": [17],
        "cards": [18]
    }
};


// Game Variables
var background: createjs.Bitmap;
var textureAtlas: createjs.SpriteSheet;

var spinButton: objects.Button;



//preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listinener handler triggers hwne assets are completely loaded
    assets.on("complete", init, this);
    assets.loadManifest(manifest);

    //Load Texture Atlas
    textureAtlas = new createjs.SpriteSheet(atlas);


    //setup staistics object
    setupStats();

    //call back function that Initializing game objects
    function init() {
        stage = new createjs.Stage(canvas); //reference to the stage
        stage.enableMouseOver(20);
        createjs.Ticker.setFPS(60); // framerate 60 fps for the game
        //event listener triggers 60 times every second
        createjs.Ticker.on("tick", gameLoop);


        //calling main game function
        main();
    }


    function setupStats() {
        stats = new Stats();
        stats.setMode(0);//set to fps

        // align bottom-right
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '610px';
        stats.domElement.style.top = '10px';

        document.body.appendChild(stats.domElement);
    }

    //Callback function that creats Our Main Game Loop - refreshed 60 fps
    function gameLoop() {
        stats.begin(); //begin measuring

        stats.update(); //end measuring


        stage.update();
    }

    //callback function that allows me to respond to button click events
    function spinButtonClicked(event: createjs.MouseEvent) {
        createjs.Sound.play("clicked");
    }
    //callback function that cahnges the alpha transparency of the button
    //mouseover event


    // Our Main Game Function
    function main() {

        //add in slot matchine 
        background = new createjs.Bitmap(assets.getResult("background"));
        stage.addChild(background);


        //add spinButton srpite
        spinButton = new objects.Button("spin", 225, 334, false);
        stage.addChild(spinButton);
        spinButton.on("click", spinButtonClicked, this);

    }
}
/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/images.ts" />
/// <reference path="../objects/button.ts" />
// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage;
var stats;
var assets;
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
        [358, 2, 93, 94, 0, -2, 0],
        [453, 2, 80, 88, 0, 0, 0],
        [535, 2, 80, 85, 0, 0, 0],
        [617, 2, 80, 84, 0, 0, 0],
        [699, 2, 80, 78, 0, 0, 0],
        [781, 2, 76, 76, 0, -2, -4],
        [859, 2, 65, 67, 0, 0, 0],
        [926, 2, 65, 67, 0, 0, 0],
        [993, 2, 65, 66, 0, 0, 0],
        [1060, 2, 65, 66, 0, 0, 0],
        [1127, 2, 65, 66, 0, 0, 0],
        [1194, 2, 64, 66, 0, 0, 0],
        [1260, 2, 64, 66, 0, 0, 0],
        [1326, 2, 64, 66, 0, 0, 0],
        [1392, 2, 80, 62, 0, 0, 0]
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
        "bet10": [12],
        "bet25": [13],
        "bet500": [14],
        "bet1": [15],
        "bet2": [16],
        "bet5": [17],
        "cards": [18]
    }
};
// Game Variables
var background;
var textureAtlas;
var spinButton;
//value of the  each whee's index will be stored in here
var wheelOneImage;
var wheelTwoImage;
var wheelThreeImage;
//Betings buttons
var bet1;
var bet2;
var bet5;
var bet10;
var bet25;
var bet50;
var bet100;
var bet500;
var bet1Label;
var bet2Label;
var bet5Label;
var bet10Label;
var bet25Label;
var bet50Label;
var bet100Label;
var bet500Label;
/* Tally Variables */
var grapes = 0;
var bananas = 0;
var oranges = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;
var spinResult;
var fruits = "";
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
        stats.setMode(0); //set to fps
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
    /* Utility function to check if a value falls within a range of bounds */
    function checkRange(value, lowerBounds, upperBounds) {
        if (value >= lowerBounds && value <= upperBounds) {
            return value;
        }
        else {
            return !value;
        }
    }
    /* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
    function Reels() {
        var betLine = [" ", " ", " "];
        var outCome = [0, 0, 0];
        for (var spin = 0; spin < 3; spin++) {
            outCome[spin] = Math.floor((Math.random() * 65) + 1);
            switch (outCome[spin]) {
                case checkRange(outCome[spin], 1, 27):
                    betLine[spin] = "blank";
                    blanks++;
                    break;
                case checkRange(outCome[spin], 28, 37):
                    betLine[spin] = "Grapes";
                    grapes++;
                    break;
                case checkRange(outCome[spin], 38, 46):
                    betLine[spin] = "Banana";
                    bananas++;
                    break;
                case checkRange(outCome[spin], 47, 54):
                    betLine[spin] = "Orange";
                    oranges++;
                    break;
                case checkRange(outCome[spin], 55, 59):
                    betLine[spin] = "Cherry";
                    cherries++;
                    break;
                case checkRange(outCome[spin], 60, 62):
                    betLine[spin] = "Bar";
                    bars++;
                    break;
                case checkRange(outCome[spin], 63, 64):
                    betLine[spin] = "Bell";
                    bells++;
                    break;
                case checkRange(outCome[spin], 65, 65):
                    betLine[spin] = "Seven";
                    sevens++;
                    break;
            }
        }
        return betLine;
    }
    function bet1ButtonClick(event) {
        stage.removeAllChildren();
        main();
        bet1Label = new createjs.Text("$1.00", "20px Consolas", "#ff0000");
        bet1Label.regX = bet1Label.getMeasuredWidth() * 0.5;
        bet1Label.regY = bet1Label.getMeasuredHeight() * 0.5;
        bet1Label.x = 340;
        bet1Label.y = 495;
        stage.addChild(bet1Label);
    }
    function bet2ButtonClick(event) {
        stage.removeAllChildren();
        main();
        bet2Label = new createjs.Text("$2.00", "20px Consolas", "#ff0000");
        bet2Label.regX = bet2Label.getMeasuredWidth() * 0.5;
        bet2Label.regY = bet2Label.getMeasuredHeight() * 0.5;
        bet2Label.x = 340;
        bet2Label.y = 495;
        stage.addChild(bet2Label);
    }
    function bet5ButtonClick(event) {
        stage.removeAllChildren();
        main();
        bet5Label = new createjs.Text("$5.00", "20px Consolas", "#ff0000");
        bet5Label.regX = bet5Label.getMeasuredWidth() * 0.5;
        bet5Label.regY = bet5Label.getMeasuredHeight() * 0.5;
        bet5Label.x = 340;
        bet5Label.y = 495;
        stage.addChild(bet5Label);
    }
    function bet10ButtonClick(event) {
        stage.removeAllChildren();
        main();
        bet10Label = new createjs.Text("$10.00", "20px Consolas", "#ff0000");
        bet10Label.regX = bet10Label.getMeasuredWidth() * 0.5;
        bet10Label.regY = bet10Label.getMeasuredHeight() * 0.5;
        bet10Label.x = 340;
        bet10Label.y = 495;
        stage.addChild(bet10Label);
    }
    function bet25ButtonClick(event) {
        stage.removeAllChildren();
        main();
        bet25Label = new createjs.Text("$25.00", "20px Consolas", "#ff0000");
        bet25Label.regX = bet25Label.getMeasuredWidth() * 0.5;
        bet25Label.regY = bet25Label.getMeasuredHeight() * 0.5;
        bet25Label.x = 340;
        bet25Label.y = 495;
        stage.addChild(bet25Label);
    }
    function bet50ButtonClick(event) {
        stage.removeAllChildren();
        main();
        bet50Label = new createjs.Text("$50.00", "20px Consolas", "#ff0000");
        bet50Label.regX = bet50Label.getMeasuredWidth() * 0.5;
        bet50Label.regY = bet50Label.getMeasuredHeight() * 0.5;
        bet50Label.x = 340;
        bet50Label.y = 495;
        stage.addChild(bet50Label);
    }
    function bet100ButtonClick(event) {
        stage.removeAllChildren();
        main();
        bet100Label = new createjs.Text("$100.00", "20px Consolas", "#ff0000");
        bet100Label.regX = bet100Label.getMeasuredWidth() * 0.5;
        bet100Label.regY = bet100Label.getMeasuredHeight() * 0.5;
        bet100Label.x = 340;
        bet100Label.y = 495;
        stage.addChild(bet100Label);
    }
    function bet500ButtonClick(event) {
        stage.removeAllChildren();
        main();
        bet500Label = new createjs.Text("$500.00", "20px Consolas", "#ff0000");
        bet500Label.regX = bet500Label.getMeasuredWidth() * 0.5;
        bet500Label.regY = bet500Label.getMeasuredHeight() * 0.5;
        bet500Label.x = 340;
        bet500Label.y = 495;
        stage.addChild(bet500Label);
    }
    //callback function that allows me to respond to button click events
    function spinButtonClicked(event) {
        createjs.Sound.play("clicked");
        //remove last images from the canvas
        stage.removeAllChildren();
        //call main function to add back the background
        main();
        spinResult = Reels();
        fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
        console.log(fruits);
        if (spinResult[0] == "blank") {
            //"blank" is represent white image"
            wheelOneImage = new objects.Images("blank", 180, 130, false);
            stage.addChild(wheelOneImage);
        }
        if (spinResult[0] == "Grapes") {
            //Grapes will be represented with cup
            wheelOneImage = new objects.Images("cup", 180, 130, false);
            stage.addChild(wheelOneImage);
        }
        if (spinResult[0] == "Banana") {
            //Banana will represent flag
            wheelOneImage = new objects.Images("flag", 180, 130, false);
            stage.addChild(wheelOneImage);
        }
        if (spinResult[0] == "Orange") {
            //Orange will represent stadium
            wheelOneImage = new objects.Images("stadium", 180, 130, false);
            stage.addChild(wheelOneImage);
        }
        if (spinResult[0] == "Cherry") {
            //Cherry will represenet "whistle" LOL
            wheelOneImage = new objects.Images("whistle", 180, 130, false);
            stage.addChild(wheelOneImage);
        }
        if (spinResult[0] == "Bar") {
            // Bar will be represenent as cards
            wheelOneImage = new objects.Images("cards", 180, 130, false);
            stage.addChild(wheelOneImage);
        }
        if (spinResult[0] == "Bell") {
            //Soccer ball will represent bell
            wheelOneImage = new objects.Images("ball", 180, 130, false);
            stage.addChild(wheelOneImage);
        }
        if (spinResult[0] == "Seven") {
            //Sevens will be represent with soccerball with 7s
            wheelOneImage = new objects.Images("777", 180, 130, false);
            stage.addChild(wheelOneImage);
        }
        //_______________________________________________________
        //_______________________________________________________
        if (spinResult[1] == "blank") {
            //"blank" is represent white image"
            wheelTwoImage = new objects.Images("blank", 300, 130, false);
            stage.addChild(wheelTwoImage);
        }
        if (spinResult[1] == "Grapes") {
            //Grapes will be represented with cup
            wheelTwoImage = new objects.Images("cup", 300, 130, false);
            stage.addChild(wheelTwoImage);
        }
        if (spinResult[1] == "Banana") {
            //Banana will represent flag
            wheelTwoImage = new objects.Images("flag", 300, 130, false);
            stage.addChild(wheelTwoImage);
        }
        if (spinResult[1] == "Orange") {
            //Orange will represent stadium
            wheelTwoImage = new objects.Images("stadium", 300, 130, false);
            stage.addChild(wheelTwoImage);
        }
        if (spinResult[1] == "Cherry") {
            //Cherry will represenet "whistle" LOL
            wheelTwoImage = new objects.Images("whistle", 300, 130, false);
            stage.addChild(wheelTwoImage);
        }
        if (spinResult[1] == "Bar") {
            // Bar will be represenent as cards
            wheelTwoImage = new objects.Images("cards", 300, 130, false);
            stage.addChild(wheelTwoImage);
        }
        if (spinResult[1] == "Bell") {
            //Soccer ball will represent bell
            wheelTwoImage = new objects.Images("ball", 300, 130, false);
            stage.addChild(wheelTwoImage);
        }
        if (spinResult[1] == "Seven") {
            //Sevens will be represent with soccerball with 7s
            wheelTwoImage = new objects.Images("777", 300, 130, false);
            stage.addChild(wheelTwoImage);
        }
        //_______________________________________________________
        //_______________________________________________________
        if (spinResult[2] == "blank") {
            //"blank" is represent white image"
            wheelThreeImage = new objects.Images("blank", 420, 130, false);
            stage.addChild(wheelThreeImage);
        }
        if (spinResult[2] == "Grapes") {
            //Grapes will be represented with cup
            wheelThreeImage = new objects.Images("cup", 420, 130, false);
            stage.addChild(wheelThreeImage);
        }
        if (spinResult[2] == "Banana") {
            //Banana will represent flag
            wheelThreeImage = new objects.Images("flag", 420, 130, false);
            stage.addChild(wheelThreeImage);
        }
        if (spinResult[2] == "Orange") {
            //Orange will represent stadium
            wheelThreeImage = new objects.Images("stadium", 420, 130, false);
            stage.addChild(wheelThreeImage);
        }
        if (spinResult[2] == "Cherry") {
            //Cherry will represenet "whistle" LOL
            wheelThreeImage = new objects.Images("whistle", 420, 130, false);
            stage.addChild(wheelThreeImage);
        }
        if (spinResult[2] == "Bar") {
            // Bar will be represenent as cards
            wheelTwoImage = new objects.Images("cards", 420, 130, false);
            stage.addChild(wheelTwoImage);
        }
        if (spinResult[2] == "Bell") {
            //Soccer ball will represent bell
            wheelThreeImage = new objects.Images("ball", 420, 130, false);
            stage.addChild(wheelThreeImage);
        }
        if (spinResult[2] == "Seven") {
            //Sevens will be represent with soccerball with 7s
            wheelThreeImage = new objects.Images("777", 420, 130, false);
            stage.addChild(wheelThreeImage);
        }
    }
    //callback function that cahnges the alpha transparency of the button
    //mouseover event
    // Our Main Game Function
    function main() {
        //add in slot matchine 
        background = new createjs.Bitmap(assets.getResult("background"));
        stage.addChild(background);
        //add spinButton srpite
        spinButton = new objects.Button("spin", 510, 242, false);
        stage.addChild(spinButton);
        spinButton.on("click", spinButtonClicked, this);
        //add bet1 button
        bet1 = new objects.Button("bet1", 80, 340, false);
        stage.addChild(bet1);
        bet1.on("click", bet1ButtonClick, this);
        //add bet2 button
        bet2 = new objects.Button("bet2", 150, 340, false);
        stage.addChild(bet2);
        bet2.on("click", bet2ButtonClick, this);
        //add bet5 button
        bet5 = new objects.Button("bet5", 80, 410, false);
        stage.addChild(bet5);
        bet5.on("click", bet5ButtonClick, this);
        //add bet10 button
        bet10 = new objects.Button("bet10", 150, 410, false);
        stage.addChild(bet10);
        bet10.on("click", bet10ButtonClick, this);
        //add bet25 button
        bet25 = new objects.Button("bet25", 440, 340, false);
        stage.addChild(bet25);
        bet25.on("click", bet25ButtonClick, this);
        //add bet50 button
        bet50 = new objects.Button("bet50", 510, 340, false);
        stage.addChild(bet50);
        bet50.on("click", bet50ButtonClick, this);
        //add bet100 button
        bet100 = new objects.Button("bet100", 440, 410, false);
        stage.addChild(bet100);
        bet100.on("click", bet100ButtonClick, this);
        //add bet1 button
        bet500 = new objects.Button("bet500", 510, 410, false);
        stage.addChild(bet500);
        bet500.on("click", bet500ButtonClick, this);
    }
}
//# sourceMappingURL=game.js.map
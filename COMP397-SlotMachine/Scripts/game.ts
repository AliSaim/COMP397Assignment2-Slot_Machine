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
var stage: createjs.Stage;
var stats: Stats;

var assets: createjs.LoadQueue;
var manifest = [
    { id: "background", src: "assets/images/slotmachine.png" },
    { id: "bet5", src: "assets/images/bet5.png" },
    { id: "bet50", src: "assets/images/bet50.png" },
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
        [263, 2, 93, 97, 0, 0, 0],
        [358, 2, 95, 96, 0, 0, 0],
        [455, 2, 80, 88, 0, 0, 0],
        [537, 2, 80, 85, 0, 0, 0],
        [619, 2, 80, 84, 0, 0, 0],
        [701, 2, 80, 78, 0, 0, 0],
        [783, 2, 76, 76, 0, 0, 0],
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
        "bet500": [12],
        "bet1": [13],
        "bet10": [14],
        "bet2": [15],
        "bet25": [16],
        "cards": [18]
    }
};


// Game Variables
var background: createjs.Bitmap;
var textureAtlas: createjs.SpriteSheet;
var spinButton: objects.Button;

//value of the  each whee's index will be stored in here
var wheelOneImage: objects.Images;
var wheelTwoImage: objects.Images;
var wheelThreeImage: objects.Images;



//Betings buttons
var bet1: objects.Button;
var bet2: objects.Button;
var bet5: objects.Button;
var bet10: objects.Button;
var bet25: objects.Button;
var bet50: objects.Button;
var bet100: objects.Button;
var bet500: objects.Button;



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
                case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                    betLine[spin] = "blank";
                    blanks++;
                    break;
                case checkRange(outCome[spin], 28, 37): // 15.4% probability
                    betLine[spin] = "Grapes";
                    grapes++;
                    break;
                case checkRange(outCome[spin], 38, 46): // 13.8% probability
                    betLine[spin] = "Banana";
                    bananas++;
                    break;
                case checkRange(outCome[spin], 47, 54): // 12.3% probability
                    betLine[spin] = "Orange";
                    oranges++;
                    break;
                case checkRange(outCome[spin], 55, 59): //  7.7% probability
                    betLine[spin] = "Cherry";
                    cherries++;
                    break;
                case checkRange(outCome[spin], 60, 62): //  4.6% probability
                    betLine[spin] = "Bar";
                    bars++;
                    break;
                case checkRange(outCome[spin], 63, 64): //  3.1% probability
                    betLine[spin] = "Bell";
                    bells++;
                    break;
                case checkRange(outCome[spin], 65, 65): //  1.5% probability
                    betLine[spin] = "Seven";
                    sevens++;
                    break;
            }
        }
        return betLine;
    }






    //callback function that allows me to respond to button click events
    function spinButtonClicked(event: createjs.MouseEvent) {
        createjs.Sound.play("clicked");

        //remove last images from the canvas
        stage.removeAllChildren();
        //call main function to add back the background


        //add bet5 button
        bet5 = new objects.Button("bet5", 80, 410, false);
        stage.addChild(bet5);

        main();

        spinResult = Reels();
        fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];

        console.log(fruits);

        if (spinResult[0] == "blank")
        {
            //"blank" is represent white image"
            wheelOneImage = new objects.Images("blank", 180, 130, false)
            stage.addChild(wheelOneImage);
        }
        
        if (spinResult[0] == "Grapes") {
            //Grapes will be represented with cup
            wheelOneImage = new objects.Images("cup", 180, 130, false)
            stage.addChild(wheelOneImage);
        }

        if (spinResult[0] == "Banana") {
            //Banana will represent flag
            wheelOneImage = new objects.Images("flag", 180, 130, false)
            stage.addChild(wheelOneImage);
        }

        if (spinResult[0] == "Orange") {
            //Orange will represent stadium
            wheelOneImage = new objects.Images("stadium", 180, 130, false)
            stage.addChild(wheelOneImage);
        }

        if (spinResult[0] == "Cherry") {
            //Cherry will represenet "whistle" LOL
            wheelOneImage = new objects.Images("whistle", 180, 130, false)
            stage.addChild(wheelOneImage);
        }
        if (spinResult[0] == "Bar") {
            // Bar will be represenent as cards
            wheelOneImage = new objects.Images("cards", 180, 130, false)
            stage.addChild(wheelOneImage);
        }
        if (spinResult[0] == "Bell") {
            //Soccer ball will represent bell
            wheelOneImage = new objects.Images("ball", 180, 130, false)
            stage.addChild(wheelOneImage);
        }

        if (spinResult[0] == "Seven") {
            //Sevens will be represent with soccerball with 7s
            wheelOneImage = new objects.Images("777", 180, 130, false)
            stage.addChild(wheelOneImage);
        }
        //_______________________________________________________



        //_______________________________________________________
        if (spinResult[1] == "blank") {
            //"blank" is represent white image"
            wheelTwoImage = new objects.Images("blank", 300, 130, false)
            stage.addChild(wheelTwoImage);
        }

        if (spinResult[1] == "Grapes") {
            //Grapes will be represented with cup
            wheelTwoImage = new objects.Images("cup", 300, 130, false)
            stage.addChild(wheelTwoImage);
        }

        if (spinResult[1] == "Banana") {
            //Banana will represent flag
            wheelTwoImage = new objects.Images("flag", 300, 130, false)
            stage.addChild(wheelTwoImage);
        }

        if (spinResult[1] == "Orange") {
            //Orange will represent stadium
            wheelTwoImage = new objects.Images("stadium", 300, 130, false)
            stage.addChild(wheelTwoImage);
        }

        if (spinResult[1] == "Cherry") {
            //Cherry will represenet "whistle" LOL
            wheelTwoImage = new objects.Images("whistle", 300, 130, false)
            stage.addChild(wheelTwoImage);
        }
        if (spinResult[1] == "Bar") {
            // Bar will be represenent as cards
            wheelTwoImage = new objects.Images("cards", 300, 130, false)
            stage.addChild(wheelTwoImage);
        }
        if (spinResult[1] == "Bell") {
            //Soccer ball will represent bell
            wheelTwoImage = new objects.Images("ball", 300, 130, false)
            stage.addChild(wheelTwoImage);
        }

        if (spinResult[1] == "Seven") {
            //Sevens will be represent with soccerball with 7s
            wheelTwoImage = new objects.Images("777", 300, 130, false)
            stage.addChild(wheelTwoImage);
        }
        //_______________________________________________________



        //_______________________________________________________
        if (spinResult[2] == "blank") {
            //"blank" is represent white image"
            wheelThreeImage = new objects.Images("blank", 420, 130, false)
            stage.addChild(wheelThreeImage);
        }

        if (spinResult[2] == "Grapes") {
            //Grapes will be represented with cup
            wheelThreeImage = new objects.Images("cup", 420, 130, false)
            stage.addChild(wheelThreeImage);
        }

        if (spinResult[2] == "Banana") {
            //Banana will represent flag
            wheelThreeImage = new objects.Images("flag", 420, 130, false)
            stage.addChild(wheelThreeImage);
        }

        if (spinResult[2] == "Orange") {
            //Orange will represent stadium
            wheelThreeImage = new objects.Images("stadium", 420, 130, false)
            stage.addChild(wheelThreeImage);
        }

        if (spinResult[2] == "Cherry") {
            //Cherry will represenet "whistle" LOL
            wheelThreeImage = new objects.Images("whistle", 420, 130, false)
            stage.addChild(wheelThreeImage);
        }
        if (spinResult[2] == "Bar") {
            // Bar will be represenent as cards
            wheelTwoImage = new objects.Images("cards", 420, 130, false)
            stage.addChild(wheelTwoImage);
        }
        if (spinResult[2] == "Bell") {
            //Soccer ball will represent bell
            wheelThreeImage = new objects.Images("ball", 420, 130, false)
            stage.addChild(wheelThreeImage);
        }

        if (spinResult[2] == "Seven") {
            //Sevens will be represent with soccerball with 7s
            wheelThreeImage = new objects.Images("777", 420, 130, false)
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
        

        //add bet2 button
        bet2 = new objects.Button("bet2", 150, 340, false);
        stage.addChild(bet2);






        //add bet10 button
        bet10 = new objects.Button("bet10", 150, 410, false);
        stage.addChild(bet10);





        //add bet25 button
        bet25 = new objects.Button("bet25", 400, 310, false);
        stage.addChild(bet25);


        //add bet50 button
        bet50 = new objects.Button("bet50", 470, 310, false);
        stage.addChild(bet50);


        //add bet100 button
        bet100 = new objects.Button("bet100", 400, 400, false);
        stage.addChild(bet100);


        //add bet1 button
        bet500 = new objects.Button("bet500", 470, 400, false);
        stage.addChild(bet500);

    }
}
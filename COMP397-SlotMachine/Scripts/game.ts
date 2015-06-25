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
var manifest = [{ id: "background", src: "assets/images/slotmachine.png" }, { id: "clicked", src: "assets/audio/clicked.wav" } ];

var atlas = {
    "images": [
        "assets/images/atlas.png"], "frames": [[2, 2, 80, 112, 0, 0, 0], [84, 2, 80, 105, 0, 0, 0], [166, 2, 95, 97, 0, 0, 0], [263, 2, 93, 97, 0, -1, -1],
            [358, 2, 93, 94, 0, -2, 0], [453, 2, 80, 88, 0, 0, 0], [535, 2, 80, 85, 0, 0, 0], [617, 2, 80, 84, 0, 0, 0], [699, 2, 80, 78, 0, 0, 0], [781, 2, 76, 76, 0, -2, -4],
            [859, 2, 65, 67, 0, 0, 0], [926, 2, 65, 67, 0, 0, 0], [993, 2, 65, 66, 0, 0, 0], [1060, 2, 65, 66, 0, 0, 0], [1127, 2, 65, 66, 0, 0, 0], [1194, 2, 64, 66, 0, 0, 0],
            [1260, 2, 64, 66, 0, 0, 0], [1326, 2, 64, 66, 0, 0, 0], [1392, 2, 80, 62, 0, 0, 0]],

    "animations": {"s777": [6],"cup": [0], "flag": [1], "resetbutton": [2], "powerbutton": [3],"spin": [4],"stadium": [5],"blank": [7],"whistle": [8],
                   "ball": [9],"bet100": [10],"bet50": [11],"bet10": [12],"bet25": [13],"bet500": [14],"bet1": [15],"bet2": [16],"bet5": [17],"cards": [18]}};

// Game Variables
var background: createjs.Bitmap;
var textureAtlas: createjs.SpriteSheet;
var spinButton: objects.Button;

//value of the  each whee's index will be stored in here
var wheelOneImage: objects.Images;
var wheelTwoImage: objects.Images;
var wheelThreeImage: objects.Images;

//Betings buttons
var bet1: objects.Button; var bet2: objects.Button; var bet5: objects.Button; var bet10: objects.Button;        var powerButton: objects.Button;
var bet25: objects.Button; var bet50: objects.Button; var bet100: objects.Button; var bet500: objects.Button;   var resetButton: objects.Button;
var bet1Label: objects.Label;   var bet2Label: objects.Label;   var bet5Label: objects.Label;   var bet10Label: objects.Label;
var bet25Label: objects.Label;  var bet50Label: objects.Label;  var bet100Label: objects.Label; var bet500Label: objects.Label;

var playerCreditLabel: objects.Label;
var jackpotLabel: objects.Label;
var playerBetZero: objects.Label;
var spinResultZero: objects.Label;


/* Tally Variables */
var grapes = 0; var bananas = 0; var oranges = 0; var cherries = 0; var bars = 0; var bells = 0;
var sevens = 0; var blanks = 0; var spinResult; var fruits = ""; var playerBet = 0; var winnings = 0;

var playerCreditAmount = 1000; var jackpot = 5000;

var bet1Dollar = 1.0;       var bet2Dollars = 2.0;      var bet5Dollars = 5.0;      var bet10Dollars = 10.0;
var bet25Dollars = 25.0;    var bet50Dollars = 50.0;    var bet100Dollars = 100.0;  var bet500Dollars = 500.0;

var spinButtonState = false;   var bet1DollarState = false; var bet2DollarState = false;  var bet5DollarState = false;
var bet10DollarState = false;  var bet25DollarState = false; var bet50DollarState = false; var bet100DollarState = false;
var bet500DollarState = false;

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
        main();}
    function setupStats() {
        stats = new Stats();
        stats.setMode(0);//set to fps
        // align bottom-right
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '610px';
        stats.domElement.style.top = '10px';
        document.body.appendChild(stats.domElement);}
    //Callback function that creats Our Main Game Loop - refreshed 60 fps
    function gameLoop() {
        stats.begin(); //begin measuring
        stats.update(); //end measuring
        stage.update();}
    /* Utility function to check if a value falls within a range of bounds */
    function checkRange(value, lowerBounds, upperBounds) {
        if (value >= lowerBounds && value <= upperBounds) { return value; }
        else { return !value; }}
    /* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
    function Reels() {
        var betLine = [" ", " ", " "];
        var outCome = [0, 0, 0];

        for (var spin = 0; spin < 3; spin++) {
            outCome[spin] = Math.floor((Math.random() * 29) + 1);
            switch (outCome[spin]) {
                case checkRange(outCome[spin], 1, 7):  // 41.5% probability
                    betLine[spin] = "blank";
                    blanks++;
                    break;
                case checkRange(outCome[spin], 8, 14): // 15.4% probability
                    betLine[spin] = "Grapes";
                    grapes++;
                    break;
                case checkRange(outCome[spin], 15, 17): // 13.8% probability
                    betLine[spin] = "Banana";
                    bananas++;
                    break;
                case checkRange(outCome[spin], 18, 20): // 12.3% probability
                    betLine[spin] = "Orange";
                    oranges++;
                    break;
                case checkRange(outCome[spin], 21, 24): //  7.7% probability
                    betLine[spin] = "Cherry";
                    cherries++;
                    break;
                case checkRange(outCome[spin], 25, 26): //  4.6% probability
                    betLine[spin] = "Bar";
                    bars++;
                    break;
                case checkRange(outCome[spin], 27, 28): //  3.1% probability
                    betLine[spin] = "Bell";
                    bells++;
                    break;
                case checkRange(outCome[spin], 29, 29): //  1.5% probability
                    betLine[spin] = "Seven";
                    sevens++;
                    break;
            }
        }
        return betLine;
    }

    //If the user want to bet with $1 event
    function bet1ButtonClick(event: createjs.MouseEvent) {

        //main();
        stage.removeChild(jackpotLabel);
        stage.removeChild(spinResult);

        //add jackpot label
        jackpotLabel = new createjs.Text(jackpot.toString() + ".00", "25px Consolas", "#ff0000");
        jackpotLabel.regX = jackpotLabel.getMeasuredWidth() * 0.5;
        jackpotLabel.regY = jackpotLabel.getMeasuredHeight() * 0.5;
        jackpotLabel.x = 315;
        jackpotLabel.y = 217;
        stage.addChild(jackpotLabel);

        spinButtonState = false;    bet1DollarState = true;   bet2DollarState = false;
        bet5DollarState = false;   bet10DollarState = false;  bet25DollarState = false;
        bet50DollarState = false; bet100DollarState = false; bet500DollarState = false;
        
         if (playerCreditAmount < 1) {
             alert("Not enough money to play...Good Game!!!");
             spinButtonState = false;
        }
         if (playerCreditAmount >= 1)
         {
             spinButtonState = true;
         }

         if ((bet1DollarState) && (spinButtonState)) {
             playerBet = 1;
             playerCreditAmount = playerCreditAmount - bet1Dollar;

             stage.removeAllChildren();
             main();
             stage.removeChild(playerBetZero);       //remove the "0" to avoid over loaping of selected bet value text
             bet1Label = new createjs.Text("$1.00", "20px Consolas", "#ff0000");
             bet1Label.regX = bet1Label.getMeasuredWidth() * 0.5;
             bet1Label.regY = bet1Label.getMeasuredHeight() * 0.5;
             bet1Label.x = 340;
             bet1Label.y = 495;
             stage.addChild(bet1Label);
         }
    }

    
    //If the user want to bet with $2 event
    function bet2ButtonClick(event: createjs.MouseEvent) {

        //main();
        stage.removeChild(jackpotLabel);
        stage.removeChild(spinResult);
        //add jackpot label
        jackpotLabel = new createjs.Text(jackpot.toString() + ".00", "25px Consolas", "#ff0000");
        jackpotLabel.regX = jackpotLabel.getMeasuredWidth() * 0.5;
        jackpotLabel.regY = jackpotLabel.getMeasuredHeight() * 0.5;
        jackpotLabel.x = 315;
        jackpotLabel.y = 217;
        stage.addChild(jackpotLabel);

         spinButtonState = true;     bet1DollarState = false;       bet2DollarState = true;
         bet5DollarState = false;    bet10DollarState = false;      bet25DollarState = false;
         bet50DollarState = false;   bet100DollarState = false;     bet500DollarState = false;

         if (playerCreditAmount < 2) {
             alert("Not enough money to play with $2.00\nConsider playing with a smaller amount of money.");
             spinButtonState = false;
         }
         if (playerCreditAmount >= 2) {
             spinButtonState = true;
         }
         if ((bet2DollarState) && (spinButtonState)) {
             playerBet = 2;
             playerCreditAmount = playerCreditAmount - bet2Dollars;

             stage.removeAllChildren();
             main();
             stage.removeChild(playerBetZero);       //remove the "0" to avoid over loaping of selected bet value text

             bet2Label = new createjs.Text("$2.00", "20px Consolas", "#ff0000");
             bet2Label.regX = bet2Label.getMeasuredWidth() * 0.5;
             bet2Label.regY = bet2Label.getMeasuredHeight() * 0.5;
             bet2Label.x = 340;
             bet2Label.y = 495;
             stage.addChild(bet2Label);
         }
    }

    
    //If the user want to bet with $5 event
    function bet5ButtonClick(event: createjs.MouseEvent) {
        //main();
        stage.removeChild(jackpotLabel);
        stage.removeChild(spinResult);

        //add jackpot label
        jackpotLabel = new createjs.Text(jackpot.toString() + ".00", "25px Consolas", "#ff0000");
        jackpotLabel.regX = jackpotLabel.getMeasuredWidth() * 0.5;
        jackpotLabel.regY = jackpotLabel.getMeasuredHeight() * 0.5;
        jackpotLabel.x = 315;
        jackpotLabel.y = 217;
        stage.addChild(jackpotLabel);

        spinButtonState = true;         bet1DollarState = false;    bet2DollarState = false;        bet5DollarState = true;     bet10DollarState = false;
        bet25DollarState = false;       bet50DollarState = false;   bet100DollarState = false;      bet500DollarState = false;

        if (playerCreditAmount < 5) {
            alert("Not enough money to play with $5.00\nConsider playing with a smaller amount of money.");
            spinButtonState = false;
        }
        if (playerCreditAmount >= 5) {
            spinButtonState = true;
        }
        if ((bet5DollarState) && (spinButtonState)) {
            playerBet = 5;
            playerCreditAmount = playerCreditAmount - bet5Dollars;

            stage.removeAllChildren();
            main();
            stage.removeChild(playerBetZero);
            bet5Label = new createjs.Text("$5.00", "20px Consolas", "#ff0000");
            bet5Label.regX = bet5Label.getMeasuredWidth() * 0.5;
            bet5Label.regY = bet5Label.getMeasuredHeight() * 0.5;
            bet5Label.x = 340;
            bet5Label.y = 495;
            stage.addChild(bet5Label);
        }
    }

    
    //If the user want to bet with $10 event
    function bet10ButtonClick(event: createjs.MouseEvent) {
        //main();
        stage.removeChild(jackpotLabel);
        stage.removeChild(spinResult);

        //add jackpot label
        jackpotLabel = new createjs.Text(jackpot.toString() + ".00", "25px Consolas", "#ff0000");
        jackpotLabel.regX = jackpotLabel.getMeasuredWidth() * 0.5;
        jackpotLabel.regY = jackpotLabel.getMeasuredHeight() * 0.5;
        jackpotLabel.x = 315;
        jackpotLabel.y = 217;
        stage.addChild(jackpotLabel);

        spinButtonState = true;     bet1DollarState = false;    bet2DollarState = false;        bet5DollarState = false;    bet10DollarState = true;
        bet25DollarState = false;   bet50DollarState = false;   bet100DollarState = false;      bet500DollarState = false;

        if (playerCreditAmount < 10) {
            alert("Not enough money to play with $10.00\nConsider playing with a smaller amount of money.");
            spinButtonState = false;
        }
        if (playerCreditAmount >= 10) {
            spinButtonState = true;
        }
        if ((bet10DollarState) && (spinButtonState)) {
            playerBet = 10;
            playerCreditAmount = playerCreditAmount - bet10Dollars;

            stage.removeAllChildren();
            main();
            stage.removeChild(playerBetZero);
            bet10Label = new createjs.Text("$10.00", "20px Consolas", "#ff0000");
            bet10Label.regX = bet10Label.getMeasuredWidth() * 0.5;
            bet10Label.regY = bet10Label.getMeasuredHeight() * 0.5;
            bet10Label.x = 340;
            bet10Label.y = 495;
            stage.addChild(bet10Label);
        }
    }

    
    //If the user want to bet with $25 event
    function bet25ButtonClick(event: createjs.MouseEvent) {
        //main();
        stage.removeChild(jackpotLabel);
        stage.removeChild(spinResult);

        //add jackpot label
        jackpotLabel = new createjs.Text(jackpot.toString() + ".00", "25px Consolas", "#ff0000");
        jackpotLabel.regX = jackpotLabel.getMeasuredWidth() * 0.5;
        jackpotLabel.regY = jackpotLabel.getMeasuredHeight() * 0.5;
        jackpotLabel.x = 315;
        jackpotLabel.y = 217;
        stage.addChild(jackpotLabel);
        spinButtonState = true;      bet1DollarState = false;    bet2DollarState = false;     bet5DollarState = false;
        bet10DollarState = false;    bet25DollarState = true;    bet50DollarState = false;    bet100DollarState = false;  bet500DollarState = false;

        if (playerCreditAmount < 25)
        {
            alert("Not enough money to play with $25.00\nConsider playing with a smaller amount of money.");
            spinButtonState = false;
        }
        if (playerCreditAmount >= 25) {
            spinButtonState = true;
        }
        if ((bet25DollarState) && (spinButtonState)) {
            playerBet = 25;
            playerCreditAmount = playerCreditAmount - bet25Dollars;

            stage.removeAllChildren();
            main();
            stage.removeChild(playerBetZero);
            bet25Label = new createjs.Text("$25.00", "20px Consolas", "#ff0000");
            bet25Label.regX = bet25Label.getMeasuredWidth() * 0.5;
            bet25Label.regY = bet25Label.getMeasuredHeight() * 0.5;
            bet25Label.x = 340;
            bet25Label.y = 495;
            stage.addChild(bet25Label);
        }
    }

    
    //If the user want to bet with $50 event
    function bet50ButtonClick(event: createjs.MouseEvent) {
        //main();
        stage.removeChild(jackpotLabel);
        stage.removeChild(spinResult);

        //add jackpot label
        jackpotLabel = new createjs.Text(jackpot.toString() + ".00", "25px Consolas", "#ff0000");
        jackpotLabel.regX = jackpotLabel.getMeasuredWidth() * 0.5;
        jackpotLabel.regY = jackpotLabel.getMeasuredHeight() * 0.5;
        jackpotLabel.x = 315;
        jackpotLabel.y = 217;
        stage.addChild(jackpotLabel);
        spinButtonState = true;     bet1DollarState = false;    bet2DollarState = false;    bet5DollarState = false;
        bet10DollarState = false;   bet25DollarState = false;   bet50DollarState = true;    bet100DollarState = false;  bet500DollarState = false;

        if (playerCreditAmount < 50)
        {
            alert("Not enough money to play with $50.00\nConsider playing with a smaller amount of money.");
            spinButtonState = false;
        }
        if (playerCreditAmount >= 50) {
            spinButtonState = true;
        }
        if ((bet50DollarState) && (spinButtonState)) {
            playerBet = 50;
            playerCreditAmount = playerCreditAmount - bet50Dollars;

            stage.removeAllChildren();
            main();
            stage.removeChild(playerBetZero);
            bet50Label = new createjs.Text("$50.00", "20px Consolas", "#ff0000");
            bet50Label.regX = bet50Label.getMeasuredWidth() * 0.5;
            bet50Label.regY = bet50Label.getMeasuredHeight() * 0.5;
            bet50Label.x = 340;
            bet50Label.y = 495;
            stage.addChild(bet50Label);
        }
    }

    
    //If the user want to bet with $100 event
    function bet100ButtonClick(event: createjs.MouseEvent) {
        //main();
        stage.removeChild(jackpotLabel);
        stage.removeChild(spinResult);

        //add jackpot label
        jackpotLabel = new createjs.Text(jackpot.toString() + ".00", "25px Consolas", "#ff0000");
        jackpotLabel.regX = jackpotLabel.getMeasuredWidth() * 0.5;
        jackpotLabel.regY = jackpotLabel.getMeasuredHeight() * 0.5;
        jackpotLabel.x = 315;
        jackpotLabel.y = 217;
        stage.addChild(jackpotLabel);
        spinButtonState = true;     bet1DollarState = false;    bet2DollarState = false;    bet5DollarState = false;
        bet10DollarState = false;   bet25DollarState = false;   bet50DollarState = false;   bet100DollarState = true;    bet500DollarState = false;

        if (playerCreditAmount < 100) {
            alert("Not enough money to play with $100.00\nConsider playing with a smaller amount of money.");
            spinButtonState = false;
        }
        if (playerCreditAmount >= 100) {
            spinButtonState = true;
        }
        if ((bet100DollarState) && (spinButtonState)) {
            playerBet = 100;
            playerCreditAmount = playerCreditAmount - bet100Dollars;

            stage.removeAllChildren();
            main();
            stage.removeChild(playerBetZero);
            bet100Label = new createjs.Text("$100.00", "20px Consolas", "#ff0000");
            bet100Label.regX = bet100Label.getMeasuredWidth() * 0.5;
            bet100Label.regY = bet100Label.getMeasuredHeight() * 0.5;
            bet100Label.x = 340;
            bet100Label.y = 495;
            stage.addChild(bet100Label);
        }
    }

    
    //If the user want to bet with $500 event
    function bet500ButtonClick(event: createjs.MouseEvent) {
        //main();

        stage.removeChild(spinResult);
        stage.removeChild(jackpotLabel);

        //add jackpot label
        jackpotLabel = new createjs.Text(jackpot.toString() + ".00", "25px Consolas", "#ff0000");
        jackpotLabel.regX = jackpotLabel.getMeasuredWidth() * 0.5;
        jackpotLabel.regY = jackpotLabel.getMeasuredHeight() * 0.5;
        jackpotLabel.x = 315;
        jackpotLabel.y = 217;
        stage.addChild(jackpotLabel);
        spinButtonState = true;     bet1DollarState = false;    bet2DollarState = false;    bet5DollarState = false;
        bet10DollarState = false;   bet25DollarState = false;   bet50DollarState = false;   bet100DollarState = false;  bet500DollarState = true;

        if (playerCreditAmount < 500) {
            alert("Not enough money to play with $500.00\nConsider playing with a smaller amount of money.");
            spinButtonState = false;
        }
        if (playerCreditAmount >= 500) {
            spinButtonState = true;
        }
        if ((bet500DollarState) && (spinButtonState)) {
            playerBet = 500;
            playerCreditAmount = playerCreditAmount - bet500Dollars;

            stage.removeAllChildren();
            main();
            stage.removeChild(playerBetZero);
            bet500Label = new createjs.Text("$500.00", "20px Consolas", "#ff0000");
            bet500Label.regX = bet500Label.getMeasuredWidth() * 0.5;
            bet500Label.regY = bet500Label.getMeasuredHeight() * 0.5;
            bet500Label.x = 340;
            bet500Label.y = 495;
            stage.addChild(bet500Label);
        }
    }

    //Main function of the game. Click this button to spin wheel
    function spinButtonClicked(event: createjs.MouseEvent) {
        stage.removeChild(spinResult);

        if (spinButtonState == false)
        {
            alert("Please select an amount first.");
        }
        else
        {
            createjs.Sound.play("clicked");
            //remove last images from the canvas
            stage.removeAllChildren();
            //call main function to add back the background
            main();

            spinResult = Reels();
            fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];

            console.log(fruits);

            if (spinResult[0] == "blank") {
                //"blank" is represent white image" ************************
                wheelOneImage = new objects.Images("blank", 180, 130, false)
                stage.addChild(wheelOneImage);}

            if (spinResult[0] == "Grapes") {
                //Grapes will be represented with cup************************
                wheelOneImage = new objects.Images("cup", 180, 130, false)
                stage.addChild(wheelOneImage);}

            if (spinResult[0] == "Banana") {
                //Banana will represent flag ********************************
                wheelOneImage = new objects.Images("flag", 180, 130, false)
                stage.addChild(wheelOneImage);
            }

            if (spinResult[0] == "Orange") {
                //Orange will represent stadium *******************************
                wheelOneImage = new objects.Images("stadium", 180, 130, false)
                stage.addChild(wheelOneImage);
            }

            if (spinResult[0] == "Cherry") {
                //Cherry will represenet "whistle" LOL*************************
                wheelOneImage = new objects.Images("whistle", 180, 130, false)
                stage.addChild(wheelOneImage);
            }
            if (spinResult[0] == "Bar") {
                // Bar will be represenent as cards****************************
                wheelOneImage = new objects.Images("cards", 180, 130, false)
                stage.addChild(wheelOneImage);
            }
            if (spinResult[0] == "Bell") {
                //Bell will be represent by ball*******************************
                wheelOneImage = new objects.Images("ball", 180, 130, false)
                stage.addChild(wheelOneImage);
            }

            if (spinResult[0] == "Seven") {
                //Sevens will be represent with soccerball with 7s************
                wheelOneImage = new objects.Images("s777", 180, 130, false)
                stage.addChild(wheelOneImage);
            }
            //_______________________________________________________END OF WHEEL 1 IMAGES ONCE SPIN BUTTON IS CLICKED



            //_______________________________________________________START OF WHEEL 2 IMAGES ONCE SPIN BUTTON IS CLICKED
            if (spinResult[1] == "blank") {
                //"blank" is represent white image"**************************
                wheelTwoImage = new objects.Images("blank", 300, 130, false)
                stage.addChild(wheelTwoImage);
            }

            if (spinResult[1] == "Grapes") {
                //Grapes will be represented with cup*************************
                wheelTwoImage = new objects.Images("cup", 300, 130, false)
                stage.addChild(wheelTwoImage);
            }

            if (spinResult[1] == "Banana") {
                //Banana will represent flag*********************************
                wheelTwoImage = new objects.Images("flag", 300, 130, false)
                stage.addChild(wheelTwoImage);
            }

            if (spinResult[1] == "Orange") {
                //Orange will represent stadium******************************
                wheelTwoImage = new objects.Images("stadium", 300, 130, false)
                stage.addChild(wheelTwoImage);
            }

            if (spinResult[1] == "Cherry") {
                //Cherry will represenet "whistle" LOL************************
                wheelTwoImage = new objects.Images("whistle", 300, 130, false)
                stage.addChild(wheelTwoImage);
            }
            if (spinResult[1] == "Bar") {
                // Bar will be represenent as cards****************************
                wheelTwoImage = new objects.Images("cards", 300, 130, false)
                stage.addChild(wheelTwoImage);
            }
            if (spinResult[1] == "Bell") {
                //Soccer ball will represent bell******************************
                wheelTwoImage = new objects.Images("ball", 300, 130, false)
                stage.addChild(wheelTwoImage);
            }

            if (spinResult[1] == "Seven") {
                //Sevens will be represent with soccerball with 7s*************
                wheelTwoImage = new objects.Images("s777", 300, 130, false)
                stage.addChild(wheelTwoImage);
            }
            //_______________________________________________________END OF WHEEL 2 IMAGES ONCE SPIN BUTTON IS CLICKED



            //_______________________________________________________START OF WHEEL 3 IMAGES ONCE SPIN BUTTON IS CLICKED
            if (spinResult[2] == "blank") {
                //"blank" is represent white image"*****************************
                wheelThreeImage = new objects.Images("blank", 420, 130, false)
                stage.addChild(wheelThreeImage);
            }

            if (spinResult[2] == "Grapes") {
                //Grapes will be represented with cup**************************
                wheelThreeImage = new objects.Images("cup", 420, 130, false)
                stage.addChild(wheelThreeImage);
            }

            if (spinResult[2] == "Banana") {
                //Banana will represent flag***********************************
                wheelThreeImage = new objects.Images("flag", 420, 130, false)
                stage.addChild(wheelThreeImage);
            }

            if (spinResult[2] == "Orange") {
                //Orange will represent stadium*********************************
                wheelThreeImage = new objects.Images("stadium", 420, 130, false)
                stage.addChild(wheelThreeImage);
            }

            if (spinResult[2] == "Cherry") {
                //Cherry will represenet "whistle" LOL**************************
                wheelThreeImage = new objects.Images("whistle", 420, 130, false)
                stage.addChild(wheelThreeImage);
            }
            if (spinResult[2] == "Bar") {
                // Bar will be represenent as cards*****************************
                wheelTwoImage = new objects.Images("cards", 420, 130, false)
                stage.addChild(wheelTwoImage);
            }
            if (spinResult[2] == "Bell") {
                //Soccer ball will represent bell*******************************
                wheelThreeImage = new objects.Images("ball", 420, 130, false)
                stage.addChild(wheelThreeImage);
            }

            if (spinResult[2] == "Seven") {
                //Sevens will be represent with soccerball with 7s**************
                wheelThreeImage = new objects.Images("s777", 420, 130, false)
                stage.addChild(wheelThreeImage);
            }

            determineWinnings();
            //playerBet = 0;
            spinButtonState = false;
        }
    }


    //check to see if player won jackpot
    function checkJackPot() {
        /* compare two random values */
        var jackPotTry = Math.floor(Math.random() * 51 + 1);
        var jackPotWin = Math.floor(Math.random() * 51 + 1);
        if (jackPotTry == jackPotWin) {
            alert("You Won the $" + jackpot + " Jackpot!!");
            playerCreditAmount += jackpot;
            jackpot = 1000;
        }
    }

    //Caclulate how much players wins. This is determined on what they spin from the wheel
    function determineWinnings() {
        if (blanks == 0) {
            if (grapes == 3) { winnings = playerBet * 10; }
            else if (bananas == 3) { winnings = playerBet * 20; }
            else if (oranges == 3) { winnings = playerBet * 30; }
            else if (cherries == 3) { winnings = playerBet * 40; }
            else if (bars == 3) { winnings = playerBet * 50; }
            else if (bells == 3) { winnings = playerBet * 75; }
            else if (sevens == 3) { winnings = playerBet * 100; }
            else if (grapes == 2) { winnings = playerBet * 2; }
            else if (bananas == 2) { winnings = playerBet * 2; }
            else if (oranges == 2) { winnings = playerBet * 3; }
            else if (cherries == 2) { winnings = playerBet * 4; }
            else if (bars == 2) { winnings = playerBet * 5; }
            else if (bells == 2) { winnings = playerBet * 10; }
            else if (sevens == 2) { winnings = playerBet * 20; }
            else if (sevens == 1) { winnings = playerBet * 5; }
            else { winnings = playerBet * 1; }


            //Player won something++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        
            playerCreditAmount = playerCreditAmount + winnings;
            //alert("you won " + winnings);
            console.log("you won:" + winnings.toString());
            resetFruitTally();
            checkJackPot();
            jackpot = jackpot;
            stage.removeChild(jackpotLabel);
            stage.removeChild(spinResult); main();

            //add jackpot label
            jackpotLabel = new createjs.Text("$" + jackpot.toString() + ".00", "25px Consolas", "#ff0000");
            jackpotLabel.regX = jackpotLabel.getMeasuredWidth() * 0.5;
            jackpotLabel.regY = jackpotLabel.getMeasuredHeight() * 0.5;
            jackpotLabel.x = 315;
            jackpotLabel.y = 217;
            stage.addChild(jackpotLabel);

        }
        else {
            
            //Player did not win anything from spin+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //alert("You lose");
            //increase value of jackpot by amount player lost bet with
            jackpot = jackpot + playerBet;
            resetFruitTally();
            main();

            stage.removeChild(jackpotLabel);
            stage.removeChild(spinResult);

            //add jackpot label
            jackpotLabel = new createjs.Text("$" + jackpot.toString() + ".00", "25px Consolas", "#ff0000");
            jackpotLabel.regX = jackpotLabel.getMeasuredWidth() * 0.5;
            jackpotLabel.regY = jackpotLabel.getMeasuredHeight() * 0.5;
            jackpotLabel.x = 315;
            jackpotLabel.y = 217;
            stage.addChild(jackpotLabel);

            //display zero because player did not win anything from spin)
            spinResultZero = new createjs.Text("0", "20px Consolas", "#ff0000");
            spinResultZero.regX = spinResultZero.getMeasuredWidth() * 0.5;
            spinResultZero.regY = spinResultZero.getMeasuredHeight() * 0.5;
            spinResultZero.x = 550;
            spinResultZero.y = 495;
            stage.addChild(spinResultZero);
        }
    }


    //reset game function.
    function resetGame()
    {
        location.reload();
    }
    //power game off
    function gameOver()
    {
        alert("Thanks for playing the best game.\nCome back soon.");
        window.close()
    }

    //reset values after spin to avoid error for next spin click
    function resetFruitTally() {
        grapes = 0;
        bananas = 0;
        oranges = 0;
        cherries = 0;
        bars = 0;
        bells = 0;
        sevens = 0;
        blanks = 0;
    }

    // Our Main Game Function
    function main() {
        //playerBet = 0;
        //add in slot matchine 
        background = new createjs.Bitmap(assets.getResult("background"));
        stage.addChild(background);
        //add spinButton srpite
        spinButton = new objects.Button("spin", 510, 242, false);
        stage.addChild(spinButton);
        spinButton.on("click", spinButtonClicked, this);

        //add player credits label
        playerCreditLabel = new createjs.Text("$" + playerCreditAmount.toString()+ ".00", "20px Consolas", "#ff0000");
        playerCreditLabel.regX = playerCreditLabel.getMeasuredWidth() * 0.5;
        playerCreditLabel.regY = playerCreditLabel.getMeasuredHeight() * 0.5;
        playerCreditLabel.x = 125;
        playerCreditLabel.y = 495;
        stage.addChild(playerCreditLabel);

        //add jackpot label
        jackpotLabel = new createjs.Text("$"+jackpot.toString() + ".00", "25px Consolas", "#ff0000");
        jackpotLabel.regX = jackpotLabel.getMeasuredWidth() * 0.5;
        jackpotLabel.regY = jackpotLabel.getMeasuredHeight() * 0.5;
        jackpotLabel.x = 315;
        jackpotLabel.y = 217;
        stage.addChild(jackpotLabel);
        //add playerBet zero(zero value when game first loads)
        playerBetZero = new createjs.Text("$0.00", "20px Consolas", "#ff0000");
        playerBetZero.regX = playerBetZero.getMeasuredWidth() * 0.5;
        playerBetZero.regY = playerBetZero.getMeasuredHeight() * 0.5;
        playerBetZero.x = 340;
        playerBetZero.y = 495;
        stage.addChild(playerBetZero);
        //add spin result zero(zero value when game first loads)
        spinResultZero = new createjs.Text(winnings.toString(), "20px Consolas", "#ff0000");
        spinResultZero.regX = spinResultZero.getMeasuredWidth() * 0.5;
        spinResultZero.regY = spinResultZero.getMeasuredHeight() * 0.5;
        spinResultZero.x = 550;
        spinResultZero.y = 495;
        stage.addChild(spinResultZero);


        //add bet1 button
        bet1 = new objects.Button("bet1", 80, 340, false);
        stage.addChild(bet1);
        bet1.on("click", bet1ButtonClick, this);
        //add bet2 button
        bet2 = new objects.Button("bet2", 150, 340, false);
        stage.addChild(bet2);
        bet2.on("click", bet2ButtonClick, this);
        //add bet5 button
        bet5 = new objects.Button("bet5", 80, 410, false)
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
        //add bet500 button
        bet500 = new objects.Button("bet500", 510, 410, false);
        stage.addChild(bet500);
        bet500.on("click", bet500ButtonClick, this);

        //add power button
        powerButton = new objects.Button("powerbutton", 300, 400, false);
        stage.addChild(powerButton);
        powerButton.on("click", gameOver, this);

        //add reset button
        resetButton = new objects.Button("resetbutton", 300, 300, false);
        stage.addChild(resetButton);
        resetButton.on("click", resetGame, this);
    }
}
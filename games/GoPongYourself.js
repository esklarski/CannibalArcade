"use strict";
// ******************************* Go Pong Yourself v0.1 ********************************
/**
 * @author Evan Sklarski <esklarski@gmail.com>
 * @version 0.1
 * @see {@link - https://esklarski.github.io/CannibalArcade/}
 */
// Go Pong yourself and have a good time.
// Simple 4-way paddle game, solo play, go for a personal high score.
// inspired by: Hands-On Intro to Game Programming (v5), Chris  DeLeon
//
// TODO:
// - scale ball speed with # of volleys
// - difficulty option with paddle width change?
// - instruction screen... need:
//       - 'Instruction' GameState
//       - logic in GameManager for: gameManager.Instructions();
//       - virtual method in Game
//       - override in GoPongYourself (instruction display)
//       - event for return to title (buttonCorner3)
//            - mousePos
//            - can leave UI events on
//
// **************************************************************************************

/**
 * {@link Game}: Go Pong Yourself
 * @extends Game
 */
class GoPongYourself extends Game {

    // colors
    #fieldColor = TheFutureIsPurple["PURPLE"];
    #lineColor = TheFutureIsPurple["GREEN"];
    #ballColor = TheFutureIsPurple["PINK"];
    #paddleColor = TheFutureIsPurple["MAGENTA"];
    #textColor = TheFutureIsPurple["TEAL"];
    #buttonColor = TheFutureIsPurple["PINK"];
    #buttonTextColor = TheFutureIsPurple["PURPLE"];
    #scoreColor = TheFutureIsPurple["TEAL"];

    // Title
    /**
     * @static
     * @type {string} name of game
     */
    static #TITLE = "Go Pong Yourself";

    /** practice mode? */
    #practice = false;

    // ball
    #BALL_RADIUS = 10;
    #BALL_SPEED = 4;
    #BALL_MIN_SPEED = 2;
    #BALL_MAX_SPEED = 6;
    #BALL_SPEED_INCREMENT = 0.1;
    #ballX;
    #ballY;
    #ballSpeedX;
    #ballSpeedY;

    // paddles
    #PADDLE_CURVE = 2;
    #PADDLE_WIDTH = 150;
    #PADDLE_THICKNESS = 10;
    #paddleLeftY;
    #paddleRightY;
    #paddleTopX;
    #paddleBottomX;

    // score
    #volleys = 0;
    #maxVolleys = 0;

    // storage for event listener functions
    /** @type {Function} store bound function */
    #mouseClickEvent = null;
    /** @type {Function} store bound function */
    #mouseMoveEvent = null;
    /** @type {Function} keyPressEvent bound function */
    #keyPressEvent = null;



    constructor() {
        super(GoPongYourself.#TITLE);
    }



    // ******************************* REQUIRED OVERRIDES *******************************
    /** @override */
    TitleScreen() {
        // drawTitleScreen(GoPongYourself.#TITLE);
        this.#drawTitleBackground(this.#fieldColor);

        // title
        colorText(GoPongYourself.#TITLE,
            canvasCenter.x, 180, this.#textColor, 'center', LARGE_FONT);

        // click to play
        colorText("Click to begin play.",
            canvasCenter.x, canvasCenter.y - 45, this.#textColor, 'center');

        // button
        drawButton(button2, 'Begin',
            this.#buttonColor, this.#buttonTextColor);

        drawButton(button5, "practice",
            this.#buttonColor, this.#practice ? this.#textColor : this.#buttonTextColor);

        colorText("Use mouse to position paddles, go for a high score.",
            canvasCenter.x, canvasCenter.y + 200, this.#textColor, 'center', SMALL_FONT);

        colorText("Press Space bar to pause game.", canvasCenter.x, canvasCenter.y + 225, this.#textColor, 'center', SMALL_FONT);

        drawButton(buttonCorner3, "Exit Game", this.#buttonTextColor, this.#buttonColor);
    }


    /**
     * @override
     * @param {boolean} on
     */
    UiEvents(on) {
        if (this.#mouseClickEvent == null) {
            this.#mouseClickEvent = this.#mouseClick.bind(this);
        }

        if (on) {
            canvas.addEventListener("mousedown", this.#mouseClickEvent);
        }
        else {
            canvas.removeEventListener("mousedown", this.#mouseClickEvent);
        }
    }


    /** @override */
    Loop() {
        this.#moveEverything();
        this.#drawFrame();
    }


    /**
     * @override
     * @param {boolean} on
     */
    GameEvents(on) {
        if (this.#mouseMoveEvent == null) {
            this.#mouseMoveEvent = this.#setPaddlePositions.bind(this);
        }

        if (this.#keyPressEvent == null) {
            this.#keyPressEvent = this.#keyPress.bind(this);
        }

        if (on) {
            canvas.addEventListener('mousemove', this.#mouseMoveEvent);
            document.addEventListener('keydown', this.#keyPressEvent);
        }
        else {
            canvas.removeEventListener('mousemove', this.#mouseMoveEvent);
            if (gameManager.GameState != GameState.Pause) {
                document.removeEventListener('keydown', this.#keyPressEvent);
            }
        }
    }


    /** @override */
    PauseOverlay() {
        colorRect(0, 0, canvas.width, canvas.height, 'black', 0.5);
        colorText("press SPACE to resume",
            canvas.width / 2, canvas.height / 4, this.#textColor, 'center');

        drawButton(button2, 'Reset', this.#buttonColor, this.#buttonTextColor);
    }


    /** @override */
    GameOverScreen() {
        this.#drawTitleBackground();

        // Game Over text
        colorText("Game Over",
            canvas.width / 2, 180, this.#textColor, 'center', LARGE_FONT);

        // button
        drawButton(button2, 'Serve!', this.#buttonColor, this.#buttonTextColor);

        // final score
        colorText("Score: " + this.#volleys + " volleys.",
            canvas.width / 2, (canvas.height / 2) + 60, this.#textColor, 'center');

        // max score text
        colorText("Most volleys achieved: " + this.#maxVolleys,
            canvas.width / 2, (canvas.height / 2) + 150, this.#textColor, 'center');

        drawButton(buttonCorner3, "Exit to Title",
            this.#buttonTextColor, this.#buttonColor);
    }


    #firstRun = true;
    /** @override */
    Reset() {
        if (this.#firstRun) {
            if (localStorage.maxVolleysRecord) {
                // read in previous score
                this.#maxVolleys = parseInt( localStorage.maxVolleysRecord );
            }

            this.#firstRun = false;
        }

        // center paddles
        this.#paddleLeftY = canvas.height / 2 - this.#PADDLE_WIDTH / 2;
        this.#paddleRightY = canvas.height / 2 - this.#PADDLE_WIDTH / 2;
        this.#paddleTopX = canvas.width / 2 - this.#PADDLE_WIDTH / 2;
        this.#paddleBottomX = canvas.width / 2 - this.#PADDLE_WIDTH / 2;

        // center ball
        this.#ballX = canvas.width / 2;
        this.#ballY = canvas.height / 2;

        // reset score
        this.#volleys = 0;

        // serve!
        this.#serve();
    }
    


    // ****************************** EVENT FUNCTIONS ***********************************
    /**
     * on 'mousemove' event handler
     * @param {Event} evt
     */
    #setPaddlePositions(evt) {
        var mousePos = calculateMousePosition(evt);
    
        this.#paddleLeftY   = mousePos.y - (this.#PADDLE_WIDTH / 2);
        this.#paddleRightY  = mousePos.y - (this.#PADDLE_WIDTH / 2);
        this.#paddleTopX    = mousePos.x - (this.#PADDLE_WIDTH / 2);
        this.#paddleBottomX = mousePos.x - (this.#PADDLE_WIDTH / 2);
    }

    /**
     * on 'mousedown' event handler
     * @param {Event} evt
     */
    #mouseClick(evt) {
        var mousePos = calculateMousePosition(evt);

        switch (gameManager.State) {
            case
                GameState.Title: {
                    if (isInButton(mousePos, button2)) { gameManager.Play(); }

                    if ( isInButton(mousePos, button5) ) {
                        this.#practice = toggleState(this.#practice);
                        this.TitleScreen();
                    }

                    if (isInButton(mousePos, buttonCorner3)) { exitGame(); }

                    // buttonCorner4 - instructions // TODO
                    // if (isInButton(mousePos, buttonCorner4)) { gameManager.Instructions(); }

                }
                break;

            // case
            //     GameState.Instructions: {
            //         if (isInButton(mousePos, buttonCorner3)) { gameManager.Title(); }
            //     }
            //     break;

            case
                GameState.Paused: {
                    if (isInButton(mousePos, button2)) {
                        gameManager.ResetGame();
                        gameManager.Title();
                    }
                }
                break;

            case
                GameState.GameOver: {
                    if (isInButton(mousePos, button2)) {
                        gameManager.ResetGame();
                        gameManager.Play();
                    }

                    if (isInButton(mousePos, buttonCorner3)) {
                        gameManager.ResetGame();
                        gameManager.Title();
                    }
                }
                break;
        };
    }

    /**
     * on 'keydown' event handler
     * @param {Event} evt
     */
    #keyPress(evt) {
        if (evt.code == 'Space') {
            gameManager.Pause();
        }
    }



    // ************************ GoPongYourself FUNCTIONS ********************************
    #drawFrame() {    
        this.#drawGameBackground();

        // Ball
        colorCircle(this.#ballX, this.#ballY, this.#BALL_RADIUS, this.#ballColor);

        // Left Paddle
        this.#paddleLeftY = this.#paddleCheckY(this.#paddleLeftY);
        colorRect(MARGIN, this.#paddleLeftY, this.#PADDLE_THICKNESS, this.#PADDLE_WIDTH, this.#paddleColor);

        // Right Paddle
        this.#paddleRightY = this.#paddleCheckY(this.#paddleRightY);
        colorRect(canvas.width - this.#PADDLE_THICKNESS - MARGIN, this.#paddleRightY, this.#PADDLE_THICKNESS,
            this.#PADDLE_WIDTH, this.#paddleColor);

        // Top Paddle
        this.#paddleTopX = this.#paddleCheckX(this.#paddleTopX);
        colorRect(this.#paddleTopX, MARGIN, this.#PADDLE_WIDTH, this.#PADDLE_THICKNESS, this.#paddleColor);

        // Bottom Paddle
        this.#paddleBottomX = this.#paddleCheckX(this.#paddleBottomX);
        colorRect(this.#paddleBottomX, canvas.height - this.#PADDLE_THICKNESS - MARGIN, this.#PADDLE_WIDTH,
            this.#PADDLE_THICKNESS, this.#paddleColor);

        this.#drawScore();
    }


    /**
     * draw single color background
     * @param {string} backgroundColor
     */
    #drawTitleBackground() {
        colorRect(0, 0, canvas.width, canvas.height, this.#fieldColor);
    }


    /**
     * draw background with margin
     * @param {string} backgroundColor bacground color
     * @param {string} marginColor margin color
     */
    #drawGameBackground() {
        colorRect(0, 0, canvas.width, canvas.height, this.#lineColor);
        colorRect(MARGIN, MARGIN, canvas.width - MARGIN * 2, canvas.height - MARGIN * 2, this.#fieldColor);
    }



    /** draw score on screen center */
    #drawScore() {
        if (this.#volleys > 0) {
            colorText(this.#volleys, canvas.width / 2, canvas.height / 2 + 15, this.#scoreColor, 'center');
        }
    }

    #moveEverything() {
        var rebounded = false;
        var volleyed = false;

        // Left Paddle [paddleLeftY]
        if (this.#ballX < MARGIN + this.#PADDLE_THICKNESS) {
            this.#ballX = MARGIN + this.#PADDLE_THICKNESS + 2;

            if (this.#ballY > this.#paddleLeftY && this.#ballY < this.#paddleLeftY + this.#PADDLE_WIDTH) {
                this.#ballSpeedY += this.#rebound(this.#paddleLeftY, this.#ballY);
                volleyed = true;
            }

            rebounded = true;
            this.#ballSpeedX *= -1;
        }

        // Right Paddle [paddleRightY]
        if (this.#ballX > canvas.width - MARGIN - this.#PADDLE_THICKNESS) {
            this.#ballX = canvas.width - MARGIN - this.#PADDLE_THICKNESS - 2;

            if (this.#ballY > this.#paddleRightY && this.#ballY < this.#paddleRightY + this.#PADDLE_WIDTH) {
                this.#ballSpeedY += this.#rebound(this.#paddleRightY, this.#ballY);
                volleyed = true;
            }

            rebounded = true;
            this.#ballSpeedX *= -1;
        }

        // Top Paddle [paddleTopX]
        if (this.#ballY < MARGIN + this.#PADDLE_THICKNESS) {
            this.#ballY = MARGIN + this.#PADDLE_THICKNESS + 2;

            if (this.#ballX > this.#paddleTopX && this.#ballX < this.#paddleTopX + this.#PADDLE_WIDTH) {
                this.#ballSpeedX += this.#rebound(this.#paddleTopX, this.#ballX);
                volleyed = true;
            }

            rebounded = true;
            this.#ballSpeedY *= -1;
        }

        // Bottom Paddle [paddleBottomX]
        if (this.#ballY > canvas.height - MARGIN - this.#PADDLE_THICKNESS) {
            this.#ballY = canvas.height - MARGIN - this.#PADDLE_THICKNESS - 2;

            if (this.#ballX > this.#paddleBottomX && this.#ballX < this.#paddleBottomX + this.#PADDLE_WIDTH) {
                this.#ballSpeedX += this.#rebound(this.#paddleBottomX, this.#ballX);
                volleyed = true;
            }

            rebounded = true;
            this.#ballSpeedY *= -1;
        }

        // scoring
        if (rebounded && volleyed) {
            this.#volleys += 1;

            this.#ballSpeedCheck();
        }
        else if (rebounded) {

            // practice mode switch
            if (this.#practice) {
                this.#volleys = 0;
                // TODO create "Exit to Title" button or event
            }
            else {
                // save max score
                if (this.#volleys > this.#maxVolleys) {
                    this.#maxVolleys = this.#volleys;
                    localStorage.maxVolleysRecord = this.#maxVolleys.toString();
                }

                // trigger gameover
                gameManager.GameOver();
            }
        }

        // move ball
        this.#ballX += this.#ballSpeedX;
        this.#ballY += this.#ballSpeedY;
    }


    // check to keep paddles on screen
    // Y paddles
    #paddleCheckY(paddleYPos) {
        if (paddleYPos < MARGIN) {
            paddleYPos = MARGIN;
        }
        if (paddleYPos > canvas.height - this.#PADDLE_WIDTH - MARGIN) {
            paddleYPos = canvas.height - this.#PADDLE_WIDTH - MARGIN;
        }

        return paddleYPos;
    }
    // X paddles
    #paddleCheckX(paddleXPos) {
        if (paddleXPos < MARGIN) {
            paddleXPos = MARGIN;
        }
        if (paddleXPos > canvas.width - this.#PADDLE_WIDTH - MARGIN) {
            paddleXPos = canvas.width - this.#PADDLE_WIDTH - MARGIN;
        }

        return paddleXPos;
    }


    // serve ball with random vector
    #serve() {
        // random X vector
        var ballXdirection = (Math.random() < 0.6) ? -1 : 1;
        var ballXmagnitude = Math.random(123) * this.#BALL_SPEED;
        this.#ballSpeedX = ballXmagnitude * ballXdirection;

        // random Y vector
        var ballYdirection = (Math.random() < 0.6) ? -1 : 1;
        var ballYmagnitude = Math.random() * this.#BALL_SPEED;
        this.#ballSpeedY = ballYmagnitude * ballYdirection;

        // check to keep serve fair and interesting
        if (Math.abs(this.#ballSpeedX) + Math.abs(this.#ballSpeedY) < this.#BALL_MAX_SPEED) {
            var diff = this.#BALL_MAX_SPEED - (this.#ballSpeedX + this.#ballSpeedY);
            this.#ballSpeedX += (diff / 2) * ballXdirection;
            this.#ballSpeedY += (diff / 2) * ballYdirection;
        }
    }


    // enforce MIN and MAX ball speed
    #ballSpeedCheck() {
        var Xdirection = this.#ballSpeedX / Math.abs(this.#ballSpeedX);
        var Xmagnitude = Math.abs(this.#ballSpeedX);

        var Ydirection = this.#ballSpeedY / Math.abs(this.#ballSpeedY);
        var Ymagnitude = Math.abs(this.#ballSpeedY);

        if (Xmagnitude > this.#BALL_MAX_SPEED) {
            this.#ballSpeedX = this.#BALL_MAX_SPEED * Xdirection;
        }
        if (Ymagnitude > this.#BALL_MAX_SPEED) {
            this.#ballSpeedY = this.#BALL_MAX_SPEED * Ydirection;
        }

        if (Xmagnitude < this.#BALL_MIN_SPEED) {
            this.#ballSpeedX = this.#BALL_MIN_SPEED * Xdirection;
        }
        if (Ymagnitude < this.#BALL_MIN_SPEED) {
            this.#ballSpeedY = this.#BALL_MIN_SPEED * Ydirection;
        }
    }


    // calculate rebound speed
    #rebound(paddlePos, ballPos) {
        var delta = ballPos - (paddlePos + this.#PADDLE_WIDTH / 2);
        return ( delta / (this.#PADDLE_WIDTH / 2) ) * this.#PADDLE_CURVE;
    }
}

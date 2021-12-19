"use strict";
// ******************************* Go Pong Yourself v0.1 ********************************
/**
 * @author Evan Sklarski <esklarski@gmail.com>
 * @version 0.2
 * @see {@link - https://esklarski.github.io/CannibalArcade/}
 */
// Go Pong yourself and have a good time.
// Simple 4-way paddle game, solo play, go for a personal high score.
// inspired by: Hands-On Intro to Game Programming (v5), Chris  DeLeon
//
// TODO:
// - scale ball speed with # of volleys
// - difficulty option: paddle width change?
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
    #BALL_SPEED = 500;
    #BALL_MIN_SPEED = 300;
    #BALL_MAX_SPEED = 650;
    #BALL_SPEED_INCREMENT = 0.1;
    #ballX;
    #ballY;
    #ballSpeedX;
    #ballSpeedY;

    // paddles
    #PADDLE_CURVE = 0.4;
    #PADDLE_WIDTH = 150;
    #PADDLE_THICKNESS = 10;
    /** Shared paddle Y coordinate. */
    #paddleY;
    /** Shared paddle X coordinate */
    #paddleX;

    // score
    /** # of continuous volleys. */
    #volleys = 0;
    /** Maximum volleys achieved. */
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
        drawText(GoPongYourself.#TITLE,
            canvasCenter.x, 180, this.#textColor, 'center', LARGE_FONT);

        // click to play
        drawText("Click to begin play.",
            canvasCenter.x, canvasCenter.y - 45, this.#textColor, 'center');

        // button
        drawButton(button2, 'Begin',
            this.#buttonColor, this.#buttonTextColor);

        drawButton(button5, "practice",
            this.#buttonColor, this.#practice ? this.#textColor : this.#buttonTextColor);

        drawText("Use mouse to position paddles, go for a high score.",
            canvasCenter.x, canvasCenter.y + 200, this.#textColor, 'center', SMALL_FONT);

        drawText("Press Space bar to pause game.", canvasCenter.x, canvasCenter.y + 225, this.#textColor, 'center', SMALL_FONT);

        drawButton(buttonCorner3, "Exit Game", this.#buttonTextColor, this.#buttonColor);
    }


    /**
     * @override
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
    Loop(timeDelta) {
        this.#moveEverything(timeDelta);
        this.#drawFrame();
    }


    /**
     * @override
     */
    GameEvents(on) {
        if (this.#mouseMoveEvent == null) {
            this.#mouseMoveEvent = this.#recordMousePosition.bind(this);
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
            if (gameManager.State != GameState.Paused) {
                document.removeEventListener('keydown', this.#keyPressEvent);
            }
        }
    }


    /** @override */
    PauseOverlay() {
        // this keeps game visible under overlay, while resizing window
        this.#drawFrame();

        drawRect(0, 0, canvas.width, canvas.height, 'black', 0.3);
        drawText("press SPACE to resume",
            canvasCenter.x, canvasCenter.y / 2, this.#textColor, 'center');

        drawButton(button2, 'Reset', this.#buttonColor, this.#buttonTextColor);
    }


    /** @override */
    GameOverScreen() {
        this.#drawTitleBackground();

        // Game Over text
        drawText("Game Over",
            canvasCenter.x, 180, this.#textColor, 'center', LARGE_FONT);

        // button
        drawButton(button2, 'Serve!', this.#buttonColor, this.#buttonTextColor);

        // final score
        drawText("Score: " + this.#volleys + " volleys.",
            canvasCenter.x, (canvasCenter.y) + 60, this.#textColor, 'center');

        // max score text
        drawText("Most volleys achieved: " + this.#maxVolleys,
        canvasCenter.x, (canvasCenter.y) + 150, this.#textColor, 'center');

        drawButton(buttonCorner3, "Exit to Title",
            this.#buttonTextColor, this.#buttonColor);
    }


    #firstRun = true;
    /** @override */
    Reset() {
        if (this.#firstRun) {
            this.#maxVolleys = this.#loadScore();

            this.#firstRun = false;
        }
        
        // center paddles
        this.#mouseMovePos.y = canvasCenter.y + rect.top + root.scrollTop;
        this.#mouseMovePos.x = canvasCenter.x + rect.left + root.scrollLeft;

        // center ball
        this.#ballX = canvasCenter.x;
        this.#ballY = canvasCenter.y;

        // reset score
        this.#volleys = 0;

        // serve!
        this.#serve();
    }


    /** @override */
    Resize(previousCanvas) {
        // adjust paddle positions for new canvas size
        this.#paddleX = this.#paddleCheckX(
            this.#paddleX / previousCanvas.width * canvas.width
        );

        this.#paddleY = this.#paddleCheckY(
            this.#paddleY / previousCanvas.height * canvas.height
        );

        // move ball relative to new canvas size
        this.#ballX = this.#ballX / previousCanvas.width * canvas.width;

        this.#ballY = this.#ballY / previousCanvas.height * canvas.height;
    }
    


    // ****************************** EVENT FUNCTIONS ***********************************
    /**
     * @type {Coordinate}
     * 
     * Store most recent mouse move position. Used by #setPaddlePositions()
     */
    #mouseMovePos = { x: 0, y: 0 };
    /**
     * On 'mousemove' event handler.
     * @param {Event} evt
     */
    #recordMousePosition(evt) {
        this.#mouseMovePos.x = evt.clientX;
        this.#mouseMovePos.y = evt.clientY;
    }

    /**
     * @type {Coordinate}
     * 
     * Store most recent mouse click position. Used by #mouseClick()
     */
    #mouseClickPos = { x: 0, y: 0 };
    /**
     * On 'mousedown' event handler.
     * @param {Event} evt
     */
    #mouseClick(evt) {
        this.#mouseClickPos = calculateMousePosition(evt);

        switch (gameManager.State) {
            case
                GameState.Title: {
                    if (isInButton(this.#mouseClickPos, button2)) { gameManager.Play(); }

                    if ( isInButton(this.#mouseClickPos, button5) ) {
                        this.#practice = toggleBool(this.#practice);
                        this.TitleScreen();
                    }

                    if (isInButton(this.#mouseClickPos, buttonCorner3)) { gameManager.ExitGame(); }

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
                    if (isInButton(this.#mouseClickPos, button2)) {
                        gameManager.ResetGame();
                        gameManager.Title();
                    }
                }
                break;

            case
                GameState.GameOver: {
                    if (isInButton(this.#mouseClickPos, button2)) {
                        gameManager.ResetGame();
                        gameManager.Play();
                    }

                    if (isInButton(this.#mouseClickPos, buttonCorner3)) {
                        gameManager.ResetGame();
                        gameManager.Title();
                    }
                }
                break;
        };
    }

    /**
     * On 'keydown' event handler.
     * @param {Event} evt
     */
    #keyPress(evt) {
        if (evt.code == 'Space') {
            gameManager.Pause();
        }
    }



    // ************************ GoPongYourself FUNCTIONS ********************************
    /** Draw game frame. */
    #drawFrame() {    
        this.#drawGameBackground();

        // Ball
        drawCircle(this.#ballX, this.#ballY, this.#BALL_RADIUS, this.#ballColor);

        // Left Paddle
        drawRect(MARGIN, this.#paddleY, this.#PADDLE_THICKNESS, this.#PADDLE_WIDTH, this.#paddleColor);

        // Right Paddle
        drawRect(canvas.width - this.#PADDLE_THICKNESS - MARGIN, this.#paddleY, this.#PADDLE_THICKNESS,
            this.#PADDLE_WIDTH, this.#paddleColor);

        // Top Paddle
        drawRect(this.#paddleX, MARGIN, this.#PADDLE_WIDTH, this.#PADDLE_THICKNESS, this.#paddleColor);

        // Bottom Paddle
        drawRect(this.#paddleX, canvas.height - this.#PADDLE_THICKNESS - MARGIN, this.#PADDLE_WIDTH,
            this.#PADDLE_THICKNESS, this.#paddleColor);

        this.#drawScore();
    }


    /**
     * Draw single color background.
     * @param {string} backgroundColor
     */
    #drawTitleBackground() {
        drawRect(0, 0, canvas.width, canvas.height, this.#fieldColor);
    }


    /**
     * Draw background with margin.
     * @param {string} backgroundColor bacground color
     * @param {string} marginColor margin color
     */
    #drawGameBackground() {
        drawRect(0, 0, canvas.width, canvas.height, this.#lineColor);
        drawRect(MARGIN, MARGIN, canvas.width - MARGIN * 2, canvas.height - MARGIN * 2, this.#fieldColor);
    }



    /** Draw score on screen center. */
    #drawScore() {
        if (this.#volleys > 0) {
            drawText(this.#volleys, canvasCenter.x, canvasCenter.y + 15, this.#scoreColor, 'center');
        }
    }


    // result variables for #moveEverything()
    #rebounded = false;
    #volleyed = false;
    /** Move paddles and ball, collision detection. */
    #moveEverything(timeDelta) {
        this.#rebounded = false;
        this.#volleyed = false;

        // get latest mouse position for paddles
        this.#setPaddlePositions();

        // Left Paddle [paddleY]
        if (this.#ballX < MARGIN + this.#PADDLE_THICKNESS) {
            this.#ballX = MARGIN + this.#PADDLE_THICKNESS + 2;

            if (
                this.#ballY > this.#paddleY - MARGIN &&
                this.#ballY < this.#paddleY + this.#PADDLE_WIDTH + MARGIN
            ) {
                this.#ballSpeedY += this.#rebound(this.#paddleY, this.#ballY);
                this.#volleyed = true;
            }

            this.#rebounded = true;
            this.#ballSpeedX *= -1;
        }

        // Right Paddle [paddleY]
        if (this.#ballX > canvas.width - MARGIN - this.#PADDLE_THICKNESS) {
            this.#ballX = canvas.width - MARGIN - this.#PADDLE_THICKNESS - 2;

            if (
                this.#ballY > this.#paddleY - MARGIN &&
                this.#ballY < this.#paddleY + this.#PADDLE_WIDTH + MARGIN
            ) {
                this.#ballSpeedY += this.#rebound(this.#paddleY, this.#ballY);
                this.#volleyed = true;
            }

            this.#rebounded = true;
            this.#ballSpeedX *= -1;
        }

        // Top Paddle [paddleX]
        if (this.#ballY < MARGIN + this.#PADDLE_THICKNESS) {
            this.#ballY = MARGIN + this.#PADDLE_THICKNESS + 2;

            if (
                this.#ballX > this.#paddleX - MARGIN &&
                this.#ballX < this.#paddleX + this.#PADDLE_WIDTH + MARGIN
            ) {
                this.#ballSpeedX += this.#rebound(this.#paddleX, this.#ballX);
                this.#volleyed = true;
            }

            this.#rebounded = true;
            this.#ballSpeedY *= -1;
        }

        // Bottom Paddle [paddleX]
        if (this.#ballY > canvas.height - MARGIN - this.#PADDLE_THICKNESS) {
            this.#ballY = canvas.height - MARGIN - this.#PADDLE_THICKNESS - 2;

            if (
                this.#ballX > this.#paddleX - MARGIN &&
                this.#ballX < this.#paddleX + this.#PADDLE_WIDTH + MARGIN
            ) {
                this.#ballSpeedX += this.#rebound(this.#paddleX, this.#ballX);
                this.#volleyed = true;
            }

            this.#rebounded = true;
            this.#ballSpeedY *= -1;
        }

        // scoring
        if (this.#rebounded && this.#volleyed) {
            this.#volleys += 1;

            this.#ballSpeedCheck();
        }
        else if (this.#rebounded) {

            // practice mode switch
            if (this.#practice) {
                this.#volleys = 0;
            }
            else {
                // save max score
                if (this.#volleys > this.#maxVolleys) {
                    this.#maxVolleys = this.#volleys;
                    this.#saveScore(this.#maxVolleys);
                }

                // trigger gameover
                gameManager.GameOver();
            }
        }

        // move ball
        this.#ballX += this.#ballSpeedX * timeDelta;
        this.#ballY += this.#ballSpeedY * timeDelta;
    }


    /** Set paddle position for current frame. */
    #setPaddlePositions() {
        this.#paddleY = this.#paddleCheckY(
            (this.#mouseMovePos.y - rect.top - root.scrollTop) - (this.#PADDLE_WIDTH / 2)
        );
        

        this.#paddleX = this.#paddleCheckX(
            (this.#mouseMovePos.x - rect.left - root.scrollLeft) - (this.#PADDLE_WIDTH / 2)
        );
    }


    /** Check to keep Y paddles on screen. */
    #paddleCheckY(paddleYPos) {
        if (paddleYPos < MARGIN) {
            paddleYPos = MARGIN;
        }
        if (paddleYPos > canvas.height - this.#PADDLE_WIDTH - MARGIN) {
            paddleYPos = canvas.height - this.#PADDLE_WIDTH - MARGIN;
        }

        return paddleYPos;
    }
    /** Check to keep X paddles on screen. */
    #paddleCheckX(paddleXPos) {
        if (paddleXPos < MARGIN) {
            paddleXPos = MARGIN;
        }
        if (paddleXPos > canvas.width - this.#PADDLE_WIDTH - MARGIN) {
            paddleXPos = canvas.width - this.#PADDLE_WIDTH - MARGIN;
        }

        return paddleXPos;
    }


    #ballXdirection = 0;
    #ballXmagnitude = 0;
    #ballYdirection = 0;
    #ballYmagnitude = 0;
    /** Serve ball with random vector. */
    #serve() {
        // random X vector
        this.#ballXdirection = (Math.random() < 0.6) ? -1 : 1;
        this.#ballXmagnitude = Math.random(123) * this.#BALL_SPEED;
        this.#ballSpeedX = this.#ballXmagnitude * this.#ballXdirection;

        // random Y vector
        this.#ballYdirection = (Math.random() < 0.6) ? -1 : 1;
        this.#ballYmagnitude = Math.random() * this.#BALL_SPEED;
        this.#ballSpeedY = this.#ballYmagnitude * this.#ballYdirection;

        this.#ballSpeedCheck();
    }


    /** Enforce MIN and MAX ball speed. */
    #ballSpeedCheck() {
        this.#ballXdirection = this.#ballSpeedX / Math.abs(this.#ballSpeedX);
        this.#ballXmagnitude = Math.abs(this.#ballSpeedX);

        this.#ballYdirection = this.#ballSpeedY / Math.abs(this.#ballSpeedY);
        this.#ballYmagnitude = Math.abs(this.#ballSpeedY);

        if (this.#ballXmagnitude > this.#BALL_MAX_SPEED) {
            this.#ballSpeedX = this.#BALL_MAX_SPEED * this.#ballXdirection;
        }
        if (this.#ballYmagnitude > this.#BALL_MAX_SPEED) {
            this.#ballSpeedY = this.#BALL_MAX_SPEED * this.#ballYdirection;
        }

        if (this.#ballXmagnitude < this.#BALL_MIN_SPEED) {
            this.#ballSpeedX = this.#BALL_MIN_SPEED * this.#ballXdirection;
        }
        if (this.#ballYmagnitude < this.#BALL_MIN_SPEED) {
            this.#ballSpeedY = this.#BALL_MIN_SPEED * this.#ballYdirection;
        }
    }


    /** Difference between paddle center and ball position on rebound. */
    #deltaPaddle = 0;
    /**
     * Calculate rebound speed.
     * @param {number} paddlePos - paddle X or Y position on wall
     * @param {number} ballPos - ball position along paddle axis
     */
    #rebound(paddlePos, ballPos) {
        this.#deltaPaddle = ballPos - (paddlePos + this.#PADDLE_WIDTH / 2);
        return (this.#deltaPaddle / (this.#PADDLE_WIDTH / 2)) * (this.#BALL_SPEED * this.#PADDLE_CURVE);
    }


    /** Load high score from localStorage if it exists. */
    #loadScore() {
        let score = 0;
        if (localStorage.maxVolleysRecord) {
            // read in previous score
            try {
                score = parseInt( localStorage.maxVolleysRecord );
            }
            catch {
                // invalide data
                score = 0;
            }
        }

        return score;
    }


    /**
     * Save high score to localStorage.
     * 
     * @param {number} volleys
     */
    #saveScore(volleys) {
        localStorage.maxVolleysRecord = volleys.toString();
    }
}

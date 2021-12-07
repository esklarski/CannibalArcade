"use strict";
// ******************************* Some Tennis Game v0.1 ********************************
/**
 * @author Evan Sklarski <esklarski@gmail.com>
 * @version 0.1
 * @see {@link - https://esklarski.github.io/CannibalArcade/}
 */
// Some tennis game, played against the AI that may one day rule the world.
// inspired by: Hands-On Intro to Game Programming (v5), Chris  DeLeon
//
// TODO:
// - difficulty options?
//   - scale ball speed with # of volleys?
//   - change paddle size?
//   - make AI smarter?
//
// **************************************************************************************

/**
 * {@link Game}: Some Tennis Game
 * @extends Game
 */
class SomeTennisGame extends Game {
    // TODO:
    // - fix colors, currently referencing unavailable varables
    // colors
    #textColor = DisneylandParisCastle["LIGHTPINK"];
    #buttonColor = DisneylandParisCastle["LIGHTPINK"];
    #buttonTextColor = DisneylandParisCastle["DARKBLUE"];
    #fieldColor = DisneylandParisCastle["DARKBLUE"];
    #lineColor = DisneylandParisCastle["DARKPINK"];
    #ballColor = DisneylandParisCastle["BROWN"];
    #paddle1Color = DisneylandParisCastle["LIGHTPINK"];
    #paddle2Color = DisneylandParisCastle["LIGHTBLUE"];

    // AI
    #AI_SPEED = 3;
    #AI = true;

    // ball
    #BALL_RADIUS = 10;
    #BALL_SPEED = 6;
    #ballX; // = 75;
    #ballY; // = 75;
    #ballSpeedX; // = 8;
    #ballSpeedY; // = 8;

    // paddles
    #PADDLE_HEIGHT = 100;
    #PADDLE_THICKNESS = 10;
    #paddle1Y;
    #paddle2Y;

    // score
    #WIN_SCORE = 1;
    #player1Score;
    #player2Score;
    #winner;

    /** Game Title - Some Tennis Game */
    static #TITLE = "Some Tennis Game";

    // storage for event listener functions
    /** @type {Function} store bound function */
    #mouseClickEvent = null;
    /** @type {Function} store bound function */
    #mouseMoveEvent = null;
    /** @type {Function} keyPressEvent bound function */
    #keyPressEvent = null;



    constructor() {
        super(SomeTennisGame.#TITLE);
    }



    // ******************************* REQUIRED OVERRIDES *******************************
    /** @override */
    TitleScreen() {
        this.#drawTitleBackground(this.#fieldColor);

        // title
        colorText(SomeTennisGame.#TITLE,
            canvasCenter.x, 180, this.#textColor, 'center', LARGE_FONT);

        // click to play
        colorText("Click to begin play.",
            canvasCenter.x, canvasCenter.y - 45, this.#textColor, 'center');

        // buttons
        drawButton(button2, 'Begin',
            this.#buttonColor, this.#buttonTextColor);

        colorText("Use mouse to position paddles, score 10 points before your opponent does.",
            canvasCenter.x, canvasCenter.y + 200, this.#textColor, 'center', SMALL_FONT);

        colorText("Press Space bar to pause game.", canvasCenter.x, canvasCenter.y + 225, this.#textColor, 'center', SMALL_FONT);

        drawButton(buttonCorner3, "Exit Game", this.#buttonColor, this.#buttonTextColor);
    }

    /** @override */
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
        // move everything
        this.#moveEverything();
        // draw frame
        this.#drawEverything();
    }

    /** @override */
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
            if (gameManager.State != GameState.Paused) {
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

        // Text declaring winner
        colorText(this.#winner + " wins!", canvas.width / 2, canvas.height / 2 - 20, this.#textColor, 'center');

        // final score
        colorText("Score: " + this.#player1Score + " : " + this.#player2Score, canvas.width / 2, (canvas.height / 2) + 20, this.#textColor, 'center');

        // button
        drawButton(button5, "again?", this.#buttonColor, this.#buttonTextColor);
        drawButton(buttonCorner3, "Exit to Title", this.#buttonColor, this.#buttonTextColor);
    }

    /** @override */
    Reset() {
        //paddles
        this.#paddle1Y = canvas.height/2 - this.#PADDLE_HEIGHT / 2;
        this.#paddle2Y = canvas.height/2 - this.#PADDLE_HEIGHT / 2;

        //ball position
        this.#ballX = canvas.width/2;
        this.#ballY = canvas.height / 2;

        // ball direction
        let ballXdirection = (Math.random() <= 0.5) ? -1 : 1;
        this.#ballSpeedX = this.#BALL_SPEED * ballXdirection;
        this.#ballSpeedY = this.#BALL_SPEED * ( (Math.random() * 2) -1 );

        //score
        this.#player1Score = 0;
        this.#player2Score = 0;
    }
    


    // ****************************** EVENT FUNCTIONS ***********************************
    /**
     * on 'mousemove' event handler
     * @param {Event} evt
     */
    #setPaddlePositions(evt) {
        let mousePos = calculateMousePosition(evt);

        this.#paddle1Y = mousePos.y - (this.#PADDLE_HEIGHT / 2);

        // if (!this.#AI) {
        //     // player 2 control switch
        //     this.#paddle2Y = mousePos.y - (this.#PADDLE_HEIGHT / 2);
        // }
    }

    /**
     * on 'mousedown' event handler
     * @param {Event} evt
     */
    #mouseClick(evt) {
        let mousePos = calculateMousePosition(evt);

        switch (gameManager.State) {
            case
                GameState.Title: {
                    if (isInButton(mousePos, button2)) { gameManager.Play(); }

                    if (isInButton(mousePos, buttonCorner3)) { gameManager.ExitGame(); }
                }
                break;

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
                    if (isInButton(mousePos, button5)) {
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



    // ************************ SomeTennisGame FUNCTIONS ********************************
    /** move everything that needs moving */
    #moveEverything() {
        // left goal
        if (this.#ballX < MARGIN*4) {
            // bounce off paddle
            if (this.#ballY > this.#paddle1Y && this.#ballY < this.#paddle1Y + this.#PADDLE_HEIGHT) {
                this.#ballSpeedX *= -1;

                let deltaY = this.#ballY - (this.#paddle1Y + this.#PADDLE_HEIGHT / 2);
                this.#ballSpeedY = deltaY * 0.15;
            }
            // goal
            else {
                this.#player2Score += 1;
                this.#ballReset('left');
            }
        }

        // right goal
        if (this.#ballX > canvas.width - MARGIN*4) {
            // bounce off paddle
            if (this.#ballY > this.#paddle2Y && this.#ballY < this.#paddle2Y + this.#PADDLE_HEIGHT) {
                this.#ballSpeedX *= -1;

                let deltaY = this.#ballY - (this.#paddle2Y + this.#PADDLE_HEIGHT / 2);
                this.#ballSpeedY = deltaY * 0.15;
            }
            // goal
            else {
                this.#player1Score += 1;
                this.#ballReset('right');
            }
        }

        // wall bounce
        if (this.#ballY > (canvas.height - MARGIN) || this.#ballY < MARGIN) {
            this.#ballSpeedY *= -1;
        }

        // move ball
        this.#ballX += this.#ballSpeedX;
        this.#ballY += this.#ballSpeedY;
    }


    /** draw frame */
    #drawEverything() {
        this.#drawGameBackground();

        // Ball
        colorCircle(this.#ballX, this.#ballY, this.#BALL_RADIUS, this.#ballColor);

        // Left Paddle
        this.#paddle1Y = this.#paddleCheck(this.#paddle1Y);
        colorRect( 5, this.#paddle1Y, this.#PADDLE_THICKNESS, this.#PADDLE_HEIGHT, this.#paddle1Color);

        // Right Paddle
        if (this.#AI) { this.#moveComputerPaddle(); }
        this.#paddle2Y = this.#paddleCheck(this.#paddle2Y);
        colorRect(canvas.width - this.#PADDLE_THICKNESS - MARGIN, this.#paddle2Y, this.#PADDLE_THICKNESS, this.#PADDLE_HEIGHT, this.#paddle2Color);

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


    /** draw scores in screen corners */    
    #drawScore() {
        colorText(this.#player1Score, MARGIN, canvas.height - MARGIN * 2, this.#textColor, 'start')
        colorText(this.#player2Score, canvas.width - MARGIN, canvas.height - MARGIN * 2, this.#textColor, 'end');
    }


    /** check to keep paddles on screen */
    #paddleCheck(paddleYPos) {
        if (paddleYPos < 0) {
            paddleYPos = 0;
        }
        if (paddleYPos > canvas.height - this.#PADDLE_HEIGHT) {
            paddleYPos = canvas.height - this.#PADDLE_HEIGHT;
        }
    
        return paddleYPos;
    }


    /** 'serve' ball after goal */
    #ballReset(side) { // side: 'left' or 'right'
        this.#ballSpeedX *= -1;
        this.#ballX = (side == 'left')? (canvas.width / 2) - (canvas.width / 4) : (canvas.width / 2) + (canvas.width / 4);
        this.#ballY = canvas.height / 2;
        this.#ballSpeedY = this.#BALL_SPEED * ( (Math.random() * 2) -1 );

        if (this.#player1Score == this.#WIN_SCORE || this.#player2Score == this.#WIN_SCORE) {
            this.#weHaveAWinner();
        }
    }


    /** win conditions met */
    #weHaveAWinner() {
        this.#ballSpeedX = 0;
        this.#ballSpeedY = 0;

        if (this.#player1Score == this.#WIN_SCORE) {
            this.#winner = 'Player 1';
        }
        else {
            this.#winner = this.#AI? 'I win human, ha ha ha! I' : 'Player 2';
        }

        gameManager.GameOver();
    }


    /** move AI paddle */
    #moveComputerPaddle() {
        // paddle center
        let paddlePosition = this.#paddle2Y + this.#PADDLE_HEIGHT / 2;
        // ball center or canvas middle
        let desiredPosition = (this.#ballSpeedX < 0)? canvas.height/2 : this.#ballY;

        // how much to move?
        let direction = desiredPosition - paddlePosition;

        // if not in deadzone move paddle
        if (direction > this.#AI_SPEED*2 || direction < -this.#AI_SPEED*2) {
            if (direction > 0) {
                this.#paddle2Y += this.#AI_SPEED;
            }
            else if (direction < 0) {
                this.#paddle2Y -= this.#AI_SPEED;
            }
        }
    }
}

"use strict";
// ******************************* Some Tennis Game v0.1 ********************************
/**
 * @author Evan Sklarski <esklarski@gmail.com>
 * @version 0.2
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
    #AI_SPEED = 4;
    #AI = true;

    // ball
    #BALL_RADIUS = 10;
    #BALL_SPEED = 500;
    #ballX = 0;
    #ballY = 0;
    #ballSpeedX = 0;
    #ballSpeedY = 0;

    // paddles
    #PADDLE_HEIGHT = 100;
    #PADDLE_THICKNESS = 10;
    #PADDLE_CURVE = 0.9;
    #paddle1Y = 0;
    #paddle2Y = 0;

    // score
    #WIN_SCORE = 10;
    #player1Score = 0;
    #player2Score = 0;
    #winner = '';

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
        drawText(SomeTennisGame.#TITLE,
            canvasCenter.x, 180, this.#textColor, 'center', LARGE_FONT);

        // click to play
        drawText("Click to begin play.",
            canvasCenter.x, canvasCenter.y - 45, this.#textColor, 'center');

        // buttons
        drawButton(button2, 'Begin',
            this.#buttonColor, this.#buttonTextColor);

        drawText("Use mouse to position paddles, score 10 points before your opponent does.",
            canvasCenter.x, canvasCenter.y + 200, this.#textColor, 'center', SMALL_FONT);

        drawText("Press Space bar to pause game.", canvasCenter.x, canvasCenter.y + 225, this.#textColor, 'center', SMALL_FONT);

        drawButton(buttonCorner3, "Exit Game", this.#buttonTextColor, this.#buttonColor);
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
    Loop(timeDelta) {
        // move everything
        this.#moveEverything(timeDelta);
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
        drawRect(0, 0, canvas.width, canvas.height, this.#lineColor, 0.5);
        drawText("press SPACE to resume",
            canvas.width / 2, canvas.height / 4, this.#textColor, 'center');

        drawButton(button2, 'Reset', this.#buttonColor, this.#buttonTextColor);
    }

    /** @override */
    GameOverScreen() {
        this.#drawTitleBackground();

        // Text declaring winner
        drawText(this.#winner + " wins!", canvas.width / 2, canvas.height / 2 - 20, this.#textColor, 'center');

        // final score
        drawText("Score: " + this.#player1Score + " : " + this.#player2Score, canvas.width / 2, (canvas.height / 2) + 20, this.#textColor, 'center');

        // button
        drawButton(button5, "again?", this.#buttonColor, this.#buttonTextColor);
        drawButton(buttonCorner3, "Exit to Title", this.#buttonTextColor, this.#buttonColor);
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
    #mousePos = { x: 0, y: 0 };
    /**
     * on 'mousemove' event handler
     * @param {Event} evt
     */
    #setPaddlePositions(evt) {
        this.#mousePos = calculateMousePosition(evt);

        this.#paddle1Y = this.#mousePos.y - (this.#PADDLE_HEIGHT / 2);

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
        this.#mousePos = calculateMousePosition(evt);

        switch (gameManager.State) {
            case
                GameState.Title: {
                    if (isInButton(this.#mousePos, button2)) { gameManager.Play(); }

                    if (isInButton(this.#mousePos, buttonCorner3)) { gameManager.ExitGame(); }
                }
                break;

            case
                GameState.Paused: {
                    if (isInButton(this.#mousePos, button2)) {
                        gameManager.ResetGame();
                        gameManager.Title();
                    }
                }
                break;

            case
                GameState.GameOver: {
                    if (isInButton(this.#mousePos, button5)) {
                        gameManager.ResetGame();
                        gameManager.Play();
                    }

                    if (isInButton(this.#mousePos, buttonCorner3)) {
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
    #deltaY = 0;
    /** move everything that needs moving */
    #moveEverything(timeDelta) {
        // left goal
        if (this.#ballX < MARGIN + this.#PADDLE_THICKNESS) {
            // bounce off paddle
            if (this.#ballY > this.#paddle1Y && this.#ballY < this.#paddle1Y + this.#PADDLE_HEIGHT) {
                this.#ballSpeedX *= -1;

                this.#deltaY = this.#ballY - (this.#paddle1Y + this.#PADDLE_HEIGHT / 2);
                this.#ballSpeedY = (this.#deltaY / (this.#PADDLE_HEIGHT / 2)) * (this.#BALL_SPEED * this.#PADDLE_CURVE);
            }
            // goal
            else {
                this.#player2Score += 1;
                this.#ballReset('left');
            }
        }

        // right goal
        if (this.#ballX > canvas.width - MARGIN - this.#PADDLE_THICKNESS) {
            // bounce off paddle
            if (this.#ballY > this.#paddle2Y && this.#ballY < this.#paddle2Y + this.#PADDLE_HEIGHT) {
                this.#ballSpeedX *= -1;

                this.#deltaY = this.#ballY - (this.#paddle2Y + this.#PADDLE_HEIGHT / 2);
                this.#ballSpeedY = (this.#deltaY / (this.#PADDLE_HEIGHT/2)) * (this.#BALL_SPEED * this.#PADDLE_CURVE);
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
        // TODO use deltaTime
        this.#ballX += this.#ballSpeedX * timeDelta;
        this.#ballY += this.#ballSpeedY * timeDelta;
    }


    /** draw frame */
    #drawEverything() {
        this.#drawGameBackground();

        // Ball
        drawCircle(this.#ballX, this.#ballY, this.#BALL_RADIUS, this.#ballColor);

        // Left Paddle
        this.#paddle1Y = this.#paddleCheck(this.#paddle1Y);
        drawRect( 5, this.#paddle1Y, this.#PADDLE_THICKNESS, this.#PADDLE_HEIGHT, this.#paddle1Color);

        // Right Paddle
        if (this.#AI) { this.#moveComputerPaddle(); }
        this.#paddle2Y = this.#paddleCheck(this.#paddle2Y);
        drawRect(canvas.width - this.#PADDLE_THICKNESS - MARGIN, this.#paddle2Y, this.#PADDLE_THICKNESS, this.#PADDLE_HEIGHT, this.#paddle2Color);

        this.#drawScore();
    }


    /**
     * draw single color background
     * @param {string} backgroundColor
     */
     #drawTitleBackground() {
        drawRect(0, 0, canvas.width, canvas.height, this.#fieldColor);
    }


    /**
     * draw background with margin
     * @param {string} backgroundColor bacground color
     * @param {string} marginColor margin color
     */
    #drawGameBackground() {
        drawRect(0, 0, canvas.width, canvas.height, this.#lineColor);
        drawRect(MARGIN, MARGIN, canvas.width - MARGIN * 2, canvas.height - MARGIN * 2, this.#fieldColor);
    }


    /** draw scores in screen corners */    
    #drawScore() {
        drawText(this.#player1Score, MARGIN * 2, canvas.height - MARGIN * 2, this.#textColor, 'start')
        drawText(this.#player2Score, canvas.width - MARGIN * 2, canvas.height - MARGIN * 2, this.#textColor, 'end');
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


    #paddlePosition = 0;
    #desiredPosition = 0;
    #direction = 0;
    /** move AI paddle */
    #moveComputerPaddle() {
        // paddle center
        this.#paddlePosition = this.#paddle2Y + this.#PADDLE_HEIGHT / 2;
        // ball center or canvas middle
        this.#desiredPosition = (this.#ballSpeedX < 0)? canvas.height/2 : this.#ballY;

        // how much to move?
        this.#direction = this.#desiredPosition - this.#paddlePosition;

        // if not in deadzone move paddle
        if (this.#direction > this.#AI_SPEED*2 || this.#direction < -this.#AI_SPEED*2) {
            this.#paddle2Y += this.#AI_SPEED * (this.#direction / Math.abs(this.#direction));
        }
    }
}

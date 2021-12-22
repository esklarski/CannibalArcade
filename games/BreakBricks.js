"use strict";
// ********************************* Break Bricks v0.1 **********************************
/**
 * @author Evan Sklarski <esklarski@gmail.com>
 * @version 0.1
 * @see {@link - https://esklarski.github.io/CannibalArcade/}
 * 
 * Break bricks...
 * 
 * Classic brick breaking game,
 * 
 * inspired by: Hands-On Intro to Game Programming (v5), Chris DeLeon
 */
// TODO:
// - brick fill settings [RANDOM, FULL]
// - practice mode toggle
// - timed mode?
//
// **************************************************************************************

/**
 * {@link Game}: Break Bricks
 * @extends Game
 */
class BreakBricks extends Game {
    /** Game Title - Break Bricks */
    static #TITLE = "Break Bricks";

    /** Bounce off bottom wall too. */
    #practice = false;
    #windowInput = false;

    // colors - Vapour Wave
    #textColor = VaporWave['GREEN'];
    #buttonColor = VaporWave['BLUE'];
    #buttonTextColor = VaporWave['PINK'];
    #fieldColor = VaporWave['PURPLE'];
    #ballColor = VaporWave['YELLOW'];
    #paddleColor = VaporWave['BLUE'];
    #paddleCenter = VaporWave['PINK'];
    #brickColor = VaporWave['GREEN'];

    // ball properties
    #BALL_MAX_SPEED = 650;
    #BALL_SPEED = 500;
    #BALL_RADIUS = 10;
    /** Ball X position. */
    #ballX = 0;
    /** Ball Y position. */
    #ballY = 0;
    /** Ball vector X component. */
    #ballSpeedX = 0;
    /** Ball vector Y component. */
    #ballSpeedY = 0;
    /** Ball X position in previous frame. */
    #ballLastX = 0;
    /** Ball Y position in previous frame. */
    #ballLastY = 0;

    // paddle properties
    #PADDLE_WIDTH = 150;
    #PADDLE_THICKNESS = 10;
    #PADDLE_CURVE = 0.6;
    /** Paddle X position */
    #paddleX = 0;
    /** Paddle Y position */
    #paddleY = 0;

    // brick dimensions
    #BRICK_WIDTH = 80;
    #BRICK_HEIGHT = 30;
    #BRICK_COLS = 10;
    #BRICK_ROWS = 12;
    /** Visual gap. */
    #BRICK_GAP = 2;
    /** Number of hits to destroy a brick. */
    #BRICK_HP = 1;
    /** Padding to center bricks horizontally on canvas. */
    #xPadding = 0;
    /** Padding to space bricks down from canvas top. */
    #yPadding = 0;

    /**
     * @typedef {Object} Brick
     * brick[0] = index of brick in brickGrid array,
     * 
     * brick[1] = brick HP
     * @property {number} index
     * @property {number} value
     */

    /**
     * Array containing gameplay bricks.
     * 
     * {@link Brick}
     * 
     * @type {Brick[]}
     */
    #brickGrid;

    /** Mouse X coordinate. */
    #mouseX;

    // storage for event listener functions
    /** @type {Function} store bound mousedown function */
    #mouseClickEvent = null;
    /** @type {Function} store bound mousemove function */
    #mouseMoveEvent = null;
    /** @type {Function} store bound keyPressEvent function */
    #keyPressEvent = null;

    // scoring
    /** How many lives per game? */
    #LIVES = 3;
    /** Number of balls remaining left. */
    #ballsLeft = 0;
    /** Number of volleys. */
    #volleys = 0;
    /** Number of bricks broken. */
    #bricksBroken = 0;



    constructor() {
        super(BreakBricks.#TITLE);

        // create array
        this.#brickGrid = new Array(this.#BRICK_COLS * this.#BRICK_ROWS);
    }



// ********************************* REQUIRED OVERRIDES *********************************
    /** @override */
    TitleScreen() {
        drawRect(0, 0, canvas.width, canvas.height, this.#fieldColor);

        // title
        drawText(BreakBricks.#TITLE,
            canvasCenter.x, 180, this.#textColor, 'center', LARGE_FONT);

        // click to play
        drawText("Click to begin play.",
            canvasCenter.x, canvasCenter.y - 45, this.#textColor, 'center');

        // buttons
        drawButton(button2, 'Begin',
            this.#buttonColor, this.#buttonTextColor);

        // TODO - instructions
        // drawText("Use mouse to position paddles, score 10 points before your opponent does.",
        //     canvasCenter.x, canvasCenter.y + 200, this.#textColor, 'center', SMALL_FONT);

        drawText("Press Space bar to pause game.",
            canvasCenter.x, canvasCenter.y + 225, this.#textColor, 'center', SMALL_FONT);

        drawButton(buttonCorner3, "Exit Game", this.#fieldColor, this.#buttonColor);
    }

    /** @override */
    PauseOverlay() {
        // this keeps game visible under overlay, while resizing window
        this.#drawFrame();

        drawRect(0, 0, canvas.width, canvas.height, 'black', 0.7);
        drawText("press SPACE to resume",
            canvasCenter.x, canvas.height / 4, this.#buttonTextColor, 'center');

        drawButton(button2, 'Reset', this.#buttonColor, this.#buttonTextColor);
    }

    /** @override */
    GameOverScreen() {
        drawRect(0, 0, canvas.width, canvas.height, this.#fieldColor);

        drawText("Game Over", canvasCenter.x, 180, this.#textColor, 'center', LARGE_FONT);

        drawText(
            this.#bricksBroken + " bricks broken ",
            canvasCenter.x,
            canvasCenter.y - 10,
            this.#textColor,
            'center'
        );
        drawText(
            (this.#volleys > 0) ?
                Math.round(this.#bricksBroken / this.#volleys) + " bricks/volley."
                : "zero volleys.",
            canvasCenter.x, canvasCenter.y + 20,
            this.#textColor,
            'center',
            SMALL_FONT
        );

        drawButton(button5, "again?", this.#buttonColor, this.#buttonTextColor);
        drawButton(buttonCorner3, "Exit to Title", this.#fieldColor, this.#buttonColor);
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
    GameEvents(on) {
        if (this.#mouseMoveEvent == null) {
            this.#mouseMoveEvent = this.#recordMousePosition.bind(this);
        }

        if (this.#keyPressEvent == null) {
            this.#keyPressEvent = this.#keyPress.bind(this);
        }

        if (on) {
            if (this.#windowInput) {
                window.addEventListener('mousemove', this.#mouseMoveEvent);
            }
            else {
                canvas.addEventListener('mousemove', this.#mouseMoveEvent);
            }

            document.addEventListener('keydown', this.#keyPressEvent);
        }
        else {
            if (this.#windowInput) {
                window.removeEventListener('mousemove', this.#mouseMoveEvent);
            }
            else {
                canvas.removeEventListener('mousemove', this.#mouseMoveEvent);
            }

            if (gameManager.State != GameState.Paused) {
                document.removeEventListener('keydown', this.#keyPressEvent);
            }
        }
    }

    /** @override */
    Loop(timeDelta) {
        // move everything
        this.#moveEverything(timeDelta);
        // draw frame
        this.#drawFrame();
    }

    /** {@link Reset} First reset? */
    #firstReset = true;
    /** @override */
    Reset() {
        if (this.#firstReset) {
            this.#initializeCanvasProperties();

            // initial setup complete
            this.#firstReset = false;
        }

        // balls left
        this.#ballsLeft = this.#LIVES;

        this.#resetPlay();
    }

    /** Store ball coordinates for resize recalculation. */
    #storedBallCoords = [0, 0];
    /** @override */
    Resize(previousCanvas) {
        // store current ball position accounting for current padding
        this.#storedBallCoords[0] = this.#ballX - this.#xPadding;
        this.#storedBallCoords[1] = this.#ballY - this.#yPadding;

        // setup canvas based properties
        this.#initializeCanvasProperties();

        // recalc ball position with new paddings
        this.#ballX = this.#storedBallCoords[0] + this.#xPadding;
        this.#ballY = this.#storedBallCoords[1] + this.#yPadding;

        // move paddle relative to new screen size
        this.#paddleX = this.#paddleCheck(
            this.#paddleX / previousCanvas.width * canvas.width
        );
    }



// *********************** RESET AND INITIALIZATION FUNCTIONS ***************************
    #initializeCanvasProperties() {
        // padding to fit bricks to canvas
        this.#xPadding = ( canvas.width - ( this.#BRICK_WIDTH * this.#BRICK_COLS ) ) / 2;
        this.#yPadding = this.#BRICK_HEIGHT * 2;

        // initialize paddles
        if (this.#firstReset) {
            this.#paddleX = canvasCenter.x - this.#PADDLE_WIDTH / 2;
        }
        this.#paddleY = canvas.height - canvas.height / 10;
    }


    #resetPlay() {
        // fill pattern
        this.#fillBrickGrid( this.#Fill_Patterns['RANDOM'] );

        // ball
        this.#resetBall();
    }


    /** Reset ball position and speed. */
    #resetBall() {
        this.#ballX = this.#paddleX + this.#PADDLE_WIDTH / 2;
        this.#ballY = this.#paddleY - this.#BALL_RADIUS;
    
        this.#ballSpeedY = -this.#BALL_SPEED;
        this.#ballSpeedX = this.#BALL_SPEED * ( (Math.random() * 2) - 1 );
    }



// *********************************** GAME LOOP ****************************************
    /** {@link moveEverything} ball hit offset from paddle center */
    #deltaX = 0.0;
    /** {@link moveEverything} paddle rebound timeout */
    #hitTimer = 0;
    /**
     * Move objects, and test for collisions.
     * @param {number} timeDelta time since previous frame
     */
    #moveEverything(timeDelta) {
        this.#setPaddleX();
    
        // left edge check
        if (this.#ballX < MARGIN) {
            this.#ballX = MARGIN + 1;
            this.#ballSpeedX *= -1;
        }
        
        // right edge check
        if (this.#ballX > canvas.width - MARGIN) {
            this.#ballX = canvas.width - MARGIN - 1;
            this.#ballSpeedX *= -1;
        }
    
        // top edge check
        if (this.#ballY < MARGIN) {
            this.#ballY = MARGIN + 1;
            this.#ballSpeedY *= -1;
        }
    
        // bottom edge check
        if (this.#ballY > canvas.height - MARGIN) {
            this.#ballY = canvas.height - MARGIN;
            if (!this.#practice) {
                if (this.#ballsLeft > 0) {
                    this.#ballsLeft--;
                    this.#resetBall();
                }
                // TODO
                else { gameManager.GameOver(); }
            }
            else {
                this.#ballSpeedY *= -1;
            }
        }
    
        // if recently hit skip hit check
        if (this.#hitTimer > 0) {
            this.#hitTimer -= 1;
        }
        // else paddle bounce check
        else if (
            this.#ballY > this.#paddleY - MARGIN &&                          // top
            this.#ballY < this.#paddleY + this.#PADDLE_THICKNESS + MARGIN && // bottom
            this.#ballX > this.#paddleX - MARGIN &&                          // left
            this.#ballX < this.#paddleX + this.#PADDLE_WIDTH + MARGIN        // right
        ) {
            this.#ballSpeedY *= -1;
    
            // calculate paddle rebound
            this.#deltaX = this.#ballX - (this.#paddleX + this.#PADDLE_WIDTH / 2);
            this.#ballSpeedX +=
                (this.#deltaX / (this.#PADDLE_WIDTH / 2))
                * (this.#BALL_SPEED * this.#PADDLE_CURVE);
    
            // set timer
            this.#hitTimer = 2;
            this.#volleys++;
        }
    
        // if in brick grid bounds
        if (
            this.#ballX > this.#xPadding &&                                      // left
            this.#ballX < canvas.width - this.#xPadding &&                       // right
            this.#ballY > this.#yPadding &&                                      // top
            this.#ballY < this.#BRICK_HEIGHT * this.#BRICK_ROWS + this.#yPadding // bottom
        ) {
            // brick check
            this.#brickHitTest();
        }
    
        this.#ballSpeedX = this.#speedCheckX(this.#ballSpeedX);
    
        // and last
        // record frame position
        this.#ballLastX = this.#ballX;
        this.#ballLastY = this.#ballY;
        // move ball
        this.#ballX += this.#ballSpeedX * timeDelta;
        this.#ballY += this.#ballSpeedY * timeDelta;
    }
    
    
    /**
     * keeps ball from going too fast
     * @param {number} speed speed to check
     * @returns {number} clamped speed value
     */
    #speedCheckX = (speed) => {
        return (speed > this.#BALL_MAX_SPEED) ? this.#BALL_MAX_SPEED : speed;
    }
    
    
    /** Draw frame. */
    #drawFrame() {
        // background
        drawRect(0, 0, canvas.width, canvas.height, this.#fieldColor);
    
        // bricks
        if (this.#drawVisibleBricks(this.#brickColor) == 0) { this.#resetPlay(); }
    
        // paddle and center mark
        drawRect(
            this.#paddleX,
            this.#paddleY,
            this.#PADDLE_WIDTH,
            this.#PADDLE_THICKNESS,
            this.#paddleColor
        );

        if (this.#practice) {
            drawRect(
                this.#paddleX + this.#PADDLE_WIDTH / 2 - 1,
                this.#paddleY,
                2,
                this.#PADDLE_THICKNESS,
                this.#paddleCenter);
        }
    
        // ball
        drawCircle(this.#ballX, this.#ballY, this.#BALL_RADIUS, this.#ballColor);

        this.#drawLivesRemaining();
    }

    #drawLivesRemaining() {
        for (this.#i = this.#ballsLeft; this.#i > 0; this.#i--) {
            drawCircle(
                this.#i * this.#BALL_RADIUS * 3,
                canvas.height - this.#BALL_RADIUS * 2,
                this.#BALL_RADIUS,
                this.#ballColor
            );
        }
    }
    
    
    /** {@link brickHitTest} Current column. */
    #testColumn = 0;
    /** {@link brickHitTest} Current row. */
    #testRow = 0;
    /** {@link brickHitTest} Previous column. */
    #prevColumn = 0;
    /** {@link brickHitTest} Previous row. */
    #prevRow = 0;
    /** {@link brickHitTest} Edge hit? */
    #edgeHit = false;
    /** {@link brickHitTest} Adjacent brick hit?. */
    #adjacentHit = false;
    /**
     * Test ball position, damage brick/s if hit.
     * 
     * Reverses ball direction as necessary.
     * @param {number} pixelX - ball center X coordinate
     * @param {number} pixelY - ball center Y coordinate
     */
    #brickHitTest() {
        // get required coordinates
        this.#testColumn = this.#brickPixelToColumn(this.#ballX);
        this.#testRow = this.#brickPixelToRow(this.#ballY);
        this.#prevColumn = this.#brickPixelToColumn(this.#ballLastX);
        this.#prevRow = this.#brickPixelToRow(this.#ballLastY);
    
        // hit visible brick
        if (this.#brickIsActive(this.#testColumn, this.#testRow)) {
            this.#edgeHit = false;
    
            // top or bottom hit
            if (this.#prevColumn == this.#testColumn) {
                this.#ballSpeedY *= -1;
                this.#edgeHit = true;
                this.#damageBrick(this.#testColumn, this.#testRow);
            }
    
            // left or right side hit
            if (this.#prevRow == this.#testRow) {
                this.#ballSpeedX *= -1;
                this.#edgeHit = true;
                this.#damageBrick(this.#testColumn, this.#testRow);
            }
    
            // if neither: must be corner hit... ?
            if (!this.#edgeHit) {
                this.#adjacentHit = false;
    
                // rebound as top/bottom hit
                if (
                    this.#testAdjacencyX(this.#testColumn, this.#testRow, this.#prevColumn)
                ) {
                    this.#ballSpeedY *= -1;
                    this.#adjacentHit = true;
                    this.#damageBrick(this.#offsetColumn, this.#testRow);
                }
    
                // rebound as left/right side hit
                if (
                    this.#testAdjacencyY(this.#testColumn, this.#testRow, this.#prevRow)
                ) {
                    this.#ballSpeedX *= -1;
                    this.#adjacentHit = true;
                    this.#damageBrick(this.#testColumn, this.#offsetRow);
                }
    
                // if no adjacent bricks, glancing rebound
                if (!this.#adjacentHit) {
                    // TODO replace Math.abs -- alocation?
                    if (Math.abs(this.#ballSpeedY) > Math.abs(this.#ballSpeedX)) {
                        this.#ballSpeedY *= -1;
                    }
                    else {
                        this.#ballSpeedX *= -1;
                    }
    
                    this.#damageBrick(this.#testColumn, this.#testRow);
                }
            }
            
            // move ball outside of brick
            this.#ballX = this.#ballLastX;
            this.#ballY = this.#ballLastY;
        }
        // brick not visible, test diagonal crossing
        else if (
            this.#prevColumn != this.#testColumn &&
            this.#prevRow != this.#testRow
        ) {
            // if both bricks are active, 
            if (
                this.#testAdjacencyX(this.#testColumn, this.#testRow, this.#prevColumn) &&
                this.#testAdjacencyY(this.#testColumn, this.#testRow, this.#prevRow)
            ) {
                // rebound diagonally
                this.#ballSpeedY *= -1;
                this.#ballSpeedX *= -1;
    
                // move ball outside of brick
                this.#ballX = this.#ballLastX;
                this.#ballY = this.#ballLastY;
    
                // damage adjacent bricks, not hit brick
                this.#damageBrick(this.#offsetColumn, this.#testRow);
                this.#damageBrick(this.#testColumn, this.#offsetRow);
            }
        }
    }



// ********************************* INUPT FUNCTIONS ************************************
    /**
     * Stores mouse cursor X coordinate.
     * @param {Event} evt - mouse event
     */
    #recordMousePosition(evt) {
        if (this.#windowInput) {
            this.#mouseX = evt.screenX;
        }
        else {
            this.#mouseX = evt.clientX;
        }
    }


    /** Calculate paddle position for current frame. */
    #setPaddleX() {
        if (this.#mouseX) {
            if (this.#windowInput) {
                // map window X coordinate to canvas coordinate
                this.#paddleX = this.#paddleCheck(
                    ((this.#mouseX * canvas.width) / window.innerWidth) - this.#PADDLE_WIDTH / 2
                );
            }
            else {
                // account for: margins, canvas position on page, scroll position of page
                this.#paddleX = this.#paddleCheck(
                    this.#mouseX - rect.left - root.scrollLeft - this.#PADDLE_WIDTH / 2
                );
            }
        }
    }


    /**
     * Keep paddle on screen by clamping X coordinate.
     * @param {number} xCoordinate coordinate to clamp
     * @returns {number} clamped coordinate
     */
    #paddleCheck = (xCoordinate) => {
        return (xCoordinate < 0) ? 0
            : (xCoordinate > canvas.width - this.#PADDLE_WIDTH) ?
                canvas.width - this.#PADDLE_WIDTH
                : xCoordinate;
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



// ****************************** BRICK DRAW FUNCTIONS **********************************
    // drawVisibleBricks variables
    /** Brick index. Used by {@link drawVisibleBricks} */
    #brick = 0;
    /** Counter for number of bricks drawn. Used by {@link drawVisibleBricks} */
    #bricksDrawn = 0;
    /**
     * Draw visible bricks on screen.
     * @param {string} color - color for bricks
     * @returns {number} number of bricks drawn
     */
    #drawVisibleBricks(color) {
        this.#bricksDrawn = 0;

        for (this.#brick = 0; this.#brick < this.#brickGrid.length; this.#brick++) {
            if (this.#brickGrid[this.#brick] > 0) {

                this.#drawBrick(
                    this.#brickIndexToColumn(this.#brick),
                    this.#brickIndexToRow(this.#brick),
                    color,
                    this.#brickGrid[this.#brick] / this.#BRICK_HP
                );

                this.#bricksDrawn++;
            }
        }

        return this.#bricksDrawn;
    }


    /**
     * Draw a brick given X and Y grid coords: 
     * ( ie [0,0] or [12,7] )
     * 
     * This function handles pixel position calculation.
     * 
     * @param {number} X - grid X coordinate (column)
     * @param {number} Y - grid Y coordinate (row)
     * @param {string} color - color for brick
     * @param {number?} alpha - transparency
     */
    #drawBrick(X, Y, color, alpha = 0.9) {
        drawRect(
            ( X * this.#BRICK_WIDTH ) + this.#xPadding + this.#BRICK_GAP,  // topLeftX
            ( Y * this.#BRICK_HEIGHT ) + this.#yPadding + this.#BRICK_GAP, // topLeftY
            this.#BRICK_WIDTH - this.#BRICK_GAP * 2,                       // width
            this.#BRICK_HEIGHT - this.#BRICK_GAP * 2,                      // height
            color,
            alpha
        );
    }


    /** Pattern name strings for fillBrickGrid. */
    #Fill_Patterns = {
        FULL: 'FULL',
        RANDOM: 'RANDOM',
        TEST: 'TEST'
    }


    /**
     * Fill brick grid array.
     * 
     * @param {string} fillPattern which fill pattern
     */
    #fillBrickGrid(fillPattern) {
        switch (fillPattern) {
            case
                this.#Fill_Patterns['FULL']: {
                    this.#fullBrickGrid();
                }
                break;
            case
                this.#Fill_Patterns['RANDOM']: {
                    this.#randomizeBrickGrid();
                }
                break;
            case
                this.#Fill_Patterns['TEST']: {
                    this.#testPatternBrickGrid();
                }
                break;
        }
    }


    /** Initialize brickGrid with 1's. */
    #fullBrickGrid() {
        for (this.#i = 0; this.#i < this.#BRICK_COLS * this.#BRICK_ROWS; this.#i++) {
            // all bricks visible
            this.#brickGrid[this.#i] = this.#BRICK_HP;
        }
    }


    /** Shared index variable for brick fill loops. */
    #i = 0;
    /** Randomly initialize brickGrid. */
    #randomizeBrickGrid() {
        for (this.#i = 0; this.#i < this.#BRICK_COLS * this.#BRICK_ROWS; this.#i++) {
            // randomize bricks 0 or BRICK_HP
            this.#brickGrid[this.#i] = ( Math.random() < 0.35 ) ? this.#BRICK_HP : 0;
        }
    }


    /** Is brick to be active? */
    #drawBrickNow = true;
    /** brickGrid diagonal motion test pattern */
    #testPatternBrickGrid() {
        for (this.#i = 0; this.#i < this.#BRICK_COLS * this.#BRICK_ROWS; this.#i++) {
            if (this.#i % this.#BRICK_COLS == 0) {
                this.#drawBrickNow = toggleBool(this.#drawBrickNow);
            }

            this.#drawBrickNow = toggleBool(this.#drawBrickNow);

            // randomize bricks 0 or BRICK_HP
            this.#brickGrid[this.#i] = (this.#drawBrickNow) ? this.#BRICK_HP : 0;
        }
    }



// ********************************** BRICK FUNCTIONS ***********************************
    /**
     * Reduce HP of brick at index [x, y].
     * 
     * @param {number} column brick column
     * @param {number} row brick row
     */
    #damageBrick(column, row) {
        this.#brickGrid[this.#brickIndex(column, row)] -= 1;
        this.#bricksBroken++;
    }


    /**
     * Test if brick is visible.
     * @param {number} column brick column
     * @param {number} row brick row
     * @returns {boolean} true if visible
     */
    #brickIsActive = (column, row) => {
        if (
            // if coordinates are on grid
            column < this.#BRICK_COLS &&
            column >= 0 &&
            row < this.#BRICK_ROWS &&
            row >= 0
        ) {
            // is it active?
            return this.#brickGrid[column + this.#BRICK_COLS * row] > 0;
        }
        else {
            // not a brick
            return null;
        }
    }


    /**
     * Return brickGrid index.
     * @param {number} column brick column
     * @param {number} row brick row
     * @returns {number} array index
     */
    #brickIndex = (column, row) => column + this.#BRICK_COLS * row;


    /** 
     * Returns column index of pixel x coordinate.
     * @param {number} x pixel x coordinate
     * @returns {number} column number
     */
    #brickPixelToColumn = (x) => Math.floor((x - this.#xPadding) / this.#BRICK_WIDTH);


    /** 
     * Returns row index of pixel y coordinate.
     * @param {number} y pixel y coordinate
     * @returns {number} row number
     */
    #brickPixelToRow = (y) => Math.floor((y - this.#yPadding) / this.#BRICK_HEIGHT);


    /**
     * Convert brickGrid index to grid column.
     * @param {number} index brick index
     * @returns {number} brick column
     */
    #brickIndexToColumn = (index) => index % this.#BRICK_COLS;


    /**
     * Convert brickGrid index to grid column.
     * @param {number} index brick index
     * @returns {number} brick row
     */
    #brickIndexToRow = (index) => {
        return (index - (index % this.#BRICK_COLS)) / this.#BRICK_COLS;
    }


    /**
     * Converts array index to column and row.
     * 
     * **DEPRECATED** to avoid array creation.
     * 
     * Use {@link brickIndexToColumn} and {@link brickIndexToRow}
     * @param {number} index
     * @returns {number[]} [column, row]
     */
    #brickIndexToCoord = (index) => { return [
        index % this.#BRICK_COLS,                         // column
        (index - (index % this.#BRICK_COLS)) / this.#BRICK_COLS // row
    ];}



// ****************************** BRICK ADJACENCY TESTING *******************************

    /**
     * Offset column for adjacency testing.
     * 
     * Set by {@link testAdjacencyX}
     * 
     * which **MUST** be called before using this value.
     */
    #offsetColumn = 0;

    /**
     * Offset row for adjacency testing.
     * 
     * Set by {@link testAdjacencyY}
     * 
     * which **MUST** be called before using this value.
     */
    #offsetRow = 0;

    /** {@link testAdjacencyX} column offset raw value */
    #offsetX = 0;
    /** {@link testAdjacencyY} row offset raw value */
    #offsetY = 0;


    /**
     * Tests if adjacent brick on the X axis is active.
     * 
     * Sets {@link offsetColumn}
     * @param {number} column column of hit brick
     * @param {number} row row of hit brick
     * @param {number} prevColumn previous ballX column
     * @returns {boolean} true if brick is active
     */
    #testAdjacencyX = (column, row, prevColumn) => {
        this.#offsetX = prevColumn - column;
        this.#offsetColumn = column + (this.#offsetX / Math.abs(this.#offsetX));

        return this.#brickIsActive(this.#offsetColumn, row);
    }


    /**
     * Tests if adjacent brick on the Y axis is active.
     * 
     * Sets {@link offsetRow}
     * @param {number} column column of hit brick
     * @param {number} row row of hit brick
     * @param {number} prevRow previous ballY row
     * @returns {boolean} true if brick is active
     */
    #testAdjacencyY = (column, row, prevRow) => {
        this.#offsetY = prevRow - row;
        this.#offsetRow = row + (this.#offsetY / Math.abs(this.#offsetY));

        return this.#brickIsActive(column, this.#offsetRow);
    }
}

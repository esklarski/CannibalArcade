"use strict";
/**
 * GameManager
 * @class  Game manager for arcade system, simple but working.
 * @requires Game
 * @requires GameState
 * @property {string} {@link State} - current game state
 * @method {@link Start()} - start game manager
 * @method {@link LoadGame()} - load a new game
 * @method {@link ExitGame()} - exit to game select
 * @method {@link ResizeGame()} - triggered on canvas resize
 * @method {@link Title()} - set Title state
 * @method {@link Play()} - set Playing state
 * @method {@link Pause()} - set Paused state
 * @method {@link GameOver()} - set GameOver state
 * @method {@link ResetGame()} - trigger game reset
 */
class GameManager {
    /**
     * Bound copy of this.#execute().
     * 
     * @type {Function}
     */
    #gameLoop;

    /** @type {string} current game state */
    #gameState;

     /** {@link Game} currently loaded game */
    #game;



    /**
     * @constructor
     * {@link GameManager}
     */
    constructor() {
        this.#gameLoop = null;
        this.#gameState = GameState.Menu;
        this.#game = null;
    }


    /** @returns {string} current game state */
    get State() {
        return this.#gameState;
    }



    // ******************************** BASIC METHODS ***********************************
    /** Start arcade; draw game select screen. */
    Start() {
        this.#setState(GameState.Menu);
    }


    /**
     * load game
     * @param {Game} game
     */
    LoadGame(game) {
        // turn off events
        this.#gameMenuEvents(false);

        this.#game = game;

        // initialize game properties
        this.ResetGame();

        // start game
        this.Title();
    }


    /** Unload current game and return to game select. */
    ExitGame() {
        // ensure events turn off by forcing state change
        this.#gameState = GameState.Menu;

        // turn off all events
        this.#game.UiEvents(false);
        this.#game.GameEvents(false);

        // null current game
        this.#game = null;

        // go to menu screen
        this.Start();
    }


    /** 
     * Trigger when canvas resized.
     * 
     * @param {Object} previousCanvas {width: x, height: y}
     */
    ResizeGame(previousCanvas) {
        // if game is loaded
        if (this.#game != null) {
            // if playing, pause game
            if (this.#gameState == GameState.Playing) {
                this.#setState(GameState.Paused);
            }

            // trigger game resize
            this.#game.Resize(previousCanvas);
        }

        // redraw ui
        this.#drawUI();
    }



    // ******************************** STATE CHANGES ***********************************
    // public state selectors
    /** {@link Title} - set GameState.Title */
    Title() { this.#setState(GameState.Title); }

    /** {@link Play} - set GameState.Playing */
    Play() { this.#setState(GameState.Playing); }

    /** {@link Pause} - toggles paused/playing states */
    Pause() {
        if (this.#gameState == GameState.Playing) {
            this.#setState(GameState.Paused);
        }
        else if (this.#gameState == GameState.Paused) {
            this.#setState(GameState.Playing);
        }
    }

    /** {@link GameOver} - set GameState.GameOver */
    GameOver() { this.#setState(GameState.GameOver) }

    /** {@link ResetGame} - reset gameplay properties */
    ResetGame() { this.#game.Reset() }



    /** 
     * set new state
     * @param {string} newState
     */
    #setState(newState) {
        if (GameState.hasOwnProperty(newState)) {
            this.#gameState = newState;

            switch (this.#gameState) {
                case
                    GameState.Playing: {
                        this.#game.GameEvents(true);
                        this.#game.UiEvents(false);
    
                        this.#startGame();
                    }
                    break;
                case
                    GameState.Menu: {
                        this.#gameMenuEvents(true);
                    }
                    break;
                case
                    GameState.Title:
                case
                    GameState.Paused:
                case
                    GameState.GameOver: {
                        this.#game.GameEvents(false);
                        this.#game.UiEvents(true);
                    }
                    break;
            }
        }
    
        this.#drawUI();
    }



    // ********************************** MAIN LOOP *************************************
    /** Time passed since last frame. */
    #timeDelta = 0;
    /** Previous timeStamp. */
    #lastTimeStamp = 0;
    /**
     * Main logic loop.
     * 
     * @param {number} timeStamp current time stamp
     */
    #execute(timeStamp) {
        if (this.#gameState == GameState.Playing) {
            // track frame time
            this.#timeDelta = (timeStamp - this.#lastTimeStamp) / 1000;
            this.#lastTimeStamp = timeStamp;

            this.#game.Loop(this.#timeDelta);
            window.requestAnimationFrame(this.#gameLoop);
        }
        else {
            this.#stopGame();
            this.#drawUI();
        }
    }



    // ***************************** GAME LOOP CONTROL **********************************
    /** start render cycle */
    #startGame() {
        this.#gameLoop = this.#execute.bind(this);
        this.#lastTimeStamp = performance.now();
        window.requestAnimationFrame(this.#gameLoop);
    }


    /** stop rendering */
    #stopGame() {
        this.#gameLoop = null;
    }



    // ************************************* drawUI *************************************
    /** Draw UI screens. */
    #drawUI() {
        switch (this.#gameState) {
            case
                GameState.Menu: { this.#drawGameMenu(); }
                break;
            case
                GameState.Title: {
                    if (this.#game.TitleScreen() == false) {
                        this.#setState(GameState.Playing);
                    }
                }
                break;
            case
                GameState.Paused: {
                    if (this.#game.PauseOverlay() == false) {
                        this.ExitGame();
                    }
                }
                break;
            case
                GameState.GameOver: {
                    if (this.#game.GameOverScreen() == false) {
                        this.ExitGame();
                    }
                }
                break;
        }
    }
    


    // ***************************** GAME MENU SCREEN ***********************************
    /** @type {Function} */
    #menuEvent = null;
    /** toggle game menu events */
    #gameMenuEvents(on) {
        if (this.#menuEvent == null) {
            this.#menuEvent = this.#selectGame.bind(this);
        }

        if (on) {
            canvas.addEventListener('mousedown', this.#menuEvent);
        }
        else {
            canvas.removeEventListener('mousedown', this.#menuEvent);
        }
    }


    /**
     * game menu event handler
     * @param {Event} evt
     */
    #selectGame(evt) {
        let mousePos = calculateMousePosition(evt);

        if (isInButton(mousePos, buttonLge7)) { gameManager.LoadGame( new GoPongYourself() ); return; }
        if (isInButton(mousePos, buttonLge8)) { gameManager.LoadGame( new SomeTennisGame() ); return; }
        if (isInButton(mousePos, buttonLge9)) { gameManager.LoadGame( new BreakBricks() ); return; }
        // choose this:
        if (isInButton(mousePos, buttonLge10)) { toggle4 = toggleBool(toggle4); }
        // or this: (to load minimum example)
        // if (isInButton(mousePos, buttonLge10)) { gameManager.LoadGame( new MinimumExample() ); return; }

        this.#drawGameMenu();
    }


    /** draw game select menu */
    #drawGameMenu() {
        // colors
        let GREY = Luxury['GREY'];
        let SALMON = Luxury['SALMON'];
        let MIDNIGHT = Luxury['MIDNIGHT'];
        let BLACK = Luxury['BLACK'];
        let BEIGE = Luxury['BEIGE'];

        drawRect(0, 0, canvas.width, canvas.height, MIDNIGHT);

        // title
        drawText('Welcome to', canvasCenter.x, 60, SALMON, 'center', LARGE_FONT);
        drawText('the', canvasCenter.x - 250, 90, SALMON, 'center', SMALL_FONT);
        drawText('Cannibal Arcade', canvasCenter.x, 140, SALMON, 'center', LARGE_FONT);

        // click to play
        drawText("Choose your game.", canvasCenter.x, 220, GREY, 'center');

        // buttons
        canvasContext.drawImage(
            imgGPY, canvasCenter.x + buttonLge7.x, canvasCenter.y + buttonLge7.y);
        canvasContext.drawImage(
            imgSTG, canvasCenter.x + buttonLge8.x, canvasCenter.y + buttonLge8.y);
        canvasContext.drawImage(
            imgBB, canvasCenter.x + buttonLge9.x, canvasCenter.y + buttonLge9.y);
        drawButton(buttonLge10,
            'Coming Maybe', toggle4 ? BEIGE : BLACK, toggle4 ? SALMON : MIDNIGHT);
    }
}

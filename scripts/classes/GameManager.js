"use strict";
/**
 * GameManager
 * @class  Game manager for arcade system, simple but working.
 * @requires Game
 * @requires GameState
 * @property {string} State - current game state
 * @property {number} Interval - frame interval in ms
 * @method Title()
 */
class GameManager {
    /** @type {number} Target fps. */
    static TARGET_FPS = 59; // for some reason 59 seems smoother than 60

    /** @type {number} frame time in ms */
    #frameInterval;

    /** @type {number} store interval id */
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
        this.#frameInterval = Math.ceil(1000 / GameManager.TARGET_FPS);
        this.#gameLoop = null;
        this.#gameState = GameState.Title;
        this.#game = null;
    }



    // ******************************** BASIC METHODS ***********************************
    /** start arcade: draw game select screen */
    Start() {
        this.#setState(GameState.Menu);
    }


    /**
     * load game
     * @param {Game} game
     */
    LoadGame(game) {
        // turn off evenets
        this.#gameMenuEvents(false);

        this.#game = game;

        // initialize game properties
        this.ResetGame();

        // start game
        this.Title();
    }


    /** unload current game and return to game select */
    ExitGame() {
        // turn off evenets
        this.#game.UiEvents(false);

        // null current game
        this.#game = null;

        // go to menu screen
        this.Start();
    }


    /** @returns {string} current game state */
    get State() {
        return this.#gameState;
    }


    /** @returns {number} frame interval in ms */
    get Interval() {
        return this.#frameInterval;
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
        this.#gameState = newState;

        if (this.#gameState == GameState.Title || this.#gameState == GameState.Playing || this.#gameState == GameState.Menu) {
            this.#execute();
        }
    }



    // ********************************** MAIN LOOP *************************************
    /** main logic loop */
    #execute() {
        switch (this.#gameState) {
            case
                GameState.Menu: {
                    this.#gameMenuEvents(true);
                    this.#drawGameMenu();
                }
                break;
            case
                GameState.Title: {
                    this.#game.GameEvents(false);
                    this.#game.UiEvents(true);

                    this.#game.TitleScreen();
                }
                break;
            case
                GameState.Playing: {
                    if (this.#gameLoop == null) {
                        this.#game.GameEvents(true);
                        this.#game.UiEvents(false);

                        this.#startGame();
                    }
                    else {
                        this.#game.Loop();
                    }
                }
                break;
            case
                GameState.Paused: {
                    this.#game.GameEvents(false);
                    this.#game.UiEvents(true);

                    this.#game.PauseOverlay();
                    this.#stopGame();
                }
                break;
            case
                GameState.GameOver: {
                    this.#game.GameEvents(false);
                    this.#game.UiEvents(true);

                    this.#game.GameOverScreen();
                    this.#stopGame();
                }
                break;
        }
    }



    // ***************************** GAME LOOP CONTROL **********************************
    /** start render cycle */
    #startGame() {
        let loop = this.#execute.bind(this);
        this.#gameLoop = setInterval(
            loop,
            this.#frameInterval
        );
    }


    /** stop rendering */
    #stopGame() {
        clearInterval(this.#gameLoop);
        this.#gameLoop = null;
    }
    


    // ***************************** GAME MENU SCREEN ***********************************
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
        var mousePos = calculateMousePosition(evt);

        if (isInButton(mousePos, buttonLge7)) { gameManager.LoadGame(GAMES.GoPongYourself); return; }
        if (isInButton(mousePos, buttonLge8)) { gameManager.LoadGame(GAMES.SomeTennisGame); return; }
        if (isInButton(mousePos, buttonLge9)) { toggle3 = toggleState(toggle3); }
        if (isInButton(mousePos, buttonLge10)) { toggle4 = toggleState(toggle4); }

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

        colorRect(0, 0, canvas.width, canvas.height, MIDNIGHT);

        // title
        colorText('Welcome to', canvasCenter.x, 60, SALMON, 'center', LARGE_FONT);
        colorText('the', canvasCenter.x - 250, 90, SALMON, 'center', SMALL_FONT);
        colorText('Cannibal Arcade', canvasCenter.x, 140, SALMON, 'center', LARGE_FONT);

        // click to play
        colorText("Choose your game.", canvasCenter.x, 220, GREY, 'center');

        // buttons
        canvasContext.drawImage(
            imgGPY, canvasCenter.x + buttonLge7.x, canvasCenter.y + buttonLge7.y);
        canvasContext.drawImage(
            imgSTG, canvasCenter.x + buttonLge8.x, canvasCenter.y + buttonLge8.y);
        drawButton(buttonLge9,
            'Coming Later', toggle3 ? BEIGE : BLACK, toggle3 ? SALMON : MIDNIGHT);
        drawButton(buttonLge10,
            'Coming Maybe', toggle4 ? BEIGE : BLACK, toggle4 ? SALMON : MIDNIGHT);
    }
}

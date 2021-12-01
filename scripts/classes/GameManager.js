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
    #frameInterval = Math.ceil(1000 / GameManager.TARGET_FPS);

    /** @type {number} store interval id */
    #gameLoop = null;

    /** @type {string} current game state */
    #gameState = GameState.Title;

     /** {@link Game} currently loaded game */
    #game;


    /**
     * @constructor
     * {@link GameManager}
     */
     constructor() {  }

     /**
      * load game
      * @param {Game} game
      */
     LoadGame(game) {
         this.#game = game;
 
         // initialize game properties
         this.ResetGame();
     
         // start game
         this.Title();
     }


    /** @returns {string} current game state */
    get State() {
        return this.#gameState;
    }

    /** @returns {number} frame interval in ms */
    get Interval() {
        return this.#frameInterval;
    }


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

        if (this.#gameState == GameState.Title || this.#gameState == GameState.Playing) {
            this.#execute();
        }
    }


    /** main logic loop */
    #execute() {
        switch (this.#gameState) {
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
 }

"use strict";
/**
 * Base definition for {@link Game}. Requires extension.
 * @method {@link TitleScreen()}
 * @method {@link UiEvents()}
 * @method {@link Loop()}
 * @method {@link GameEvents()}
 * @method {@link PauseOverlay()}
 * @method {@link GameOverScreen()}
 * @method {@link Reset()}
*/
class Game {
    /** Game Title */
    #gameTitle;


    /**
     * {@link Game}
     * @param {string} title game title
     */
    constructor(title) {
        this.#gameTitle = title;
    }


    /** Game title. */
    get Title() {
        return this.#gameTitle;
    }

    toString() {
        return this.#gameTitle;
    }


    // ************************ GAME SCREENS ************************
    // virtual methods - must be overridden
    /**
     * {@link TitleScreen} - draw title screen
     */
    TitleScreen() { return false; }

    /**
     * {@link PauseOverlay} - draw pause overlay
     */
    PauseOverlay() { return false; }
    
    /**
     * {@link GameOverScreen} - draw gameover screen
     */
    GameOverScreen() { return false; }


    // *************************** EVENTS ***************************
    // virtual methods - must be overridden
    /**
     * {@link UiEvents} - toggle ui events on/off
     * @param {boolean} on
     */
    UiEvents(on) { return false; }

    /**
     * {@link GameEvents} - toggle game events on/off
     * @param {boolean} on
     */
    GameEvents(on) { return false; }


    // ************************* GAME LOOP **************************
    // virtual methods - must be overridden
    /**
     * {@link Loop} - main game logic loop
     */
    Loop() { return false; }

    /**
     * {@link Reset} - reset game parameters
     */
    Reset() { return false; }


    // *************************** RESIZE ***************************
    // virtual methods - must be overridden
    /**
     * {@link Resize} - recalculate canvas based properties
     * 
     * @param {number[]} previousCanvas [canvas.width, canvas.height]
     */
    Resize(previousCanvas) { return false; }
}

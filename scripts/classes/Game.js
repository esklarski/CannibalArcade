"use strict";
/**
 * Base definition for {@link Game}. Requires extension.
 * @method {@link TitleScreen}
 * @method {@link UiEvents}
 * @method {@link Loop}
 * @method {@link GameEvents}
 * @method {@link PauseOverlay}
 * @method {@link GameOverScreen}
 * @method {@link Reset}
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
    TitleScreen() { return null; }

    /**
     * {@link PauseOverlay} - draw pause overlay
     */
    PauseOverlay() { return null; }
    
    /**
     * {@link GameOverScreen} - draw gameover screen
     */
    GameOverScreen() { return null; }


    // *************************** EVENTS ***************************
    // virtual methods - must be overridden
    /**
     * {@link UiEvents} - toggle ui events on/off
     * @param {boolean} on
     */
    UiEvents(on) { return null; }

    /**
     * {@link GameEvents} - toggle game events on/off
     * @param {boolean} on
     */
    GameEvents(on) { return null; }


    // ************************* GAME LOOP **************************
    // virtual methods - must be overridden
    /**
     * {@link Loop} - main game logic loop
     */
    Loop() { return null; }

    /**
     * {@link Reset} - reset game parameters
     */
    Reset() { return null; }


    // *************************** RESIZE ***************************
    // virtual methods - must be overridden
    /**
     * {@link Resize} - recalculate canvas based properties
     */
    Resize() { return null; }
}

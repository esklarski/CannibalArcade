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

    // virtual methods - must be overridden
    /**
     * {@link TitleScreen} - draw title screen
     */
    TitleScreen() { return null; }
    
    /**
     * {@link UiEvents} - toggle ui events on/off
     * @param {boolean} on
     */
    UiEvents(on) { return null; }
    
    /**
     * {@link Loop} - main game logic loop
     */
    Loop() { return null; }

    /**
     * {@link GameEvents} - toggle game events on/off
     * @param {boolean} on
     */
    GameEvents(on) { return null; }

    /**
     * {@link PauseOverlay} - draw pause overlay
     */
    PauseOverlay() { return null; }
    
    /**
     * {@link GameOverScreen} - draw gameover screen
     */
    GameOverScreen() { return null; }

    /**
     * {@link Reset} - reset game parameters
     */
    Reset() { return null; }

    /**
     * {@link Game}
     * @param {string} title game title
     */
    constructor(title) {
        this.#gameTitle = title;
    }

    /**
     * get game title
     */
    get Title() {
        return this.#gameTitle;
    }

    toString() {
        return this.#gameTitle;
    }
}

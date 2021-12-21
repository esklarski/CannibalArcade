"use strict";
// ******************************* MINIMUM GAME EXAMPLE *********************************
/**
 * @author Evan Sklarski <esklarski@gmail.com>
 * @version 0.2
 * @see {@link - https://esklarski.github.io/CannibalArcade/}
 */

/**
 * {@link Game}: MinimumExample
 * @extends Game
 */
class MinimumExample extends Game {
    // colors
    #LIGHTPINK = DisneylandParisCastle["LIGHTPINK"];
    #DARKPINK = DisneylandParisCastle["DARKPINK"];
    #LIGHTBLUE = DisneylandParisCastle["LIGHTBLUE"];
    #DARKBLUE = DisneylandParisCastle["DARKBLUE"];
    #BROWN = DisneylandParisCastle["BROWN"];

    /** Game Title - Some Tennis Game */
    static #TITLE = "Minimum Game Base";

    // storage for event listener functions
    /** @type {Function} store bound function */
    #mouseClickEvent = null;
    /** @type {Function} store bound function */
    #mouseMoveEvent = null;
    /** @type {Function} keyPressEvent bound function */
    #keyPressEvent = null;



    constructor() {
        super(MinimumExample.#TITLE);
    }



    // ******************************* REQUIRED OVERRIDES *******************************
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
        this.#calculateFrame(timeDelta);
        // draw frame
        this.#drawFrame();
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



    // ****************************** EVENT FUNCTIONS ***********************************
    #mousePos = { x: 0, y: 0 };
    /**
     * on 'mousemove' event handler
     * @param {Event} evt
     */
     #recordMousePosition(evt) {
        this.#mousePos.x = evt.clientX;
        this.#mousePos.y = evt.clientY;
    }

    #mouseClickPos = { x: 0, y: 0 };
    /**
     * on 'mousedown' event handler
     * @param {Event} evt
     */
     #mouseClick(evt) {
        this.#mouseClickPos = calculateMousePosition(evt);

        switch (gameManager.State) {
            case
                GameState.Title: {
                    //
                }
                break;

            case
                GameState.Playing: {
                    //
                }
                break;

            case
                GameState.Paused: {
                    //
                }
                break;

            case
                GameState.GameOver: {
                    //
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
    // game loop
    #calculateFrame(timeDelta) {
        //
    }

    #drawFrame() {
        drawRect(0, 0, canvas.width, canvas.height, this.#DARKBLUE);

        drawCircle(
            this.#mousePos.x - rect.left - root.scrollLeft,
            this.#mousePos.y - rect.top - root.scrollTop,
            20,
            this.#DARKPINK
        );
    }
}

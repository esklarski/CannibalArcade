"use strict";
// ******************************** Cannibal Arcade v0.1 ********************************
/**
 * @author Evan Sklarski <esklarski@gmail.com>
 * @version 0.1
 * @see {@link - https://esklarski.github.io/CannibalArcade/}
 */
// A growing collection of simple html5 canvas games.
// Games:
// Go Pong Yourself
// Some Tennis Game (coming soon)
// **************************************************************************************

/** debug mode? */
let testScreen = false;

/** small font */
const SMALL_FONT = "20px Veranda";
/** standard font */
const FONT = "30px Veranda";
/** large font */
const LARGE_FONT = "60px Veranda";

/** 
 * store 2D x,y coordinate
 * @typedef {Object} Coordinate
 * @property {number} x - x coordinate
 * @property {number} y - y coordinate
 */



// ********************************* CANVAS PROPERTIES **********************************

const MARGIN = 5;

/** @type {HTMLElement} */
let canvas;

/** @type {CanvasRenderingContext2D} */
let canvasContext;

/**
 * @type {Coordinate} canvas center coordinate
 */
let canvasCenter = {
    x: 0,
    y: 0,
}

// mouse input elements
/** @type {DOMRect} */
let rect;

/** @type {HTMLElement} */
let root;



// *********************************** GAME MANAGER *************************************

/**
 * @type {GameManager}
 * {@link GameManager}
 */
let gameManager;

/**
 * available games
 * @type {Game[]}
 */
const GAMES = {
    GoPongYourself: new GoPongYourself(),
    // SomeTennisGame: new SomeTennisGame();
}



// ********************************** INITIALIZATION ************************************

/** initiate game on page load */
window.onload = function () {
    console.log("Welcome to the arcade!");

    // setup canvas element
    initialize();

    if (testScreen) {
        // choose test ui
        drawTestScreen( TEST_SCREENS["corner"] );
    }
    else {
        gameMenu();

        // should be:
        // gameManager.Start();
    }
}

/** initialize canvas */
function initialize() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    canvasCenter = {
        x: canvas.width / 2,
        y: canvas.height / 2,
    };
    rect = canvas.getBoundingClientRect();
    root = document.documentElement;

    gameManager = new GameManager();
}

// window.onresize = function () {
//     // TODO
//     // size canvas to screen and accomadate resizing
// }



// ********************************* SUPPORT FUNCTIONS **********************************

/**
 * returns mouse cursor coordinates
 * @param {Event} evt - mouse event
 * @returns {Coordinate} {@link Coordinate}
 */
function calculateMousePosition(evt) {
    // account for: margins, canvas position on page, scroll position of page
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;

    // return mouse position
    return { x: mouseX, y: mouseY };
}



// ************************************* GAME MENU **************************************
// TODO: move this into GameManager class


/**
 * load a game to play
 * @param {Game} game
 */
function loadGame(game) {
    // turn off evenets
    gameMenuEvents(false);

    // start game
    gameManager.LoadGame(game);
}


/** exit current game, return to game select */
function exitGame() {
    gameMenu();
}

/** load game select menu */
function gameMenu() {
    gameMenuEvents(true);
    drawGameMenu();
}


/** toggle game menu events */
function gameMenuEvents(on) {
    if (on) {
        canvas.addEventListener('mousedown', selectGame);
    }
    else {
        canvas.removeEventListener('mousedown', selectGame);
    }
}


/**
 * game menu event handler
 * @param {Event} evt
 */
function selectGame(evt) {
    var mousePos = calculateMousePosition(evt);

    if (isInButton(mousePos, buttonLge7)) { loadGame(GAMES.GoPongYourself); return; }
    if (isInButton(mousePos, buttonLge8)) { toggle2 = toggleState(toggle2); }
    if (isInButton(mousePos, buttonLge9)) { toggle3 = toggleState(toggle3); }
    if (isInButton(mousePos, buttonLge10)) { toggle4 = toggleState(toggle4); }

    drawGameMenu();
}


/** draw game select menu */
function drawGameMenu() {
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
    drawButton(buttonLge8,
        'Coming Soon', toggle2 ? BEIGE : BLACK, toggle2 ? SALMON : MIDNIGHT);
    drawButton(buttonLge9,
        'Coming Later', toggle3 ? BEIGE : BLACK, toggle3 ? SALMON : MIDNIGHT);
    drawButton(buttonLge10,
        'Coming Maybe', toggle4 ? BEIGE : BLACK, toggle4 ? SALMON : MIDNIGHT);
}

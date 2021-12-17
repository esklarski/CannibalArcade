"use strict";
// ******************************** Cannibal Arcade v0.1 ********************************
/**
 * @author Evan Sklarski <esklarski@gmail.com>
 * @version 0.1
 * @see {@link - https://esklarski.github.io/CannibalArcade/}
 */
// A growing collection of simple html5 canvas games.
// Games:
//   - Go Pong Yourself
//   - Some Tennis Game
//
// TODO move basic events (mouse) into index.js as opposed to in each game.
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
        gameManager.Start();
    }
}

/** initialize canvas */
function initialize() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    sizeCanvas();

    gameManager = new GameManager();
}

function sizeCanvas() {
    let framePadding = (window.innerWidth > window.innerHeight)
        ? window.innerHeight / 10
        : window.innerWidth / 10;

    canvas.width = window.innerWidth - framePadding;
    canvas.height = window.innerHeight - framePadding;
    canvasCenter = {
        x: canvas.width / 2,
        y: canvas.height / 2,
    };

    rect = canvas.getBoundingClientRect();
    root = document.documentElement;
}

window.onresize = function () {
    // store previous canvas dimensions
    let previousCanvas = [canvas.width, canvas.height];

    // reset things here
    sizeCanvas();

    gameManager.ResizeGame(previousCanvas);
}



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

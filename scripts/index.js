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
//   - Break Bricks
//
// TODO move basic events (mouse) into index.js as opposed to in each game?
// TODO enforce an aspect ration on cavans, sizing to window doesn't work with all games
// **************************************************************************************

/** debug mode? */
let testScreen = false;
let resizable = false;

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

    gameManager = new GameManager();

    // resize disabled for now, need to adjust UI layout system...
    if (resizable) {
        window.addEventListener('resize', resize);
        resizeCanvas();
    }
    else {
        setCanvasSize();
    }
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


// Do I need this?
// const MIN_CANVAS_WIDTH = 1000;
// const MIN_CANVAS_HEIGHT = 750;
function resizeCanvas() {
    if (!resizable) return;
    
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    let ratio = gameManager.Ratio; // Ratio.FourByThree;

    if (width > height * ratio) {
        canvas.height = Math.floor(height * 0.9);
        canvas.width = Math.floor(canvas.height * ratio);
    }
    else {
        canvas.width = Math.floor(width * 0.9);
        canvas.height = Math.floor(canvas.width / ratio);
    }

    setCanvasSize();
}

function setCanvasSize() {
    canvasCenter = {
        x: canvas.width / 2,
        y: canvas.height / 2,
    };

    rect = canvas.getBoundingClientRect();
    root = document.documentElement;
}


function resize(evt) {
    // store previous canvas dimensions
    let previousCanvas = { width: canvas.width, height: canvas.height };

    // resize to window
    resizeCanvas();

    // reset things here
    // setCanvasSize();

    // trigger resize in game
    gameManager.ResizeGame(previousCanvas);
}

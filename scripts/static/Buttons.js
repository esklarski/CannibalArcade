"use strict"
// ********************************* BUTTON FUNCTIONS ***********************************

/**
 * Test if coordinates are within {@link Button} bounds.
 * @param {Coordinate} mousePos {@link Coordinate}
 * @param {Button} button {@link Button}
 */
 function isInButton(mousePos, button) {
    let clicked = false;

    if ( mousePos.x > canvasCenter.x +  button.x                    // button left
      && mousePos.x < canvasCenter.x + (button.x + button.width)    // button right
      && mousePos.y > canvasCenter.y +  button.y                    // button top
      && mousePos.y < canvasCenter.y + (button.y + button.height))  // button bottom
    {
        clicked = true;
    }
 
    return clicked;
}

/**
 * toggle button state (on/off)
 * @param {boolean} toggle
 * @returns {boolean}
 */
const toggleState = toggle => (toggle) ? false : true;

// generic toggles to store button state/s
let toggle1 = false, toggle2 = false, toggle3 = false,
    toggle4 = false, toggle5 = false, toggle6 = false;



// ************************************* BUTTONS ****************************************

/**
 * predefined button parameters
 * @typedef {Object} Button
 * @property {number} x - X coordinate offset from screen center
 * @property {number} y - Y coordinate offset from screen center
 * @property {number} width - button width
 * @property {number} height - button height
 * @property {number} txtX - X coordinate offset from screen center
 * @property {number} txtY - Y coordinate offset from screen center
 * @property {boolean} on - toggle to store on/off state
 */

// *********************** 3x2 Layout ***********************//
//                                                           //
//                                                           //
//                                                           //
//                                                           //
//               [button1] [button2] [button3]               //
//               [button4] [button5] [button6]               //
//                                                           //
//                                                           //
//                                                           //
// **********************************************************//
// button2 is at screen center

/**
 * @type {Button}
 * top left {@link Button}
 */
const button1 = { x: -260, y: -25, width: 160, height: 50, txtX: -180, txtY: 10 };
/** 
 * @type {Button}
 * top middle {@link Button}
 */
const button2 = { x: -80, y: -25, width: 160, height: 50, txtX: 0, txtY: 10 };
/** 
 * @type {Button}
 * top right {@link Button}
 */
const button3 = { x: 100, y: -25, width: 160, height: 50, txtX: 180, txtY: 10 };
/** 
 * @type {Button}
 * bottom left {@link Button}
 */
const button4 = { x: -260, y: 45, width: 160, height: 50, txtX: -180, txtY: 80 };
/** 
 * @type {Button}
 * bottom middle {@link Button}
 */
const button5 = { x: -80, y: 45, width: 160, height: 50, txtX: 0, txtY: 80 };
/** 
 * @type {Button}
 * bottom right {@link Button}
 */
const button6 = { x: 100, y: 45, width: 160, height: 50, txtX: 180, txtY: 80 };



// ********************* 3x2 Lge Layout *********************//
//                                                           //
//                                                           //
//  _________________  _________________  _________________  //
//  [               ]  [               ]  [               ]  //
//  [   buttonLge1  ]  [  buttonGame2  ]  [  buttonGame3  ]  //
//  [_______________]  [_______________]  [_______________]  //
//  [               ]  [               ]  [               ]  //
//  [  buttonGame4  ]  [  buttonGame5  ]  [  buttonGame6  ]  //
//  [_______________]  [_______________]  [_______________]  //
// **********************************************************//
// 300px x 225px 4:3
// button2 is at screen center

/**
 * @type {Button}
 * top left game {@link Button}
 */
const buttonLge1 = { x: -460, y: -120, width: 300, height: 225, txtX: -310, txtY: 10 };
/**
 * @type {Button}
 * top middle game {@link Button}
 */
const buttonLge2 = { x: -150, y: -120, width: 300, height: 225, txtX: 0, txtY: 10 };
/**
 * @type {Button}
 * top right game {@link Button}
 */
const buttonLge3 = { x: 160, y: -120, width: 300, height: 225, txtX: 310, txtY: 10 };
/**
 * @type {Button}
 * bottom left game {@link Button}
 */
const buttonLge4 = { x: -460, y: 115, width: 300, height: 225, txtX: -310, txtY: 240 };
/**
 * @type {Button}
 * bottom middle game {@link Button}
 */
const buttonLge5 = { x: -150, y: 115, width: 300, height: 225, txtX: 0, txtY: 240 };
/**
 * @type {Button}
 * bottom right game {@link Button}
 */
const buttonLge6 = { x: 160, y: 115, width: 300, height: 225, txtX: 310, txtY: 240 };



// ********************* 2x2 Lge Layout *********************//
//                                                           //
//                                                           //
//            _________________  _________________           //
//            [               ]  [               ]           //
//            [   buttonLge7  ]  [   buttonLge8  ]           //
//            [_______________]  [_______________]           //
//            [               ]  [               ]           //
//            [   buttonLge9  ]  [  buttonLge10  ]           //
//            [_______________]  [_______________]           //
// **********************************************************//
// 300px x 225px 4:3
// centered on screen center
/**
 * top left {@link Button}
 * @type {Button}
 */
const buttonLge7 = { x: -305, y: -120, width: 300, height: 225, txtX: -155, txtY: 10 };
/**
 * top right {@link Button}
 * @type {Button}
 */
const buttonLge8 = { x: 5, y: -120, width: 300, height: 225, txtX: 155, txtY: 10 };
/**
 * bottom left {@link Button}
 * @type {Button}
 */
const buttonLge9 = { x: -305, y: 115, width: 300, height: 225, txtX: -155, txtY: 240 };
/**
 * bottom right {@link Button}
 * @type {Button}
 */
const buttonLge10 = { x: 5, y: 115, width: 300, height: 225, txtX: 155, txtY: 240 };



// *************************************** TODO *****************************************
// corner buttons

// ********************* 2x2 Lge Layout *********************//
//                                                           //
//  [buttonCorner1]                         [buttonCorner2]  //
//                                                           //
//                                                           //
//                                                           //
//                                                           //
//                                                           //
//  [buttonCorner3]                         [buttonCorner4]  //
//                                                           //
// **********************************************************//
// 200px x 50px 4:3
// centered on screen center
/**
 * @type {Button}
 * {@link Button}
 * top left corner
 */
const buttonCorner1 = { x: -460, y: -340, width: 200, height: 50, txtX: -360, txtY: -305 };
/**
 * @type {Button}
 * top right corner {@link Button}
 */
const buttonCorner2 = { x: 260, y: -340, width: 200, height: 50, txtX: 360, txtY: -305 };
/**
 * @type {Button}
 * bottom left game {@link Button}
 */
const buttonCorner3 = { x: -460, y: 290, width: 200, height: 50, txtX: -360, txtY: 325 };
/**
 * @type {Button}
 * bottom right corner {@link Button}
 */
const buttonCorner4 = { x: 260, y: 290, width: 200, height: 50, txtX: 360, txtY: 325 };

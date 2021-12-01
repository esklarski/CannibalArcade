"use strict";
// ********************** DRAW FUNCTIONS **********************

/**
 * draw {@link Button} on canvas
 * @param {Button} button
 * @param {string} text
 * @param {string} btnColor button color
 * @param {string} txtColor text color
 */
 function drawButton(button, text, btnColor, txtColor) {
    colorRect(canvasCenter.x + button.x, canvasCenter.y + button.y, button.width, button.height, btnColor);
    colorText(text, canvasCenter.x + button.txtX, canvasCenter.y + button.txtY, txtColor, 'center');
}


/**
 * draw rectangle on canvas
 * @param {number} topLeftX
 * @param {number} topLeftY
 * @param {number} boxWidth
 * @param {number} boxHeight
 * @param {string} fillColor
 */
function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}


/**
 * draw circle on canvas
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} radius
 * @param {string} fillColor
 */
function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}


/**
 * draw text on canvas
 * @param {string} text
 * @param {number} centerX
 * @param {number} centerY
 * @param {string} textColor
 * @param {string} ailignment
 * @param {boolean} [large] large text? Default: false.
 */
function colorText(text, centerX, centerY, textColor, alignment, font=FONT) {
    canvasContext.font = font;
    canvasContext.fillStyle = textColor;
    canvasContext.textAlign = alignment;
    canvasContext.fillText(text, centerX, centerY);
}

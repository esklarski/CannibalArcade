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
    drawRect(canvasCenter.x + button.x, canvasCenter.y + button.y, button.width, button.height, btnColor);
    drawText(text, canvasCenter.x + button.txtX, canvasCenter.y + button.txtY, txtColor, 'center');
}


/**
 * draw rectangle on canvas
 * @param {number} topLeftX
 * @param {number} topLeftY
 * @param {number} boxWidth
 * @param {number} boxHeight
 * @param {string} fillColor
 * @param {number} transparency 0 to 1 alpha value, default: 1
 */
function drawRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor, transparency = null) {
    if (transparency != null) { canvasContext.globalAlpha = transparency; }

    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);

    if (transparency != null) { canvasContext.globalAlpha = 1; }
}


/**
 * draw circle on canvas
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} radius
 * @param {string} fillColor
 */
function drawCircle(centerX, centerY, radius, fillColor) {
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
function drawText(text, centerX, centerY, textColor, alignment, font=FONT) {
    canvasContext.font = font;
    canvasContext.fillStyle = textColor;
    canvasContext.textAlign = alignment;
    canvasContext.fillText(text, centerX, centerY);
}

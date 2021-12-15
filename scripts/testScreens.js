"use strict";
// *********************************** TEST SCREENS *************************************

/** valid test screen strings */
const TEST_SCREENS = {
    "sm3x2":  "sm3x2",   // basic buttons
    "lge3x2": "lge3x2",  // large game select buttons
    "lge2x2": "lge2x2",  // game select with fewer options
    "corner": "corner"   // corner buttons
}

/** single function to control which test is drawn */
function drawTestScreen(screen = '3x2sm') {
    switch (screen) {
        case
            TEST_SCREENS["sm3x2"]: {
                setup3x2SmTest();
                draw3x2SmButtonScreen();
            }
            break;
        case
            TEST_SCREENS["lge3x2"]: {
                setup3x2LgeTest();
                draw3x2LgeTestScreen();
            }
            break;
        case
            TEST_SCREENS["lge2x2"]: {
                setup2x2LgeTest();
                draw2x2LgeTest();
            }
            break;
        case
            TEST_SCREENS["corner"]: {
                setupCornerTest();
                drawCornerTest();
            }
            break;
    }
}



// ******************************** 3x2sm TEST SCREEN ***********************************

/** 3x2 sm test screen events */
function setup3x2SmTest() {
    canvas.addEventListener('mousedown', test3x2SmButtons);
}

/**
 * button event handler
 * @param {Event} evt
 */
function test3x2SmButtons(evt) {
    let mousePos = calculateMousePosition(evt);

    if (isInButton(mousePos, button1)) { toggle1 = toggleState(toggle1); }
    if (isInButton(mousePos, button2)) { toggle2 = toggleState(toggle2); }
    if (isInButton(mousePos, button3)) { toggle3 = toggleState(toggle3); }
    if (isInButton(mousePos, button4)) { toggle4 = toggleState(toggle4); }
    if (isInButton(mousePos, button5)) { toggle5 = toggleState(toggle5); }
    if (isInButton(mousePos, button6)) { toggle6 = toggleState(toggle6); }

    draw3x2SmButtonScreen();
}

/** 3x2 Sm test screen */
function draw3x2SmButtonScreen() {
    // colors
    let testBackground = DisneylandParisCastle["DARKPINK"];
    let testText = DisneylandParisCastle["DARKBLUE"];
    let testButtonOn = DisneylandParisCastle["LIGHTBLUE"];
    let testButtonOff = DisneylandParisCastle["LIGHTPINK"];
    let testButtonOnText = DisneylandParisCastle["LIGHTPINK"];
    let testButtonOffText = DisneylandParisCastle["LIGHTBLUE"];

    // background
    drawRect(0, 0, canvas.width, canvas.height, testBackground);

    // title
    drawText('3x2sm Button Test Page.', canvasCenter.x, 180, testText, 'center', LARGE_FONT);

    // some words
    drawText("This is a test screen.", canvasCenter.x, canvasCenter.y -45, testText, 'center');

    // buttons
    drawButton(button1, 'Button 1', toggle1 ? testButtonOn : testButtonOff, toggle1 ? testButtonOnText : testButtonOffText);
    drawButton(button2, 'Button 2', toggle2 ? testButtonOn : testButtonOff, toggle2 ? testButtonOnText : testButtonOffText);
    drawButton(button3, 'Button 3', toggle3 ? testButtonOn : testButtonOff, toggle3 ? testButtonOnText : testButtonOffText);
    drawButton(button4, 'Button 4', toggle4 ? testButtonOn : testButtonOff, toggle4 ? testButtonOnText : testButtonOffText);
    drawButton(button5, 'Button 5', toggle5 ? testButtonOn : testButtonOff, toggle5 ? testButtonOnText : testButtonOffText);
    drawButton(button6, 'Button 6', toggle6 ? testButtonOn : testButtonOff, toggle6 ? testButtonOnText : testButtonOffText);
}



// ********************************* 3x2lge TEST SCREEN *********************************

/** 3x2 Lge test screen events */
function setup3x2LgeTest() {
    canvas.addEventListener('mousedown', test3x2LgeButtons);
}

/**
 * button event handler
 * @param {Event} evt
 */
function test3x2LgeButtons(evt) {
    let mousePos = calculateMousePosition(evt);

    if (isInButton(mousePos, buttonLge1)) { toggle1 = toggleState(toggle1); }
    if (isInButton(mousePos, buttonLge2)) { toggle2 = toggleState(toggle2); }
    if (isInButton(mousePos, buttonLge3)) { toggle3 = toggleState(toggle3); }
    if (isInButton(mousePos, buttonLge4)) { toggle4 = toggleState(toggle4); }
    if (isInButton(mousePos, buttonLge5)) { toggle5 = toggleState(toggle5); }
    if (isInButton(mousePos, buttonLge6)) { toggle6 = toggleState(toggle6); }

    draw3x2LgeTestScreen();
}

/** 3x2 Lge test screen */
function draw3x2LgeTestScreen() {
    // colors
    let GREY = Luxury['GREY'];
    let SALMON = Luxury['SALMON'];
    let MIDNIGHT = Luxury['MIDNIGHT'];
    let BLACK = Luxury['BLACK'];
    let BEIGE = Luxury['BEIGE'];

    drawRect(0, 0, canvas.width, canvas.height, MIDNIGHT);

    // title
    drawText('Welcome to', canvasCenter.x, 60, SALMON, 'center', LARGE_FONT);
    drawText('the', canvasCenter.x - 250, 100, SALMON, 'center');
    drawText('Cannibal Arcade', canvasCenter.x, 160, SALMON, 'center', LARGE_FONT);

    // click to play
    drawText("Choose your game.", canvasCenter.x, 220, GREY, 'center');

    // buttons
    if (toggle1) {
        drawButton( buttonLge1,
            'Go Pong Yourself!', toggle1 ? BEIGE : BLACK, toggle1 ? SALMON : MIDNIGHT);
    }
    else {
        canvasContext.drawImage(
            imgGPY, canvasCenter.x + buttonLge1.x, canvasCenter.y + buttonLge1.y);
    }
    drawButton( buttonLge2,
        'Another Game!', toggle2 ? BEIGE : BLACK, toggle2 ? SALMON : MIDNIGHT);
    drawButton( buttonLge3,
        'A Third Game', toggle3 ? BEIGE : BLACK, toggle3 ? SALMON : MIDNIGHT);
    drawButton( buttonLge4,
        'Whoo a 4th!', toggle4 ? BEIGE : BLACK, toggle4 ? SALMON : MIDNIGHT);
    drawButton( buttonLge5,
        'Still more?!?', toggle5 ? BEIGE : BLACK, toggle5 ? SALMON : MIDNIGHT);
    drawButton( buttonLge6,
        'A Sixth Game.', toggle6 ? BEIGE : BLACK, toggle6 ? SALMON : MIDNIGHT);
}



// ********************************* 2x2lge TEST SCREEN *********************************

/** 2x2 Lge test screen events */
function setup2x2LgeTest() {
    canvas.addEventListener('mousedown', test2x2LgeButtons);
}

/**
 * button event handler
 * @param {Event} evt
 */
function test2x2LgeButtons(evt) {
    let mousePos = calculateMousePosition(evt);

    if (isInButton(mousePos, buttonLge7)) { toggle1 = toggleState(toggle1); }
    if (isInButton(mousePos, buttonLge8)) { toggle2 = toggleState(toggle2); }
    if (isInButton(mousePos, buttonLge9)) { toggle3 = toggleState(toggle3); }
    if (isInButton(mousePos, buttonLge10)) { toggle4 = toggleState(toggle4); }

    draw2x2LgeTest();
}

/** 2x2 Lge test screen */
function draw2x2LgeTest() {
    // colors
    let GREY = Luxury['GREY'];
    let SALMON = Luxury['SALMON'];
    let MIDNIGHT = Luxury['MIDNIGHT'];
    let BLACK = Luxury['BLACK'];
    let BEIGE = Luxury['BEIGE'];

    drawRect(0, 0, canvas.width, canvas.height, MIDNIGHT);

    // title
    drawText('Welcome to', canvasCenter.x, 60, SALMON, 'center', LARGE_FONT);
    drawText('the', canvasCenter.x - 250, 100, SALMON, 'center');
    drawText('Cannibal Arcade', canvasCenter.x, 160, SALMON, 'center', LARGE_FONT);

    // click to play
    drawText("Choose your game.", canvasCenter.x, 220, GREY, 'center');

    // buttons
    if (toggle1) {
        drawButton(buttonLge7,
            'Go Pong Yourself!', toggle1 ? BEIGE : BLACK, toggle1 ? SALMON : MIDNIGHT);
    }
    else {
        canvasContext.drawImage(
            imgGPY, canvasCenter.x + buttonLge7.x, canvasCenter.y + buttonLge7.y);
    }
    drawButton(buttonLge8,
        'Another Game!', toggle2 ? BEIGE : BLACK, toggle2 ? SALMON : MIDNIGHT);
    drawButton(buttonLge9,
        'A Third Game', toggle3 ? BEIGE : BLACK, toggle3 ? SALMON : MIDNIGHT);
    drawButton(buttonLge10,
        'Whoo a 4th!', toggle4 ? BEIGE : BLACK, toggle4 ? SALMON : MIDNIGHT);
}



// ************************************ CORNER TEST *************************************

/** corner test screen events */
function setupCornerTest() {
    canvas.addEventListener('mousedown', testCornerButtons);
}

/**
 * button event handler
 * @param {Event} evt
 */
function testCornerButtons(evt) {
    let mousePos = calculateMousePosition(evt);

    if (isInButton(mousePos, buttonCorner1)) { toggle1 = toggleState(toggle1); }
    if (isInButton(mousePos, buttonCorner2)) { toggle2 = toggleState(toggle2); }
    if (isInButton(mousePos, buttonCorner3)) { toggle3 = toggleState(toggle3); }
    if (isInButton(mousePos, buttonCorner4)) { toggle4 = toggleState(toggle4); }

    drawCornerTest();
}

/** corner test screen */
function drawCornerTest() {
    // colors
    let testBackground = DisneylandParisCastle["DARKPINK"];
    let testText = DisneylandParisCastle["DARKBLUE"];
    let testButtonOn = DisneylandParisCastle["LIGHTBLUE"];
    let testButtonOff = DisneylandParisCastle["LIGHTPINK"];
    let testButtonOnText = DisneylandParisCastle["LIGHTPINK"];
    let testButtonOffText = DisneylandParisCastle["LIGHTBLUE"];

    // background
    drawRect(0, 0, canvas.width, canvas.height, testBackground);

    // title
    drawText('Corner Buttons Test Page.', canvasCenter.x, 180, testText, 'center', LARGE_FONT);

    // some words
    drawText("This is a test screen.", canvasCenter.x, canvasCenter.y -45, testText, 'center');

    // buttons
    drawButton(buttonCorner1, 'Button 1', toggle1 ? testButtonOn : testButtonOff, toggle1 ? testButtonOnText : testButtonOffText);
    drawButton(buttonCorner2, 'Button 2', toggle2 ? testButtonOn : testButtonOff, toggle2 ? testButtonOnText : testButtonOffText);
    drawButton(buttonCorner3, 'Button 3', toggle3 ? testButtonOn : testButtonOff, toggle3 ? testButtonOnText : testButtonOffText);
    drawButton(buttonCorner4, 'Button 4', toggle4 ? testButtonOn : testButtonOff, toggle4 ? testButtonOnText : testButtonOffText);
}

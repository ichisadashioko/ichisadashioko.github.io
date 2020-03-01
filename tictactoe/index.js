"use strict";
var TILE_WIDTH = 60;
var SEP_WIDTH = 5;
var GAME_WIDTH = TILE_WIDTH * 3 + SEP_WIDTH * 2;
var GAME_HEIGHT = TILE_WIDTH * 3 + SEP_WIDTH * 2;
var canvas = document.getElementById('main');
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
var scale = 1;
var offset = {
    x: 0,
    y: 0,
};
function resizeCanvas() {
    scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
    canvas.style.transform = "scale(" + scale + ")";
    offset.x = (window.innerWidth - (GAME_WIDTH * scale)) / 2;
    offset.y = (window.innerHeight - (GAME_HEIGHT * scale)) / 2;
    canvas.style.left = offset.x + "px";
    canvas.style.top = offset.y + "px";
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
var ctx = canvas.getContext('2d');
function drawLine(x1, y1, x2, y2, lineWidth, style) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}
function drawGrid() {
    ctx.fillStyle = 'rgba(0,255,255,1)';
    ctx.fillRect(0, TILE_WIDTH, GAME_WIDTH, SEP_WIDTH);
    ctx.fillRect(0, TILE_WIDTH * 2 + SEP_WIDTH, GAME_WIDTH, SEP_WIDTH);
    ctx.fillRect(TILE_WIDTH, 0, SEP_WIDTH, GAME_HEIGHT);
    ctx.fillRect(TILE_WIDTH * 2 + SEP_WIDTH, 0, SEP_WIDTH, GAME_HEIGHT);
}
drawGrid();
/**
 *  0: nothing
 *  1: X
 * -1: O
 */
var X = 1;
var O = -1;
var gameState = [
    [X, 0, 0],
    [O, 0, 0],
    [0, X, O],
];
function drawX(x, y) {
    var line1 = {
        start: {
            x: TILE_WIDTH * 0.1 + x * (TILE_WIDTH + SEP_WIDTH),
            y: TILE_WIDTH * 0.1 + y * (TILE_WIDTH + SEP_WIDTH),
        },
        end: {
            x: TILE_WIDTH * 0.9 + x * (TILE_WIDTH + SEP_WIDTH),
            y: TILE_WIDTH * 0.9 + y * (TILE_WIDTH + SEP_WIDTH),
        },
    };
    var line2 = {
        start: {
            x: TILE_WIDTH * 0.1 + x * (TILE_WIDTH + SEP_WIDTH),
            y: TILE_WIDTH * 0.9 + y * (TILE_WIDTH + SEP_WIDTH),
        },
        end: {
            x: TILE_WIDTH * 0.9 + x * (TILE_WIDTH + SEP_WIDTH),
            y: TILE_WIDTH * 0.1 + y * (TILE_WIDTH + SEP_WIDTH),
        },
    };
    var lineWidth = TILE_WIDTH * 0.1;
    var style = 'rgba(255,0,0,1)';
    drawLine(line1.start.x, line1.start.y, line1.end.x, line1.end.y, lineWidth, style);
    drawLine(line2.start.x, line2.start.y, line2.end.x, line2.end.y, lineWidth, style);
}
function drawO(x, y) {
    ctx.lineWidth = TILE_WIDTH * 0.1;
    ctx.strokeStyle = 'rgba(0,0,255,1)';
    var radius = TILE_WIDTH * 0.4;
    var origin = {
        x: TILE_WIDTH * 0.5 + x * (TILE_WIDTH + SEP_WIDTH),
        y: TILE_WIDTH * 0.5 + y * (TILE_WIDTH + SEP_WIDTH),
    };
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
}
function renderGameState() {
    for (var i = 0; i < gameState.length; i++) {
        for (var j = 0; j < gameState[i].length; j++) {
            if (gameState[i][j] === X) {
                drawX(j, i);
            }
            else if (gameState[i][j] === O) {
                drawO(j, i);
            }
        }
    }
}
renderGameState();
function drawTouchPoint(x, y) {
    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    ctx.beginPath();
    ctx.arc((x - offset.x) / scale, (y - offset.y) / scale, 5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}
function floatToInt(x) {
    return (x - (x % 1));
}
function mapTouchPosToTile(x, y) {
    var pos = {
        x: (x - offset.x) / scale,
        y: (y - offset.y) / scale,
    };
    var tilePos = {
        x: floatToInt(pos.x / (GAME_WIDTH / 3)),
        y: floatToInt(pos.y / (GAME_HEIGHT / 3)),
    };
    return tilePos;
}
function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    drawGrid();
    renderGameState();
}
var turn = X;
function touchUp(evt) {
    drawTouchPoint(evt.x, evt.y);
    var tilePos = mapTouchPosToTile(evt.x, evt.y);
    gameState[tilePos.y][tilePos.x] = turn;
    turn = -turn;
    draw();
}
canvas.addEventListener('mouseup', touchUp);

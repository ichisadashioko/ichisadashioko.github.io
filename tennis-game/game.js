var canvas;
var canvasContext;
var fps = isMobileDevice() ? 12 : 60;
var wTime = 6;
var hTime = 3;

let timer = 0;
let boolTimer = false;

var score1 = 0;
var score2 = 0;

var ball = new Object();
ball.x = 0;
ball.y = 0;
ball.radius = 10;
ball.xVelocity = 0;
ball.yVelocity = 0;
ball.bonusSpeedX = 0;
ball.bonusSpeedY = 0;
ball.velocity = 0;

const PADDLE_THICKNESS = 10;

var paddle = new Object();
paddle.thickness = PADDLE_THICKNESS;
paddle.height = 200;
paddle.x = 0;
paddle.y = 0;
paddle.yVelocity = 0;
paddle.bonusVelocity = 0;

var lastHit = new Object();
lastHit.offset = 0;
lastHit.y = 0;

var botPaddle = new Object();
botPaddle.thickness = PADDLE_THICKNESS;
botPaddle.height = 200;
botPaddle.x = 0;
botPaddle.y = 0;
botPaddle.yVelocity = 0;
botPaddle.bonusVelocity = 0;

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

window.onload = function () {
    initialize();
    // resetBall(null);

    setInterval(function () {
        moveEverything();
        drawEverything();
        AI(botPaddle);
        // AI(paddle);

    }, 1000 / fps);


    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = calculateMousePos(evt);
        // paddle.x = mousePos.x;
        paddle.y = mousePos.y;
    });

    // canvas.addEventListener('touchevent', function (evt) {
    //     var mousePos = calculateMousePos(evt);
    //     // paddle.x = mousePos.x;
    //     paddle.y = mousePos.y;
    // });

}

function initialize() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ball.xVelocity = canvas.width / (fps * wTime);
    ball.yVelocity = canvas.height / (fps * hTime);

    botPaddle.yVelocity = paddle.yVelocity = ball.yVelocity;

    paddle.y = botPaddle.y = canvas.height / 2;
    botPaddle.x = canvas.width - botPaddle.thickness;


    ball.x = (canvas.width / 2) - (ball.radius / 2);
    ball.y = (canvas.height / 2) - (ball.radius / 2);
};

function AI(obj) {

    // if (obj.y - (obj.height / 4) > ball.y) {
    //     obj.y = obj.y - (obj.yVelocity + obj.bonusVelocity);
    // }
    // if (obj.y + (obj.height / 4) < ball.y) {
    //     obj.y = obj.y + (obj.yVelocity + obj.bonusVelocity);
    // }


    if (obj.y > ball.y) {
        obj.y = obj.y - (obj.yVelocity + obj.bonusVelocity);
    }
    if (obj.y < ball.y) {
        obj.y = obj.y + (obj.yVelocity + obj.bonusVelocity);
    }
}

function OnHit(left) {

    ball.bonusSpeedX++;

    if (left) {
        boolTimer = true;
        timer = 0;
        let delta = lastHit.offset = ball.y - paddle.y;
        let ratio = delta / (paddle.height / 2.0);
        let alpha = (ratio * Math.PI) / 3.0;
        ball.yVelocity = (Math.tan(alpha) * Math.abs(ball.xVelocity));
        // console.log("vx: " + ball.xVelocity);
        // console.log("vy: ", ball.yVelocity);
    } else {
        let delta = ball.y - botPaddle.y;
        let ratio = delta / (paddle.height / 2.0);
        let alpha = (ratio * Math.PI) / 3.0;
        ball.yVelocity = (Math.tan(alpha) * Math.abs(ball.xVelocity));
    }

}

function moveEverything() {

    ball.x = (ball.xVelocity > 0) ? (ball.x + ball.xVelocity + ball.bonusSpeedX) : (ball.x + ball.xVelocity - ball.bonusSpeedX);
    ball.y = (ball.yVelocity > 0) ? (ball.y + ball.yVelocity) : (ball.y + ball.yVelocity);

    var vx = (ball.xVelocity > 0) ? (ball.xVelocity + ball.bonusSpeedX) : (ball.xVelocity - ball.bonusSpeedX);
    var vy = (ball.yVelocity > 0) ? (ball.yVelocity) : (ball.yVelocity);

    ball.velocity = Math.sqrt(vx * vx + vy * vy) * fps;

    //left collision
    if (
        (ball.x <= (paddle.thickness + ball.radius)) &&
        (paddle.y - paddle.height / 2) <= ball.y &&
        (paddle.y + paddle.height / 2) >= ball.y) {

        ball.x = paddle.thickness + ball.radius;
        ball.xVelocity = -ball.xVelocity;
        OnHit(true);
        return;
    }
    if (ball.x <= 0 + ball.radius) {
        resetBall(true);
        //ball.xVelocity = -ball.xVelocity;
    }

    //right collision
    if (
        (ball.x >= canvas.width - (botPaddle.thickness + ball.radius)) &&
        (botPaddle.y - botPaddle.height / 2) <= ball.y &&
        (botPaddle.y + botPaddle.height / 2) >= ball.y) {
        ball.xVelocity = -ball.xVelocity;
        ball.x = canvas.width - (botPaddle.thickness + ball.radius);
        OnHit(false);
        return;
    }
    if (ball.x >= canvas.width - ball.radius) {
        resetBall(false);
        // ball.xVelocity = -ball.xVelocity;
    }

    //top collision
    if (ball.y <= 0 + ball.radius) {
        ball.y = ball.radius;
        ball.yVelocity = -ball.yVelocity;
    }

    // bottom collision
    if (ball.y >= canvas.height - ball.radius) {
        ball.y = canvas.height - ball.radius;
        ball.yVelocity = -ball.yVelocity;
    }
}

function drawEverything() {

    colorRect(0, 0, canvas.width, canvas.height, 'black'); // background

    colorCircle(ball.x, ball.y, ball.radius, '#4286f4'); // ball

    colorRect(0, paddle.y - paddle.height / 2, paddle.thickness, paddle.height, 'white'); // player's paddle

    if (boolTimer) {

        lastHit.y = lastHit.offset + paddle.y;
        colorRect(0, lastHit.y - ball.radius/2, 10, 10, 'red');
        timer++;
        if (timer >= 60) {
            boolTimer = false;
            timer = 0;
        }
    }

    // colorRect(0, paddle.y - paddle.height / 2, paddle.thickness, botPaddle.height, 'white'); // left bot's paddle

    colorRect(botPaddle.x, botPaddle.y - botPaddle.height / 2, botPaddle.thickness, botPaddle.height, 'white'); // right bot's paddle

    // canvasContext
    canvasContext.font = "16px Consolas";
    canvasContext.fillText(score1.toString(), canvas.width * 0.25, canvas.height / 4);
    canvasContext.fillText(score2, canvas.width * 0.75, canvas.height / 4);
    canvasContext.fillText(Number.parseFloat(ball.velocity).toFixed(1) + " pxl/s", (canvas.width * 0.48), canvas.height * 0.2)
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {

    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function resetBall(left) {
    if (left) {
        ball.xVelocity = Math.abs(ball.xVelocity);
        score2++;
    } else if (!left) {
        ball.xVelocity = -Math.abs(ball.xVelocity);
        score1++;
    }

    ball.yVelocity = 0;
    ball.y = Math.random() * canvas.height;
    ball.x = (canvas.width / 2) - (ball.radius / 2);
    // ball.y = (canvas.height / 2) - (ball.radius / 2);
    ball.bonusSpeedX = 0;
    botPaddle.bonusVelocity = 0;
}

function isMobileDevice(){
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
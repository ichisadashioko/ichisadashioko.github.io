const TILE_WIDTH = 60
const SEP_WIDTH = 5
const GAME_WIDTH = TILE_WIDTH * 3 + SEP_WIDTH * 2
const GAME_HEIGHT = TILE_WIDTH * 3 + SEP_WIDTH * 2

let canvas = document.getElementById('main') as HTMLCanvasElement
canvas.width = GAME_WIDTH
canvas.height = GAME_HEIGHT

let scale = 1
let offset = {
    x: 0,
    y: 0,
}

function resizeCanvas() {
    scale = Math.min(
        window.innerWidth / GAME_WIDTH,
        window.innerHeight / GAME_HEIGHT,
    )

    canvas.style.transform = `scale(${scale})`
    offset.x = (window.innerWidth - (GAME_WIDTH * scale)) / 2
    offset.y = (window.innerHeight - (GAME_HEIGHT * scale)) / 2
    canvas.style.left = `${offset.x}px`
    canvas.style.top = `${offset.y}px`
}

resizeCanvas()
window.addEventListener('resize', resizeCanvas)

let ctx = canvas.getContext('2d') as CanvasRenderingContext2D

function drawLine(x1: number, y1: number, x2: number, y2: number, lineWidth: number, style: string) {
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = style
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.closePath()
    ctx.stroke()
}

function drawGrid() {
    ctx.fillStyle = 'rgba(0,255,255,1)'
    ctx.fillRect(0, TILE_WIDTH, GAME_WIDTH, SEP_WIDTH)
    ctx.fillRect(0, TILE_WIDTH * 2 + SEP_WIDTH, GAME_WIDTH, SEP_WIDTH)
    ctx.fillRect(TILE_WIDTH, 0, SEP_WIDTH, GAME_HEIGHT)
    ctx.fillRect(TILE_WIDTH * 2 + SEP_WIDTH, 0, SEP_WIDTH, GAME_HEIGHT)
}

drawGrid()

/**
 *  0: nothing
 *  1: X
 * -1: O
 */
const X = 1
const O = -1

let turn = X

let gameEnded: boolean
let gameState: number[][]

function resetGameState() {
    turn = X
    gameEnded = false

    gameState = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]
}

resetGameState()

function drawX(x: number, y: number) {
    let line1 = {
        start: {
            x: TILE_WIDTH * 0.1 + x * (TILE_WIDTH + SEP_WIDTH),
            y: TILE_WIDTH * 0.1 + y * (TILE_WIDTH + SEP_WIDTH),
        },
        end: {
            x: TILE_WIDTH * 0.9 + x * (TILE_WIDTH + SEP_WIDTH),
            y: TILE_WIDTH * 0.9 + y * (TILE_WIDTH + SEP_WIDTH),
        },
    }

    let line2 = {
        start: {
            x: TILE_WIDTH * 0.1 + x * (TILE_WIDTH + SEP_WIDTH),
            y: TILE_WIDTH * 0.9 + y * (TILE_WIDTH + SEP_WIDTH),
        },
        end: {
            x: TILE_WIDTH * 0.9 + x * (TILE_WIDTH + SEP_WIDTH),
            y: TILE_WIDTH * 0.1 + y * (TILE_WIDTH + SEP_WIDTH),
        },
    }

    let lineWidth = TILE_WIDTH * 0.1
    let style = 'rgba(255,0,0,1)'
    drawLine(line1.start.x, line1.start.y, line1.end.x, line1.end.y, lineWidth, style)
    drawLine(line2.start.x, line2.start.y, line2.end.x, line2.end.y, lineWidth, style)
}

function drawO(x: number, y: number) {
    ctx.lineWidth = TILE_WIDTH * 0.1
    ctx.strokeStyle = 'rgba(0,0,255,1)'
    let radius = TILE_WIDTH * 0.4

    let origin = {
        x: TILE_WIDTH * 0.5 + x * (TILE_WIDTH + SEP_WIDTH),
        y: TILE_WIDTH * 0.5 + y * (TILE_WIDTH + SEP_WIDTH),
    }

    ctx.beginPath()
    ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.stroke()
}

function renderGameState() {
    for (let i = 0; i < gameState.length; i++) {
        for (let j = 0; j < gameState[i].length; j++) {
            if (gameState[i][j] === X) {
                drawX(j, i)
            } else if (gameState[i][j] === O) {
                drawO(j, i)
            }
        }
    }
}

renderGameState()

function drawTouchPoint(x: number, y: number) {
    ctx.fillStyle = 'rgba(255,0,0,0.5)'
    ctx.beginPath()
    ctx.arc((x - offset.x) / scale, (y - offset.y) / scale, 5, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
}

function floatToInt(x: number) {
    return (x - (x % 1))
}

function mapTouchPosToTile(x: number, y: number) {
    let pos = {
        x: (x - offset.x) / scale,
        y: (y - offset.y) / scale,
    }

    let tilePos = {
        x: floatToInt(pos.x / (GAME_WIDTH / 3)),
        y: floatToInt(pos.y / (GAME_HEIGHT / 3)),
    }

    return tilePos
}

function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    drawGrid()
    renderGameState()
}

function findMatrixShape(x: number[][]) {
    let numRows = x.length
    let numColumns = x[0].length

    return {
        rows: numRows,
        columns: numColumns,
    }
}

function multiply(a: number[][], b: number[][]) {
    let aShape = findMatrixShape(a)
    let bShape = findMatrixShape(b)

    if (aShape.columns !== bShape.rows) {
        throw `Cannot perform matrix multipication on ${aShape.rows}x${aShape.columns} and ${bShape.rows}x${bShape.columns}!`
    }

    let resultMatrix: number[][] = []
    for (let i = 0; i < aShape.rows; i++) {
        resultMatrix[i] = []
        for (let j = 0; j < bShape.columns; j++) {
            resultMatrix[i][j] = 0
            for (let k = 0; k < aShape.columns; k++) {
                resultMatrix[i][j] += a[i][k] * b[k][j]
            }
        }
    }

    return resultMatrix
}

function transpose(x: number[][]) {
    let xShape = findMatrixShape(x)
    let resultMatrix: number[][] = []

    for (let i = 0; i < xShape.columns; i++) {
        resultMatrix[i] = []
        for (let j = 0; j < xShape.rows; j++) {
            resultMatrix[i][j] = x[j][i]
        }
    }

    return resultMatrix
}

function trace(x: number[][]) {
    let xShape = findMatrixShape(x)
    if (xShape.rows !== xShape.columns) {
        throw `Cannot calculate trace for matrix with shape ${xShape.rows}x${xShape.columns}`
    }

    let result = 0
    for (let i = 0; i < xShape.rows; i++) {
        result += x[i][i]
    }

    return result
}

let eMatrices = [
    [[1], [0], [0]],
    [[0], [1], [0]],
    [[0], [0], [1]],
]

let aMatrix = [[1, 1, 1]]

function whoIsTheWinner() {
    // https://math.stackexchange.com/questions/467757/determine-the-winner-of-a-tic-tac-toe-board-with-a-single-matrix-expression

    let results = []

    for (let i = 0; i < eMatrices.length; i++) {
        let se = multiply(gameState, eMatrices[i])
        let ase = multiply(aMatrix, se)
        results.push(ase[0][0])
    }

    let sT = transpose(gameState)
    for (let i = 0; i < eMatrices.length; i++) {
        let se = multiply(sT, eMatrices[i])
        let ase = multiply(aMatrix, se)
        results.push(ase[0][0])
    }

    results.push(trace(gameState))
    // Permute (swap) rows
    let P = [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
    ]
    let Ps = multiply(P, gameState)
    results.push(trace(Ps))

    for (let i = 0; i < results.length; i++) {
        if (results[i] === 3) {
            // X wins
            gameEnded = true
            break
        } else if (results[i] === -3) {
            // O wins
            gameEnded = true
            break
        }
    }

    console.log(results)
}

function touchUp(evt: MouseEvent) {
    drawTouchPoint(evt.x, evt.y)
    let tilePos = mapTouchPosToTile(evt.x, evt.y)

    if (gameEnded) {
        resetGameState()
    }

    if (gameState[tilePos.y][tilePos.x] === 0) {
        gameState[tilePos.y][tilePos.x] = turn
        turn = -turn
        draw()
        whoIsTheWinner()
    }
}

canvas.addEventListener('mouseup', touchUp)
const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cxt = canvas.getContext('2d');

const tilesArray = [];

let mouse = {
    x: undefined,
    y: undefined
}

let mouseClickedAt = {
    x: undefined,
    y: undefined
}

// adjusts the canvas when the window is resized
window.addEventListener('resize', (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

// determines where mouse pointer is located
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
})

// checks for location of mouse click
window.addEventListener('click', (e) => {
    mouseClickedAt.x = e.x;
    mouseClickedAt.y = e.y;
})

// creates functionality for a tile
class Tile {
    constructor(x, y, height, width, baseColor, baseStrokeColor, selectedColor, highlightedStrokeColor) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.baseColor = baseColor;
        this.baseStrokeColor = baseStrokeColor;
        this.selectedColor = selectedColor;
        this.highlightedStrokeColor = highlightedStrokeColor;

    }

    draw() {
        cxt.beginPath();
        cxt.lineWidth = 3;
        cxt.moveTo(this.x, this.y);
        cxt.lineTo(this.x - this.width / 2, this.y + this.height /2);
        cxt.lineTo(this.x, this.y + this.height);
        cxt.lineTo(this.x + this.width / 2, this.y + this.height / 2);
        cxt.lineTo(this.x, this.y);
        cxt.fill();
        cxt.stroke();
    }
    determineIfPointinBounds(x, y) {
        let deltaX;
        if (x < this.x) {
            // left side
            deltaX = this.x - x;
        } else {
            // right side
            deltaX = x - this.x;
        }

        // top and bottom based on center of tile
        let minY = this.y;
        let maxY = this.y + this.height;

        // y-axis bounds adjusted for slope of tile's edge
        let topEdge = minY + deltaX/2;
        let bottomEdge = maxY - deltaX/2;

        // determine if point is inside tile based on mouse position
        if (
            y >= topEdge
            && y <= bottomEdge
        ) {
            return true;
        } else {
            return false;
        }
    }
    determineFillandStroke(fillColor, strokeColor) {
        cxt.beginPath();
        cxt.fillStyle = fillColor;
        cxt.strokeStyle = strokeColor;
        cxt.stroke();
        cxt.fill();
        cxt.closePath();
    }
    update() {

        if (this.determineIfPointinBounds(mouseClickedAt.x, mouseClickedAt.y)) {
            if (this.determineIfPointinBounds(mouse.x, mouse.y)) {
                this.determineFillandStroke(this.selectedColor, this.highlightedStrokeColor);
            } else {
                this.determineFillandStroke(this.selectedColor, this.strokeColor);
            }
        } else {
            if (this.determineIfPointinBounds(mouse.x, mouse.y)) {
                this.determineFillandStroke(this.baseColor, this.highlightedStrokeColor);
            } else {
                this.determineFillandStroke(this.baseColor, this.baseStrokeColor)
            }
        }
                
        this.draw();
    }
}

// draws the grid based on width, height, and starting coordinates
function drawTileMap(width, height, startingX, startingY) {
    
    for (let i = 0; i < width; i++) {
        let firstTileX = startingX;
        let firstTileY = startingY;
        for (let j = 0; j < height; j++) {
            if (i == 0 || j == 0 || i == width - 1 || j == height - 1) {
                tile = new Tile(firstTileX, firstTileY, 50, 100, 'green', 'black', 'red', 'yellow');
            } else {
                tile = new Tile(firstTileX, firstTileY, 50, 100, 'gray', 'black', 'red', 'yellow');
            }
            tilesArray.push(tile);
            firstTileX += 54;
            firstTileY += 27;
        }
        startingX -= 54;
        startingY += 27;
    }
}



drawTileMap(10, 10, canvas.width/2, 100)

// consistently updates the tile grid
function animate() {
    requestAnimationFrame(animate);
    for (let i = 0; i < tilesArray.length; i++) {
        tilesArray[i].update();
    }
}

animate();
class Trex {
    constructor(x, y, width, height, jumpHeight, fallSpeed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.jumpHeight = jumpHeight
        this.fallSpeed = fallSpeed
    }

    jump() {
        this.y -= this.jumpHeight
    }
}

class Cactus {
    constructor(x, y, width, height, speed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
    }

    move() {
        this.x -= this.speed
    }
}

class Gameboard {
    constructor(trex, cactus, cactuses, canvas, context, width, height, canvasColor) {
        this.trex = trex
        this.cactus = cactus
        this.cactuses = cactuses
        this.canvas =  canvas
        this.context = context
        this.width = width
        this.height = height
        this.color = canvasColor
        
        // set canvas
        this.setCanvas()

        // render
        this.render()

        // async method
        this.renderAsync()

        // event listener method
        this.eventListener()
    }

    // for canvas 
    setCanvas() {
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvas.style.background = this.color
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.width, this.height)
    }

    // for cactus
    addCactus() {
        // check inside array for cactus then draw it
        this.cactuses.push(new Cactus(this.cactus.x, this.cactus.y, this.cactus.width, this.cactus.height, this.cactus.speed))
        this.cactuses.forEach(cactus => {
            this.context.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);            
        });

        // check inside cactuses
        console.log(this.cactuses)
    }

    deleteCactus() {
        this.cactuses.forEach(cactus => {
            if(cactus.x + cactus.width < 0) {
                this.cactuses.splice(0, 1)
            }            
        });
    }

    setCactus() {
        this.cactuses.forEach(cactus => {
            cactus.move()
            this.context.fillRect(cactus.x, cactus.y, cactus.width, cactus.height)
        });
    }

    // for trex
    setTrex() {
        // airborne check
        this.fallTrex()

        this.context.fillRect(this.trex.x, this.trex.y, this.trex.width, this.trex.height)
    }

    airborneCheckTrex() {
        return this.trex.y < this.height - this.trex.height ? true : null
    }

    fallTrex() {
        if (this.airborneCheckTrex()) {
            this.trex.y += this.trex.fallSpeed
        }
    }

    jumpTrex() {
        this.trex.jump()
    }

    isCollide() {
        this.cactuses.forEach((cactus) => {
            if(this.trex.width > cactus.x && this.trex.height + this.trex.y > cactus.y && this.trex.x < cactus.x + cactus.width) {
                alert("game over!")
            }
        })
    }

    // event listener
    eventListener() {
        document.addEventListener('mousedown', () => {this.airborneCheckTrex() ?? this.jumpTrex()})
    }

    // async method for things that doesnt render per frames hh 
    renderAsync() {
        setTimeout(() =>{ this.addCactus(); this.renderAsync()}, 2000)
    }

    // for rendering purposes
    render() {
        this.clearCanvas()

        this.deleteCactus()
        this.isCollide()
        this.setTrex()
        this.setCactus()

        requestAnimationFrame(() => this.render())
    }
}

// canvas setting
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const canvasWidth = 800
const canvasHeight = 400
const canvasColor = "grey"

// trex setting
const trexWidth = 75
const trexHeight = 75
const trexX = 50
const trexY = canvasHeight - trexHeight // dibawah
const trexJumpHeight = 150
const trexFallSpeed = 1

// cactus setting
const cactuses = []
const cactusWidth = 75
const cactusHeight = 75
const cactusX = canvasWidth // disamping kanan luar
const cactusY = canvasHeight - cactusHeight // dibawah
const cactusSpeed = 5


// instances
const trex = new Trex(trexX, trexY, trexWidth, trexHeight, trexJumpHeight, trexFallSpeed)
const cactus = new Cactus(cactusX, cactusY, cactusWidth, cactusHeight, cactusSpeed)
const game = new Gameboard(trex, cactus, cactuses, canvas, context, canvasWidth, canvasHeight, canvasColor)
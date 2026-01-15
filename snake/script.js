const canvas = document.getElementById("canvas")
const context = canvas.getContext('2d')

const canvasWidth = 400
const canvasHeight = 500
const canvasProperty = {width: canvasWidth, height: canvasHeight, color: "blue"}

const birdImage = new Image()
birdImage.src = "./assets/flappybird.gif"
const birdProperty = {x: (canvasWidth / 2) - 30, y: (canvasHeight / 2) - 25, width: 30, height: 25, fallSpeed: 8, jumpSpeed: 25, image: birdImage}

const obstacleTopImage = new Image()
obstacleTopImage.src = "./assets/toppipe.png"
const obstacleBottomImage = new Image()
obstacleBottomImage.src = "./assets/bottompipe.png"
const obstacleTopProperty = {x: 0, y: 0, width: 50, height: 0, speed: 20, opening: 120, image: obstacleTopImage}
const obstacleBottomProperty = {x: 0, y: 0, width: 50, height: 0, speed: 20, opening: 120, image: obstacleBottomImage}

class Gameboard {
    constructor(canvas, context, canvasProperty, bird, obstacleTop, obstacleBottom) {
        this.canvas = canvas
        this.context = context
        this.width = canvasProperty.width
        this.height = canvasProperty.height
        this.color = canvasProperty.color
        this.bird = bird
        this.obstacleTop = obstacleTop
        this.obstacleBottom = obstacleBottom
        this.gameOver = false
        this.initialize()
    }

    initialize() {
        this.drawCanvas()
        this.renderFrame()
        this.setFallBird()
        this.eventListener()
        this.setAddObstacles()
        this.setMoveObstacles()
    }

    drawCanvas() {
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvas.style.background = this.color
    }

    // START: EVENT LISTENER
    eventListener() {
        addEventListener("keydown", (event) => {
            this.jumpBird()
        })
    }
    // END: EVENT LISTENER

    // COLLISION
    isCollided(obj1, obj2) {
        return (
            (obj1.x + obj1.width) > obj2.x &&
            obj1.x < (obj2.x + obj2.width) &&
            (obj1.y + obj1.height) > obj2.y &&
            obj1.y < (obj2.y + obj2.height)
        )
    }

    /// START: BIRD
    drawBird() {
        this.context.drawImage(this.bird.image, this.bird.x, this.bird.y, this.bird.width, this.bird.height)
    }

    fallBird() {
        this.bird.y += this.bird.fallSpeed
    }

    jumpBird() {
        this.bird.y -= this.bird.jumpSpeed
    }

    setFallBird() {
        setInterval(() => {
            this.fallBird()
        }, 100)
    }
    // END: BIRD

    // START: OBSTACLES
    addObstacles() {
        const opening =  this.obstacleBottom.opening
        const mathRandom = Math.floor(Math.random() * ((this.height - 200) - 100) + 100)

        this.obstacleTop.obstacles.push(new ObstacleTop({x: (this.width), y: 0, width: this.obstacleTop.width, height: mathRandom, speed: this.obstacleTop.speed, opening: opening}))
        this.obstacleBottom.obstacles.push(new ObstacleBottom({x: (this.width), y: (mathRandom + opening), width: this.obstacleBottom.width, height: (this.height - (mathRandom + opening)), speed: this.obstacleBottom.speed, opening: opening}))
    }

    setObstacles() {
        this.obstacleTop.obstacles.forEach((obstacle) => {
            obstacle.x -= this.obstacleTop.speed
        })

        this.obstacleBottom.obstacles.forEach((obstacle) => {
            obstacle.x -= obstacle.speed
        })
    }

    drawObstacles() {
        this.obstacleTop.obstacles.forEach((obstacle) => {
            this.context.drawImage(this.obstacleTop.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        });

        this.obstacleBottom.obstacles.forEach((obstacle) => {
            this.context.drawImage(this.obstacleBottom.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        });
    }

    setAddObstacles() {
        setInterval(() => {
            this.addObstacles()
        }, 2000)
    }

    setMoveObstacles() {
        setInterval(() => {
            this.setObstacles()
        }, 150)
    }

    checkCollide() {
        this.obstacleBottom.obstacles.forEach((obstacle) => {
            if(this.isCollided(this.bird, obstacle)) {
                this.gameOver = true
            }
        });

        this.obstacleTop.obstacles.forEach((obstacle) => {
            if(this.isCollided(this.bird, obstacle)) {
                this.gameOver = true
            }
        });
    }
    // END: OBSTACLES

    // START: GAME OVER
    drawGameOver() {
        this.context.fillStyle = "brown"
        this.context.fillRect(0, 0, this.width, this.height)

        this.context.font = "24px Helvetica"
        this.context.fillText("You Died", 0, 0)    }

    clearFrame() {
        this.context.clearRect(0, 0, this.width, this.height)
    }

    renderFrame() {
        this.clearFrame()

        if(this.gameOver) {
            this.drawGameOver()
        } else {
            this.drawBird()
            this.drawObstacles()
            this.checkCollide()
        }


        requestAnimationFrame(this.renderFrame.bind(this))
    }

}

class Bird {
    constructor(birdProperty) {
        this.x = birdProperty.x
        this.y = birdProperty.y
        this.width = birdProperty.width
        this.height = birdProperty.height
        this.fallSpeed = birdProperty.fallSpeed
        this.jumpSpeed = birdProperty.jumpSpeed
        this.image = birdProperty.image
    }
}

class ObstacleTop {
    constructor(obstacleProperty) {
        this.obstacles = []
        this.x = obstacleProperty.x
        this.y = obstacleProperty.y
        this.width = obstacleProperty.width
        this.height = obstacleProperty.height
        this.speed = obstacleProperty.speed
        this.opening = obstacleProperty.opening
        this.image = obstacleProperty.image
    }
}

class ObstacleBottom {
    constructor(obstacleProperty) {
        this.obstacles = []
        this.x = obstacleProperty.x
        this.y = obstacleProperty.y
        this.width = obstacleProperty.width
        this.height = obstacleProperty.height
        this.speed = obstacleProperty.speed
        this.opening = obstacleProperty.opening
        this.image = obstacleProperty.image
    }
}

const bird = new Bird(birdProperty)
const obstacleTop = new ObstacleTop(obstacleTopProperty)
const obstacleBottom = new ObstacleBottom(obstacleBottomProperty)
const gameboard = new Gameboard(canvas, context, canvasProperty, bird, obstacleTop, obstacleBottom)
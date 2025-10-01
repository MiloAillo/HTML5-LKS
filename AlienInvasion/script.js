//========[Global: DOM ELEMENT]============
const start = document.getElementById('start')
const canvas = document.getElementById('canvas')
const context = canvas.getContext("2d")

//=======[Global: Property]=========
//  user data
let username = ""
let level = ""
//  canvas setting
let canvasWidth = 1000
let canvasHeight = 600
let canvasBackgroundColor = "grey"
//  player
let playerWidth = 150
let playerHeight = 150
let playerX = 10
let playerY = 600 - playerHeight
let playerSpeed = 30
let playerImageKanan = new Image()
playerImageKanan.src = "./assets/Char/Char-KANAN1.png"
let playerImageKiri = new Image()
playerImageKiri.src = "./assets/Char/Char-KIRI1.png"
let playerImageAtas = new Image()
playerImageAtas.src = "./assets/Char/Char-ATAS.png"
let playerImageBawah = new Image()
playerImageBawah.src = "./assets/Char/Char-BAWAH.png"
let playerImageKanan2 = new Image()
playerImageKanan2.src = "./assets/Char/Char-KANAN2.png"
let playerImageKiri2 = new Image()
playerImageKiri2.src = "./assets/Char/Char-KIRI2.png"

let playerHPWidth = 200
let playerHPHeight = 25
// alien
let alienWidth = 300
let alienHeight = 200
let alienX = alienWidth
let alienY = alienHeight
let alienSpeed = 10
let alienImage = new Image()
alienImage.src = "./assets/Enemies/Alien/Alien-CHILL.png"
//  alienBullet
let alienBulletWidth = 40
let alienBulletHeight = 75
let alienBulletX = 0
let alienBulletY = 0
let alienBulletSpeed = 10
let alienBulletFrequency = 2000
let alienBulletquantity = 2
let alienBulletImage = new Image()
alienBulletImage.src = "./assets/Enemies/Alien/Alien-Missile.png"

//============[CLASS]==============
class defaultObject {
    constructor(x, y, width, height, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
    }   
}

class Gameboard {
    constructor(width, height, canvas, context, backgroundColor, player, alien, alienBullet, ) {
        this.width = width
        this.height = height
        this.canvas = canvas
        this.context = context
        this.backgroundColor = backgroundColor
        this.player = player
        this.alien = alien
        this.alienBullet = alienBullet
        this.alienBulletContainer = []
        this.lastKeyPress = "a"
        this.isKeyPressed = false
        this.initialize()
    }
    // ==[init]==
    initialize() {
        this.setCanvas()
        this.render()
        this.eventListener()
        this.async1()
        this.async2()
        this.async3()
    }

    // ==[asynchronous]==
    async1() {
        setTimeout(() => {this.checkBoundAlien(); this.async1()}, 75)
    }

    async2() {
        setTimeout(() => {this.addBullet(); this.async2()}, this.alienBullet.frequency)
    }  // >>AKU BERHENTI DISINI, MASUKKIN BULLET KE ARRAY NYA SUDAH DAN KURANG GERAKIN BULLET DAN RENDER BULLET<<

    async3() {
        setTimeout(() => {this.setBullet(); this.async3()}, 50)
    }

    // ==[EventListener]==
    eventListener() {
        addEventListener("keydown", (e) => {
            this.isKeyPressed = true
            if(e.key === "w") this.setPlayer("w")
            if(e.key === "a") this.setPlayer("a")
            if(e.key === "s") this.setPlayer("s")
            if(e.key === "d") this.setPlayer("d")
            if(e.key === " ") console.log("shoot")
        })

        addEventListener("keyup", () => {
            this.isKeyPressed = false
        })
    }

    // ==[player]==
    setPlayer(key) {
        if(key === "w") {this.movePlayerUp();}
        if(key === "a") {this.movePlayerLeft();}
        if(key === "s") {this.movePlayerDown();}
        if(key === "d") {this.movePlayerRight();}
    }

    movePlayerLeft() {
        if(!(this.player.x < 0)) {
            this.player.x -= this.player.speed;
        }
        if (this.player.playerImageKiri === "1") {
            // image change
            this.player.mainImage = this.player.imageKiri[1]
            this.player.playerImageKiri = "2"
        } else if (this.player.playerImageKiri === "2") {
            // image change
            this.player.mainImage = this.player.imageKiri[0]
            this.player.playerImageKiri = "1"
        }
    }

    movePlayerRight() {
        if ((this.player.x + this.player.width < this.width)) {
            this.player.x += this.player.speed; 
        }

        if (this.player.playerImageKanan === "1") {
            this.player.mainImage = this.player.imageKanan[1]
            this.player.playerImageKanan = "2"
        } else if (this.player.playerImageKanan === "2") {
            this.player.mainImage = this.player.imageKanan[0]
            this.player.playerImageKanan = "1"
        }
    }

    movePlayerUp() {
        if (this.player.y > 0 ) {
            this.player.y -= this.player.speed;
        }

        this.player.mainImage = this.player.imageAtas
    }

    movePlayerDown() {
        console.log(this.player.y + this.player.height, this.height)
        if ((this.player.y + this.player.height) < this.height) {
            this.player.y += this.player.speed;
        }
        this.player.mainImage = this.player.imageBawah
    }

    drawPlayer() {
        this.context.drawImage(this.player.mainImage, this.player.x, this.player.y, this.player.width, this.player.height)
    }

    drawHealthPlayer() {
        this.context.fillStyle= "black"
        this.context.strokeRect(10, 10, this.player.HPWidth, this.player.HPHeight)
        this.context.stroke()
        
    }
    
    // ==[alien]==
    checkBoundAlien() {
        // console.log(`condition 1: ${this.width} | ${this.alien.x + this.alien.width}`)
        // console.log(`condition 2: ${0} | ${ this.alien.x}`)
        if(this.width < this.alien.x + this.alien.width) {this.alien.invert = true; console.log("true")}
        if(0 > this.alien.x) {this.alien.invert = false; console.log("false")}
        this.setAlien()
    }

    setAlien() {
        if(this.alien.invert === false) this.alien.x += this.alien.speed
        if(this.alien.invert === true) this.alien.x -= this.alien.speed
        
    }

    drawAlien() {
        this.context.drawImage(this.alien.image, this.alien.x, this.alien.y, this.alien.width, this.alien.height)
    }

    // ==[Alien Bullet]==
    addBullet() {
        for (let i = 0; i < this.alienBullet.quantity; i++) {
            setTimeout(() => {
                this.alienBulletContainer.push(new AlienBullet(this.alien.x, this.alien.y, this.alienBullet.width, this.alienBullet.height, this.alienBullet.image, this.alienBullet.speed, this.alienBullet.frequency, this.alienBullet.quantity)) 
            }, i * 200);     
        }
    }

    setBullet() {
        this.alienBulletContainer.forEach(bullet => {
            bullet.y += this.alienBullet.speed
        });
    }

    drawBulletAlien() {
        this.alienBulletContainer.forEach(bullet => {
            context.drawImage(bullet.image, bullet.x, bullet.y, bullet.width, bullet.height)
        })
    }

    
    // ==[render]==
    setCanvas() {
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvas.style.background = this.backgroundColor
    }

    clearFrame() {
        this.context.clearRect(0, 0, this.width, this.width)
    }

    render() {   
        this.clearFrame()
        this.drawAlien()
        this.drawPlayer()
        this.drawBulletAlien()
        this.drawHealthPlayer()
        requestAnimationFrame(this.render.bind(this))
    }
}

class Alien {
    constructor(x, y, width, height, image, speed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.speed = speed
        this.invert = false
    }
}

class Player {
    constructor(x, y, width, height, imageKanan, imageKiri, imageKanan2, imageKiri2, imageAtas, imageBawah, speed, playerHPwidth, playerHPheight) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.mainImage = imageKanan // default for first launch
        this.imageKanan = [ imageKanan, imageKanan2 ]
        this.imageKiri = [ imageKiri, imageKiri2 ]
        this.imageAtas = imageAtas
        this.imageBawah = imageBawah
        this.speed = speed
        this.playerImageKanan = "1"
        this.playerImageKiri = "1"
        this.health = 100
        this.HPWidth = playerHPWidth
        this.HPHeight = playerHPHeight
    }
}

class Tank extends defaultObject {}

class PlayerBullet {
    constructor(x, y, width, height, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
    }
}

class AlienBullet {
    constructor(x, y, width, height, image, speed, alienBulletFrequency, alienBulletquantity) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.speed = speed
        this.frequency = alienBulletFrequency
        this.quantity = alienBulletquantity
    }
}

//========[Instantiation]====================
const player = new Player(playerX, playerY, playerWidth, playerHeight, playerImageKanan, playerImageKiri, playerImageKanan2, playerImageKiri2, playerImageAtas, playerImageBawah, playerSpeed)
const alien = new Alien(alienX, alienY, alienWidth, alienHeight, alienImage, alienSpeed)
const alienBullet = new AlienBullet(alienBulletX, alienBulletY, alienBulletWidth, alienBulletHeight, alienBulletImage, alienBulletSpeed, alienBulletFrequency, alienBulletquantity)
const gameboard = new Gameboard(canvasWidth, canvasHeight, canvas, context, canvasBackgroundColor, player, alien, alienBullet)

//==========[Global: Event Listener]================
start.addEventListener('click', () => {getUserData(); })

//==================[Global: Function]=============
function getUserData() {
    username = document.getElementById('name').value
    level = document.getElementById('level').value
}

//========[Global: Function Execution]=============
setTimeout(() => console.log(username, level), 3000)



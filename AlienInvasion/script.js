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
let playerSpeed = 10
let playerImageKanan = new Image()
playerImageKanan.src = "./assets/Char/Char-KANAN1.png"
let playerImageKiri = new Image()
playerImageKiri.src = "./assets/Char/Char-KIRI1.png"
let playerImageAtas = new Image()
playerImageAtas.src = "./assets/Char/Char-ATAS.png"
let playerImageBawah = new Image()
playerImageBawah.src = "./assets/Char/Char-BAWAH.png"
// alien
let alienWidth = 300
let alienHeight = 200
let alienX = alienWidth
let alienY = alienHeight
let alienSpeed = 10
let alienImage = new Image()
alienImage.src = "./assets/Enemies/Alien/Alien-CHILL.png"
//  alienBullet
let alienBulletWidth = 10
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
        this.initialize()
    }
    // ==[init]==
    initialize() {
        this.setCanvas()
        this.render()
        this.eventListener()
        this.async1()
        this.async2()
    }

    // ==[asynchronous]==
    async1() {
        setTimeout(() => {this.checkBoundAlien(); this.async1()}, 75)
    }

    async2() {
        setTimeout(() => {this.addBullet(); console.log(this.alienBullet.frequency); this.async2()}, this.alienBullet.frequency)
    }  // >>AKU BERHENTI DISINI, MASUKKIN BULLET KE ARRAY NYA SUDAH DAN KURANG GERAKIN BULLET DAN RENDER BULLET<<

    // ==[EventListener]==
    eventListener() {
        addEventListener("keydown", (e) => {
            if(e.key === "w") this.setPlayer("w")
            if(e.key === "a") this.setPlayer("a")
            if(e.key === "s") this.setPlayer("s")
            if(e.key === "d") this.setPlayer("d")
        })
    }

    // ==[player]==
    setPlayer(key) {
        if(key === "w") {this.player.y -= this.player.speed; this.lastKeyPress = "w"}
        if(key === "a") {this.player.x -= this.player.speed; this.lastKeyPress = "a"}
        if(key === "s") {this.player.y += this.player.speed; this.lastKeyPress = "s"}
        if(key === "d") {this.player.x += this.player.speed; this.lastKeyPress = "d"}
    }

    getPlayerImage() {
        if (this.lastKeyPress === "w") return this.player.imageAtas
        if (this.lastKeyPress === "a") return this.player.imageKiri
        if (this.lastKeyPress === "s") return this.player.imageBawah
        if (this.lastKeyPress === "d") return this.player.imageKanan
    }

    drawPlayer() {
        this.context.drawImage(this.getPlayerImage(), this.player.x, this.player.y, this.player.width, this.player.height)
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
        console.log(`inverted: ${this.alien.invert}`)
        if(this.alien.invert === false) this.alien.x += this.alien.speed
        if(this.alien.invert === true) this.alien.x -= this.alien.speed
        
    }

    drawAlien() {
        this.context.drawImage(this.alien.image, this.alien.x, this.alien.y, this.alien.width, this.alien.height)
    }

    // ==[Alien Bullet]==
    addBullet() {
        this.alienBulletContainer.push(new AlienBullet(this.alien.x, this.alien.y, this.alienBullet.width, this.alienBullet.height, this.alienBullet.image, this.alienBullet.speed, this.alienBullet.frequency, this.alienBullet.quantity))
    }

    setBullet() {
        this.alienBulletContainer.forEach(bullet => {
            bullet.x += this.alienBullet.speed
            bullet.y += this.alienBullet.speed
        });
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

        this.setBullet()
        this.drawAlien()
        this.drawPlayer()
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
    constructor(x, y, width, height, imageKanan, imageKiri, imageAtas, imageBawah, speed, ) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.imageKanan = imageKanan
        this.imageKiri = imageKiri
        this.imageAtas = imageAtas
        this.imageBawah = imageBawah
        this.speed = speed
    }
}

class Tank extends defaultObject {}

class PlayerBullet extends defaultObject {}

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
const player = new Player(playerX, playerY, playerWidth, playerHeight, playerImageKanan, playerImageKiri, playerImageAtas, playerImageBawah, playerSpeed)
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



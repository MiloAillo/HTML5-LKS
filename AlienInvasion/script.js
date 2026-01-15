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
let gameStart = true
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
let alienY = 25
let alienSpeed = 15
let alienImage = new Image()
alienImage.src = "./assets/Enemies/Alien/Alien-CHILL.png"
//  alienBullet
let alienBulletWidth = 40
let alienBulletHeight = 75
let alienBulletX = 0
let alienBulletY = 0
let alienBulletSpeed = 10
let alienBulletFrequency = 2000
let alienBulletquantity = 4
let alienBulletImage = new Image()
alienBulletImage.src = "./assets/Enemies/Alien/Alien-Missile.png"
// playerBullet
let playerBulletWidth = 50
let playerBulletHeight = 10
let playerBulletSpeed = 50
let playerBulletLeft = new Image()
let playerBulletRight = new Image()
let playerBulletUp = new Image()
playerBulletLeft.src = "./assets/Bullet/Bullet-left-normal.png"
playerBulletRight.src = "./assets/Bullet/Bullet-right-normal.png"
playerBulletUp.src = "./assets/Bullet/Bullet.png"
// PlayerAmmo
let playerAmmoWidth = 20
let playerAmmoHeight = 50
// Background
let background = new Image()
let road = new Image()
background.src = "./assets/Background/Theme1/Theme-1-BG.png"
road.src = "./assets/Background/Theme1/Theme-1-Road.png"

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
    constructor(width, height, canvas, context, backgroundColor, player, alien, alienBullet, gameStart, playerBullet, playerAmmo, background, road) {
        this.width = width
        this.height = height
        this.canvas = canvas
        this.context = context
        this.backgroundColor = backgroundColor
        this.player = player
        this.alien = alien
        this.alienBullet = alienBullet
        this.playerBullet = playerBullet
        this.alienBulletContainer = []
        this.playerBulletContainer = []
        this.lastKeyPress = "a"
        this.isKeyPressed = false
        this.gameStart = gameStart
        this.gameWin = false
        this.playerAmmo = playerAmmo
        this.initialize()
        this.background = background
        this.road = road
    }
    // ==[init]==
    initialize() {
        this.setCanvas()
        this.render()
        this.eventListener()
        this.async1()
        this.async2()
        this.async3()
        console.log(this.background)
    }

    // ==[asynchronous]==
    async1() {
        setTimeout(() => {this.checkBoundAlien(); this.async1()}, 75)
    }

    async2() {
        setTimeout(() => {this.addBullet(); this.async2()}, this.alienBullet.frequency)
    }

    async3() {
        setTimeout(() => {this.setBullet(); this.async3()}, 50)
    }

    // Usable Function
    isCollided(obj1, obj2) {
        // console.log(obj1.y, (obj2.y + obj2.height), obj1.x, obj2.x, obj1.x, (obj2.x + obj2.width))
        if( obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x &&obj1.y < obj2.y + obj2.height &&obj1.y + obj1.height > obj2.y  ) {
            return true
        } else {
            return false
        }
    }

    // ==[EventListener]==
    eventListener() {
        addEventListener("keydown", (e) => {
            this.isKeyPressed = true
            if(e.key === "w") {this.setPlayer("w"); this.lastKeyPress = "w"}
            if(e.key === "a") {this.setPlayer("a"); this.lastKeyPress = "a"}
            if(e.key === "s") {this.setPlayer("s"); this.lastKeyPress = "s"}
            if(e.key === "d") {this.setPlayer("d"); this.lastKeyPress = "d"}
            if(e.key === " ") this.ammoCheck(this.lastKeyPress)
            if(e.key === "r") this.ammoReload()
        })

        addEventListener("keyup", () => {
            this.isKeyPressed = false
        })
    }

    // ==[Global Constraint]==
    ammoCheck(key) {
        if(this.playerAmmo.ammo > 0) {
            this.addBulletPlayer(key)
        }
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
        if ((this.player.y + this.player.height) < this.height) {
            this.player.y += this.player.speed;
        }
        this.player.mainImage = this.player.imageBawah
    }

    drawPlayer() {
        this.context.drawImage(this.player.mainImage, this.player.x, this.player.y, this.player.width, this.player.height)
    }
    
    // ==[alien]==
    checkBoundAlien() {
        // console.log(`condition 1: ${this.width} | ${this.alien.x + this.alien.width}`)
        // console.log(`condition 2: ${0} | ${ this.alien.x}`)
        if(this.width < this.alien.x + this.alien.width) {this.alien.invert = true}
        if(0 > this.alien.x) {this.alien.invert = false}
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

    // ==[Player Bullet]==
    addBulletPlayer(direction) {
        if(!this.playerAmmo.isReloading) {
            this.playerAmmo.ammo -= 1
            if (direction === "w") this.playerBulletContainer.push(new PlayerBullet(this.player.x, this.player.y, this.playerBullet.height, this.playerBullet.width, this.playerBullet.imageLeft, this.playerBullet.imageRight, this.playerBullet.imageUp, this.playerBullet.speed, this.playerBullet.imageUp, "up"))
            if (direction === "a") this.playerBulletContainer.push(new PlayerBullet(this.player.x, this.player.y, this.playerBullet.width, this.playerBullet.height, this.playerBullet.imageLeft, this.playerBullet.imageRight, this.playerBullet.imageUp, this.playerBullet.speed, this.playerBullet.imageLeft, "left"))
            if (direction === "d") this.playerBulletContainer.push(new PlayerBullet(this.player.x, this.player.y, this.playerBullet.width, this.playerBullet.height, this.playerBullet.imageLeft, this.playerBullet.imageRight, this.playerBullet.imageUp, this.playerBullet.speed, this.playerBullet.imageRight, "right"))
        }
    }

    setBulletPlayer() {
        this.playerBulletContainer.forEach(bullet => {
            if(bullet.direction === "up") bullet.y -= bullet.speed
            if(bullet.direction === "left") bullet.x -= bullet.speed
            if(bullet.direction === "right") bullet.x += bullet.speed                    
        })
    }

    drawBulletPlayer() {
        this.playerBulletContainer.forEach(bullet => {
            this.context.drawImage(bullet.mainImage, bullet.x, bullet.y, bullet.width, bullet.height)
        })
    }

    // ==[Player Ammo]==
    drawPlayerAmmo() {
        for(let i = 0; i < this.playerAmmo.ammo; i++) {
            this.context.drawImage(this.playerAmmo.image, ((20 * i) + 10), 50, this.playerAmmo.width, this.playerAmmo.height)
        }
    }

    ammoReload() {
        console.log(this.playerAmmo.isReloading)
        this.playerAmmo.isReloading = true
        setTimeout(() => {
            this.playerAmmo.ammo = this.playerAmmo.maximum
            this.playerAmmo.isReloading = false
        }, this.playerAmmo.reloadTime);
    }

    // ==[Health Bar]==
    drawHealthPlayer() {
        // outline
        this.context.fillStyle = "black"
        this.context.strokeRect(10, 10, this.player.HPWidth, this.player.HPHeight)
        this.context.stroke()
        
        this.context.fillStyle = "red"
        this.context.fillRect(10, 10, (this.player.health / 100 * this.player.HPWidth), this.player.HPHeight)
        this.context.stroke()
    }

    setHealthPlayer() {
    for (let i = this.alienBulletContainer.length - 1; i >= 0; i--) {
            const bullet = this.alienBulletContainer[i];
            const check = this.isCollided(this.player, bullet);
            if (check) {
                this.alienBulletContainer.splice(i, 1);
                this.player.health -= 10;
            }
        }
    }

    checkHealthPlayer() {
        if(this.player.health <= 0) {
            this.gameStart = false
        }
    }

    drawHealthAlien() {
        // outline
        this.context.fillStyle = "black"
        this.context.strokeRect(((this.width - this.alien.HPWidth) - 10), 10, this.alien.HPWidth, this.alien.HPHeight)
        this.context.stroke()
        
        this.context.fillStyle = "blue"
        this.context.fillRect(((this.width - this.alien.HPWidth) - 10), 10, (this.alien.health / 100 * this.alien.HPWidth), this.alien.HPHeight)
        this.context.stroke()
    }

    setHealthAlien() {
    for (let i = this.playerBulletContainer.length - 1; i >= 0; i--) {
            const bullet = this.playerBulletContainer[i];
            const check = this.isCollided(this.alien, bullet);
            if (check) {
                this.playerBulletContainer.splice(i, 1);
                this.alien.health -= 1;
            }
        }
    }

    checkHealthAlien() {
        if(this.alien.health <= 0) {
            this.gameWin = true
        }
    }

    // ==[Game State]==
    drawGameOver() {
        this.context.fillStyle = "red"
        this.context.fillRect(0, 0, this.width, this.height)
        this.context.stroke()

        this.context.fillStyle = "black"
        this.context.strokeRect(10, 10, this.player.HPWidth, this.player.HPHeight)
        this.context.stroke()

        this.context.font = "40px sans-serif"
        this.context.fillText("Wasted", (this.width / 2 - 50), (this.height / 2))
    }

    drawGameComplete() {
        this.context.fillStyle = "green"
        this.context.fillRect(0, 0, this.width, this.height)
        this.context.stroke()

        this.context.fillStyle = "black"
        this.context.strokeRect(((this.width - this.alien.HPWidth) - 10), 10, this.alien.HPWidth, this.alien.HPHeight)
        this.context.stroke()

        this.context.font = "40px sans-serif"
        this.context.fillText("You Win", (this.width / 2 - 50), (this.height / 2))
    }
    
    // ==[render]==
    setCanvas() {
        console.log(this.background)
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
        this.setHealthPlayer()
        this.setBulletPlayer()
        this.drawBulletPlayer()
        this.drawHealthAlien()
        this.setHealthAlien()
        this.checkHealthAlien()
        this.drawPlayerAmmo()
        if (this.gameWin) {
            this.drawGameComplete()
        }

        // Set UI
        if(this.gameStart) {
            this.checkHealthPlayer()
        } else {
            this.drawGameOver()
        }

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
        this.health = 100
        this.HPHeight = 50
        this.HPWidth = 400
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

class PlayerAmmo {
    constructor(x, y, width, height, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image // default for first launch
        this.maximum = 10
        this.ammo = 10
        this.reloadTime = 3000 // milisecond
        this.isReloading = false
    }
}

class Tank extends defaultObject {}

class PlayerBullet {
    constructor(x, y, width, height, imageLeft, imageRight, imageUp, speed, mainImage, direction) {
        this.x = x // default value
        this.y = y // default value
        this.width = width
        this.height = height
        this.imageLeft = imageLeft
        this.imageRight = imageRight
        this.imageUp = imageUp
        this.speed = speed
        this.direction = direction // default value
        this.mainImage = mainImage
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
const playerBullet = new PlayerBullet(0, 0, playerBulletWidth, playerBulletHeight, playerBulletLeft, playerBulletRight, playerBulletUp, playerBulletSpeed, "", "left")
const playerAmmo = new PlayerAmmo(0, 0, playerAmmoWidth, playerAmmoHeight, playerBulletUp)
const gameboard = new Gameboard(canvasWidth, canvasHeight, canvas, context, canvasBackgroundColor, player, alien, alienBullet, gameStart, playerBullet, playerAmmo, background, road)

//==========[Global: Event Listener]================
start.addEventListener('click', () => {getUserData(); })

//==================[Global: Function]=============
function getUserData() {
    username = document.getElementById('name').value
    level = document.getElementById('level').value
}

//========[Global: Function Execution]=============
setTimeout(() => console.log(username, level), 3000)



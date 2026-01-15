const username = document.getElementById("username")
const level = document.getElementById("level")


///////// CANVAS /////////////
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

class Pointer {
    constructor(x, y, width, height, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
    }
}

class Gun {
    constructor(x, y, width, height, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
    }
}

class Target {
    constructor(x, y, width, height, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
    }
}

class Gameboard {
    constructor(pointer, gun, targets, targetImage, canvas, context, width, height, canvasColor) {
        this.pointer = pointer
        this.gun = gun
        this.targets = targets
        this.targetImage = targetImage
        this.canvas = canvas
        this.context = context
        this.width = width
        this.height = height
        this.canvasColor = canvasColor

        this.setCanvas()
        this.render()
        this.startTarget()
        this.setTarget()
        this.addEventListener()
        this.Seconds3()
    }

    // canvas
    setCanvas() {
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvas.style.background = this.canvasColor
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.width, this.height)
    }

    //pointer
    setPointer() {
        this.context.drawImage(this.pointer.image, this.pointer.x, this.pointer.y, this.pointer.width, this.pointer.height)
    }

    movePointer(x, y) {
        this.pointer.x = x - (this.pointer.width / 2)
        this.pointer.y = y - (this.pointer.height / 2)
    }

    // gun
    setGun() {
        this.context.drawImage(this.gun.image, this.gun.x, this.gun.y, this.gun.width, this.gun.height)
    }

    moveGun(x) {
        this.gun.x = 300 + (x / 2)
    }

    shot() {
        for (let index = this.targets.length - 1; index >= 0; index--) {
            if (this.isGunned(this.pointer.x, this.pointer.y, this.targets[index].x, this.targets[index].y, this.targets[index].width, this.targets[index].height)) {
                this.targets.splice(index, 1)
                console.log('removed') // either passing parameternya yang salah atau collision systemnya yang salah
            } // gajadi udah bener haha
        }
    }

    // target
    addTarget() {
        const big = Math.random() * (200 - 100) + 100
        const x = Math.random() * (this.width - 0) + 0
        const y = Math.random() * (this.height - 0) + 0

        this.targets.push(new Target(x, y, big, big, this.targetImage))
        console.log('target added')
    }

    setTarget() {
        for (let index = 0; index < this.targets.length; index++) {
            this.context.drawImage(this.targetImage, this.targets[index].x, this.targets[index].y, this.targets[index].width, this.targets[index].height)
        }
    }

    startTarget() {
        for (let index = 0; index < 3; index++) {
            const big = Math.random() * (200 - 100) + 100
            const x = Math.random() * (this.width - 0) + 0
            const y = Math.random() * (this.height - 0) + 0
            this.targets.push(new Target(x, y, big, big, this.targetImage))
        }
        console.log(this.targets)
    }

    // collision system
    isGunned(x1, y1, x2, y2, w2, h2) {
        if (x1 > x2 && x1 < x2 + w2 && y1 > y2 && y1 < y2 + h2) {
            return true
        } else {
            return null
        }
    }

    //event listener
    addEventListener() {
        document.addEventListener("mousemove", (e) => {this.movePointer(e.x, e.y); this.moveGun(e.x)})
        document.addEventListener("click", () => {this.shot()})
    }

    // async
    Seconds3() {
        setTimeout(() => { this.addTarget(); this.Seconds3()}, 3000)
    }

    //render
    render() {
        this.clearCanvas()

        this.setTarget()
        this.setPointer()
        this.setGun()
        requestAnimationFrame(() => this.render())
    }
}

// settings
    // gameboard
    const canvasWidth = 1000
    const canvasHeight = 600
    const background = new Image()
    background.src = "Sprites/background.jpg"

    //pointer
    const pointerImage = new Image()
    pointerImage.src = "Sprites/pointer.png"

    // gun
    const gunWidth = 300
    const gunHeight = 250
    const gunX = 0
    const gunY = canvasHeight - gunHeight
    const gunImage = new Image()
    gunImage.src = "Sprites/gun1.png"

    //target
    const targets = []
    const targetImage = new Image()
    targetImage.src = "Sprites/target1.png"

///// instantiate
const pointer = new Pointer(0, 0, 25, 25, pointerImage)
const gun = new Gun(gunX, gunY, gunWidth, gunHeight, gunImage)
const gameboard = new Gameboard(pointer, gun, targets, targetImage, canvas, context, canvasWidth, canvasHeight, background)
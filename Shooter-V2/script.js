import { switchMenu } from "./communicator.js"
import { backgroundImage, boomImage, canvasSetupProperties, effectsProperties, gunProperties, pointerProperties, targetProperties } from "./properties.js"

let game = null

const lerp = (start, end, t) => {
    return start + (end - start) * t
}

const randomPos = () => {
    const x = Math.random() * (canvasSetupProperties.width - 0) + 0
    const y =  Math.random() * (canvasSetupProperties.height - 0) + 0
    return {x, y}
}

const saveData = (name, value) => {
    const leaderboard = localStorage.getItem("leaderboard")
    console.log(leaderboard)

    if (leaderboard == null) {
        const stringifiedArray = JSON.stringify([
            {name: name, score: value}
        ])
        localStorage.setItem("leaderboard", stringifiedArray)
    } else if (leaderboard) {
        const parsedArray = JSON.parse(leaderboard)
        console.log(parsedArray)

        parsedArray.push({name: name, score: value})

        const stringifiedArray = JSON.stringify(parsedArray)
        localStorage.setItem("leaderboard", stringifiedArray)
    }
}

const cleanup = () => {
    game = null
    switchMenu(true)
}

const isOverlap = (ax, ay, aw, ah, bx, by, bw, bh) => {
    // is a overlap b
    if (
        ax > bx &&
        ax + aw < bx + bw &&
        ay > by &&
        ay + ah < by + bh
    ) return true
    else return false
}

class Gun {
    constructor(gunImage) {
        this.width = gunProperties.width
        this.height = gunProperties.height
        this.x = gunProperties.x
        this.y = gunProperties.y
        this.gunImage = gunImage
    }
}

class Target {
    constructor(x, y, width, height, targetImage) {
        this.width = width || targetProperties.width
        this.height = height || targetProperties.height
        this.x = x || targetProperties.x
        this.y = y || targetProperties.y
        this.targetImage = targetImage
    }
}

class Pointer {
    constructor(pointerImage) {
        this.width = pointerProperties.width
        this.height = pointerProperties.height
        this.x = pointerProperties.x
        this.y = pointerProperties.y
        this.pointerImage = pointerImage
    }
}

class Game {
    constructor(ctx, objects, playerName, difficulty) {
        this.ctx = ctx
        this.objects = objects
        this.playerName = playerName
        this.difficulty = difficulty

        // local variable
        this.lastPointerPos  = {x: 0, y: 0}
        this.targetPointerPos = {x:0, y: 0}
        this.lastGunPos = {x:0, y:0}
        this.isRenderBoom = false
        this.second = 0
        this.minute = 0
        this.targets = []
        this.effects = []
        this.score = 0
        this.isPaused = false
        this.isOver = false
        this.saved = false

        // runner
        this.start()
        this.update()
    }

    start() {
        addEventListener("mousemove", (e) => {this.setPointerPosition(e); this.setGunPosition(e)})
        addEventListener("mousedown", (e) => {this.setRenderBoom(e); this.shoot()})
        addEventListener("keydown", (e) => {
            // console.log(e)
            if (e.key == "Escape") this.changeState()
            if (e.key == "Enter") {
                if(this.isOver && !this.saved) {
                    this.saved = true
                    saveData(this.playerName, this.score)
                    cleanup()
                }
            }
        })

        this.timeService()
        this.addTarget()
        for (let i = 0; i < 3; i++) this.addtargetManual()
    }
    
    update() {
        this.ctx.clearRect(0, 0, canvasSetupProperties.width, canvasSetupProperties.height)
        
        this.checkTime()

        if (!this.isOver) {
            this.drawBackground()
            this.drawTargets()
            if (this.isRenderBoom) this.drawBoom()
            this.drawPointer()
            this.drawGun()
            this.drawEffects()
            this.drawTopBar()
        }

        if(this.isPaused && !this.isOver) {
            this.drawPause()
        }

        if (this.isOver) {
            this.drawOver()
        }

        requestAnimationFrame(() => this.update())
    }

    // ====================================

    changeState() {
        this.isPaused = !this.isPaused
    }

    checkTime() {
        if (this.second <= 0) this.isOver = true
    }

    // ====================================

    drawPause() {
        this.ctx.fillStyle = "#FFFFFF50"
        this.ctx.fillRect(0, 0, canvasSetupProperties.width, canvasSetupProperties.height)
        this.ctx.fillStyle = "#000000"
        this.ctx.font = "30px sans-serif"
        this.ctx.fillText("Game Paused", canvasSetupProperties.width / 2 - 90,  canvasSetupProperties.height / 2)
        this.ctx.font = "20px sans-serif"
        this.ctx.fillText("Press 'esc' to continue", canvasSetupProperties.width / 2 - 92,  canvasSetupProperties.height / 2 + 25)
    }

    // ====================================

    drawOver() {
        this.ctx.fillStyle = "#f7ffcfaa"
        this.ctx.fillRect(0, 0, canvasSetupProperties.width, canvasSetupProperties.height)
        this.ctx.fillStyle = "#000000"
        this.ctx.font = "30px sans-serif"
        this.ctx.fillText("Time's up!", canvasSetupProperties.width / 2 - 70,  canvasSetupProperties.height / 2)
        this.ctx.font = "20px sans-serif"
        this.ctx.fillText(`score: ${this.score}`, canvasSetupProperties.width / 2 - 35,  canvasSetupProperties.height / 2 + 25)

        this.ctx.fillText("press 'Enter' to go back to main menu", canvasSetupProperties.width / 2 - 170,  canvasSetupProperties.height - 50)

        // this.ctx.fillStyle = "#ffffffff"
        // this.ctx.fillRect(50, canvasSetupProperties.height - 100, 400, 75)
        // this.ctx.fillRect(canvasSetupProperties.width - 450, canvasSetupProperties.height - 100, 400, 75)
    }

    // ====================================

    setPointerPosition(e) {
        if(!this.isPaused) {
            this.objects.pointer.x = e.x
            this.objects.pointer.y = e.y
        }
    }

    drawPointer() {
        const lerpedX = lerp(this.lastPointerPos.x, this.objects.pointer.x, 0.1)
        const lerpedY = lerp(this.lastPointerPos.y, this.objects.pointer.y, 0.1)

        this.lastPointerPos.x = lerpedX
        this.lastPointerPos.y = lerpedY

        this.ctx.drawImage(this.objects.pointer.pointerImage, lerpedX, lerpedY, pointerProperties.width, pointerProperties.height)
    }

    // ===================================

    setRenderBoom() {
        if (!this.isPaused) {
            this.isRenderBoom = true
            let timeoutRemoval = setTimeout(() => {
                this.isRenderBoom = false
            }, 25)
        }
    }

    setGunPosition(e) {
        if (!this.isPaused) {
            this.objects.gun.x = e.x + 50
            this.objects.gun.y = canvasSetupProperties.height - (this.objects.gun.height + e.y / 25) + 25
        }
    }    

    drawBoom() {
        // console.log(boomImage, this.lastPointerPos.x, this.lastPointerPos.y)
        this.ctx.drawImage(boomImage, this.lastPointerPos.x - 15, this.lastPointerPos.y - 15)
    }

    // ===================================

    drawGun() {
        // console.log(this.lastGunPos.x, this.objects.gun.x, 0.01)
        const lerpedX = lerp(this.lastGunPos.x, this.objects.gun.x, 0.05)
        const lerpedY = lerp(this.lastGunPos.y, this.objects.gun.y, 0.05)

        this.lastGunPos.x = lerpedX
        this.lastGunPos.y = lerpedY

        this.ctx.drawImage(this.objects.gun.gunImage, lerpedX, lerpedY, 200, 150)
    }

    // ===================================
    
    drawBackground() {
        this.ctx.drawImage(backgroundImage, 0, 0, canvasSetupProperties.width, canvasSetupProperties.height)
    }

    // ==================================

    timeService() {
        if (this.difficulty === "easy") this.second = 30
        if (this.difficulty === "medium") this.second = 20
        if (this.difficulty === "hard") this.second = 15

        setInterval(() => {
            if (!this.isPaused) {
                this.second -= 1
            }
        }, 1000)
    }

    // ===================================

    drawTopBar() {
        this.ctx.fillStyle = "#00000075"
        this.ctx.fillRect(0, 0, canvasSetupProperties.width, 50)

        this.ctx.font = "25px sans-serif"
        this.ctx.fillStyle = "#FFFFFF"
        this.ctx.fillText(`${this.playerName}`, 25, 35)
        this.ctx.fillText(`Time: ${this.minute < 10 ? "0" : ""}${this.minute}:${this.second < 10 ? "0" : ""}${this.second}`, 450, 35)
        this.ctx.fillText(`Score: ${this.score}`, canvasSetupProperties.width - 125, 35)
    }

    // ====================================

    addtargetManual() {
        this.targets.push(new Target(randomPos().x, randomPos().y, undefined, undefined, this.objects.target.targetImage))
    }

    addTarget() {
        console.log(this.difficulty)
        setInterval(() => {
            if (!this.isPaused) {
                this.targets.push(new Target(randomPos().x, randomPos().y, undefined, undefined, this.objects.target.targetImage))
                console.info("target added")
            }
        }, this.difficulty === "easy" ? 3000 : this.difficulty === "medium" ? 2000 : 750)
    }

    drawTargets() {
        this.targets.forEach(target => {
            this.ctx.drawImage(target.targetImage, target.x, target.y, target.width, target.height)
        });
    }

    // ====================================

    shoot() {
        if (!this.isPaused) {
            let isHit = false
    
            this.targets.forEach((target, index) => {
                if (isOverlap(this.lastPointerPos.x, this.lastPointerPos.y, pointerProperties.width, pointerProperties.height, target.x, target.y, target.width, target.height)) {
                    this.targets.splice(index, 1)
                    this.score += 1
                    isHit = true
                    this.addEffect("+1", target.x, target.y, "#000000")
                }
            })
    
            if (!isHit) {
                this.second -= 5
                this.addEffect("-5", this.lastPointerPos.x, this.lastPointerPos.y, "#fa0f0fff")
            }
        }
    }

    addEffect(text, x, y, color) {
        this.effects.push({
            text,
            x,
            y,
            time: 0,
            fixedY: y,
            color
        })
    }

    drawEffects() {
        this.effects.forEach((effect, index) => {
            if (!this.isPaused) {
                if (effect.time >= effectsProperties.timeout) this.effects.splice(index, 1)
                
                effect.time += 1
    
                const lerpedY = lerp(effect.y, effect.fixedY - effectsProperties.distance, 0.1)
    
                effect.y = lerpedY
            }
            this.ctx.fillStyle = effect.color
            this.ctx.fillText(effect.text, effect.x, effect.y)
        });
    }
}

// html property
const canvasInitialSetup = (canvas) => {
    canvas.width = canvasSetupProperties.width
    canvas.height = canvasSetupProperties.height
    canvas.style.display = "block"
    canvas.style.backgroundColor = canvasSetupProperties.background
    canvas.style.boxShadow = "1px 1px 10px #00000023"
}

export const gameStart = (username, difficulty, gun, target, canvas, ctx) => {
    console.info(username, difficulty, gun, target, canvas, ctx)
    
    if (!username || !difficulty || !gun || !target || !canvas || !ctx) return

    // initial setup
    canvasInitialSetup(canvas)
    const pointerImage = new Image()
    pointerImage.src = "./sprites/pointer.png"

    // instantiation
    game = new Game(ctx, {
        gun: new Gun(gun),
        target: new Target(undefined, undefined, undefined, undefined, target),
        pointer: new Pointer(pointerImage)
    }, username, difficulty)
}
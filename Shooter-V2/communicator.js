import { gameStart } from "./script.js"

const username = document.getElementById("username")
const difficulty = document.getElementById("level")
const guns = document.getElementsByName("gun")
const targets = document.getElementsByName("target")
const playButton = document.getElementById("play-button")

const mainMenu = document.getElementById("main-menu")
const instruction = document.getElementById("instruction")
const content = document.getElementById("content")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const gun1 = new Image()
gun1.src = "./sprites/gun1.png"

const gun2 = new Image()
gun2.src = "./sprites/gun2.png"

const target1 = new Image()
target1.src = "./sprites/target1.png"

const target2 = new Image()
target2.src = "./sprites/target2.png"

const target3 = new Image()
target3.src = "./sprites/target3.png"

const gunsMap = {
    gun1,
    gun2
}

const targetsMap = {
    target1,
    target2,
    target3
}

export const switchMenu = (state) => {
    if (state === true) {
        mainMenu.style.display = "flex"
        instruction.style.display = "flex"
        content.style.display = "flex"

    }

    if (state === false) {
        content.style.display = "none"
        mainMenu.style.display = "none"
        instruction.style.display = "none"
    }
} 

playButton.addEventListener("click", () => {
    let selectedGun = null
    let selectedTarget = null

    for (const gun of guns) {
        if (gun.checked) {
            selectedGun = gunsMap[gun.value]
            break
        }
    }

    for (const target of targets) {
        if (target.checked) {
            selectedTarget = targetsMap[target.value]
            break
        }
    }

    if (username.value !== "" || selectedGun != undefined || selectedTarget != undefined) {
        gameStart(username.value, difficulty.value, selectedGun, selectedTarget, canvas, ctx)
        switchMenu(false)
    }
})
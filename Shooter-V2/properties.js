export const canvasSetupProperties = {
    height: 600,
    width: 1000,
    background: "#F9FBFD"
}

export const gunProperties = {
    height: 150,
    width: 50,
    x: 2000,
    y: 2000
}

export const targetProperties = {
    height: 100,
    width: 100,
    x: 0,
    y: 0,
}

export const pointerProperties = {
    height: 50,
    width: 50,
    x: 2000,
    y: 2000,
}

export const effectsProperties = {
    distance: 50,
    timeout: 30
}

const boomImage = new Image()
boomImage.src = "./sprites/boom.png"
export { boomImage }

const backgroundImage = new Image()
backgroundImage.src = "./sprites/background.jpg"
export { backgroundImage }
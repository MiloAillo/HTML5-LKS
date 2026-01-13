// html property
export const gameStart = (username, difficulty, gun, target) => {
    console.info(username, difficulty, gun, target)
    
    if (!username || !difficulty || !gun || !target) return

    console.log("starting...")
}
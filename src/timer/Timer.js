export class Timer {
    elapsedTime = 0;
    timerInMiliseconds;

    constructor(timerInMiliseconds) {
        this.elapsedTime = 0;
        this.timerInMiliseconds = timerInMiliseconds;
    }

    tick(deltaTime) {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime < this.timerInMiliseconds) return false;

        console.log('timer(deltaTime, timerInMiliseconds):' + this.timerInMiliseconds + ' passed.');

        this.elapsedTime = 0;
        return true;
    }

    
}
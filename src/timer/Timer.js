export class Timer {
    elapsedTime = 0;
    timerInMiliseconds;
    isActive = true;

    constructor(timerInMiliseconds) {
        this.elapsedTime = 0;
        this.timerInMiliseconds = timerInMiliseconds;
        this.isActive = true;
    }

    tick(deltaTime) {
        if (!this.isActive) return;

        this.elapsedTime += deltaTime;

        if (this.elapsedTime < this.timerInMiliseconds) return false;

        //console.log('timer(deltaTime, timerInMiliseconds):' + this.timerInMiliseconds + ' passed.');

        this.elapsedTime = 0;
        return true;
    }

    
}
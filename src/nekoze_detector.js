export class NekozeDetector {
    constructor() {
        this.earText = document.getElementById('right-ear');
        this.shoulderText = document.getElementById('right-shoulder');
        this.angleText = document.getElementById('neck-angle');
        this.body = document.getElementsByTagName('body').item(0);
        this.audio = document.getElementById('audio');
        this.angleThreshold = 50;
        this.counter = 0;
        this.rightMode = false;
        this.detectionCount = 1200; // about 1 min
    }

    detect(poses) {
        if (poses.length < 1) {
            return;
        }

        const pose = poses[0];

        if (pose.keypoints[3] && pose.keypoints[5]) {
            this.rightMode = pose.keypoints[3].x > pose.keypoints[5].x;
        }

        let earKeyPoint = null;
        let shoulderKeyPoint = null;

        if (this.rightMode) {
            earKeyPoint = pose.keypoints[4];
            shoulderKeyPoint = pose.keypoints[6];
            if (!earKeyPoint || !shoulderKeyPoint) {
                return;
            }
        } else {
            earKeyPoint = pose.keypoints[3];
            shoulderKeyPoint = pose.keypoints[5];
            if (!earKeyPoint || !shoulderKeyPoint) {
                return;
            }
        }

        this.earText.innerText = `x ${earKeyPoint.x.toFixed(2)} y ${earKeyPoint.y.toFixed(2)}`;
        this.shoulderText.innerText = `x ${shoulderKeyPoint.x.toFixed(2)} y ${shoulderKeyPoint.y.toFixed(2)}`;

        const xOffset = earKeyPoint.x - shoulderKeyPoint.x;
        const yOffset = shoulderKeyPoint.y - earKeyPoint.y;

        const neckAngle = Math.atan2(yOffset, xOffset) * 180 / Math.PI;
        this.angleText.innerText = `${neckAngle.toFixed(2)} degrees ${this.rightMode ? 'right' : 'left'} counter ${this.counter}`;

        if (this.rightMode && neckAngle < this.angleThreshold
             || !this.rightMode && neckAngle > 180 - this.angleThreshold) {
            this.counter++;
        } else {
            this.counter = 0;
        }

        if (this.counter > this.detectionCount) {
            this.body.style.backgroundColor = 'red';
            if (this.counter === this.detectionCount + 1) {
                this.audio.play();
            }
        } else {
            this.body.style.backgroundColor = 'white';
        }
    }
}

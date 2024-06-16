import {DrawingUtils, FilesetResolver, HandLandmarker} from "@mediapipe/tasks-vision";

export default class HandPoseDetector {

    constructor(videoElement, canvasElement) {
        this.videoElement = videoElement;
        this.canvasElement = canvasElement;
        this.canvasCtx = canvasElement.getContext("2d");
        this.drawingUtils = new DrawingUtils(this.canvasCtx);
        this.handLandmarker = null;
    }

    async loadHandLandmarker() {
        try {
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");

            this.handLandmarker = await HandLandmarker.createFromOptions(
                vision,
                {
                    baseOptions: {
                        modelAssetPath: "./assets/hand_landmarker.task",
                        delegate: "CPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 2
                });
        } catch (e) {
            console.error(e);
        }
    }

    getHandPrediction() {
        //start detection
        const startTimeMs = performance.now();
        this.results = this.handLandmarker.detectForVideo(this.videoElement, startTimeMs);

        this.drawCanvas();

        return this.results;
    }

    drawCanvas() {
        //overlay canvas on video.
        this.canvasElement.width = this.videoElement.videoWidth;
        this.canvasElement.height = this.videoElement.videoHeight;

        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        if (this.results.landmarks) {
            for (const landmarks of this.results.landmarks) {
                this.drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
                    color: "#00FF00",
                    lineWidth: 5
                });
                this.drawingUtils.drawLandmarks(landmarks, {color: "#FF0000", lineWidth: 2});
            }
        }
    }
}
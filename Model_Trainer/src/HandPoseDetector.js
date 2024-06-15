import {DrawingUtils, FilesetResolver, HandLandmarker} from "@mediapipe/tasks-vision";

export default class HandPoseDetector {

    constructor(videoElement, canvasElement) {
        this.videoElement = videoElement;
        this.canvasElement = canvasElement;
        this.canvasCtx = canvasElement.getContext("2d");
        this.drawingUtils = new DrawingUtils(this.canvasCtx);
        this.handLandmarker = null;
        this.gestures = {
            holstered: [],
            drawn: [],
            fired: []
        }
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

    startPredicting() {
        //start detection
        const startTimeMs = performance.now();
        this.results = this.handLandmarker.detectForVideo(this.videoElement, startTimeMs);

        this.drawCanvas();
        // console.log(this.results);

        // Call this function again to keep predicting when the browser is ready.
        window.requestAnimationFrame(() => {this.startPredicting()});
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

    recordGesture(gestureType) {
        console.log(`Now recording: ${gestureType}`);

        //If 100 landmarks are recorded quit the function.
        if (this.gestures[gestureType].length >= 100) {
            console.log(`Finished recording: ${gestureType}`);
            return
        }

        if (this.results && this.results.landmarks && this.results.landmarks.length > 0) {
            this.results.handedness[0].forEach((hand, index) => {
                if (hand.categoryName !== "Right") return;
                console.log(this.results.landmarks[index]);
                this.gestures[gestureType].push(this.results.landmarks[index]);
            });
        }

        //recursively call the function.
        setTimeout(() => this.recordGesture(gestureType), 200);
    }

    downloadGestures() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.gestures, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "gestures.json");
        document.body.appendChild(downloadAnchorNode); // Required for Firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}
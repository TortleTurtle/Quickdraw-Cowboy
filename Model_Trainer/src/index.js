import {DrawingUtils, FilesetResolver, HandLandmarker} from "@mediapipe/tasks-vision";
import './style.css'

require('../assets/hand_landmarker.task'); //import to bundle it.
const videoElement = document.getElementById('inputVideo');
const canvasElement = document.getElementById("outputCanvas");
const canvasCtx = canvasElement.getContext("2d");
const drawingUtils = new DrawingUtils(canvasCtx);
let handLandmarker;

async function loadHandLandmarker() {
    try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");

        handLandmarker = await HandLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath: "./assets/hand_landmarker.task",
                    delegate: "CPU"
                },
                runningMode: "VIDEO",
                numHands: 2
            });

        console.log("Model loaded");
    } catch (e) {
        console.error(e);
    }
}
async function connectWebcam(){

    // Check if getUserMedia is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request access to the webcam and attach to video element.
        videoElement.srcObject = await navigator.mediaDevices.getUserMedia({video: true});

        // Wait for the video to load
        await new Promise(resolve => {
            videoElement.onloadedmetadata = () => resolve();
        });

    } else {
        console.error('getUserMedia is not supported by this browser');
    }
}

function predict() {
    //start detection
    const startTimeMs = performance.now();
    const results = handLandmarker.detectForVideo(videoElement, startTimeMs);

    console.log(results);
    drawCanvas(results);

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predict);
}
function drawCanvas(results) {
    //overlay canvas on video.
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.landmarks) {
        for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 5
            });
            drawingUtils.drawLandmarks(landmarks, {color: "#FF0000", lineWidth: 2});
        }
    }
}

async function main() {
    await loadHandLandmarker();
    await connectWebcam();
    //start prediction;
    predict();
}

main();
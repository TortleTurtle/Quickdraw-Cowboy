import {DrawingUtils, FilesetResolver, HandLandmarker} from "@mediapipe/tasks-vision";
import HandPoseDetector from "./HandPoseDetector";
import './style.css'
import ModelTrainer from "./ModelTrainer";

const videoElement = document.getElementById('inputVideo');
const canvasElement = document.getElementById("outputCanvas");

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

async function main() {

    const handPoseDetector = new HandPoseDetector(videoElement, canvasElement);
    const modelTrainer = new ModelTrainer();

    await handPoseDetector.loadHandLandmarker();
    await connectWebcam();
    //start prediction;
    handPoseDetector.startPredicting();

    //create event listeners.
    document.getElementById("recordHolstered").addEventListener("click", () => {
        handPoseDetector.recordGesture("holstered");
    });
    document.getElementById("recordDrawn").addEventListener("click", () => {
        handPoseDetector.recordGesture("drawn");
    });
    document.getElementById("recordFired").addEventListener("click", () => {
        handPoseDetector.recordGesture("fired");
    });
    document.getElementById("download").addEventListener("click", () => {
        handPoseDetector.downloadGestures();
    });
    document.getElementById("loadModel").addEventListener("click", () => {
        modelTrainer.loadModel();
    })
    document.getElementById("loadData").addEventListener("click", () => {
        modelTrainer.loadData();
    });
    document.getElementById("trainModel").addEventListener("click", () => {
        modelTrainer.trainModel();
    });
    document.getElementById("testModel").addEventListener("click", () => {
        modelTrainer.testModel();
    });
}

main();
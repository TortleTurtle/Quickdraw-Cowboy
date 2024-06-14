import {DrawingUtils, FilesetResolver, HandLandmarker} from "@mediapipe/tasks-vision";
import HandPoseDetector from "./HandPoseDetector";
import './style.css'

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
    await handPoseDetector.loadHandLandmarker();
    await connectWebcam();
    //start prediction;
    handPoseDetector.startPredicting();
}

main();
import HandPoseDetector from "./HandPoseDetector";
import GestureClassifier from "./GestureClassifier";
import "./style.css";

const videoElement = document.getElementById("inputVideo");
const canvasElement = document.getElementById("outputCanvas");
const instructions = document.getElementById("instructions");
const closeBtn = document.getElementById("closeBtn");

const handPoseDetector = new HandPoseDetector(videoElement, canvasElement);
const gestureClassiffier = new GestureClassifier();

let holstered = false;
let drawn = false;
let drawnAlert = false;

let timer = 0; //time in ms
let lastTimestamp = performance.now();

async function setup(){
    await connectWebcam();
    await handPoseDetector.loadHandLandmarker();
    await gestureClassiffier.loadModel();

    closeBtn.addEventListener('click', () => {
        instructions.style.display = "none";
        loop();
    });
}

async function loop() {
    const handResults = handPoseDetector.getHandPrediction();
    const input = gestureClassiffier.prepareData(handResults);

    if (input) {
        const classificationResult = await gestureClassiffier.classify(input);

        if (classificationResult[0].confidence > 0.9) {
            switch (classificationResult[0].label) {
                case "holstered":
                    if (!holstered){
                        holstered = true;
                        console.log("Wait for the signal!");
                        setTimeout(() => {
                            console.log("DRAW!");
                            timer = 0;
                            drawnAlert = true;
                        }, 2000);
                    }
                    break;
                case "drawn":
                    if (holstered && drawnAlert && !drawn){
                        drawn = true;
                        console.log("FIRE!");
                    }
                    break;
                case "fired":
                    if (holstered && drawnAlert && drawn) {
                        console.log(timer);
                        holstered = false;
                        drawn = false;
                        drawnAlert = false;
                    }
                    break;
            }
        }
    }

    if (drawnAlert) {
        const currentTimestamp = performance.now();
        const deltaTime = currentTimestamp - lastTimestamp;
        timer += deltaTime;
        lastTimestamp = currentTimestamp;
    } else {
        lastTimestamp = performance.now();
    }

    requestAnimationFrame(loop);
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

setup();
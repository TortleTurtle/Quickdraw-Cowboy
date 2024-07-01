import HandPoseDetector from "./HandPoseDetector";
import GestureClassifier from "./GestureClassifier";
import "./style.css";

const videoElement = document.getElementById("inputVideo");
const canvasElement = document.getElementById("outputCanvas");

//instructions pop-up.
const instructions = document.getElementById("instructions");
const closeBtn = document.getElementById("closeBtn");

//player feedback
const crosshairImg = document.getElementById("crosshairImg");
const impactImg = document.getElementById("impactImg");
const bellToll = new Audio("./assets/soundEffects/bell_toll_sound_effect.mp3");
const gunCock = new Audio("./assets/soundEffects/Cocked_sound_effect.mp3");
const gunShot = new Audio("./assets/soundEffects/Shoot_sound_effect.mp3");

const handPoseDetector = new HandPoseDetector(videoElement, canvasElement);
const gestureClassiffier = new GestureClassifier();

let holstered = false;
let drawn = false;
let drawnAlert = false;

const timerDisplay = document.getElementById("timer");
let timer = 0; //time in ms
let lastTimestamp = performance.now();

async function setup(){
    await connectWebcam();
    await handPoseDetector.loadHandLandmarker();
    await gestureClassiffier.loadModel();

    while (!bellToll.HAVE_ENOUGH_DATA && !gunCock.HAVE_ENOUGH_DATA && !gunShot.HAVE_ENOUGH_DATA){
        console.log("Loading audio");
    }

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
                        //reset images.
                        timer = 0;
                        crosshairImg.style.display = "none";
                        impactImg.style.display = "none";

                        holstered = true;
                        setTimeout(async () => {
                            await bellToll.play();
                            drawnAlert = true;
                        }, 2000);
                    }
                    break;
                case "drawn":
                    if (holstered && drawnAlert && !drawn){
                        await gunCock.play();
                        crosshairImg.style.display = "block";
                        drawn = true;
                    }
                    break;
                case "fired":
                    if (holstered && drawnAlert && drawn) {
                        await gunShot.play();
                        impactImg.style.display = "block";
                        //reset game state
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

        // Convert to seconds and update display.
        const seconds = (timer / 1000).toFixed(3); //Keep 3 decimal places
        timerDisplay.textContent = `${seconds}s`;
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
import ml5 from "ml5";

export default class GestureClassifier {
    constructor() {
        this.ml5 = ml5;
        this.options ={
            inputs: 63, // 21 landmarks * 3 coordinates (x, y, z)
            outputs: 3, // Number of labels
            task: 'classification',
            debug: true
        }
    }

    async loadModel(){
        this.model = ml5.neuralNetwork(this.options);

        await this.model.load({
            model: 'assets/model/model.json',
            metadata: 'assets/model/model_meta.json',
            weights: 'assets/model/model.weights.bin'
        });
        console.log("model loaded!");
    }

    prepareData(handPoseResults) {
        if (handPoseResults.landmarks.length < 1) return;

        //find right hand.
        let rightHand;
        handPoseResults.handedness.forEach((hand, index) => {
            if (hand[0].categoryName !== "Right") return;
            rightHand = handPoseResults.landmarks[index];
            //create flattened array for input.
        });

        if (rightHand) return rightHand.map(landmark => [landmark.x, landmark.y, landmark.z]).flat();
    }

    classify(input){
        return this.model.classify(input);
    }
}
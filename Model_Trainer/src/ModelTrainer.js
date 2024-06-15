
export default class ModelTrainer {
    constructor() {
        this.ml5 = null;
        this.testData = {};
        this.trainData = {};
    }

    loadModel(){

    }

    async loadTrainingData(){
        try {
            const trainingData = await fetch('./assets/train.json');
            const testingData = await fetch('./assets/test.json');

            if (!trainingData && !testingData) {
                console.log("failed fetching train or test data");
                return;
            }
            this.trainData = await trainingData.json();
            this.testData = await testingData.json();

            console.log(this.trainData);
            console.log(this.testData);
        } catch (e) {
            console.error(e);
        }

    }

    trainModel(){

    }

    testModel(){

    }
}
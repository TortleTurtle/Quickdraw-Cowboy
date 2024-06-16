import ml5 from "ml5";

export default class ModelTrainer {
    constructor() {
        this.ml5 = ml5;
        this.testData = {};
        this.trainData = {};
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

    async loadData(){
        try {
            const trainingData = await fetch('./assets/training_data/1.json');
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
    prepareDataset(data) {
        //Prepare data
        const dataset = [];

        for (const [label, samples] of Object.entries(data)) {
            samples.forEach((sample, index) => {
                //increase weight for thumbs
                // if (index === 1 || index === 2 || index === 3 || index === 4) {
                //     sample[index].x *= 10;
                //     sample[index].y *= 10;
                //     sample[index].z *= 10;
                // }

                //create a big array containing all landmarks xyz values.
                const inputs = sample.map(landmark => [landmark.x, landmark.y, landmark.z]).flat();
                dataset.push({ inputs, label });
            });
        }
        return dataset;
    }

    async trainModel(){
        if (!this.trainData) {
            console.log("Training data not loaded!");
            return;
        }

        const dataset = this.prepareDataset(this.trainData);
        //Create model if not yet created;
        if (!this.model) {
            this.model = this.ml5.neuralNetwork(this.options);
        }

        dataset.forEach((data) => {
            this.model.addData(data.inputs, [data.label]);
        });

        this.model.normalizeData();

        const trainingOptions = {
            epochs: 50,
            batchSize: 5 //batch size 10 as we have 100 samples.
        }
        const finishedTraining = () => {
            this.model.save();
        }

        await this.model.train(trainingOptions, finishedTraining.bind(this));
    }

    async testModel(){
        if (!this.model) {
            console.error("Model not loaded/trained yet!");
            return;
        }

        // Prepare test data
        const dataset = this.prepareDataset(this.testData);
        console.log(dataset);
        const labels = ["holstered", "drawn", "fired"]; //use this array to create 3x3 matrix.
        //Create the matrix.
        const confusionMatrix = Array.from({length: labels.length}, //Create an array with depth 3.
            //on each position put an array with depth 3 and a value of 0.
            () => Array(labels.length).fill(0));

        let correct = 0;

        console.log("Beginning test");

        for (const data of dataset) {
            console.log("testing");
            const results = await this.model.classify(data.inputs);
            const predictedLabel = results[0].label;

            //get the index of the labels
            const correctLabelIndex = labels.indexOf(data.label);
            const predictedLabelIndex = labels.indexOf(predictedLabel);

            /*increase the number on the position in the matrix.
            * I.e. correct label is "holstered" so index 0
            * predicted label is "fired" so index 2
            * increment the 3rd number in the first array
            * confusionMatrix[0][2]++;
            */
            confusionMatrix[correctLabelIndex][predictedLabelIndex]++;

            if (predictedLabel === data.label) {
                correct++;
            }
        }

        console.log(`Accuracy: ${(correct / dataset.length) * 100}%`);
        console.log(confusionMatrix);
    }
}
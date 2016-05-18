var fs = require('fs')
var dclassify = require('dclassify')

var Classifier = dclassify.Classifier
var DataSet = dclassify.DataSet
var Document = dclassify.Document

var data = new DataSet()
var classifier = new Classifier()

var dataUnacc = []
var dataAcc = []
var dataGood = []
var dataVgood = []

var trainDataset = function (datasetPath) {
    // read dataset file
    var trainingDataContains = fs.readFileSync(datasetPath, 'utf8')
    var trainingDataRows = trainingDataContains.split("\n")

    // create document
    for (var i = 0 ; i < trainingDataRows.length ; i++) {
        var lineArray = trainingDataRows[i].toString().split(",")
        var cat = lineArray[6]
        lineArray.pop()

        if (cat === 'unacc') {
            dataUnacc.push(new Document('d_unacc' + i, lineArray))
        } else if (cat === 'acc') {
            dataAcc.push(new Document('d_acc' + i, lineArray))
        } else if (cat === 'good') {
            dataGood.push(new Document('d_good' + i, lineArray))
        } else if (cat === 'vgood') {
            dataVgood.push(new Document('d_vgood' + i, lineArray))
        }

    }

    // add documents to dataset using proper category
    data.add('unacc', dataUnacc)
    data.add('acc', dataAcc)
    data.add('good', dataGood)
    data.add('vgood', dataVgood)

    // data training
    classifier.train(data)
    console.log('Data trained successfuly')
}

var classifyDataset = function (testDatasetPath) {
    var testingDataContains = fs.readFileSync(testDatasetPath, 'utf8')
    var testingDataRows = testingDataContains.split("\n")

    // do data testing
    var classificationRow = ""
    for (var j = 0 ; j < testingDataRows.length ; j++) {
        if (testingDataRows[j] !== '') {
            var testing_data_row_array = testingDataRows[j].split(",")
            var documentTest = new Document('test'+j, testing_data_row_array)

            var result = classifier.classify(documentTest)
            classificationRow += testingDataRows[j] + "," + result.category + "," + result.probability + "\n"
        }
    }

    // write to file
    fs.writeFileSync('./dataset/classification.result', classificationRow, 'utf8', 'w+')
    console.log('Data classified successfully. Result generated at dataset/classification.result')
}

module.exports.trainDataset = trainDataset
module.exports.classifyDataset = classifyDataset
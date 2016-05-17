var fs = require('fs')
var dclassify = require('dclassify')

var Classifier = dclassify.Classifier
var DataSet = dclassify.DataSet
var Document = dclassify.Document

var data = new DataSet()

var data_unacc = []
var data_acc = []
var data_good = []
var data_vgood = []

// read dataset file
var training_data_contains = fs.readFileSync('./dataset/training.data', 'utf8')
var training_data_rows = training_data_contains.split("\n")

// create document
for (var i = 0 ; i < training_data_rows.length ; i++) {
    var line_array = training_data_rows[i].toString().split(",")
    var cat = line_array[6]
    line_array.pop()

    if (cat === 'unacc') {
        data_unacc.push(new Document('d_unacc' + i, line_array))
    } else if (cat === 'acc') {
        data_acc.push(new Document('d_acc' + i, line_array))
    } else if (cat === 'good') {
        data_good.push(new Document('d_good' + i, line_array))
    } else if (cat === 'vgood') {
        data_vgood.push(new Document('d_vgood' + i, line_array))
    }

}

// add documents to dataset using proper category
data.add('unacc', data_unacc)
data.add('acc', data_acc)
data.add('good', data_good)
data.add('vgood', data_vgood)

// data training
var classifier = new Classifier()
classifier.train(data)

var testing_data_contains = fs.readFileSync('./dataset/testing.data', 'utf8')
var testing_data_rows = testing_data_contains.split("\n")

// do data testing
var classification_row = ""
for (var j = 0 ; j < testing_data_rows.length ; j++) {
    if (testing_data_rows[j] !== '') {
        var testing_data_row_array = testing_data_rows[j].split(",")
        var documentTest = new Document('test'+j, testing_data_row_array)

        var result = classifier.classify(documentTest)
        classification_row += testing_data_rows[j] + "," + result.category + "," + result.probability + "\n"
    }
}

// write to file
fs.writeFileSync('./dataset/classification.result', classification_row, 'utf8', 'w+')

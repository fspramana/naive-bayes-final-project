var fs = require('fs')
var inquirer = require('inquirer')

var dclassify = require('dclassify');

var Classifier = dclassify.Classifier;
var DataSet = dclassify.DataSet;
var Document = dclassify.Document;

var data = new DataSet()

var data_unacc = []
var data_acc = []
var data_good = []
var data_vgood = []

// read dataset file
var file_contains = fs.readFileSync('./dataset/car.data', 'utf8')
var file_contains_row = file_contains.split("\n")

// create document
for (var i = 0 ; i < file_contains_row.length ; i++) {
    var line_array = file_contains_row[i].toString().split(",");
    var cat = line_array[6];
    line_array.pop();

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
var classifier = new Classifier({ applyInverse: true })
classifier.train(data)

// request input..
inquirer.prompt([
    {
        type: 'list',
        name: 'buying_attr',
        message: 'Select buying attribute',
        choices: [
            'vhigh',
            'high',
            'med',
            'low'
        ]
    },
    {
        type: 'list',
        name: 'maint_attr',
        message: 'Select maint attribute',
        choices: [
            'vhigh',
            'high',
            'med',
            'low'
        ]
    },
    {
        type: 'list',
        name: 'door_attr',
        message: 'Select door attribute',
        choices: [
            '2',
            '3',
            '4',
            '5more'
        ]
    },
    {
        type: 'list',
        name: 'person_attr',
        message: 'Select person attribute',
        choices: [
            '2',
            '4',
            'more'
        ]
    },
    {
        type: 'list',
        name: 'lug_bot_attr',
        message: 'Select lug_bot attribute',
        choices: [
            'small',
            'med',
            'big'
        ]
    },
    {
        type: 'list',
        name: 'safety_attr',
        message: 'Select safety attribute',
        choices: [
            'low',
            'med',
            'high'
        ]
    },
]).then(function (answers) {

    // classify ...
    var testdoc = new Document('testdoc', [
        answers.buying_attr, 
        answers.maint_attr, 
        answers.door_attr, 
        answers.person_attr, 
        answers.lug_bot_attr, 
        answers.safety_attr
    ])
    
    var result = classifier.classify(testdoc)
    console.log(JSON.stringify(result, null, '  '))
});



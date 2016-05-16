var lineread = require('n-readlines')
var liner = new lineread('./dataset/car.data')
var inquirer = require('inquirer')

// module dependencies
var dclassify = require('dclassify');

// Utilities provided by dclassify
var Classifier = dclassify.Classifier;
var DataSet = dclassify.DataSet;
var Document = dclassify.Document;

var count = 1;
var data = new DataSet()

var data_unacc = []
var data_acc = []
var data_good = []
var data_vgood = []

var line = ""
while (line = liner.next()) {
    var line_array = line.toString().split(",");
    var cat = line_array[6];
    line_array.pop();

    if (cat === 'unacc') {
        data_unacc.push(new Document('d_unacc' + count, line_array))
    } else if (cat === 'acc') {
        data_acc.push(new Document('d_acc' + count, line_array))
    } else if (cat === 'good') {
        data_good.push(new Document('d_good' + count, line_array))
    } else if (cat === 'vgood') {
        data_vgood.push(new Document('d_vgood' + count, line_array))
    }

    count++;
}

data.add('unacc', data_unacc)
data.add('acc', data_acc)
data.add('good', data_good)
data.add('vgood', data_vgood)

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
    //console.log(JSON.stringify(answers, null, '  '));
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



var bayes = require('./test_bayes.js')

bayes.trainDataset('./dataset/training.data')
bayes.classifyDataset('./dataset/testing.data')
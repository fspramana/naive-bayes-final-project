var test_bayes = require('./test_bayes.js')

test_bayes.train_dataset('./dataset/training.data')
test_bayes.classify_dataset('./dataset/testing.data')
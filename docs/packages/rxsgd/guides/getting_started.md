# Getting Started

{% hint style="warning" %}
This module is functional but still **experimental**.  It's API is likely to change in future versions as Bottlenose improves. We are working on adding support for multi-classification, streams of object input (instead of arrays) and an overall better experience for ML workflows.  We will attempt to make these changes in a backwards compatible way (but no promises).
{% endhint %}

## About SGD Classifiers
Stochastic Gradient Descent (SGD) classifiers are a fairly simple and commonly used machine learning algorithm. They scale well and train quickly under most conditions since they can be trained incrementally on each new item.

## Train an SGD classifier
```javascript
import { of, range } from 'rxjs';
import { takeLast } from 'rxjs/operators';
import { classifier } from '@bottlenose/rxsgd';

const trainingData = [ // in the form of [row, label]
  [[2.7810836, 2.550537003], 0],
  [[1.465489372, 2.362125076], 0],
  [[3.396561688, 4.400293529], 0],
  [[1.38807019, 1.850220317], 0],
  [[3.06407232, 3.005305973], 0],
  [[7.627531214, 2.759262235], 1],
  [[5.332441248, 2.088626775], 1],
  [[6.922596716, 1.77106367], 1],
  [[8.675418651, -0.242068655], 1],
  [[7.673756466, 3.508563011], 1],
];

// Run over the training data 100 times (epochs) and fit an SGD classifier to it:
const myClassifier = function myClassifier() {
  return range(1, 100).pipe(
    mapTo(trainingData),
    mergeMap(rows => of(...rows)), // flatten the observable so each emission is a row
    classifier() // fit an SGD classifier to the data
  );
};

export default myClassifier;
```
💡 In this case, the training data was a hardcoded array.  But it could be *any data stream*: a database table, a Mongo query, a series of HTTP requests, a CSV file from AWS S3... You name it!

The **classifier is reactive**.  It will update every time a new item is ingested. These incremental classifiers are often useful if you want to understand how the model is improving (or overfitting itself) as it munches on more data.  If you just want to see the final classifier then you can simply ignore the incremental results and take the last one:
```javascript
import {takeLast} from 'rxjs/operators';

import myClassifier from './myClassifier';

// get the final, fitted classifier
const classifier$ = myClassifier().pipe(
  takeLast(1)
);
classifier$.subscribe(console.log);
// {
//   intercept: -0.8596443546618895, 
//   weights: [1.5223825112460012, -2.2187002105650175]
// }
```

**Each instance of the classifier is just a simple JavaScript object with a few keys, most importantly the model parameters**.  Internally, SGD classifiers are actually very simple. Bottlenose's original implementation was perhaps only around 50 lines of code.  They just calculate an intercept value and attach a weight to each feature column.

## Use a trained classifier to make predictions
The easiest way to use a trained classifier is to store its parameters for later use.  Taking the classifier from the prior example, we can plugin its fitted parameters to make new predictions like this:

```javascript
import { from } from 'rxjs';
import { predict } from '@bottlenose/rxsgd';

const newRow$ = from([
  [7.673756466, 3.508563011],
  [1.38807019, 1.850220317],
]);

// the classifier tells us these values:
const modelParameters = {
  intercept: -0.8596443546618895, 
  weights: [1.5223825112460012, -2.2187002105650175],
};

// now run predictions on the new data
const prediction$ = newRow$.pipe(
  predict(modelParameters) // run predictions using the model parameters
);
prediction$.subscribe(console.log);
// 0.9542746551950381
// 0.054601004287547356
// the first value above is closer to 1 (>0.5), so it is positive/true
// the second value is closer to 0 (<0.5) so it is negative/false
```

What if you don't want to store the model parameters?  In that case, they can be recalculated as needed:
```javascript
import {takeLast, mergeMap} from 'rxjs/operators';
import {predict} from '@bottlenose/rxsgd';

// import the classifier from the previous example
import myClassifier from './myClassifier';

const newRow$ = from([
  [7.673756466, 3.508563011],
  [1.38807019, 1.850220317],
]);

const classifier$ = myClassifier();
const prediction$ = classifier$.pipe(
  takeLast(1),
  mergeMap(classifier => newRow$.pipe(
    predict(classifier)
  ))
);
prediction$.subscribe(console.log);
```

## Create a reactive data pipeline
Having the ability to train SGD models on-the-fly from RxJS streams offers some very interesting possibilities.  For example, in the real world, it's often best to re-train models from time to time to improve their accuracy.  This code would retrain an SGD model every 30 minutes and replace the previous model with a new one based on more recent data:

```javascript
import { map, mergeMap, share, takeLast, windowTime } from 'rxjs/operators';
import {classifier} from '@bottlenose/rxsgd';

// this could be any function that returns an appropriate input Observable
const input$ = streamMyData();

// every 30 minutes, train a new classifier on the
const latestClassifier$ = input$.pipe(
  windowTime(30 * 60 * 1000), // every 30 minutes
  map(window$ => window$.pipe(
    classifier(),
    takeLast(1)
  )),
  mergeMap(classifier$ => classifier$),
  share()
);
// this will emit a new classifier at the end of each 30-minute window
latestClassifier.subscribe(); 
```

A better version of the code might test the performance of each new classifier to see if it does a better job than the previous classifier. Or the results could be shipped to a backend job runner which would test each model to see if they are better than prior models.  Reactive programming makes it easy to do these sorts of things.

We hope to add more information to this guide in the future.  Hopefully this enough information to get you started!
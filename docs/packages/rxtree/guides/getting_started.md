 {% hint style="warning" %}
  This module is functional but still **experimental**.  It's API is likely to change in future versions as Bottlenose improves. We are working on adding support for multi-classification, streams of object input (instead of arrays) and an overall better experience for ML workflows.  We will attempt to make these changes in a backwards compatible way (but no promises).
{% endhint %}

{% hint style="warning" %}
  **Memory usage**.  rxtree classifiers use the CART algorithm by default. CART is the most popular implementation of decision trees.  Unfortunately, CART requires loading and analyzing the entire dataset in order to train the CART tree.  This means that training CART on a large dataset can over-consume memory.  Luckily, decision trees can often be trained on small datasets without reducing model performance.  So the solution in most situations is to train it on smaller subsets of the training data (like 500 rows instead of 50,000).
{% endhint %}

## About Decision Tree Classifiers
Decision trees are a class of machine learning models that are very simple to understand and reason about.  Bottlenose implements the CART decision tree algorithm, which is the most popular decision tree implementation.

CART forms the basis for some of the most powerful and versatile machine learning models including Random Forests, Extremely Randomized Forests, xgboost and Gradient Boosting Machines (GBM).  In most real-world situations, these models will outperform the more basic CART implementation.


## Training a decision tree
```javascript
import { of } from 'rxjs';
import { takeLast } from 'rxjs/operators';
import { classifier } from '@bottlenose/rxtree';

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

// Run over the training data 100 times (epochs) and fit a decision tree classifier to it:
const myClassifier = function myClassifier() {
  return of(...trainingData).pipe(
    mapTo(trainingData),
    mergeMap(rows => of(...rows)), // flatten the observable so each emission is a row
    classifier() // fit a decision tree classifier to the data
  );
};

export default myClassifier;
```

Unfortunately, CART is not an online algorithm, meaning that it cannot be trained incrementally.  Basically, a CART tree requires analyzing the entire dataset in-memory. Typically, CART models don't need to be trained on large datasets because they tend to train effectively, even on small datasets.  You won't see the final tree until it is done training but you can still see incremental results of the model as it is trained.

Running the pipeline will train the decision tree:
```javascript
import {takeLast} from 'rxjs/operators';

import myClassifier from './myClassifier';

// get the final, fitted classifier
const classifier$ = myClassifier().pipe(
  takeLast(1)
);
classifier$.subscribe(console.log);
```

Once the Observable has finished, it will emit the model.  The model is a simple JavaScript object containing a few keys.  Most importantly, it will contain model parameters that can be used to recreate the model whenever needed.

## Running predictions with a trained tree
```javascript
import { from } from 'rxjs';
import { predict } from '@bottlenose/rxtree';

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
import {predict} from '@bottlenose/rxtree';

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


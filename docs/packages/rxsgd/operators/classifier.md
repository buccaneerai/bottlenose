# classifier

## Description

{% hint style="warning" %}
This module is **experimental**.  It's API is likely to change in future versions as Bottlenose improves. We are working on adding support for multi-classification, streams of object input (instead of arrays) and an overall better experience for users.  We will attempt to make these changes in a backwards compatible way (but no promises).
{% endhint %}

Trains an SGD classifier on the input stream.

## Examples

### Basic Example

```javascript
import { from } from 'rxjs';
import { classifier } from '@bottlenose/rxsgd';

const classifier$ = from([1, 2, 3, 4]).pipe(
  classifier()
);

classifier$.subscribe(console.log);
```

## API

```text
classifier({
  learningRate=0.3,
  initialState={intercept: 0, weights: [0, ...]},
})
```

### Since

0.1

### Parameters
None

### Options
* `learningRate Number`: The learning rate to be applied by the training algorithm.
* `initialState {weights: [Number], intercept: Number}`: Initial weights and intercepts. Otherwise, they default to 0.

### Returns

```
{

}
```


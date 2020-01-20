# Description

{% hint style="warning" %}
This module is **experimental**.  It's API is likely to change in future versions as Bottlenose improves. We are working on adding support for multi-classification, streams of object input (instead of arrays) and an overall better experience for users.  We will attempt to make these changes in a backwards compatible way (but no promises).
{% endhint %}

Runs an SGD classifier to predict labels on the input stream.

## Examples
See the Getting Started Guide for examples.

## API

```text
predict({
  intercept<Number>,
  weights[<Number>],
})
```

### Since
0.1

### Parameters
None

### Options
* `intercept<Number>`: The value of the intercept for the SGD classifier.
* `weights[<Number>]`: The weights (coefficients) for each feature column.

### Returns
Number


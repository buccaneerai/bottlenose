# ngram

## Description

Given a stream of words (or tokens) computes a stream of ngrams. By default it will produce bigrams (pairs of words). This can be changed by setting the `n` option.

## Example: Bigrams
```javascript
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {ngram} from '@bottlenose/rxnlp';

const words = ['yo', 'ho', 'yo', 'ho', 'a', 'pirate\'s', 'life'];
const word$ = of(...words);
const bigram$ = word$.pipe(
  ngram(),
  take(3)
);
bigram$.subscribe(console.log);
// ['yo', 'ho']
// ['ho', 'yo']
// ['yo', 'ho']
```

## Example: Trigrams
```javascript
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {ngram} from '@bottlenose/rxnlp';

const words = ['yo', 'ho', 'yo', 'ho', 'a', 'pirate\'s', 'life'];
const word$ = of(...words);
const trigram$ = word$.pipe(
  ngram({n: 3}),
  take(3)
);
trigram$.subscribe(console.log);
// ['yo', 'ho', 'yo']
// ['ho', 'yo', 'ho']
// ['yo', 'ho', 'a']
```

## Example: Unique Bigrams
```javascript
import {of} from 'rxjs';
import {distinct} from 'rxjs/operators';
import {ngram} from '@bottlenose/rxnlp';

const words = ['yo', 'ho', 'yo', 'ho', 'a', 'pirate\'s', 'life'];
const word$ = of(...words);
const bigram$ = word$.pipe(
  ngram(),
  distinct(), // note: this will consume memory since it must caches values to check uniqueness
);
bigram$.subscribe(console.log);
// ['yo', 'ho']
// ['ho', 'yo']
// ['ho', 'a']
// ['a', 'pirate\'s'],
// ['pirate\'s', 'life']
```

## API

```text
stdev(options = {
  [n=2]
})
```

### Since

0.1

### Parameters

None

### Options
* `n<Number>`: The number of words in the n-gram.  Defaults to 2 (bigrams). If set to three, the operator will produce trigrams.

### Returns

`[String]`. An array, containing the strings of the n-gram.

### Arguments

None

### Options

None

# stem

## Description

Given an input Observable of strings or words, it will apply a stemming algorithm to each string or word. By default, it will use a Porter stemming.  It can also apply Lancaster stemming.

## Example: Porter stemmer
```javascript
import {of} from 'rxjs';
import {stem} from '@bottlenose/rxnlp';

const words = [
  'Feet don\'t fail me now',
  'Take me to the finish line',
  'Oh, my heart, it breaks every step that I take',
  'But I\'m hoping at the gates, they\'ll tell me that you\'re mine',
  'Walking through the city streets, is it by mistake or design?',
];

const word$ = of(...words);
const stemmedWord$ = word$.pipe(
  stem(),
);
stemmedWord$.subscribe(console.log);
// feet don\'t fail me now
// take me to the finish lin
// oh, my heart, it breaks every step that i tak
// but i\'m hoping at the gates, they\'ll tell me that you\'re min
// walking through the city streets, is it by mistake or design?
```

## Example: Lancaster stemmer
```javascript
import {of} from 'rxjs';
import {stem} from '@bottlenose/rxnlp';

const words = ['presumably', 'maximum'];
const word$ = of(...words);
const stemmedWord$ = word$.pipe(
  stem({stemmer: 'lancaster'}),
);
stemmedWord$.subscribe(console.log);
// 'presum'
// 'maxim'
```

## API

```text
stdev(options = {
  [stemmer='porter']
})
```

### Since

0.1

### Parameters

None

### Options
* `stemmer<String>`: Can be `'porter'` (for Porter stemming) or `'lancaster'` (uses Lancaster stemming). Defaults to Porter stemming.

### Returns

`String`. The stemmed version of the input strings or words.

### Arguments

None

### Options

None

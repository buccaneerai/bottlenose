# toCsv

## Description

Converts JavaScript objects to CSV output (using [json2csv](https://www.npmjs.com/package/json2csv)).

## Example

```javascript
import {from} from 'rxjs';
import {toCsv} from '@bottlenose/rxcsv';

const pirate$ = from([
  {name: 'Blackbeard', systolicBp: 140, diastolicBp: 91, message: 'Yarr'},
  {name: 'Crunch', systolicBp: 120, diastolicBp: 80, message: 'Arr'},
  {name: 'Blackbeard', systolicBp: 110, diastolicBp: 70, message: 'Savvy'},
]);

const csvRow$ = pirate$.pipe(toCsv());
csvRow$.subscribe(console.log);
// "name","systolicBp","dialostilicBp","message"
// "Blackbeard",140,91,"Yarr"
// "Crunch",120,180,"Arr"
// "Sparrow",110,70,"Savvy"
```

## API

```text
toCsv(
  options = {
    [parserOptions={}],
  }
)
```

### Since

0.1

### Parameters

None

### Options
* `parserOptions<Object>`: Sets options on the CSV parser. This will pass options to [json2csv](https://www.npmjs.com/package/json2csv).

### Returns

`String`. CSV Strings.

### Arguments

None

### Options

None


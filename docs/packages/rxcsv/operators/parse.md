# parse
The parse operator accepts a stream of CSV input and converts it into JavaScript objects using [csv-parse](https://csv.js.org/parse/).

## Example
```javascript
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { parse } from '@bottlenose/rxcsv';

// Create a stream of raw CSV data
const csvString$ = from([
  '"name","systolicBp","dialostilicBp","message"\n', 
  '"Blackbeard",140,91,"Yarr"\n"Crunch",120,', 
  ',180,"Arr"\n"Sparrow",110,70,"Savvy"\n',
]);

// Stream the CSV data into an RxJS Subject
const row$ = csvString$.pipe(parse());
row$.subscribe(console.log);
// {name: "Blackbeard", systolicBp: 140, diastolicBp: 91, message: 'Yarr'},
// {name: "Crunch", systolicBp: 120, diastolicBp: 80, message: 'Arr'},
// {name: "Sparrow", systolicBp: 110, diastolicBp: 70, message: 'Savvy'},
```

## API

```text
parse(
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
* `parserOptions<Object>`: Sets options on the CSV parser. This will pass options to [csv-parse](https://csv.js.org/parse/).

### Returns

`String`. CSV Strings.

### Arguments

None

### Options

None

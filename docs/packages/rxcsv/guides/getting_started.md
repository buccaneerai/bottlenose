# Getting Started

## Installation
```bash
npm i --save @bottlenose/rxcsv
```
Or:
```
yarn add @bottlenose/rxcsv
```

## Parsing CSV inputs
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

## Transforming objects into CSV format
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
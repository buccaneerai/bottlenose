# Getting Started

## Installation
```bash
yarn add @bottlenose/rxfs
```
Or...
```bash
npm i --save @bottelnose/rxfs
```

## Read file content into an Observable
```javascript
import path from 'path';
import {fromFile} from 'rxfs';

const csvContent = fromFile({
  filePath: path.resolve(__dirname, './my-csv.csv'),
});
csvContent$.subscribe(console.log);
// "name","scariness"
// "Blackbeard",10
// "Morgan",9
// "Sparrow",2
// "Crunch",1
```

## Write Observable content into a file (overwriting its contents)
```javascript
import path from 'path';
import {of} from 'rxjs';
import {writeFile} from 'rxfs';

const data = [
  '"animal","coolness"\n',
  '"dolphin",10\n',
  '"algae",1\n',
  '"mermaid",6\n',
  '"octopus",9\n',
  '"narwhale",8\n',
];

const writeStream$ = of(...data).pipe(
  writeFile({filePath: path.resolve(__dirname, './output.csv')})
);
// write the input observable to the file
writeStream$.subscribe(console.log);
```

## Append Observable content to a file
```javascript
import path from 'path';
import {of} from 'rxjs';
import {appendFile} from 'rxfs';

const moreData = [
  '"barnacle",3\n',
  '"seagull",2\n',
  '"clownfish",4\n',
];

const writeStream$ = of(...moreData).pipe(
  appendFile({filePath: path.resolve(__dirname, './output.csv')})
);
// append the input observable to the file
writeStream$.subscribe(console.log);
```
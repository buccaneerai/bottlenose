# appendFile

## Description

Appends an input Observable's content to a local file (using [fs.appendFile](https://nodejs.org/api/fs.html#fs_fs_appendfile)).

## Examples

```javascript
import path from 'path';
import {of} from 'rxjs';
import {appendFile} from 'rxfs';

const data = [
  '"animal","coolness"',
  '"dolphin",10',
  '"algea",1',
  '"mermaid",6',
  '"octopus",9',
  '"octopus",9',
  '"narwhale",8',
];

const writeStream$ = of(...data).pipe(
  appendFile({filePath: path.resolve(__dirname, './output.csv')})
);
// write the input observable to the file
writeStream$.subscribe(console.log);
```

## API

```text
writeFile({
  filePath<String>,
  [options={}]
})
```

### Since

0.1

### Parameters
* `filePath`: Path to the file.

### Options
* `options<Object>`: Options to pass into [fs.appendFile](https://nodejs.org/api/fs.html#fs_fs_appendfile).

### Returns
None

### Arguments

None

### Options

None
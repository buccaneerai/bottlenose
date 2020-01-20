# appendFile

## Description

Write's an input Observable's content to the local filesystem (using [fs.createWriteStream](https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options)) and converts its content to an RxJS stream.

## Examples

```javascript
import path from 'path';
import {of} from 'rxjs';
import {writeFile} from 'rxfs';

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
  writeFile({filePath: path.resolve(__dirname, './output.csv')})
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
* `options<Object>`: Options to pass into [fs.createWriteStream](https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options).

### Returns
None

### Arguments

None

### Options

None
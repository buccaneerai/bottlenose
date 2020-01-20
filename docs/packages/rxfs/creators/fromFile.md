# fromFile

## Description

Reads a file's content from the local filesystem (using [fs.createReadStream](https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options)).

## Examples

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

## API

```text
fromFile({
  filePath<String>,
  [options={}]
})
```

### Since

0.1

### Parameters
* `filePath`: Path to the file.

### Options
* `options<Object>`: Options to pass into [fs.createReadStream](https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options).

### Returns

`Buffer`. Buffer objects containing chunks of file content.

### Arguments

None

### Options

None
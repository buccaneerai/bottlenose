# mean

## Description

Streams RxJS items into a multipart S3 upload.  The input data can be any of these types:
- Buffer
- Blob
- String
- Typed Array 
- ReadableStream

### Basic Example

```js
import { from } from 'rxjs';
import { upload } from '@bottlenose/rxs3';

// create file chunks to upload
const csvRow$ = from([
  'Name,Occupation\n',
  'Blackbeard,Pirate\n',
  'Captain Hook,Pirate\n',
  'Aladdin,Thief\n',
]);

// describe calculations
const upload$ = csvRow$.pipe(
  upload({
    s3Bucket: 'mys3bucket', 
    s3Key: './scurvy-dogs.csv',
    contentType: 'text/csv',
  })
);

// run the pipeline and do something with the results
upload$.subscribe(null, null, () => console.log('done'));
// done!
```

## API

```text
upload({
  s3Key<String>,
  s3Bucket<String>,
  contentType<String>,
  [s3<AWS.S3>]
})
```

### Since

0.1

### Parameters
* `s3Bucket<String>`: The s3Bucket to which the file will be uploaded.
* `s3Key<String>`: The s3Key at which to store the file.
* `contentType<String>`: The content (MIME) type of the file.

### Options

* `s3<AWS.S3>`. An S3 client to use. Otherwise, one will be created by calling `new AWS.S3()`.

### Returns

`AWS.Response`. \(The AWS Responses.\)


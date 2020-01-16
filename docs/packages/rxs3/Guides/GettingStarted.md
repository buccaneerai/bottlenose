# Getting Started

## Why stream?
`@bottlenose/rxs3` allows you to stream files instead of uploading the entire file as a single request. Why?

- Streaming is a requirement when working with big files (database dumps, big CSV files, audio data, human DNA, etc.)
- With some filetypes (like CSV, certain JSON formats and audio) streaming enables processing data immediately even if the full file takes longer to download.
- Streaming uploads is useful when the source data for the file is itself a data stream (audio, video, csv files, websockets, etc).
- This approach can conserve memory since only a small chunk of the file needs to be held in memory at any given time.
- This approach can handle connectivity failures. Imagine downloading a big 50GB file and losing connection after downloading 49GB of it.  No fun!

## Installation

#### npm
```
npm i @bottlenose/rxs3 --save
```
#### yarn
```
yarn add @bottlenose/rxs3
```

## Stream file uploads!
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

Note that the upload operator can upload data with any of these types: 
- Buffer
- Typed Array 
- Blob
- String
- ReadableStream.
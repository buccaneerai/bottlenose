import AWS from 'aws-sdk';
import {
  AsyncSubject,
  from,
  of,
  zip
} from 'rxjs';
import {
  map,
  mergeMap,
  scan,
  tap,
  toArray,
  withLatestFrom,
} from 'rxjs/operators';

import createMultipartUpload from '../internals/createMultipartUpload';
import uploadPart from '../internals/uploadPart';
import completeUpload from '../internals/completeUpload';

const s3Default = new AWS.S3();

// This example is helpful: https://www.srijan.net/blog/aws-s3-audio-streaming
const upload = function upload({
  s3Key,
  s3Bucket,
  contentType,
  s3 = s3Default,
  _createMultipartUpload = createMultipartUpload,
  _uploadPart = uploadPart,
  _completeUpload = completeUpload,
}) {
  // source$ should contain items which are one of these types:
  // Buffer, Typed Array, Blob, String, ReadableStream
  return source$ => {
    const uploadId$ = new AsyncSubject();
    _createMultipartUpload({s3Key, s3Bucket, contentType, s3}).subscribe(uploadId$);
    const parts$ = source$.pipe(
      withLatestFrom(uploadId$),
      scan((memo, [filePart, uploadId]) => [
        uploadId,
        filePart,
        memo[2] + 1,
      ], [null, null, 0]),
      mergeMap(([uploadId, partBuffer, partNumber]) => zip(
        of(partNumber),
        _uploadPart({uploadId, partNumber, partBuffer, s3Bucket, s3Key, s3})
      )),
      map(([partNumber, response]) => [partNumber, response.ETag]),
      toArray(),
    );
    const complete$ = parts$.pipe(
      withLatestFrom(uploadId$),
      mergeMap(([parts, uploadId]) => (
        _completeUpload({parts, uploadId, s3Bucket, s3Key, s3})
      ))
    );
    return complete$;
  };
};

export default upload;

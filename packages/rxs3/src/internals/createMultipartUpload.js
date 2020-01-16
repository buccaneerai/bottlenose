import {from} from 'rxjs';
import {map} from 'rxjs/operators';

const createMultipartUpload = function createMultipartUpload({
  s3Bucket,
  s3Key,
  contentType,
  s3, // S3 client
}) {
  const uploadOpts = {
    Key: s3Key,
    Bucket: s3Bucket,
    ContentType: contentType,
    ACL: 'private',
  };
  const response$ = from(s3.createMultipartUpload(uploadOpts).promise());
  const uploadId$ = response$.pipe(
    map(response => response.UploadId)
  );
  return uploadId$;
};

export default createMultipartUpload;

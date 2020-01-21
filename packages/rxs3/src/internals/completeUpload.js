import {from} from 'rxjs';

const completeUpload = function completeUpload({
  s3Bucket,
  s3Key,
  uploadId,
  parts, // [{ETag, PartNumber}, ...]
  s3,
}) {
  const s3Opts = {
    Bucket: s3Bucket, // required
    Key: s3Key, // required
    UploadId: uploadId, // required
    MultipartUpload: {
      Parts: parts
    }
  };
  const response$ = from(s3.completeMultipartUpload(s3Opts).promise());
  return response$;
};

export default completeUpload;

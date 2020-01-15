import {from} from 'rxjs';

const uploadPart = function uploadPart({
  partBuffer,
  partNumber,
  s3Bucket,
  s3Key,
  uploadId,
  s3 // s3 client (from AWS.S3)
}) {
  const uploadOpts = {
    Body: partBuffer,
    Bucket: s3Bucket,
    Key: s3Key,
    PartNumber: partNumber,
    UploadId: uploadId,
  };
  const response$ = from(s3.uploadPart(uploadOpts).promise());
  return response$;
};

export default uploadPart;

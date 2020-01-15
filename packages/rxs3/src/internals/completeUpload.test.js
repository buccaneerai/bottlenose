import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';

import completeUpload from './completeUpload';

describe('completeUpload', () => {
  it('should call s3 with correct options', marbles(m => {
    expect(3);
    const uploadId = 'foobar';
    const fakeS3Res = {UploadId: uploadId};
    const params = {
      uploadId,
      parts: [{ETag: 'majesticETag', PartNumber: 1}],
      s3Bucket: 'marvelousbucket',
      s3Key: 'aspecialplace/myfile.mp4',
      s3: {
        completeMultipartUpload: sinon.stub().returns({
          // promise: () => new Promise(resolve => resolve(fakeS3Res))
          promise: () => [fakeS3Res]
        })
      },
    };
    const actual$ = completeUpload(params);
    m.expect(actual$).toBeObservable('(0|)', { 0: fakeS3Res });
    expect(params.s3.completeMultipartUpload.calledOnce).to.be.true;
    expect(params.s3.completeMultipartUpload.firstCall.args[0]).to.deep.equal({
      Key: params.s3Key,
      Bucket: params.s3Bucket,
      UploadId: params.uploadId,
      MultipartUpload: {Parts: params.parts}
    });
  }));
});

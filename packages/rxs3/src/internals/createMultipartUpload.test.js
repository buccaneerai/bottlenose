import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';

import createMultipartUpload from './createMultipartUpload';

describe('createMultipartUpload', marbles(m => {
  it('should call s3 with correct options', () => {
    expect(3);
    const uploadId = 'foobar';
    const fakeS3Res = {UploadId: uploadId};
    const params = {
      s3Bucket: 'marvelousbucket',
      s3Key: 'aspecialplace/myfile.mp4',
      contentType: 'application/mp4',
      s3: {
        createMultipartUpload: sinon.stub().returns({
          // promise: () => new Promise(resolve => resolve(fakeS3Res))
          promise: () => [fakeS3Res]
        })
      },
    };
    const actual$ = createMultipartUpload(params);
    m.expect(actual$).toBeObservable('(0|)', { 0: fakeS3Res.UploadId });
    expect(params.s3.createMultipartUpload.calledOnce).to.be.true;
    expect(params.s3.createMultipartUpload.firstCall.args[0]).to.deep.equal({
      Key: params.s3Key,
      Bucket: params.s3Bucket,
      ContentType: params.contentType,
      ACL: 'private',
    });
  });
}));

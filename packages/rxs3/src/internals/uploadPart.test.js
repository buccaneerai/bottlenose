import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';

import uploadPart from './uploadPart';

describe('uploadPart', () => {
  it('should call s3 with correct options and return correct observable', marbles(m => {
    expect(3);
    const uploadId = 'foobar';
    const fakeS3Res = { UploadId: uploadId };
    const params = {
      uploadId,
      partBuffer: Buffer.from('foobarthisisabuffer', 'base64'),
      partNumber: 2,
      s3Bucket: 'mrbucket',
      s3Key: 'aspecialplace/myfile.mp4',
      s3: {
        uploadPart: sinon.stub().returns({promise: () => [fakeS3Res]})
      }
    };
    const actual$ = uploadPart(params);
    m.expect(actual$).toBeObservable('(0|)', { 0: fakeS3Res });
    expect(params.s3.uploadPart.calledOnce).to.be.true;
    expect(params.s3.uploadPart.getCall(0).args[0]).to.deep.equal({
      Body: params.partBuffer,
      PartNumber: params.partNumber,
      Key: params.s3Key,
      Bucket: params.s3Bucket,
      UploadId: params.uploadId,
    });
  }));
});

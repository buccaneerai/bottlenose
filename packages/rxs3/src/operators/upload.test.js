import {expect} from 'chai';
import { marbles } from "rxjs-marbles/mocha";
import sinon from 'sinon';
import {TestScheduler} from 'rxjs/testing';

import upload from './upload';

// https://rxjs-dev.firebaseapp.com/guide/testing/marble-testing
describe('upload operator', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).to.deep.equal(expected);
    });
  });

  it('should handle workflow correctly when given a stream of buffers', marbles(m => {
    expect(7);
    const encoding = 'base64';
    const uploadId = 'dapperuploadid';
    const fakeCreateMultipartUploadResponse = {UploadId: uploadId};
    const fakePartUploadResponse = {ETag: 'averyfancyetag'};
    const fakeCompleteResponse = {foo: 'whateverItDontMatter'};

    const bufferMarble = '-(01)2--34-5-(6|)';
    const bufferValues = {
      0: Buffer.from('there', encoding),
      1: Buffer.from('is', encoding),
      2: Buffer.from('always', encoding),
      3: Buffer.from('money', encoding),
      4: Buffer.from('in', encoding),
      5: Buffer.from('the', encoding),
      6: Buffer.from('bananastand', encoding),
    };

    const params = {
      s3Key: 'tatooine/mysong.mp4',
      s3Bucket: 'mrbucket',
      contentType: 'application/mp4',
      buffer$: m.cold(bufferMarble, bufferValues),
      _createMultipartUpload: sinon.stub().returns(m.cold(
        '-(r|)',
        {r: uploadId}
      )),
      _uploadPart: sinon.stub().returns(m.cold(
        '---(r|)',
        {r: fakePartUploadResponse}
      )),
      _completeUpload: sinon.stub().returns(m.cold(
        '--(r|)',
        {r: fakeCompleteResponse}
      )),
    };
    const expectedMarble = '--- --- --- --- --- ---(x|)';
    const expectedValues = {x: fakeCompleteResponse};
    const actual$ = streamS3Upload(params);
    m.expect(actual$).toBeObservable(expectedMarble, expectedValues);
    // expect(params._createMultipartUpload.calledOnce).to.be.true;
    // expect(params._createMultipartUpload.firstCall.args[0]).to.deep.include({
    //   s3Bucket: params.s3Bucket,
    //   s3Key: params.s3Key,
    //   contentType: params.contentType,
    // });
    // expect(params._uploadPart.callCount).to.equal(7);
    // expect(params._uploadPart.getCall(6).args[0]).to.deep.include({
    //   uploadId,
    //   partNumber: 6,
    //   partBuffer: bufferValues[6],
    //   s3Bucket: params.s3Bucket,
    //   s3Key: params.s3Key,
    // });
    // expect(params._completeUpload.calledOnce).to.be.true;
    // expect(params._completeUpload.firstCalll.args[0]).to.deep.include({
    //   uploadId,
    //   s3Bucket: params.s3Bucket,
    //   s3Key: params.s3Key,
    //   parts: _.times(7, n => [n - 1, fakePartUploadResponse.ETag])
    // });
  }));
});


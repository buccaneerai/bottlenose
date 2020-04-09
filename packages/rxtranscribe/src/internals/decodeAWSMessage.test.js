import {expect} from 'chai';
import sinon from 'sinon';

import decodeMessage from './decodeAWSMessage';

describe('internals.decodeMessage', () => {
  it('should call decode workflow correctly', () => {
    const fakeMessageWrapper = {
      body: Uint8Array.from([
        123,  34,  77, 101, 115, 115,  97, 103, 101,  34,  58,
         34,  84, 104, 101,  32, 115, 101,  99, 117, 114, 105,
        116, 121,  32, 116, 111, 107, 101, 110,  32, 105, 110,
         99, 108, 117, 100, 101, 100,  32, 105, 110,  32, 116,
        104, 101,  32, 114, 101, 113, 117, 101, 115, 116,  32,
        105, 115,  32, 105, 110, 118,  97, 108, 105, 100,  46,
         34, 125
      ]),
      headers: {':message-type': {value: 'event'}},
    };
    const params = {
      message: JSON.stringify({foo: 'bar'}),
      _marshaller: {
        unmarshall: sinon.stub().returns(fakeMessageWrapper),
      }
    };
    const result = decodeMessage(params);
    expect(result).to.deep.equal({
      Message: 'The security token included in the request is invalid.'
    });
  });

  it('should throw errors when error is returned', () => {
    const fakeMessageWrapper = {
      body: Uint8Array.from([
        123,  34,  77, 101, 115, 115,  97, 103, 101,  34,  58,
         34,  84, 104, 101,  32, 115, 101,  99, 117, 114, 105,
        116, 121,  32, 116, 111, 107, 101, 110,  32, 105, 110,
         99, 108, 117, 100, 101, 100,  32, 105, 110,  32, 116,
        104, 101,  32, 114, 101, 113, 117, 101, 115, 116,  32,
        105, 115,  32, 105, 110, 118,  97, 108, 105, 100,  46,
         34, 125
      ]),
      headers: {':message-type': {value: 'error'}},
    };
    const params = {
      message: JSON.stringify({foo: 'bar'}),
      _marshaller: {
        unmarshall: sinon.stub().returns(fakeMessageWrapper),
      }
    };
    const callFn = () => decodeMessage(params);
    expect(callFn).to.throw(
      'The security token included in the request is invalid.'
    );
  });
});

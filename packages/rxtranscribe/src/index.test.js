import {expect} from 'chai';

import {transcribe} from './index';

describe('index', () => {
  it('should export operator functions', () => {
    expect(transcribe).to.be.a('function');
  });
});

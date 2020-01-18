import {expect} from 'chai';

import predictValue from './predictValue';

// Example numbers drawn from here:
// https://machinelearningmastery.com/implement-logistic-regression-stochastic-gradient-descent-scratch-python/
describe('internals.predictValue', () => {
  it('should generate correct predicted value when given valid input', () => {
    const params = {
      row: [2.7810836, 2.550537003],
      intercept: -0.406605464,
      weights: [0.852573316, -1.104746259],
    };
    const actual = predictValue(params);
    const expected = 0.2987569855650975;
    expect(actual).to.equal(expected);
  });
});

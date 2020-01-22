import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';

import giniGain, {testExports} from './giniGain';
const { getGiniImpurity, getTotalSampleCounts } = testExports;

describe('giniGain operator', () => {
  it('should compute correct gini gain given valid inputs', marbles(m => {
    const totalSampleCounts = {0: 50, 1: 50};
    const splitLabelCounts$ = m.cold('(0|)', {
      0: [{0: 30, 1: 20}, {0: 40, 1: 10}],
    });
    const actual$ = splitLabelCounts$.pipe(giniGain(totalSampleCounts));
    const expected$ = m.cold('(0|)', {
      0: 0.10000000000000009,
    });
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should return correct gini impurity for 100-0 split', () => {
    const params = {
      labelCounts: { 1: 100, 2: 0 },
      totalSampleCount: 100
    };
    const giniImpurity = getGiniImpurity(params);
    expect(giniImpurity).to.equal(0);
  });

  it('should return correct gini impurity for even splits', () => {
    const params = {
      labelCounts: { 1: 25, 2: 25, 3: 25, 4: 25 },
      totalSampleCount: 100
    };
    const giniImpurity = getGiniImpurity(params);
    expect(giniImpurity).to.equal(0.75);
  });

  it('should return correct gini impurity for uneven splits', () => {
    const params = {
      labelCounts: { 1: 30, 2: 20},
      totalSampleCount: 50
    };
    const giniImpurity = getGiniImpurity(params);
    expect(giniImpurity).to.equal(0.48);
  });

  it('should sum the sample count correctly', () => {
    const count = getTotalSampleCounts({0: 50, 1: 50});
    expect(count).to.equal(100);
  });
});

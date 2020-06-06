import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import times from 'lodash/times';
import {from,of} from 'rxjs';
import {count,take,takeLast} from 'rxjs/operators';

import bestSplit, {testExports} from './bestSplit';
const { countLabelsAboveSplit, findBestSplit, findSplits } = testExports;

import giniGain from './giniGain';

function fakeColumn() {
  return from([
    {label: 1, feature: 2, index: 101},
    ...times(50, n => ({label: 0, feature: n + 10, index: n + 10})), // {0:50, 1:1}
    {label: 1, feature: 100, index: 100}, // {0:50, 1:2}
    {label: 0, feature: 101, index: 101}, // {0:51, 1:2}
    ...times(60, n => ({label: 1, feature: n + 150, index: n + 150})), // {0:51, 1:62}
    {label: 0, feature: 200, index: 200}, // {0:52,1:62}
  ]);
}

describe('bestSplit operator', () => {
  it('should discover correct split when given valid input data and gini gain function', marbles(m => {
    const totalLabelCounts = {0: 52, 1: 62};
    const input$ = fakeColumn();
    const actual$ = input$.pipe(
      bestSplit(totalLabelCounts, giniGain)
    );
    const expected$ = m.cold('(0|)', {
      0: {splitValue: 125.5, labelCountsAbove: {0: 51, 1: 2}, gain: 0.44513275254600215}
    });
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should calculate label counts and gain correctly', marbles(m => {
    const totalLabelCounts = {0: 2, 1: 2};
    const input$ = m.cold('-01--23|', [
      {index: 0, feature: 97.5, label: 0},
      {index: 2, feature: 98.8, label: 0},
      {index: 1, feature: 100.3, label: 1},
      {index: 3, feature: 100.6, label: 1},
    ]);
    const actual$ = input$.pipe(
      bestSplit(totalLabelCounts, giniGain),
      takeLast(1)
    );
    const expected$ = m.cold('-------(0|)', [
      {splitValue: 99.55, labelCountsAbove: {0: 2}, gain: 0.5}
    ]);
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('findBestSplit() should find best split when given valid inputs and gini gain function', marbles(m => {
    const totalLabelCounts = {0: 50, 1: 50};
    const input$ = m.cold('01(2|)', [
      {labelCountsAbove: {0: 20, 1: 20}, splitValue: 0.25},
      {labelCountsAbove: {0: 45, 1: 30}, splitValue: 0.80},
      {labelCountsAbove: {0: 45, 1: 45}, splitValue: 2.0},
    ]);
    const actual$ = input$.pipe(
      findBestSplit(totalLabelCounts, giniGain)
    );
    const expected$ = m.cold('--(2|)', {
      2: {labelCountsAbove: {0: 45, 1: 30}, splitValue: 0.8, gain: 0.06000000000000005},
    });
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('countLabelsAboveSplit() should return accurate aggregations', () => {
    const memo = [{}, {index: 66, feature: 53, label: 0}, null, {0: 30, 1: 30}];
    const testSample = {index: 67, feature: 57, label: 1};
    const [priorSample, currentSample, priorCounter, newCounter] = countLabelsAboveSplit(
      memo,
      testSample
    );
    expect(priorSample).to.deep.equal(memo[1]);
    expect(currentSample).to.deep.equal(testSample);
    expect(priorCounter).to.deep.equal({0: 30, 1: 30});
    expect(newCounter).to.deep.equal({0: 30, 1: 31});
  });

  it('findSplits() format splits correctly', marbles(m => {
    const column$ = fakeColumn();
    const actual$ = column$.pipe(
      findSplits(),
      takeLast(1)
    );
    const expected$ = m.cold('(0|)', {
      0: {splitValue: 204.5, labelCountsAbove: {0: 51, 1: 62}}
    });
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('findSplits() should find correct number of splits', marbles(m => {
    const column$ = fakeColumn();
    const actual$ = column$.pipe(
      findSplits(),
      count(),
      takeLast(1)
    );
    const expected$ = m.cold('(0|)', {0: 5});
    m.expect(actual$).toBeObservable(expected$);
  }));
});

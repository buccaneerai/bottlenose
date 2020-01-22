import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import times from 'lodash/times';
import {from,of} from 'rxjs';
import {count,take,takeLast} from 'rxjs/operators';

import bestSplit, {testExports} from './bestSplit';
const { aggregateSplits, findBestSplit, findSplits } = testExports;

import giniGain from './giniGain';

function fakeColumn() {
  return from([
    {label: 1, feature: 2, index: 101},
    ...times(50, n => ({label: 0, feature: n + 10, index: n + 10})),
    {label: 1, feature: 100, index: 100},
    {label: 0, feature: 101, index: 101},
    ...times(60, n => ({label: 1, feature: n + 150, index: n + 150})),
    {label: 0, feature: 200, index: 200},
  ]);
}

describe('bestSplit operator', () => {
  it('should discover correct split when given valid input data and gini gain function', marbles(m => {
    // const onData = sinon.spy();
    // const onError = sinon.spy();
    // const params = {
    //   columnSampleAscending$: fakeColumn(),
    //   totalLabelCount$: of({0: 52, 1: 62}),
    //   gainFunction: getGiniGain,
    // };
    // bestSplit(params).subscribe(onData, console.log, () => {
    //   expect(onError.called).to.be.false;
    //   expect(onData.callCount).to.equal(1);
    //   expect(onData.getCall(0).args[0]).to.deep.include({
    //     splitValue: 101,
    //     labelCounts: {0: 51, 1: 2},
    //     gain: 0.44513275254600215
    //   });
    //   done();
    const totalLabelCounts = {0: 52, 1: 62};
    const input$ = fakeColumn();
      const actual$ = input$.pipe(
        bestSplit(totalLabelCounts, giniGain)
      );
      const expected$ = m.cold('(0|)', {
        0: {splitValue: 101, labelCounts: {0: 51, 1: 2}, gain: 0.44513275254600215}
      });
      m.expect(actual$).toBeObservable(expected$);
    }));
  // });

  it('findBestSplit() should find best split when given valid inputs and gini gain function', marbles(m => {
    // const params = {
    //   split$: from([
    //     {labelCounts: {0: 20, 1: 20}, splitValue: 0.25},
    //     {labelCounts: {0: 45, 1: 30}, splitValue: 0.80},
    //     {labelCounts: {0: 45, 1: 45}, splitValue: 2.0}
    //   ]),
    //   totalLabelCount$: of({0: 50, 1: 50}),
    //   gainFunction: getGiniGain,
    // };
    // findBestSplit(params).subscribe(onData, onError, () => {
    //   expect(onError.called).to.be.false;
    //   expect(onData.calledOnce).to.be.true;
    //   const bestSplit = onData.firstCall.args[0];
    //   expect(bestSplit.splitValue).to.equal(0.80);
    //   done();
    // });
    const totalLabelCounts = {0: 50, 1: 50};
    const input$ = m.cold('01(2|)', [
      {labelCounts: {0: 20, 1: 20}, splitValue: 0.25},
      {labelCounts: {0: 45, 1: 30}, splitValue: 0.80},
      {labelCounts: {0: 45, 1: 45}, splitValue: 2.0},
    ]);
    const actual$ = input$.pipe(
      findBestSplit(totalLabelCounts, giniGain)
    );
    const expected$ = m.cold('--(2|)', {
      2: {labelCounts: {0: 45, 1: 30}, splitValue: 0.8, gain: 0.06000000000000005},
    });
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('aggregateSplits() should return accurate aggregations', () => {
    const memo = [{}, {index: 66, feature: 53, label: 0}, {0: 30, 1: 30}];
    const testSample = {index: 67, feature: 57, label: 1};
    const [priorSample, currentSample, counter] = aggregateSplits(memo, testSample);
    expect(priorSample).to.deep.equal(memo[1]);
    expect(currentSample).to.deep.equal(testSample);
    expect(counter).to.deep.equal({0: 30, 1: 31});
  });

  it('findSplits() format splits correctly', marbles(m => {
    const column$ = fakeColumn();
    const actual$ = column$.pipe(
      findSplits(),
      take(1)
    );
    const expected$ = m.cold('(0|)', {
      0: {splitValue: 10, labelCounts: {0: 1, 1: 1}}
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

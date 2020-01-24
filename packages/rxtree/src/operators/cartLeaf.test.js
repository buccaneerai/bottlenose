import omit from 'lodash/omit';
import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import {from, of} from 'rxjs';
import {map,mapTo} from 'rxjs/operators';

import cartLeaf, { testExports } from './cartLeaf';
const {makeLeaf} = testExports;

const fakeLeaf = {
  parentId: 'foogranny',
  _id: 'foomommy',
  depth: 3,
  numSamples: 8,
  splitValue: 5,
  splitColumn: 1,
  splitGain: 0.5,
  childIds: ['foobaby', 'barbaby'],
};

describe('cartLeaf operator', () => {
  it('cartLeaf should correctly create a leaf', marbles(m => {
    const params = {
      depth: 2,
      leafId: 'fakeleafid',
      numSamples: 4,
      totalLabelCounts: {0: 2, 1: 2},
      childIds: ['fakechildidleft', 'fakechildidright'],
      maxConcurrentColumnStreams: 1,
    };
    const columns$ = m.cold('--0|', [
      [
        from([
          {index: 0, feature: 1, label: 0},
          {index: 1, feature: 1, label: 1},
          {index: 2, feature: 2, label: 0},
          {index: 3, feature: 2, label: 1},
        ]),
        from([
          {index: 0, feature: 97.5, label: 0},
          {index: 2, feature: 98.8, label: 0},
          {index: 1, feature: 100.3, label: 1},
          {index: 3, feature: 100.6, label: 1},
        ])
      ]
    ]);
    const leaf$ = columns$.pipe(cartLeaf(params));
    const expected$ = m.cold('--0|', [
      {
        _id: params.leafId,
        parentId: params.parentId,
        numSamples: params.numSamples,
        depth: params.depth,
        childIds: params.childIds,
        splitGain: 0.2,
        splitValue: 100.3,
        splitColumnIndex: 1,
        splitLabelCounts: {1: 2, 0: 2},
      },
    ]);
    m.expect(leaf$).toBeObservable(expected$);
  }));

  it('makeLeaf() should correctly generate leaf from input data', marbles(m => {
    const splits = [
      {gain: 0.2, splitValue: 3, splitColumn: 0},
      {gain: 0.5, splitValue: 4, splitColumn: 1},
      {gain: 0.3, splitValue: 5, splitColumn: 2},
    ];
    const input$ = m.cold('--0-|', [splits]);
    const params = {
      leafId: 'foobar',
      parentId: 'foobardaddy',
      numSamples: 5,
      depth: 3,
    };
    const actual$ = input$.pipe(
      makeLeaf(params),
      // omit childIds since it is random and harder to test...
      map(leaf => omit(leaf, 'childIds'))
    );
    const expected$ = m.cold('--0-|', {
      0: {
        parentId: params.parentId,
        numSamples: params.numSamples,
        depth: params.depth,
        _id: params.leafId,
        splitValue: splits[1].splitValue,
        splitColumnIndex: splits[1].splitColumn,
        splitGain: splits[1].gain,
        splitLabelCounts: {1: 2, 0: 2},
      },
    });
    m.expect(actual$).toBeObservable(expected$);
  }));
});

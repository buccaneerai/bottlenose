import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';

import cartTree, {testExports} from './cartTree';
const { createSortedColumnsFromRows } = testExports;

const fakeRows = [
  [[3, 1, 2], 0],
  [[1, 2, 3], 1],
  [[2, 3, 1], 1],
];

const fakeDataFrame = [
  [
    {index: 1, feature: 1, label: 1},
    {index: 2, feature: 2, label: 1},
    {index: 0, feature: 3, label: 0},
  ],
  [
    {index: 0, feature: 1, label: 0},
    {index: 1, feature: 2, label: 1},
    {index: 2, feature: 3, label: 1},
  ],
  [
    {index: 2, feature: 1, label: 1},
    {index: 0, feature: 2, label: 0},
    {index: 1, feature: 3, label: 1},
  ],
];

describe('cartTree', () => {
  it('should generate correct tree', marbles(m => {
    expect(false).to.be.true;
  }));

  it('should generate correct sorted columns', marbles(m => {
    const row$ = m.cold('-0-12|', fakeRows);
    const columns$ = row$.pipe(createSortedColumnsFromRows());
    const expected$ = m.cold('-----(0|)', {0: fakeDataFrame});
    m.expect(columns$).toBeObservable(expected$);
  }));
});

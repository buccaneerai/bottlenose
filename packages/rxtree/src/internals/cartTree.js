import {Subject} from 'rxjs';
import {
  count,
  filter,
  mergeMap,
  scan,
  shareReplay,
  takeUntil,
  tap
} from 'rxjs/operators';

import cartLeaf from './cartLeaf';
import createSortedColumnsFromRows from './createSortedColumnsFromRows';
import giniGain from './giniGain';

function initializeChildLeaves({parentLeaf}) {

}

const cartTree = function cartTree({
  initialState = {},
  presorted = false,
  gainOperator = giniGain,
  maxLeaves = 100,
  maxDepth = 9,
}) {
  return row$ => {
    const leafToTrain$ = new Subject();
    const columns$ = row$.pipe(
      // create a dataframe with all of the data stored as a matrix
      createSortedColumnsFromRows(),
      shareReplay(1)
    );
    const leaf$ = leafToTrain$.pipe(
      mergeMap(leafToTrain => columns$.pipe(
        filter(), // FIXME - must filter samples correctly
        // {depth, leafId, numSamples, parentId, totalLabelCounts, childIds
        cartLeaf({...leafToTrain, gainOperator})
      )),
      // stop when maximum leaf condition is hit
      takeUntil(leafToTrain$.pipe(
        count(),
        filter(num => num >= maxLeaves),
      )),
      tap(leaf => (
        leaf.depth < maxDepth
        ? initializeChildLeaves({parentLeaf: leaf}).map(leafToTrain$.next)
        : null
      ))
    );
    const tree$ = leaf$.pipe(
      scan((tree, leaf) => ({
        ...tree,
        leaves: [...tree.leaves, leaf],
      }), {maxDepth, maxLeaves, leaves: []})
    );
    return tree$;
  };
};

export const testExports = {
  createSortedColumnsFromRows
};
export default cartTree;

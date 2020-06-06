import {of} from 'rxjs';
import {tap} from 'rxjs/operators';

import giniGain from '../internals/giniGain';
import cartTree from '../internals/cartTree';

const classifier = function classifier({
  initialState = {},
  gainOperator = giniGain,
  treeType = 'cart',
  presorted = false,
}) {
  let treeOperator;
  switch (treeType) {
    case 'cart':
      treeOperator = cartTree;
      break;
    default:
      treeOperator = cartTree;
      break;
  }
  return source$ => source$.pipe(
    treeOperator({initialState, gainOperator, presorted, maxLeaves, maxDepth})
  );
};

export default classifier;

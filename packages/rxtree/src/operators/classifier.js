import {of} from 'rxjs';
import {tap} from 'rxjs/operators';

import giniGain from './giniGain';
import cartTree from './cartTree';

const fit = function fit({
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

export default fit;

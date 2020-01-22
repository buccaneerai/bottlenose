import {of} from 'rxjs';

import giniGain from './giniGain';
import cartTree from './cartTree';

const fit = function fit({
  initialState = {},
  // stop$ = of(),
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
    treeOperator({})
  );
};

export default fit;

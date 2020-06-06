// https://jamesmccaffrey.wordpress.com/2018/09/06/calculating-gini-impurity-example/
// https://github.com/rasbt/python-machine-learning-book/blob/master/faq/decision-tree-binary.md
import flow from 'lodash/fp/flow';
import reduce from 'lodash/fp/reduce';
import sum from 'lodash/sum';
import values from 'lodash/fp/values';
import {map} from 'rxjs/operators';

function getGiniImpurity({labelCounts, totalSampleCount}) {
  const impurity = 1 - flow([
    values,
    reduce(
      (memo, labelCount) => memo + ((labelCount / totalSampleCount) ** 2),
      0
    )
  ])(labelCounts);
  return impurity;
}

function getTotalSampleCounts(totalLabelCounts) {
  const count = flow([
    values,
    reduce((memo, labelCount) => memo + labelCount, 0),
  ])(totalLabelCounts);
  return count;
}

function computeGainForSplit(
  splitLabelCounts,
  totalSampleCount,
  sampleImpurity
) {
  const splitImpurities = splitLabelCounts
    .map(labelCounts => {
      const count = getTotalSampleCounts(labelCounts);
      return {
        count,
        impurity: getGiniImpurity({labelCounts, totalSampleCount: count})
      };
    })
    .map(split => ((split.count / totalSampleCount) * split.impurity));
  const gain = sampleImpurity - sum(splitImpurities);
  return gain;
}

/**
@param {Object} totalLabelCounts - Each feature should be a key on the object
                and each value should be the count for the label frequency.
@return Number - the gini gain of the split
*/
const giniGain = function giniGain(totalLabelCounts) {
  // The source observable should be a stream of the label counts for each split
  // in the form of [countsAbove,countsBelow] which are each an object of the
  // form {[label0]: countNum, [label1]: countNum}
  return splitLabelCounts$ => {
    const totalSampleCount = getTotalSampleCounts(totalLabelCounts);
    const sampleImpurity = getGiniImpurity({
      totalSampleCount,
      labelCounts: totalLabelCounts
    });
    const gain$ = splitLabelCounts$.pipe(
      map(splitLabelCounts => (
        computeGainForSplit(splitLabelCounts, totalSampleCount, sampleImpurity)
      ))
    );
    return gain$;
  };
};

export const testExports = { getGiniImpurity, getTotalSampleCounts };
export default giniGain;

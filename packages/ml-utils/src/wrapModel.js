import {scan} from 'rxjs/operators';

const wrapModelInput = function wrapModelInput({
  indexKeys = null,
  featureKeys = null,
  featureDataTypes = null,
  labelKeys = null,
}) {
  const tasks = [
    (
      featureKeys
      ? mapTo(featureKeys)
      : inferFeatureKeys()
    ),
    (
      labelKeys
      ? null
      : inferLabelKeys()
    ),
    (
      featureDataTypes
      ? null
      : inferDataTypes({featureKeys, featureDataTypes})
    ),
  ];
  return source$ => source$.pipe(...tasks);
};

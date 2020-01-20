import {appendFile,writeFile as fsWrite} from 'fs';
import {bindNodeCallback} from 'rxjs';
import {mergeMap,scan} from 'rxjs/operators';

const writeFile = function writeFile({
  filePath,
  options = {},
  _appendFile = bindNodeCallback(appendFile),
  _writeFile = bindNodeCallback(fsWrite),
}) {
  return fileChunk$ => fileChunk$.pipe(
    scan(([index, chunk]) => [index + 1, chunk], [-1, null]),
    mergeMap(([index, chunk]) => (
      index === 0
      ? _writeFile(filePath, chunk, options)
      : _appendFile(filePath, chunk, options)
    ))
  );
};

export default writeFile;

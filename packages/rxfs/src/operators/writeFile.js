import {createWriteStream} from 'fs';

const writeFile = function writeFile({
  filePath,
  writeOptions = {},
  _createWriteStream = createWriteStream
}) {
  const ws = _createWriteStream(filePath, writeOptions);
  return fileChunk$ => fileChunk$.pipe(
  );
};

export default writeFile;

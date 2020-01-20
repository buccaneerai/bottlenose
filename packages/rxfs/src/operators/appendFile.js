import {appendFile as fsAppend} from 'fs';
import {bindNodeCallback} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

const appendFile = function appendFile({
  filePath,
  options = {},
  _appendFile = bindNodeCallback(fsAppend),
}) {
  return data$ => data$.pipe(
    mergeMap(data => _appendFile(filePath, data, options))
  );
};

export default appendFile;

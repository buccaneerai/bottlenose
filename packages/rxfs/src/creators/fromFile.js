import {Observable} from 'rxjs';
import {createReadStream} from 'fs';

const fromFile = function fromFile({
  filePath,
  _createReadStream = createReadStream,
}) {
  return new Observable(obs => {
    const rs = _createReadStream(filePath);
    rs.on('data', chunk => obs.next(chunk));
    rs.on('close', () => obs.complete());
    rs.on('error', err => obs.error(err));
    // rs.on('readable');
    // rs.on('end');
    // rs.on('pause');
    // rs.on('resume');
    return () => rs.destroy();
  });
};

export default fromFile;

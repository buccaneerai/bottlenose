import { distinctUntilChanged, map } from 'rxjs/operators';

const client = function client() {
  return ws$ => ws$.pipe(
    map(([socket]) => socket),
    distinctUntilChanged()
  );
};

export default client;

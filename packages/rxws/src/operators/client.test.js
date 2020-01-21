import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import {BehaviorSubject,of} from 'rxjs';

import client from './client';

describe('client operator', () => {
  it('should map stream to the SocketIO client', marbles(m => {
    const fakeClient = {iamaclient: true};
    const obs$ = m.cold('(0|)', [[fakeClient, 'someevent']]);
    const client$ = obs$.pipe(client());
    m.expect(client$).toBeObservable(m.cold(
      '(0|)',
      [fakeClient]
    ));
  }));
});

// import {expect} from 'chai';
// import sinon from 'sinon';
// import {marbles} from 'rxjs-marbles/mocha';
// import {from,of} from 'rxjs';
// import {take} from 'rxjs/operators';
// import {fromFile} from '@bottlenose/rxfs';

// import toGCP from './toGCP';

// describe('operators.toGCP', () => {
//   it('should call its workflows correctly', done => {
//     const onData = sinon.spy();
//     const onError = sinon.spy();
//     const sttOperator = sinon.stub().returns(from(['hello world', 'byeee']));
//     const params = {
//       GOOGLE_APPLICATION_CREDENTIALS: 'fakegooglecredentials'
//     };
//     const fileChunk$ = from(['011011', '110110']);
//     const out$ = fileChunk$.pipe(toGCP(params));
//     out$.subscribe(onData, onError, () => {
//       expect(onError.called).to.be.false;
//       expect(sttOperator.callCount).to.equal(1);
//       expect(onData.callCount).to.equal(3);
//       expect(onData.getCall(2).args[0]).to.deep.equal({content: 'byeee'});
//       done();
//     });
//   });
// });

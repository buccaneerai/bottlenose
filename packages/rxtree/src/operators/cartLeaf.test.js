import omit from 'lodash/omit';
import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import {from, of} from 'rxjs';
import {map,mapTo} from 'rxjs/operators';

import cartLeaf, { testExports } from './cartLeaf';
const {
  getBestSplits,
  getSamplesInColumn,
  getLabelCountForSamples,
  getLeafIndex,
  makeLeaf
} = testExports;

const fakeLeaf = {
  parentId: 'foogranny',
  _id: 'foomommy',
  depth: 3,
  numSamples: 8,
  splitValue: 5,
  splitColumn: 1,
  splitGain: 0.5,
  childIds: ['foobaby', 'barbaby'],
};

describe('cartLeaf operator', () => {
  // it('should return accurate leaf when given valid data', done => {
  //   const onData = sinon.spy();
  //   const onError = sinon.spy();
  //   const sampleIds = [0, 1, 2, 3, 4];
  //   const middleware = {};
  //   const bestSplit = {gain: 0.5, splitValue: 5, splitColumn: 2};
  //   const leaf = {...fakeLeaf};
  //   const params = {
  //     sampleId$: from(sampleIds),
  //     middleware$: {
  //       ...of(middleware),
  //       pipe: sinon.stub().returns(),
  //       count: sinon.stub().returns(of(3)),
  //       mapCols: sinon.stub().returns(from([1, 1, 1, 1, 1]))
  //     },
  //     leafId: 'foobar',
  //     numSamples: 5,
  //     columnIndexes: [0, 1, 2],
  //     parentId: 'foobar',
  //     depth: 3,
  //     gainFunction: sinon.spy(),
  //     _getSamplesInColumn: sinon.stub().returns(from(sampleIds)),
  //     _getBestSplits: sinon.stub().returns(of(bestSplit)),
  //     _makeLeaf: sinon.stub().returns(of(leaf)),
  //     _getLabelCountForSample: sinon.stub().returns(of({
  //       0: 3,
  //       1: 2,
  //     })),
  //     _getLeafIndex: sinon.stub().returns(from([0, 1, 2, 3, 4]))
  //   };
  //   cartLeaf(params).subscribe(onData, e => console.log('leaf.ERR', e), () => {
  //     expect(onError.called).to.be.false;
  //     expect(middleware$.count.callCount).to.equal(2);
  //     expect(params._getSamplesInColumn.callCount).to.equal(3);
  //     expect(params._getSamplesInColumn.getCall(1).args[0]).to.have.keys([
  //       'middleware$',
  //       'sampleId$',
  //       'totalLabelCount$',
  //       'columnIndex',
  //     ]);
  //     expect(params._getLabelCountForSample.callCount).to.equal(1);
  //     expect(params._getLabelCountForSample.getCall(0).args[0]).to.have.keys([
  //       'middleware$',
  //       'sampleId$',
  //     ]);
  //     expect(params._getBestSplits.calledOnce).to.be.true;
  //     expect(params._getBestSplits.firstCall.args[0]).to.have.keys([
  //       'columnStreams',
  //       'totalLabelCount$',
  //       'gainFunction',
  //       'maxConcurrentColumnStreams'
  //     ]);
  //     expect(params._getLeafIndex.calledOnce).to.be.true;
  //     expect(params._makeLeaf.calledOnce).to.be.true;
  //     expect(params._makeLeaf.firstCall.args[0]).to.deep.include({
  //       depth: params.depth,
  //       parentId: params.parentId,
  //       numSamples: params.numSamples,
  //     });
  //     expect(onData.calledOnce).to.be.true;
  //     expect(onData.firstCall.args[0]).to.deep.include({...leaf});
  //     done();
  //   });
  //   if (onError.called) console.log('ERR', onError.firstCall.args[0]);
  // });

  it('should correctly find the best splits for each column', marbles(m => {
    const params = {
      columnStreams: [from([0, 1, 2, 3]), from([4, 5, 6, 7])],
      totalLabelCount$: of({0: 5, 1: 3}),
      gainFunction: sinon.spy(),
      _bestSplit: sinon.stub().returns(source$ => source$.pipe(
        mapTo({
          gain: 0.5,
          splitValue: 3,
          labelCounts: {0: 4, 1: 4}
        })
      )),
      maxConcurrentColumnStreams: 1,
    };
    const actual$ = getBestSplits(params);
    const expected$ = m.cold('(01|)', [{
      gain: 0.5,
      splitValue: 3,
      labelCounts: {0: 4, 1: 4},
      splitColumn: 0,
    },
    // {
    //   gain: 0.5,
    //   splitValue: 3,
    //   labelCounts: {0: 4, 1: 4},
    //   splitColumn: 1,
    // }
    ]);
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('makeLeaf() should correctly generate leaf from input data', marbles(m => {
    const splits = [
      {gain: 0.2, splitValue: 3, splitColumn: 0},
      {gain: 0.5, splitValue: 4, splitColumn: 1},
      {gain: 0.3, splitValue: 5, splitColumn: 2},
    ];
    const input$ = m.cold('01(2|)', splits);
    const params = {
      leafId: 'foobar',
      parentId: 'foobardaddy',
      numSamples: 5,
      depth: 3,
    };
    const actual$ = input$.pipe(
      makeLeaf(params),
      // omit childIds since it is random and harder to test...
      map(leaf => omit(leaf, 'childIds'))
    );
    const expected$ = m.cold('--(3|)', {
      3: {
        parentId: params.parentId,
        numSamples: params.numSamples,
        depth: params.depth,
        _id: params.leafId,
        splitValue: splits[1].splitValue,
        splitColumn: splits[1].splitColumn,
        splitGain: splits[1].gain,
      },
    });
    m.expect(actual$).toBeObservable(expected$);
  }));

  // it('getSamplesInColumn() should properly stream samples from column', done => {
  //   const onData = sinon.spy();
  //   const onError = sinon.spy();
  //   const sampleIds = [0, 1, 2, 3, 4];
  //   const samples = sampleIds.map(_id => ({_id, squared: _id * _id, label: 0}));
  //   const middleware$ = from([{foo: 'bar'}]);
  //   // middleware$.where = sinon.stub().returns(from(sampleIds));
  //   middleware$.pipe = sinon.stub().returns(from(samples));
  //   middleware$.where = sinon.stub();
  //   const params = {
  //     middleware$,
  //     sampleId$: from(sampleIds),
  //     columnIndex: 3,
  //   };
  //   getSamplesInColumn(params).subscribe(onData, onError, () => {
  //     expect(onError.called).to.be.false;
  //     expect(params.middleware$.pipe.calledOnce).to.be.true;
  //     expect(params.middleware$.where.calledOnce).to.be.true;
  //     expect(params.middleware$.where.firstCall.args[0]).to.deep.include({
  //       _id: {$in: sampleIds},
  //     });
  //     expect(params.middleware$.where.firstCall.args[1]).to.deep.include({
  //       fields: ['_id', 3, 'label'],
  //       sort: {3: 1}
  //     });
  //     expect(onData.callCount).to.equal(5);
  //     expect(onData.getCall(4).args[0]).to.deep.equal({
  //       _id: 4,
  //       feature: 16,
  //       label: 0
  //     });
  //     done();
  //   });
  // });

  // it('getLabelCountForSamples() should properly count labels in column', done => {
  //   const onData = sinon.spy();
  //   const onError = sinon.spy();
  //   const sampleIds = [0, 1, 2, 3, 4];
  //   let middleware$ = from([{foo: 'bar'}]);
  //   middleware$.pipe = sinon.stub().returns(of(5))
  //   middleware$.pipe.onCall(0).returns(of(3));
  //   middleware$.count = sinon.stub()
  //     .onCall(0).returns(from([3]))
  //     .returns(from([5]));
  //   const params = {
  //     middleware$,
  //     sampleId$: from(sampleIds),
  //   };
  //   const labelCounter$ = getLabelCountForSamples(params);
  //   labelCounter$.subscribe(onData, onError, () => {
  //     expect(onError.called).to.be.false;
  //     expect(middleware$.pipe.callCount).to.equal(2);
  //     expect(middleware$.count.callCount).to.equal(2);
  //     expect(middleware$.count.getCall(0).args[0]).to.deep.equal({
  //       _id: {$in: sampleIds},
  //       label: {$eq: 1},
  //     });
  //     expect(middleware$.count.getCall(1).args[0]).to.be.a('undefined');
  //     expect(onData.calledOnce).to.be.true;
  //     expect(onData.firstCall.args[0]).to.deep.equal({0: 2, 1: 3});
  //     done();
  //   });
  //   if (onError.called) console.log('ERR', onError.firstCall.args[0]);
  // });

  //  it('getLeafIndex() should have a test', done => {
  //   expect(false);
  //  });
});

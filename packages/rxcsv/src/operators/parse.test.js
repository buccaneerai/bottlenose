import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';

import parse from './parse';

const csvStrings = [
  '"name","systolicBp","dialostilicBp","message"\n',
  '"Blackbeard",140,91,"Yarr"\n"Crunch",120,',
  ',180,"Arr"\n"Sparrow",110,70,"Savvy"\n',
];

describe('operators.parse', () => {
  it('should produce correct row objects when given valid CSV', marbles(m => {
    const csvStr$ = m.cold('--0--1(2|)', csvStrings);
    const row$ = csvStr$.pipe(parse());
    const expected$ = m.cold('-----0(12|)', [
      {name: 'Blackbeard', systolicBp: 140, diastolicBp: 91, message: 'Yarr'},
      {name: 'Crunch', systolicBp: 120, diastolicBp: 80, message: 'Arr'},
      {name: 'Sparrow', systolicBp: 110, diastolicBp: 70, message: 'Savvy'},
    ]);
    m.expect(row$).toBeObservable(expected$)
  }));
});

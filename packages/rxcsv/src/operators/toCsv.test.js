import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';

import toCsv from './toCsv';

const rows = [
  {carModel: 'Audi', price: 10000, color: 'blue'},
  {carModel: 'BMW', price: 15000, color: 'red'},
  {carModel: 'Mercedes', price: 20000, color: 'yellow'},
  {carModel: 'Porsche', price: 30000, color: 'green'},
];

const csvStr = [
  `"carModel","price","color"\n"Audi",10000,"blue"`,
  '"BMW",15000,"red"',
  '"Mercedes",20000,"yellow"',
  '"Porsche",30000,"green"',
];

describe('operators.toCsv', () => {
  it('should properly output csv data', marbles(m => {
    const row$ = m.cold('-0-12---(3|)', rows);
    const csvRow$ = row$.pipe(toCsv());
    const expected$ = m.cold('-0-12---(3|)', csvStr);
    m.expect(csvRow$).toBeObservable(expected$);
  }));
});

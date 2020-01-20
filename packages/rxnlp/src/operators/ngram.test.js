import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';
import {of} from 'rxjs';

import ngram from './ngram';

const words = [
  'But',
  'I\'m',
  'a',
  'creep',
  'I\'m',
  'a',
  'weirdo',
];

const unigrams = [
  ['But',],
  ['I\'m',],
  ['a',],
  ['creep'],
  ['I\'m',],
  ['a',],
  ['weirdo'],
];

const bigrams = [
  ['But', 'I\'m',],
  ['I\'m', 'a'],
  ['a', 'creep'],
  ['creep', 'I\'m'],
  ['I\'m', 'a'],
  ['a', 'weirdo'],
];

const trigrams = [
  ['But', 'I\'m', 'a'],
  ['I\'m', 'a', 'creep'],
  ['a', 'creep', 'I\'m'],
  ['creep', 'I\'m', 'a'],
  ['I\'m', 'a', 'weirdo'],
];

describe('operators.ngram', () => {
  it('should correctly generate bigrams', marbles(m => {
    const input$ = m.cold('-012-345--(6|)', words);
    const result$ = input$.pipe(ngram());
    const expected$ = m.cold('--01-234--(5|)', bigrams);
    m.expect(result$).toBeObservable(expected$);
  }));

  it('should correctly generate trigrams', marbles(m => {
    const input$ = m.cold('-012-345--(6|)', words);
    const result$ = input$.pipe(ngram({n: 3}));
    const expected$ = m.cold('---0-123--(4|)', trigrams);
    m.expect(result$).toBeObservable(expected$);
  }));

  it('should correctly generate unigrams', marbles(m => {
    const input$ = m.cold('-012-45--(6|)', words);
    const result$ = input$.pipe(ngram({n: 1}));
    const expected$ = m.cold('-012-45--(6|)', unigrams);
    m.expect(result$).toBeObservable(expected$);
  }));
});

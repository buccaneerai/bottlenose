import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';
import {of} from 'rxjs';

import stem from './stem';

const text = [
  'Feet don\'t fail me now',
  'Take me to the finish line',
  'Oh, my heart, it breaks every step that I take',
  'But I\'m hoping at the gates, they\'ll tell me that you\'re mine',
  'Walking through the city streets, is it by mistake or design?',
];

const porterStemmedText = [
  'feet don\'t fail me now',
  'take me to the finish lin',
  'oh, my heart, it breaks every step that i tak',
  'but i\'m hoping at the gates, they\'ll tell me that you\'re min',
  'walking through the city streets, is it by mistake or design?',
];

const lancasterStemmedText = [
  'feet don\'t fail me now',
  'take me to the finish lin',
  'oh, my heart, it breaks every step that i tak',
  'but i\'m hoping at the gates, they\'ll tell me that you\'re min',
  'walking through the city streets, is it by mistake or design?',
];


describe('stem', () => {
  it('should default to stemming input strings using the Porter stemmer', marbles(m => {
    const text$ = m.cold('--0-1--2---(34|)', text);
    const actual$ = text$.pipe(stem());
    const expected$ = m.cold('--0-1--2---(34|)', porterStemmedText);
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should apply Lancaster stemmer if stemmer option is set to "lancaster"', marbles(m => {
    const text$ = m.cold('--0-1|', ['presumably', 'maximum']);
    const actual$ = text$.pipe(stem({stemmer: 'lancaster'}));
    const expected$ = m.cold('--0-1|', ['presum', 'maxim']);
    m.expect(actual$).toBeObservable(expected$);
  }));
});

const {interval,merge,of} = require('rxjs');
const {map} = require('rxjs/operators');
const {conduit} = require('../build/index');

const sendMessages = function sendMessages({
  url,
  timeInterval = 3500
}) {
  const initialGreeting$ = of({greeting: 'Hello! Nice to meet you.'});
  const checkinMessage$ = interval(timeInterval).pipe(
    map(n => ({greeting: `Hi again ${n}`}))
  );
  const io$ = merge(initialGreeting$, checkinMessage$).pipe(
    conduit({url})
  );
  return io$;
};

console.log('starting client...');
sendMessages({url: 'http://localhost:3000'}).subscribe(
  message => console.log('message', {message}),
  err => console.log('error', err),
  () => console.log('DONE')
);

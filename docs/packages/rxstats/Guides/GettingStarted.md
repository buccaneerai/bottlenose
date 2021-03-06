# Install

#### npm
```
npm i @bottlenose/rxstats --save
```
#### yarn
```
yarn add @bottlenose/rxstats
```

# Calculate real-time statistics!
```js
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { mean } from '@bottlenose/rxstats';

// create a data source
const pirate$ = from([
  {name: 'Henry Morgan', numShipsInFlotilla: 36, numOfCrew: 1900, numCannons: 240},
  {name: 'Captain Crunch', numShipsInFlotilla: 1, numOfCrew: 1, numCannons: 1},
  {name: 'BlackBeard', numShipsInFlotilla: 2, numOfCrew: 400, numCannons: 48},
]);

// describe calculations
const averageShipCount$ = pirate$.pipe(
  map(pirate => pirate.numShipsInFlotilla),
  mean()
);

// run the pipeline and do something with the results
averageShipCount$.subscribe(console.log);
```

# Next steps
* Check out the [full list of operators](https://buccaneerai.gitbook.io/bottlenose/data-analysis/rxstats/operators).
* Learn about [Hotstart Pipelines](https://buccaneerai.gitbook.io/bottlenose/data-analysis/rxstats/guides/warmstarts)
[![CircleCI](https://circleci.com/gh/buccaneerai/bottlenose/tree/master.svg?style=shield)](https://circleci.com/gh/buccaneerai/bottlenose/tree/master)
[![CircleCI](https://circleci.com/gh/buccaneerai/bottlenose/tree/dev.svg?style=shield)](https://circleci.com/gh/buccaneerai/bottlenose/tree/dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> ⚠️ Although most of the operators are functional, this monorepo is no longer maintained.  (The maintainers found Lerna to be too unwieldy to maintain and it generated more overhead than it was worth.)  Instead, the RxJS utilities have been moved to separate npm packages starting with `@buccaneerai/rxjs-<package-name>`.

## Description

🐬 RxJS offers a great toolkit for reactive functional programming.  But if you use RxJS in a larger software application, you may often find yourself handcrafting your own functions to handle common workflows and wrap them in RxJS observables (like streaming file data or connecting to a WebSocket). Bottlenose is a collection of npm packages that provide industrial-strength RxJS operators and utilities for handling common data streams (filesystems, CSV, AWS S3, Websockets, socket.io), analyzing data (statistics, NLP) and implementing machine learning models (like SVM).

Features:
- Embraces reactive functional programming. (All packages are built as wrappers on top of the [RxJS](https://rxjs.dev).)
- Built for software makers by software makers. (Use cases include startups, software enterprises, dev shops, full stack developers and other product creators.)
- Industrial strength: packages are reliable, lightweight, secure and performant
- Full stack: most modules are universal (browser, server, mobile, desktop)
- Expressive, concise, readable and declarative syntax (built on [RxJS pipeable operators](https://rxjs.dev)).
- Stream-based and real-time: Allows most data analysis tasks to be accomplished with stream-processing instead of memory-intensive batch processing.

You can use Bottlenose to...
- Integrate data sources (as streams) into applications
- Perform exploratory data analysis and data munging
- Build data-intensive products and performant data pipelines
- Write applications that are expressive, readable, easy to reason about and easy to test
- Train machine learning models (static or in real-time applications)

Bottlenose is a young project started in late 2019 so it has a limited but fast-growing feature set.  It is maintained by an opensource community. It is also actively used and improved by a healthcare AI startup called [Buccaneer](https://www.buccaneer.ai), which is adding new modules frequently as their team develops them for enterprise SaaS data pipelines.

## Documentation & Guides
[Documentation](https://buccaneerai.gitbook.io/bottlenose)

## Installation
Each Bottlenose module is namespaced under `@bottlenose` and installed separately.  [See the docs](https://buccaneerai.gitbook.io/bottlenose) for a list of all currently available modules.  For example, this would install Bottlenose's statistics module:
```
npm i --save @bottlenose/rxstats
```
Or
```
yarn add @bottlenose/rxstats
```

## Basic Usage
For a full list of operators and modules, [see the documentation](https://buccaneerai.gitbook.io/bottlenose).

#### Easily generate input streams
Bottlenose has [modules for handling common data input sources](https://buccaneerai.gitbook.io/bottlenose) like CSV, AWS S3, local file system and websockets.  For example, this would parse CSV input:
```javascript
import { from } from 'rxjs';
import { map  } from 'rxjs/operators';
import { parse } from '@bottlenose/rxcsv';

// Create a stream of raw CSV data
const csvString$ = from([
  'name,systolicBp,dialostilicBp,message\n', 
  'Blackbeard,140,91,Yarr\nCrunch,120,', 
  ',180,Arr\nSparrow,110,70,Savvy\n',
]);

// Stream the CSV data into an RxJS Subject
const row$ = csvString$.pipe(parse());
row$.subscribe();
// {name: "Blackbeard", systolicBp: 140, diastolicBp: 91, isAngry: true},
// {name: "Crunch", systolicBp: 120, diastolicBp: 80, isAngry: false},
// {name: "Sparrow", systolicBp: 110, diastolicBp: 70, isAngry: false},
```

#### Analyze data reactively
Bottlenose also has [modules for common data analysis tasks](https://buccaneerai.gitbook.io/bottlenose) (like descriptive statistics and NLP).  For example, this would calculate the mean on the csv stream from the previous example:
```javascript
import { map } from 'rxjs/operators';
import { mean } from '@bottlenose/rxstats';

// using the row$ csv from the prior example
const mean$ = row$.pipe(
  map(row => row.systolicBp), 
  mean() // calculate the mean on one of the columns
);
mean$.subscribe(console.log);
// 140
// 130
// 123.33333333333333
```

#### Train machine learning models reactively
Bottlenose is also adding [modules for common machine learning algorithms](https://buccaneerai.gitbook.io/bottlenose) (like SGD).  For example, this would train an SGD classifier:
```javascript
import {classifier} from '@bottlenose/rxsgd';

// train an SGD model on the example above
const sgd$ = row$.pipe(
  map(row => [[row.systolicBp, row.diastolicBp], row.isAngry]),
  classifier()
);
// train the classifier and emit it its new trained parameters each time 
// a new item is ingested
sgd$.subscribe();
```

## Community
If you share the goal of creating amazing data science tools for the Javascript community, then here are some ways to help:
- Star us on <a href='https://github.com/buccaneerai/bottlenose'>Github</a> ✨ :octocat: ✨
- [Become a contributor (even small contributions matter!)](https://github.com/buccaneerai/bottlenose/blob/master/CONTRIBUTING.md) 👑
- Are we missing the operator you need? 🤦 [Make a pull request to add it!](https://github.com/buccaneerai/bottlenose/blob/master/docs/contributing/crating_operators.md) 
- [Follow The Blog](https://medium.com/@bfla) ✒️
- Report & Debug Issues on <a href='https://github.com/buccaneerai/bottlenose'>Github</a> 🌊
- Provide feedback on the [Roadmap](https://github.com/buccaneerai/bottlenose/projects/1) ⛵
<!--- Slack channel would be very nice to have --->
<!--- - [Add your organization's logo to the list of users]() --->
<!--- - [Join Community Discussions]() 🐬 --->

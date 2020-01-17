[![CircleCI](https://circleci.com/gh/buccaneerai/bottlenose/tree/master.svg?style=shield)](https://circleci.com/gh/buccaneerai/bottlenose/tree/master)
[![CircleCI](https://circleci.com/gh/buccaneerai/bottlenose/tree/dev.svg?style=shield)](https://circleci.com/gh/buccaneerai/bottlenose/tree/dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Description

**Pre-release**: Note this package has not yet been released to npm.  It will hit npm toward the end of January 2020.

🐬 Bottlenose is a set npm modules which provide industrial-strength data analysis and machine learning tools for software makers who love JavaScript. It embraces reactive functional programming, [the Observable pattern](http://reactivex.io/documentation/observable.html) and [RxJS 6](https://rxjs.dev).  Bottlenose is modeled after gold standard tools like [R](https://www.r-project.org) and [pandas](https://pandas.pydata.org). Unlike many data science toolkits (which arise in academia) it is designed to meet the needs of makers and creators, including startups, dev shops, software enterprises, hobbyists and full stack developers.

It can be used for data munging and exploratory analysis as well as making data-driven applications. Bottlenose operators behave predictably, run in most environments using pure isomorphic JavaScript (client, server and native) and are easy to test. It provides a great developer experience by keeping code simple, expressive, concise, readable and reusable. Its implementations are lean, performant and declarative.

Bottlenose is a young project started in late 2019 so it has a limited but fast-growing feature set.  It is maintained by an opensource community. It is also actively used and improved by a healthcare AI startup called [Buccaneer](https://www.buccaneer.ai), which is adding new modules frequently as their team develops them for enterprise SaaS use cases.

## Installation
Each Bottlenose module is namespaced under `@bottlenose` and installed separately.  For example, this would install the `@bottlenose/rxstats` module:
```
npm i --save @bottlenose/rxstats
```
Or
```
yarn add @bottlenose/rxstats
```
[See the docs](https://buccaneerai.gitbook.io/bottlenose) for a list of all currently available modules.

## Documentation & Guides
[Documentation](https://buccaneerai.gitbook.io/bottlenose)

## Basic Usage
RxJS offers great toolkit for general reactive functional programming.  Bottlenose extends RxJS with domain-specific operators and utility functions. For a full list of operators and modules, [see the documentation](https://buccaneerai.gitbook.io/bottlenose).

Some of Bottlenose's modules are for processing various data sources and sinks (data stores).  Bottlenose also provides modules focused on data analysis.  For example, this code creates a CSV stream and calculates the mean on one of its columns:
```javascript
import { from } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { parse } from '@bottlenose/rxcsv';
import { mean } from '@bottlenose/rxstats';

// Create a stream of raw CSV data
const csvString$ = from([
  'name,systolicBp,dialostilicBp,message\n', 
  'Blackbeard,140,91,Yarr\nCrunch,120,', 
  ',180,Arr\nSparrow,110,70,Savvy\n',
]);

// Stream the CSV data into an RxJS Subject
const row$ = csvString$.pipe(
  parse(), 
  tap(console.log), 
  share()
);
// Output will look like this:
// {name: "Blackbeard", systolicBp: 140, diastolicBp: 91, message: 'Yarr'},
// {name: "Crunch", systolicBp: 120, diastolicBp: 80, message: 'Arr'},
// {name: "Sparrow", systolicBp: 110, diastolicBp: 70, message: 'Savvy'},

// Calculate the mean on one of the columns
const mean$ = row$.pipe(
  map(row => row.systolicBp),
  mean()
);
mean$.subscribe(console.log);
// 140
// 130
// 123.33333333333333
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
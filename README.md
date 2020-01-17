[![CircleCI](https://circleci.com/gh/buccaneerai/bottlenose/tree/master.svg?style=shield)](https://circleci.com/gh/buccaneerai/bottlenose/tree/master)
[![CircleCI](https://circleci.com/gh/buccaneerai/bottlenose/tree/dev.svg?style=shield)](https://circleci.com/gh/buccaneerai/bottlenose/tree/dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Description
🐬 Bottlenose is a set of reactive data analysis and machine learning tools for software makers who love JavaScript. It uses [the Observable pattern](http://reactivex.io/documentation/observable.html) and [RxJS 6](https://rxjs.dev).  Bottlenose makes it easy to perform data analysis on streams in native JavaScript, providing functionality modeled after gold standard tools like [R](https://www.r-project.org) and [pandas](https://pandas.pydata.org).

It can be used for data munging as well as making data-intensive applications that use reactive functional programming, behave predictably, run in most environments using pure isomorphic JavaScript (client, server and native) and are easy to test. It provides a great developer experience by keeping code simple, expressive, concise and reusable. The implementations are lightweight, performant and declarative.

Bottlenose is a young project started in late 2019 so it has a limited but fast-growing feature set.  It is maintained by an opensource community. It is also actively used and maintained by a healthcare AI startup called [Buccaneer](https://www.buccaneer.ai), which is adding new modules all the time as their team needs and develops them.

## Documentation
[Documentation](https://buccaneerai.gitbook.io/bottlenose)

## Examples
RxJS offers great toolkit for general reactive funcational programming.  Bottlenose offers domain-specific operators and tools.  

Some of Bottlenose's modules are for processing various data sources and sinks (data stores).  For example, here is an operator that parses CSV data:
```javascript
import {parse} from '@bottlenose/rxcsv';
const csvString$ = from([
  'name,systolicBp,dialostilicBp\n', 
  'Blackbeard,141:91\n', 
  'Captain\ Crunch,120:180', 
  '' 
]);
const row$ = csvString$.pipe(parse());
row$.subscribe(console.log);
// {name: "Blackbeard", bloodPressure: "140:91"},
// {name: "Captain Crunch", bloodPressure: "120:80"},
// {name: "Sparrow", bloodPressure: "110:70"}
```

Other Bottlenose modules focus on data analysis:
```javascript
import {mean} from '@bottlenose/rxstats';
const number$ = from([4, 2, 5, 9]);
const mean$ = number$.pipe(mean());
// 4
// 3
// 3.6666666666666665
// 5
```

## Community
If you share the goal of creating amazing data science tools for the Javascript community, then here are some ways to help:
- Star us on <a href='https://github.com/buccaneerai/bottlenose'>Github</a> ✨ :octocat: ✨
- [Become a contributor (even small contributions matter!)](https://github.com/buccaneerai/bottlenose/blob/master/CONTRIBUTING.md) 👑
- [Are we missing the operator you need? Make a pull request to add it!](https://github.com/buccaneerai/bottlenose/blob/master/docs/contributing/crating_operators.md) 🤦 
- [Follow The Blog](https://medium.com/@bfla) ✒️
- Report & Debug Issues on <a href='https://github.com/buccaneerai/bottlenose'>Github</a> 🌊
- Provide feedback on the [Roadmap](https://github.com/buccaneerai/bottlenose/projects/1) ⛵
<!--- Slack channel would be very nice to have --->
<!--- - [Add your organization's logo to the list of users]() --->
<!--- - [Join Community Discussions]() 🐬 --->
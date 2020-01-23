[![CircleCI](https://img.shields.io/circleci/build/gh/buccaneerai/bottlenose/dev?label=master)](https://circleci.com/gh/buccaneerai/bottlenose/tree/dev)
[![CircleCI](https://img.shields.io/circleci/build/gh/buccaneerai/bottlenose/dev?label=dev)](https://circleci.com/gh/buccaneerai/bottlenose/tree/dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?color=blue)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/static/v1?color=6A56A8&label=PRs&message=welcome)](https://buccaneerai.gitbook.io/bottlenose/contributing/contributing)

## Description

🐬 Bottlenose is a set of npm packages which provide industrial-strength data analysis and machine learning tools for software makers who love JavaScript. 

Bottlenose differs from most data analysis tools in the following respects:
- Embraces reactive **functional programming**. (All packages are built as wrappers on top of the [RxJS](https://rxjs.dev).)
- Modeled after **gold standard data analysis tools** like [R](https://www.r-project.org) and [pandas](https://pandas.pydata.org).
- **Built for software makers by software makers**. (Use cases include startups, software enterprises, dev shops, full stack developers and other product creators.)
- **Full stack & universal**: Most modules can run anywhere (browser, server, mobile, desktop)
- **Expressive, concise, readable and declarative** syntax (built on [RxJS pipeable operators](https://rxjs.dev)).
- **Stream-based & real-time**: Allows most data analysis tasks to be accomplished with stream-processing instead of memory-intensive batch processing.
- **Lightweight, secure and performant**

You can use Bottlenose to...
- Perform exploratory data analysis and data munging
- Build data-intensive products and enterprise-ready data pipelines
- Handle data streams
- Train machine learning models (static or in real-time applications)
- Write applications that are expressive, readable, easy to reason about and easy to test

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
RxJS offers great toolkit for general reactive functional programming.  Bottlenose extends RxJS with domain-specific operators and utility functions. For a full list of operators and modules, [see the documentation](https://buccaneerai.gitbook.io/bottlenose).

#### Easily generate input streams
Bottlenose has [modules for handling common data input sources](https://buccaneerai.gitbook.io/bottlenose) like CSV, AWS S3, local file system and websockets.  For example, this would parse CSV input:
```javascript
import { from } from 'rxjs';
import { map  } from 'rxjs/operators';
import { fromFile } from' @bottlenose/rxfs';
import { parse } from '@bottlenose/rxcsv';

// Suppose there is a csv file containing this data:
// "name","systolicBp","dialostilicBp","isAngry" 
// "Blackbeard",140,91,"true"
// "Crunch",120,180,"false"
// "Sparrow",110,70,"false"

const row$ = fromFile('./my-csv.csv').pipe(parse());
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

// using the row$ data from the prior example
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
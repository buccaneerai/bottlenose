# Contributing

<img src="https://github.com/buccaneerai/rxjs-stats/raw/master/docs/contributing/mandolorian.jpg" />

👍 First off, thank you for your interest in contributing.  To develop better data analysis and machine learning tools, JavaScript very much needs the help of opensource contributors!

## Who are we?

You might be wondering who the other authors and contributors are...  Bottlenose was originally authored by Brian Flaherty, a technical serial entrepreneur who had served on the leadership teams at multiple successful startups in the healthcare and fintech industries.  He loved JavaScript and wanted to build entire end-to-end products in a single language.  But many common data analysis and machine learning tasks were difficult to perform in JavaScript since it didn't have the same high-quality data analysis tools that exist in mathy programming languages preferred by academia (like Python and R).  Since the tools his team needed did not exist in the opensource (npm) world, he began building data analysis tools from scratch so that the companies he worked with could write their entire code bases in reactive, functional JavaScript.  The project grew to include teammates who he had worked with on other projects and they eventually realized that other people might benefit if the code were converted to a public opensource project.  The project is still actively maintained by the team at Buccaneer and is now open to everyone who wants to build data-intensive products with fullstack, reactive JavaScript.

## Communication
If enough contributors want to be involved, then we'll setup a chatroom.  In the meantime, you can [email the project authors](mailto:opensource@buccaneer.ai).

## The Code
Let's keep things simple.  As contributors to the Bottlenose project, we all agree to the following social contract:
- Be like a bottlenose. Dolphins's are nature's perfect communicators and teammates. We should try to be the same.
- We agree to keep a positive attitude and treat each other with respect and humility.
- We agree to make decisions and act in accordance with the [Project's Goals](https://github.com/buccaneerai/bottlenose/blob/master/docs/Philosophy.md), even if they may differ somewhat from our personal preferences and goals.
- We agree to treat end users and other community members with respect, even if their level of experience and knowledge is different than our own. Even if someone is disrespectful to us out of frustration or arrogance, it still reflects poorly on us if we lower ourselves to that level and respond in kind.
- We agree to practice honesty and not to mislead or badmouth our co-collaborators.
- We agree to welcome others into the project and help them learn.
- We agree that anyone who violates these rules should fess up and apologize.
- We agree that project maintainers reserve the right to kick out any collaborator who breaks the social contract. If you break the code, you walk to the plank.

If you agree, then great! Welcome aboard matey!

## Getting started

### Dependencies
Contributors will need to install these dependencies:
- node.js >=12 (nvm is recommended but not required)
- [yarn](https://yarnpkg.com/en/) >1.12

### Installation
To contribute to `bottlenose` packages, you'll need a working copy of the source code:
```
git clone https://github.com/buccaneerai/bottlenose.git
cd bottlenose
# install package dependencies
yarn install
# run lerna
yarn bootstrap 
# run tests. these should pass!
yarn test
# lint the code. this should pass!
yarn lint
```
If any of these steps failed but the project's build is passing on the repository's `dev` branch, then there is probably something wrong with your local installation.

This project uses [Lerna](https://lerna.js.org) and [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).  It contains multiple packages, which are all in the `./packages` directory. They are mostly the same as normal `npm` packages with a few caveats.  Lerna allows scripts (like test scripts, linting and npm releases) to be run on multiple packages at once.  This setup also also allows a single set of infrastructure (like devDependencies, docs, etc.) to be shared.  It isn't perfect but it's much more managable than mantaining a large number of separate repositories.

There are two other packages that are used in many of these packages: `lodash` and `rxjs`.

### Quick Tutorial
Most of the public APIs in bottlenose are exposed as RxJS pipeable operators.  Contributors are expected to read the guide about how to [create new Bottlenose operators](https://github.com/buccaneerai/rxjs-stats/blob/master/docs/Guides/CreatingOperators.md).

## Workflow
We generally use the "pull request" workflow for all changes to the package. It typically works like this:
- [ ] Fork the git repo and clone it
- [ ] Cut a feature branch from dev: `git checkout -b new-feature`
- [ ] Make changes on the branch
- [ ] Run tests: `yarn test`
- [ ] Lint the code (using Airbnb Style): `yarn lint`
- [ ] Make sure your code changes are [reflected in the documentation](https://github.com/buccaneerai/bottlenose/blob/master/docs/contributing/improving_docs.md)
- [ ] Commit changes to the branch and push it to GitHub
- [ ] On Github, make a pull request to the `dev` branch in bottlenose
- [ ] A project maintainer will review the pull request and do a code review

## Code conventions & readability

In general, please write and structure your code to conform to the same pattern as other packages and modules in Bottlenose.  Here are some of the conventions that the codebase follows:
- For simplicity and consistency, code should conform to the [Airbnb Style Guide](https://github.com/airbnb/javascript).
- Don't install unnecessary `npm` packages.  If there is a good reason to install one, then it should be a secure, lightweight, trustworthy and widely used package.
- Whenever possible, write code as pure functions instead of using JavaScript classes, factories, constructors, native for loops, or other complex patterns. (These are harder to test, harder to read, harder to reason about and more likely to create side effects or bugs).
- Please avoid writing large files. If a file is getting large, break it into smaller pieces.
- We've intentionally decided not to use typing tools like TypeScript (due to the [TypeScript tax](https://medium.com/javascript-scene/the-typescript-tax-132ff4cb175b)).
- Prefer RxJS Observables over promises, callbacks or async/await.
- Use Finnish notation to name variables that contain Observables: `item$`, not `item`. (This makes it easier to spot Observables versus native types.)

**Readability is crucial**.  If other people cannot read the code, then it makes life very difficult for end users and contributors.  Code that is hard to read also causes bugs, reduces the overall speed of the team and makes life less enjoyable.  Here are some rules of thumb, which will be checked in code reviews:
- Use **descriptive variable and function names**.  Please name variables like `exactlyWhatThisIs` or `calculateMean` instead of names like `x`, `foo`, `myFunction` or `thing`.
- **Functions should be short**.  A good rule of thumb is that they should be less than 20 lines long.  If it's too long, then the answer is usually to break it into multiple functions.
- **Write clear function signatures**.  It should be abundantly clear what a function is expected to take as its inputs.  If this can be done in the variable names, then great.  If it is unclear from the code, then please add a comment.  jsdoc is fine or any reasonable alternative.  Sometimes, this also means defining what type of data the input observable accepts.
- **Document the API**.  Public APIs should be added to the documentation unless they are intended to be hidden from users.

## Ways to contribute:
Here are some ways that contributors can help improve Bottlenose!
- Tackling GitHub issues (especially ones with the tags `good-first-issue` or `help-wanted`)
- Tasks on the Project Roadmap
- Adding new operators to existing modules
- Creating new @bottlenose packages
- Improving unit test coverage for things that are important
- Improving the docs.  The docs are not perfect.
- Adding guides or tutorials.  Do you have some useful information, tips or a cool example to show off?  Other Bottelnose users might find it helpful!


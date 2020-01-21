# Creating a new module

### Create a new module using lerna
```bash
cd ./bottlenose
yarn lerna create @bottlenose/my-new-module
```

### Setup the directory structure
```bash
cd packages/my-new-module
mkdir -p src/operators src/internals
touch src/index.js src/index.test.js src/operators/index.js src/operators/index.test.js
```

Bottlenose modules conform to the following convention for their organization:
```text
src/
--creators/       # functions which produce an RxJS Observable (rather than an operator)
----index.js      # exports all public creators
--internals/      # optional: internal functions and business logic
--operators/      # RxJS operators
----index.js      # exports all public operators
--scripts/        # any scripts intended to be run from the command line
--index.js        # exports all public functions
```

The code and tests for `index.js` and `operators/index.js` can be copied from the other bottlenose modules.  Please remain consistent with other modules.  (If you have a better idea for how to structure it, then talk to the other maintainers about it and we can make a decision as a team to migrate all of the modules in a consistent way.)

### Build cool stuff!
- To create new operators, see the "Creating New Operators" guide in the documentation.
- For information about contributing and workflow, see the "Contributing" guide.
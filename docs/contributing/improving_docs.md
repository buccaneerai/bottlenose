## Fixing problems in the documentation
Bottlenose is a community project and we rely on each other to help improve it.

If you you notice a problem with the documentation, you can help everyone out by making a pull request to improve it! Most pages in the documentation have an "Edit on Github" button.  You can use this feature to suggest changes and make a pull request to the `dev` branch.

If you're too busy or for some reason are unable to make a pull request, then the next best option is to create a Github issue to bring the problem to the attention of Bottlenose's maintainers.

## How the docs work
Bottlenose uses Gitbook to host its documentation.
- Documentation is written in the repository and then pushed to Gitbook, which provides nice presentation, navigation and other features that improve quality and ease-of-use. 
- Docs are updated and pushed to Gitbook when changes are merged to `dev`, `master` or any branch that fits the glob pattern `v*`.
- Docs can be added and in markdown files in the `./docs` folder
- Documentation pages need to be added to the table of contents in the `./docs/SUMMARY.md` file so that Gitbook will learn about them. More information is [available here](https://docs.gitbook.com/integrations/github).
- Each package also has a `README.md` in the root of its project.  This readme is added to the table of contents (`./docs/SUMMARY/md`).


Each package has its documentation organized as follows:
```
./docs
  --/packages
    --mypackage/
      --guides/       # docs for guides, tutorials and other information
        --installation.md
        --getting_started.md
        --tutorial1.md
      --operators/    # docs for publicly exposed operators
        --firstoperator.md
        --anotheroperator.md
      --creators/     # any public methods that create RxJS observables
        --firstcreator.md
        --secondcreator.md
```

## Workflow for updating docs with code changes
Generally developers should update documentation in sync with any changes that are made.  So if the public API for an operator is changed, its corresponding documentation should be updated at the same time before changes are merged to dev.  This helps to ensure that docs are always up-to-date.
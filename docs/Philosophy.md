## Project Goals & Features

**Expressive & Declarative**.  Users will be able to run common analysis, data transformations, statistical calculations, machine learning algorithms and data munging transformations using simple and conventional RxJS operators.

**Isomorphic**. Code is written in universal JavaScript whenever possible.

**Accessible and well documentated**: We are welcoming to newcomers.  We are committed to providing great documentation and onboarding for new users and contributors!  Whenever possible, we will explain concepts in plain language and avoid using jargon that is commonly used by mathematicians, data engineers or data scientists. Documentation should provide the API for each operator with practical examples and guides for the most common use cases.

**Opinionated**.  The goal is to build a great set of tools for the majority of users.  Sometimes that means saying no to ideas that make the package better for some niche of users but more complex (or otherwise worse) for the ecosystem as a whole.  Contributors and project maintainers should be honest about which features are not likely to be included in the core package.  For these types of things, we recommend users [create their own operators]() that can be installed separately by those who want them. 

**Reactive**. Instead of running calculations on large matrices which hog memory and compute power, Bottlenose libraries allow calculations to be run incrementally on streams \(something mathematicians "online algorithms"\) which cache only the minimum amount of information necessary to calculate the desired result.  The result is updated as more data is streamed into the pipeline.  This allows for performant, real-time calculations.

**Asynchronous**.  Whenever possible, is agnostic to whether observables are fed by asynchronous sources or local memory.

**Quick, Responsive & Decisive**.  We will make decisions quickly and respond in a timely manner to Github issues, support requests and emails. We don't leave GitHub issues open for months. If we don't have the resources to resolve it promptly, then we will table it, move it to the roadmap or empower the user make a pull request to fix it.

**Reliable, Maintained & Enterprise Ready**.  This package should be well tested and reliable for production use cases, including enterprises, dev shops and professional startups who rely on it for critical production applications.

**Minimal footprint & simple codebase**.  Most operators in this package are written as simple functions that contain under 20 lines of code.  This keeps the package size lean. It makes the codebase easy to understand. It makes the codebase easy for new users to jump into without needing to understand a lot of unusual tools or abstractions. We avoid installing npm packages unless there is a compelling reason to do so.

**Secure**.  Bottlenose minimizes outside npm dependencies, except for ones that are highly reliable and trustworthy. One reason is that it keeps package security easy to reason about and greatly reduces the attack surface for hackers.  It also uses a CD system that includes package security checks prior to any release and automated security updates (via Dependabot).
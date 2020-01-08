## Package Goals & Features

**Expressive & Declarative**.  Users should be able to handle WebSocket connections without a lot of fuss and pipe them into expressive RxJS pipelines.

**Isomorphic**. Code should be written in universal JavaScript that runs on node.js, browsers and other environments (React Native, Electron, etc).

**Accessible and well documentated**: The project should be easy to understand and welcoming to new contributors and users.  This means providing great documentation. And onboarding for contributors!

**Opinionated**.  The goal is to build a great package for the majority of users.  Sometimes that means saying no to ideas that make the package better for some niche of users but worse for the ecosystem as a whole.  Contributors and project maintainers should be honest about which features are not likely to be included in the core package.  For these types of things, we recommend users create their own operators that can be appended by those who want them.

**Reliable & Maintained**.  This package should be well tested and completely reliable for production use cases, including enterprises and startups who rely on it for critical applications. It should be maintained by independent opensource contributors as well as the core [Buccaneer](https://www.buccaneer.ai) team.

**Minimal footprint & simple codebase**.  Most operators in this package are written as simple functions that contain under 20 lines of code.  This keeps the package size lean. It makes the codebase easy to understand. It makes the codebase easy for new users to jump into without needing to understand a lot of unusual tools or abstractions.

**Secure**.  This project has only a few external `npm` dependencies which greatly reduces the attack surface.  It also uses a CD system that includes package security checks prior to any release.  And it assumes that WSS must be used to secure WebSockets unless the user explicitly indicates otherwise.
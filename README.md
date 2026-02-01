# @jonloucks/concurrency-ts

## Badges
[![CI](https://github.com/jonloucks/concurrency-ts/workflows/main-push/badge.svg)](https://github.com/jonloucks/concurrency-ts/actions)
[![npm version](https://raw.githubusercontent.com/jonloucks/concurrency-ts/refs/heads/badges/main-npm.svg)](https://www.npmjs.com/package/@jonloucks/concurrency-ts)
[![Coverage Badge](https://raw.githubusercontent.com/jonloucks/concurrency-ts/refs/heads/badges/main-coverage.svg)](https://jonloucks.github.io/concurrency-ts/lcov-report/)
[![Typedoc Badge](https://raw.githubusercontent.com/jonloucks/concurrency-ts/refs/heads/badges/main-typedoc.svg)](https://jonloucks.github.io/concurrency-ts/typedoc/)


Typescript Dependency Contracts for dependency inversion

## Documentation
* [Complete Documentation](DOCUMENTATION.md) - **Comprehensive guide with examples**
* [License](LICENSE.md)
* [Contributing](CONTRIBUTING.md)
* [Code of conduct](CODE_OF_CONDUCT.md)
* [Coding standards](CODING_STANDARDS.md)
* [Security policy](SECURITY.md)
* [Pull request template](PULL_REQUEST_TEMPLATE.md)
* [How to use API](https://jonloucks.github.io/concurrency-ts/typedoc/)
* [Test coverage report](https://jonloucks.github.io/concurrency-ts/lcov-report)

## Installation

```bash
npm install @jonloucks/concurrency-ts
```

## Usage

For comprehensive examples and detailed API documentation, see [DOCUMENTATION.md](DOCUMENTATION.md).

### Quick Start

```typescript
import { createConcurrency, Waitable, Completable, StateMachine } from '@jonloucks/concurrency-ts';

// Create a Concurrency instance
const concurrency = createConcurrency({});
using closeConcurrency = concurrency.open();

// Create a Waitable for thread-safe value storage
const waitable: Waitable<number> = concurrency.createWaitable({ initialValue: 0 });
using closeWaitable = waitable.open();

waitable.consume(42);
console.log(waitable.supply()); // 42

// Create a Completable to track async operations
const completable: Completable<string> = concurrency.createCompletable({});
using closeCompletable = completable.open();

completable.onCompletion((completion) => {
  console.log('Task completed:', completion.state, completion.value);
});

completable.notify({ state: 'SUCCEEDED', value: 'Done!' });

// Create a StateMachine for state management
type AppState = 'IDLE' | 'RUNNING' | 'STOPPED';

const stateMachine: StateMachine<AppState> = concurrency.createStateMachine({
  initialValue: 'IDLE',
  states: ['IDLE', 'RUNNING', 'STOPPED'],
  getStateRules: (state) => {
    switch (state) {
      case 'IDLE':
        return [{ event: 'start', allowedStates: ['RUNNING'] }];
      case 'RUNNING':
        return [{ event: 'stop', allowedStates: ['STOPPED'] }];
      default:
        return [];
    }
  }
});

using closeStateMachine = stateMachine.open();

console.log(stateMachine.getState()); // 'IDLE'
stateMachine.setState('start', 'RUNNING');
console.log(stateMachine.getState()); // 'RUNNING'
```

See [DOCUMENTATION.md](DOCUMENTATION.md) for more examples and advanced usage patterns.

## Development

<details markdown="1"><summary>Install dependencies</summary>

```bash
npm install
```
</details>

<details markdown="1"><summary>Build the project</summary>

```bash
npm run build
```
</details>

<details markdown="1"><summary>Run tests</summary>

```bash
npm test
```
</details>

<details markdown="1"><summary>Run tests in watch mode</summary>

```bash
npm run test:watch
```
</details>

<details markdown="1"><summary>Run test coverage</summary>

```bash
npm run test:coverage
```
</details>

<details markdown="1"><summary>Lint the code</summary>

```bash
npm run lint
```
</details>

<details markdown="1"><summary>Fix linting issues</summary>

```bash
npm run lint:fix
```
</details>

<details markdown="1"><summary>Generate documents</summary>

```bash
npm run docs
```
</details>

<details markdown="1"><summary>Generate badges</summary>

```bash
npm run badges
```
</details>

<details markdown="1"><summary>Project Structure</summary>

* All tests must have suffix of -test.ts or -spec.ts
* Tests that validate supported APIs go in src/test
* Tests that validate internal implementation details go in src/impl

```
concurrency-ts
├── .github
│   ├── ISSUE_TEMPLATE
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── workflows
│       ├── main-pull-request-matrix.yml
│       ├── main-pull-request.yml
│       ├── main-push.yml
│       └── main-release.yml
├── CODE_OF_CONDUCT.md
├── CODING_STANDARDS.md
├── CONTRIBUTING.md
├── editorconfig
├── eslint.config.mjs
├── jest.config.js
├── LICENSE
├── package-lock.json
├── package.json
├── PULL_REQUEST_TEMPLATE.md
├── README.md
├── scripts
│   ├── badge-template.svg.dat
│   └── tsconfig.json
├── SECURITY.md
├── src
│   ├── index.ts
│   ├── version.ts
│   ├── api
│   │   ├── *.ts
│   │   ├── *.api.ts
│   ├── auxiliary
│   │   ├── *.ts
│   │   ├── *.impl.ts
│   │   ├── *.test.ts    // internal implementation specific
│   │   └── *.api.ts
│   ├── impl
│   │   ├── *.ts
│   │   ├── *.impl.ts
│   │   ├── *.test.ts    // internal implementation specific
│   │   └── *.api.ts
│   ├── test
│   │   └── *.test.ts
│   └── never-publish             // non shippable development scripts
│       ├── *.ts
│       ├── *.*.                  // data files etc
│       └── *.test.ts
├── tsconfig.json
└── typedoc.json
```
</details>

## GitHub Workflows

<details markdown="1"><summary>CI Workflow</summary>

The CI workflow runs on every push and pull request to `main` branch. It:
- Tests against Node.js versions 18.x, 20.x, and 22.x
- Runs linting
- Builds the project
- Runs tests with coverage
- Uploads coverage to Codecov (optional)

</details>

<details markdown="1"><summary>Publish Workflow</summary>

The GitHub publishings workflows are run to make an official release.
- If all scanning and tests pass it is published. There is no other way allowed.
- Publishing authentication is done using ([OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers))

To set up your own publishing:
1. Publishing this project as is intentionally disabled
2. You are welcome to fork this repository and publish where you want.
3. Run `npm pkg delete private` to remove the `private` flag from the package.
4. Change the `name` field in `package.json` to your desired package name.

</details>

## License

MIT

<p align="center">
	<a target="_blank" href="https://github.com/marcin-piela/fetching-library">
        <img src="/docs/_media/logo.png" />
    </a>
</p>
<p >
Simple and powerful fetch API extension. Use request and response interceptors to deal with API.

[![Watch on GitHub][github-watch-badge]][github-watch][![Star on GitHub][github-star-badge]][github-star][![Tweet][twitter-badge]][twitter]

</p>

---

[![Build Status][build-badge]][build] [![version][version-badge]][package] ![downloads][downloads-badge] [![MIT License][license-badge]][license]
 [![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc] ![Gzip badge][gzip-badge] [![codecov](https://codecov.io/gh/marcin-piela/fetching-library/branch/master/graph/badge.svg)](https://codecov.io/gh/marcin-piela/fetching-library)

✅ Zero dependencies

✅ SSR support 

✅ Uses Fetch API

✅ Request and response interceptors allows to easily customize connection with API

✅ TypeScript support 

✅ Less than 1k minizipped

✅ Simple cache provider - easily to extend

---

# fetching-library

Request and response interceptors allows you to easily customize connection with API (add authorization, refresh token, cache, etc). It uses Fetch API so it can be use in SSR apps (ie. with isomorphic-fetch)

## Documentation

Full documentation is available at https://marcin-piela.github.io/fetching-library

## Installation

Run the following from your project root :

```sh
npm install fetching-library
```
or
```sh
yarn add fetching-library
```

## Short example of use

```js
import { Action, createClient, cache } from 'fetching-library';

const cache = createCache(
  (action) => {
    return action.method === 'GET';
  },
  (response) => {
    return new Date().getTime() - response.timestamp < 100000;
  },
);

const client = createClient({
  //None of the options is required
  requestInterceptors: [],
  responseInterceptors: [],
  cacheProvider: cache,
});

const action:Action= { 
  method: 'GET',
  endpoint: '/users',
};

client.query(action).then(response => {
  //response.status
  //response.error
  //response.errorObject
  //response.payload
});

```

## Do you want to use it in react app?

Check [react-fetching-library](https://github.com/marcin-piela/react-fetching-library)

## Contributing

Fell free to open PRs and issues to make this library better !

When making a PR, make sure all tests pass. If you add a new feature, please consider updating the documentation or codesandbox examples. Thank you!

## License

fetching-library is licensed under the [MIT license](http://opensource.org/licenses/MIT).

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/marcin-piela/fetching-library.svg?style=flat-square
[build]: https://travis-ci.org/marcin-piela/fetching-library
[version-badge]: https://img.shields.io/npm/v/fetching-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/fetching-library
[downloads-badge]: https://img.shields.io/npm/dm/fetching-library.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/fetching-library.svg?style=flat-square
[license]: https://github.com/marcin-piela/fetching-library/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/marcin-piela/fetching-library/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/marcin-piela/fetching-library.svg?style=social
[github-watch]: https://github.com/marcin-piela/fetching-library/watchers
[github-star-badge]: https://img.shields.io/github/stars/marcin-piela/fetching-library.svg?style=social
[github-star]: https://github.com/marcin-piela/fetching-library/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20fetching-library%20https%3A%2F%2Fgithub.com%2Fmarcin-piela%2Ffetching-library%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/marcin-piela/fetching-library.svg?style=social
[gzip-badge]:https://badgen.net/bundlephobia/minzip/fetching-library

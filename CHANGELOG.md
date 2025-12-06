# Changelog

## [0.9.0](https://github.com/KevinDeBenedetti/documentation/compare/v0.8.0...v0.9.0) (2025-12-06)


### Features

* add dependabot config weekly ([d567a10](https://github.com/KevinDeBenedetti/documentation/commit/d567a10e32b44328c9b43747edb04fad90f90d10))


### Bug Fixes

* let release please open in the ci ([7c88946](https://github.com/KevinDeBenedetti/documentation/commit/7c8894639b1f3c10fb04dbfa2c037c6a57f028b8))
* migrate from bun to pnpm in workflows and configurations ([717af75](https://github.com/KevinDeBenedetti/documentation/commit/717af75657708f17c235fa6025a2c6d93c03c023))
* remove cache configuration for bun in deploy workflow ([2a51fd9](https://github.com/KevinDeBenedetti/documentation/commit/2a51fd9c21dd11a4e9285acd4a3b043225879120))
* replace bun build with npx nuxt build in deploy workflow ([76279e3](https://github.com/KevinDeBenedetti/documentation/commit/76279e3376583104f8cb3e3db8bcdbd621b4be6c))
* update bun setup to version 2 and streamline workflows ([38b98c5](https://github.com/KevinDeBenedetti/documentation/commit/38b98c5bf95ab1ac661fa347ef25f745015a3d76))
* update Node.js setup and install steps in workflows to use pnpm caching and frozen lockfile ([b6a9923](https://github.com/KevinDeBenedetti/documentation/commit/b6a9923ee9528576c3b312e0b3011851f846eec9))
* update package-ecosystem in dependabot configuration from pnpm to npm ([84a06f7](https://github.com/KevinDeBenedetti/documentation/commit/84a06f7f27139591d11caca71fc91eaba7b19b92))
* use pnpx to run nuxt build in deployment workflow ([0d2b0f9](https://github.com/KevinDeBenedetti/documentation/commit/0d2b0f99bc67eddee63c6a55db674b89f1c19baf))

## [0.8.0](https://github.com/KevinDeBenedetti/documentation/compare/v0.7.0...v0.8.0) (2025-12-06)


### Features

* migrate workflows from pnpm to bun ([7fcd012](https://github.com/KevinDeBenedetti/documentation/commit/7fcd012cbf05e65da4a2e105562e0703056384f1))


### Bug Fixes

* format errors & orphan links ([17d32d7](https://github.com/KevinDeBenedetti/documentation/commit/17d32d7d2008672adadcf485293061203431efb3))
* remove redundant lint step and cache configuration ([8ec2793](https://github.com/KevinDeBenedetti/documentation/commit/8ec2793bbc18b1be60975a39eb1065df0f5d7419))

## [0.7.0](https://github.com/KevinDeBenedetti/documentation/compare/v0.6.0...v0.7.0) (2025-10-19)


### Features

* add a submodul & simplify Makefile ([dcec196](https://github.com/KevinDeBenedetti/documentation/commit/dcec1965547fbc9550809d5dd022cd7d892f6981))
* add actions in the header ([5417641](https://github.com/KevinDeBenedetti/documentation/commit/54176415cce90373d8143ab78fc687f897539ab5))
* refactor Makefile to use sparse checkout for make-library ([b47d07a](https://github.com/KevinDeBenedetti/documentation/commit/b47d07a22e6cf8ad9858e2c770e3970bf18e0106))
* remove submodule and integrate its functionality into Makefile ([e5a189c](https://github.com/KevinDeBenedetti/documentation/commit/e5a189ce1ea4c94a88b9010ec1a2e664bad1f859))
* update git doc ([d8b8970](https://github.com/KevinDeBenedetti/documentation/commit/d8b89707f596d90f0fbf25e9381fbc09252ec1c6))


### Bug Fixes

* update favicon path in nuxt.config.ts ([65d2784](https://github.com/KevinDeBenedetti/documentation/commit/65d2784a069eef93a9366260682960ead8d74dff))
* update submodule ([a9af4cb](https://github.com/KevinDeBenedetti/documentation/commit/a9af4cb29b8d82bec259adac561daa62cd7344c2))

## [0.6.0](https://github.com/KevinDeBenedetti/documentation/compare/v0.5.1...v0.6.0) (2025-10-14)


### Features

* components to show infos, translations & content ([603fa60](https://github.com/KevinDeBenedetti/documentation/commit/603fa60ac06ac3c0246ae40e5d0e53cc5c20f014))

## [0.5.1](https://github.com/KevinDeBenedetti/documentation/compare/v0.5.0...v0.5.1) (2025-10-13)


### Bug Fixes

* correct regex ([15ca1f5](https://github.com/KevinDeBenedetti/documentation/commit/15ca1f5d5abfa94e051e1d7ad4e07d626d3e4b86))
* use queryContent to get docs ([d185b58](https://github.com/KevinDeBenedetti/documentation/commit/d185b582d88fcdab8277211b9de35e43a0de4845))

## [0.5.0](https://github.com/KevinDeBenedetti/documentation/compare/v0.4.0...v0.5.0) (2025-10-12)


### Features

* add doc page with slug by id ([772dc02](https://github.com/KevinDeBenedetti/documentation/commit/772dc021ebcb8930ef8fee57ff5d778926270508))
* add github copilot instruction ([8f1f55d](https://github.com/KevinDeBenedetti/documentation/commit/8f1f55d515109e68920437d140c9c895454ba24e))
* refactor DocsTable & add route ([cdad1d9](https://github.com/KevinDeBenedetti/documentation/commit/cdad1d95ca769dd6a9498d32d4f6b56140988a94))

## [0.4.0](https://github.com/KevinDeBenedetti/documentation/compare/v0.3.1...v0.4.0) (2025-10-11)


### Features

* add document ID to Doc interface and update related components ([58e7b54](https://github.com/KevinDeBenedetti/documentation/commit/58e7b546b309117f07e6c159bd165377676e8725))

## [0.3.1](https://github.com/KevinDeBenedetti/documentation/compare/v0.3.0...v0.3.1) (2025-10-11)


### Bug Fixes

* remove checklist formatting for clarity in documentation ([be5b1c7](https://github.com/KevinDeBenedetti/documentation/commit/be5b1c75f3895eb136c097bb33cf46afcd0ddabc))

## [0.3.0](https://github.com/KevinDeBenedetti/documentation/compare/v0.2.0...v0.3.0) (2025-10-11)


### Features

* add files extract metadatas and filter ([5864a96](https://github.com/KevinDeBenedetti/documentation/commit/5864a9690f9cdd4d2dcdb70c623701da64a0fb0e))
* refactor CI/CD workflows to use dynamic version inputs for Node.js and pnpm ([54e226b](https://github.com/KevinDeBenedetti/documentation/commit/54e226bf21ba9fb947e020c2c1542f344f140789))
* show datas for docs (page, components & content) ([4e9b12c](https://github.com/KevinDeBenedetti/documentation/commit/4e9b12c92ad0ff1bfaba47b8aaeb07c73b6d6b56))


### Bug Fixes

* remove unnecessary outputs from versions workflow ([51eb19d](https://github.com/KevinDeBenedetti/documentation/commit/51eb19d438cf061a61ffc477448d886f9461ccc1))
* update Admin button to use dynamic language routing ([284e7cf](https://github.com/KevinDeBenedetti/documentation/commit/284e7cf46163f8777020612070ecf07794ebdd67))
* update pnpm version to 10.18.2 in package.json ([a460c2b](https://github.com/KevinDeBenedetti/documentation/commit/a460c2b618b698ae645c99c3b901c9102d74e83a))
* versions workflow ([f127c73](https://github.com/KevinDeBenedetti/documentation/commit/f127c736c18ad325596a3d587003f857034a0259))

## [0.2.0](https://github.com/KevinDeBenedetti/documentation/compare/v0.1.0...v0.2.0) (2025-10-10)


### Features

* add admin component & api starter ([e055dc7](https://github.com/KevinDeBenedetti/documentation/commit/e055dc76629b07bc862a384747e5bcd4904becb6))
* add admin table ([0fbfd49](https://github.com/KevinDeBenedetti/documentation/commit/0fbfd49a5d70f3189d07b515d3c050de9018c214))
* add copilot instructions ([2c80ab7](https://github.com/KevinDeBenedetti/documentation/commit/2c80ab74c81f4b94bc4931d0ac74f6b47952fe0e))
* add copilot instructions ([2afe085](https://github.com/KevinDeBenedetti/documentation/commit/2afe0855fe6a00493e147796176eeb5cfc3131fa))
* add copilot instructions with official doc ([e18406e](https://github.com/KevinDeBenedetti/documentation/commit/e18406e76371c84c33449f3c7a92f004eb3c00ee))
* add docs ([aa232b1](https://github.com/KevinDeBenedetti/documentation/commit/aa232b106716bf081b7cc345bdbbea0d79eb022e))
* add ESLint rules ([f03e158](https://github.com/KevinDeBenedetti/documentation/commit/f03e1582af6eaad0582645ce751327bae05d6e76))
* add github copilot instructions ([214c7a4](https://github.com/KevinDeBenedetti/documentation/commit/214c7a4e77e40df07f92c2cdc93f93248c5d7566))
* add husky pre-commit hook for linting and formatting ([369e50c](https://github.com/KevinDeBenedetti/documentation/commit/369e50c15fbb7031f5e55f6ad73b834ff8df565c))
* add release please ([91747a2](https://github.com/KevinDeBenedetti/documentation/commit/91747a2465411f769350cef76a52eb86c777e1bb))
* add ubuntu doc ([b695966](https://github.com/KevinDeBenedetti/documentation/commit/b6959669fc4057308749d2ba52b8b603e2bb18ef))
* add uv documentation ([dd5795e](https://github.com/KevinDeBenedetti/documentation/commit/dd5795ea8307347b111a842a55152be0d990b858))
* add workflows CI/CD for deploy & linting ([123958b](https://github.com/KevinDeBenedetti/documentation/commit/123958b2863e727e6b08dc489c8e0ac09e3d76e0))
* Enhance Nuxt and FastAPI documentation with detailed guides and examples ([7bee4cd](https://github.com/KevinDeBenedetti/documentation/commit/7bee4cd3a151dfaf54b968d3529d2d6907d9f4c9))
* improve ruff & debian contents ([2fc2fb0](https://github.com/KevinDeBenedetti/documentation/commit/2fc2fb0a17a1b5050c645681a094864bcb198538))
* init project docus ([771e81f](https://github.com/KevinDeBenedetti/documentation/commit/771e81feba87456b78ed75c2bde0c3c1d29bdaf5))
* remove unnecessary permissions from CD workflow ([a9a1f64](https://github.com/KevinDeBenedetti/documentation/commit/a9a1f64e45c3b3e6274d62fbf68378d353a69dc5))
* update config for content ([d076ed8](https://github.com/KevinDeBenedetti/documentation/commit/d076ed8fb003eb2b44c950653e266fb69825d150))


### Bug Fixes

* add baseURL in nuxt.config.ts ([85cb780](https://github.com/KevinDeBenedetti/documentation/commit/85cb7807382f8cf4022d33cf9557cdfd9d4a116c))
* add calls for ci / cd ([5026513](https://github.com/KevinDeBenedetti/documentation/commit/5026513679ad433ad371896384f87138314861a5))
* add concurrency settings to CD workflow ([6e8bd42](https://github.com/KevinDeBenedetti/documentation/commit/6e8bd42a055f6cee42f65e73936929f5f52c8d51))
* add permissions to cd workflows ([15c8eca](https://github.com/KevinDeBenedetti/documentation/commit/15c8ecab66db87f1eb6cbc199ed00b1de756521e))
* align job definition in CI workflow ([544f799](https://github.com/KevinDeBenedetti/documentation/commit/544f7991fdb82ab71d04a9c85a06c1a3de58e0d6))
* ci lint nuxt prepare ([be9848e](https://github.com/KevinDeBenedetti/documentation/commit/be9848e8a9094de5e0933822284282f9a716f410))
* correct ci indentation ([0a6294e](https://github.com/KevinDeBenedetti/documentation/commit/0a6294e7cf0086107cc7200cad14328a0c85f7df))
* correct extension cd ([789a453](https://github.com/KevinDeBenedetti/documentation/commit/789a453c78bc0c6fcf8d88bde8051ec3c583fe7c))
* defineNuxtConfig error ([9112d9f](https://github.com/KevinDeBenedetti/documentation/commit/9112d9f2f332c94fea28b88339bf583cd3af27e7))
* deploy gh pages & update dependencies ([1fad6fe](https://github.com/KevinDeBenedetti/documentation/commit/1fad6fe738ebd6d71502c4e7fa54b2ce788b4716))
* deployement config & seo ([93396e3](https://github.com/KevinDeBenedetti/documentation/commit/93396e3a1411b80da93dc5c8313f9c8da942e82d))
* remove siteUrl from runtimeConfig and site configuration ([2edb2b9](https://github.com/KevinDeBenedetti/documentation/commit/2edb2b920df2af6ecc1449aa0d22219b55108baa))
* remove unused .npmrc file and update siteUrl references in nuxt.config.ts ([3491ffd](https://github.com/KevinDeBenedetti/documentation/commit/3491ffdcf22a639e14128e727b5d3eca2cf905b3))
* remove unused @nuxtjs/sitemap module from nuxt.config.ts ([778189b](https://github.com/KevinDeBenedetti/documentation/commit/778189bffdbcd5e74ed78c1d1ec442a67232c594))
* remove unused event parameter in defineEventHandler ([ab4bd5e](https://github.com/KevinDeBenedetti/documentation/commit/ab4bd5ed18420f463ee3fea4e328439d8e8c91f5))
* specify pnpm version ([ec05d8c](https://github.com/KevinDeBenedetti/documentation/commit/ec05d8cc2dfe7a38021059343a25f8abc7cbd55b))
* update build command and clean script in configuration files ([5789ef7](https://github.com/KevinDeBenedetti/documentation/commit/5789ef790c0b5ecb0ab5bbaa6ba1120296366658))
* update config nuxt ([74e9d70](https://github.com/KevinDeBenedetti/documentation/commit/74e9d7025d0e35dac37d23e3f78946f4edce987e))
* update navigation link and adjust default locale in nuxt.config.ts ([b77512d](https://github.com/KevinDeBenedetti/documentation/commit/b77512d3df2c7efd817bea631150884b749dcadf))
* update pnpm ([703bb31](https://github.com/KevinDeBenedetti/documentation/commit/703bb3118bd1932d17672c1415f000b8b63b8d1c))
* update project name to 'documentation' and add app configuration ([1cbe70d](https://github.com/KevinDeBenedetti/documentation/commit/1cbe70dfcceb7fc69e153753763e8b91703981eb))

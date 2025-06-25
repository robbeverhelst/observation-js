# [1.15.0](https://github.com/robbeverhelst/observation-js/compare/v1.14.0...v1.15.0) (2025-06-25)


### Features

* add automatic token refresh functionality with interceptor and related methods ([fb8649d](https://github.com/robbeverhelst/observation-js/commit/fb8649dc231d477894e6ad26c7fbbab32236204b))

# [1.14.0](https://github.com/robbeverhelst/observation-js/compare/v1.13.0...v1.14.0) (2025-06-24)


### Features

* enhance Species API client with detailed methods for species information and group attributes ([9e43e35](https://github.com/robbeverhelst/observation-js/commit/9e43e358c0c4f4868c2322dc6336d94638ef1886))

# [1.13.0](https://github.com/robbeverhelst/observation-js/compare/v1.12.0...v1.13.0) (2025-06-24)


### Features

* make clientId, clientSecret, and redirectUri optional in ObservationClientOptions; update API endpoints to use /api/v1/ prefix ([8c2b91c](https://github.com/robbeverhelst/observation-js/commit/8c2b91c0793a69d6fe82b21ad81ef09f1950e094))
* refactor URL parameter handling in ObservationClient; add filterParams method to clean undefined values from request parameters ([29beb52](https://github.com/robbeverhelst/observation-js/commit/29beb52d0212fe5a578855e86b256ca95a947fc7))

# [1.12.0](https://github.com/robbeverhelst/observation-js/compare/v1.11.0...v1.12.0) (2025-06-18)


### Features

* update build script to use TypeScript compiler and remove emitDeclarationOnly from tsconfig ([acd4787](https://github.com/robbeverhelst/observation-js/commit/acd47874d521f08ab72a3ad859ee5fb88395ccf4))

# [1.11.0](https://github.com/robbeverhelst/observation-js/compare/v1.10.0...v1.11.0) (2025-06-17)


### Features

* introduce clientCache option for request caching and update README with usage examples ([bc5af24](https://github.com/robbeverhelst/observation-js/commit/bc5af24237863de3ec4b4c66af681fc6a203e528))

# [1.10.0](https://github.com/RobbeVerhelst/observation-js/compare/v1.9.0...v1.10.0) (2025-06-10)


### Features

* add MediaItem type and enhance media handling with getSimilar method ([cdc7fe3](https://github.com/RobbeVerhelst/observation-js/commit/cdc7fe3caa5af7070c3348d542c989c5bde995a8))

# [1.9.0](https://github.com/RobbeVerhelst/observation-js/compare/v1.8.0...v1.9.0) (2025-06-10)


### Bug Fixes

* update retryAfter parsing in RateLimitError to use parseFloat for improved accuracy ([fd0e4ee](https://github.com/RobbeVerhelst/observation-js/commit/fd0e4eecd859c76ce71abe0853c919ad83086e4b))


### Features

* add timeout handling and retry logic for species and countries API calls in cross-platform tests ([b6e514f](https://github.com/RobbeVerhelst/observation-js/commit/b6e514f65c7a244cecf3f062ed1ae4b91133a5ee))

# [1.8.0](https://github.com/RobbeVerhelst/observation-js/compare/v1.7.0...v1.8.0) (2025-06-10)


### Features

* enhance performance tests with timeout handling and edge case logging ([5251c2b](https://github.com/RobbeVerhelst/observation-js/commit/5251c2b9469ceb1d66bcd14beeb723b15b05a840))
* implement rate limit error handling and update species type definitions ([ce68251](https://github.com/RobbeVerhelst/observation-js/commit/ce68251be85ef385cd8dbbd3e6db2e58ec1b7d8b))

# [1.7.0](https://github.com/RobbeVerhelst/observation-js/compare/v1.6.0...v1.7.0) (2025-06-10)


### Features

* add integration and e2e test ([8420377](https://github.com/RobbeVerhelst/observation-js/commit/8420377c5b928e29768f87540d74203d80e06a37))

# [1.6.0](https://github.com/RobbeVerhelst/observation-js/compare/v1.5.0...v1.6.0) (2025-06-10)


### Features

* Migrate ESLint and Prettier to TypeScript configuration ([0ecff32](https://github.com/RobbeVerhelst/observation-js/commit/0ecff32c050176ad5407273e074949c12a06de3d))

# [1.5.0](https://github.com/RobbeVerhelst/observation-js/compare/v1.4.0...v1.5.0) (2025-06-09)

### Features

- add request/response interceptors to ObservationClient for enhanced request lifecycle management ([9058e2c](https://github.com/RobbeVerhelst/observation-js/commit/9058e2c156fd282d7ccb904ac13d63d2736145da))

# [1.4.0](https://github.com/RobbeVerhelst/observation-js/compare/v1.3.0...v1.4.0) (2025-06-09)

### Features

- add configurable in-memory caching to ObservationClient ([7443c17](https://github.com/RobbeVerhelst/observation-js/commit/7443c1707bcb86e551ffc3c963ea24820d01f713))

# [1.3.0](https://github.com/RobbeVerhelst/observation-js/compare/v1.2.3...v1.3.0) (2025-06-09)

### Features

- enhance ObservationClient to support multiple platforms and environments ([435cebc](https://github.com/RobbeVerhelst/observation-js/commit/435cebc4b5598a54b69bb93e688be205a78a580e))

## [1.2.3](https://github.com/RobbeVerhelst/observation-js/compare/v1.2.2...v1.2.3) (2025-06-09)

### Bug Fixes

- rename test step in CI workflow to clarify coverage reporting ([6201b6a](https://github.com/RobbeVerhelst/observation-js/commit/6201b6aaae905c5e55f52476d97cf0003eb2d16a))

## [1.2.2](https://github.com/RobbeVerhelst/observation-js/compare/v1.2.1...v1.2.2) (2025-06-09)

### Bug Fixes

- update Codecov action to v5 in CI workflow ([8a5e847](https://github.com/RobbeVerhelst/observation-js/commit/8a5e8472f37de33edf80cc8b7c8329060bf7d1e5))

## [1.2.1](https://github.com/RobbeVerhelst/observation-js/compare/v1.2.0...v1.2.1) (2025-06-08)

### Bug Fixes

- update README ([642c3db](https://github.com/RobbeVerhelst/observation-js/commit/642c3db84b4798508be743a7a4fcc836ad167840))

# [1.2.0](https://github.com/RobbeVerhelst/observation-js/compare/v1.1.1...v1.2.0) (2025-06-08)

### Features

- add testing suite ([2054920](https://github.com/RobbeVerhelst/observation-js/commit/2054920132410e0f3ea326dc3ea6819370dbb9c5))

## [1.1.1](https://github.com/RobbeVerhelst/observation-js/compare/v1.1.0...v1.1.1) (2025-06-08)

### Bug Fixes

- trigger release v1.1.1 ([577fd44](https://github.com/RobbeVerhelst/observation-js/commit/577fd442d29ce1685df2394333de5acd0bbb8ee0))

# [1.1.0](https://github.com/RobbeVerhelst/observation-js/compare/v1.0.2...v1.1.0) (2025-06-08)

### Features

- enhance README.md with additional examples and clarify usage instructions ([2bb4906](https://github.com/RobbeVerhelst/observation-js/commit/2bb490698681ac398d70e97dd10380979827f59f))

## [1.0.2](https://github.com/RobbeVerhelst/observation-js/compare/v1.0.1...v1.0.2) (2025-06-08)

### Bug Fixes

- downgrade TypeDoc version and enhance exports in index.ts ([254a0fc](https://github.com/RobbeVerhelst/observation-js/commit/254a0fc26b162b9b72254694b8568f3d108d9a0a))

## [1.0.1](https://github.com/RobbeVerhelst/observation-js/compare/v1.0.0...v1.0.1) (2025-06-08)

### Bug Fixes

- TypeDoc configuration and export structure in index.ts ([f8e8d5a](https://github.com/RobbeVerhelst/observation-js/commit/f8e8d5abe048b5399150d8107980515705007bd7))

# 1.0.0 (2025-06-08)

### Features

- Add challenges functionality to ObservationClient with example usage ([557562d](https://github.com/RobbeVerhelst/observation-js/commit/557562d1c77766a1a2df4e2ea138960157f6292b))
- Add countries functionality to ObservationClient with example usage ([cff3bbd](https://github.com/RobbeVerhelst/observation-js/commit/cff3bbdfc885e3d0c58da08a7b6d1f2c6a186248))
- Add groups functionality to ObservationClient with example usage ([05d757e](https://github.com/RobbeVerhelst/observation-js/commit/05d757e82e686caf77d774cb88042c9ceb882ffe))
- Add initial project structure for observation-js client ([fb7599b](https://github.com/RobbeVerhelst/observation-js/commit/fb7599b1a2bb7e5211126ea211f664f0f942bb22))
- Add languages functionality to ObservationClient with example usage ([e6d2b94](https://github.com/RobbeVerhelst/observation-js/commit/e6d2b94b5459737eab9f2752a4add750af3ab3a1))
- Add locations functionality to ObservationClient with GeoJSON example ([84302d5](https://github.com/RobbeVerhelst/observation-js/commit/84302d5be2e21a3272fcf939739b43bb239dc15c))
- Add media upload and observation creation functionality in ObservationClient with example usage ([b17f389](https://github.com/RobbeVerhelst/observation-js/commit/b17f3896d126c86ddd159aca8412ee4d5e8ab639))
- Add transects functionality to ObservationClient with example usage ([a9f7f2b](https://github.com/RobbeVerhelst/observation-js/commit/a9f7f2b23ab880653562b0df0b187c6152ce908d))
- Implement badges functionality in ObservationClient with example usage ([508979a](https://github.com/RobbeVerhelst/observation-js/commit/508979a6a4fca4991ac7ba4f08f32d52f6a65b7a))
- Implement exports functionality in ObservationClient with example usage ([6948d70](https://github.com/RobbeVerhelst/observation-js/commit/6948d70506b869cb4e3629301700b5ce85f15fe1))
- Implement lookups and NIA proxy functionality in ObservationClient with example usage ([e733fc3](https://github.com/RobbeVerhelst/observation-js/commit/e733fc323cfce624013346aa1a151f549b119437))
- Implement observation deletion and test environment support in ObservationClient ([573b1fb](https://github.com/RobbeVerhelst/observation-js/commit/573b1fb8436f3cb3666afbc801284ed1da8a3849))
- Implement regions functionality in ObservationClient with example usage ([b4d241c](https://github.com/RobbeVerhelst/observation-js/commit/b4d241c655b76a845fd3d371d3a983b7face3cc6))
- Implement sessions functionality in ObservationClient with example usage ([76de3dc](https://github.com/RobbeVerhelst/observation-js/commit/76de3dce0362476df676c0957bffc96d053ed21c))
- Implement user management functionality in ObservationClient with terms of service example ([bd6f8a2](https://github.com/RobbeVerhelst/observation-js/commit/bd6f8a2bbaa5675ae95e774f101f3d7be88e8c3f))
- Introduce region species lists functionality in ObservationClient with example usage ([fa01e48](https://github.com/RobbeVerhelst/observation-js/commit/fa01e48f7dfc42a738916c7408fe1e132b680f14))

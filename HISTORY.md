## [Unreleased]

## [0.5.0] - 2021-08-25

### Added

- Feature `FeatureFlags`
- feature guard
- `UserAccount.flags` property

### Changed

- i18n enums now contain the complete error string instead of just the prefix
- moved `HttpStatusCodes` enum to utils
- moved bootstrap from `app-worker` to `core`

### Fixed

- add `streamKey` on channel creation

### Changed

- moved some enum values from (Util)EnvVars to AppEnvVars
- `README.md` updated

## [0.4.0] - 2021-08-12

### Added

- `prettier`
- eslint stuff
- husky
- lint-staged

### Fixed

- All files linted

## [0.3.0] - 2021-08-11

### Added

- new Stage in `Dockerfile` for caching dependencies
- new Item `channel`

### Changed

- renamed `app` to `core` to solve conflicts with `app.ts`

## [0.2.0] - 2021-08-02

### Added

- `NotInitializedException`

### Changed

- `JWTStrategy` can now be used to login
- `UserAccountEntity` now exposes avatar url's

## [0.1.0] - 2021-07-27

### Initial

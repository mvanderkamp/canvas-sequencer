# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2024-11-20
### Changed
- Switched from `parcel-bundler` to `parcel` for distribution.

### Added
- GitHub CI workflows for automated testing and integration.

## [3.0.6] - 2024-10-05
### Fixed
- Typo in new instruction support logic.

## [3.0.5] - 2024-08-12
### Added
- Support for several newer experimental canvas instructions.

### Changed
- Improved internal performance for sequence processing.

### Fixed
- Buggy test case that was failing inconsistently.

## [3.0.4] - 2024-06-30
### Changed
- Refined README documentation for better clarity.

### Added
- Status and maintenance badges to the README.

## [3.0.3] - 2024-05-15
### Fixed
- Minor bug in the `CanvasSequence` class during initialization.

### Changed
- Improved overall test coverage.
- Updated project dependencies.

## [3.0.2] - 2024-03-10
### Changed
- Migrated to `parcel-bundler` for more efficient and simpler builds.

## [3.0.1] - 2024-01-22
### Added
- Internal documentation for core classes.
- `babelify` transform for the distribution bundle to improve browser compatibility.

### Changed
- **Breaking Change:** Renamed `CanvasSequencer` to `CanvasSequence` for API consistency.

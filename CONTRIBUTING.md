# Contributing to canvas-sequencer

Thanks for contributing.

## Development setup

This project uses npm and is [tested in CI](./.github/workflows/node.js.yml) across a matrix of recent Node versions.

Install dependencies with:

```bash
npm clean-install
```

## Common commands

Run the same checks used by CI before opening a pull request:

```bash
npm run build
npm run lint
npm test
```

Additional useful commands:

```bash
npm run test:coverage
npm run build:debug
npm run lint:fix
```

## Making changes

1. Keep changes focused and update tests when behavior changes.
2. Update `CHANGELOG.md` for notable user-facing, maintenance, or security changes.
3. Open a pull request using the repository's pull request template.

## Pull requests

Before opening a pull request, make sure:

1. The build, lint, and test commands all pass locally.
2. The changelog reflects the change when appropriate.

## Release process

For a package release, use the following workflow so you publish from the same source commit you tag (with build artifacts generated locally), while only pushing the tag after `npm publish` succeeds.

1. Update `package.json`, `package-lock.json`, and `CHANGELOG.md` for the new version.
2. Commit the release preparation changes.
3. Create the release tag locally, but do not push it yet.
4. Build the package so `dist/index.js` exists in the publishable working tree.
5. Check what will be published with `npm pack --dry-run`.
6. Sanity-check the built bundle in `dist/index.js`.
7. Publish the package to npm from the tagged commit.
8. Push `main` and the tag.
9. Create the GitHub release from the pushed tag.

Example commands for `3.1.1`:

```bash
git add package.json package-lock.json CHANGELOG.md
git commit -m "Prepare 3.1.1 release"
git tag -a v3.1.1 -m "Release 3.1.1"
npm run build
npm pack --dry-run
ls -lh dist/index.js
npm publish
git push origin main
git push origin v3.1.1
gh release create v3.1.1 --title "v3.1.1"
```

If you want GitHub release notes to match the changelog closely, paste the
`3.1.1` section of `CHANGELOG.md` into the release notes when creating the
release.

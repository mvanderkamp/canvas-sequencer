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

1. Create a release preparation branch from `main`.
2. Update `package.json`, `package-lock.json`, and `CHANGELOG.md` for the new version.
3. Commit the release preparation changes and open a pull request.
4. Merge the pull request into `main`.
5. Check out the merged `main` commit locally.
6. Create the release tag locally for that commit, but do not push it yet.
7. Build the package so `dist/index.js` exists in the publishable working tree.
8. Check what will be published with `npm pack --dry-run`.
9. Sanity-check the built bundle in `dist/index.js`.
10. Publish the package to npm from the tagged commit.
11. Push the tag.
12. Create the GitHub release from the pushed tag.

Example commands for `3.1.1`:

```bash
git switch -c release/3.1.1
git add package.json package-lock.json CHANGELOG.md
git commit -m "Prepare for 3.1.1 release"
gh pr create
# merge the PR, then sync your local main to the merged commit
git switch main
git pull --ff-only origin main
git tag -a v3.1.1 -m "Release 3.1.1"
npm run build
npm pack --dry-run
ls -lh dist/index.js
npm publish
git push origin v3.1.1
gh release create v3.1.1 --title "v3.1.1"
```

If you want GitHub release notes to match the changelog closely, paste the
`3.1.1` section of `CHANGELOG.md` into the release notes when creating the
release.

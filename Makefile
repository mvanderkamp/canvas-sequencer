.PHONY: lint release fix build tags

lint:
	npx eslint index.js src tests;

fix:
	npx eslint index.js src tests --fix;

release: lint build tags

build:
	npx parcel build index.js

tags:
	ctags -R src


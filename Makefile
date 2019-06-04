.PHONY: lint release fix build tags

lint:
	npx eslint index.js src

fix:
	npx eslint index.js src --fix

release: lint build tags

build:
	npx parcel build index.js

tags:
	ctags -R src


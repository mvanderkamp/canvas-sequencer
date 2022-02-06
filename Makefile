.PHONY: default lint release fix build tags

default: lint tags

lint:
	npx eslint index.js src tests;

fix:
	npx eslint index.js src tests --fix;

release: lint build coveralls tags

build:
	npm run build

tags:
	ctags -R src

coveralls:
	npm run coveralls


.PHONY: build transpile tags

lint:
	npx eslint index.js src

all: build tags

fix:
	npx eslint index.js src --fix

build:
	npx parcel build index.js

tags:
	ctags -R src


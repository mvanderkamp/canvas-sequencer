.PHONY: build transpile tags

all: build tags

build:
	npx parcel build index.js

tags:
	ctags -R src


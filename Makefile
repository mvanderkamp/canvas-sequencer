.PHONY: build transpile tags

all: build tags

build:
	npx browserify index.js \
		--standalone canvas-sequencer \
		--outfile bundle.js;

tags:
	ctags -R src


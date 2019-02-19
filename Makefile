.PHONY: build tags

build:
	npx browserify index.js \
		--standalone canvas-sequencer \
		--outfile bundle.js;

tags:
	ctags -R src


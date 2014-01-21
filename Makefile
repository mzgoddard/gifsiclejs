GIT ?= git
MAKE ?= make

AUTORECONF = autoreconf
CC = $(abspath vendor/emscripten/emcc)
PATCH = patch -p0 -t

all: gifsicleraw

gifsicleraw: vendor/gifsicle/src/gifsicle.js

vendor/gifsicle/src/Makefile:
	@cd vendor/gifsicle && $(AUTORECONF) -i
	@cd vendor/gifsicle && CC=$(CC) ./configure
	@cd vendor/gifsicle && $(PATCH) <../../patches/gifsicle/Makefile.patch

vendor/gifsicle/src/gifsicle.c.PATCHED:
	@cd vendor/gifsicle && $(PATCH) <../../patches/gifsicle/gifsicle.c.patch
	@echo PATCHED >vendor/gifsicle/src/gifsicle.c.PATCHED

vendor/gifsicle/src/gifsicle.js: vendor/gifsicle/src/Makefile vendor/gifsicle/src/gifsicle.c.PATCHED lib/pre_gifsicle.js
	@cd vendor/gifsicle/src && $(MAKE) gifsicle.js

clean:
	@echo -- clean vendor/gifsicle
	@cd vendor/gifsicle && $(GIT) clean -fx >/dev/null
	@cd vendor/gifsicle && $(GIT) checkout .

.PHONY: all clean gifsicleraw

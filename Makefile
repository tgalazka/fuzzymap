default: all

all: test

test: install unit

install:
	npm install

unit:
	@NODE_ENV=test ./node_modules/.bin/mocha test/unit

.PHONY: unit

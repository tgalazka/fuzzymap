default: all

all: unit

test: all

unit:
	@NODE_ENV=test ./node_modules/.bin/mocha test/unit

.PHONY: unit

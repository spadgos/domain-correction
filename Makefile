OS   := $(shell uname)
NODE ?= node
NPM  ?= npm

SRC_DIR    := src
DIST_DIR   := dist
# all source files
SRC_FILES  := $(shell find $(SRC_DIR) -type f -name "*.js")
# all target files
TRANSPILED := $(patsubst $(SRC_DIR)/%,$(DIST_DIR)/%,$(SRC_FILES))

NPM_BIN := node_modules/.bin

MOCHA      := $(NPM_BIN)/mocha
_MOCHA     := $(NPM_BIN)/_mocha
BABEL      := $(NPM_BIN)/babel
BABEL_NODE := $(NPM_BIN)/babel-node
ESLINT     := $(NPM_BIN)/eslint
CHOKIDAR   := $(NPM_BIN)/chokidar
ISPARTA    := $(NPM_BIN)/isparta

MOCHA_REPORTER ?= spec

ifeq ($(OS), Darwin)
  OPEN := open
else
  OPEN := xdg-open
endif

containing = $(foreach v,$2,$(if $(findstring $1,$v),$v))
not-containing = $(foreach v,$2,$(if $(findstring $1,$v),,$v))

.PHONY: all clean compile lint setup test mr-clean view-coverage

all: MOCHA_REPORTER = dot
all: setup lint compile test

setup: node_modules .git/hooks/pre-commit
	@#

watch: $(CHOKIDAR)
	$(MAKE) test -j4
	$(CHOKIDAR) $(SRC_DIR) -c 'MOCHA_REPORTER=min $(MAKE) test -j4'

lint: .lint

.lint: $(SRC_DIR)/.eslintrc $(SRC_FILES) | $(ESLINT)
	$(ESLINT) $(if $(filter-out %.js,$?),$(SRC_DIR),$(filter %.js,$?))
	@touch $@

compile: $(TRANSPILED)
	@#

test: .test

.test: $(SRC_FILES) | setup compile $(MOCHA)
	$(MOCHA) \
		--reporter $(MOCHA_REPORTER) \
		$(if $(call not-containing,src/test/,$(filter $^,$?)),--recursive $(DIST_DIR)/test,$(patsubst $(SRC_DIR)/%,$(DIST_DIR)/%,$(call containing,src/test/,$(filter $^,$?))))
	@touch $@

coverage: $(SRC_FILES) | $(BABEL_NODE) $(ISPARTA) $(_MOCHA)
	$(BABEL_NODE) -r $(ISPARTA) cover --report html --report json $(_MOCHA) -- $(SRC_DIR)/test
	@touch $@

view-coverage: coverage
	$(OPEN) coverage/index.html

mr-clean: clean
	rm -rf node_modules

clean:
	rm -rf $(DIST_DIR) .lint .test coverage .git/hooks/pre-commit

.git/hooks/pre-commit:
	echo "./pre-commit.sh" > $@
	chmod +x $@ ./pre-commit.sh

$(DIST_DIR)/bin/%.js: $(SRC_DIR)/bin/%.js $(BABEL)
	@mkdir -p $(@D)
	$(BABEL) --out-file $@ $<
	chmod +x $@

$(DIST_DIR)/%.js: $(SRC_DIR)/%.js $(BABEL)
	@mkdir -p $(@D)
	$(BABEL) --out-file $@ $<

####

node_modules: package.json
	NODE_ENV=development $(NPM) install
	@touch $@

$(NPM_BIN)/%: node_modules
	@#

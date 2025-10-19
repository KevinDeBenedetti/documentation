MK_DIR := mk
MK_REPO := https://github.com/KevinDeBenedetti/make-library.git
MK_BRANCH := main

.PHONY: mk-update
mk-update:
	@if [ ! -d $(MK_DIR) ]; then \
    git clone --depth 1 --branch $(MK_BRANCH) $(MK_REPO) $(MK_DIR); \
	else \
		cd $(MK_DIR) && git fetch origin && git reset --hard origin/$(MK_BRANCH);
	fi

PROJECT_NAME := documentation
STACK := nuxt

JS_PKG_MANAGER := pnpm

MKLIB_DIR := mk
INCLUDES := $(MKLIB_DIR)/common.mk

ifeq ($(findstring nuxt,$(STACK)),nuxt)
  INCLUDES += $(MKLIB_DIR)/nuxt.mk
endif

$(foreach file,$(INCLUDES),$(if $(wildcard $(file)),,$(error File $(file) does not exist)))

all: mk-update
	@echo "==> Using make-library from $(MK_DIR)"
  include $(INCLUDES)
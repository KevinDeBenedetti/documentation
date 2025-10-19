PROJECT_NAME := documentation
STACK := nuxt

JS_PKG_MANAGER := pnpm

MKLIB_DIR := mk
INCLUDES := $(MKLIB_DIR)/common.mk

ifeq ($(findstring nuxt,$(STACK)),nuxt)
  INCLUDES += $(MKLIB_DIR)/nuxt.mk
endif

$(foreach file,$(INCLUDES),$(if $(wildcard $(file)),,$(error File $(file) does not exist)))

include $(INCLUDES)
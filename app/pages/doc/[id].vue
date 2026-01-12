<script setup lang="ts">
import type { Collections } from "@nuxt/content";
import { slugToDocId } from "#shared/formatters/doc";

const { defaultLocale, locales } = useI18n();
const route = useRoute();
const router = useRouter();
const lang = computed(() => (route.query.lang as string) ?? defaultLocale);

const formattedId = route.params.id as string;

const { data } = await useAsyncData(
  () => `doc-${formattedId}-${lang.value}`,
  async () => {
    const collection = ("content_" + lang.value) as keyof Collections;
    return queryCollection(collection)
      .where("stem", "=", slugToDocId(formattedId, lang.value))
      .first();
  },
  {
    watch: [lang],
  },
);

const { data: translations } = await useAsyncData(
  () => `doc-${formattedId}-translations-${lang.value}`,
  async () => {
    const availableTranslations = [];

    for (const locale of locales.value) {
      try {
        const collection = ("content_" + locale.code) as keyof Collections;
        const doc = await queryCollection(collection)
          .where("stem", "=", slugToDocId(formattedId, locale.code))
          .first();

        if (doc) {
          availableTranslations.push({
            locale: locale.code,
            localeName: locale.name,
            doc,
          });
        }
      } catch (error) {
        console.error(error);
        console.log(`No translation found for ${locale.code}`);
      }
    }

    return availableTranslations;
  },
  {
    watch: [lang],
  },
);

async function switchLanguage(localeCode: string) {
  await router.push({
    path: route.path,
    query: { ...route.query, lang: localeCode },
  });
}
</script>

<template>
  <UContainer v-if="data">
    <AdminDocumentHeader
      :doc="data"
      :current-locale="lang"
      :locales="locales"
      :available-translations="translations || []"
      @switch-language="switchLanguage"
    >
      <template #metadata>
        <AdminDocumentMetadata :doc="data" :translations-count="translations?.length || 0" />
      </template>
      <template #actions>
        <AdminDocumentActions :doc="data" :translations-count="translations?.length || 0" />
      </template>
    </AdminDocumentHeader>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 py-8">
      <div class="min-w-0 space-y-8">
        <ContentRenderer
          v-if="data.body"
          :value="data.body"
          class="prose prose-primary dark:prose-invert max-w-none"
        />

        <AdminDocumentTranslations
          v-if="translations && translations.length > 1"
          :translations="translations"
          :current-locale="lang"
          @switch-language="switchLanguage"
        />

        <AdminDocumentDebugInfo :doc="data" />
      </div>

      <aside class="hidden lg:block space-y-4">
        <AdminDocumentTableOfContents
          v-if="data.body?.toc?.links?.length"
          :links="data.body.toc.links"
          :title="data.body.toc.title"
        />
      </aside>
    </div>

    <div class="border-t border-default pt-8 mt-8">
      <div class="flex justify-between items-center">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          label="Back"
          @click="$router.back()"
        />
      </div>
    </div>
  </UContainer>

  <UContainer v-else class="py-8">
    <UCard>
      <div class="text-center py-12">
        <UIcon name="i-lucide-file-question" class="w-16 h-16 mx-auto mb-4 text-muted" />
        <p class="text-muted">Document not found</p>
      </div>
    </UCard>
  </UContainer>
</template>

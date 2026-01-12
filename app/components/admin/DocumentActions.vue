<script setup lang="ts">
import type { Doc } from "#shared/types/doc";

interface Props {
  doc: Doc;
  translationsCount: number;
}

const props = defineProps<Props>();

const { locales } = useI18n();
const toast = useToast();

const showTranslationModal = ref(false);
const targetLocale = ref<string>("");
const isGenerating = ref(false);

// Filtrer les locales disponibles (exclure la locale actuelle du document)
const availableLocales = computed(() => {
  return locales.value.filter((l) => {
    const localeCode = typeof l === "string" ? l : l.code;
    // Exclure la locale actuelle du document si elle existe dans le path
    const docLocale = props.doc.path?.split("/")[1]; // Assuming path structure like /fr/...
    return localeCode !== docLocale;
  });
});

async function generateTranslation() {
  if (!targetLocale.value) {
    toast.add({
      title: "Erreur",
      description: "Veuillez sélectionner une langue cible",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
    return;
  }

  isGenerating.value = true;

  try {
    // TODO: Remplacer par votre endpoint d'API
    const response = await $fetch("/api/translations/generate", {
      method: "POST",
      body: {
        sourceDocPath: props.doc.path,
        targetLocale: targetLocale.value,
      },
    });

    console.log("Génération réussie:", response);
    toast.add({
      title: "Traduction générée",
      description: `La traduction en ${targetLocale.value} a été créée avec succès`,
      color: "success",
      icon: "i-lucide-check-circle",
    });

    showTranslationModal.value = false;
    targetLocale.value = "";

    // Émettre un événement pour rafraîchir la liste si nécessaire
    // emit('translation-generated')
  } catch (error) {
    console.error("Erreur lors de la génération:", error);
    toast.add({
      title: "Erreur",
      description: "La génération de la traduction a échoué",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    isGenerating.value = false;
  }
}

function openTranslationModal() {
  if (availableLocales.value.length === 0) {
    toast.add({
      title: "Information",
      description: "Toutes les traductions disponibles existent déjà",
      color: "info",
      icon: "i-lucide-info",
    });
    return;
  }
  showTranslationModal.value = true;
}
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-2 mt-4">
      <UBadge v-if="doc.extension" color="neutral" variant="subtle">
        {{ doc.extension.toUpperCase() }}
      </UBadge>
      <UBadge v-if="doc.path" color="primary" variant="subtle">
        {{ doc.path }}
      </UBadge>
      <UBadge v-if="translationsCount > 0" color="success" variant="subtle">
        {{ translationsCount }} {{ translationsCount === 1 ? "traduction" : "traductions" }}
      </UBadge>

      <UButton
        icon="i-lucide-languages"
        color="primary"
        variant="outline"
        size="xs"
        label="Générer traduction"
        @click="openTranslationModal"
      />
    </div>

    <UModal
      v-model:open="showTranslationModal"
      title="Générer une traduction"
      description="Sélectionnez la langue cible pour générer automatiquement la traduction"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2"> Document source </label>
            <UInput :model-value="doc.path" disabled icon="i-lucide-file-text" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2"> Langue cible </label>
            <USelectMenu
              v-model="targetLocale"
              :options="
                availableLocales.map((l) => ({
                  label: typeof l === 'string' ? l : l.name || l.code,
                  value: typeof l === 'string' ? l : l.code,
                }))
              "
              placeholder="Sélectionnez une langue"
            />
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <UButton
            label="Annuler"
            color="neutral"
            variant="outline"
            :disabled="isGenerating"
            @click="close"
          />
          <UButton
            label="Générer"
            color="primary"
            :loading="isGenerating"
            @click="generateTranslation"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

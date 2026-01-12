import { describe, expect, it } from "vitest";
import {
  parseAvailableLangs,
  filterDocsByLang,
  addTranslationsToDoc,
  sortDocs,
  processDocsWithQuery,
} from "../../shared/utils/api-helpers";
import type { Doc } from "../../shared/types/doc";

// Helper to create mock docs
function createMockDoc(overrides: Partial<Doc> = {}): Doc {
  return {
    _dir: "en/1.devops",
    _id: "content/en/1.devops/2.git.md",
    _file: "2.git.md",
    _lang: "en",
    _path: "/en/devops/git",
    _route: "1-devops-2-git",
    category: "devops",
    categoryOrder: 1,
    fileOrder: 2,
    title: "Git",
    description: "Git guide",
    order: 2,
    ...overrides,
  };
}

describe("parseAvailableLangs", () => {
  it("should parse valid JSON language codes", () => {
    const langs = ['{"code":"en"}', '{"code":"fr"}', '{"code":"de"}'];
    const result = parseAvailableLangs(langs, "en");

    expect(result).toEqual(["fr", "de"]);
  });

  it("should filter out current language", () => {
    const langs = ['{"code":"en"}', '{"code":"fr"}'];
    const result = parseAvailableLangs(langs, "fr");

    expect(result).toEqual(["en"]);
  });

  it("should return empty array for undefined langs", () => {
    const result = parseAvailableLangs(undefined, "en");
    expect(result).toEqual([]);
  });

  it("should return empty array for non-array value", () => {
    // @ts-expect-error testing invalid input
    const result = parseAvailableLangs("not-an-array", "en");
    expect(result).toEqual([]);
  });

  it("should handle invalid JSON gracefully", () => {
    const langs = ['{"code":"en"}', "invalid-json", '{"code":"fr"}'];
    const result = parseAvailableLangs(langs, undefined);

    expect(result).toEqual(["en", "fr"]);
  });

  it("should handle empty array", () => {
    const result = parseAvailableLangs([], "en");
    expect(result).toEqual([]);
  });

  it("should handle JSON without code property", () => {
    const langs = ['{"name":"English"}', '{"code":"fr"}'];
    const result = parseAvailableLangs(langs, "en");

    // Objects without code property return undefined which is filtered out
    expect(result).toEqual(["fr"]);
  });

  it("should filter out null values from invalid JSON", () => {
    const langs = ['{"code":"en"}', "not-json"];
    const result = parseAvailableLangs(langs, undefined);

    expect(result).toEqual(["en"]);
  });
});

describe("filterDocsByLang", () => {
  it("should filter docs by language", () => {
    const docs = [
      createMockDoc({ _lang: "en", title: "English Doc" }),
      createMockDoc({ _lang: "fr", title: "French Doc" }),
      createMockDoc({ _lang: "en", title: "Another English" }),
    ];

    const result = filterDocsByLang(docs, "en");

    expect(result).toHaveLength(2);
    expect(result.every((d) => d._lang === "en")).toBe(true);
  });

  it("should return empty array when no docs match", () => {
    const docs = [createMockDoc({ _lang: "en" }), createMockDoc({ _lang: "fr" })];

    const result = filterDocsByLang(docs, "de");

    expect(result).toHaveLength(0);
  });

  it("should return all docs when all match", () => {
    const docs = [createMockDoc({ _lang: "fr" }), createMockDoc({ _lang: "fr" })];

    const result = filterDocsByLang(docs, "fr");

    expect(result).toHaveLength(2);
  });
});

describe("addTranslationsToDoc", () => {
  it("should add translations when they exist", () => {
    const doc = createMockDoc({
      _lang: "en",
      _path: "/en/devops/git",
    });

    const allDocs = [
      doc,
      createMockDoc({
        _lang: "fr",
        _path: "/fr/devops/git",
      }),
    ];

    const result = addTranslationsToDoc(doc, allDocs, "en", ["fr"]);

    expect(result.translations).toHaveLength(1);
    expect(result.translations![0]).toEqual({
      lang: "fr",
      path: "/fr/devops/git",
    });
  });

  it("should return empty translations when no translation exists", () => {
    const doc = createMockDoc({
      _lang: "en",
      _path: "/en/devops/docker",
    });

    const allDocs = [
      doc,
      createMockDoc({
        _lang: "fr",
        _path: "/fr/devops/git", // Different path
      }),
    ];

    const result = addTranslationsToDoc(doc, allDocs, "en", ["fr"]);

    expect(result.translations).toHaveLength(0);
  });

  it("should handle multiple available languages", () => {
    const doc = createMockDoc({
      _lang: "en",
      _path: "/en/devops/git",
    });

    const allDocs = [
      doc,
      createMockDoc({ _lang: "fr", _path: "/fr/devops/git" }),
      createMockDoc({ _lang: "de", _path: "/de/devops/git" }),
    ];

    const result = addTranslationsToDoc(doc, allDocs, "en", ["fr", "de"]);

    expect(result.translations).toHaveLength(2);
    expect(result.translations!.map((t) => t.lang)).toContain("fr");
    expect(result.translations!.map((t) => t.lang)).toContain("de");
  });

  it("should preserve original doc properties", () => {
    const doc = createMockDoc({
      title: "Original Title",
      description: "Original Description",
    });

    const result = addTranslationsToDoc(doc, [doc], "en", []);

    expect(result.title).toBe("Original Title");
    expect(result.description).toBe("Original Description");
  });
});

describe("sortDocs", () => {
  it("should sort by categoryOrder first", () => {
    const docs = [
      createMockDoc({ categoryOrder: 3, fileOrder: 1, title: "C" }),
      createMockDoc({ categoryOrder: 1, fileOrder: 1, title: "A" }),
      createMockDoc({ categoryOrder: 2, fileOrder: 1, title: "B" }),
    ];

    const result = sortDocs(docs);

    expect(result[0].title).toBe("A");
    expect(result[1].title).toBe("B");
    expect(result[2].title).toBe("C");
  });

  it("should sort by fileOrder within same category", () => {
    const docs = [
      createMockDoc({ categoryOrder: 1, fileOrder: 3, title: "Third" }),
      createMockDoc({ categoryOrder: 1, fileOrder: 1, title: "First" }),
      createMockDoc({ categoryOrder: 1, fileOrder: 2, title: "Second" }),
    ];

    const result = sortDocs(docs);

    expect(result[0].title).toBe("First");
    expect(result[1].title).toBe("Second");
    expect(result[2].title).toBe("Third");
  });

  it("should sort by title when category and file order are equal", () => {
    const docs = [
      createMockDoc({ categoryOrder: 1, fileOrder: 1, title: "Zebra" }),
      createMockDoc({ categoryOrder: 1, fileOrder: 1, title: "Apple" }),
      createMockDoc({ categoryOrder: 1, fileOrder: 1, title: "Mango" }),
    ];

    const result = sortDocs(docs);

    expect(result[0].title).toBe("Apple");
    expect(result[1].title).toBe("Mango");
    expect(result[2].title).toBe("Zebra");
  });

  it("should not mutate original array", () => {
    const docs = [createMockDoc({ categoryOrder: 2 }), createMockDoc({ categoryOrder: 1 })];
    const original = [...docs];

    sortDocs(docs);

    expect(docs[0].categoryOrder).toBe(original[0].categoryOrder);
  });

  it("should handle empty array", () => {
    const result = sortDocs([]);
    expect(result).toHaveLength(0);
  });
});

describe("processDocsWithQuery", () => {
  it("should return all docs when no language specified", () => {
    const docs = [createMockDoc({ _lang: "en" }), createMockDoc({ _lang: "fr" })];

    const result = processDocsWithQuery(docs, {});

    expect(result).toHaveLength(2);
  });

  it("should filter by language when specified", () => {
    const docs = [
      createMockDoc({ _lang: "en", title: "English" }),
      createMockDoc({ _lang: "fr", title: "French" }),
    ];

    const result = processDocsWithQuery(docs, { lang: "fr" });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("French");
  });

  it("should add translations when langs are provided", () => {
    const docs = [
      createMockDoc({ _lang: "en", _path: "/en/devops/git" }),
      createMockDoc({ _lang: "fr", _path: "/fr/devops/git" }),
    ];

    const result = processDocsWithQuery(docs, {
      lang: "en",
      langs: ['{"code":"en"}', '{"code":"fr"}'],
    });

    expect(result).toHaveLength(1);
    expect(result[0].translations).toBeDefined();
    expect(result[0].translations).toHaveLength(1);
    expect(result[0].translations![0].lang).toBe("fr");
  });

  it("should return sorted results", () => {
    const docs = [
      createMockDoc({
        _lang: "en",
        categoryOrder: 2,
        fileOrder: 1,
        title: "Second",
      }),
      createMockDoc({
        _lang: "en",
        categoryOrder: 1,
        fileOrder: 1,
        title: "First",
      }),
    ];

    const result = processDocsWithQuery(docs, { lang: "en" });

    expect(result[0].title).toBe("First");
    expect(result[1].title).toBe("Second");
  });

  it("should handle empty docs array", () => {
    const result = processDocsWithQuery([], { lang: "en" });
    expect(result).toHaveLength(0);
  });

  it("should not add translations when langs is empty", () => {
    const docs = [createMockDoc({ _lang: "en" })];

    const result = processDocsWithQuery(docs, {
      lang: "en",
      langs: [],
    });

    expect(result[0].translations).toBeUndefined();
  });

  it("should handle partial translations", () => {
    const docs = [
      createMockDoc({ _lang: "en", _path: "/en/devops/git", title: "Git EN" }),
      createMockDoc({ _lang: "en", _path: "/en/devops/docker", title: "Docker EN" }),
      createMockDoc({ _lang: "fr", _path: "/fr/devops/git", title: "Git FR" }),
      // No French translation for docker
    ];

    const result = processDocsWithQuery(docs, {
      lang: "en",
      langs: ['{"code":"en"}', '{"code":"fr"}'],
    });

    expect(result).toHaveLength(2);

    const gitDoc = result.find((d) => d.title === "Git EN");
    const dockerDoc = result.find((d) => d.title === "Docker EN");

    expect(gitDoc?.translations).toHaveLength(1);
    expect(dockerDoc?.translations).toHaveLength(0);
  });
});

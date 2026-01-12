import { describe, expect, it } from "vitest";

describe("docs API endpoint logic", () => {
  it("should filter docs by language", () => {
    const docs = [
      { _lang: "en", title: "English Doc" },
      { _lang: "fr", title: "French Doc" },
      { _lang: "en", title: "Another English Doc" },
    ];

    const filtered = docs.filter((doc) => doc._lang === "fr");

    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("French Doc");
  });

  it("should sort docs by category order", () => {
    const docs = [
      { categoryOrder: 3, fileOrder: 1, title: "C" },
      { categoryOrder: 1, fileOrder: 2, title: "A" },
      { categoryOrder: 2, fileOrder: 1, title: "B" },
    ];

    const sorted = docs.sort((a, b) => {
      if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder;
      if (a.fileOrder !== b.fileOrder) return a.fileOrder - b.fileOrder;
      return a.title.localeCompare(b.title);
    });

    expect(sorted[0].title).toBe("A");
    expect(sorted[1].title).toBe("B");
    expect(sorted[2].title).toBe("C");
  });

  it("should sort docs by file order within same category", () => {
    const docs = [
      { categoryOrder: 1, fileOrder: 3, title: "Third" },
      { categoryOrder: 1, fileOrder: 1, title: "First" },
      { categoryOrder: 1, fileOrder: 2, title: "Second" },
    ];

    const sorted = docs.sort((a, b) => {
      if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder;
      if (a.fileOrder !== b.fileOrder) return a.fileOrder - b.fileOrder;
      return a.title.localeCompare(b.title);
    });

    expect(sorted[0].title).toBe("First");
    expect(sorted[1].title).toBe("Second");
    expect(sorted[2].title).toBe("Third");
  });

  it("should identify translation availability", () => {
    const docsEn = [
      { _lang: "en", _path: "/devops/git", title: "Git" },
      { _lang: "en", _path: "/devops/docker", title: "Docker" },
    ];

    const docsFr = [
      { _lang: "fr", _path: "/devops/git", title: "Git" },
      // docker is not translated in French
    ];

    const allDocs = [...docsEn, ...docsFr];

    // Find equivalent documents
    const enGit = allDocs.find((d) => d._lang === "en" && d._path === "/devops/git");
    const frGit = allDocs.find((d) => d._lang === "fr" && d._path === "/devops/git");

    expect(enGit).toBeDefined();
    expect(frGit).toBeDefined();

    // Docker is only available in English
    const enDocker = allDocs.find((d) => d._lang === "en" && d._path === "/devops/docker");
    const frDocker = allDocs.find((d) => d._lang === "fr" && d._path === "/devops/docker");

    expect(enDocker).toBeDefined();
    expect(frDocker).toBeUndefined();
  });

  it("should handle query parameters for language filtering", () => {
    const query = { lang: "fr" };
    const docs = [
      { _lang: "en", title: "English" },
      { _lang: "fr", title: "French" },
      { _lang: "fr", title: "Français" },
    ];

    const filtered = docs.filter((doc) => doc._lang === query.lang);

    expect(filtered).toHaveLength(2);
    expect(filtered.every((doc) => doc._lang === "fr")).toBe(true);
  });

  it("should return correct count", () => {
    const docs = [{ title: "Doc 1" }, { title: "Doc 2" }, { title: "Doc 3" }];

    const result = {
      count: docs.length,
      docs,
    };

    expect(result.count).toBe(3);
    expect(result.docs).toHaveLength(3);
  });
});

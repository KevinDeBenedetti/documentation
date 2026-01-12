import { describe, expect, it } from "vitest";
import { docIdToSlug, slugToDocId } from "../../shared/formatters/doc";

describe("docIdToSlug", () => {
  it("should convert a full doc ID with content prefix to slug", () => {
    const result = docIdToSlug("content/fr/1.devops/4.docker.md");
    expect(result).toBe("1-devops-4-docker");
  });

  it("should convert a stem without content prefix to slug", () => {
    const result = docIdToSlug("fr/1.devops/6.firewall");
    expect(result).toBe("1-devops-6-firewall");
  });

  it("should remove language prefix", () => {
    const result = docIdToSlug("en/2.javascript-typescript/1.vue.md");
    expect(result).toBe("2-javascript-typescript-1-vue");
  });

  it("should handle paths without numbers", () => {
    const result = docIdToSlug("content/fr/some/path/file.md");
    expect(result).toBe("some-path-file");
  });

  it("should normalize accents", () => {
    const result = docIdToSlug("content/fr/1.devops/éléments.md");
    expect(result).toBe("1-devops-elements");
  });

  it("should convert to lowercase", () => {
    const result = docIdToSlug("content/en/1.DevOps/2.GitHub.md");
    expect(result).toBe("1-devops-2-github");
  });

  it("should replace invalid characters with hyphens", () => {
    const result = docIdToSlug("content/fr/1.devops/test@file#name.md");
    expect(result).toBe("1-devops-test-file-name");
  });

  it("should remove consecutive hyphens", () => {
    const result = docIdToSlug("content/fr/1.devops/test---file.md");
    expect(result).toBe("1-devops-test-file");
  });

  it("should trim leading and trailing hyphens", () => {
    const result = docIdToSlug("content/fr/-1.devops-/file-.md");
    expect(result).toBe("1-devops-file");
  });

  it("should handle paths with leading and trailing slashes", () => {
    const result = docIdToSlug("/content/fr/1.devops/docker.md/");
    expect(result).toBe("content-fr-1-devops-docker");
  });

  it("should handle empty language prefix", () => {
    const result = docIdToSlug("1.devops/4.docker.md");
    expect(result).toBe("1-devops-4-docker");
  });

  it("should handle index files", () => {
    const result = docIdToSlug("content/fr/index.md");
    expect(result).toBe("index");
  });
});

describe("slugToDocId", () => {
  it("should convert basic slug to doc ID", () => {
    const result = slugToDocId("1-devops-6-firewall", "fr");
    expect(result).toBe("fr/1.devops/6.firewall");
  });

  it("should handle slug with single segment", () => {
    const result = slugToDocId("1-devops", "en");
    expect(result).toBe("en/1.devops");
  });

  it("should handle slug with multiple segments", () => {
    const result = slugToDocId("1-devops-2-git-3-advanced", "fr");
    expect(result).toBe("fr/1.devops/2.git/3.advanced");
  });

  it("should handle slug without numbers", () => {
    const result = slugToDocId("some-file", "en");
    expect(result).toBe("en/some-file");
  });

  it("should handle slug with different languages", () => {
    const resultFr = slugToDocId("1-devops-4-docker", "fr");
    const resultEn = slugToDocId("1-devops-4-docker", "en");

    expect(resultFr).toBe("fr/1.devops/4.docker");
    expect(resultEn).toBe("en/1.devops/4.docker");
  });

  it("should handle slug with consecutive numbers", () => {
    const result = slugToDocId("1-2-3", "fr");
    expect(result).toBe("fr/1/2/3");
  });

  it("should handle complex multi-level path", () => {
    const result = slugToDocId("2-javascript-typescript-1-vue", "en");
    expect(result).toBe("en/2.javascript-typescript/1.vue");
  });

  it("should handle index slug", () => {
    const result = slugToDocId("index", "fr");
    expect(result).toBe("fr/index");
  });

  it("should handle slug with many hyphens between words", () => {
    const result = slugToDocId("1-dev-ops-tools", "en");
    expect(result).toBe("en/1.dev-ops-tools");
  });
});

describe("docIdToSlug and slugToDocId round-trip", () => {
  it("should maintain consistency in round-trip conversion", () => {
    const originalStem = "fr/1.devops/6.firewall";
    const slug = docIdToSlug(originalStem);
    const backToStem = slugToDocId(slug, "fr");

    expect(backToStem).toBe(originalStem);
  });

  it("should work with complex paths", () => {
    const originalStem = "en/2.javascript-typescript/1.vue";
    const slug = docIdToSlug(originalStem);
    const backToStem = slugToDocId(slug, "en");

    expect(backToStem).toBe(originalStem);
  });

  it("should work with deep nested paths", () => {
    const originalStem = "fr/1.category/2.subcategory/3.page";
    const slug = docIdToSlug(originalStem);
    const backToStem = slugToDocId(slug, "fr");

    expect(backToStem).toBe(originalStem);
  });
});

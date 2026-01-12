import { beforeEach, describe, expect, it, vi } from "vitest";
import { vol } from "memfs";
import { parseFrontmatter, getMarkdownFiles } from "../../shared/utils/doc";

// Mock node:fs/promises module with memfs
vi.mock("node:fs/promises", async () => {
  const memfs = await vi.importActual<typeof import("memfs")>("memfs");
  return memfs.fs.promises;
});

describe("parseFrontmatter", () => {
  it("should parse basic frontmatter with string values", () => {
    const content = `---
title: Test Title
description: Test Description
---
Content here`;

    const result = parseFrontmatter(content);

    expect(result).toEqual({
      title: "Test Title",
      description: "Test Description",
    });
  });

  it("should parse frontmatter with numeric values", () => {
    const content = `---
order: 42
priority: 100
---
Content`;

    const result = parseFrontmatter(content);

    expect(result).toEqual({
      order: 42,
      priority: 100,
    });
  });

  it("should parse frontmatter with quoted strings", () => {
    const content = `---
title: "Quoted Title"
description: 'Single Quoted'
---
Content`;

    const result = parseFrontmatter(content);

    expect(result).toEqual({
      title: "Quoted Title",
      description: "Single Quoted",
    });
  });

  it("should handle empty frontmatter", () => {
    const content = `---
---
Content`;

    const result = parseFrontmatter(content);

    expect(result).toEqual({});
  });

  it("should return empty object when no frontmatter exists", () => {
    const content = "Just content without frontmatter";

    const result = parseFrontmatter(content);

    expect(result).toEqual({});
  });

  it("should handle frontmatter with colons in values", () => {
    const content = `---
title: Test: A Complex Title
url: https://example.com
---
Content`;

    const result = parseFrontmatter(content);

    expect(result).toEqual({
      title: "Test: A Complex Title",
      url: "https://example.com",
    });
  });

  it("should skip nested objects in frontmatter", () => {
    const content = `---
title: Main Title
seo:
  description: SEO Description
  title: SEO Title
description: Main Description
---
Content`;

    const result = parseFrontmatter(content);

    // Nested objects are skipped, only top-level fields are parsed
    expect(result).toEqual({
      title: "Main Title",
      description: "Main Description",
    });
  });

  it("should handle whitespace properly", () => {
    const content = `---
title:   Spaces Around
description:Test
---
Content`;

    const result = parseFrontmatter(content);

    expect(result).toEqual({
      title: "Spaces Around",
      description: "Test",
    });
  });

  it("should handle mixed value types", () => {
    const content = `---
title: String Value
order: 5
enabled: true
---
Content`;

    const result = parseFrontmatter(content);

    expect(result).toEqual({
      title: "String Value",
      order: 5,
      enabled: "true", // Boolean values are kept as strings
    });
  });

  it("should handle empty lines in frontmatter", () => {
    const content = `---
title: Test

description: Description

order: 1
---
Content`;

    const result = parseFrontmatter(content);

    expect(result).toEqual({
      title: "Test",
      description: "Description",
      order: 1,
    });
  });

  it("should handle frontmatter with only nested objects", () => {
    const content = `---
seo:
  title: SEO Title
  description: SEO Description
---
Content`;

    const result = parseFrontmatter(content);
    expect(result).toEqual({});
  });

  it("should handle frontmatter with special characters in values", () => {
    const content = `---
title: Test & More <script>
description: "Quotes 'inside' value"
---
Content`;

    const result = parseFrontmatter(content);
    expect(result).toEqual({
      title: "Test & More <script>",
      description: "Quotes 'inside' value",
    });
  });

  it("should handle frontmatter with negative numbers", () => {
    const content = `---
order: -5
priority: 100
---
Content`;

    const result = parseFrontmatter(content);
    expect(result).toEqual({
      order: "-5", // Negative numbers kept as strings
      priority: 100,
    });
  });
});

describe("getMarkdownFiles", () => {
  beforeEach(() => {
    vol.reset();
  });

  it("should read markdown files from directory", async () => {
    vol.fromJSON(
      {
        "en/1.devops/2.git.md": `---
title: Git Guide
description: A guide to Git
---
Content about Git`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content", "/content");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      title: "Git Guide",
      description: "A guide to Git",
      _lang: "en",
      category: "devops",
      categoryOrder: 1,
      fileOrder: 2,
    });
  });

  it("should read files from nested directories", async () => {
    vol.fromJSON(
      {
        "en/1.devops/2.git.md": `---
title: Git
---
Content`,
        "en/1.devops/3.docker.md": `---
title: Docker
---
Content`,
        "fr/1.devops/2.git.md": `---
title: Git FR
---
Content`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content", "/content");

    expect(result).toHaveLength(3);
    const titles = result.map((d) => d.title);
    expect(titles).toContain("Git");
    expect(titles).toContain("Docker");
    expect(titles).toContain("Git FR");
  });

  it("should extract correct order from path", async () => {
    vol.fromJSON(
      {
        "en/2.javascript/1.vue.md": `---
title: Vue Guide
---
Content`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content", "/content");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      categoryOrder: 2,
      fileOrder: 1,
      category: "javascript",
    });
  });

  it("should use filename as title when frontmatter has no title", async () => {
    vol.fromJSON(
      {
        "en/1.devops/5.kubernetes.md": `---
description: K8s guide
---
Content`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content", "/content");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("5.kubernetes");
  });

  it("should ignore non-markdown files", async () => {
    vol.fromJSON(
      {
        "en/1.devops/readme.txt": "Not a markdown",
        "en/1.devops/config.json": '{"key": "value"}',
        "en/1.devops/2.git.md": `---
title: Git
---
Content`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content", "/content");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Git");
  });

  it("should handle index files", async () => {
    vol.fromJSON(
      {
        "en/index.md": `---
title: Home
description: Welcome
---
Content`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content", "/content");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      title: "Home",
      categoryOrder: 999,
      fileOrder: 999,
    });
  });

  it("should handle paths without numeric prefixes", async () => {
    vol.fromJSON(
      {
        "en/devops/git.md": `---
title: Git
---
Content`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content", "/content");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      category: "Autre",
      categoryOrder: 999,
      fileOrder: 999,
    });
  });

  it("should generate correct routes and paths", async () => {
    vol.fromJSON(
      {
        "fr/1.devops/4.docker.md": `---
title: Docker
---
Content`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content", "/content");

    expect(result).toHaveLength(1);
    expect(result[0]._path).toBe("/fr/devops/docker");
    expect(result[0]._route).toBe("fr-1-devops-4-docker");
    expect(result[0]._id).toBe("content/fr/1.devops/4.docker.md");
  });

  it("should handle empty directory", async () => {
    vol.fromJSON({ ".gitkeep": "" }, "/content/empty");

    const result = await getMarkdownFiles("/content/empty", "/content/empty");

    expect(result).toHaveLength(0);
  });

  it("should extract language from path", async () => {
    vol.fromJSON(
      {
        "fr/1.devops/2.git.md": `---
title: Git FR
---
Content`,
        "en/1.devops/2.git.md": `---
title: Git EN
---
Content`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content", "/content");

    const frDoc = result.find((d) => d._lang === "fr");
    const enDoc = result.find((d) => d._lang === "en");

    expect(frDoc).toBeDefined();
    expect(enDoc).toBeDefined();
    expect(frDoc?.title).toBe("Git FR");
    expect(enDoc?.title).toBe("Git EN");
  });

  it("should handle deeply nested directories", async () => {
    vol.fromJSON(
      {
        "en/1.devops/2.ci/3.github-actions.md": `---
title: GitHub Actions
---
Content`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content", "/content");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("GitHub Actions");
  });

  it("should set correct _dir value", async () => {
    vol.fromJSON(
      {
        "en/1.devops/2.git.md": `---
title: Git
---
Content`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content/en/1.devops", "/content");

    expect(result).toHaveLength(1);
    expect(result[0]._dir).toBe("en/1.devops");
  });

  it("should handle files with empty frontmatter", async () => {
    vol.fromJSON(
      {
        "en/1.devops/2.git.md": `---
---
Content without metadata`,
      },
      "/content",
    );

    const result = await getMarkdownFiles("/content", "/content");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("2.git");
    expect(result[0].description).toBe("");
  });
});

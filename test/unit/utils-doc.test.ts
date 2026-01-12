import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "../../shared/utils/doc";

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
});

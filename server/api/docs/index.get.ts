import { join } from "node:path";
import { getMarkdownFiles } from "#shared/utils/doc";
import { processDocsWithQuery } from "#shared/utils/api-helpers";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const contentRootDir = join(process.cwd(), "content");

  try {
    const docs = await getMarkdownFiles(contentRootDir, contentRootDir);

    const lang = query.lang as string | undefined;
    const langs = query.langs as string[] | undefined;

    const filteredDocs = processDocsWithQuery(docs, {
      lang,
      langs,
    });

    return {
      count: filteredDocs.length,
      docs: filteredDocs,
    };
  } catch {
    return {
      count: 0,
      docs: [],
      error: "Directory not found",
    };
  }
});
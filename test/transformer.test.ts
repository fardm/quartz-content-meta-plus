import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { WordCountPlus } from "../src/transformer";
import { createCtx } from "./helpers";

describe("WordCountPlus Transformer", () => {
  it("should accurately count words in markdown content", async () => {
    const ctx = createCtx();
    const transformer = WordCountPlus();
    const plugins = transformer.markdownPlugins?.(ctx) ?? [];

    const file = await unified()
      .use(remarkParse)
      .use(plugins)
      .use(remarkStringify)
      .process("این یک متن نمونه برای تست پلاگین کوارتز است.");

    expect(file.data.wordCount).toBe(9);
  });

  it("should remove HTML break tags before counting words", async () => {
    const ctx = createCtx();
    const transformer = WordCountPlus();
    const plugins = transformer.markdownPlugins?.(ctx) ?? [];

    const file = await unified()
      .use(remarkParse)
      .use(plugins)
      .use(remarkStringify)
      .process("کلمه اول<br>کلمه دوم<br />کلمه سوم");

    expect(file.data.wordCount).toBe(6);
  });
});

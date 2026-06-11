import type { QuartzTransformerPlugin } from "@quartz-community/types";

export interface WordCountPlusOptions {
  // در صورت نیاز به افزودن آپشن در آینده
}

export const WordCountPlus: QuartzTransformerPlugin<Partial<WordCountPlusOptions>> = (
  _userOptions?,
) => {
  return {
    name: "WordCountPlus",
    markdownPlugins() {
      return [
        () => {
          return (_tree, file) => {
            let text = file.value as string;
            if (!text) return;

            // اصلاح اصلی: جایگزینی تگ شکست خط با فاصله به جای حذف کامل
            text = text.replace(/<br\s*\/?>?/gi, " ");

            // شمارش کلمات بر اساس فاصله‌های خالی
            const wordCount = text.split(/\s+/).filter(Boolean).length;
            file.data.wordCount = wordCount;
          };
        },
      ];
    },
  };
};

declare module "vfile" {
  interface DataMap {
    wordCount: number;
  }
}

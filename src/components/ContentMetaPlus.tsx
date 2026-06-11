import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
import readingTime from "reading-time";
import { classNames } from "../util/lang";
import style from "./styles/contentMetaPlus.scss";

export interface ContentMetaPlusOptions {
  showReadingTime?: boolean;
  showComma?: boolean;
}

const defaultOptions: ContentMetaPlusOptions = {
  showReadingTime: true,
  showComma: true,
};

const statusTooltipMap: Record<string, string> = {
  "🌱": "وضعیت: نهال",
  "🌿": "وضعیت: درختچه",
  "🌳": "وضعیت: همیشه‌سبز",
  "❌": "وضعیت: ناقص",
  "🪦": "وضعیت: متروک",
};

function formatDate(date: Date, locale: string = "en-US"): string {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default ((opts?: ContentMetaPlusOptions) => {
  const options = { ...defaultOptions, ...opts };

  const Component: QuartzComponent = ({ cfg, fileData, displayClass }: QuartzComponentProps) => {
    const text = fileData.text;

    if (!text) return null;

    const segments: (string | preact.JSX.Element)[] = [];

    if (fileData.dates) {
      const created = fileData.dates.created;
      const modified = fileData.dates.modified;

      // Created Date
      if (created) {
        segments.push(<span title="تاریخ انتشار">📅 {formatDate(created, cfg.locale)}</span>);
      }

      // Modified Date
      if (modified && created?.toDateString() !== modified.toDateString()) {
        segments.push(
          <span title="تاریخ آخرین بروزرسانی">🔄 {formatDate(modified, cfg.locale)}</span>,
        );
      }
    }

    // Reading Time
    if (options.showReadingTime) {
      const { minutes } = readingTime(text);
      const displayMinutes = Math.ceil(minutes);
      segments.push(
        cfg.locale?.startsWith("fa")
          ? `${displayMinutes} دقیقه مطالعه`
          : `${displayMinutes} min read`,
      );
    }

    // Word Count
    if (fileData.wordCount !== undefined && fileData.frontmatter?.wordcount !== false) {
      segments.push(<span title="تعداد کلمات">{fileData.wordCount} کلمه</span>);
    }

    // Status mapping
    const status = (fileData.frontmatter?.status as string) || "نامشخص";
    if (status !== "نامشخص") {
      segments.push(<span title={statusTooltipMap[status] || status}>{status}</span>);
    }

    if (segments.length === 0) return null;

    const segmentsElements = segments.map((segment, index) => <span key={index}>{segment}</span>);

    return (
      <p
        show-comma={options.showComma ? "true" : "false"}
        class={classNames(displayClass, "content-meta-plus")}
      >
        {segmentsElements}
      </p>
    );
  };

  Component.css = style;

  return Component;
}) satisfies QuartzComponentConstructor;

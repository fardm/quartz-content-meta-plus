import { createRequire } from 'module';

const require$1 = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x2) => typeof require$1 !== "undefined" ? require$1 : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a2, b) => (typeof require$1 !== "undefined" ? require$1 : a2)[b]
}) : x2)(function(x2) {
  if (typeof require$1 !== "undefined") return require$1.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  __defProp(target, "default", { value: mod, enumerable: true }) ,
  mod
));

// node_modules/reading-time/lib/reading-time.js
var require_reading_time = __commonJS({
  "node_modules/reading-time/lib/reading-time.js"(exports$1, module) {
    function codeIsInRanges(number, arrayOfRanges) {
      return arrayOfRanges.some(
        ([lowerBound, upperBound]) => lowerBound <= number && number <= upperBound
      );
    }
    function isCJK(c2) {
      if ("string" !== typeof c2) {
        return false;
      }
      const charCode = c2.charCodeAt(0);
      return codeIsInRanges(
        charCode,
        [
          // Hiragana (Katakana not included on purpose,
          // context: https://github.com/ngryman/reading-time/pull/35#issuecomment-853364526)
          // If you think Katakana should be included and have solid reasons, improvement is welcomed
          [12352, 12447],
          // CJK Unified ideographs
          [19968, 40959],
          // Hangul
          [44032, 55203],
          // CJK extensions
          [131072, 191456]
        ]
      );
    }
    function isAnsiWordBound(c2) {
      return " \n\r	".includes(c2);
    }
    function isPunctuation(c2) {
      if ("string" !== typeof c2) {
        return false;
      }
      const charCode = c2.charCodeAt(0);
      return codeIsInRanges(
        charCode,
        [
          [33, 47],
          [58, 64],
          [91, 96],
          [123, 126],
          // CJK Symbols and Punctuation
          [12288, 12351],
          // Full-width ASCII punctuation variants
          [65280, 65519]
        ]
      );
    }
    function readingTime2(text, options = {}) {
      let words = 0, start = 0, end = text.length - 1;
      const wordsPerMinute = options.wordsPerMinute || 200;
      const isWordBound = options.wordBound || isAnsiWordBound;
      while (isWordBound(text[start])) start++;
      while (isWordBound(text[end])) end--;
      const normalizedText = `${text}
`;
      for (let i2 = start; i2 <= end; i2++) {
        if (isCJK(normalizedText[i2]) || !isWordBound(normalizedText[i2]) && (isWordBound(normalizedText[i2 + 1]) || isCJK(normalizedText[i2 + 1]))) {
          words++;
        }
        if (isCJK(normalizedText[i2])) {
          while (i2 <= end && (isPunctuation(normalizedText[i2 + 1]) || isWordBound(normalizedText[i2 + 1]))) {
            i2++;
          }
        }
      }
      const minutes = words / wordsPerMinute;
      const time = Math.round(minutes * 60 * 1e3);
      const displayed = Math.ceil(minutes.toFixed(2));
      return {
        text: displayed + " min read",
        minutes,
        time,
        words
      };
    }
    module.exports = readingTime2;
  }
});

// node_modules/reading-time/lib/stream.js
var require_stream = __commonJS({
  "node_modules/reading-time/lib/stream.js"(exports$1, module) {
    var readingTime2 = require_reading_time();
    var Transform = __require("stream").Transform;
    var util = __require("util");
    function ReadingTimeStream(options) {
      if (!(this instanceof ReadingTimeStream)) {
        return new ReadingTimeStream(options);
      }
      Transform.call(this, { objectMode: true });
      this.options = options || {};
      this.stats = {
        minutes: 0,
        time: 0,
        words: 0
      };
    }
    util.inherits(ReadingTimeStream, Transform);
    ReadingTimeStream.prototype._transform = function(chunk, encoding, callback) {
      const stats = readingTime2(chunk.toString(encoding), this.options);
      this.stats.minutes += stats.minutes;
      this.stats.time += stats.time;
      this.stats.words += stats.words;
      callback();
    };
    ReadingTimeStream.prototype._flush = function(callback) {
      this.stats.text = Math.ceil(this.stats.minutes.toFixed(2)) + " min read";
      this.push(this.stats);
      callback();
    };
    module.exports = ReadingTimeStream;
  }
});

// node_modules/reading-time/index.js
var require_reading_time2 = __commonJS({
  "node_modules/reading-time/index.js"(exports$1, module) {
    module.exports.default = module.exports = require_reading_time();
    module.exports.readingTimeStream = require_stream();
  }
});

// src/transformer.ts
var WordCountPlus = (_userOptions) => {
  return {
    name: "WordCountPlus",
    markdownPlugins() {
      return [
        () => {
          return (_tree, file) => {
            let text = file.value;
            if (!text) return;
            text = text.replace(/<br\s*\/?>?/gi, " ");
            const wordCount = text.split(/\s+/).filter(Boolean).length;
            file.data.wordCount = wordCount;
          };
        }
      ];
    }
  };
};

// src/components/ContentMetaPlus.tsx
var import_reading_time = __toESM(require_reading_time2());

// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/components/styles/contentMetaPlus.scss
var contentMetaPlus_default = '.content-meta-plus[show-comma=true] > *:not(:last-child) {\n  margin-right: 8px;\n}\n.content-meta-plus[show-comma=true] > *:not(:last-child)::after {\n  content: ",";\n}\n\n.content-meta-plus {\n  color: var(--darkgray) !important;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n}\n\n.content-meta-plus > span {\n  background-color: var(--lightgray);\n  border-radius: 4px;\n  padding: 1px 6px;\n  font-size: 0.9em;\n  border: 1px solid transparent;\n}\n\n.content-meta-plus > span:hover {\n  border-color: var(--gray);\n  cursor: help;\n}';
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, o2, r2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((o2 = i2.constructor) && null != o2.getDerivedStateFromError && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/ContentMetaPlus.tsx
var defaultOptions = {
  showReadingTime: true,
  showComma: true
};
var statusTooltipMap = {
  "\u{1F331}": "\u0648\u0636\u0639\u06CC\u062A: \u0646\u0647\u0627\u0644",
  "\u{1F33F}": "\u0648\u0636\u0639\u06CC\u062A: \u062F\u0631\u062E\u062A\u0686\u0647",
  "\u{1F333}": "\u0648\u0636\u0639\u06CC\u062A: \u0647\u0645\u06CC\u0634\u0647\u200C\u0633\u0628\u0632",
  "\u274C": "\u0648\u0636\u0639\u06CC\u062A: \u0646\u0627\u0642\u0635",
  "\u{1FAA6}": "\u0648\u0636\u0639\u06CC\u062A: \u0645\u062A\u0631\u0648\u06A9"
};
function formatDate(date, locale = "en-US") {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
var ContentMetaPlus_default = ((opts) => {
  const options = { ...defaultOptions, ...opts };
  const Component = ({ cfg, fileData, displayClass }) => {
    const text = fileData.text;
    if (!text) return null;
    const segments = [];
    if (fileData.dates) {
      const created = fileData.dates.created;
      const modified = fileData.dates.modified;
      if (created) {
        segments.push(/* @__PURE__ */ u2("span", { title: "\u062A\u0627\u0631\u06CC\u062E \u0627\u0646\u062A\u0634\u0627\u0631", children: [
          "\u{1F4C5} ",
          formatDate(created, cfg.locale)
        ] }));
      }
      if (modified && created?.toDateString() !== modified.toDateString()) {
        segments.push(
          /* @__PURE__ */ u2("span", { title: "\u062A\u0627\u0631\u06CC\u062E \u0622\u062E\u0631\u06CC\u0646 \u0628\u0631\u0648\u0632\u0631\u0633\u0627\u0646\u06CC", children: [
            "\u{1F504} ",
            formatDate(modified, cfg.locale)
          ] })
        );
      }
    }
    if (options.showReadingTime) {
      const { minutes } = (0, import_reading_time.default)(text);
      const displayMinutes = Math.ceil(minutes);
      segments.push(
        cfg.locale?.startsWith("fa") ? `${displayMinutes} \u062F\u0642\u06CC\u0642\u0647 \u0645\u0637\u0627\u0644\u0639\u0647` : `${displayMinutes} min read`
      );
    }
    if (fileData.wordCount !== void 0 && fileData.frontmatter?.wordcount !== false) {
      segments.push(/* @__PURE__ */ u2("span", { title: "\u062A\u0639\u062F\u0627\u062F \u06A9\u0644\u0645\u0627\u062A", children: [
        fileData.wordCount,
        " \u06A9\u0644\u0645\u0647"
      ] }));
    }
    const status = fileData.frontmatter?.status || "\u0646\u0627\u0645\u0634\u062E\u0635";
    if (status !== "\u0646\u0627\u0645\u0634\u062E\u0635") {
      segments.push(/* @__PURE__ */ u2("span", { title: statusTooltipMap[status] || status, children: status }));
    }
    if (segments.length === 0) return null;
    const segmentsElements = segments.map((segment, index) => /* @__PURE__ */ u2("span", { children: segment }, index));
    return /* @__PURE__ */ u2(
      "p",
      {
        "show-comma": options.showComma ? "true" : "false",
        class: classNames(displayClass, "content-meta-plus"),
        children: segmentsElements
      }
    );
  };
  Component.css = contentMetaPlus_default;
  return Component;
});
/*! Bundled license information:

reading-time/lib/reading-time.js:
reading-time/lib/stream.js:
  (*!
   * reading-time
   * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
   * MIT Licensed
   *)
*/

export { ContentMetaPlus_default as ContentMetaPlus, WordCountPlus };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
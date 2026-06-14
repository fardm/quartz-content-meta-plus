# Quartz Content Meta Plus

An enhanced version of Quartz's official `contentMeta` plugin with useful extra features.

## Features

- Displays **last modified date** from frontmatter (`modified`)
- Shows **status** from frontmatter (`status`)
- Shows **word count** of the note
- Improved styling

## Installation

```bash
npx quartz plugin add github:fardm/quartz-content-meta-plus
```

## Configuration

After installation, the following default configuration is automatically added to your `quartz.config.yaml`:

```yaml
- source: github:fardm/quartz-content-meta-plus
  enabled: true
  options:
    showComma: false
    showReadingTime: false
  layout:
    position: beforeBody
    priority: 20
```

## Usage

You can use the following properties in your note's frontmatter:

```markdown
---
created: 2025-05-01
modified: 2025-06-30
wordcount: true
status: "🌱 Seedling"
---
```

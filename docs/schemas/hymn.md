# Hymn Schema - v0

Hymns are stored as Markdown documents with YAML frontmatter. Markdown store singable content and the frontmatter stores non-singable content.

Can be used the [CommonMark](http://commonmark.org/) syntax, with the addition of a rule that treats line breaks as hardline breaks without requiring the use of two spaces in the end of the lines. That rule is implemented by many implementations as it's used in GitHub.

## Elements

Some markdown elements will be mapped to the hymn structure. They're the following:

* Stanzas: marked by paragraphs
* Refrains: marked by quotes

## Frontmatter attributes

* `title`: the title of the hymn, *required*
* `author`: the author(s) or the hymn; can be a string with a single name, an array of names or an object specifing roles and names
* `date`: the publication date of the hymn, ISO 8601 formatted

## Examples

```markdown
---
title: I Surrender All
author:
  text: Judson W. Van DeVenter
  melody: Winfield S. Weeden
date: 1896
---

All to Jesus I surrender,
All to him I freely give;
I will ever love and trust him,
In his presence daily live.

> I surrender all,
> I surrender all,
> All to thee, my blessed Savior,
> I surrender all.

All to Jesus I surrender,
Humbly at his feet I bow,
Worldly pleasures all forsaken,
Take me, Jesus, take me now.

All to Jesus I surrender;
Make me, Savior, wholly thine;
Let me feel the Holy Spirit,
Truly know that thou art mine.

All to Jesus I surrender,
Lord, I give myself to thee,
Fill me with thy love and power,
Let thy blessing fall on me.

All to Jesus I surrender;
Now I feel the sacred flame.
Oh, the joy of full salvation!
Glory, glory, to his name!
```

## Notes:

It's recommended to mark all refrain lines with `>`, avoiding the use of the "[Laziness rule](http://spec.commonmark.org/0.13/#block-quotes)", which will improve reading and editing of the source code.

Implementations need to distinguish refrains from stanzas. They can, following the traditional singing organization, automatically insert refrains after stanzas where applicable, like in a presentation mode.

Refrains must not be repeated in the source code if the song follows the traditional singing organization, instead they must be marked as refrains (using quotes), then the implementation will handle the repeation, as shown above.

Frontmatter is stored in YAML, with keys in English, but it's recommended that editor implementations avoid editing the source directly, instead provide a more intuitive interface. Options must be shown translated if the application language isn't English.

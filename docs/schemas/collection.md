# Collection Schema - v0

Collections are folders grouping contents, like hymns or studies. It also contains a manifest with the collection metadata and a criptografic signature.

It can be distributed as ZIP files, simple compressed for collections with few files, like Bibles, or double compressed (like .tar.gz) for collections with multiple files.

All content from a collection must be written in a same language.

The collection manifest is stored at the root of the folder, named as "_manifest.json". It's a JSON file containing a object with the following attributes:

* `name`: the name of the collection
* `language`: the language of the content
* `type`: the type of content (Bible, hymns or studies)
* `description`: the description of the collection

The criptografic signature, `_signature`, signs all the content from the collection, except by the signature itself. It must be regenerated if the collection content changes. To avoid doing that for every single change content edition is based on patches, which are applied to the collection before publishing it. The editor should show a warning when the user open some edited content which patches wan't applied to the collection and properly signed.

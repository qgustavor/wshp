# wshp.tk
An unusual web application focused on worship, speed and security.

Step by step explanation:

* *unusual web application*: Different from most other web applications nowadays this one don't use third party elements and have a different way to work with modules. The reason is those points got already tested and made the development more complicated than we expected.

* *focused on worship*: The main content from the application will be focused on worship, so it will be *other bible website*. Why other? Because I need one ( current bible websites have some problems, I reported those to the owners but they persist ), also it's sufficiently large to create good challenges like "you can't simply cache hundreds of pages with Application Cache".

* *focused on speed*: The name chosen itself shows this point: wshp, an abbreviation of worship. But it's more abroad: we pretend to give this application an PageSpeed score of 100/100 in *all* pages and also work in ways to get content faster, like prefetching via P2P and making it work almost without using the network (i.e. offline).

* *focused on security*: From the above I said we pretend to use P2P, so I can't let any security breach open. We are already using HTTPS (with CloudFlare in Full mode, that's why we choose GitHub pages) and we will use Content Security Policy, WebCrypto and Service Workers. In special this last one will be used to load signed versions of the code and to check if the application isn't being updated in other ways than the expected. Also the Service Worker will generate, in deterministic way, auditable standalone pages that can be downloaded either if the user wants or if a security condition is broken.

It is a work from some years ago and I expect that it finally ends. Also I expect that it can inspire new Web APIs for security, so in future will be not be necessary a Service Worker to deploy signed versions of javascript code, advanced users will control how their applications are updating and verity integrity if they already use PGP or other privacy related tool. Those are some ideas, with I think that I will be rejected by most contribuitors from WebAPIs so I'm trying to apply those with the tools we have now.

## Note about the content:
The project aims to use Bible content but currently don't have any. For testing and beta versions we can use random content (like lorem ipsum) but will be a lot helpful if is possible to form a partnership with someone that owns a Bible website to provide real content.

Contributing
============

Welcome, so you are thinking about contributing to KConnect Search ? Awesome, this a great place to start.

Setup
-----

You need to have `Node.js`, `npm` and `gulp` installed.

Then:

```
$ npm install
```

Test
----

```
$ npm test
```

Run locally
-----------

```
$ gulp serve
```

This will open a server at http://localhost:3000 and a tab will be opened in your browser with the current address.
Any changes made in the code will refresh the page.

Version release checklist
-------------------------

* Edit `package.json` to update the tag.
* Edit the `CHANGELOG` and fill it with all the closed items in the current milestone.
* If the version change is major or minor:
 * In _localise_, add a new tag with the new version number. From `v2.1.3` to `v2.2.0`, the tag name will be `v2.2.*`.
 * select all the assets needed to this version and tag them with the new tag.
 * In `gulpfile.babel.js`, edit `TAG` to the newly created tag.
* `tag` the project in its current form.
* Release in gitHub the new `tag`. In the description, add a link to the current Changelog.

License
-------

Apache License 2.0

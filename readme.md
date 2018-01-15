# NPM-SYNC
----

command line tool to develop npm packages while using them on other projects.

## What this command does

- builds npm package with `npm pack` 
- syncs package with module folder in $DESTINATION/node_modules/$PACKAGE_NAME
- updates destination package.json alongside

# Usage:

```bash
# from inside npm module project
npm-sync ../other-module
```
[![Build Status](https://travis-ci.com/mateodelnorte/meta-exec.svg?branch=master)](https://travis-ci.com/mateodelnorte/meta-exec)

# meta-exec

Allows arbitrary commands to be executed against all projects that make up the meta repo.

For example, to show `git status` of all projects:

```
meta exec "git status"
```
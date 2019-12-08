shougun-cli
===========

Take command of your media

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/shougun-cli.svg)](https://npmjs.org/package/shougun-cli)
[![Downloads/week](https://img.shields.io/npm/dw/shougun-cli.svg)](https://npmjs.org/package/shougun-cli)
[![License](https://img.shields.io/npm/l/shougun-cli.svg)](https://github.com/dhleong/shougun-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g @shougun/cli
$ shougun COMMAND
running command...
$ shougun (-v|--version|version)
@shougun/cli/0.1.0 darwin-x64 node-v11.15.0
$ shougun --help [COMMAND]
USAGE
  $ shougun COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`shougun borrow [PATH]`](#shougun-borrow-path)
* [`shougun help [COMMAND]`](#shougun-help-command)
* [`shougun play [QUERY]`](#shougun-play-query)
* [`shougun recommend`](#shougun-recommend)
* [`shougun return`](#shougun-return)
* [`shougun search [QUERY]`](#shougun-search-query)

## `shougun borrow [PATH]`

Copy files for local playback

```
USAGE
  $ shougun borrow [PATH]

ARGUMENTS
  PATH  Where to save the downloaded videos

OPTIONS
  -h, --help             show CLI help
  -s, --server=server    ip:port to connect to
  -t, --timeout=timeout  in seconds

EXAMPLE
  $ borrow
```

_See code: [src/commands/borrow.ts](https://github.com/dhleong/shougun-cli/blob/v0.1.0/src/commands/borrow.ts)_

## `shougun help [COMMAND]`

display help for shougun

```
USAGE
  $ shougun help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `shougun play [QUERY]`

Play by title

```
USAGE
  $ shougun play [QUERY]

OPTIONS
  -h, --help             show CLI help
  -s, --server=server    ip:port to connect to
  -t, --timeout=timeout  in seconds

EXAMPLE
  $ play the good place
```

_See code: [src/commands/play.ts](https://github.com/dhleong/shougun-cli/blob/v0.1.0/src/commands/play.ts)_

## `shougun recommend`

Fetch recommendations

```
USAGE
  $ shougun recommend

OPTIONS
  -h, --help             show CLI help
  -p, --print            print results to stdout instead of casting
  -s, --server=server    ip:port to connect to
  -t, --timeout=timeout  in seconds

EXAMPLE
  $ recommend
```

_See code: [src/commands/recommend.ts](https://github.com/dhleong/shougun-cli/blob/v0.1.0/src/commands/recommend.ts)_

## `shougun return`

Return watched data after borrowing

```
USAGE
  $ shougun return

OPTIONS
  -h, --help             show CLI help
  -s, --server=server    ip:port to connect to
  -t, --timeout=timeout  in seconds

EXAMPLE
  $ return
```

_See code: [src/commands/return.ts](https://github.com/dhleong/shougun-cli/blob/v0.1.0/src/commands/return.ts)_

## `shougun search [QUERY]`

Search for available titles

```
USAGE
  $ shougun search [QUERY]

OPTIONS
  -h, --help             show CLI help
  -s, --server=server    ip:port to connect to
  -t, --timeout=timeout  in seconds

EXAMPLE
  $ search the good place
```

_See code: [src/commands/search.ts](https://github.com/dhleong/shougun-cli/blob/v0.1.0/src/commands/search.ts)_
<!-- commandsstop -->

shougun-cli
===========

Take command of your media

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@shougun/cli.svg)](https://www.npmjs.com/package/@shougun/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@shougun/cli.svg)](https://www.npmjs.com/package/@shougun/cli)
[![License](https://img.shields.io/npm/l/@shougun/cli.svg)](https://github.com/dhleong/shougun-cli/blob/master/package.json)

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
@shougun/cli/0.3.1 darwin-x64 node-v11.15.0
$ shougun --help [COMMAND]
USAGE
  $ shougun COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`shougun borrow [PATH]`](#shougun-borrow-path)
* [`shougun cast [PATH]`](#shougun-cast-path)
* [`shougun help [COMMAND]`](#shougun-help-command)
* [`shougun play [QUERY]`](#shougun-play-query)
* [`shougun prefs [QUERY]`](#shougun-prefs-query)
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

_See code: [src/commands/borrow.ts](https://github.com/dhleong/shougun-cli/blob/v0.3.1/src/commands/borrow.ts)_

## `shougun cast [PATH]`

Play by file path

```
USAGE
  $ shougun cast [PATH]

OPTIONS
  -h, --help               show CLI help
  -l, --language=language  preferred audio language
  -s, --server=server      ip:port to connect to
  -t, --timeout=timeout    in seconds
  --start-time=time        in seconds

EXAMPLE
  $ cast ~/shows/the.good.place.mp4
```

_See code: [src/commands/cast.ts](https://github.com/dhleong/shougun-cli/blob/v0.3.1/src/commands/cast.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `shougun play [QUERY]`

Play by title

```
USAGE
  $ shougun play [QUERY]

OPTIONS
  -h, --help               show CLI help
  -l, --language=language  preferred audio language
  -s, --server=server      ip:port to connect to
  -t, --timeout=timeout    in seconds

  --episode=episode        The episode number to play. If `season` is not also provided, plays this episode of the first
                           season.

  --season=season          The season number to play. If `episode` is not also provided, plays the first episode of that
                           season.

  --start-time=time        in seconds

EXAMPLES
  $ play the good place
  $ play --season 2 the good place
  $ play --season 2 --episode 3 the good place
  $ play --episode 9 the good place
```

_See code: [src/commands/play.ts](https://github.com/dhleong/shougun-cli/blob/v0.3.1/src/commands/play.ts)_

## `shougun prefs [QUERY]`

Get or set prefs. Omit all flags to view

```
USAGE
  $ shougun prefs [QUERY]

OPTIONS
  -h, --help               show CLI help
  -l, --language=language  preferred audio language
  -s, --server=server      ip:port to connect to
  -t, --timeout=timeout    in seconds
  --clear                  If set, remove all preferences

EXAMPLES
  $ prefs the good place
  $ prefs the good place --language en
  $ prefs --clear the good place
```

_See code: [src/commands/prefs.ts](https://github.com/dhleong/shougun-cli/blob/v0.3.1/src/commands/prefs.ts)_

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

_See code: [src/commands/recommend.ts](https://github.com/dhleong/shougun-cli/blob/v0.3.1/src/commands/recommend.ts)_

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

_See code: [src/commands/return.ts](https://github.com/dhleong/shougun-cli/blob/v0.3.1/src/commands/return.ts)_

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

_See code: [src/commands/search.ts](https://github.com/dhleong/shougun-cli/blob/v0.3.1/src/commands/search.ts)_
<!-- commandsstop -->

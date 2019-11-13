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
$ npm install -g shougun-cli
$ shougun COMMAND
running command...
$ shougun (-v|--version|version)
shougun-cli/0.1.0 darwin-x64 node-v10.17.0
$ shougun --help [COMMAND]
USAGE
  $ shougun COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`shougun help [COMMAND]`](#shougun-help-command)
* [`shougun rpc`](#shougun-rpc)
* [`shougun search [QUERY]`](#shougun-search-query)

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

## `shougun rpc`

```
USAGE
  $ shougun rpc

OPTIONS
  -h, --help             show CLI help
  -s, --server=server    ip:port to connect to
  -t, --timeout=timeout  in seconds
```

_See code: [src/commands/rpc.ts](https://github.com/dhleong/shougun-cli/blob/v0.1.0/src/commands/rpc.ts)_

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

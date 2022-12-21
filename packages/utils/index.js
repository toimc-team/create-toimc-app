import { GIT_BASE, GIT_TYPE, GIT_NAME } from './lib/constant.js'
import {
  hasYarn,
  hasProjectYarn,
  hasPnpmVersionOrLater,
  hasPnpm3OrLater,
  hasProjectPnpm,
  hasProjectNpm,
  hasGit,
  hasProjectGit
} from './lib/env.js'
import { getRepoList, getTagList } from './lib/http.js'
import { log, info, done, warn, error, clearConsole } from './lib/log.js'
import {
  logWithSpinner,
  stopSpinner,
  pauseSpinner,
  resumeSpinner,
  failSpinner
} from './lib/spinner.js'
import chalk from 'chalk'
import execa from 'execa'
import semver from 'semver'

// exports.chalk = require('chalk')
// exports.execa = require('execa')
// exports.semver = require('semver')

export {
  GIT_BASE,
  GIT_TYPE,
  GIT_NAME,
  logWithSpinner,
  stopSpinner,
  pauseSpinner,
  resumeSpinner,
  failSpinner,
  getRepoList,
  getTagList,
  hasYarn,
  hasProjectYarn,
  hasPnpmVersionOrLater,
  hasPnpm3OrLater,
  hasProjectPnpm,
  hasProjectNpm,
  hasGit,
  hasProjectGit,
  log,
  info,
  done,
  warn,
  error,
  clearConsole,
  chalk,
  execa,
  semver
}

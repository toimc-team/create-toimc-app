import path from 'node:path'

import { program } from 'commander'
// import requiredVersion from '../package.json'

import { semver, chalk } from '@create-toimc-app/utils'

import { getPackage, create } from './create.js'

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(
      chalk.red(
        'You are using Node ' +
          process.version +
          ', but this version of ' +
          id +
          ' requires Node ' +
          wanted +
          '.\nPlease upgrade your Node version.'
      )
    )
    process.exit(1)
  }
}

function registerCommand() {
  // 创建项目
  program
    .command('create [name]')
    .description('create a new project powered by cli')
    .option('-f, --force', 'overwrite target directory if it exist')
    .option('-p, --proxy <proxyUrl>', 'Use specified proxy when creating project')
    .option(
      '-m, --packageManager <command>',
      'Use specified npm client when installing dependencies'
    )
    .option('-g, --git', 'Force git initialization')
    .option('-n, --no-git', 'Skip git initialization')
    .action((name, options) => {
      // --git makes commander to default git to true
      if (process.argv.includes('-g') || process.argv.includes('--git')) {
        options.forceGit = true
      }
      // require('./create.js')(name, options)
      create(name, options)
    })

  program.command('test').action(() => {
    // require('./test.js')()
  })

  // 获取版本号
  program.version(`${getPackage().name} v${getPackage().version}`).usage('<command> [option]')

  program.parse(process.argv)
}

function index() {
  checkNodeVersion(getPackage().engines.node, 'cli')
  registerCommand()
}

export default index

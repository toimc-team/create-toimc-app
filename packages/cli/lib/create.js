// const path = require('path');
// const fs = require('fs-extra');
// const inquirer = require('inquirer');
// const validateProjectName = require('validate-npm-package-name');
// const generator = require('./generator');
// const { chalk, clearConsole } = require('@create-toimc-app/utils');
import path from 'node:path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import validateProjectName from 'validate-npm-package-name'
import generator from './generator.js'
import { chalk, clearConsole } from '@create-toimc-app/utils'

import fse from 'fs-extra'

import { dirname } from 'dirname-filename-esm'

const __dirname = dirname(import.meta)

export function getPackage() {
  const pkgPath = path.resolve(__dirname, '../package.json')
  const requiredVersion = fse.readJsonSync(pkgPath)
  return requiredVersion
}

/**
 * 创建项目
 * @param {*} name 项目名称
 * @param {*} options 选项
 * @returns
 */
export async function create(name, options) {
  if (options.proxy) {
    process.env.HTTP_PROXY = options.proxy
  }

  const cwd = process.cwd()
  const targetDir = path.join(cwd, name)
  const checkName = validateProjectName(name)
  if (!checkName.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`))
    checkName.errors &&
      checkName.errors.forEach((err) => {
        console.error(chalk.red.dim('Error: ' + err))
      })
    checkName.warnings &&
      checkName.warnings.forEach((warn) => {
        console.error(chalk.red.dim('Warning: ' + warn))
      })
    return
  }

  const cliVersion = getPackage().version
  await clearConsole(chalk.bold.blue(`CLI v${cliVersion}`))

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
      await fs.remove(targetDir)
    } else {
      const params = [
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${targetDir} already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Merge', value: 'merge' },
            { name: 'Cancel', value: false }
          ]
        }
      ]
      let data = await inquirer.prompt(params)
      if (!data.action) {
        return
      } else if (data.action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
        await fs.remove(targetDir)
      }
    }
  }

  await generator(name, options, targetDir)
}

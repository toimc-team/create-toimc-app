const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const validateProjectName = require("validate-npm-package-name");
const generator = require("./generator");
const { chalk, clearConsole } = require("utils");

/**
 * 创建项目
 * @param {*} name 项目名称
 * @param {*} options 选项
 * @returns
 */
module.exports = async function (name, options) {
  if (options.proxy) {
    process.env.HTTP_PROXY = options.proxy;
  }

  const cwd = process.cwd();
  const targetDir = path.join(cwd, name);
  const checkName = validateProjectName(name);
  if (!checkName.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`));
    checkName.errors &&
      checkName.errors.forEach((err) => {
        console.error(chalk.red.dim("Error: " + err));
      });
    checkName.warnings &&
      checkName.warnings.forEach((warn) => {
        console.error(chalk.red.dim("Warning: " + warn));
      });
    return;
  }

  const cliVersion = require("../package.json").version;
  await clearConsole(chalk.bold.blue(`CLI v${cliVersion}`));

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
      await fs.remove(targetDir);
    } else {
      const params = [
        {
          name: "action",
          type: "list",
          message: `Target directory ${targetDir} already exists. Pick an action:`,
          choices: [
            { name: "Overwrite", value: "overwrite" },
            { name: "Merge", value: "merge" },
            { name: "Cancel", value: false },
          ],
        },
      ];
      let data = await inquirer.prompt(params);
      if (!data.action) {
        return;
      } else if (data.action === "overwrite") {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
        await fs.remove(targetDir);
      }
    }
  }

  await generator(name, options, targetDir);
};

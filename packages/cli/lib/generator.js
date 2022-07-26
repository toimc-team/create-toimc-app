const inquirer = require('inquirer');
// const util = require("util");
const path = require('path');
const downloadGitRepo = require('download-git-repo');
const {
  logWithSpinner,
  stopSpinner,
  failSpinner,
  chalk,
  execa,
  hasProjectNpm,
  hasYarn,
  hasProjectYarn,
  hasPnpm3OrLater,
  hasProjectPnpm,
  hasGit,
  hasProjectGit,
  getRepoList,
  getTagList,
  GIT_NAME,
} = require('@create-toimc-app/utils');

const shouldInitGit = (cliOptions) => {
  if (!hasGit()) {
    return false;
  }
  // --git
  if (cliOptions.forceGit) {
    return true;
  }
  // --no-git
  if (cliOptions.git === false || cliOptions.git === 'false') {
    return false;
  }
  // default: true unless already in a git repo
  return !hasProjectGit(this.context);
};

// 获取并选择模板
async function getRepo() {
  logWithSpinner(`Fetching template...`);
  const repoList = await getRepoList();
  stopSpinner();
  if (!repoList) return;
  const repos = repoList.map((item) => item.name);
  const { repo } = await inquirer.prompt({
    name: 'repo',
    type: 'list',
    choices: repos,
    message: ' Please choose a template to create project',
  });
  return repo;
}

// 获取tags
async function getTag(repo) {
  logWithSpinner(`Fetching version...`);
  const tags = await getTagList(repo);
  stopSpinner();
  if (!tags || tags.length === 0) return '';
  const tagsList = tags.map((item) => item.name);
  const { tag } = await inquirer.prompt({
    name: 'tag',
    type: 'list',
    choices: tagsList,
    message: ' Place choose a tag to create project',
  });
  return tag;
}

// 下载
async function download(repo, tag, targetDir) {
  const requestUrl = `${GIT_NAME}/${repo}${tag ? '#' + tag : ''}`;
  logWithSpinner(`Downloading template...`);
  let res = await new Promise((resolve, reject) => {
    downloadGitRepo(
      requestUrl,
      path.resolve(process.cwd(), targetDir),
      {
        proxy: process.env.HTTP_PROXY || '',
      },
      (err) => {
        if (err) {
          failSpinner(' Downloading failed: \n' + err.message);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
  stopSpinner();
  return res;
}

// 安装依赖
async function install(cwd, pm) {
  logWithSpinner(`Installing dependencies...`);

  let packageManager;
  if (pm) {
    packageManager = pm;
  } else if (cwd) {
    if (hasProjectYarn(cwd)) {
      packageManager = 'yarn';
    } else if (hasProjectPnpm(cwd)) {
      packageManager = 'pnpm';
    } else if (hasProjectNpm(cwd)) {
      packageManager = 'npm';
    } else {
      packageManager =
        (hasYarn() ? 'yarn' : null) || (hasPnpm3OrLater() ? 'pnpm' : 'npm');
    }
  }

  let installRes = await new Promise(async (resolve, reject) => {
    try {
      await execa(pm || 'npm', ['install', '--loglevel', 'error'], { cwd });
      // process.stdout.write(stdout);
      resolve();
    } catch (e) {
      failSpinner('Installing failed: \n' + e);
      reject(e);
    }
  });
  stopSpinner();
  return installRes;
}

async function generator(projectName, cliOptions, targetDir) {
  console.log(`✨  Creating project in ${chalk.yellow(targetDir)}.\n`);
  const repo = await getRepo();
  if (repo) {
    const tag = await getTag(repo);
    const dres = await download(repo, tag, targetDir);
    if (dres === true) {
      // 初始化git
      if (shouldInitGit(cliOptions)) {
        logWithSpinner(`Initializing git repository...`);
        await execa('git init', [], { cwd: targetDir });
        stopSpinner();
      }

      await install(targetDir, cliOptions.packageManager);

      console.log(
        `\r\n🎉  Successfully created project ${chalk.yellow(projectName)}.`
      );
      console.log(
        `👉  Get started with the following commands:\n\n` +
          chalk.cyan(` ${chalk.gray('$')} cd ${projectName}\n`) +
          chalk.cyan(` ${chalk.gray('$')} npm run serve`)
      );
    }
  }
}

module.exports = generator;

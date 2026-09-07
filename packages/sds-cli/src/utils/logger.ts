import chalk from 'chalk';

export const logger = {
  info: (message: string) => {
    console.log(chalk.blue('ℹ'), message);
  },
  success: (message: string) => {
    console.log(chalk.green('✓'), message);
  },
  warning: (message: string) => {
    console.log(chalk.yellow('⚠'), message);
  },
  error: (message: string) => {
    console.log(chalk.red('✖'), message);
  },
  banner: () => {
    console.log();
    console.log(chalk.cyan.bold('   ╔═══════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('   ║   🎨 Super Design System Creator      ║'));
    console.log(chalk.cyan.bold('   ║   Create production-ready apps        ║'));
    console.log(chalk.cyan.bold('   ╚═══════════════════════════════════════╝'));
    console.log();
  },
  nextSteps: (projectName: string, packageManager: string) => {
    console.log();
    console.log(chalk.green.bold('🎉 Success!'), `Created ${projectName}`);
    console.log();
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.gray('  cd'), projectName);
    console.log(chalk.gray(`  ${packageManager}`), packageManager === 'npm' ? 'run dev' : 'dev');
    console.log();
    console.log(chalk.cyan('Happy coding! 🚀'));
    console.log();
  },
};

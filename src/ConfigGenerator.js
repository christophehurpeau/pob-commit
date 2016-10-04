import { writeFileSync } from 'fs';
import inquirer from 'inquirer';
import notification from './notifications';

class ConfigGenerator {
  constructor(configPath) {
    return inquirer
      .prompt(this.getQuestions())
      .then(this.handleAnswers(configPath))
      .then(this.generate)
      .then(() => {
        notification.success('Whoo! Config file generated');
      })
      .catch(() => { 
        notification.failure('Oops! Could not generate config file'); 
      });
  }

  getQuestions() {
    return [
      {
        name: 'createConfig',
        message: 'Do you want to create config file ?',
        type: 'confirm',
        default: true,
      },
      {
        name: 'preset',
        message: 'Which preset do you want to use ?',
        type: 'list',
        default: 'karma',
        when: this.shouldAskForPreset,
        choices: [
          { name: 'karma: <type>(<scope>): <subject>', short: 'karma', value: 'karma' },
        ],
      }
    ];
  }

  shouldAskForPreset({ createConfig }) {
    return createConfig;
  }

  handleAnswers(configPath) {
    return ({ createConfig, preset }) => {
      if (createConfig) {
        return { preset, configPath };
      }
    }
  }

  generate({ configPath, preset }) {
    const template = `
module.exports = {
  preset: '${preset}',
  questions: [],
  processAnswers: (answers, firstLine) => firstLine,
};
    `;

    writeFileSync(configPath, template);
  }
}

export default ConfigGenerator;

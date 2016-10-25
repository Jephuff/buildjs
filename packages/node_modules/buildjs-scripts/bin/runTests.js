const jestConfig = require('@ncigdc/jest-config-buildjs');
const jest = require('jest');

const argv = ['--config', JSON.stringify(jestConfig())];

if (process.env.TEST_ENV === 'watch') {
  argv.push('--watch');
} else if (process.env.TEST_ENV === 'ci') {
  argv.push('--bail');
  argv.push('--coverage');
}

jest.run(argv);

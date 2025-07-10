const getScopes = require('./scripts/get-scopes')

const scopesOptions = getScopes().map(item => ({
  name: item
}))

module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    { value: 'style', name: 'style:    Code style changes (formatting, etc)' },
    { value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature' },
    { value: 'perf', name: 'perf:     A code change that improves performance' },
    { value: 'test', name: 'test:     Adding missing tests or correcting existing tests' },
    { value: 'chore', name: 'chore:    Changes to the build process or auxiliary tools' },
    { value: 'build', name: 'build:    Changes that affect the build system or external dependencies' },
    { value: 'ci', name: 'ci:       Changes to CI configuration files and scripts' },
  ],
  scopes: scopesOptions,
  allowCustomScopes: false,  // 不允许自定义 scope，只能选已有的
};

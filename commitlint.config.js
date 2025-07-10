const getScopes = require('./scripts/get-scopes')

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [2, 'never'],
    'scope-enum': [2, 'always', getScopes()],
  },
};

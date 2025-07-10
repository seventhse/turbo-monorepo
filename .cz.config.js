const getScopes = require('./scripts/get-scopes')

const scopesOptions = getScopes().map(item => ({
  name: item
}))

module.exports = {
  scopes: scopesOptions,
  allowCustomScopes: false,  // 不允许自定义 scope，只能选已有的
};

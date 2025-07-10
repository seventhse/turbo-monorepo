const { readdirSync } = require('fs');
const { join } = require('path');

// 动态读取 apps 和 packages 子目录名作为 scope
module.exports = function getScopes() {
  const dirs = ['apps', 'packages'];
  const scopes = [];

  for (const dir of dirs) {
    const fullDir = join(__dirname, dir);
    try {
      const entries = readdirSync(fullDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          scopes.push(entry.name);
        }
      }
    } catch (err) {
      // 路径不存在也跳过
    }
  }

  return ['repo', ...scopes];
}

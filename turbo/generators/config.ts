import type { PlopTypes } from '@turbo/gen';
import path from "node:path"
import fs from "node:fs"
import newPkg from './templates/new-pkg';

function registerPartials(plop: PlopTypes.NodePlopAPI, dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      registerPartials(plop, full);                 // 递归子目录
    } else if (entry.isFile() && entry.name.endsWith('.hbs')) {
      const name = path.basename(entry.name, '.hbs'); // 文件名去掉 .hbs
      const content = fs.readFileSync(full, 'utf8');
      plop.addPartial(name, content);
    }
  }
}

export default function generator(plop: PlopTypes.NodePlopAPI) {
  registerPartials(plop, path.join(__dirname, 'templates', 'partials'));
  newPkg(plop)
}

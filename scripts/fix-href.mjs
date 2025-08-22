import fs from 'fs';
import path from 'path';
import { Project, SyntaxKind } from 'ts-morph';

const SRC_DIRS = ['pages','components'];
const project = new Project({ skipAddingFilesFromTsConfig: true });

function addFiles(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) addFiles(p);
    else if (/\.(t|j)sx?$/.test(name)) project.addSourceFileAtPath(p);
  }
}
SRC_DIRS.filter(fs.existsSync).forEach(addFiles);

let changed = 0;
project.getSourceFiles().forEach(sf => {
  let dirty = false;

  // 1) <Link href="/applications/[id]"> → <Link href={`/applications/${id}`}> if "id" is in scope
  sf.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach(attr => {
    if (attr.getName() !== 'href') return;
    const init = attr.getInitializer();
    if (!init) return;
    const text = init.getText().replaceAll(/^\{|\}$/g,'');
    const m = text.match(/^["'`]\/applications\/\[id\]["'`]$/);
    if (m) {
      // Find a nearby "id" identifier in scope; if not found, annotate.
      const idInScope = !!sf.getDescendantsOfKind(SyntaxKind.Identifier).find(i => i.getText() === 'id');
      if (idInScope) {
        attr.setInitializer('{`/applications/${id}`}');
      } else {
        attr.setInitializer('{/* TODO: supply real id */ `/applications/[id]`}');
      }
      dirty = true;
      changed++;
    }
  });

  // 2) router.push("/applications/[id]") → router.push(`/applications/${id}`)
  sf.forEachDescendant(node => {
    if (node.getKind() !== SyntaxKind.CallExpression) return;
    const call = node;
    const expr = call.getExpression().getText();
    if (expr !== 'router.push') return;
    const args = call.getArguments();
    if (args.length === 1 && args[0].getKind() === SyntaxKind.StringLiteral) {
      const val = args[0].getText().slice(1, -1);
      if (val === '/applications/[id]') {
        const idInScope = !!sf.getDescendantsOfKind(SyntaxKind.Identifier).find(i => i.getText() === 'id');
        if (idInScope) {
          args[0].replaceWithText('`/applications/${id}`');
        } else {
          args[0].replaceWithText('/* TODO: supply real id */ "/applications/[id]"');
        }
        dirty = true;
        changed++;
      }
    }
    // 3) router.push({ pathname:'/applications/[id]' }) → add missing query if absent
    if (args.length === 1 && args[0].getKind() === SyntaxKind.ObjectLiteralExpression) {
      const obj = args[0];
      const pathnameProp = obj.getProperty('pathname');
      if (pathnameProp && pathnameProp.getText().includes('/applications/[id]')) {
        const queryProp = obj.getProperty('query');
        if (!queryProp) {
          obj.addPropertyAssignment({ name: 'query', initializer: '{ id }' });
          dirty = true; changed++;
        }
      }
    }
  });

  if (dirty) sf.saveSync();
});

console.log(`fix-href: updated ${changed} occurrence(s)`);

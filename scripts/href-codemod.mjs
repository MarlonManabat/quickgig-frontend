#!/usr/bin/env node
import { Project, SyntaxKind } from 'ts-morph';
import path from 'path';
import fs from 'fs';

const project = new Project({
  tsConfigFilePath: path.resolve('tsconfig.json'),
  skipAddingFilesFromTsConfig: false,
});

const SRC_GLOBS = ['{app,src,components,pages}/**/*.{ts,tsx}'];

for (const g of SRC_GLOBS) project.addSourceFilesAtPaths(g);

let edits = 0;

// Replace <Link href="/applications/[id]"> with <LinkSafe href="/applications/[id]" params={{id}}>
// Replace router.push('/applications/[id]') with safePush(router, '/applications/[id]', { id })
project.getSourceFiles().forEach(sf => {
  let modified = false;

  // 1) Fix next/link usages with dynamic segments without params
  sf.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
    .concat(sf.getDescendantsOfKind(SyntaxKind.JsxOpeningElement))
    .forEach(el => {
      const name = el.getTagNameNode().getText();
      if (name !== 'Link') return;
      const hrefAttr = el.getAttributes().find(a => a.getKind() === SyntaxKind.JsxAttribute && a.getNameNode().getText() === 'href');
      if (!hrefAttr) return;
      const init = hrefAttr.getInitializer();
      if (!init) return;
      const text = init.getText().replace(/^['\"`]|['\"`]$/g,'');
      if (/\[[^\]/]+?\]/.test(text) && !el.getAttributes().some(a => a.getKind() === SyntaxKind.JsxAttribute && (a.getNameNode().getText() === 'as' || a.getNameNode().getText() === 'params'))) {
        // Swap Link -> LinkSafe and add params placeholder
        el.getTagNameNode().replaceWithText('LinkSafe');
        const first = el.getAttributes()[0];
        el.insertAttribute(first ? el.getAttributes().indexOf(first)+1 : 0, { kind: SyntaxKind.JsxAttribute, name: 'params', initializer: '{{ /* TODO: supply params */ }}'});
        // Add import if missing
        const imp = sf.getImportDeclarations().find(d => d.getModuleSpecifierValue() === '@/components/LinkSafe');
        if (!imp) sf.addImportDeclaration({ moduleSpecifier: '@/components/LinkSafe', defaultImport: 'LinkSafe' });
        edits++; modified = true;
      }
    });

  // 2) Fix router.push template strings with dynamic segments and unknown params
  sf.getDescendantsOfKind(SyntaxKind.CallExpression).forEach(call => {
    const exp = call.getExpression().getText();
    if (!/router\.push/.test(exp)) return;
    const [arg] = call.getArguments();
    if (!arg) return;
    const raw = arg.getText().replace(/^['\"`]|['\"`]$/g,'');
    if (/\[[^\]/]+?\]/.test(raw)) {
      call.replaceWithText(`safePush(router, '${raw}', {/* TODO: supply params */})`);
      // ensure import
      const hasImp = sf.getImportDeclarations().some(d => d.getModuleSpecifierValue() === '@/utils/safeNav');
      if (!hasImp) sf.addImportDeclaration({ moduleSpecifier: '@/utils/safeNav', namedImports: ['safePush'] });
      edits++; modified = true;
    }
  });

  if (modified) sf.saveSync();
});

if (edits) {
  const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
  if (!pkg.dependencies && !pkg.devDependencies) {}
  console.log(`[href-codemod] Edits: ${edits}`);
} else {
  console.log('[href-codemod] No issues found.');
}

const path = require("path");

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, "src");
  const currentDir = path.dirname(file.path);

  root.find(j.ImportDeclaration).forEach((p) => {
    const value = p.node.source.value;

    if (!value.startsWith(".")) return;

    const absolute = path.resolve(currentDir, value);

    if (!absolute.startsWith(srcDir)) return;

    let alias = path.relative(srcDir, absolute);

    alias = alias.replace(/\\/g, "/");

    p.node.source.value = "@/" + alias;
  });

  return root.toSource({
    quote: "double",
  });
};
module.exports = ({ className, methodName, args }) => `
${ className }.${ methodName }(${ args.map((arg, i) => `\${${ i + 1 }:${ arg }}`).join(', ') }, \${${ args.length + 1 }:callback});
`.trim();
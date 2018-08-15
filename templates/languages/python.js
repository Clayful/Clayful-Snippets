module.exports = ({ className, methodName, args }) => `
result = ${ className }.${ methodName }(${ args.map((arg, i) => `\${${ i + 1 }:${ arg }}`).join(', ') })
`.trim();
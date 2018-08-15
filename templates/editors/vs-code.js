const scopify = scope => {

	if (scope === 'js' || scope === 'node') {
		return 'javascript';
	}

	return scope;

};

module.exports = details => `
{
${details.map(({ trigger, template, scope, description }) => `
	"${description}": {
		"prefix": "${trigger}",
		"scope": "${scopify(scope)}",
		"body": [
			${
				template
					.split('\n')
					.map(s => `"${s}"`)
					.join(',\n')
			}
		],
		"description": "${description}"
	}`).join(',')}
}
`;
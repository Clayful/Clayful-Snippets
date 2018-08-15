const scopify = scope => {

	if (scope === 'node') {
		scope = 'js';
	}

	return `.source.${scope}`;
};

module.exports = details => `
'${scopify(details[0].scope)}':
${details.map(({ trigger, template, scope, description }) => `
	'${description}':
		'prefix': '${trigger}'
		'body': """
			${template}
		"""
`).join('')}
`.trim();
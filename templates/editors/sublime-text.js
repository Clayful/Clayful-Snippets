const scopify = scope => {

	if (scope === 'node') {
		scope = 'js';
	}

	return `source.${scope}`;
};

module.exports = ({ trigger, template, scope, description }) => `
<snippet>
	<content><![CDATA[
${template}
]]></content >
	<description>${description}</description>
	<tabTrigger>${trigger}</tabTrigger>
	<scope>${scopify(scope)}</scope>
</snippet >
`.trim();
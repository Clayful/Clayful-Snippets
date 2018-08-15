const glob = require('glob');
const del = require('del');
const write = require('write');
const uniqBy = require('lodash.uniqby');
const snakeCase = require('lodash.snakecase');
const spec = require('clayful-lib-spec').map(d => {

	d.apis = uniqBy(d.apis, 'module');

	return d;

});

const results = {};

const snakeCased = {
	python: true,
	ruby:   true,
};

const methodSeparator = {
	php: '::'
};

const editors = glob.sync('./templates/editors/*.js').map((path) => ({
	name:    path.match(/[\w-]+\.js/)[0].split('.')[0],
	compile: require(path),
}));

const languages = glob.sync('./templates/languages/*.js').map((path) => ({
	name:    path.match(/[\w-]+\.js/)[0].split('.')[0],
	compile: require(path)
}));

del.sync('./build/**');

spec.forEach(({ apis }) => apis.forEach(api => {

	const {
		className,
		method: methodName,
		arguments: args
	} = api;

	if ((api.httpMethod === 'POST' || api.httpMethod === 'PUT') &&
		!api.withoutPayload) {
		args.push('payload');
	}

	args.push('options');

	languages.forEach(({ name: lang, compile }) => {

		const options = { className, methodName, args };

		if (snakeCased[lang]) {
			options.methodName = snakeCase(methodName);
			options.args = args.map(snakeCase);
		}

		const template = compile(options);

		editors.forEach(({ name: editor }) => {

			const trigger = `${ className }${ methodSeparator[lang] || '.' }${ methodName }`;

			const key = `${ editor }.${ lang }`;

			results[key] = (results[key] || []).concat({
				trigger:     trigger,
				template:    template,
				scope:       lang,
				description: trigger,
			});

		});

	});

}));

Object.keys(results).forEach(key => {

	const [editorName, langName] = key.split('.');
	const details = results[key];

	const editor = editors.find(editor => editor.name === editorName);

	if (editor.name === 'sublime-text') {

		details.forEach(detail => {

			const compiled = editor.compile(detail);

			write.sync(`./build/${ editor.name }/clayful-${ langName }/${ snakeCase(detail.trigger) }.sublime-snippet`, compiled);

		});

	}

	if (editor.name === 'vs-code') {

		// Since VSCode requires extra '\' to properly escape '$',
		// we will simply add extra '\' for all occurences.
		const compiled = editor.compile(details).replace(/\\\$/g, '\\\\$');

		write.sync(`./build/${ editor.name }/clayful-${ langName }.code-snippets`, compiled);

	}

	if (editor.name === 'atom') {

		const compiled = editor.compile(details);

		write.sync(`./build/${ editor.name }/clayful-${ langName }.cson`, compiled);

	}


});
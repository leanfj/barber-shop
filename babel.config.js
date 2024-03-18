module.exports = {
	presets: [
		['@babel/preset-env', { targets: { node: 'current' } }],
		['@babel/preset-typescript']
	],
	plugins: [
		[
			'module-resolver',
			{
				alias: {
					'@application': './src/application',
				}
			}
		],
		['@babel/plugin-transform-typescript', { allowDeclareFields: true }]
	]
}

module.exports = {
	entry: {
		index: './src/index.js'
	},
	output: {
		path: __dirname + '/build',
		publicPath: "build/",
		filename: '[name].bundle.js'
	},
	devtool: "#inline-source-map"
}
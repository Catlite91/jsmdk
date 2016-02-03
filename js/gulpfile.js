var gulp = require('gulp'),
    gutil = require("gulp-util"),
    webpack = require('webpack');
   	
var WebpackDevServer = require("webpack-dev-server");

var webpackConfig = require('./webpack.config.js');

var dev_port = 8093;

gulp.task('webpack', function(callback) {
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task("webpack-dev-server", function(callback) {
    // Start a webpack-dev-server
   	var config = Object.create(webpackConfig);

    var compiler = webpack(config);
    new WebpackDevServer(compiler,  {
        contentBase: "./",
        publicPath: "/" + config.output.publicPath,
        stats: {
          colors: true
        }
		}).listen(dev_port, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:" + dev_port + "/webpack-dev-server/index.html");

        // keep the server alive or continue?
        callback();
    });
});

gulp.task('default', ['webpack-dev-server']);
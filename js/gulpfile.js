var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var n2a = require('gulp-native2ascii');
var gls = require('gulp-live-server');

gulp.task('jsmin', function() {
    gulp.src('./src/**/*.js', {
            base: 'src'
        })
        .pipe(gulp.dest('./build'))
        .pipe(n2a({
            reverse: false
        }))
        .pipe(rename(function(path) {
            path.basename += "-min";
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task('server', function() {
    $.connect.server({
        root: './',
        port: 8093,
        livereload: {
            port: 35730
        }
    });
});

gulp.task('default', ['jsmin', 'server']);
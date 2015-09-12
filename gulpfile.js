var gulp = require('gulp');
var path = require('path');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var n2a = require('gulp-native2ascii');

gulp.task('jsmin', function () {
    gulp.src('./src/**/*.js', {
        base: 'src'
    })
        .pipe(gulp.dest('./build'))
        .pipe(n2a({reverse: false}))
        .pipe(rename(function (path) {
            path.basename += "-min";
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task('default', ['jsmin']);

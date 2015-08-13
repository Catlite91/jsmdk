var gulp = require('gulp');
var path = require('path');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var n2a = require('gulp-native2ascii');

//默认本地压缩，若使用服务器端压缩请设为false
var isLocalCompress = true;

/************js相关任务************/
function jsTask() {
    gulp.src('./src/**/*.js', {
        base: 'src'
    })
    .pipe(gulp.dest('./build'))
    .pipe(n2a({reverse: false}))
    .pipe(rename(function(path) {
        path.basename += "-min";
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build'));
}
gulp.task('jsmin', function () {
    jsTask();
});

gulp.task('watch', function () {
    gulp.watch(paths.js, ['jsmin']);
});

gulp.task('default', ['jsmin']);

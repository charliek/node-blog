var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var Combine = require('stream-combiner');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var rename = require('gulp-rename');
var stylish = require('jshint-stylish');
var nodemon = require('gulp-nodemon');

gulp.task('less', function () {
  gulp.src('./client/less/**/*.less')
    .pipe(less())
    .pipe(gulpif(argv.production, minifyCSS()))
	  .pipe(gulp.dest('./public/css'));
});

gulp.task('client-js', function(){
  gulp.src('./client/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(gulpif(argv.production, jshint.reporter('fail')))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('./public/js'));
})

gulp.task('server-js', function(){
  gulp.src('./server/**/*.js')
    .pipe(jshint('.jshintrc-server'))
    .pipe(jshint.reporter(stylish))
    .pipe(gulpif(argv.production, jshint.reporter('fail')))
})

gulp.task('watch', function () {
  var server = ['server'];
  var client = ['client'];
  gulp.watch('client/less/**/*.less', client);
  gulp.watch('client/js/**/*.js', client);
});

gulp.task('demon', function () {
  nodemon({
    script: 'server/index.js',
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function () {
      console.log('restarted!');
    });
});

// gulp build --production
gulp.task('client', ['client-js', 'less'])
gulp.task('server', ['server-js'])
gulp.task('build', ['client', 'server'])
gulp.task('default', ['demon', 'client']);

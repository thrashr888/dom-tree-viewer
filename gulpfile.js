var gulp = require('gulp');
var react = require('gulp-react');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var s3 = require('gulp-s3');
var fs = require('fs');


// Deploy to S3
gulp.task('deploy', ['build'], function() {
    // Example ./aws.json file contents:

    // {
    //     "key": "AKIAI3Z7CUAFHG53DMJA",
    //     "secret": "acYxWRu5RRa6CwzQuhdXEfTpbQA+1XQJ7Z1bGTCx",
    //     "bucket": "dev.example.com",
    //     "region": "eu-west-1"
    // }

    var aws = JSON.parse(fs.readFileSync('./aws.json'));
    var options = { headers: {'Cache-Control': 'max-age=315360000, no-transform, public'} }
    var options = {};
    gulp.src('./dist/**')
        .pipe(s3(aws, options));
});


// Livereload server
gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: true
  });
});
gulp.task('reload', function () {
  gulp.src('./index.html')
    .pipe(connect.reload());
});
gulp.task('watch', function () {
  gulp.watch(['./index.html', './js/*.js', './css/*.css'], ['build', 'reload']);
});


// Move assets to dist during build
gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest('dist'));
});
gulp.task('css', function () {
    return gulp.src('css/*')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});
gulp.task('img', function () {
    return gulp.src('img/*')
        .pipe(gulp.dest('dist/img'));
});
gulp.task('jsx', function () {
    return gulp.src('js/dom-viewer.js')
        .pipe(react())
        .pipe(gulp.dest('dist/js'));
});
gulp.task('scripts', ['jsx'], function() {
    // Build transformed app js with it's React dep
    return gulp.src([
            './node_modules/react/dist/react-with-addons.js',
            'dist/js/dom-viewer.js'
            ])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build', ['html', 'css', 'img', 'scripts']);
gulp.task('default', ['build', 'connect', 'watch']);

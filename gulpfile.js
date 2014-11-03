var gulp = require('gulp');
var react = require('gulp-react');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: true
  });
});


gulp.task('html', function () {
  gulp.src('./index.html')
    .pipe(connect.reload());
});
gulp.task('css', function () {
    return gulp.src('css/main.css')
        .pipe(gulp.dest('dist/css'));
});
gulp.task('img', function () {
    return gulp.src('img/*')
        .pipe(gulp.dest('dist/img'));
});
gulp.task('react', function () {
    return gulp.src('js/dom-viewer.js')
        .pipe(react())
        .pipe(gulp.dest('dist/js'));
});
gulp.task('scripts', function() {
    return gulp.src([
            './node_modules/react/dist/react-with-addons.js',
            'dist/js/dom-viewer.js'
            ])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
gulp.task('build', ['react', 'scripts', 'img', 'css']);


gulp.task('watch', function () {
  gulp.watch(['./index.html', './js/*.js', './css/*.css'], ['build', 'html']);
});


gulp.task('default', ['connect', 'watch']);

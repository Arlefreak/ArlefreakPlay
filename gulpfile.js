"use strict";

var gulp       = require('gulp');
var mbf        = require('main-bower-files');
var concat     = require('gulp-concat');
var jshint     = require('gulp-jshint');
var stylus     = require('gulp-stylus');
var nib        = require('nib');
var connect    = require('gulp-connect');
var cors       = require('cors');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil      = require('gulp-util');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

gulp.task('bower', function() {
    gulp.src(mbf({
            includeDev: true
        }).filter(function(f) {
            return f.substr(-2) === 'js';
        }))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('browserify', function() {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: './src/js/app.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(connect.reload());
});

gulp.task('jshint', function() {
    return gulp.src(['src/js/**/*.js', '!src/js/templates/**/*.js'])
        .pipe(jshint(process.env.NODE_ENV === 'development' ? {
            devel: true
        } : {}))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('stylus', function() {
    gulp.src('src/css/main.styl')
        .pipe(stylus({use:nib(), import:['nib']}))
        .pipe(gulp.dest('public/css/'))
        .pipe(connect.reload());
});

gulp.task('imgmin', function(){
    gulp.src('src/img/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('public/img'))
    .pipe(connect.reload());
})

gulp.task('connect', function() {
    connect.server({
        root: 'public',
        livereload: true,
        middleware: function(){
            return [cors()];
        }
    });
});

gulp.task('html', function() {
    gulp.src('./public/*.html')
        .pipe(connect.reload());
});

gulp.task('watch', ['browserify', 'stylus', 'imgmin','connect'], function() {
    gulp.watch('src/js/**/*.js', ['browserify']);
    gulp.watch('src/css/**/*.styl', ['stylus']);
    gulp.watch('src/img/**/*', ['imgmin']);
    gulp.watch('public/*.html', ['html']);
    // livereload.listen();
    // gulp.watch('public/**').on('change', livereload.changed);
});

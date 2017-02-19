/**
 * Gulp Packages
 */

// General
var gulp = require('gulp');
var fs = require('fs');
var del = require('del');
var lazypipe = require('lazypipe');
var plumber = require('gulp-plumber');
var flatten = require('gulp-flatten');
var tap = require('gulp-tap');
var rename = require('gulp-rename');
var header = require('gulp-header');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var bs = require('browser-sync').create();

// Styles
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-cssnano');

// SVGs
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');

/**
 * Paths to project folders
 */

var paths = {
    input: 'src/**/*',
    output: 'dist/',
    styles: {
        input: 'assets/sass/**/*.{scss,sass}',
        output: 'assets/'
    },
    svgs: {
        input: 'assets/svg/*',
        output: '_includes/'
    },
    images: {
        input: 'assets/img/*',
        output: '_includes/img/'
    },
    html: {
        index: './_site/index.html'
    }
};

/**
 * Gulp Taks
 */

// Process, lint, and minify Sass files
gulp.task('build:styles', ['clean:dist'], function() {
    return gulp.src(paths.styles.input)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true
        }))
        .pipe(flatten())
        .pipe(prefix({
            browsers: ['last 2 version', '> 1%'],
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest(paths.styles.output))
        .pipe(minify({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.output))
        .pipe(bs.stream());
});

// Generate SVG sprites - for files that are not directly under ./src/svg
gulp.task('build:svgs', ['clean:dist'], function() {
    return gulp.src(paths.svgs.input)
        .pipe(plumber())
        .pipe(tap(function(file, t) {
            if (file.isDirectory()) {
                var name = file.relative + '.svg';
                return gulp.src(file.path + '/*.svg')
                    .pipe(svgmin())
                    .pipe(svgstore({
                        fileName: name,
                        prefix: 'icon-',
                        inlineSvg: true
                    }))
                    .pipe(gulp.dest(paths.svgs.output));
            }
        }))
        .pipe(svgmin())
        .pipe(gulp.dest(paths.svgs.output));
});

// Copy image files into output folder
gulp.task('build:images', ['clean:dist'], function() {
    return gulp.src(paths.images.input)
        .pipe(plumber())
        .pipe(gulp.dest(paths.images.output));
});

// Remove pre-existing content from output and test folders
gulp.task('clean:dist', function() {
    del.sync([
        paths.output
    ]);
});

// Spin up livereload server and listen for file changes
gulp.task('listen', function() {
    bs.init({
        server: {
            baseDir: "./_site",
        }
    });
    gulp.watch('./assets/sass/**/*.scss',['compile'])
    gulp.watch(paths.html.index).on('change', bs.reload);
});

/**
 * Task Runners
 */

// Compile files
gulp.task('compile', [
    'clean:dist',
    'build:styles',
    'build:images',
    'build:svgs'
]);

// Compile files and generate docs (default)
gulp.task('default', [
    'compile'
]);

// Compile files and generate docs when something changes
gulp.task('watch', [
    'listen',
    'default'
]);

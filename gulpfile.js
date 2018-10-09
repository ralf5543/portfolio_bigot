'use strict';

// Required
var gulp = require('gulp');
var sass = require('gulp-sass');
var cssbeautify = require('gulp-cssbeautify');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var responsive = require('gulp-responsive');

// Path variables
var source = './src';
var destination = './dist';

// ======================------------------ TASKS


gulp.task('css', function () {
  return gulp.src(source + '/assets/css/*.scss')
      .pipe(sass().on('error', sass.logError))//Convert sass files to css files
      .pipe(cssbeautify({indent: '  '}))
      .pipe(autoprefixer())//adds prefix for old browsers
      .pipe(gulp.dest(destination + '/assets/css/'));
});

//reformat the css code with 2 spaces indents
gulp.task('cssbeautify', function () {
  return gulp.src(source + '/assets/css/*.scss')
      .pipe(cssbeautify({indent: '  '}))
      .pipe(gulp.dest(source + '/assets/css/'));
});

//Minify the css file
gulp.task('minify', function () {
  return gulp.src(destination + '/assets/css/styles.css')
      .pipe(csso())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest(destination + '/assets/css/'));
});

//Update css files each time a sass file is modified
gulp.task('csswatch', function () {
  gulp.watch(source + '/assets/css/*.scss', ['cssbeautify', 'css']);
});


//Generates images at different sizes
gulp.task('images', function () {
  return gulp.src(source + '/assets/img/*.{jpg,png}')
      .pipe(responsive({
        // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
        '*.jpg': [{
          width: 200,
          rename: { suffix: '-200px' },
        }, {
          width: 500,
          rename: { suffix: '-500px' },
        }, {
          width: 630,
          rename: { suffix: '-630px' },
        }, {
          // Compress, strip metadata, and rename original image
          rename: { suffix: '-original' },
        }],
        // Resize all PNG images to be retina ready
        '*.png': [{
          width: 250,
        }, {
          width: 250 * 2,
          rename: { suffix: '@2x' },
        }],
      }, {
        // Global configuration for all images
        // The output quality for JPEG, WebP and TIFF output formats
        quality: 70,
        // Use progressive (interlace) scan for JPEG and PNG output
        progressive: true,
        // Strip all metadata
        withMetadata: false,
      }))
      .pipe(gulp.dest(destination + 'dist/assets/img'));
});







// Build task
gulp.task('build', ['css']);

// Prod task = Build + minify
gulp.task('prod', ['build',  'minify']);

// Defaukt task
gulp.task('default', ['build', 'csswatch']);
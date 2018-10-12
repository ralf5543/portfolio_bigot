'use strict';

// Required
var gulp = require('gulp');
var sass = require('gulp-sass');
var cssbeautify = require('gulp-cssbeautify');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var responsive = require('gulp-responsive');
var postcss = require('gulp-postcss');
const postcssImageSetFunction = require('postcss-image-set-function');


// ======================------------------ TASKS

gulp.task('css', function () {
  return gulp.src('./src/assets/css/styles.scss')
      .pipe(postcss([postcssImageSetFunction()]))
      .pipe(sass().on('error', sass.logError))//Convert sass files to css files
      .pipe(cssbeautify({indent: '  '}))
      .pipe(autoprefixer())//adds prefix for old browsers
      .pipe(gulp.dest('./src/assets/css'));
});

//reformat the css code with 2 spaces indents
gulp.task('cssbeautify', function () {
  return gulp.src('./src/assets/css/*.scss')
      .pipe(cssbeautify({indent: '  '}))
      .pipe(gulp.dest('./src/assets/css/'));
});

//Minify the css file
gulp.task('minify', function () {
  return gulp.src('./src/assets/css/styles.css')
      .pipe(csso())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest('./src/assets/css/'));
});

//Update css files each time a sass file is modified
gulp.task('csswatch', function () {
  gulp.watch('./src/assets/css/*.scss', ['css']);
});

//Generates images at different sizes
gulp.task('images', function () {

  return gulp.src('./src/assets/img/sources/*.{jpg,png}')
      .pipe(responsive({

        // Resize all images to three different sizes: 200, 400, 900 and 1280 pixels, eventually with their retina version (pixel ratio x2 or x3)
        '*': [{
          width: 200,
          height: 100,
          rename: { suffix: '-200px' }
        }, {
          width: 200 * 2,
          height: 100 * 2,
          rename: { suffix: '-200px_2x' }
        }, {
          width: 200 * 3,
          height: 100 * 3,
          rename: { suffix: '-200px_3x' }
        }, {
          width: 400,
          height: 200,
          rename: { suffix: '-400px' }
        }, {
          width: 400 * 2,
          height: 200 * 2,
          rename: { suffix: '-400px_2x' }
        }, {
          width: 400 * 3,
          height: 200 * 3,
          rename: { suffix: '-400px_3x' }
        }, {
          width: 900,
          rename: { suffix: '-900px' }
        }, {
          width: 900 * 2,
          rename: { suffix: '-900px_2x' }
        }, {
          width: 1280,
          rename: { suffix: '-1280px' }
        }, {
          width: 1280 * 2,
          rename: { suffix: '-1280_2xpx' }
        }, {
          // Compress, strip metadata, and rename original image
          rename: { suffix: '-original' }
        }],
      }, {
        // Global configuration for all images
        // The output quality for JPEG, WebP and TIFF output formats
        quality: 70,
        // Use progressive (interlace) scan for JPEG and PNG output
        progressive: true,
        // Strip all metadata
        withMetadata: false,
        withoutEnlargement: true,
        skipOnEnlargement: true, // that option copy original file with/without renaming
        errorOnEnlargement: false,
        crop: 'center'
      }))
      .pipe(gulp.dest('./src/assets/img/generated'));
});

// Build task
gulp.task('build', ['css']);

// Prod task = Build + minify
gulp.task('prod', ['build',  'minify']);

// Defaukt task
gulp.task('default', ['build', 'csswatch']);
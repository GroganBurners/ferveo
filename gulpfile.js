'use strict'

var gulp = require('gulp')
var browserSync = require('browser-sync')
var nodemon = require('gulp-nodemon')
const imagemin = require('gulp-imagemin')
const mozjpeg = require('imagemin-mozjpeg')
const pngquant = require('imagemin-pngquant')

gulp.task('images', () =>
  gulp.src('public/images/**/*')
    .pipe(imagemin(
      [mozjpeg({
        'quality': '60',
        'quantTable': 2
      }),
      pngquant({
        'quality': '60'
      })],

      {
        optimizationLevel: 3,
        progressive: true,
        interlaced: true,
      }))
    .pipe(gulp.dest('public/images'))
)

gulp.task('fa', ['fa-css'], function () {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('public/fonts'))
})

gulp.task('fa-css', function () {
  return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('public/stylesheets'))
})

gulp.task('bs', ['bs-css', 'bs-jquery', 'bs-tether', 'bs-js'], function () {
})

gulp.task('bs-css', function () {
  return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('public/stylesheets'))
})

gulp.task('bs-jquery', function () {
  return gulp.src('node_modules/jquery-slim/dist/jquery.slim.min.js')
    .pipe(gulp.dest('public/javascripts'))
})

gulp.task('bs-tether', function () {
  return gulp.src('node_modules/tether/dist/js/tether.min.js')
    .pipe(gulp.dest('public/javascripts'))
})

gulp.task('bs-js', function () {
  return gulp.src('node_modules/bootstrap/dist/js/bootstrap.min.js')
    .pipe(gulp.dest('public/javascripts'))
})

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    files: ['public/**/*.*'],
    port: 3001
  })
})

gulp.task('nodemon', function (cb) {
  var started = false

  return nodemon({
    exec: 'node --debug',
    script: './bin/www'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb()
      started = true
    }
  }).on('restart', function onRestart() {
    // reload connected browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
    }, 500);
  })
})

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch('config/**/*.js',   ['bs-reload'])
  gulp.watch('models/**/*.js',  ['bs-reload'])
  gulp.watch('controllers/**/*.js',  ['bs-reload'])
  gulp.watch('views/**/*.pug', ['bs-reload'])

  gulp.watch('public/**/*.js',   ['bs-reload'])
  gulp.watch('public/**/*.css',  ['bs-reload'])
});

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
                'quality' : '60',
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
);

gulp.task('default', ['browser-sync'], function () {
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
  })
})

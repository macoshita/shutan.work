const gulp = require('gulp')
const postcss = require('gulp-postcss')
const atImport = require("postcss-import")
const cssnext = require('postcss-cssnext')
const cssnano = require('cssnano')
const pug = require('gulp-pug')
const rev = require("gulp-rev")
const revReplace = require("gulp-rev-replace")
const imagemin = require('gulp-imagemin')
const mozjpeg = require('imagemin-mozjpeg')
const del = require('del')
const runSequence = require('run-sequence')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload;

gulp.task('static', ['static:well-known'], () => {
  return gulp.src('./static/**/*')
    .pipe(gulp.dest('./dist'))
    .pipe(reload({ stream: true }))
})

gulp.task('static:well-known', () => {
  return gulp.src('./static/.well-known/**/*')
    .pipe(gulp.dest('./dist/.well-known'))
})

gulp.task("assets", () => {
  return gulp.src(["assets/**/*"])
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./tmp'))
})

gulp.task('imagemin', () => {
  return gulp.src('./assets/**/*.{jpg,png,gif,svg}')
    .pipe(imagemin([
      mozjpeg()
    ]))
    .pipe(gulp.dest('./assets'))
})

gulp.task('css', () => {
  return gulp.src('./src/main.css')
    .pipe(postcss([
      atImport(),
      cssnext(),
      cssnano({ autoprefixer: false })
    ]))
    .pipe(gulp.dest('./tmp'))
})

gulp.task('pug', ['assets', 'css'], () => {
  let manifest = gulp.src("./tmp/rev-manifest.json")

  return gulp.src('./src/index.pug')
    .pipe(pug())
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('./dist'))
    .pipe(reload({ stream: true }))
});

gulp.task('clean', () => {
  return del([
    './dist',
    './tmp'
  ])
})

gulp.task('build', callback => {
  runSequence('clean', ['static', 'pug'], callback)
})

gulp.task('serve', ['build'], () => {
  browserSync.init({
    server: "./dist"
  })

  gulp.watch(['./src/**/*', './assets/**/*'], ['pug'])
  gulp.watch(['./static/**/*'], ['static'])
})
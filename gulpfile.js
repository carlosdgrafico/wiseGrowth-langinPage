const gulp = require('gulp')
const webserver = require('gulp-webserver')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const watch = require('gulp-watch')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const jade = require('gulp-jade')
const dotenv = require('dotenv')
const awspublish = require('gulp-awspublish');

dotenv.config()

//define base aws config for deploy to S3 Amazon service
const awsConfig = {
  region: process.env.AWS_BUCKET_REGION,
  params: {/*
    Bucket: process.env.AWS_DEPLOY_BUCKET_NAME
  */},
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  httpOptions: {
    timeout: 300000
  }
}

//define publisher for primary bucket
const newParamsPrimary = {
  params: {
    Bucket: process.env.BUCKET_NAME_PRIMARY
  }
}
const configPrimary = Object.assign({}, awsConfig, newParamsPrimary)
const publisherPrimary = awspublish.create(configPrimary);

//define publisher for secondary bucket
const newParamsSecondary = {
  params: {
    Bucket: process.env.BUCKET_NAME_SECONDARY
  }
}
const configSecondary = Object.assign({}, awsConfig, newParamsSecondary)
const publisherSecondary = awspublish.create(configSecondary);

//define base aws params to use in each publisher at deploying moment
const awsStates = {
  states: ['delete', 'create', 'update', 'cache', 'skip']
};

const awsHeaders = {
  'Content-Encoding': 'gzip'
};

gulp.task('s3Primary', () => {
  //TODO: check if exist dist folder
  return gulp.src('./dist/**')
    .pipe(awspublish.gzip())
    .pipe(publisherPrimary.publish(awsHeaders))
    .pipe(publisherPrimary.sync())
    .pipe(awspublish.reporter(awsStates));
})

gulp.task('s3Secondary', () => {
  //TODO: check if exist dist folder
  return gulp.src('./dist/**')
    .pipe(awspublish.gzip())
    .pipe(publisherSecondary.publish(awsHeaders))
    .pipe(publisherSecondary.sync())
    .pipe(awspublish.reporter(awsStates));
})

const config = {
   scss: {
      main:'./app/scss/main.scss',
      watch: './app/scss/**/*.*',
      output: './dist/css',
   },

   jade:{
      watch: './app/*.jade',
      output: './dist'
   },

   js:{
     main: './app/js/main.js',
     watch: './app/js/**/*.js',
     output: './dist/js'
   }
}

gulp.task('templates', () => {
  gulp.src('./app/**/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('js', () => {
  gulp.src('./app/js/**/*.js')
  .pipe(gulp.dest('./dist/js'))
})

gulp.task('concatenar', ['js'], () => {
  gulp.src('./app/js/*.js')
  .pipe(concat('main.js'))
  //.pipe(uglify()) // minificado de js
  .pipe(gulp.dest('./dist/js'))
})

gulp.task('images', function(){
   gulp.src('./app/img/*.{png,jpg,gif,jpeg,svg}')
   .pipe(imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 2,
        svgoPlugins: [{removeViewBox: true}]
      }))
      .pipe(gulp.dest('./dist/img'))
})

gulp.task('server', () => {
   gulp.src('./dist')
      .pipe(webserver({
         host:'0.0.0.0',
         port: 8000,
         livereload: true
      }))

})

gulp.task('sass', () => {
  gulp.src(config.scss.main)
  .pipe(sass({
    outputStyle: 'nested',
    // outputStyle: 'compressed' // versión minificada del css, utilizar cuando el proyecto esta terminado
    sourceComments: true
  }))
  .pipe(autoprefixer({
    versions:['last 2 browsers']
  }))
  .pipe(gulp.dest(config.scss.output))
})

gulp.task('copy', function () {
    gulp.src('./app/lib' + '/**' + '/*.*')
      .pipe(gulp.dest('./dist/lib'))
})

gulp.task('fonts', function(){
   gulp.src('./app/fonts' + '/**' + '/*.*')
    .pipe(watch('./app/fonts/**/*.*'))
    .pipe(gulp.dest('./dist/fonts'))
})

gulp.task('fonts-build', function(){
   gulp.src('./app/fonts' + '/**' + '/*.*')
    .pipe(gulp.dest('./dist/fonts'))
})

gulp.task('watch', function(){
  gulp.watch(config.scss.watch, ['sass'])
  gulp.watch(['./app/**/*.jade'], ['templates'])
  gulp.watch(['./app/img'], ['images'])
  gulp.watch(['./app/fonts'], ['fonts'])
  gulp.watch(['./app/lib'], ['copy'])
  gulp.watch(['./app/js/**/*.js'], ['concatenar'])
})

gulp.task('watch', function(){
  gulp.watch(config.scss.watch, ['sass'])
  gulp.watch(['./app/**/*.jade'], ['templates'])
  gulp.watch(['./app/img'], ['images'])
  gulp.watch(['./app/fonts'], ['fonts'])
  gulp.watch(['./app/lib'], ['copy'])
  gulp.watch(['./app/js/**/*.js'], ['concatenar'])
})

gulp.task('wisegrowth', [
  'server',
  'sass',
  'concatenar',
  'templates',
  'fonts',
  'images',
  'watch',
  'copy'
])

gulp.task('build', [
  'sass',
  'concatenar',
  'templates',
  'fonts-build',
  'images',
  'copy'
])

gulp.task('deploy', [
  's3Primary',
  's3Secondary',
])

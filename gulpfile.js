'use strict';
/**************
 ** PACKAGES **
 **************/
const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      gulpif = require('gulp-if'),
      htmlmin = require('gulp-htmlmin');

/***************
 ** VARIABLES **
 ***************/
// DECLARING VARIABLES TO USE IN PROJECT
var env,
    outputDir;

// Setting environtent to development
function setDevelopmentEnv(done) {
  env = 'development'
  done();
}
// Setting environtent to production
function setProductionEnv(done) {
  env = 'production'
  done();
}
// SET VARIABLES DEPENDING ON DEVELOPMENT ENVIRONMENT WE CHOOOSE
function setVariables(done) {
  if (env === 'development') {
    outputDir = './src/'
  } else {
    outputDir = './dist/'
  }
  done();
}

// Paths to our files
var paths = {
  html: {
    src: "./src/*.html",
  },
}

/***************
 ** FUNCTIONS **
 ***************/
// Gulp task to minify HTML files in production mode
function html() {
  return (
    gulp.src(paths.html.src)
      .pipe(gulpif(env === 'production', htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })))
      .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
      .pipe(browserSync.stream())
  );
}

// Watch files and inject to browser on file change
function watch() {
  browserSync.init({
    // You can tell browserSync to use this directory and serve it as a mini-server
    server: {
      baseDir: outputDir
    }
    // If you are already serving your website locally using something like apache
    // You can use the proxy setting to proxy that instead
    // proxy: "yourlocal.dev"
  });
  // gulp.watch takes in the location of the files to watch for changes
  // and the name of the function we want to run on change
  gulp.watch(paths.html.src, html);
  // We should tell gulp which files to watch to trigger the reload
  // This can be html or whatever you're using to develop your website
  // Note -- you can obviously add the path to the Paths object

}

/*************
 ** EXPORTS **
 *************/
// Set of gulp functions which will serve files and wathc for changes
const serve = gulp.series(setDevelopmentEnv, setVariables, gulp.parallel(html, watch))
// Set of gulp functions which will minimize all files and send them in dist folder
const build = gulp.series(setProductionEnv, setVariables, gulp.parallel(html))

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp html
exports.html = gulp.series(setProductionEnv, setVariables, gulp.parallel(html));

// Export build task and run it with '$ gulp build' command
exports.build = build;
// Export serve task as default task and run it with '$ gulp' command
exports.default = serve;
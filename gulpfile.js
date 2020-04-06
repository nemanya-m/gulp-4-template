'use strict';
/**************
 ** PACKAGES **
 **************/
const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      gulpif = require('gulp-if'),
      del = require('del'),
      concat = require('gulp-concat'),
      sourcemaps = require('gulp-sourcemaps'),
      htmlmin = require('gulp-htmlmin'),
      sass = require('gulp-sass'),
      postcss = require('gulp-postcss'),
      cssnano = require('cssnano'),
      autoprefixer = require('autoprefixer'),
      imagemin = require('gulp-imagemin'),
      markdown = require('gulp-markdown'),
      babel = require('gulp-babel'),
      uglify = require('gulp-uglify');


/*You can choose whether to use Dart Sass or Node Sass by setting the sass.compiler property.
Node Sass will be used by default, but it's strongly recommended that you set it explicitly
for forwards-compatibility in case the default ever changes.*/
sass.compiler = require('node-sass');

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
  styles: {
    css: "./src/css/**/*.css",
    // By using scss/**/*.sass we're telling gulp to check all folders and subfolders for any sass file
    scss: "./src/scss/**/*.scss",
  },
  img: {
    src: "./src/img/*"
  },
  markdown: {
    src: "./**/*.md"
  },
  scripts: {
    src: './src/scripts/js/**/*.js'
  }
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
function styleCSS() {
  // Defined plugins to be used in postcss
  var plugins = [
    autoprefixer(),
  ];
  // If we run build task then add 'cssnano()' to plugins
  if (env === 'production') {
    plugins.push(cssnano());
  }
  return (
    gulp.src(paths.styles.css)
      .pipe(postcss(plugins))
      // Concat all files into single 'main.css' file
      .pipe(concat('script.css'))
      // What is the destination for the compiled file
      .pipe(gulp.dest(outputDir + 'css'))
      .pipe(browserSync.stream())
  );
}
/// Compile Sass & Inject Into Browser
function styleSass() {
  // Defined plugins to be used in postcss
  var plugins = [
    autoprefixer(),
  ];
  // If we run build task then add 'cssnano()' to plugins
  if (env === 'production') {
    plugins.push(cssnano());
  }
  // Where should gulp look for the sass files?
  // My .scss files are stored in the styles folder
  // (If you want to use sass files, simply look for *.sass files instead)
  return (
    gulp.src(paths.styles.scss)
      // Initialize sourcemaps
      .pipe(gulpif(env === 'development', sourcemaps.init()))
      // Use sass with the files found, and log any errors
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(plugins))
      /* By default, gulp - sourcemaps writes the source maps inline in the compiled CSS files.\
      To write them to a separate file, specify a path relative to the gulp.dest() destination
      in the sourcemaps.write() function. */
      .pipe(gulpif(env === 'development', sourcemaps.write('./')))
      // What is the destination for the compiled file
      .pipe(gulp.dest(outputDir + 'css'))
      .pipe(browserSync.stream())
  );
}
// Markdown to HTML
function markdownToHTML() {
  return (
    gulp.src(paths.markdown.src)
      .pipe(markdown())
      .pipe(gulp.dest(outputDir))
      .pipe(browserSync.stream())
  )
}
// JAVASCRIPT task
function script() {
  return (
    gulp.src(paths.scripts.src)
      .pipe(gulpif(env === 'development', sourcemaps.init()))
      .pipe(babel({
        presets: ['@babel/preset-env']
      }))
      .pipe(concat('all.js'))
      .pipe(gulpif(env === 'development', sourcemaps.write('./')))
      .pipe(gulpif(env === 'production', uglify()))
      .pipe(gulp.dest(outputDir + 'scripts'))
      .pipe(browserSync.stream())
    /* gulp.src(paths.scripts.src)
      .pipe(babel({
        presets: ['@babel/preset-env']
      }))
      .pipe(concat('all.js'))
      .pipe(gulpif(env === 'production', uglify()))
      .pipe(gulp.dest(outputDir))
      .pipe(browserSync.stream()) */
  );
}
// Minifie images
function imageMin() {
  return (
    gulp.src(paths.img.src)
      .pipe(imagemin())
      .pipe(gulp.dest(outputDir + 'img'))
  )
}
// Task that remove the build folder before each build using the del package.
function cleanup() {
  return del([outputDir])
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
  gulp.watch(paths.styles.scss, styleSass)
  gulp.watch(paths.markdown.src, markdownToHTML)
  gulp.watch(paths.scripts.src, script)
}
/*************
 ** EXPORTS **
 *************/
// Set of gulp functions which will serve files and wathc for changes
const serve = gulp.series(setDevelopmentEnv, setVariables, gulp.parallel(html, styleSass, script, watch))
// Set of gulp functions which will minimize all files and send them in dist folder
const build = gulp.series(setProductionEnv, setVariables, cleanup, gulp.parallel(html, styleSass, imageMin))

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp html
exports.html = gulp.series(setProductionEnv, setVariables, cleanup, gulp.parallel(html));
// $ gulp css
exports.sass = gulp.series(setProductionEnv, setVariables, cleanup, gulp.parallel(styleCSS));;
// $ gulp sass
exports.sass = gulp.series(setProductionEnv, setVariables, cleanup, gulp.parallel(styleSass));;
// $ gulp markdown
exports.markdown = gulp.series(setProductionEnv, setVariables, cleanup, gulp.parallel(markdownToHTML));;
// $ gulp image
exports.image = gulp.series(setProductionEnv, setVariables, cleanup, gulp.parallel(imageMin));;

// Export build task and run it with '$ gulp build' command
exports.build = build;
// Export serve task as default task and run it with '$ gulp' command
exports.default = serve;
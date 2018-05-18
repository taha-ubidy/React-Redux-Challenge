var fs = require('fs');
var path = require('path');

var autoprefixer = require('gulp-autoprefixer');
var awspublish = require('gulp-awspublish');
var babelify = require('babelify');
var browserify = require('browserify');
var buster = require('gulp-cache-buster');
var cache = require('gulp-cached');
var del = require('del');
var envify = require('envify/custom');
var es = require('event-stream');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var hasher = require('gulp-hasher');
var imagemin = require('gulp-imagemin');
var jade = require('gulp-jade');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var parallelize = require('concurrent-transform');
var pipe = require('multipipe');
var pngquant = require('imagemin-pngquant');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var gbrowserify = require('./gulp.browserify');
var gtasks = require('./gulp.tasks');

var production = process.env.NODE_ENV === 'production';
var assetURL = 'http://localhost:3000/';

buster = buster.bind(null, {
  env: process.env.NODE_ENV,
  assetURL: assetURL,
  assetRoot: path.join(__dirname, 'dist'),
  hashes: hasher.hashes,
});

var tasks = gtasks.buildSpec({
  templates: {
    src: path.join('assets', 'templates'),
    pattern: 'index.jade',
    dest: 'dist',
  },
  fonts: {
    src: path.join('assets', 'resources', 'fonts'),
    pattern: path.join('**', '*'),
  },
  images: {
    src: path.join('assets', 'resources', 'images'),
    pattern: path.join('**', '*'),
  },
  plugins: {
    src: path.join('assets', 'resources', 'plugins'),
    pattern: path.join('**', '*'),
  },
  styles_less: {
    src: path.join('assets', 'styles', 'less'),
    pattern: 'style.less',
    dest: 'dist',
    watch: path.join('**', '*'),
  },
  lint: {
    src: path.join('assets', 'scripts'),
    pattern: path.join('**', '*'),
  },
  scripts: {
    src: path.join('assets', 'scripts', 'app.js'),
    pipeline: function(watch) {
      return gbrowserify.bundle({
        dest: this.dest,
        production: production,
        watch: !!watch,
        transforms: [
          babelify.configure({
            stage: 0,
            compact: false,
            extensions: ['.js', '.es', '.es6', '.jsx'],
          }),
          envify({
            _: 'purge',
            NODE_ENV: process.env.NODE_ENV,
            CONFIG_API_BASE: 'http://localhost:3000/',
            CONFIG_ASSET_URL: 'http://localhost:3000/',
          }),
        ],
        bundler: {
          entries: [path.basename(this.src)],
          basedir: path.dirname(this.src),
          detectGlobals: true,
          bundleExternal: false,
          debug: production,
          cache: {},
          packageCache: {},
          extensions: ['.js', '.es', '.es6', '.jsx'],
        },
      })();
    },
  },
  vendors: {
    src: 'vendors.json',
    dest: path.join('dist', 'assets', 'scripts', 'vendors.js'),
  },
});

gulp.task('clean', function(cb) {
  del(path.join('dist', 'assets'), cb);
  del('dist/*.*', cb);
});

gulp.task('templates', function() {
  return gulp
    .src(tasks.templates.src)
    .pipe(jade({pretty: !production}))
    .pipe(buster())
    .pipe(gulp.dest(tasks.templates.dest))
    .pipe(hasher());
});

gulp.task('fonts', function() {
  return gulp
    .src(tasks.fonts.src)
    .pipe(cache(tasks.fonts.cache))
    .pipe(gulp.dest(tasks.fonts.dest))
    .pipe(hasher());
});

gulp.task('images', function() {
  return gulp
    .src(tasks.images.src)
    .pipe(cache(tasks.images.cache))
    .pipe(
      gulpif(
        production,
        imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()],
        })
      )
    )
    .pipe(gulp.dest(tasks.images.dest))
    .pipe(hasher());
});

gulp.task('styles_less', ['images'], function() {
  return gulp
    .src(tasks.styles_less.src)
    .pipe(
      less({
        paths: [path.join(__dirname, 'node_modules')],
      })
    )
    .pipe(autoprefixer())
    .pipe(buster())
    .pipe(gulp.dest(tasks.styles_less.dest))
    .pipe(hasher())
    .pipe(minifyCss({restructuring: false}))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(tasks.styles_less.dest))
    .pipe(hasher());
});

gulp.task('lint', function() {
  return gulp
    .src(tasks.lint.src)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('vendors', function() {
  var vendors = JSON.parse(fs.readFileSync(tasks.vendors.src));
  return gbrowserify.bundle({
    dest: tasks.vendors.dest,
    packages: vendors.packages,
    production: production,
    transforms: [
      envify({
        NODE_ENV: process.env.NODE_ENV,
      }),
    ],
    bundler: {
      debug: production,
      cache: {},
      packageCache: {},
    },
  })();
});

gulp.task('scripts', function() {
  return tasks.scripts.pipeline();
});

gulp.task('plugins', function() {
  return gulp
    .src(tasks.plugins.src)
    .pipe(gulp.dest(tasks.plugins.dest))
    .pipe(hasher());
});

gulp.task('watch', ['default'], function() {
  Object.keys(tasks).forEach(function(k) {
    var task = tasks[k];
    if (task.pipeline) {
      task.pipeline(true);
    } else {
      gulp.watch(task.watch, [k]);
    }
  });
});

gulp.task('publish', ['default'], function() {});

gulp.task('default', function(done) {
  runSequence(
    [
      'images',
      'plugins',
      'styles_less',
      'vendors',
      'lint',
      'scripts',
    ],
    'templates',
    done
  );
});

import gulp from 'gulp';
import sequence from 'gulp-sequence';
import connect from 'gulp-connect';
import clean from 'gulp-clean';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import postcss from 'gulp-postcss';
import minifyCSS from 'gulp-minify-css';
import htmlmin from 'gulp-htmlmin';
import sourcemaps from 'gulp-sourcemaps';
import header from 'gulp-header';

import pkg from './package.json';
import postcssPlugins from './configs/postcss';

const banner = `/**
 * ${pkg.name} - ${pkg.description}
 * @version v${pkg.version}
 * @license ${pkg.license}
 */
`;

gulp.task('server', () => connect.server({
  root: 'dist',
  livereload: true,
  port: 8080,
}));

gulp.task('clean', () => {
  return gulp.src(['dist/*'], { read: false })
    .pipe(clean());
});

gulp.task('script:compile', () => {
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(header(banner))
    .pipe(gulp.dest('dist'));
});

gulp.task('script:minify', () => {
  return gulp.src('dist/js/jquery.carousel.js')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rename((path) => {
      path.basename += '.min';
      path.extname = '.js';
    }))
    .pipe(uglify())
    .pipe(header(banner))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload());
});

gulp.task('css:concat', () => {
  return gulp.src('src/**/*.css')
    .pipe(plumber())
    .pipe(postcss(postcssPlugins))
    .pipe(concat('jquery.carousel.css'))
    .pipe(header(banner))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('css:minify', () => {
  return gulp.src('dist/css/jquery.carousel.css')
    .pipe(sourcemaps.init())
    .pipe(minifyCSS())
    .pipe(rename((path) => {
      path.basename += '.min';
      path.extname = '.css';
    }))
    .pipe(header(banner))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('watch', () => {
  gulp.watch('src/**/*.js', ['script']);
  gulp.watch('src/**/*.css', ['css']);
  gulp.watch('src/**/*.html', ['html']);
});

gulp.task('css', (done) => sequence('css:concat', 'css:minify', done));
gulp.task('script', (done) => sequence('script:compile', 'script:minify', done));

gulp.task('build', (done) => {
  sequence('clean', ['script', 'css', 'html'], done);
});

gulp.task('default', (done) => {
  sequence('build', 'server', 'watch', done);
});
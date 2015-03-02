import Gulp from 'gulp';
import $ from 'gulp-load-plugins';

$ = $();

Gulp.task('build:scripts',
  () => Gulp.src('es6-traits.js')
            .pipe($.rename('es6-traits.min.js'))
            .pipe($.babel({
              loose: 'all',
              experimental: true
            }))
            //.pipe($.uglify())
            .pipe(Gulp.dest('.'))
);

import Gulp from 'gulp';
import $ from 'gulp-load-plugins';

$ = $();

Gulp.task('build:scripts',
  () => Gulp.src('estraits.babel.js')
            .pipe($.rename('estraits.js'))
            .pipe($.babel({
              loose: 'all',
              experimental: true
            }))
            .pipe(Gulp.dest('.'))
);

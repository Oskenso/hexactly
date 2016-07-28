const gulp = require('gulp');
const babel = require('gulp-babel');



gulp.task('default', ['jsx'], function() {

});

gulp.task('jsx', () =>
    gulp.src('*.jsx')
        .pipe(babel({
            presets: ['es2015', 'react']
        })).on('error', function(e){

			console.log('\n' + e.message + '\n');

			this.emit('end');
		})
        .pipe(gulp.dest(''))
);

var watch = gulp.watch('*.jsx', ['jsx']);

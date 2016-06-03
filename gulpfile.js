const gulp = require('gulp');
//const tsc = require('gulp-typescript');
const babel = require('gulp-babel');


//var tsProject = tsc.createProject('tsconfig.json');


gulp.task('default', ['jsx'], function() {
	//var res = tsProject.src().pipe(tsc(tsProject));
	//return res.js.pipe(gulp.dest(''));
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

//var watcher = gulp.watch('*.ts', ['default']);
var watch = gulp.watch('*.jsx', ['jsx']);

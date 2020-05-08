var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var scss = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

var src = './scss';
var css = './resource/css'
var paths = {
	scss : src + '/**/*.scss',
	js : './resource/js'
}
var scssOptions = {
	outputStyle : 'expanded',
	indentType : 'tab',
	indentWidth : 1,
	souceComments: true
}
gulp.task('html-tpl', function(){
	var manageEnvironment = function(environment) {
		environment.addFilter('tabIndent', function(str, numOfIndents, firstLine) {
			str = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('\t'));
			if(!firstLine) {
				str = str.replace(/^\s+/,"");
			}
			return str;
		});
	};

	return gulp.src('./pages/page/**/*.html')
		.pipe(nunjucksRender({
			envOptions: {
				autoescape: false
			},
			manageEnv : manageEnvironment,
			path: ['./pages']
		}))
		.pipe(gulp.dest('./html'))
		.pipe(browserSync.reload({stream : true}));
});
gulp.task('scss:compile', function(){
	return gulp
		.src(paths.scss)
		.pipe(sourcemaps.init())
		.pipe(scss(scssOptions).on('error', scss.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(css))
		.pipe(browserSync.reload({stream : true}));
});
gulp.task('js', function(){
	return gulp
		.src(paths.js)
		.pipe(browserSync.reload({stream : true}));
})
gulp.task('browserSync', function(){
	return browserSync.init({
		port : 3333,
		server : {
			baseDir: './'
		}
	})
});
gulp.task('watch', function(){
	gulp.watch('./pages/**/*.html', gulp.series('html-tpl'));
	gulp.watch(paths.scss, gulp.series('scss:compile'));
	gulp.watch(paths.js, gulp.series('js'));
});

gulp.task('default', gulp.parallel('watch', 'browserSync'));
var gulp = require('gulp');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var argv = require('yargs').argv;
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');




var params = {
	js: {
		src: './js/imbox.js',
		dest: './js',
		concat: "imbox.min.js"
	},
	styles: {
		src: './css/**/*.scss',
		dest: './css',
		concat: "imbox.min.css",
		prefixes: ['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
		sass: {
			sourceComments: false,
			outputStyle: 'compressed',
			errLogToConsole: true
		}
	},
	exampleCSS: {
		src: './example/*.scss',
		dest: './css',
		concat: "example.min.css",
		prefixes: ['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
		sass: {
			sourceComments: false,
			outputStyle: 'compressed',
			errLogToConsole: true
		}
	}
}


livereload.listen();



gulp.task('scss', function ()
{
	return gulp.src(params.styles.src)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass(params.styles.sass).on('error', sass.logError))
		.pipe(prefix(params.styles.prefixes))
		.pipe(gulpif(argv.production, minify()))
		.pipe(concat(params.styles.concat))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(params.styles.dest))
		.pipe(livereload());
});


gulp.task('exampleCSS', function ()
{
	return gulp.src(params.exampleCSS.src)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass(params.exampleCSS.sass).on('error', sass.logError))
		.pipe(prefix(params.exampleCSS.prefixes))
		.pipe(gulpif(argv.production, minify()))
		.pipe(concat(params.exampleCSS.concat))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(params.exampleCSS.dest))
		.pipe(livereload());
});



gulp.task('js', function(){
	return gulp.src(params.js.src)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat(params.js.concat))
		.pipe(gulpif(argv.production, uglify()))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(params.js.dest))
		.pipe(livereload());
});


gulp.task('indexReload', function(){
	return livereload();
});

gulp.task('html', function() {
	return gulp.src('./**/*.html')
		.pipe(gulp.dest(''))
		.pipe(livereload());
});


gulp.task('default', ['scss','exampleCSS','js'], function()
{
	gulp.watch(params.styles.src, ['scss'])
		.on('change', function(evt) {
			console.log(
				'[watcher] File ' + evt.path.replace(/.*(?=scss)/,'') + ' was ' + evt.type + ', compiling...'
			);
		});

		gulp.watch(params.exampleCSS.src, ['exampleCSS'])
		.on('change', function(evt) {
			console.log(
				'[watcher] File ' + evt.path.replace(/.*(?=scss)/,'') + ' was ' + evt.type + ', compiling...'
			);
		});
	
	
	gulp.watch(params.js.src, ['js'])
		.on('change', function(evt) {
			console.log(
				'[watcher] File ' + evt.path + ' was ' + evt.type + ', compiling...'
			);
		});
	
	gulp.watch('./**/*.html', ['html'])
		.on('change', function(evt) {
			console.log(
				'[watcher] HTML task complete'
			);
		});
	
	
});

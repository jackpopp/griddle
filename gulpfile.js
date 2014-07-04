/**

Files and destination variables

**/

var	ASSET_DIR         = './src/', // development source assets
	DEV_DEST_DIR      = './docs/', // development destination assets
	PROD_DEV_DEST_DIR = './build/', // production assets
	MAIN_JS           = 'main.js'; // compiled js filename

/**

Gulp variables

**/

var gulp         = require('gulp'),
	watch        = require('gulp-watch'),
	sass         = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    coffee       = require('gulp-coffee'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    pngcrush     = require('imagemin-pngcrush'),
    clean        = require('gulp-clean'),
    concat       = require('gulp-concat'),
    browserify   = require('gulp-browserify'),
    merge        = require('merge-stream'),
    notify       = require('gulp-notify');

// CSS/SASS 
gulp.task('css', function(cb){
	// compile sass
	compile = gulp.src(ASSET_DIR+'css/**/*.sass')
		.pipe(sass({sourcemap: true}))
		.pipe(autoprefixer("last 7 version", "ie 5"))
		.pipe(gulp.dest(DEV_DEST_DIR+'css'));

	copy = gulp.src(ASSET_DIR+'css/**/*.css')
		.pipe(autoprefixer("last 7 version", "ie 5"))
		.pipe(gulp.dest(DEV_DEST_DIR+'css'));

	return merge(compile, copy);
});

// CSS Optimisation
gulp.task('cssProd', ['css'], function(cb){
	// autoprefix, minify, concat
	return gulp.src(DEV_DEST_DIR+'/css/**/*.*')
		.pipe(autoprefixer("last 7 version", "ie 5"))
		.pipe(minifycss())
		.pipe(concat('core.min.css'))
		.pipe(gulp.dest(PROD_DEV_DEST_DIR+'/css'))
});

// Images
gulp.task('img', function(){
	return gulp.src(ASSET_DIR+'img/**/*.*')
		.pipe(gulp.dest(PROD_DEV_DEST_DIR+'img'));
});

// Image optimisation
gulp.task('imgProd', ['img'], function(){
	return gulp.src(ASSET_DIR+'img/**/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(DEV_DEST_DIR+'/img'));
});

// Javascript/Coffeescript
gulp.task('js', function(cb){
	// compile
	compile = gulp.src(ASSET_DIR+'js/**/*.coffee')
		.pipe(coffee({bare: true}))
		.pipe(gulp.dest(DEV_DEST_DIR+'js'));

	copy = gulp.src(ASSET_DIR+'js/**/*.js')
		.pipe(gulp.dest(DEV_DEST_DIR+'js'));

	return merge(compile, copy);
});


// Javascript Opitimisation and Browserify
gulp.task('jsProd', ['js'], function(){
	return gulp.src(DEV_DEST_DIR+'/js/'+MAIN_JS)
		.pipe(browserify())
		.pipe(uglify())
		.pipe(gulp.dest(PROD_DEV_DEST_DIR+'/js'));
});


// Clean dev guideline
gulp.task('clean', function(cb) {
	return gulp.src([DEV_DEST_DIR], {read: false})
    	.pipe(clean());
});

// development
// compile and copy.

gulp.task('watch', ['clean'], function() {
  // place code for your default task here
  watch({ glob: ASSET_DIR+'**/*/*.*'}, ['js', 'css', 'img']).pipe(notify({message: 'File changes compiled'}));
});

// production
// compile, minify, optimize

gulp.task('production', ['cssProd', 'jsProd', 'imgProd'], function(){
	// clean up here
	return gulp.src([DEV_DEST_DIR], {read: false})
    	.pipe(clean());
});
/*!
To install, run this from the terminal in the project root folder,
you MAY have to prefix it with sudo if NPM isn't set up quite right:

npm install


To watch files and build them when they change, run:

gulp watch

*/

// Load plugins
var gulp = require('gulp'),
	replace = require('gulp-replace');

//this little guy will automatically change the manifest file
//when you change another file in this project
gulp.task('updateAppCacheManifest', function ()
{
	//4 digit random version number
	//start with this in the manifest text file:      #v:0000
	gulp.src('./offline.appcache')
		.pipe(replace(
			/#v:\d{0,4}/ig,
			'#v:' + (('0000' + Math.ceil(Math.random() * 10000)).slice(-4))
		))
		.pipe(gulp.dest('./'));
});

// Watch the files and run some tasks
gulp.task('watch', function ()
{
	gulp.watch(
		[
			'./*.html',
			'./img/**/*',
			'./scripts/**/*.js',
			'./styles/**/*.css'
		],
		['updateAppCacheManifest']);
});

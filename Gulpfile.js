var gulp    = require('gulp'),
    watch   = require('gulp-watch'),
    notify  = require('gulp-notify'),
    mocha   = require('gulp-mocha'),
    cover   = require('gulp-coverage'),
    server  = require('gulp-express');


function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('tests', function() {
  gulp.src("./test/**/*.js")
    .pipe(mocha())
    .on("error", handleError);
});

gulp.task('server', function() {
    console.log("Running the server again!");
    var options = {};
    options.env = process.env;
    options.env.PORT = 4002;
    options.env.NODE_ENV = 'development';
    server.run(['./src/index.js'], options);
});

gulp.task('watch', function() {
  gulp.watch('./test/**/*.js', ['tests']);
  gulp.watch('./src/**/*.js',  ['server', 'tests']);
  gulp.watch('./src/index.js', ['server', 'tests']);
  var options = {};
  options.env = process.env;
  options.env.PORT = 4002;
  options.env.NODE_ENV = 'development';
  server.run(['./src/index.js'], options);
});

gulp.task('default', ['watch', 'server']);
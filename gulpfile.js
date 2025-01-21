const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "src"
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("src/css"))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});
gulp.task('js', () =>
    gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dist/js'))
);
gulp.task('server', function(done) {
    try {
        browserSync.init({
            server: {
                baseDir: "src"
            }
        });

        gulp.watch("src/*.html").on('change', browserSync.reload);
        done();
    } catch (error) {
        console.error("Ошибка в задаче 'server':", error);
        done(error);
    }
});



gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
    gulp.watch("src/js/**/*.js").on('change', gulp.parallel('js'));
    //gulp.watch("src/pictures/**/*").on('change', gulp.parallel('pictures'));
});
gulp.task('html', function(){
  return gulp.src("src/*.html")
   .pipe(htmlmin({ collapseWhitespace: true }))
   .pipe(gulp.dest("dist/"))
});
gulp.task('scripts', function(){
  return gulp.src("src/js/**/*.js")
   .pipe(gulp.dest("dist/js"))
});
gulp.task('fonts', function(){
  return gulp.src("src/fonts/**/*")
   .pipe(gulp.dest("dist/fonts"))
});
/* gulp.task('mailer', function(){
  return gulp.src("src/mailer/**")
   .pipe(gulp.dest("dist/mailer"))
}); */
//gulp.task('pictures', function(){
  //return gulp.src("src/pictures/**/*")
 //  .pipe(imagemin())
 ////  .pipe(gulp.dest("dist/pictures"))
//});

gulp.task('default', gulp.parallel('watch','js', 'server', 'styles', 'html', 'scripts', 'fonts'/* , 'pictures' */));

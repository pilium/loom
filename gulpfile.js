var gulp = require('gulp'),
    pug = require('gulp-pug'),
    browsersync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    less = require('gulp-less'),
    cache = require('gulp-cache'),
    spritesmith = require("gulp.spritesmith"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    newer = require("gulp-newer"),
    svgstore = require("gulp-svgstore"),
    svgmin = require("gulp-svgmin"),
    autoprefixer = require('gulp-autoprefixer');

// Работа с less
gulp.task('less', function() {
    return gulp.src([
            'dev/static/less/main.less',
        ])
        .pipe(plumber())
        .pipe(less({
            'include css': true
            // compress: true //минификация
        }))


    .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(autoprefixer(['last 2 version']))
        .pipe(gulp.dest('dev/static/css'))
        .pipe(cssnano())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest('dev/static/css'))
        .pipe(browsersync.reload({
            stream: true
        }));
});

// Работа с Pug
gulp.task('pug', function() {
    return gulp.src('dev/pug/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true //минификация: False
        }))
        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gulp.dest('dev'));
});

// Browsersync
gulp.task('browsersync', function() {
    browsersync({
        server: {
            baseDir: 'dev'
        },
    });
});

// Работа с JS
gulp.task('scripts', function() {
    return gulp.src([
            // Библиотеки
            'dev/static/libs/magnific/jquery.magnific-popup.min.js',
            'dev/static/libs/maskedinput/maskedinput.js',
            'dev/static/libs/slick/slick.min.js',
            'dev/static/libs/validate/jquery.validate.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dev/static/js'))
        .pipe(browsersync.reload({
            stream: true
        }));
});


// Сборка спрайтов PNG
gulp.task('cleansprite', function() {
    return del.sync('dev/static/img/sprite/sprite.png');
});

gulp.task('spritemade', function() {
    var spriteData =
        gulp.src('dev/static/img/sprite/*.*')
        .pipe(spritesmith({
            imgName: '../img/sprite/sprite.png',
            cssName: '_sprite.less',
            padding: 50,
            cssFormat: 'less',
            algorithm: 'binary-tree',

        }));

    spriteData.img.pipe(rename('sprite.png')).pipe(gulp.dest('dev/static/img/sprite/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('dev/static/less/')); // путь, куда сохраняем стили
});
gulp.task('sprite', ['cleansprite', 'spritemade']);

// Сборка спрайтов SVG
gulp.task('cleanspriteSvg', function() {
    return del.sync('dev/static/img/sprite/sprite.svg');
});

gulp.task('spritemadeSvg', function() {
    return gulp.src('dev/static/img/sprite/*.svg')
      .pipe(svgmin())
      .pipe(svgstore({
        inlineSvg: true
      }))
      .pipe(rename("spriteSvg.svg"))
      .pipe(gulp.dest("dev/static/img/sprite/"));
        });
gulp.task('spriteSvg', ['cleanspriteSvg', 'spritemade']);


// Слежение
gulp.task('watch', ['browsersync', 'less', 'scripts'], function() {
    gulp.watch('dev/static/less/**/*.less', ['less']);
    gulp.watch('dev/pug/**/*.pug', ['pug']);
    gulp.watch('dev/*.html', browsersync.reload);
    gulp.watch(['dev/static/js/*.js', '!dev/static/js/libs.min.js', '!dev/static/js/jquery.js'], ['scripts']);
});

// Очистка папки сборки
gulp.task('clean', function() {
    return del.sync('prodact');
});

// Оптимизация изображений
gulp.task('img', function() {
    return gulp.src(['dev/static/img/**/*.{png,jpg,gif,ico}', '!dev/static/img/sprite/*'])
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            use: [pngquant()]

        })))
        .pipe(gulp.dest('product/static/img'));
});

// Сборка проекта

gulp.task('build', ['clean', 'img', 'less', 'scripts'], function() {
    var buildCss = gulp.src('dev/static/css/*.css')
        .pipe(gulp.dest('product/static/css'));

    var buildFonts = gulp.src('dev/static/fonts/**/*')
        .pipe(gulp.dest('product/static/fonts'));

    var buildJs = gulp.src('dev/static/js/**.js')
        .pipe(gulp.dest('product/static/js'));

    var buildHtml = gulp.src('dev/*.html')
        .pipe(gulp.dest('product/'));

    var buildLibs = gulp.src('dev/static/libs/**/*')
        .pipe(gulp.dest('product/static/libs/'));

    var buildImg = gulp.src('dev/static/img/sprite/sprite.png')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('product/static/img/sprite/'));
    var buildSvg = gulp.src('dev/static/img/sprite/spriteSvg.svg')
        .pipe(gulp.dest('product/static/img/sprite/'));
});

// Очистка кеша
gulp.task('clear', function() {
    return cache.clearAll();
});

// Дефолтный таск
gulp.task('default', ['watch']);

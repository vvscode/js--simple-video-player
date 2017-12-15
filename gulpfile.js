const gulp = require("gulp");
const include = require("gulp-include");
const rename = require("gulp-rename");

gulp.task("build", () => {
  gulp
    .src("src/wrapper.js")
    .pipe(rename("simple-video-player.js"))
    .pipe(include())
    .on("error", console.log)
    .pipe(gulp.dest("dist/"))
    .pipe(gulp.dest("demo/"));
});

gulp.task("default", ["build"]);

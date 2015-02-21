var gulp = require('gulp'),
    rsync = require('gulp-rsync'),
    deploymentTarget = require('./private/deploymentTarget');

gulp.task('deploy', function() {
    gulp.src(['scripts/**', 'src/**', 'package.json', 'server.js'])
        .pipe(rsync(deploymentTarget));
});
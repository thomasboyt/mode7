module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    secret: grunt.file.readJSON('secret.json'),

    clean: {
      build: ['build/']
    },

    webpack: {
      main: require('./webpack.prod.config')
    },

    sftp: {
      options: {
        path: '<%= secret.path %>',
        host: '<%= secret.host %>',
        username: '<%= secret.username %>',
        agent: process.env.SSH_AUTH_SOCK,
        showProgress: true,
        srcBasePath: 'build/',
        createDirectories: true
      },

      game: {
        files: {
          './': ['build/**', '!build/assets/**']
        }
      },

      assets: {
        files: {
          './': ['build/assets/**']
        }
      }
    },

    copy: {
      index: {
        src: 'index.html',
        dest: 'build/'
      }
    }
  });

  grunt.registerTask('dist', ['clean:build', 'webpack:main', 'copy:index']);

  grunt.registerTask('deploy', ['dist', 'sftp:game']);
  grunt.registerTask('deploy:all', ['dist', 'sftp']);
};

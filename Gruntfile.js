module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: {
        src: 'dest/*'
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      // dist: {
      //   src: ['src/jquery.editlabel/jquery.editlabel.js', 'src/jquery.validateform/jquery.validateform.js'],
      //   dest: 'dist/<%= pkg.name %>.js'
      // },
      //合并css
      cssConcat: {
        src: ['src/jquery.editlabel/jquery.editlabel.css'],
        dest: 'dist/<%= pkg.name %>.css'
      },
      //合并js
      jsConcat: {
        src: ['src/jquery.editlabel/jquery.editlabel.js', 'src/jquery.validateform/jquery.validateform.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      options: {
        stripBanners: true, //合并时允许输出头部信息
        banner: '/*!<%= pkg.file %> - <%= pkg.version %>-' + '<%=grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/<%= pkg.name %>.css',//压缩
        dest: 'dist/<%= pkg.name %>.min.css' //dest 是目的地输出
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['clean', 'concat', 'uglify','cssmin']);

};
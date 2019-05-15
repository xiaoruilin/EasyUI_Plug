module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: {
        src: 'dest/<%= pkg.folder%>-<%=pkg.version %>/*'
      }
    },
    copy: {
      image: {
        files: [
          {expand: true, cwd: 'src/jquery.foldpanel', src: ['images/*.{png,jpg,jpeg,gif}'], dest: 'dist/<%= pkg.folder%>-<%=pkg.version %>/'}
        ]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      //合并css
      cssConcat: {
        src: [
          'src/jquery.foldpanel/jquery.foldpanel.css',
          'src/jquery.editlabel/jquery.editlabel.css'
        ],
        dest: 'dist/<%= pkg.folder%>-<%=pkg.version %>/<%= pkg.name %>.css'
      },
      //合并js
      jsConcat: {
        src: [
          'src/jquery.whereshowele/jquery.whereshowele.js', 
          'src/jquery.foldpanel/jquery.foldpanel.js', 
          'src/jquery.filegridui/jquery.filegridui.js', 
          'src/jquery.validateform/jquery.validateform.js',
          'src/jquery.editlabel/jquery.editlabel.js'
        ],
        dest: 'dist/<%= pkg.folder%>-<%=pkg.version %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        banner: '/*! <%= pkg.folder%>-<%=pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n/*<%=pkg.description%>*/'
      },
      build: {
        src: 'dist/<%= pkg.folder%>-<%=pkg.version %>/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.folder%>-<%=pkg.version %>/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      options: {
        sourceMap: true,
        stripBanners: true, //合并时允许输出头部信息
        banner: '/*! <%= pkg.folder%>-<%=pkg.version %> <%=grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/<%= pkg.folder%>-<%=pkg.version %>/<%= pkg.name %>.css',//压缩
        dest: 'dist/<%= pkg.folder%>-<%=pkg.version %>/<%= pkg.name %>.min.css' //dest 是目的地输出
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['clean','copy','concat', 'uglify','cssmin']);
};
module.exports = function(grunt) {

  grunt.initConfig({
    babel : {
      options : {
        sourceMap : true
      },
      dist : {
        files : [{
          expand : true,
          cwd    : 'js/src',
          src    : [ '**/*.js' ],
          dest   : 'js/compiled',
          rename : function( dest, src ) {
            var filename = src.replace(/es6\./g, '');
            return dest + "/" + filename;
          }
        }]
      }
    },

    browserify : {
      background : {
        src  : "js/compiled/background.js",
        dest : "js/dist/background.js"
      },
      contentScript : {
        src  : "js/compiled/content-script.js",
        dest : "js/dist/content-script.js"
      },
      popup : {
        src  : "js/compiled/popup.js",
        dest : "js/dist/popup.js"
      }

    },

    watch: {
      scripts: {
        files: ['js/src/**/*.js'],
        tasks: ['build'],
        options: {
          spawn: false,
        },
      },
    },

    jasmine_node: {
      options: {        
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'
      },
      all: ["."]
    },

    clean: [ "production" ],

    copy: {
      main: {
        files: [          
          { expand: true, src: ['css/*']          , dest: 'production' },
          { expand: true, src: ['html/*']         , dest: 'production' },
          { expand: true, src: ['images/*']       , dest: 'production' },
          { expand: true, src: ['js/dist/*']      , dest: 'production' },
          { expand: true, src: ['js/libs/*']      , dest: 'production' },
          { expand: true, src: ['./manifest.json'], dest: 'production' }          
        ],
      },
    },

    compress: {
      main: {
        options: {
          archive: 'spellcy.zip'
        },
        files: [          
          { expand: true, cwd: 'production/', src: ['**'], dest: 'production/' } 
        ]
      }
    }

  });

  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask( 'build', [ 'babel', 'browserify' ] );  
  grunt.registerTask( 'test' , [ 'jasmine_node' ] );  
  grunt.registerTask( 'production' , [ 'clean', 'copy', 'compress' ] );  
};
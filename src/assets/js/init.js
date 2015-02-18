// require config... duh
requirejs.config({
    // initial pwd is /assets/
    'baseUrl': '/assets/',
    'paths': {
        // libs
        'jquery': [
            '//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min',
            'libs/jquery/dist/jquery',   // backup
        ],
        'bootstrap': [
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min',
            'libs/jquery/dist/jquery',   // backup
        ],
        'underscore': [
            '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
            'libs/underscore/underscore', // backup
        ],
        'd3': [
            '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min',
            'libs/d3/d3',                // backup
        ],
        'modernizr': [
            '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min',
            'libs/modernizr/modernizr',  // backup
        ],
        'ga': 'js/ga',
        // modules
        // 'jquery-ext': '../../assets/custom_components/jquery-extensions',
    },
    'shim': {
        // require jquery when requiring bootstrap
        'bootstrap': {
            'deps': ['jquery'],
            // returns back the window.jQuery object
            'exports': 'jQuery'
        },
        // require underscore when requiring underscore.string extensions
        'underscore.string': {
            'deps': ['underscore'],
            // returns back the window._ object
            'exports': '_'
        },
        'modernizr': {
            'exports': 'Modernizr'
        }
    }
});

// start loading modules
requirejs([
    'modernizr',
    'ga'
]);

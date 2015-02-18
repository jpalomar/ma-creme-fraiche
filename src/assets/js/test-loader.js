(function loader ( GLOBAL ) { 'use strict';
    // GLOBAL.requirejs || document.write('<script type="text\/javascript" data-main="\/assets\/js\/init" src="\/assets\/libs\/requirejs\/require.js"><\/script>')

    var script;

    if ( ! GLOBAL.requirejs )
    {
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.setAttribute('data-main', '/assets/js/init');
        script.src = '/assets/libs/requirejs/require.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    }

}(this));


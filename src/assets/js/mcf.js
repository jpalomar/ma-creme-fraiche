require([
    'bootstrap',

    // get the mcf front splash
    'js/mcf-front-splash'
], function (
    $,
    splash
) { 'use strict';


function do_mcf_resolver( )
{
    // strip the utility classnames to avoid re-selection
    function do_resolved_cleanup( )
    {
        $resolvers.removeClass( 'mcf-resolver mcf-resolved' );
    }

    var $resolvers = $( '.mcf-resolver' ).addClass( 'mcf-resolved' );

    // do when transition ends or just invoke immediately
    if ( $.support.transition )
    {
        $resolvers.one( 'bsTransitionEnd', do_resolved_cleanup );
    }
    else
    {
        do_resolved_cleanup( );
    }
}

function do_doc_ready( )
{
    splash.init( );
    $( document ).trigger( 'mcf-resolver' );
}

$( document )
    // define
    .on( 'mcf-resolver', do_mcf_resolver )
    // init page
    .ready( do_doc_ready )
    ;

}); // end mcf

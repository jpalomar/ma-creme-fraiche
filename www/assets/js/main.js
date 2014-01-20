
(function ($, _, undefined) {

// local namespace
var GLOBAL = this;
var localStorage = GLOBAL.localStorage;

$('#showNavigation')
    .click(function (_evt){
        $('#navigation').slideToggle(200, function(){
            localStorage.setItem('isNavOpen', $(this).is(':visible') );
        });

    });


// init page
$(function($){

    // retain nav state
    if ( JSON.parse( localStorage.getItem('isNavOpen') ) ) {
        $('#showNavigation').click();
    }

    // check if it's the first visit.
    if ( ! JSON.parse( localStorage.getItem('hasVisited') ) ) {
        localStorage.setItem('hasVisited', true );
    }
});

}).call(this, this.jQuery, this._);

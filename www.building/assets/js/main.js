
(function ($, _, Backbone, undefined) {

// local namespace
var GLOBAL = this;
var localStorage = GLOBAL.localStorage;

function show_click_event_function ( _evt ) {
    $('#navigation').slideToggle(200, function(){
        localStorage.setItem('isNavOpen', $(this).is(':visible') );
    });
}
// init page
$(function($){
// bind nav event
$('#showNavigation').click(show_click_event_function);
});



// init page
$(function($){

// retain nav state
if ( JSON.parse( localStorage.getItem('isNavOpen') ) ) {
    // open nav - trigger view
    $('#showNavigation').click();
}

// check if it's the first visit.
if ( ! JSON.parse( localStorage.getItem('hasVisited') ) ) {
    localStorage.setItem('hasVisited', true );
}

});

}).call(this, this.jQuery, this._, this.Backbone);

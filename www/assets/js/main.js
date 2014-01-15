(function ($, _) {
// function redirect () {
//  location.href = 'http://blog.macremefraiche.com/';
// }
// _(redirect).delay(5000);

$('#showNavigation')
.click(function (_evt){
    $('#navigation').slideToggle(400);
});

}).call(this, this.jQuery, this._);

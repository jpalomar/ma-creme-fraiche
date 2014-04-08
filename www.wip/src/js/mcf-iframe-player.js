(function ($, _) {

$(function() {
    var $videos = $('iframe[src^="http://www.youtube.com"], iframe[src^="http://player.vimeo.com"], iframe[src^="https://w.soundcloud.com"]');
    var $container = $('#foot-clan .container');
    var fn_vid_resize = _(function() {
        var newWidth = $container.width();
        // Resize all videos according to their own aspect ratio
        $videos.each(function() {
            var $vid = $(this);
            $vid
                .width('100%')
                .height(newWidth * $vid.data('aspectRatio'))
                ;
        });
    }).debounce(300);

    // Figure out and save aspect ratio for each video
    $videos.each(function() {
        $(this)
            .data('aspectRatio', this.height / this.width)
            // and remove the hard coded width/height
            .removeAttr('height width')
            ;
    });
    // When the window is resized
    $(window).resize(fn_vid_resize).resize();
});

}).call(this, this.jQuery, this._ );

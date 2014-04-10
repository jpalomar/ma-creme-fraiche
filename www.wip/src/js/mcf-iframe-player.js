(function ($, _) {

$(function() {

    var $videos = $('iframe[src^="http://www.youtube.com"], iframe[src^="http://player.vimeo.com"], iframe[src^="https://w.soundcloud.com"]');
    var $container = $('#foot-clan .container');

    var fn_vid_resize = _(function() {

        var newWidth = $container.width();

        // resize all videos according to their own aspect ratio
        $videos.each(function() {

            var $vid = $(this);

            $vid.width(newWidth /*'100%'*/)
                .height(newWidth * $vid.data('aspectRatio'))
                ;
        });

    }).debounce(300);

    $videos.each(function() {
        // remove the hard coded width / height
        $(this).removeAttr('height width')
            // save aspect ratio for each video
            .data('aspectRatio', this.height / this.width)
            ;
    });

    // set resize event
    $(window).resize(fn_vid_resize).resize();
});

}).call(this, this.jQuery, this._ );

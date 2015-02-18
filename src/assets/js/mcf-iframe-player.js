define([
    'jquery',
    'underscore'
], function (
    $,
    _
) { 'use strict';

    function do_iframe_resize () {

        var $videos = $('iframe[src^="http://www.youtube.com"], iframe[src^="http://player.vimeo.com"], iframe[src^="https://w.soundcloud.com"]');
        var $container = $('.footer > .container');

        var fn_vid_resize = _(function() {

            var width = $container.width();

            // resize all videos according to their own aspect ratio
            $videos.each(function() {

                var $vid = $(this);

                $vid.width('100%')
                    .height( Math.min( (width*$vid.data('aspectratio')), 480 ) )
                    ;
            });

        }).debounce(250);

        $videos.each(function() {
            $(this)
                // save aspect ratio for each video
                .data('aspectratio', this.height / this.width)
                // remove the hard coded width / height
                .removeAttr('height width')
                ;
        });

        // set resize event
        $(window).resize(fn_vid_resize).resize();
    }

    return {
        'init' : _.once(do_iframe_resize)
    };

});

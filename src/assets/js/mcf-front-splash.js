define([
    'bootstrap',
    'underscore',
    'd3'
], function (
    $,
    _,
    d3
) { 'use strict';

    function place_and_update_tooltip (_data, _index) {
        var xy = d3.mouse( document.documentElement );
        $tooltip
            .attr('data-time', _index)
            .css({
                'top': (xy[1] - $tooltip.height() * 1.5),
                'left': (xy[0] - $tooltip.width() / 2),
            });
        fn_refreshtip();
    }

    function hide_tooltip() {
        $tooltip.removeClass('in');
    }

    function toggle_tooltip(_data, _index) {
        $tooltip.toggleClass('in');
        place_and_update_tooltip.call(this, _data, _index);
    }

    function show_tooltip(_data, _index) {
        $tooltip.addClass('in');
        place_and_update_tooltip.call(this, _data, _index);
    }

    function do_update_data_model( _d3_selection ) {

        // store for reference
        var
            previous_value = [],
            map_previous_values = function( _data, _index ) {
                previous_value[_index] = _data.value;
            },
            assign_previous_values = function( _data, _index ) {
                _data.previous_value = previous_value[_index];
            }
            ;

        data_model_of_time = do_get_the_time();

        _d3_selection
            .each( map_previous_values )
            .data( data_model_of_time )
            .each( assign_previous_values )
            ;

    }

    function update_transition( _data ) {
        var interpolateNumber = d3.interpolateNumber(_data.previous_value, _data.value);
        return function (_tween) {
            _data.value = interpolateNumber(_tween);
            return d3_arc(_data);
        };
    }

    function update_colors(_data) {
        return d3_color(_data.value);
    }

    function do_tick() {

        d3_paths
            .call( do_update_data_model )
            .select('path')
            .on('mousemove', show_tooltip )
            .on('mouseout', hide_tooltip )
            .on('mouseup', toggle_tooltip )
            .transition()
            .ease('back')
            .attrTween('d', update_transition )
            .style('fill', update_colors )
            ;

        if ( $tooltip.is('.in') ) {
            fn_refreshtip();
        }

        timeout_reference = _( do_tick ).delay( 1000 - _.now() % 1000 );
    }

    function do_get_the_time() {
        var now = new Date();
        return [{
            'index': 0.7,
            'text': do_format_second(now),
            'value': now.getSeconds() / 60
        }, {
            'index': 0.6,
            'text': do_format_minute(now),
            'value': now.getMinutes() / 60
        }, {
            'index': 0.5,
            'text': do_format_hour(now),
            'value': now.getHours() / 24
        }, {
            'index': 0.3,
            'text': do_format_day(now),
            'value': now.getDay() / 7
        }, {
            'index': 0.2,
            'text': do_format_date(now),
            'value': (now.getDate() - 1) / (32 - new Date(now.getYear(), now.getMonth(), 32).getDate())
        }, {
            'index': 0.1,
            'text': do_format_month(now),
            'value': now.getMonth() / 12
        }];
    }

    function do_create_the_clock(_d3_selection, _width, _height) {

        var d3_group = this
            .attr({
                'width': _width,
                'height': _height,
            })
            .append('g')
            .classed('svg-clock-g mcf-fade-in', true)
            .attr({
                'transform': 'translate(' + _width / 2 + ',' + _height / 2 + ')',
            })
            ;

        d3_paths = d3_group.selectAll('g')
            .data(do_get_the_time)
            .enter().append('g')
            ;

        d3_paths.append('path');

        radius = Math.min( _width, _height ) / 2;
    }

    function do_empty_the_clock() {
        // empty
        this.selectAll('*')
            .remove()
            ;
    }

    function fn_refreshtip() {
        // var index = $tooltip.attr('data-time');
        // var text = data_model_of_time[index].text;
        // $tooltip_content.text( text );
        $tooltip_content
            .text( data_model_of_time[ $tooltip.attr('data-time') ].text )
            ;
    }

    function do_view_update_of_clock() {
        // console.log('do_view_update_of_clock');
        clearTimeout(timeout_reference);
        // empty
        d3_svg
            .call( do_empty_the_clock )
            .call( do_create_the_clock, $container.width(), $container.height())
            ;

        d3.transition()
            .each( do_tick )
            ;
    }

    function do_interpolated_string(_arg1, _arg2) {
        var interpolateString = d3.interpolateString(_arg1, _arg2);
        return function (_text) {
            return d3.hsl( interpolateString(_text) );
        };
    }

    function do_endAngle (_data) {
        return _data.value * 2 * Math.PI;
    }

    function do_innerRadius (_data) {
        return _data.index * radius;
    }

    function do_outerRadius (_data) {
        return (_data.index + spacing) * radius;
    }

    function do_init() {
        $container = $(selector);
        do_format_second = d3_time_format('%S s');
        do_format_minute = d3_time_format('%I:%M %p');
        do_format_hour = d3_time_format('%I %p');
        do_format_day = d3_time_format('%a, %b %d');
        do_format_date = d3_time_format('%b %d');
        do_format_month = d3_time_format('%b %Y');
        do_resize_svg_clock = _( do_view_update_of_clock ).debounce(200);

        d3_color = d3.scale.linear()
            .range(['hsl(99,22%,75%)', 'hsl(350,71%,67%)'])
            .interpolate(do_interpolated_string)
            ;

        d3_arc = d3.svg.arc()
            .startAngle(0)
            .endAngle( do_endAngle )
            .innerRadius( do_innerRadius )
            .outerRadius( do_outerRadius )
            ;

        d3_svg = d3.select(selector).append('svg')
            .classed('svg-clock mcf-fade-in mcf-fade-in-longer',true)
            ;

        $tooltip = $($.fn.tooltip.Constructor.DEFAULTS.template)
            .addClass( 'mcf-tooltip top fade' )
            .prependTo( document.body )
            ;

        $tooltip_content = $tooltip.find('.tooltip-inner');
        do_resize_svg_clock();

        $(window)
            .on('resize.mcf.svg.clock', do_resize_svg_clock)
            .resize()
            ;
    }

    var
        spacing = 0.09,
        selector = '.embed-front-splash',
        d3_time_format = d3.time.format,
        do_resize_svg_clock,
        data_model_of_time,
        timeout_reference,
        radius,
        $container,
        $tooltip,
        $tooltip_content,
        do_format_second,
        do_format_minute,
        do_format_hour,
        do_format_day,
        do_format_date,
        do_format_month,
        d3_svg,
        d3_paths,
        d3_color,
        d3_arc
        ;

    return {
        'init' : _.once( do_init )
    };

});

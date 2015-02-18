define([
    'bootstrap',
    'underscore',
    'd3'
], function (
    $,
    _,
    d3
) { 'use strict';

    function tick() {

        function place_and_update_tooltip (_data, _index) {
            var xy = d3.mouse(document.documentElement);
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

        // store for reference
        var previousValue = [];
        time_model = get_the_time();

        d3_paths
            .each(function(_data, _index) {
                previousValue[_index] = _data.value;
            })
            .data(time_model)
            .each(function(_data, _index) {
                _data.previousValue = previousValue[_index];
            });

        d3_paths.select('path')
            .on('mousemove', show_tooltip )
            .on('mouseout', hide_tooltip )
            .on('mouseup', toggle_tooltip )
            .transition()
            .ease('back')
            .attrTween('d', function(_data) {
                var i = d3.interpolateNumber(_data.previousValue, _data.value);
                return function(_tween) {
                    _data.value = i(_tween);
                    return d3_arc(_data);
                };
            })
            .style('fill', function(_data) {
                return d3_color(_data.value);
            });

        if ($tooltip.is('.in')) {
            fn_refreshtip();
        }

        timeout = _(tick).delay(1000 - _.now() % 1000);
        // console.log(counter++);
    }
    // var counter = 0;

    function get_the_time() {
        var now = new Date();
        return [{
            'index': 0.7,
            'text': formatSecond(now),
            'value': now.getSeconds() / 60
        }, {
            'index': 0.6,
            'text': formatMinute(now),
            'value': now.getMinutes() / 60
        }, {
            'index': 0.5,
            'text': formatHour(now),
            'value': now.getHours() / 24
        }, {
            'index': 0.3,
            'text': formatDay(now),
            'value': now.getDay() / 7
        }, {
            'index': 0.2,
            'text': formatDate(now),
            'value': (now.getDate() - 1) / (32 - new Date(now.getYear(), now.getMonth(), 32).getDate())
        }, {
            'index': 0.1,
            'text': formatMonth(now),
            'value': now.getMonth() / 12
        }];
    }

    function create_the_clock(_d3_selection, _width, _height) {

        var d3_group = this
            .attr({
                'width': _width,
                'height': _height,
            })
            .append('g')
            .attr({
                'id': 'id-svg-clock-g',
                'class': 'mcf-fade-in',
                'transform': 'translate(' + _width / 2 + ',' + _height / 2 + ')',
            });

        d3_paths = d3_group.selectAll('g')
            .data(get_the_time)
            .enter().append('g');

        d3_paths.append('path');

        radius = Math.min(_width, _height) / 2;
    }

    function empty_the_splash() {
        // empty
        this.selectAll('*').remove();
    }

    function fn_refreshtip() {
        // var index = $tooltip.attr('data-time');
        // var text = time_model[index].text;
        // $tooltip_content.text( text );
        $tooltip_content.text(time_model[$tooltip.attr('data-time')].text);
    }

    function update_front_splash() {
        clearTimeout(timeout);
        // empty
        d3_svg.call(empty_the_splash)
            .call(create_the_clock, $container.width(), $container.height());

        d3.transition().each(tick);
    }

    function initialize_the_front_splash() {
        $container = $(selector);
        formatSecond = d3_time_format('%S s');
        formatMinute = d3_time_format('%I:%M %p');
        formatHour = d3_time_format('%I %p');
        formatDay = d3_time_format('%a, %b %d');
        formatDate = d3_time_format('%b %d');
        formatMonth = d3_time_format('%b %Y');

        d3_color = d3.scale.linear()
            .range(['hsl(180,100%,75%)', 'hsl(360,100%,75%)'])
            .interpolate(function(_arg1, _arg2) {
                var i = d3.interpolateString(_arg1, _arg2);
                return function(_text) {
                    return d3.hsl(i(_text));
                };
            });

        d3_arc = d3.svg.arc()
            .startAngle(0)
            .endAngle(function(_data) {
                return _data.value * 2 * Math.PI;
            })
            .innerRadius(function(_data) {
                return _data.index * radius;
            })
            .outerRadius(function(_data) {
                return (_data.index + spacing) * radius;
            });

        d3_svg = d3.select(selector).append('svg')
            .attr('id', 'id-svg-clock');

        $tooltip = $($.fn.tooltip.Constructor.DEFAULTS.template)
            .addClass('top mcf-tooltip fade')
            .prependTo(document.body);

        $tooltip_content = $tooltip.find('.tooltip-inner');

        $(window).resize(update_front_splash_svg).resize();
    }

    var spacing = 0.09,
        selector = '#id-front-splash',
        d3_time_format = d3.time.format,
        update_front_splash_svg = _(update_front_splash).debounce(250),
        time_model,
        timeout,
        radius,
        $container,
        $tooltip,
        $tooltip_content,
        formatSecond,
        formatMinute,
        formatHour,
        formatDay,
        formatDate,
        formatMonth,
        d3_svg,
        d3_paths,
        d3_color,
        d3_arc;

    return {
        'init' : _.once(initialize_the_front_splash)
    };

});

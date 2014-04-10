(function (MCF, $, _, d3) {

    function tick() {
        // store for reference
        var previousValue=[];

        fields
            .each(function(_data, _index ) {
                previousValue[_index] = _data.value;
            })
            .data( get_the_time )
            .each(function(_data, _index ) {
                _data.previousValue = previousValue[_index];
            })
            ;

        fields.select('path')
            .on('mousemove', function ( _data ){

                $tooltip.removeClass('hidden')
                    .css({
                        'top': ( d3.event.pageY - $tooltip.height()*1.5 ),
                        'left': ( d3.event.pageX - $tooltip.width()/2 ),
                    })
                    .find('.tooltip-inner')
                    .text( _data.text )
                    ;
            })
            .on('mouseout', function ( ){
                $tooltip.addClass('hidden');
            })
            .transition()
            .ease('back')
            .attrTween('d', function (_data) {
                var i = d3.interpolateNumber(_data.previousValue, _data.value);
                return function(_tween) {
                    _data.value = i(_tween);
                    return arc(_data);
                };
            })
            .style('fill', function (_data) {
                return color(_data.value);
            })
            ;

        timeout = _(tick).delay( 1000 - _.now() % 1000 );
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

    function create_the_clock ( _d3_selection, _width, _height  ) {
        radius = Math.min( _width, _height ) / 2;

        var d3_group = this.attr({
            'width' : _width,
            'height' : _height,
        }).append('g')
            .attr({
                'id' : 'id-svg-clock-g',
                'class' : 'mcf-fade-in',
                'transform' : 'translate(' + _width / 2 + ',' + _height / 2 + ')',
            })
            ;

        fields = d3_group.selectAll('g')
            .data( get_the_time )
            .enter().append('g')
            ;

        fields.append('path');

    }

    function empty_the_splash () {
        // empty
        this.selectAll('*').remove();
    }

    function update_front_splash() {
        clearTimeout(timeout);
        // empty
        svg.call(empty_the_splash)
            .call(create_the_clock, $container.width(), $container.height() )
            ;

        d3.transition().each(tick);
    }

    function initialize_the_front_splash (){
        $container = $(selector);
        formatSecond = d3_time.format('%S s');
        formatMinute = d3_time.format('%I:%M %p');
        formatHour = d3_time.format('%I %p');
        formatDay = d3_time.format('%a, %b %d');
        formatDate = d3_time.format('%b %d');
        formatMonth = d3_time.format('%b %Y');

        color = d3.scale.linear()
            .range(['hsl(180,100%,75%)', 'hsl(360,100%,75%)'])
            .interpolate(function ( _arg1, _arg2 ) {
                var i = d3.interpolateString( _arg1, _arg2 );
                return function ( _text ) {
                    return d3.hsl(i( _text ));
                };
            })
            ;

        arc = d3.svg.arc()
            .startAngle(0)
            .endAngle(function(_data) {
                return _data.value * 2 * Math.PI;
            })
            .innerRadius(function(_data) {
                return _data.index * radius;
            })
            .outerRadius(function(_data) {
                return (_data.index + spacing) * radius;
            })
            ;

        svg = d3.select(selector).append('svg')
            .attr('id', 'id-svg-clock')
            ;

        $tooltip = $($.fn.tooltip.Constructor.DEFAULTS.template)
            .addClass('top in mcf-tooltip hidden')
            .prependTo( 'body' )
            ;

        $(window).resize( update_front_splash_svg ).resize();
    }

    var spacing = 0.09,
        d3_time = d3.time,
        selector = '#id-front-splash',
        update_front_splash_svg,
        timeout,
        fields,
        svg,
        radius,
        $container,
        $tooltip,
        formatSecond,
        formatMinute,
        formatHour,
        formatDay,
        formatDate,
        formatMonth,
        color,
        arc
        ;

    // wrap to save load time
    $(function(){
        update_front_splash_svg = _(update_front_splash).debounce(300);
        $(document).on('mcf.init-splash', _(initialize_the_front_splash).once() );
        // MCF.initFrontSplash();

    });

}).call(this, this.MCF || ( this.MCF = {} ), this.jQuery, this._, this.d3 );



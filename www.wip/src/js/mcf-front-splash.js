(function ($, MCF, _, d3) {

    function tick() {
        field = field
            .each(function(d) {
                this._value = d.value;
            })
            .data(fields)
            .each(function(d) {
                d.previousValue = this._value;
            });

        field.select("path")
            .transition()
            .ease('back')
            .attrTween("d", arcTween)
            .style("fill", function(d) {
                return color(d.value);
            });

        field.select("text")
            .attr("dy", function(d) {
                return d.value < 0.5 ? "-.5em" : "1em";
            })
            .text(function(d) {
                return d.text;
            })
            .transition()
            .ease('back')
            .attr("transform", function(d) {
                return "rotate(" + 360 * d.value + ")" + "translate(0," + -(d.index + spacing / 2) * radius + ")" + "rotate(" + (d.value < 0.5 ? -90 : 90) + ")";
            });

        setTimeout(tick, 1000 - _.now() % 1000);
    }

    function arcTween(d) {

        var i = d3.interpolateNumber(d.previousValue, d.value);
        return function(t) {
            d.value = i(t);
            return arc(d);
        };
    }

    function fields() {
        var now = new Date();
        return [{
            index: 0.7,
            text: formatSecond(now),
            value: now.getSeconds() / 60
        }, {
            index: 0.6,
            text: formatMinute(now),
            value: now.getMinutes() / 60
        }, {
            index: 0.5,
            text: formatHour(now),
            value: now.getHours() / 24
        }, {
            index: 0.3,
            text: formatDay(now),
            value: now.getDay() / 7
        }, {
            index: 0.2,
            text: formatDate(now),
            value: (now.getDate() - 1) / (32 - new Date(now.getYear(), now.getMonth(), 32).getDate())
        }, {
            index: 0.1,
            text: formatMonth(now),
            value: now.getMonth() / 12
        }];
    }

    // Avoid shortest-path interpolation.
    function interpolateHsl(a, b) {
        var i = d3.interpolateString(a, b);
        return function(t) {
            return d3.hsl(i(t));
        };
    }

    function update_front_splash(){
        width = $container.width();
        height = $container.height();

        svg
        .transition().duration(250)
        .attr('width', width)
        .attr('height', height)
            .select('#id-svg-clock-g')
            .transition().duration(250)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            ;
    }

    function initialize_the_front_splash (){
        svg = d3.select(selector).append('svg')
            .attr({
                'id' : 'id-svg-clock',
                'width': width,
                'height': height,
            });

        var d3_g = svg.append('g')
            .attr( 'id' ,'id-svg-clock-g' )
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
            ;

        field = d3_g.selectAll("g")
            .data(fields)
            .enter().append("g")
            ;

        field.append("path")
            .append("text")
            ;

        d3.transition().duration(0).each(tick);

        $container = $(selector);
        $(window).resize( update_front_splash_svg ).resize();
    }

    var width = 480,
        height = 400,
        radius = Math.min(width, height) / 1.9,
        spacing = 0.09,
        d3_time = d3.time,
        selector = '#id-front-splash',
        field,
        svg,
        $container
        ;

    var formatSecond = d3_time.format("%S s"),
        formatMinute = d3_time.format("%M m"),
        formatHour = d3_time.format("%H h"),
        formatDay = d3_time.format("%a"),
        formatDate = d3_time.format("%d d"),
        formatMonth = d3_time.format("%b");

    var color = d3.scale.linear()
        .range(['hsl(-180,50%,50%)', 'hsl(180,50%,50%)'])
        .interpolate(interpolateHsl);

    var arc = d3.svg.arc()
        .startAngle(0)
        .endAngle(function(d) {
            return d.value * 2 * Math.PI;
        })
        .innerRadius(function(d) {
            return d.index * radius;
        })
        .outerRadius(function(d) {
            return (d.index + spacing) * radius;
        });

    var update_front_splash_svg = _(update_front_splash).debounce(300);

    MCF.initFrontSplash = _(initialize_the_front_splash).once();

}).call(this, this.jQuery, this.MCF || ( this.MCF = {} ), this._, this.d3 );



Vue.component("d3-charts", {
    template:`<div class="d-pie">
        <div id="d3-chart"> </div>
    </div>`,

    data() {
        return {
            dataset: [],
              width: 960,
              height: 500 
          }
      },

    created() {
      
    },
    mounted () {
        var dataset, _t = this;
        /* d3.csv('weekdays.csv')
        .then(function(ds) {
            ds.forEach(function(d) {
                _t.dataset.push({
                    'name':d.name,
                    'value':d.value
                })
            });
        })
        .then(function(ds) {

            _t.dataset.forEach((d) => {
                d.value = +d.value; // calculate count as we iterate through the data
                d.enabled = true; // add enabled property to track which entries are checked
            });
            _t.renderChart(_t.dataset)
        }); */

        var dataset = [{"name":"Monday","value":379130,"enabled":true},{"name":"Tuesday","value":424923,"enabled":true},{"name":"Wednesday","value":430728,"enabled":true},{"name":"Thursday","value":432138,"enabled":true},{"name":"Friday","value":428295,"enabled":true},{"name":"Saturday","value":368239,"enabled":true},{"name":"Sunday","value":282701,"enabled":true}]
        this.renderChart(dataset)
    },
    methods: {
        renderChart(dataset) {     
            var width = 360;
            var height = 360;
            var radius = Math.min(width, height) / 2;
            var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);
    
            var svg = d3.select('#d3-chart')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' +
                    (width / 2) + ',' + (height / 2) + ')');
    
            var donutWidth = 75;
    
            var arc = d3.arc()
                .innerRadius(radius-donutWidth) // NEW
                .outerRadius(radius);
    
                
    
    
    
    
            var tooltip = d3.select('#line-chart')
                .append('div')
                .attr('class', 'tooltip');
    
            tooltip.append('div')
                .attr('class', 'name');
    
            tooltip.append('div')
                .attr('class', 'value');
    
            tooltip.append('div')
                .attr('class', 'percent');
    
                var pie = d3.pie()
                    .value(function(d) {
                        return d.value;
                    })
                    .sort(null);
    
                var path = svg.selectAll('path')
                    .data(pie(dataset))
                    .enter()
                    .append('path')
                    .attr('d', arc)
                    .attr('fill', function(d, i) {
                        return color(d.data.name);
                    })
                    .each(function(d) {
                        this._current = d;
                    });
    
                var legendRectSize = 18;
    
                var legendSpacing = 4;
    
                var legend = svg.selectAll('.legend')
                    .data(color.domain())
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', function(d, i) {
                        var height = legendRectSize + legendSpacing;
                        var offset = height * color.domain().length / 2;
                        var horz = -2 * legendRectSize;
                        var vert = i * height - offset;
                        return 'translate(' + horz + ',' + vert + ')';
                    });
    
                legend.append('rect')
                    .attr('width', legendRectSize)
                    .attr('height', legendRectSize)
                    .style('fill', color)
                    .style('stroke', color)
                    .on('click', function(name) {
    
                        var rect = d3.select(this);
                        var enabled = true;
                        var totalEnabled = d3.sum(dataset.map(function(d) {
                            return (d.enabled) ? 1 : 0;
                        }));
                        if (rect.attr('class') === 'remove') {
                            rect.attr('class', '');
                        } else {
                            if (totalEnabled < 2) return;
                            rect.attr('class', 'remove');
                            enabled = false;
                        }
    
                        pie.value(function(d) {
                            if (d.name === name) d.enabled = enabled;
                            return (d.enabled) ? d.value : 0;
                        });
    
                        path = path.data(pie(dataset));
    
                        path.transition()
                            .duration(750)
                            .attrTween('d', function(d) {
                                var interpolate = d3.interpolate(this._current, d);
                                this._current = interpolate(0);
                                return function(t) {
                                    return arc(interpolate(t));
                                };
                            });
                    });
    
                legend.append('text')
                    .attr('x', legendRectSize + legendSpacing)
                    .attr('y', legendRectSize - legendSpacing)
                    .text(function(d) {
                        return d;
                    });
    
                path.on('mouseover', function(d) {
                    var total = d3.sum(dataset.map(function(d) {
                        return (d.enabled) ? d.value : 0;
                    }));
    
                    var percent = Math.round(1000 * d.data.value / total) / 10;
                    tooltip.select('.name').html(d.data.name);
                    tooltip.select('.value').html(d.data.value);
                    tooltip.select('.percent').html(percent + '%');
                    tooltip.style('display', 'block');
                });
                path.on('mouseout', function() {
                    tooltip.style('display', 'none');
                });
    
                path.on('mousemove', function(d) {
                    tooltip.style('top', (d3.event.pageY + 10) + 'px')
                        .style('left', (d3.event.pageX + 10) + 'px');
                });
        }
    },
  })

  const app = new Vue({
    el: '#line-chart',
});
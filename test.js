Vue.component("d3-charts", {
    template:`<div class="d-pie">
        <svg id="chartcontainer" v-bind:width="settings.width" v-bind:height="settings.height"></svg>
        <div id="tooltip" style="opacity:0">
            <p><span id="value">100</span></p>
        </div>
    </div>`,
    data() {
        return {
            data: [],
            settings: {
                width: 350,
                height: 400,
                radius: 140
            },
            svg: null,
            g: null,
            color: null,
            pie: null,
            path: null,
            label: null,
            arc: null,
            label: null

        }
    },
    mounted() {
        axios({
            type: "GET",
            url:
              window.config.apiUrl +
              "security/allmapping/search/visualization/bibliography",
            data: null,
            headers: { userSessionId: window.config.userSessionId },
            contentType: "application/json"
          }).then(response => {
              console.log(response);
              this.renderChart(response)

          });
    },
    created() {
      
    },
    methods: {
        renderChart(response) {
            response.data.map(val => {
                if(val.tree_level === 1) {
                    this.data.push({
                        'name':val.name,
                        'value':val.value
                    })
                }
            });
            this.data.forEach((d) => {
                d.value = +d.value; // calculate count as we iterate through the data
                d.enabled = true; // add enabled property to track which entries are checked
            });
            console.log('data ----', this.data)
            this.svg = d3.select('#chartcontainer');
            this.g = this.svg.append("g")
                   .attr("transform", `translate(${this.settings.width/2}, ${this.settings.height/2})`);
            let arc_name = this.data.map(d => d.name); 
            this.color = d3.scaleOrdinal().domain([arc_name]).range(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);
            this.pie = d3.pie().value(function(d) { 
                return d.value; 
            });

            this.path = d3.arc()
                    .outerRadius(this.settings.radius - 10)
                    .innerRadius(0);

            this.label = d3.arc()
                  .outerRadius(this.settings.radius)
                  .innerRadius(this.settings.radius - 80);
        
                  
            this.arc = this.g.selectAll(".arc")
                 .data(this.pie(this.data))
                 .enter().append("g")
                 .attr("class", "arc")
                 .on("mouseover", function (d) {
                     console.log('mouse over', d);
                     console.log(d3.select("#tooltip"));
                    d3.select("#tooltip")
                        .style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY + "px")
                        .style("opacity", 1)
                        .select("#value")
                        .text(`${d.data.name}: ${d.value}`);
                 })
                 .on("mouseout", function () {
                    // Hide the tooltip
                    d3.select("#tooltip")
                        .style("opacity", 0);
                  });
                 

            this.arc.append("path")
            .attr("d", this.path)
            .attr("fill", (d) => { 
                console.log('fill --->', d)
                return this.color(d.data.name); 
            })
            .each(function(d) {
                this._current = d;
            });
             
            this.arc.append("text")
             .attr("transform", (d) => { 
                      return "translate(" + this.label.centroid(d) + ")"; 
              })
             .text((d) => { return d.data.name; });

             this.svg.append("g")
             .attr("transform", "translate(" + (this.settings.width / 2 - 50) + "," + 30 + ")")
             .append("text")
             .text("bibliography")
             .attr("class", "title");

             const legend = this.svg.append('g')
             .attr('class', 'legend')
             .attr('transform', 'translate(20,0)');
   
           const lg = legend.selectAll('g')
             .data(this.data)
             .enter()
             .append('g')
             .attr('transform', (d,i) => `translate(${i * 100},${this.settings.height - 25})`);
   
           lg.append('rect')
             .style('fill', d => this.color(d.name))
             .style('stroke', d => this.color(d.name))
             .attr('x', 0)
             .attr('y', 0)
             .attr('width', 10)
             .attr('height', 10)
             .on('click', (name, i, n) => {
                 var rect = d3.select(n[i]);
                 console.log('rect------', rect);
                 var enabled = true;
                 var totalEnabled = d3.sum(this.data.map((d) => { 
                 return (d.enabled) ? 1 : 0; 
                }));
                console.log('totalEnabled$$$$$$$$',totalEnabled)
                console.log("gdhjgjhgff", rect.attr('class'),'disabled')
                if (rect.attr('class') === 'disabled') { // if class is disabled
                    console.log('fired ------ if')
                    rect.attr('class', ''); // remove class disabled
                  } else { 
                    if (totalEnabled < 2) return; // if less than two labels are flagged, exit
                    rect.attr('class', 'disabled'); // otherwise flag the square disabled
                    enabled = false; // set enabled to false
                  }
                  console.log("gdhjgjhgff", rect.attr('class'),'disabled')
              
                  this.pie.value((d) => { 
                      console.log(d.value)
                    if (d.name === name.name) d.enabled = enabled; // if entry label matches legend label
                    console.log(d.name, name.name, d.enabled);
                      return (d.enabled) ? d.value : 0; // update enabled property and return count or 0 based on the entry's status
                  });
                  this.arc = this.arc.data(this.pie(this.data)); // update pie with new data
                  this.arc.transition() // transition of redrawn pie
                    .duration(750) // 
                    .attrTween('d', (d) => { // 'd' specifies the d attribute that we'll be animating
                    console.log('d', d);
                      var interpolate = d3.interpolate(this._current, d); // this = current path element
                      this._current = interpolate(0); // interpolate between current value and the new value of 'd'
                      return (t) => {
                        return this.path(interpolate(t));
                      };
                    });
             })
   
           lg.append('text')
             .style('font-family', 'Georgia')
             .style('font-size', '13px')
             .attr('x', 17.5)
             .attr('y', 10)
             .text(d => d.name);
   
        }
    },
    watch: {
        // data(val) {
        //  if (val){
        //    this.renderChart()
        //  }
        // },
        pie(val) {
            console.log(val);
        }
       }
});
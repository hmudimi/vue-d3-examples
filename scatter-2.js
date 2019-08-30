var d3Pie = {
    template: `<div class="d-pie">
        <div id="d3-chart"></div>
        <div id="tooltip" style="opacity:0">
            <p><span id="value">100</span></p>
        </div>
    </div>`,
    props: {
        dataset: Array,
        onClick: Function
    },

    data() {
        return {
            width: 960,
            height: 500,
        }
    },

    created() {

    },
    updated() {
        this.updadeDateset();
        this.renderChart(this.dataset)
    },
    mounted() {
        this.updadeDateset();
        this.renderChart(this.dataset)
    },
    methods: {
        updadeDateset() {
            this.dataset.forEach((d) => {
                d.value = +d.value; // calculate count as we iterate through the data
                d.enabled = true; // add enabled property to track which entries are checked
            });
        },
        renderChart(dataset) {
            var width = 350;
            var height = 400;
            var radius = 140;
            var color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c', '#e4651c']);

            var svg = d3.select('#d3-chart')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' +
                    (width / 2) + ',' + (height / 2) + ')');

            svg.append("g")
                .attr("transform", "translate(" + -(width / 2 - 130) + "," + -180 + ")")
                .append("text")
                .text("bibliography")
                .attr("class", "title");

            svg.append("g")
                .attr("transform", "translate(" + -(width / 2 - 210) + "," + -180 + ")")
                .append("text")
                .attr("id", "expand")
                .text("\uf065")
                .style("font-family", "FontAwesome")

            var donutWidth = 65;

            var arc = d3.arc()
                .innerRadius(radius - donutWidth) // NEW
                .outerRadius(radius);


            var arcOver = d3.arc()
                .innerRadius(radius - donutWidth)
                .outerRadius(140 + 20);

            var pie = d3.pie()
                .value(function (d) {
                    return d.value;
                })
                .sort(null);

            var path = svg.selectAll('path')
                .data(pie(dataset))
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', function (d, i) {
                    return color(d.data.name);
                })
                .each(function (d) {
                    this._current = d;
                });

            var legendRectSize = 18;

            var legendSpacing = 4;

            var legend = svg.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function (d, i) {
                    var height = legendRectSize + legendSpacing;
                    var offset = height * color.domain().length / 2;
                    var horz = -2 * legendRectSize;
                    var vert = i * height - offset;
                    return 'translate(' + horz + ',' + vert + ')';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .attr('fill', color)
                .style('stroke', color)
                .on('click', function (name) {
                    var rect = d3.select(this);
                    var enabled = true;
                    var totalEnabled = d3.sum(dataset.map(function (d) {
                        return (d.enabled) ? 1 : 0;
                    }));

                    if (rect.attr('class') === 'remove') {
                        rect.attr('class', '');
                        rect.style('fill', color);

                    } else {
                        if (totalEnabled < 2) return;
                        rect.attr('class', 'remove');
                        rect.style('fill', "#fff");
                        enabled = false;
                    }


                    pie.value(function (d) {
                        if (d.name === name) d.enabled = enabled;
                        return (d.enabled) ? d.value : 0;
                    });

                    path = path.data(pie(dataset));

                    path.transition()
                        .duration(750)
                        .attrTween('d', function (d) {
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function (t) {
                                return arc(interpolate(t));
                            };
                        });
                });

            // legend.on('mouseover', function(d){
            //     d3.select(this).transition()
            //      .duration(1000)
            //      .attr("d", arcOver);
            // })
            // .on('mouseout', function(d){
            //     d3.select(this).transition()
            //       .duration(1000)
            //       .attr("d", arc);
            // })

            legend.append('text')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .text(function (d) {
                    return d;
                });

            path.on('mouseover', function (d) {
                d3.select("#tooltip")
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px")
                    .style("opacity", 1)
                    .select("#value")
                    .text(`${d.data.name}: ${d.value}`);

                d3.select(this).transition()
                    .duration(1000)
                    .attr("d", arcOver);
            });
            path.on('mouseout', function () {
                // Hide the tooltip
                d3.select("#tooltip")
                    .style("opacity", 0);

                d3.select(this).transition()
                    .duration(1000)
                    .attr("d", arc);
            });
            path.on('click', (d) => {
                this.onClick(d.data);
                // let urlyear =
                //     config.apiUrl +
                //     `${
                //     config.apiContextPath
                //     }security/allmapping/search/visualization/yearwise`;
                // axios({
                //     type: "GET",
                //     url: urlyear,
                //     data: {},
                // })
                //     .then(response => {
                //         return response;
                //     })
            })

            //expanding chart for large view
            // var chartmodal = document.getElementById('myModal');
            // var expandicon = d3.select("#expand");
            // console.log("m--", chartmodal, "e---", expandicon);

            // window.onclick = function(event) {
            //     if (event.target == chartmodal) {
            //         chartmodal.style.display = "none";
            //     }
            // }
            // expandicon.on("click", function(d){
            //     $("#myModal").show();
            //   });

        }
    },
    watch: {
        dataset(newValue) {
            d3.selectAll("#d3-chart svg").remove();
            this.updadeDateset();
            this.renderChart(this.dataset)
        }
    }
};

var d3ScatterPlot = {
    template: `<div id="scatter-load">
    </div>`,
    props: {
        dataset: Array,
        onClick: Function
    },
    data() {
        return {
        }
    },
    mounted() {
        this.showScatterPlot(this.dataset);
    },
    methods: {
        showScatterPlot(data) {
            var margins = {
                "left": 40,
                    "right": 30,
                    "top": 30,
                    "bottom": 30
            };
            
            var width = 375;
            var height = 375;
            
            var colors = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c', '#e4651c']);
        
            var svg = d3.select("#scatter-load")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");
        
            var x = d3.scalePoint().range([0, width - margins.left - margins.right]).domain(this.dataset.map(function(d) { return d.name; })).padding(0.4);

            var y = d3.scaleLog()
                        .domain(d3.extent(this.dataset, function (d) {
                            return d.value;
                        }))
                        .range([height - margins.top - margins.bottom, 0]);
        
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + y.range()[0] + ")");
            svg.append("g")
            .attr("class", "y axis");
        
            svg.append("text")
                .attr("fill", "#414241")
                .attr("text-anchor", "end")
                .attr("x", width / 2)
                .attr("y", height - 35)
                .text("Name");
        
        
            var xAxis = d3.axisBottom(x)
                            .tickPadding(2);
            var yAxis = d3.axisLeft(y)
                            .tickPadding(2);
        
            svg.selectAll("g.y.axis").call(yAxis);
            svg.selectAll("g.x.axis").call(xAxis);
        
            var chocolate = svg.selectAll("g.node")
                                .data(this.dataset, function (d) {
                                    return d.name;
                                });
            
            var chocolateGroup = chocolate.enter()
                                    .append("g")
                                    .attr("class", "node")
                                    .attr('transform', function (d) {
                                        return "translate(" + x(d.name) + "," + y(d.value) + ")";
                                    });
        
            chocolateGroup.append("circle")
                .attr("r", 5)
                .attr("class", "dot")
                .style("fill", function (d) {
                        return colors(d.name);
                })
                .on('click', (d) => {
                    console.log('d', d);
                    
                    this.onClick(d);
                });
        
            chocolateGroup.append("text")
                .style("text-anchor", "middle")
                .attr("dy", -10)
                .text(function (d) {
                    return d.name;
                });   
          
        }
    },
    watch: {
        dataset(newValue) {
            d3.selectAll("#scatter-load svg").remove();
            this.showScatterPlot(this.dataset)
        }
    }
};

Vue.component("d3-widget", {
    template: `<div class="d-pie-w">
            <button v-on:click="backClick"><--</button>
            <button v-on:click="chart='pie'">Pie</button>
            <button v-on:click="chart='scatter'">Scatter</button>
            <div v-if="chart==='pie'">
                <d3-pie v-bind:dataset="dataset" v-bind:onClick="onClick"/>
            </div>
            <div v-if="chart==='scatter'">
                <d3-scatter-plot v-bind:dataset="dataset" v-bind:onClick="onClick"/>
            </div>
    </div>`,
    components: {
        d3ScatterPlot,
        d3Pie
    },
    data() {
        return {
            chart: 'scatter',
            ds: [{ "id": 1, "name": "JOURNAL", "tree_level": 1, "display_order": null, "parent_or_leaf_or_both": "Parent", "parent_id": null, "value": 4346 }, { "id": 2, "name": "OTHERS", "tree_level": 1, "display_order": null, "parent_or_leaf_or_both": "Parent", "parent_id": null, "value": 28 }, { "id": 3, "name": "PATENT", "tree_level": 1, "display_order": null, "parent_or_leaf_or_both": "Parent", "parent_id": null, "value": 18526 }, { "id": 4, "name": "A", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Both", "parent_id": 1, "value": 144 }, { "id": 5, "name": "B", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Both", "parent_id": 1, "value": 1966 }, { "id": 6, "name": "C", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Both", "parent_id": 1, "value": 285 }, { "id": 7, "name": "D", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Both", "parent_id": 1, "value": 23 }, { "id": 8, "name": "E", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Both", "parent_id": 1, "value": 66 }, { "id": 9, "name": "F", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Both", "parent_id": 1, "value": 1 }, { "id": 13, "name": "I", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Both", "parent_id": 1, "value": 1 }, { "id": 14, "name": "J", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Both", "parent_id": 1, "value": 1528 }, { "id": 16, "name": "L", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Parent", "parent_id": 1, "value": 61 }, { "id": 17, "name": "M", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Both", "parent_id": 1, "value": 153 }, { "id": 18, "name": "N", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Both", "parent_id": 1, "value": 25 }, { "id": 20, "name": "P", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Both", "parent_id": 1, "value": 139 }, { "id": 33, "name": "Company", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 2, "value": 1 }, { "id": 40, "name": "Meetings", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 2, "value": 19 }, { "id": 42, "name": "OTHERS", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 2, "value": 5 }, { "id": 45, "name": "Product Leaflet", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 2, "value": 1 }, { "id": 48, "name": "Society", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 2, "value": 1 }, { "id": 52, "name": "Websites", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 2, "value": 3 }, { "id": 53, "name": "EP", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 3, "value": 2004 }, { "id": 55, "name": "US", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 3, "value": 11355 }, { "id": 57, "name": "WO", "tree_level": 2, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 3, "value": 5172 }, { "id": 74, "name": "ACS Med Chem Lett", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 4, "value": 66 }, { "id": 684, "name": "Annu. Rep. Med. Chem.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 4, "value": 19 }, { "id": 863, "name": "Arch. Pharm. (Weinheim)", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 4, "value": 59 }, { "id": 1029, "name": "Biochem. Pharmacol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 5, "value": 2 }, { "id": 1079, "name": "Biol. Psychiatry.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 5, "value": 2 }, { "id": 1114, "name": "Bioorg. Med. Chem.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 5, "value": 644 }, { "id": 1115, "name": "Bioorg. Med. Chem. Lett.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 5, "value": 1169 }, { "id": 1206, "name": "BMC Neurosci.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 5, "value": 1 }, { "id": 1251, "name": "Brain Res.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 5, "value": 2 }, { "id": 1309, "name": "Br. J. Pharmacol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 5, "value": 8 }, { "id": 1361, "name": "Bull. Korean Chem. Soc.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 5, "value": 138 }, { "id": 1573, "name": "Cent. Nerv. Syst. Agents Med. Chem.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 6, "value": 1 }, { "id": 1599, "name": "Chembiochem", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 6, "value": 2 }, { "id": 1605, "name": "Chem. Biol. Drug Des.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 6, "value": 6 }, { "id": 1649, "name": "ChemMedChem", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 6, "value": 12 }, { "id": 1785, "name": "Clin. Exp. Gastroenterol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 6, "value": 1 }, { "id": 2072, "name": "Curr. Drug Targets CNS Neurol. Disord.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 6, "value": 110 }, { "id": 2101, "name": "Curr. Med. Chem.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 6, "value": 116 }, { "id": 2106, "name": "Curr. Med. Chem. CNS. Agents.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 6, "value": 4 }, { "id": 2119, "name": "Curr. Opin. Chem. Biol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 6, "value": 13 }, { "id": 2140, "name": "Curr. Pharm. Des.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 6, "value": 4 }, { "id": 2152, "name": "Curr. Top. Med. Chem.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 6, "value": 16 }, { "id": 2327, "name": "Drug Data Rep.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 7, "value": 19 }, { "id": 2381, "name": "Drugs Future", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 7, "value": 5 }, { "id": 2634, "name": "Eur. J. Clin. Invest.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 8, "value": 1 }, { "id": 2658, "name": "Eur. J. Med. Chem.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 8, "value": 57 }, { "id": 2674, "name": "Eur. J. Pharmacol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 8, "value": 5 }, { "id": 2691, "name": "Eur. Neuropsychopharmacol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 8, "value": 3 }, { "id": 2950, "name": "Fundam. Clin. Pharmacol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 9, "value": 1 }, { "id": 3460, "name": "Int. J. Neuropsychopharmacol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 13, "value": 1 }, { "id": 3770, "name": "J. Biol. Chem.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 14, "value": 2 }, { "id": 4012, "name": "J. Enzyme Inhib. Med. Chem.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 14, "value": 1 }, { "id": 4183, "name": "J. Life Sci.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 14, "value": 1 }, { "id": 4206, "name": "J. Med. Chem.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 14, "value": 1356 }, { "id": 4251, "name": "J. Nat. Prod.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 14, "value": 2 }, { "id": 4483, "name": "J. Pharmacol. Exp. Ther.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 14, "value": 165 }, { "id": 4552, "name": "Jpn. J. Pharmacol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 14, "value": 2 }, { "id": 4594, "name": "J. Psychopharmacol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 14, "value": 3 }, { "id": 4603, "name": "J. Receptor Ligand Channel Res.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 14, "value": 1 }, { "id": 4758, "name": "The Journal of pharmacology and experimental therapeutics", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 14, "value": 1 }, { "id": 4891, "name": "Lett. Drug Des. Discov.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 16, "value": 61 }, { "id": 4986, "name": "Medchemcomm.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 17, "value": 8 }, { "id": 5049, "name": "Med. Res. Rev.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 17, "value": 1 }, { "id": 5147, "name": "Mini Rev. Med. Chem.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 17, "value": 64 }, { "id": 5197, "name": "Molecules", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 17, "value": 4 }, { "id": 5221, "name": "Mol. Pharmacol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 17, "value": 76 }, { "id": 5283, "name": "Nat. Cell Biol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 18, "value": 2 }, { "id": 5285, "name": "Nat. Chem. Biol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 18, "value": 4 }, { "id": 5346, "name": "Naunyn Schmiedebergs Arch. Pharmacol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 18, "value": 2 }, { "id": 5413, "name": "Neuropharmacology", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 18, "value": 7 }, { "id": 5422, "name": "Neuropsychopharmacology", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 18, "value": 8 }, { "id": 5426, "name": "Neuroreport", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 18, "value": 1 }, { "id": 5537, "name": "Nuclear medicine and biology", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 18, "value": 1 }, { "id": 5549, "name": "Nucl. Med. Biol.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 18, "value": 1 }, { "id": 5844, "name": "Pharmacol. Biochem. Behav.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 20, "value": 1 }, { "id": 5846, "name": "Pharmacological reports : PR", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 20, "value": 1 }, { "id": 5862, "name": "Pharmacol. Rev.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 20, "value": 20 }, { "id": 6136, "name": "Proc. Natl. Acad. Sci. U.S.A.", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 20, "value": 116 }, { "id": 6247, "name": "Psychopharmacology (Berl.)", "tree_level": 3, "display_order": null, "parent_or_leaf_or_both": "Leaf", "parent_id": 20, "value": 1 }],
            dataset: []
        }
    },
    mounted() {
        /* axios({
           type: "GET",
           url:
             window.config.apiUrl +
             "security/allmapping/search/visualization/bibliography",
           data: null,
           headers: { userSessionId: window.config.userSessionId },
           contentType: "application/json"
           })
           .then(function(ds) { */
        this.ds.forEach((d) => {
            if (d.tree_level === 1) {
                this.dataset.push({
                    'name': d.name,
                    'value': d.value,
                    'id': d.id,
                    'tree_level': d.tree_level,
                })
            }
        });
        // })
    },
    methods: {
        onClick(d) {
            console.log('d', d);
            let a = this.ds.filter((ds) => {
                return ds.parent_id === d.id
            })
            if (a.length > 1) {
                this.dataset = a
                this.currentParentId = d.parent_id;
                this.tree_level = d.tree_level;
            }
        },
        backClick() {
        	console.log("pID", this.currentParentId, "trww_level", this.tree_level);
            let a = this.ds.filter((ds) => {
                return ds.tree_level === this.tree_level && (ds.tree_level === 1 || ds.parent_id === this.currentParentId)
            })
            console.log("a", a);
            
            if(a.length > 1){
                this.dataset = a;
                // this.currentParentId = a[0].parent_id;
                this.tree_level = a[0].tree_level - 1;
            }
        }
    }
});
new Vue({ el: '#scatter-chart' })
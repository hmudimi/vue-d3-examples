var chocolates = [{
    "name": "Dairy Milk",
        "manufacturer": "cadbury",
        "price": 45000,
        "rating": 2
}, {
    "name": "Galaxy",
        "manufacturer": "Nestle",
        "price": 42,
        "rating": 3
}, {
    "name": "Lindt",
        "manufacturer": "Lindt",
        "price": 80,
        "rating": 4
}, {
    "name": "Hershey",
        "manufacturer": "Hershey",
        "price": 4000,
        "rating": 1
}, {
    "name": "Dolfin",
        "manufacturer": "Lindt",
        "price": 90,
        "rating": 5
}, {
    "name": "Bournville",
        "manufacturer": "cadbury",
        "price": 70,
        "rating": 2
}];

// call the method below
showScatterPlot(chocolates);

function showScatterPlot(data) {
    // just to have some space around items. 
    var margins = {
        "left": 40,
            "right": 30,
            "top": 30,
            "bottom": 30
    };
    
    var width = 500;
    var height = 500;
    
    var colors = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c', '#e4651c']);

    var svg = d3.select("#scatter-load")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    var x = d3.scaleLog()
                .domain(d3.extent(data, function (d) {
                    return d.price;
                }))
                .range([0, width - margins.left - margins.right]);

    var y = d3.scaleLinear()
                .domain(d3.extent(data, function (d) {
                    return d.rating;
                }))
                .range([height - margins.top - margins.bottom, 0]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y.range()[0] + ")");
    svg.append("g")
    .attr("class", "y axis");

    // svg.append("text")
    //     .attr("fill", "#414241")
    //     .attr("text-anchor", "end")
    //     .attr("x", width / 2)
    //     .attr("y", height - 35)
    //     .text("Price in pence (£)");


    // var xAxis = d3.axisBottom(y)
    //                 .tickPadding(2);
    // var yAxis = d3.axisLeft(x)
    //                 .tickPadding(2);
    var xAxis = d3.axisBottom(x)
                    .tickPadding(2);
    var yAxis = d3.axisLeft(y)
                    .tickPadding(2);

    svg.selectAll("g.y.axis").call(yAxis);
    svg.selectAll("g.x.axis").call(xAxis);

    var chocolate = svg.selectAll("g.node")
                        .data(data, function (d) {
                            return d.name;
                        });
    
    var chocolateGroup = chocolate.enter()
                            .append("g")
                            .attr("class", "node")
                            .attr('transform', function (d) {
                                return "translate(" + x(d.price) + "," + y(d.rating) + ")";
                            });

    chocolateGroup.append("circle")
        .attr("r", 5)
        .attr("class", "dot")
        .style("fill", function (d) {
            return colors(d.manufacturer);
    });

    chocolateGroup.append("text")
        .style("text-anchor", "middle")
        .attr("dy", -10)
        .text(function (d) {
            return d.name;
        });
}
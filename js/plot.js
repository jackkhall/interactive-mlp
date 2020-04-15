
var margin = {top: 10, right: 30, bottom: 30, left: 60},
graphWidth = (window.innerWidth / 3.25) - margin.left - margin.right,
graphHeight = (window.innerHeight / 2.25) - margin.top - margin.bottom;
var colour = d3.scaleOrdinal(d3.schemeDark2);

var scatterplot = d3.select("#scatterplot")
.append("svg")
.attr("width", graphWidth + margin.left + margin.right)
.attr("height", graphHeight + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const graph = (dataset, svg) => {
svg.selectAll("*")
.remove();

var x = d3.scaleLinear()
.domain([0, 1])
.range([0, graphWidth]);
svg.append("g")
.attr("transform", "translate(0," + graphHeight + ")")
.call(d3.axisBottom(x));

var y = d3.scaleLinear()
.domain([0, 1])
.range([graphHeight, 0]);
svg.append("g")
.call(d3.axisLeft(y));

/*
var color = d3.scaleOrdinal()
.domain(["setosa", "versicolor", "virginica"])
.range(["#440154ff", "#21908dff", "#fde725ff"]);
*/

svg.append('g')
.selectAll("dot")
.data(dataset)
.enter()
.append("circle")
.attr("cx", function (ds) {
    return x(ds.datapair[0]);
})
.attr("cy", function (ds) {
    return y(ds.datapair[1]);
})
.attr("r", 3.5)
.style("fill", function (ds) {
    switch(ds.class) {
        case 0:
            return "blue";
            break;
        case 1:
            return "green";
            break;
        default:
            return "red";
    }
    //return colour(ds.class);
});
};


function makeDataset(datapoints) {
    let data = [];
    
    do {
        let x = Math.random().toFixed(2);
        let y = Math.random().toFixed(2);
        
        if (![x, y].some(v => v > 0.4 && v < 0.6))
            if ((x < 0.5 && y > 0.5) || (x > 0.5 && y < 0.5))
                data.push({"datapair": [x, y], "class": [0]});
            else
                data.push({"datapair": [x, y], "class": [1]});
    }
    while (data.length < datapoints);

    return data;
}
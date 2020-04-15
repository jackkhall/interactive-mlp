// import {FeedForward} from '/js/feedforward.js';


var mlpWidth = window.innerWidth / 2.25,
mlpHeight = window.innerHeight / 1.75,
nodeSize = mlpHeight / 16;
var colour = d3.scaleOrdinal(d3.schemeSet1);

var svg = d3.select("#perceptron")
.append("svg")
.attr("width", mlpWidth)
.attr("height", mlpHeight);


const plot = (mlp, svg) => { /*
d3.json(data)
.then(function(graph) {
var neurons = graph.nodes;
*/
var neurons = [mlp.inputSize, mlp.hiddenSizes, mlp.outputSize]
.flat()
.reduce((acc, layer, idx) => {
    Array.from(Array(layer).keys())
    .forEach(node => acc.push({"node": node, "layer": idx + 1}))
    return acc;
}, []);
let layers = Array.from(new Set(neurons.map(x => x.layer)));

const groupByLayer = neurons.reduce((acc, it) => {
    acc[it.layer] = acc[it.layer] + 1 || 1;
    return acc;
}, {});

var nodes = Object.keys(groupByLayer)
.map(function (key) {
    return groupByLayer[key];
});
var mostNodes = Math.max.apply(null, nodes);

var xgap = mlpWidth / layers.length;
var ygap = mlpHeight / mostNodes;

neurons.map(function(node) {
    node["x"] = (node.layer - 0.5) * xgap;
    node["y"] = ((node.node + 0.5) * ygap) + ((mostNodes - groupByLayer[node.layer]) * ygap / 2);
});

let synapses = neurons.reduce((acc, it) => {
    neurons.filter(node => node.layer == it.layer + 1)
    .forEach(node => {
        acc.push({"src": it, "dest": node});
    });
    return acc;
}, []);

svg.selectAll("*")
.remove();

var synapse = svg
.selectAll(".link")
.data(synapses)
.enter()
.append("line")
.attr("class", "link")
.attr("x1", function(synapse) {
    return synapse.src.x;
})
.attr("y1", function(synapse) {
    return synapse.src.y;
})
.attr("x2", function(synapse) {
    return synapse.dest.x;
})
.attr("y2", function(synapse) {
    return synapse.dest.y;
})
.style("stroke-width", 3.5);

var node = svg
.selectAll(".node")
.data(neurons)
.enter()
.append("g")
.attr("transform", function(node) {
    return "translate(" + node.x + "," + node.y + ")";
});

var circle = node
.append("circle")
.attr("class", "node")
.attr("r", nodeSize)
.style("fill", function(node) {
    return colour(node.layer);
});

/*
node.append("text")
.attr("dx", "-.35em")
.attr("dy", ".35em")
.text(function(d) {
    return d.label;
});
*/
};//);


/*
function addHiddenLayer(layer, nodes) {
    if (mlp.hiddenSizes.length < 4)
        mlp.hiddenSizes.splice(layer, 0, nodes);
        plot(mlp, svg);
}

function delHiddenLayer(layer) {
    if (mlp.hiddenSizes.length > 1)
        mlp.hiddenSizes.splice(layer, 1);
        plot(mlp, svg);
}

function addNode(layer) {
    if (mlp.hiddenSizes[layer] < 8)
        mlp.hiddenSizes[layer]++;
        plot(mlp, svg);
}

function delNode(layer) {
    if (mlp.hiddenSizes[layer] > 1)
        mlp.hiddenSizes[layer]--;
        plot(mlp, svg);
}
*/

function run() {
    mlp.eta = parseFloat(document.getElementById('eta').value);
    mlp.epochs = parseInt(document.getElementById('epochs').value);
    mlp.hiddenSizes = [
        parseInt(document.getElementById('layer1').value),
        parseInt(document.getElementById('layer2').value),
        parseInt(document.getElementById('layer3').value),
        parseInt(document.getElementById('layer4').value)
    ].filter(nodes => nodes > 0);
    let dataset = makeDataset(parseInt(document.getElementById('datapoints').value));
    let Xfit = math.matrix(dataset.map(d => d.datapair));
    let Yfit = math.matrix(dataset.map(d => d.class)); // Yfit = Yfit.map(c => Array.isArray(c) ? c : [c])

    /*
    const input = math.matrix([[0,0], [0,1], [1,0], [1,1]]);
    const target = math.matrix([[0], [1], [1], [0]]);
    mlp.train(input, target);
    */

    mlp.train(Xfit, Yfit);
    let output = mlp.sim(Xfit)
    .toArray()
    .map(o => Math.round(o))
    output = Yfit.toArray()
    .flatMap((o, idx) => output[idx] == o ? o : 'misclassified');
    dataset.forEach((d, idx) => {
        d.class = output[idx];
    });

    let misclassified = (output.filter(c => ![0, 1].includes(c)).length / output.length).toFixed(2) * 100;
    document.getElementById('misclassified').innerText = misclassified + "% of data misclassified\n(indicated by red datapoints)";

    plot(mlp, svg);
    graph(dataset, scatterplot);
}


const mlp = new FeedForward(3);
plot(mlp, svg);
graph([], scatterplot);
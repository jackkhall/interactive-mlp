// import {random, transpose, dotMultiply, multiply, subtract, add} from '/js/math.min.js';
// import * as activations from '/js/activations.js';


function sigmoid(x, derivative = false) {     
    let fx = 1 / (1 + math.exp(-x));     
    if (derivative)         
       return fx * (1 - fx);     
    return fx; 
}

// export
class FeedForward {
    constructor(hiddenSizes, eta=.1, epochs=1e3, activation=sigmoid) {
        this.hiddenSizes = Array.isArray(hiddenSizes) ? hiddenSizes : [hiddenSizes];
        this.inputSize = 2;
        this.outputSize = 1;
        this.epochs = epochs;
        this.eta = eta;
        this.activation = activation;
    }

    train(X, T, inputSize=X.size()[1], outputSize=T.size()[1]) {
        // assert X, T typeof Matrix
        this.inputSize = inputSize;
        this.outputSize = outputSize;

        this.synapses = this.hiddenSizes
        .reduce((acc, layer, idx) => {
            let size = [layer, this.hiddenSizes[idx + 1] ?? outputSize];
            acc.push(math.random(size, -1.0, 1.0));
            return acc;
        }, [math.random([inputSize, this.hiddenSizes[0]], -1.0, 1.0)]);

        for (let i = 0; i < this.epochs; i++) {
            // forward pass, input layer is X
            let out = this.synapses
            .slice(1)
            .reduce((acc, layer, idx) => {
                acc.push(math.multiply(acc[idx], layer).map(x => this.activation(x)));
                return acc;
            }, [math.multiply(X, this.synapses[0]).map(x => this.activation(x))]);

            // backpropagation
            let error = math.subtract(T, out[out.length - 1]);
            let delta, prevLayer = null;
            this.synapses = this.synapses
            .reverse()
            .map(layer => {
                if (delta && prevLayer)
                    error = math.multiply(delta, math.transpose(prevLayer));
                delta = math.dotMultiply(error, out.pop().map(x => this.activation(x, true)));
                prevLayer = layer;

                // gradient descent
                let grad = math.multiply(delta, this.eta);
                let adjust = math.multiply(math.transpose(out[out.length - 1] ?? X), grad);
                return math.add(layer, adjust).toArray();
            })
            .reverse();
        }
    }

    sim(X) {
        let out = null;
        this.synapses.forEach(layer => out = math.multiply(out ?? X, layer).map(x => this.activation(x)));
        return out;
    }
}
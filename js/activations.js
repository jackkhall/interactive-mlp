// import {exp} from '/js/math.min.js';


export function sigmoid(x, derivative = false) {     
    let fx = 1 / (1 + math.exp(-x));     
    if (derivative)         
       return fx * (1 - fx);     
    return fx; 
}
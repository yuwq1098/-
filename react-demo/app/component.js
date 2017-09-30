'use strict';

module.exports = function() {

    var container = document.createElement('div');
    var element = document.createElement('h1');
    var vitalDom = document.createElement("span")

    vitalDom.style.color = "#f34";
    vitalDom.innerText = "喻文强11111";

    element.innerHTML = 'Hello world';

    container.appendChild(element);
    container.appendChild(vitalDom);

    return container;

};
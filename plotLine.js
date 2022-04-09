/* plotLine.js
 * v1.0.1
 * published and maintained by Dirk Winkel (https://polarwinkel.de)
 * https://github.com/polarwinkel/plotLine.js
 * This is forked from Timeline.js from Phyks
 * Authors: Phyks (http://phyks.me), Dirk Winkel (https://polarwinkel.de)

 * --------------------------------------------------------------------------------
 * "THE NO-ALCOHOL BEER-WARE LICENSE" (Revision 42):
 * Phyks (webmaster@phyks.me) and polarwinkel (it@polarwinkel.de) wrote this file.
 * As long as you retain this notice you can do whatever you want with this stuff 
 * (and you can also do whatever you want with this stuff without retaining it, but
 * that's not cool...). If we meet some day, and you think this stuff is worth it,
 * you can buy me a soda (Phyks) or a beer (polarwinkel) in return.
 * Phyks, polarwinkel
 * ---------------------------------------------------------------------------------
 */

/* Initialization :
 * arg is an object with :
 * id = id of the parent block
 * height / width = size of the svg (default 600px 450px)
 * line = none / _line_ / dashed to choose line type
 * grid = _main_ / small / both / none to show grid
 * x_axis = _true_ / false to show or hide x axis (boolean)
 * y_axis = _true_ / false to show or hide y axis (boolean)
 * x_label = _true_ / false to show or hide x labels (boolean)
 * y_label = _true_ / false to show or hide y labels (boolean)
 * drawpoints = true / false to draw points (boolean)
 * smooth = true / _false_ to use splines to smoothen the graph (boolean)
 * fill = true / _false_ to fill below the graph or not (boolean)
 */

function randId() {
    //Function that generates random id
    var id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for( var i=0; i <= 7; i++ )
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
}

function plotQuick(data, min=0, max=1) {
    if (typeof data == 'object') {
        pl = new plotLine()
        pl.addGraph('plot', 'green');
        pl.addPoints('plot', data);
        pl.draw();
    } else if (typeof data == 'string') {
        pl = new plotLine(arg = {'drawpoints': false});
        pl.addGraph('plot', 'green');
        pl.addFunction('plot', data, min, max);
        pl.draw();
    } else {
        console.log('syntax error in plotQuick');
    }
}

function plotLine(arg = {}) {
    // set values
    if (arg.height === undefined) {this.height = '450px'} else {this.height = arg.height};
    if (arg.width === undefined) {this.width = '600px'} else {this.width = arg.width};
    if (arg.line === undefined) {this.line = 'line'} else {this.line = arg.line};
    if (arg.grid === undefined) {this.grid = 'main'} else {this.grid = arg.grid};
    if (arg.x_axis === undefined) {this.x_axis = true} else {this.x_axis = arg.x_axis};
    if (arg.y_axis === undefined) {this.y_axis = true} else {this.y_axis = arg.y_axis};
    if (arg.x_label === undefined) {this.x_label = true} else {this.x_label = arg.x_label};
    if (arg.y_label === undefined) {this.y_label = true} else {this.y_label = arg.y_label};
    if (arg.drawpoints === undefined) {this.drawpoints = true} else {this.drawpoints = arg.drawpoints};
    if (arg.smooth === undefined) {this.smooth = false} else {this.smooth = arg.smooth};
    if (arg.fill === undefined) {this.fill = false} else {this.hfill = arg.fill};
    
    this.marginBottom = 10;
    this.marginTop = 10;
    this.marginLeft = 10;
    this.marginRight = 10;
    this.dashed_style = '5, 5';
    this.parent_holder = false;
    this.g = false;
    this.axis = false;
    this.graphs = [];
    this.raw_points = [];
    
    var old = window.onresize || function () {};
    var obj = this;
    
    this.ns = "http://www.w3.org/2000/svg";
    this.xlinkns = "http://www.w3.org/1999/xlink";
    
    if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")) {
        alert("ERROR : Your browser does not support embedded SVG.");
    }
    window.onresize = function() {
        old();
        obj.resize(obj.parent_holder.offsetWidth, obj.parent_holder.offsetHeight);
    }
    
    // add div-container in-place if no parent-id is given
    if (arg.id === undefined){
        this.id = randId();
        var newDiv = document.createElement('div');
        newDiv.id = this.id;
        newDiv.width = this.width;
        newDiv.height = this.height;
        var parent = document.currentScript.parentElement;
        parent.insertBefore(newDiv, document.currentScript.nextSibling);
    } else {
        this.id = arg.id;
    }
    this.parent_holder = document.getElementById(this.id);
    this.parent_holder.style.width = this.width;
    this.parent_holder.style.height = this.height;
    this.holder = this.createElement('svg:svg', { 'width': '100%', 'height': '100%' });
    this.holder.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', this.xlinkns);
    this.parent_holder.appendChild(this.holder);
    
    this.g = this.createElement('g', {'transform': 'translate(0, ' + this.parent_holder.offsetHeight + ') scale(1, -1)'});
    this.holder.appendChild(this.g);
    
    // grid:
    if(this.grid === 'small' || this.grid === 'both') {
        this.small_grid_pattern = this.createElement('pattern', { 'id': 'smallGrid'+this.id+'', 'patternUnits': 'userSpaceOnUse' });
    
        var small_grid_path = this.createElement('path', {'fill': 'none', 'stroke': 'gray', 'stroke-width': '0.5' });
        this.small_grid_pattern.appendChild(small_grid_path);
        
        this.g.appendChild(this.small_grid_pattern);
    }
    if(this.grid === 'main' || this.grid === 'both') {
        this.grid_pattern = this.createElement('pattern', { 'id': 'grid'+this.id+'', 'patternUnits': 'userSpaceOnUse' });
        
        if(this.grid === 'both') {
            var grid_rect = this.createElement('rect', {'fill': 'url(#smallGrid'+this.id+')' });
            this.grid_pattern.appendChild(grid_rect);
        }
        
        var grid_path = this.createElement('path', {'fill': 'none', 'stroke': 'gray', 'stroke-width': '1'});
        this.grid_pattern.appendChild(grid_path);
        
        this.g.appendChild(this.grid_pattern);
    }
    if(this.grid !== "none") {
        this.grid_rect = this.createElement('rect', {'width': '100%', 'height': '100%'});
        if(this.grid === 'main' || this.grid === 'both') {
            this.grid_rect.setAttribute('fill', 'url(#grid'+this.id+')');
        }
        else {
            this.grid_rect.setAttribute('fill', 'url(#smallGrid'+this.id+')');
        }
        this.g.appendChild(this.grid_rect);
    }
    
    // axis:
    var marker = this.createElement('marker', {'id': 'markerArrow', 'markerWidth': 8, 'markerHeight': 8, 'refX': 6, 'refY': 4, 'orient': 'auto' });
    var marker_path = this.createElement('path', {'d': 'M0,0 L8,4 L0,8 L2,4', 'fill': 'gray' });
    marker.appendChild(marker_path);
    this.g.appendChild(marker);
    
    if(this.x_axis === true) {
        this.xaxis = this.createElement('line', {'x1': this.marginLeft, 'y1': this.parent_holder.offsetHeight / 2, 'x2': this.parent_holder.offsetWidth - this.marginRight, 'y2': this.parent_holder.offsetHeight / 2, 'stroke': 'gray', 'stroke-width': 2, 'marker-end': 'url("#markerArrow")'});
        this.g.appendChild(this.xaxis);
    }
    if(this.y_axis === true) {
        this.yaxis = this.createElement('line', {'y1': this.marginBottom, 'x1': this.parent_holder.offsetWidth / 2, 'y2': this.parent_holder.offsetHeight - this.marginTop, 'x2': this.parent_holder.offsetWidth / 2, 'stroke': 'gray', 'stroke-width': 2, 'marker-end': 'url("#markerArrow")'});
        this.g.appendChild(this.yaxis);
    }
}

// Resize the SVG
plotLine.prototype.resize = function(new_width, new_height) {
    if(this.g !== false) {
        this.g.setAttribute('transform', 'translate(0, ' + new_height + ') scale(1, -1)');
        if(this.x_axis === true) {
            this.xaxis.setAttribute('x2', new_width - this.marginLeft - this.marginRight);
        }
        if(this.y_axis === true) {
            this.yaxis.setAttribute('y2', new_width - this.marginBottom - this.marginTop);
        }
        [].forEach.call(this.g.querySelectorAll('.label, .over, .point, .line, .graph, .legend_x'), function(el) {
            el.parentNode.removeChild(el);
        });
        this.draw();
    }
};

// Create an element "element" with the attributes "attrs"
plotLine.prototype.createElement = function (element, attrs) {
    var el = document.createElementNS(this.ns, element);
    for(attr in attrs) {
        el.setAttribute(attr, attrs[attr]);
    }
    return el;
};

// Check wether the element "element" has class "class"
plotLine.prototype.hasClass = function (element, cls) {
    return (' ' + element.getAttribute('class') + ' ').indexOf(' ' + cls + ' ') > -1;
};

// Add a new graph to the plotLine
plotLine.prototype.addGraph = function (graph, color) {
    this.graphs[graph] = color;
};

// Test wether a graph of name "graph" already exists
plotLine.prototype.hasGraph = function (graph) {
    if(typeof(this.graphs[graph]) === 'undefined') {
        return false;
    }
    else {
        return true;
    }
};

// Clear the specified graph data, or completely clear all the graph data
plotLine.prototype.clearGraph = function (graph) {
    if(typeof(graph) === 'undefined') {
        this.raw_points = [];
        this.graphs = [];
    }
    else {
        for(var i = 0; i < this.raw_points.length; i++) {
            if(this.raw_points[i].graph === graph) {
                this.raw_points[i] = undefined;
            }
        }
    }
};

// Add points to the specified graph
plotLine.prototype.addPoints = function (graph, data) {
    for(var point = 0; point < data.length; point++) {
        var insert = {'graph': graph, 'x': data[point][0], 'y': data[point][1]};
        this.raw_points.push(insert);
    }
    this.raw_points.sort(function (a, b) {
        if(a.x < b.x) {
            return -1;
        }
        else if(a.x == b.x) {
            return 0;
        }
        else {
            return 1;
        }
    });
};

// Add a function to the specified graph
plotLine.prototype.addFunction = function (graph, func, x_min=-10, x_max=10, n=100) {
    for(var point = 0; point <= n; point++) {
        var x = x_min+(x_max-x_min)/n*point;
        const F = new Function('x', 'return ' + func);
        var y = F(x);
        var insert = {'graph': graph, 'x': x, 'y': y};
        this.raw_points.push(insert);
    }
};

// Compute new coordinates, knowing the min and max value to fit the graph in the container
plotLine.prototype.newCoordinate = function(value, min, max, minValue, maxValue) {
    var a = (maxValue - minValue) / (max - min);
    return a *(value - min) + minValue;
};

// Compute new X and Y values
plotLine.prototype.getNewXY = function (minX, maxX, minY, maxY) {
    var obj = this;
    return function (x, y) {
        return {
            'x': obj.newCoordinate(x, minX, maxX, obj.marginLeft, obj.parent_holder.offsetWidth - obj.marginRight),
            'y': obj.newCoordinate(y, minY, maxY, 2*obj.marginBottom, obj.parent_holder.offsetHeight - obj.marginTop)
        };
    };
};

// Get the necessary control points to smoothen the graph, if smooth is true
plotLine.prototype.getControlPoints = function (data) {
    // From http://www.particleincell.com/wp-content/uploads/2012/06/bezier-spline.js
    var p1 = new Array();
    var p2 = new Array();
    var n = data.length - 1;
    
    /*rhs vector*/
    var a = new Array();
    var b = new Array();
    var c = new Array();
    var r = new Array();
    
    /*left most segment*/
    a[0] = 0;
    b[0] = 2;
    c[0] = 1;
    r[0] = data[0] + 2*data[1];
    
    /*internal segments*/
    for (var i = 1; i < n - 1; i++) {
        a[i] = 1;
        b[i] = 4;
        c[i] = 1;
        r[i] = 4 * data[i] + 2 * data[i+1];
    }
    
    /*right segment*/
    a[n-1] = 2;
    b[n-1] = 7;
    c[n-1] = 0;
    r[n-1] = 8*data[n-1] + data[n];
    
    /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
    var m;
    for (var i = 1; i < n; i++) {
        m = a[i]/b[i-1];
        b[i] = b[i] - m * c[i - 1];
        r[i] = r[i] - m*r[i-1];
    }

    p1[n-1] = r[n-1]/b[n-1];
    for (var i = n - 2; i >= 0; --i) {
        p1[i] = (r[i] - c[i] * p1[i+1]) / b[i];
    }

    /*we have p1, now compute p2*/
    for (var i=0;i<n-1;i++) {
        p2[i] = 2*data[i+1] - p1[i+1];
    }

    p2[n-1] = 0.5*(data[n] + p1[n-1]);

    return {p1:p1, p2:p2};
};


// Get the scale so that graph fits with window
plotLine.prototype.scale = function(data) {
    var empty = true;
    for(graph in data) {
        empty = false;
        break;
    }
    if(empty) {
        return false;
    }

    var minX = false, minY = 0;
    var maxX = false, maxY = false;
    var circle = false, last_point = false, line = false;

    // Look for max and min values for both axis
    for(var point = 0; point < data.length; point++) {
        if(data[point].x < minX || minX === false) {
            minX = data[point].x;
        }
        if(data[point].x > maxX || maxX === false) {
            maxX = data[point].x;
        }
        if(data[point].y < minY) {
            minY = data[point].y;
        }
        if(data[point].y > maxY || maxY === false) {
            maxY = data[point].y;
        }
    }

    // Scale the grid, if needed
    var scale = this.getNewXY(minX, maxX, minY, maxY);
    var tmp = scale(Math.pow(10, Math.floor(Math.log(maxX - minX) / Math.log(10))), Math.pow(10, Math.floor(Math.log(maxY - minY) / Math.log(10))));
    var origin = scale(0, 0);
    var coordinates = {'x': tmp.x - origin.x, 'y': tmp.y - origin.y };
    if(this.grid === 'main' || this.grid === 'both') {
        this.grid_pattern.setAttribute('width', coordinates.x);
        this.grid_pattern.setAttribute('height', coordinates.y);
        var main_coords = scale(Math.floor(minX / Math.pow(10, Math.floor(Math.log(maxX - minX) / Math.log(10)))) * Math.pow(10, Math.floor(Math.log(maxX - minX) / Math.log(10))), Math.floor(minY / Math.pow(10, Math.floor(Math.log(maxY - minY) / Math.log(10)))) * Math.pow(10, Math.floor(Math.log(maxY - minY) / Math.log(10))));
        this.grid_pattern.setAttribute('x', main_coords.x);
        this.grid_pattern.setAttribute('y', main_coords.y);
        this.grid_pattern.querySelector('path').setAttribute('d', 'M '+coordinates.x+' 0 L 0 0 0 '+coordinates.y);
        if(this.grid === 'both') {
            this.grid_pattern.querySelector('rect').setAttribute('width', coordinates.x);
            this.grid_pattern.querySelector('rect').setAttribute('height', coordinates.y);
        }
    }
    if(this.grid === 'small' || this.grid === 'both') {
        coordinates.x = coordinates.x / 10;
        coordinates.y = coordinates.y / 10;
        this.small_grid_pattern.setAttribute('width', coordinates.x);
        this.small_grid_pattern.setAttribute('height', coordinates.y);
        if(this.grid === 'small') {
            var small_coords = scale(Math.floor(minX / Math.pow(10, Math.floor(Math.log(maxX - minX) / Math.log(10)))) * Math.pow(10, Math.floor(Math.log(maxX - minX) / Math.log(10))), Math.floor(minY / Math.pow(10, Math.floor(Math.log(maxY - minY) / Math.log(10)))) * Math.pow(10, Math.floor(Math.log(maxY - minY) / Math.log(10))));
            this.small_grid_pattern.setAttribute('x', small_coords.x);
            this.small_grid_pattern.setAttribute('y', small_coords.y);
        }
        this.small_grid_pattern.querySelector('path').setAttribute('d', 'M '+coordinates.x+' 0 L 0 0 0 '+coordinates.y);
    }
    
    // draw axis
    if(this.x_axis === true) {
        y = scale(0, 0).y;
        this.xaxis.setAttribute('y1', y);
        this.xaxis.setAttribute('y2', y);
    }
    if(this.y_axis === true) {
        x = scale(0, 0).x;
        this.yaxis.setAttribute('x1', x);
        this.yaxis.setAttribute('x2', x);
    }
    // draw axis labels if set to true
    if (this.x_label === true) {
        var scalewidth = {'x': tmp.x - origin.x, 'y': tmp.y - origin.y };
        var interval = Math.round(scalewidth.x/(scale(1,0).x-scale(0,0).x));
        var i=-10;
        while (origin.x+i*scalewidth.x < this.parent_holder.offsetWidth) {
            i++;
            if (origin.x+i*scalewidth.x <0) continue;
            label = this.createElement('text', {'class': 'legend_x', 'fill': 'gray', 'transform': 'translate(0, '+this.parent_holder.offsetHeight+') scale(1, -1)'});
            label.appendChild(document.createTextNode(i*interval));
            label.setAttribute('x', origin.x+i*scalewidth.x);
            label.setAttribute('y', this.parent_holder.offsetHeight-origin.y-5);
            this.g.appendChild(label);
        }
    }
    if (this.y_label === true) {
        var scalewidth = {'x': tmp.x - origin.x, 'y': tmp.y - origin.y };
        var interval = Math.round(scalewidth.y/(scale(0,0).y-scale(0,1).y));
        var i=-10;
        while (origin.y+i*scalewidth.y < this.parent_holder.offsetHeight) {
            i++;
            if (origin.y+i*scalewidth.y <0) continue;
            label = this.createElement('text', {'class': 'legend_y', 'fill': 'gray', 'transform': 'translate(0, '+this.parent_holder.offsetHeight+') scale(1, -1)'});
            label.appendChild(document.createTextNode(-i*interval));
            label.setAttribute('x', origin.x+5);
            label.setAttribute('y', this.parent_holder.offsetHeight-origin.y-i*scalewidth.y);
            this.g.appendChild(label);
        }
    }
    
    return scale;
};

// draw graphs
plotLine.prototype.draw = function(drawp = this.drawpoints) {
    var scale = this.scale(this.raw_points);
    var points = [], path;
    var px, py;
    var element;
    var obj = this;

    for(var point = 0; point < this.raw_points.length; point++) {
        var tmp = scale(this.raw_points[point].x, this.raw_points[point].y);
        points.push({'id': point, 'x': tmp.x, 'y': tmp.y, 'graph': this.raw_points[point].graph,});
    }

    // draw each graph
    for(var graph in this.graphs) {
        var filtered_points = points.filter(function(el) { return el.graph == graph; });
        path = '';

        // draw line
        if(this.smooth === true) {
            var x = new Array(), y = new Array();
            for(var point = 0; point < filtered_points.length; point++) {
                x.push(filtered_points[point].x);
                y.push(filtered_points[point].y);
            }
            px = this.getControlPoints(x);
            py = this.getControlPoints(y);
            for(var point = 0; point < filtered_points.length - 1; point++) {
                path += 'C '+px.p1[point]+' '+py.p1[point]+' '+px.p2[point]+' '+py.p2[point]+' '+filtered_points[point+1].x+' '+filtered_points[point+1].y+' ';
            }
        }
        else {
            for(var point = 1; point < filtered_points.length; point++) {
                path += 'L '+filtered_points[point].x+' '+filtered_points[point].y+' ';
            }
        }

        if(this.line !== 'none' && filtered_points.length !== 0) {
            element = this.createElement('path', {'class': 'line', 'stroke': this.graphs[graph], 'stroke-width': 2, 'fill': 'none', 'd': 'M '+filtered_points[0].x+' '+filtered_points[0].y+' '+path});
            if(this.line === 'dashed') {
                element.setAttribute('style', 'stroke-dasharray: '+this.dashed_style);
            }
            this.g.appendChild(element);
        }

        // draw fill
        if(this.fill) {
            element = this.createElement('path', {'class': 'graph', 'fill': this.graphs[graph], 'opacity': '0.25', 'stroke': 'none', 'd': 'M '+filtered_points[0].x+' '+2*this.marginBottom+' L '+filtered_points[0].x+' '+filtered_points[0].y+' '+ path + ' L '+filtered_points[filtered_points.length - 1].x+' '+2*this.marginBottom+' Z' });
            this.g.insertBefore(element, this.g.querySelectorAll('.over')[0]);
        }
    }
    
    // draw points if true
    if (this.drawpoints === true) {
        for(var graph in this.graphs) {
            var filtered_points = points.filter(function(el) { return el.graph == graph; });
    
            for(var point = 0; point < filtered_points.length; point++) {
                element = this.createElement('circle', {'class': 'point', 'id': 'point_'+filtered_points[point].id, 'cx': filtered_points[point].x, 'cy': filtered_points[point].y, 'r': 4, 'fill': '#333', 'stroke': this.graphs[graph], 'stroke-width': 2});
                this.g.insertBefore(element, this.g.querySelectorAll('.label')[0]);
            }
        }
    }
};

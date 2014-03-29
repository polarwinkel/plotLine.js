var SVG = {};
SVG.ns = "http://www.w3.org/2000/svg";
SVG.xlinkns = "http://www.w3.org/1999/xlink";

SVG.marginBottom = 10;
SVG.marginTop = 15;
SVG.marginLeft = 10;
SVG.marginRight = 10;
SVG.rounded = false;
SVG.x_axis = false;

SVG.parent_holder = false;
SVG.holder = false;
SVG.g = false;
SVG.axis = false;
SVG.raw_points = [];
SVG.labels = [];

/* Initialization :
 * id = id of the parent block
 * height / width = size of the svg
 * grid = small / big / both
 */
SVG.init = function (id, height, width, grid, x_axis, rounded)
{
    SVG.parent_holder = document.getElementById(id);

    var svg = document.createElementNS(SVG.ns, 'svg:svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', SVG.xlinkns);
    SVG.parent_holder.appendChild(svg);

    SVG.holder = SVG.parent_holder.querySelector('svg');

    var defs = document.createElementNS(SVG.ns, 'defs');
    SVG.holder.appendChild(defs);

    if(grid === 'small' || grid === 'both') {
        var small_grid_pattern = document.createElementNS(SVG.ns, 'pattern');
        small_grid_pattern.setAttribute('id', 'smallGrid');
        small_grid_pattern.setAttribute('width', 8);
        small_grid_pattern.setAttribute('height', 8);
        small_grid_pattern.setAttribute('patternUnits', 'userSpaceOnUse');

        var small_grid_path = document.createElementNS(SVG.ns, 'path');
        small_grid_path.setAttribute('d', 'M 8 0 L 0 0 0 8');
        small_grid_path.setAttribute('fill', 'none');
        small_grid_path.setAttribute('stroke', 'gray');
        small_grid_path.setAttribute('stroke-width', '0.5');
        small_grid_pattern.appendChild(small_grid_path);

        defs.appendChild(small_grid_pattern);
    }
    if(grid === 'big' || grid === 'both') {
        var grid_pattern = document.createElementNS(SVG.ns, 'pattern');
        grid_pattern.setAttribute('id', 'grid');
        grid_pattern.setAttribute('width', 80);
        grid_pattern.setAttribute('height', 80);
        grid_pattern.setAttribute('patternUnits', 'userSpaceOnUse');

        if(grid === 'both') {
            var grid_rect = document.createElementNS(SVG.ns, 'rect');
            grid_rect.setAttribute('width', 80);
            grid_rect.setAttribute('height', 80);
            grid_rect.setAttribute('fill', 'url(#smallGrid)');
            grid_pattern.appendChild(grid_rect);
        }

        var grid_path = document.createElementNS(SVG.ns, 'path');
        grid_path.setAttribute('d', 'M 80 0 L 0 0 0 80');
        grid_path.setAttribute('fill', 'none');
        grid_path.setAttribute('stroke', 'gray');
        grid_path.setAttribute('stroke-width', '1');
        grid_pattern.appendChild(grid_path);

        defs.appendChild(grid_pattern);
    }
    SVG.grid = grid;

    if(SVG.grid !== "none") {
        var grid = document.createElementNS(SVG.ns, 'rect');
        grid.setAttribute('width', "2000");
        grid.setAttribute('height', "2000");
        grid.setAttribute('y', "-20");
        grid.setAttribute('fill', 'url(#grid)');
        SVG.holder.appendChild(grid);
    }

    var marker = document.createElementNS(SVG.ns, 'marker');
    marker.setAttribute('id', 'markerArrow');
    marker.setAttribute('markerWidth', 13);
    marker.setAttribute('markerHeight', 13);
    marker.setAttribute('refX', 2);
    marker.setAttribute('refY', 6);
    marker.setAttribute('orient', 'auto');
    var marker_path = document.createElementNS(SVG.ns, 'path');
    marker_path.setAttribute('d', 'M2,2 L2,11 L10,6 L2,2');
    marker_path.setAttribute('fill', 'gray');
    marker.appendChild(marker_path);
    defs.appendChild(marker);

    SVG.g = document.createElementNS(SVG.ns, 'g');
    SVG.g.setAttribute('transform', 'translate(0, ' + SVG.parent_holder.offsetHeight + ') scale(1, -1)');
    SVG.holder.appendChild(SVG.g);

    if(x_axis === true) {
        SVG.axis = document.createElementNS(SVG.ns, 'line');
        SVG.axis.setAttribute('x1', SVG.marginLeft);
        SVG.axis.setAttribute('x2', SVG.parent_holder.offsetWidth - 13 - SVG.marginRight);
        SVG.axis.setAttribute('stroke', 'gray');
        SVG.axis.setAttribute('stroke-width', 3);
        SVG.axis.setAttribute('marker-end', 'url("#markerArrow")');
        SVG.g.appendChild(SVG.axis);
    }

    SVG.rounded = rounded;
    SVG.x_axis = x_axis;
}

SVG.newCoordinates = function(value, min, max, minValue, maxValue) {
    var a = (maxValue - minValue) / (max - min);
    return a * value - a * min + minValue;
}

SVG.scale = function(data) {
    var minX = false, minY = 0;
    var maxX = false, maxY = false;
    var x = 0, y = 0;
    var circle = false, last_point = false, line = false;

    for(point = 0; point < data.length; point++) {
        x = data[point][0];
        y = data[point][1];

        if(x < minX || minX === false) {
            minX = x;
        }
        if(x > maxX || maxX === false) {
            maxX = x;
        }
        if(y < minY) {
            minY = y;
        }
        if(y > maxY || maxY === false) {
            maxY = y;
        }
    }

    /* Draw axis */
    if(SVG.x_axis === true) {
        y = SVG.newCoordinates(0, minY, maxY, 2*SVG.marginBottom, SVG.parent_holder.offsetHeight - SVG.marginTop);
        SVG.axis.setAttribute('y1', y);
        SVG.axis.setAttribute('y2', y);
    }

    var returned = new Array();
    returned['minX'] = minX;
    returned['minY'] = minY;
    returned['maxX'] = maxX;
    returned['maxY'] = maxY;
    return returned;
}

SVG.addPoints = function (data) {
    data.sort(function (a, b) {
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
    for(point = 0; point < data.length; point++) {
        SVG.raw_points.push([data[point].x, data[point].y]);
        if(data[point].label !== 'undefined') {
            SVG.labels.push(data[point].label);
        }
        else {
            SVG.labels.push('');
        }
    }
}

SVG.getControlPoints = function (data) {
    // http://www.particleincell.com/wp-content/uploads/2012/06/bezier-spline.js
    p1 = new Array();
	p2 = new Array();
	n = data.length - 1;
	
	/*rhs vector*/
	a = new Array();
	b = new Array();
	c = new Array();
	r = new Array();
	
	/*left most segment*/
	a[0] = 0;
	b[0] = 2;
	c[0] = 1;
	r[0] = data[0] + 2*data[1];
	
	/*internal segments*/
	for (i = 1; i < n - 1; i++) {
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
	for (i = 1; i < n; i++) {
		m = a[i]/b[i-1];
		b[i] = b[i] - m * c[i - 1];
		r[i] = r[i] - m*r[i-1];
	}
 
	p1[n-1] = r[n-1]/b[n-1];
	for (i = n - 2; i >= 0; --i) {
		p1[i] = (r[i] - c[i] * p1[i+1]) / b[i];
    }
		
	/*we have p1, now compute p2*/
	for (i=0;i<n-1;i++) {
		p2[i] = 2*data[i+1] - p1[i+1];
    }
	
	p2[n-1] = 0.5*(data[n] + p1[n-1]);
	
	return {p1:p1, p2:p2};
}

SVG.draw = function() {
    var scale = SVG.scale(SVG.raw_points);
    var x = new Array();
    var y = new Array();
    var element = false;
    var rect = false;
    var point = false;
    var px = false;
    var py = false;
    var path = '';

    /* Draw points */
    for(point = 0; point < SVG.raw_points.length; point++) {
        x.push(SVG.newCoordinates(SVG.raw_points[point][0], scale.minX, scale.maxX, SVG.marginLeft, SVG.parent_holder.offsetWidth - SVG.marginRight));
        y.push(SVG.newCoordinates(SVG.raw_points[point][1], scale.minY, scale.maxY, 2*SVG.marginBottom, SVG.parent_holder.offsetHeight - SVG.marginTop));
    }

    if(SVG.rounded === true) {
        px = SVG.getControlPoints(x);
        py = SVG.getControlPoints(y);
        for(point = 0; point < SVG.raw_points.length - 1; point++) {
            path += 'C '+px.p1[point]+' '+py.p1[point]+' '+px.p2[point]+' '+py.p2[point]+' '+x[point+1]+' '+y[point+1]+' ';
        }
    }
    else {
        for(point = 1; point < SVG.raw_points.length; point++) {
            path += 'L '+x[point]+' '+y[point]+' ';
        }
    }
    element = document.createElementNS(SVG.ns, 'path');
    element.setAttribute('class', 'graph');
    element.setAttribute('fill', '#3f72bf');
    element.setAttribute('opacity', '0.25');
    element.setAttribute('stroke', 'none');
    element.setAttribute('d', 'M '+SVG.marginLeft+' '+SVG.marginBottom+' L '+x[0]+' '+y[0]+' '+ path + ' L '+(SVG.parent_holder.offsetWidth - SVG.marginRight)+' '+SVG.marginBottom+' Z');
    SVG.g.insertBefore(element, SVG.g.querySelectorAll('.over')[0]);

    element = document.createElementNS(SVG.ns, 'path');
    element.setAttribute('class', 'line');
    element.setAttribute('stroke', '#3f72bf');
    element.setAttribute('stroke-width', 2);
    element.setAttribute('fill', 'none');
    element.setAttribute('d', 'M '+x[0]+' '+y[0]+' '+path);
    SVG.g.appendChild(element);

    for(point = 0; point < SVG.raw_points.length; point++) {
        element = document.createElementNS(SVG.ns, 'circle');
        element.setAttribute('class', 'point');
        element.setAttribute('id', 'point_'+point);
        element.setAttribute('cx', x[point]);
        element.setAttribute('cy', y[point]);
        element.setAttribute('r', 4);
        element.setAttribute('fill', '#333');
        element.setAttribute('stroke', '#3f72bf');
        element.setAttribute('stroke-width', 2);
        SVG.g.appendChild(element);

        if(SVG.labels[point] !== '') {
            var g = document.createElementNS(SVG.ns, 'g');
            g.setAttribute('class', 'label');
            g.setAttribute('id', 'label_'+point);
            g.setAttribute('transform', 'translate(0, ' + SVG.parent_holder.offsetHeight + ') scale(1, -1)');
            SVG.g.appendChild(g);

            element = document.createElementNS(SVG.ns, 'text');
            var text = SVG.labels[point].replace('</sup>', '<sup>').split('<sup>');
            var i = 0;
            var tmp = false;
            for(i = 0; i < text.length; i++) {
                if(i % 2 == 0) {
                    element.appendChild(document.createTextNode(text[i]));

                }
                else {
                    tmp = document.createElementNS(SVG.ns, 'tspan');
                    tmp.setAttribute('dy', '-5');
                    tmp.appendChild(document.createTextNode(text[i]));
                    element.appendChild(tmp);
                }
            }

            var path = document.createElementNS(SVG.ns, 'path');
            path.setAttribute('stroke', 'black');
            path.setAttribute('stroke-width', 2);
            path.setAttribute('fill', 'white');
            path.setAttribute('opacity', 0.5);

            // Append here to have them with the good z-index, update their attributes later
            g.appendChild(path);
            g.appendChild(element);

            var x_text = x[point] - element.getBoundingClientRect().width / 2;
            var y_text = SVG.parent_holder.offsetHeight - y[point] - 20;
            var element_width = element.getBoundingClientRect().width;
            var element_height = element.getBoundingClientRect().height;

            if(x[point] + element_width / 2 > SVG.parent_holder.offsetWidth) {
                x_text = x[point] - element_width - 20;
                y_text = SVG.parent_holder.offsetHeight - y[point] + 5;
                path.setAttribute('d', 'M '+(x_text - 5)+' '+(y_text + 5)+' L '+(x_text - 5)+' '+(y_text  - element_height + 5)+' L '+(x_text + element_width + 5)+' '+(y_text - element_height + 5)+' L '+(x_text + element_width + 5)+' '+(y_text - element_height/2 + 2.5)+' L '+(x_text + element_width + 10)+' '+(y_text - element_height/2 + 5)+' L '+(x_text + element_width + 5)+' '+(y_text - element_height/2 + 7.5)+' L '+(x_text + element_width + 5)+' '+(y_text + 5)+' Z');
            }
            else if(x[point] - element.getBoundingClientRect().width / 2 < 0) {
                x_text = x[point] + 20;
                y_text = SVG.parent_holder.offsetHeight - y[point] + 5;
                path.setAttribute('d', 'M '+(x_text - 5)+' '+(y_text + 5)+' L '+(x_text - 5)+' '+(y_text - element_height/2 + 7.5)+' L '+(x_text - 10)+' '+(y_text - element_height/2 + 5)+' L '+(x_text - 5)+' '+(y_text - element_height/2 + 2.5)+' L '+(x_text - 5)+' '+(y_text - element_height + 5)+' L '+(x_text + element_width + 5)+' '+(y_text - element_height + 5)+' L '+(x_text + element_width + 5)+' '+(y_text + 5)+' Z');
            }
            else {
                path.setAttribute('d', 'M '+(x_text - 5)+' '+(y_text + 5)+' L '+(x_text - 5)+' '+(y_text  - element_height + 5)+' L '+(x_text + element_width + 5)+' '+(y_text - element_height + 5)+' L '+(x_text + element_width + 5)+' '+(y_text + 5)+' L '+(x_text + element_width/2 + 2.5)+' '+(y_text + 5)+' L '+(x_text + element_width/2)+' '+(y_text + 10)+' L '+(x_text + element_width/2 - 2.5)+' '+(y_text + 5)+' Z');
            }
            element.setAttribute('x', x_text);
            element.setAttribute('y', y_text);
 

            g.setAttribute('display', 'none');
        }
    }

    for(point = 0; point < SVG.raw_points.length; point++) {
        rect = document.createElementNS(SVG.ns, 'rect');
        rect.setAttribute('class', 'over');
        rect.setAttribute('id', 'over_'+point);
        if(point == 0) {
            rect.setAttribute('x', 0);
        }
        else {
            rect.setAttribute('x', (x[point] + x[point - 1]) / 2);
        }
        rect.setAttribute('y', 0);
        rect.setAttribute('fill', 'white');
        rect.setAttribute('opacity', '0');
        if(point == SVG.raw_points.length - 1) {
            rect.setAttribute('width', (x[point] - x[point - 1])/2 + SVG.marginLeft);
        }
        else if(point == 0) {
            rect.setAttribute('width', (x[1] - x[0])/2 + SVG.marginLeft);
        }
        else {
            rect.setAttribute('width', (x[point + 1] - x[point - 1])/2);
        }
        rect.setAttribute('height', '100%');
        SVG.g.appendChild(rect);

        rect.addEventListener('mouseover', function() {
            SVG.holder.getElementById(this.getAttribute('id').replace('over', 'point')).setAttribute('r', '6');
            if(SVG.labels[parseInt(this.getAttribute('id').replace('over_', ''))] !== '') {
                SVG.holder.getElementById(this.getAttribute('id').replace('over', 'label')).setAttribute('display', 'block');
            }
        })
        rect.addEventListener('mouseout', function() {
            SVG.holder.getElementById(this.getAttribute('id').replace('over', 'point')).setAttribute('r', '4');
            if(SVG.labels[parseInt(this.getAttribute('id').replace('over_', ''))] !== '') {
                SVG.holder.getElementById(this.getAttribute('id').replace('over', 'label')).setAttribute('display', 'none');
            }
        })
    }
}

var old = window.onresize || function() {};
window.onresize = function() {
    old();
    if(SVG.g !== false) {
        SVG.g.setAttribute('transform', 'translate(0, ' + SVG.parent_holder.offsetHeight + ') scale(1, -1)');
        if(SVG.x_axis === true) {
            SVG.axis.setAttribute('x2', SVG.parent_holder.offsetWidth - 13 - SVG.marginRight);
        }
        [].forEach.call(SVG.holder.querySelectorAll('.label, .over, .point, .line, .graph'), function(el) {
            el.parentNode.removeChild(el);
        });
        SVG.draw();
    }
}

# plotLine.js

`plotLine.js` is a lightweight JS library to plot data and function graphs using `svg`-output.

This was forked from [Timeline.js from Phyks](https://github.com/Phyks/timeline.js).

I forked/coded it because I couldn't find any other basic JS library to do this, without any external dependencies and extra features. It is only ~20kB not yet minified, and can be reduced under 10k with obfuscation. It can be very easily customised to fit your needs.

## Live demos

See in the example-folder:

- [simple.html](https://polarwinkel.github.io/plotLine.js/examples/simple.html)
- [showcase.html](https://polarwinkel.github.io/plotLine.js/examples/showcase.html)

You can also give it a try for yourself in the [Live Editor](https://polarwinkel.github.io/plotLine.js/liveEditor/liveEditor.html)!
## Usage

### Preparation

You must include the `plotLine.js` script with something like

`<script type="text/javascript" src="plotLine.js"></script>`

### The Super-Quick way

Then there are quick-functions to get your result in just one line of code:

`<script>quickPlot([[0,1.5],[1.5,2.1],[2,0.5],[2.5,2.8],[3,2],[4,3.5]]);</script>`

or

`<script>quickFunk('Math.sin(x)', -3.14, 3.14);</script>`


### The more powerful way

For more options you need to init a plotLine object, using something like `var pl = new plotLine({'id': 'holder', 'height': '100%', 'width': '100%', 'grid': 'both', 'x_axis': true, 'x_label': false});`.

All the arguments are optional and can be checked in usage comments of `plotLine.js`:

```
 * pl = plotLine(arg = {}) to create a plotline-object 'pl'
 *   where arg is an object with (optional):
 *   - 'id' = id of the parent block (default: random Id)
 *   - 'height' / 'width' = size of the svg (default '600px' / '450px')
 *   - 'grid' = _'main'_ / 'small' / 'both' / 'none' to show grid
 *   - 'x_axis' / 'y_axis' = _true_ / false to show or hide x / y axis
 *   - 'x_label' / 'y_label' = _true_ / false to show or hide x / y labels
 */
```

Once you have your plotLine-object add as many graphs as you like with

`pl.addGraph('name', arg={})` where again all arguments are optional and documented in the head comment:

```
 * pl.addGraph('name', arg={}) to add a graph 'name' to 'pl'
 *   where arg is an object with (optional):
 *   - 'color = css-color (default: 'green')
 *   - 'line' = _'line'_ / 'dashed' / 'none' to choose line type
 *   - 'drawpoints' = true / false to draw points (boolean)
 *   - 'smooth' = true / _false_ to use splines to smoothen the graph (boolean)
 *   - 'fill' = true / _false_ to fill below the graph or not (boolean)
```

Then add data with somethig like `pl.addPoints('name', [[0,2],[2,2]])` or a mathematical function with something like `pl.addFunction('name', 'Math.sin(x)', -3, 3.14)`.

Finally execute `pl.draw()` to draw it.

_Note:_ One plotLine object corresponds to one holder.

_Note:_ You don't have to sort the points inside a same list of points in a `pl.addGraph` call. They will be sorted for you. But, if you call pl.addPoints multiple times, you must sort the points yourself between each call. The script won't do it for you and it will result in weird graphs if you don't do it.

### For Pro's: Show diagrams after setting it to `innerHTML`

If you want to include this in your project which sets new content with the JS-method `innerHTML` on a DOM-element `element` you will need to run the JS afterwards.

You can do this with this function:

```
function runInnerHtmlJs(element) {
    elements = element.querySelectorAll('script');
    for (var i=0; i<elements.length; i++) {
        var oldScript = elements[i];
        var newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach( attr => newScript.setAttribute(attr.name, attr.value) );
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
    }
}
```

which needs to be executed after including your content. You can run it with something like: 

```
element.innerHTML = yourContentIncludingPlot;
runInnerHtmlJs(element);
```

But be careful: _The above function will run_ __all__ _injected JS-Code from your `innerHTML`-content_, you need to make sure you can trust that code!

If `yourContentIncludingPlot` is nested you will still need to implement recursion to reach inner `<script>`-objects.

## Other functions

* `pl.clearGraph(GRAPH)` to delete the data for the graph GRAPH, or for all graphs if GRAPH is not specified.
* `pl.hasGraph(GRAPH)` to check if a graph with name GRAPH has already been defined or not.

## License

```
 * --------------------------------------------------------------------------------
 * "THE [NO-ALCOHOL] BEER-WARE LICENSE" (Revision 42):
 * Phyks (webmaster@phyks.me) and polarwinkel (it@polarwinkel.de) wrote this file.
 * As long as you retain this notice you can do whatever you want with this stuff 
 * (and you can also do whatever you want with this stuff without retaining it, but
 * that's not cool...). If we meet some day, and you think this stuff is worth it,
 * you can buy me a soda (Phyks) or a beer (polarwinkel) in return.
 * Phyks, polarwinkel
 * ---------------------------------------------------------------------------------
```

## Credits

This is forked from [Timeline.js from Phyks](https://github.com/Phyks/timeline.js).

Good job, thanks a lot for this, Phyks!

Much of his code is unchanged, I added some stuff like axis labels, function plotting, quick-functions, some options and more.
I removed labels for the data points.

## Known bugs / TODO

Maybe some day I will add support for bar diagrams.

Feel free to contribute!

# plotLine.js

`plotLine.js` is a lightweight JS library to plot data and function graphs using `svg`-output.

It is a (api-breaking) fork of [Timeline.js from Phyks](https://github.com/Phyks/timeline.js).

I coded it because I couldn't find any basic JS library to do this, without any external dependencies and extra features. It is is only <20kB not yet minified, and can be reduced under 10k with obfuscation. It can be very easily customised to fit your needs.

## Live demos

See in the example-folder.

## Usage

### super-quick way

You must include the `plotLine.js` script:

`<script type="text/javascript" src="plotLine.js"></script>`

if you downloaded `plotLine.js` to the same folder of your HTML-file.

Then there is a `plotQuick`-Function to get your result in just one line of code:

`<script>plotQuick([[0,1.5],[1.5,2.1],[2,0.5],[2.5,2.8],[3,2],[4,3.5]]);</script>`

### more powerful way

For more options you need to init a plotLine object, using something like `var tl = new plotLine({'id': 'holder', 'height': '100%', 'width': '100%', 'grid': 'both', 'x_axis': true, 'smooth': false, 'x_label': false});`.

All the arguments are all optional and can be checked in the comment in the top of `plotLine.js`:

```
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
 * points = _true_ / false to draw points (boolean)
 * smooth = true / _false_ to use splines to smoothen the graph (boolean)
 * fill = true / _false_ to fill below the graph or not (boolean)
 */
```

See examples for more info!

_Note :_ One plotLine object corresponds to one holder.

Then, you can add as many graphs as you want, with `tl.addGraph(NAME, COLOR);` where COLOR must be a valid CSS color.
And you can add points using `tl.addPoints(GRAPH_NAME, POINTS);`.

_Note_ : You don't have to sort the points inside a same list of points in a tl.addGraph call. They will be sorted for you. But, if you call tl.addPoints multiple times, you must sort the points yourself between each call. The script won't do it for you and it will result in weird graphs if you don't do it.

Finally, you can draw the timeline with `tl.draw();`.

## Other functions

* `tl.clearGraph(GRAPH);` to delete the data for the graph GRAPH, or for all graphs + the graphs definition if GRAPH is not specified.
* `tl.hasGraph(GRAPH);` to check if a graph with name GRAPH has already been defined or not.

## License

```
 * --------------------------------------------------------------------------------
 * "THE NO-ALCOHOL BEER-WARE LICENSE" (Revision 42):
 * Phyks (webmaster@phyks.me) and polarwinkel (it@polarwinkel.de) wrote this file.
 * As long as you retain this notice you can do whatever you want with this stuff 
 * (and you can also do whatever you want with this stuff without retaining it, but
 * that's not cool...). If we meet some day, and you think this stuff is worth it,
 * you can buy me a soda (Phyks) or a beer (polarwinkel) in return.
 * Phyks, polarwinkel
 * ---------------------------------------------------------------------------------
```

## Credits

This is forked from Timeline.js from Phyks:
https://github.com/Phyks/timeline.js
Thanks a lot for this, Phyks!

Much of his code is unchanged, I added some stuff like axis labels, function plotting, some options and more.
I removed labels for the data points.

## Known bugs / TODO

__This is still work in progress, the api might change during 2022!__

Feel free to contribute !

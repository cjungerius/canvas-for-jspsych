# Canvas plugins for jsPsych

Edits of the existing jspsych plugins html-keyboard-response and same-different-html which draw a canvas item and will draw on it using a provided function.
based on the great work of [Josh de Leeuw](http://github.com/jodeleeuw)

## Installation

Copy the required files into the same folder as the jsPsych study's HTML file and source them like any other jsPsych plugin.

```html
<script src="jspsych-canvas-keyboard-response.js"></script>
<script src="jspsych-same-different-canvas.js"></script>
```

## Usage

These plugins match the plugins they are based on as much as possible; the biggest different is that instead of providing them with a stimulus/stimuli to display, they require drawing(s), which are functions that act on a canvas item `c`. note that the function will still generally need to set the correct context itself, using a line like `let ctx = c.getContext("2d").`

## Example

[We can draw many things on a canvas.](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes) Below is a function that draws a rectangle, for example:

```javascript
function draw_rect(c) {
	let ctx = c.getContext("2d");
	ctx.fillRect(25, 25, 100, 100);
	}
```

We can now use this function in to define an instance of our plugin:

```javascript
let timeline = [];

let mytrial = {
	type:"canvas-keyboard-response",
	drawing: draw_rect,
	prompt: "is this a triangle?",
	}

timeline.push(mytrial)

```

same-different-canvas works similar, but requires an array of two functions acting on c:
```javascript

let difftrial = {
	type: "same-different-canvas",
	drawings: [draw_rect, draw_circ],
	interval_disp: "<p style="font-size: 48px;">+</p>",
	same_key: "A",
	different_key: "L",
	gap_duration: 750,
	}

timeline.push(difftrial)
```

## Questions

You can contact me for any questions via my [Twitter](http://twitter.com/chrisjungerius)


window.addEventListener("load", () => new PaperSVGIDMonkeyPatch());

class PaperSVGIDMonkeyPatch {

	constructor() {

		// SVG files
		this.SVGs = [
			// https://www.svgrepo.com
			"gamepad", 
			"burger", 
			// https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/
			"channel", 
			"acid"
		];

		// get random SVG
		this.SVG = this.SVGs[Math.floor(Math.random() * this.SVGs.length)];

		// create canvas element
		this.canvas = document.createElement("canvas");

		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		document.body.appendChild(this.canvas);

		// setup PaperJS
		paper.setup(this.canvas);

		// create layer for text element
		new paper.Layer();

		// title
		let title = this.createText("PaperJS SVG ID MonkeyPatch", 40);

		// title fit page width
		title.fitBounds(
			new paper.Rectangle(
				new paper.Point(0, 10), 
				new paper.Size(paper.view.size.width, 40)
			)
		);

		// ID text
		this.text = this.createText("🐵", paper.view.size.height - 40);

		// listen to clicks
		paper.view
		.on(
			"click", 
			event => 
				this.paperClick(event)
		);

		// new layer for SVG
		new paper.Layer();

		// load SVG
		new PaperSVGLoader("assets/" + this.SVG + ".svg", false)
		.load()
		.then(item => {

			// SVG item ready, add to Paper
			item.addTo(paper.project);

			// center item
			item.position = paper.view.center;

			// fit to screen
			item.scale(
				Math.min(window.innerWidth, window.innerHeight) / 
				Math.min(paper.project.activeLayer.bounds.width, paper.project.activeLayer.bounds.height) 
				* 4 / 5
			);

		});

	}

	createText(content, y) {

		// create text element
		return new paper
		.PointText({
			point: new paper.Point(paper.view.size.width / 2, y), 
			fontSize: 30, 
			justification: "center", 
			locked: true,  
			content: content
		});

	}

	paperClick(event) {

		// unselect all items
		paper.project
		.getItems({
			selected: true
		})
		.forEach(item => 
			item.selected = false
		);

		// check hit
		let result = paper.project
		.hitTest(
			event.point, 
			{
				fill: true, 
				stroke: true, 
				segments: false, 
				// no name = no hit
				match: test => test.item.name !== undefined
			}
		);
		
		if(result) {

			// select clicked item
			result.item.selected = true;

			// display clicked item SVG ID
			this.text.content = result.item.name;

			// blink
			this.blink(result.item);

		}

	}

	blink(item) {

		// init blink fillColor or strokeColor tween values
		let color = { ...(item.fillColor ? { fillColor: item.fillColor } : {}), ...(item.strokeColor ? { strokeColor: item.strokeColor } : {}) }, 
		blink = { ...(item.fillColor ? { fillColor: "#FF0000" } : {}), ...(item.strokeColor ? { strokeColor: "#FF0000" } : {}) }, 
		duration = { duration: 150 };

		// tween
		item.tweenTo(blink, duration)
		.then(() => item.tweenTo(color, duration)
			.then(() => item.tweenTo(blink, duration)
				.then(() => item.tweenTo(color, duration)
					.then(() => this.text.content = "🐵")
				)
			)
		);

	}

}
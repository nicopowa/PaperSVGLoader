/**
 * preserve loaded SVG elements IDs
 */
class PaperSVGLoader {

	/**
	 * @construct
	 * @param {string} url : SVG file url
	 * @param {boolean} insert : whether the imported items should be added to the project
	 * @param {boolean} expandShapes : whether imported shape items should be expanded to path items
	 */
	constructor(url, insert = true, expandShapes = false) {

		this.SVGURL = url;
		this.insert = insert;
		this.expandShapes = expandShapes;

	}

	/**
	 * @method load : load SVG and return Paper item
	 */
	load() {

		return fetch(this.SVGURL)
		.then(SVGResponse => SVGResponse.text())
		.then(SVGData => this.parse(SVGData))
		.catch(SVGErr => console.error("SVG load error", SVGErr));

	}

	/**
	 * @method parse : parse SVG request result
	 * @param {string} SVGData : loaded SVG data
	 */
	parse(SVGData) {

		// load SVG data
		let SVGDoc = new DOMParser()
			.parseFromString(SVGData, "text/xml"), 

			// import SVG
			item = paper.project
			.importSVG(
				SVGDoc, 
				{
					expandShapes: this.expandShapes, 
					insert: this.insert
				}
			);

		PaperSVGLoader
		.monkeyPatch(item, SVGDoc);

		return item;

	}

	/**
	 * @method monkeyPatch : monkey magic 🐵
	 * @param {Object} item : PaperJS imported item
	 * @param {Document} SVGDoc : corresponding SVG
	 */
	static monkeyPatch(item, SVGDoc) {

		// run monkey loop
		PaperSVGLoader
		.monkeyLoop(
			// ignore imported SVG rect Shape
			item.children.slice(1), 
			// get SVG elements markup
			SVGDoc.querySelector("svg").childNodes
		);

	}

	/**
	 * @method monkeyLoop : patch loop & recursion
	 * @param {Array} paperItems : items hierarchy loaded by PaperJS
	 * @param {NodeList} svgElements : corresponding SVG elements
	 */
	static monkeyLoop(paperItems, svgElements) {

		// convert SVG NodeList to array
		Array.from(svgElements)
		// filter unnecessary nodes
		.filter(SVGNode => 
			// ignore text nodes
			!SVGNode.nodeName.startsWith("#") 
			&& 
			// allow list or ignore list ?
			// https://developer.mozilla.org/en-US/docs/Web/SVG/Element
			!["style", "defs"].includes(SVGNode.nodeName)
		)
		// loop SVG elements
		.forEach((svgElement, index) => {
	
			// assign SVG element ID to Paper item name
			paperItems[index].name = svgElement.getAttribute("id");
	
			// recurse children if any
			if(svgElement.childNodes.length) 
				PaperSVGLoader
				.monkeyLoop(
					paperItems[index].children, 
					svgElement.childNodes
				);
	
		});

	}

}
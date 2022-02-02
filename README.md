
# PaperJS-SVG-IDs

Monkey patch to preserve PaperJS SVG IDs
http://paperjs.org/reference/project/#importsvg-svg

Keeping track of SVG IDs can be pretty useful to change path or tween fill & stroke colors.

Testing purpose only / Not safe for production

How to use :

    let myLoader = new PaperSVGLoader("path/to/file.svg");
    
    myLoader.load().then(item => {
		// item is ready to use and children can be accessed using SVG IDs
		let someSVG = item.getItems({name: "mySVGElement"});
		someSVG.fillColor = "#FF0000";
	});

[Demo](https://nicopowa.github.io/PaperSVGLoader)
Refresh to load random SVG and click shapes to display element ID

Sample SVG files with IDs
[Gamepad](https://nicopowa.github.io/PaperSVGLoader/assets/gamepad.svg) [Burger](https://nicopowa.github.io/PaperSVGLoader/assets/burger.svg) [Channel](https://nicopowa.github.io/PaperSVGLoader/assets/channel.svg) [Acid](https://nicopowa.github.io/PaperSVGLoader/assets/acid.svg)

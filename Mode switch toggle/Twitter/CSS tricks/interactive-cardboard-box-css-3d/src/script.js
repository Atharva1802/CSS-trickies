$(document).ready(function () {
	$(".input-range-h").on("input", function () {
		console.log("Box Height: " + this.value + "px");
		$(":root")
			.get(0)
			.style.setProperty("--height-size", this.value + "px");
		if (this.value < 220) {
			$("#heavy").hide();
			$(".upside").hide();
		} else {
			$("#heavy").show();
			$(".upside").show();
		}
	});

	$(".input-range-w").on("input", function () {
		console.log("Box Width: " + this.value + "px");
		$(":root")
			.get(0)
			.style.setProperty("--width-size", this.value + "px");
	});
	$(".input-range-d").on("input", function () {
		console.log("Box Depth: " + this.value + "px");
		$(":root")
			.get(0)
			.style.setProperty("--depth-size", this.value + "px");
	});

	$(".input-range-rotate-z").on("input", function () {
		console.log("Box RotateZ: " + this.value + "deg");
		$(":root")
			.get(0)
			.style.setProperty("--rotate-deg-z", this.value + "deg");
	});

	$(".input-range-open").on("input", function () {
		console.log("Box open degree: " + this.value + "deg");
		$(":root")
			.get(0)
			.style.setProperty("--rotate-open", this.value + "deg");
	});
});

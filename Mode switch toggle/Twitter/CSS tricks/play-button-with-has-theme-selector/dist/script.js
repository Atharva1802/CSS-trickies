// Nope. CSS is powerful.

const buttons = document.querySelectorAll(".button--toggle");
const checkbox = document.querySelector(".theme-toggle input");

for (let button of buttons) {
	button.addEventListener("click", function () {
		button.classList.toggle("is-active");
	});
}

checkbox.addEventListener("keydown", function () {
	if (event.key === "Enter") {
		checkbox.checked = !checkbox.checked;
	}
});
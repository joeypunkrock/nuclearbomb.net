import "@interactjs/auto-start";
import "@interactjs/actions/drag";
import "@interactjs/modifiers";
import "@interactjs/dev-tools";
import interact from "@interactjs/interact";

/**
 * Computer
 */
export default class Computer {
  constructor(options = {}) {
    this.breakpoints = options.breakpoints || null;
    this.highestZIndex = 0;

    document.querySelectorAll(".window-draggable").forEach((element) => {
      element.style.zIndex = this.highestZIndex; // Initially set base z-index
      this.windowDrag(element);

      element.addEventListener("click", () => {
        this.incrementZindex(element)
      });
    });
  }

  incrementZindex(element) {
    this.highestZIndex++; // Increment the highest z-index
    element.style.zIndex = this.highestZIndex; // Apply the new highest z-index to the clicked element
  }

  windowDrag(element) {
    const position = { x: 0, y: 0 };

    interact(element).draggable({
      // keep the element within the area of it's parent
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: ".monitor-inner-boundary",
          endOnly: false,
        }),
      ],
      // enable autoScroll
      autoScroll: true,
      listeners: {
        start: (event) => {
          console.log(event.type, event.target);
          this.incrementZindex(event.target)
        },
        move: (event) => {
          position.x += event.dx;
          position.y += event.dy;

          event.target.style.transform = `translate(${position.x}px, ${position.y}px) scale(1.6)`;
        },
      },
    });
  }
}

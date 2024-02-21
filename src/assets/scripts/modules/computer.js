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
    this.highestZIndex = 10;

    document.querySelectorAll(".window-draggable").forEach((element) => {
      element.style.zIndex = this.highestZIndex; // Initially set base z-index
      const scaleValue = element.getAttribute('data-scale');
      this.windowDrag(element, scaleValue);

      element.addEventListener("click", () => {
        this.incrementZindex(element);
      });
    });

    this.setupWindowControls();
    this.setupThumbnailClick();
  }

  incrementZindex(element) {
    this.highestZIndex++; // Increment the highest z-index
    element.style.zIndex = this.highestZIndex; // Apply the new highest z-index to the clicked element
  }

  windowDrag(element, scaleValue) {
    const position = { x: 0, y: 0 };

    interact(element).draggable({
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: ".monitor-inner-boundary",
          endOnly: false,
        }),
      ],
      autoScroll: true,
      listeners: {
        start: (event) => {
          console.log(event.type, event.target);
          this.incrementZindex(event.target);
        },
        move: (event) => {
          position.x += event.dx;
          position.y += event.dy;
          event.target.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scaleValue})`;
        },
      },
    });
  }

  setupWindowControls() {
    document.querySelectorAll('.window').forEach(window => {
      window.querySelectorAll('.title-bar-controls button, .cancel-button').forEach(button => {
        button.addEventListener('click', () => {
          const label = button.getAttribute('aria-label') || button.className;
          if (label === 'Close' || label === 'Minimize' || label === 'cancel-button') {
            window.style.display = 'none';
          }
          // Add functionality for 'Maximize' if needed
        });
      });
    });
  }

  setupThumbnailClick() {
    document.querySelectorAll('.monitor-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const windowId = thumb.getAttribute('data-windowselector');
        console.log(windowId)
        const windowToOpen = document.querySelector(`[data-windowreceiver="${windowId}"]`);
        console.log(windowToOpen);
        if (windowToOpen) {
          windowToOpen.style.display = 'block';
          this.incrementZindex(windowToOpen);
          this.toggleThumbnailClass(thumb, true); // Add class to thumbnail
        }
      });
    });
  }

  toggleThumbnailClass(thumb, isOpen) {
    if (isOpen) {
      thumb.classList.add('window-open');
    } else {
      thumb.classList.remove('window-open');
    }
  }
}


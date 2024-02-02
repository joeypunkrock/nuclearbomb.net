// Import Modules

// Define environment-specific variables
const env = "devserver",
  baseUrl = env === "prod" ? "/" : env === "devserver" ? "/gameportal/" : "/",
  assetPath = `${baseUrl}assets/`;

// Define breakpoints for different screen sizes
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

let isWorldMapPage;

// Dynamiclly load World Map module
async function loadWorldMapModule() {
  if (isWorldMapPage) {
    const WorldMapModule = await import("./modules/worldMap");
    worldMap = new WorldMapModule.default({ breakpoints });
  }
}

function init() {
  isWorldMapPage = document.body.classList.contains("page-world-map");

  loadWorldMapModule();
}

// Function to run when the DOM is ready
function onDOMContentLoaded() {
  init();
}

// Initialize the code when the DOM is ready
if (document.readyState === "complete") {
  onDOMContentLoaded();
} else {
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
}

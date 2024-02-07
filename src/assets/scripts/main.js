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


function incrementMissleHit(data) {
  // fetch('http://localhost:3000/increment-missile-hit', { method: 'POST' })
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  //   .catch(error => console.error('Error:', error));

  fetch('http://localhost:3000/countries')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Countries:', data);
      // Process the data here. For example, you can display it in your UI.
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });

}

function init() {
  isWorldMapPage = document.body.classList.contains("page-world-map");

  document.querySelector('#btnLaunch').addEventListener('click', () => {
    console.log('Fire ze missile!')
    incrementMissleHit();
  });

  loadWorldMapModule();

  //Check DB connetion
  fetch('http://localhost:3000/', { method: 'GET' })
    .then(response => response)
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
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

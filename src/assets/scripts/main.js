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
let isCommandCenterPage;

// Dynamiclly load World Map module
async function loadWorldMapModule() {
  if (isWorldMapPage) {
    const WorldMapModule = await import("./modules/worldMap");
    worldMap = new WorldMapModule.default({ breakpoints });
  }
}

async function fetchCountries() {
  try {
    const response = await fetch("http://localhost:3000/countries"); // Adjust URL as needed
    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }
    const countries = await response.json();
    console.log("All countries:", countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

//fetchCountries();

async function fetchSpecificCountry(countryId) {
  try {
    const response = await fetch(`http://localhost:3000/countries/${countryId}`); // Adjust URL as needed
    if (!response.ok) {
      throw new Error("Failed to fetch specific country");
    }
    const specificCountry = await response.json();
    console.log("Specific country:", specificCountry);
  } catch (error) {
    console.error("Error fetching specific country:", error);
  }
}

// Call fetchSpecificCountry with the desired country ID to retrieve the specific country
//fetchSpecificCountry("65c25f2058425a029a47177f");

function incrementMissleHit(data) {
  fetch("http://localhost:3000/countries/increment-missile-hit-random", { method: "POST" })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}

function init() {
  isWorldMapPage = document.body.classList.contains("page-world-map");
  isCommandCenterPage = document.body.classList.contains("page-command-center");

  if (isCommandCenterPage) {
    document.querySelector("#btnLaunch").addEventListener("click", () => {
      console.log("Fire ze missile!");
      incrementMissleHit();
    });
  }

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

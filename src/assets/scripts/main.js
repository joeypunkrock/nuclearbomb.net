// Import Modules
import { Terminal } from "xterm";
import Cmd from './modules/cmd.js';

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
    const worldMap = new WorldMapModule.default({ breakpoints });
  }
}

// Dynamiclly load Computer module
async function loadComputerModule() {
  if (isCommandCenterPage) {
    const ComputerModule = await import("./modules/computer");
    const CmdModule = await import("./modules/cmd"); // Import Cmd module
    const computer = new ComputerModule.default({ breakpoints });
    const cmd = new CmdModule.default({ breakpoints }); // Create an instance of Cmd
    // You can now use 'computer' and 'cmd' as needed
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

// Function to launch a missile from the frontend
async function launchMissile(missileData) {
  try {
    console.log(missileData);

    const response = await fetch("http://localhost:3000/countries/launch-missile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(missileData),
    });

    // Check if the request was successful
    if (response.ok) {
      const data = await response.json();
      console.log("Missile launched successfully:", data);
    } else {
      console.error("Failed to launch missile:", response.statusText);
    }
  } catch (error) {
    console.error("Error launching missile:", error);
  }
}

function incrementMissleHit(missileHitdata, countryData) {
  fetch("http://localhost:3000/missileHits/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(missileHitdata),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));

  fetch("http://localhost:3000/countries/increment-missile-hit", { method: "POST" })
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
      launchMissile({ countryId: null, lat: 51.508, lng: -0.11, missileType: null, damageRadius: null, damageLevel: "severe" }); // Replace 'country_id_here' with the actual ID of the country
    });
  }

  loadWorldMapModule();
  loadComputerModule();

  function scaleContent() {
    const baseWidth = 1570; // Base screen width for scaling
    const baseHeight = 1280; // Base screen height for scaling
    const scaleWidth = window.innerWidth / baseWidth;
    const scaleHeight = window.innerHeight / baseHeight;
    const scale = Math.min(scaleWidth, scaleHeight); // Use the smaller scale factor to keep aspect ratio

    const innerElements = document.querySelectorAll(".main-monitor-inner");
    innerElements.forEach((el) => {
      el.style.transform = `translate(-50%,-50%) scale(${scale})`;
    });
  }

  // Initial scaling
  scaleContent();

  // Rescale on window resize
  window.addEventListener("resize", scaleContent);

  function handleInput(data) {
    // Process the input data (e.g., display it back in the terminal)
    term.write(data);

    // Example: Implement command handling logic here
    if (data === '\r') { // Enter key pressed
      term.write('\nYou pressed ENTER\n$ ');
    }
  }
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

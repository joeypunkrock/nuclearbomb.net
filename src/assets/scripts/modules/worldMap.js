import L from "leaflet";
import countriesGeojsonPath from "../../../data/countries.geojson";
import * as turf from "@turf/turf";

/**
 * World Map
 */
export default class WorldMap {
  constructor(options = {}) {
    this.breakpoints = options.breakpoints || null;

    this.map = L.map("worldMap").setView([53, 12], 5);
    this.setMapStyle();

    this.countriesLayer = null;

    // Initialize other properties and configurations as needed
    // Create an empty layer group for the circles
    this.circleLayer = L.layerGroup().addTo(this.map);

    // Fetch GeoJSON data and add countries layer to the map
    this.fetchGeoJSON();
  }

  setMapStyle() {
    // Style URL format in XYZ PNG format; see our documentation for more options
    L.tileLayer("https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png", {
      minZoom: 3,
      maxZoom: 6,
      attribution:
        '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    }).addTo(this.map);
  }

  fetchGeoJSON() {
    fetch(countriesGeojsonPath) // Replace 'countries.geojson' with the path to your GeoJSON file
      .then((response) => response.json())
      .then((data) => {
        // Add GeoJSON layer to the map
        this.countriesLayer = L.geoJSON(data, {
          style: {
            fillColor: "red",
            fillOpacity: 0,
            color: "#000", // Border color
            weight: 1, // Border weight
          },
          onEachFeature: (feature, layer) => {
            // Add click event listener to each country feature
            layer.on("click", (e) => {
              // Reset styles for all countries
              this.countriesLayer.setStyle({
                fillOpacity: 0,
                color: "#000", // Border color
              });
              // Highlight the selected country
              layer.setStyle({
                fillOpacity: 0.4,
              });

              const countryName = feature.properties.ADMIN; // Assuming country name is stored in the GeoJSON properties
              const popupContent = `<b>${countryName}</b><br>Population: XXXX<br>Bombs hit: X`; // Customize the popup content as needed
              const popup = L.popup()
                .setLatLng(e.latlng) // Position the popup at the click location
                .setContent(popupContent)
                .openOn(this.map);
            });
          },
        }).addTo(this.map);

        // Once GeoJSON data is loaded, place circle
        this.placeCircleWithinCountry();

        // Bring the GeoJSON layer to the back to ensure circles are clickable
        this.countriesLayer.bringToBack();
      })
      .catch((error) => {
        console.error("Error loading GeoJSON data:", error);
      });
  }

  placeCircleWithinCountry() {
    // Check if countriesLayer has been defined
    if (!this.countriesLayer) {
      console.error("Countries layer not yet defined.");
      return;
    }

    // Assuming you have the GeoJSON layer for the country already added to the map
    // You can obtain a specific country's polygon layer from the GeoJSON layer

    // Example: Get the polygon layer of the first feature in the GeoJSON layer  81 is United Kingdom
    const countryPolygon = this.countriesLayer.getLayers()[81].feature.geometry; // Adjust index as needed

    console.log(this.countriesLayer.getLayers()[81]);

    // Generate random coordinates within the country's polygon
    //const [randomLat, randomLng] = this.getRandomCoordinatesInPolygon(countryPolygon);
    const randomPoint = this.getRandomPointInGeoJsonPolygon(countryPolygon);
    console.log(randomPoint);

    // Add a circle at the random coordinates
    const circle = L.circle([randomPoint.lat, randomPoint.lng], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: 20000, // Adjust radius as needed
    }).addTo(this.circleLayer);

    const circleTxt = `<b>Nuclear Strike!</b> <br> Killed: 1.7 mil <br> Pop: 48.6 / 46.9 mil`;
    circle.bindPopup(circleTxt);
  }

  // Function to convert Leaflet LatLngs to a GeoJSON Polygon
  leafletLatLngsToGeoJSONPolygon = (leafletPolygon) => {
    const latlngs = leafletPolygon.getLatLngs();
    const coordinates = latlngs[0].map((latlng) => [latlng.lng, latlng.lat]);
    // Close the polygon if it's not already closed
    if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] || coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
      coordinates.push(coordinates[0]);
    }
    return turf.polygon([coordinates]);
  };

  // Generate random coordinates within a polygon
  getRandomPointInGeoJsonPolygon(geoJsonPolygon) {
    let leafletPolygons = [];
    let totalArea = 0;
    let areas = [];

    // Function to ensure that a polygon is closed and valid for Turf.js
    const ensureValidPolygon = (coords) => {
      // Ensure the polygon is closed by checking if the first and last coordinates are the same
      if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) {
        coords.push(coords[0]); // Close the polygon by adding the first coordinate at the end
      }
      // Ensure the polygon has at least 4 points (minimum for a valid polygon)
      if (coords.length < 4) {
        throw new Error("Polygon does not have enough points");
      }
      return coords;
    };

    // Process the GeoJSON data based on whether it's a Polygon or MultiPolygon
    if (geoJsonPolygon.type === "Polygon") {
      // Convert and validate coordinates for a single polygon
      const coordinates = ensureValidPolygon(geoJsonPolygon.coordinates[0].map((coord) => [coord[1], coord[0]]));
      const turfPolygon = turf.polygon([coordinates.map((coord) => [coord[1], coord[0]])]);
      const area = turf.area(turfPolygon); // Calculate the area using Turf.js
      areas.push(area); // Store the area for later use
      leafletPolygons.push(L.polygon(coordinates)); // Create and store the Leaflet polygon
    } else if (geoJsonPolygon.type === "MultiPolygon") {
      // Iterate through each polygon in a MultiPolygon
      geoJsonPolygon.coordinates.forEach((polygon) => {
        // Convert and validate coordinates for each polygon
        const coordinates = ensureValidPolygon(polygon[0].map((coord) => [coord[1], coord[0]]));
        const turfPolygon = turf.polygon([coordinates.map((coord) => [coord[1], coord[0]])]);
        const area = turf.area(turfPolygon); // Calculate the area using Turf.js
        areas.push(area); // Store the area for later use
        leafletPolygons.push(L.polygon(coordinates)); // Create and store the Leaflet polygon
      });
    } else {
      throw new Error("Invalid GeoJSON object"); // Handle invalid GeoJSON data
    }

    // Sum up the total area of all polygons
    totalArea = areas.reduce((a, b) => a + b, 0);

    let selectedPolygon;
    let randomPoint;
    do {
      // Randomly select a polygon based on its area (larger areas are more likely to be chosen)
      let areaThreshold = Math.random() * totalArea;
      let cumulativeArea = 0;
      for (let i = 0; i < leafletPolygons.length; i++) {
        cumulativeArea += areas[i];
        if (cumulativeArea >= areaThreshold) {
          selectedPolygon = leafletPolygons[i]; // Select the polygon
          break;
        }
      }

      // Generate a random point within the selected polygon's bounds
      const bounds = selectedPolygon.getBounds();
      let inside = false;
      while (!inside) {
        const lat = Math.random() * (bounds.getNorth() - bounds.getSouth()) + bounds.getSouth();
        const lng = Math.random() * (bounds.getEast() - bounds.getWest()) + bounds.getWest();
        randomPoint = turf.point([lng, lat]); // Create a Turf.js point
        const leafletRandomPoint = L.latLng(lat, lng); // Convert to Leaflet LatLng point
        const turfPolygon = this.leafletLatLngsToGeoJSONPolygon(selectedPolygon);
        inside = turf.booleanPointInPolygon(randomPoint, turfPolygon); // Check if the point is inside the polygon

        // Return the Leaflet LatLng point if it's within the polygon
        if (inside && selectedPolygon.getBounds().contains(leafletRandomPoint)) {
          return leafletRandomPoint;
        }
      }
    } while (true); // Continue until a valid point is found
  }

  isPointInPolygon(point, polygon) {
    return turf.inside(turf.point([point.lng, point.lat]), turf.polygon(polygon.getLatLngs()));
  }
}

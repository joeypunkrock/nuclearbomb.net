import L from "leaflet";

/**
 * World Map
 */
export default class WorldMap {
  constructor(options = {}) {
    this.breakpoints = options.breakpoints || null;
    this.init();
  }

  init() {
    console.log(L);

    if (document.querySelector("#worldMap")) {
      // initialize the map on the "worldMap" div with a given center and zoom
      var map = L.map("worldMap").setView([53, 12], 5);

      // Style URL format in XYZ PNG format; see our documentation for more options
      L.tileLayer("https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png", {
        minZoom: 3,
        maxZoom: 6,
        attribution:
          '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      }).addTo(map);

      var circle = L.circle([51.508, -0.11], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 50000,
      }).addTo(map);

      circle.bindPopup("I am a circle.");

      var popup = L.popup().setLatLng([51.513, -0.09]).setContent("I am a standalone popup.").openOn(map);
    }
  }
}

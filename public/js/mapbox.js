/* eslint-disable no-undef */

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoieW91c3NpZjc3IiwiYSI6ImNreWFnbTBrdzA1OGIycG84OTg5c2NheWEifQ.Jhwi6pdMWRCOZ8HeJvs0Dw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/youssif77/ckyc9hrgicvr515pc6kcb5w97',
  scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    right: 100,
    left: 100
  }
});

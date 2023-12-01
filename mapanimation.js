//gets the longitude and latitude of each bus
async function getCoordinates(data){
    let coordinates = [];
    data.forEach(bus => {
        let lat = bus.attributes.latitude;
        let lon = bus.attributes.longitude;
        let coor = [lon, lat];
        coordinates.push(coor);
    });
    return coordinates;
}

//gets location of each bus and returns an array with their logitude and latitude
async function getBusLocations(){
    const url = 'https://api-v3.mbta.com/vehicles';
    const resp = await fetch(url);
    const json = await resp.json();
    const data = getCoordinates(json.data);
    return data;
}

//adds each bus to the map
async function addBusToMap(coordinates){
    let counter = 0;
    let markers = [];
    coordinates.forEach(coor => {
        let marker = new mapboxgl.Marker()
            .setLngLat([coor[0], coor[1]])
            .addTo(map);
        markers.push(marker);
        counter++;
    })
    console.log(markers);
    return markers;
}

//updates the location of each bus and changes the coordinates of the marker
async function updateBusMap(coordinates, markers){
    let counter = 0;
    markers.forEach(marker => {
        marker.setLngLat([coordinates[counter][0], coordinates[counter][1]]);
        counter++;
    })
}

//mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoia2VlZ2FucmpvcmRhbiIsImEiOiJjbHBrY2J3ancwNnV3MmpvOWF5eWE2b3Q0In0.A-6c8W5JX6_sFjaVHzgGtA';

// This is the map instance
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    center: [-71.104081, 42.365554],
    zoom: 12,
        anchor: "viewport",
        color: "white",
        intensity: 0.4
});

//gets locations of busses and adds markers to the map
//updates bus locations every 15 seconds
async function move() {
    var locations = await getBusLocations();
    const markers = await addBusToMap(locations);

    setInterval(async () => {
        locations = await getBusLocations();
        await updateBusMap(locations, markers);
    }, 15000);
}


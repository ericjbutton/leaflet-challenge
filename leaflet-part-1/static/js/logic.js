console.log('hello');

const endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

let url = endpoint


//Setting up map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function markerSize(magnitude) {
    return Math.sqrt(magnitude)*30000;
}

L.control({position: 'bottomleft'})




d3.json(url).then(function(data) {
   let features = data.features


    for (let i = 0; i < features.length; i++) {
        
        // Defining coordinate
        let coordinate = [features[i].geometry.coordinates[1],features[i].geometry.coordinates[0]]
        
        // Defining depth
        let depth = features[i].geometry.coordinates[2]

        // Defining magnitude
        let magnitude = features[i].properties.mag
        
        // Defining fill color based on depth
        let color = "";
        if (depth > 50) {
            color = "blue";
        }
        else if (depth > 25) {
            color = "orange";
        }
        else if (depth > 10) {
            color = "green";
        }
        else {
            color = "yellow";
        }

        

        // Setting up markers
        L.circle(coordinate, {
            color: "Gray",
            fillOpacity: 2,
            fillColor: color,
            radius: markerSize(magnitude)
        }).bindPopup(`<h1>Magnitude: ${magnitude}</h1> <hr> <h3>Place: ${features[i].properties.place}</h3>`).addTo(myMap)
    }
});



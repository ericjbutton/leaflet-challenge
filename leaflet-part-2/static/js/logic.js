console.log('hello')

let earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

let tectonic_plates_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

function markerSize(magnitude) {
    return Math.sqrt(magnitude)*30000;
}

function createMap(earthquakes) {
    
    // Adding street Base Layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Adding topographical Base Layer
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    // Adding satellite Base Layer
    let satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
    });

    let baseMaps = {
        "Street": street,
        "Topographical": topo,
        "Satellite": satellite
    };

    let overlayMaps = {
        "Earthquakes": earthquakes
    };

    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [street, earthquakes]
    });

    d3.json(tectonic_plates_url).then(function(data) {
        L.geoJson(data).addTo(myMap);
    });
    

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}

function createEarthquakes(data) {
    let features = data.features

    let earthquakes = []

    for (let i = 0; i < features.length; i++) {
        // Defining coordinate
        let coordinate = [features[i].geometry.coordinates[1],features[i].geometry.coordinates[0]]
        //Defining depth
        let depth = features[i].geometry.coordinates[2]
        // Defining magnitude
        let magnitude = features[i].properties.mag
        //Defining fill color based on depth
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

        let earthquake = L.circle(coordinate, {
            color: "Gray",
            fillOpacity: 2,
            fillColor: color,
            radius: markerSize(magnitude)
        }).bindPopup(`<h1>Magnitude: ${magnitude}</h1> <hr> <h3>Place: ${features[i].properties.place}</h3>`)

        earthquakes.push(earthquake);
    }

    createMap(L.layerGroup(earthquakes));
}

d3.json(earthquake_url).then(createEarthquakes);


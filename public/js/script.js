const socket = io();

if(navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude} = position.coords;
            socket.emit("send-location", { latitude, longitude});
        },
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true, // setting up high-frequency co-ordinates
            timeout: 5000, //set timeout value to 5 seconds, hence it sends new coordinates for every 5 seconds
            maximumAge: 0,  //i.e it does not use caching, Instead of using caching to store data temp memory it takes new data often 
        }
    );
}

const map = L.map("map").setView([0, 0] , 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map)

const markers = {};

socket.on("recieve-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 10);
    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected", (id) => {
    if(markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
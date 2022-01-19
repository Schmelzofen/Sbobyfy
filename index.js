const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
require('dotenv').config()

/* 
Wir werden unser Wissen über die GET-Methode anwenden und wann und warum wir req.query und req.params verwenden.
Wir werden üben, wie man die Dokumentation (insbesondere dieses npm-Pakets) liest und wie man die in der Dokumentation enthaltenen Beispiele verwendet, um alle Durchgänge erfolgreich abzuschließen.
 */

/* SPOTIFY */
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
    .catch(error => console.log("Something went wrong, retrieving the access key: " + error.message));
/* --------- */

spotifyApi.setAccessToken(process.env.CLIENT_ID)

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded())
app.use(express.json())
app.get("/", (req, res) => {
    res.render("pages/index")
})

app.get("/artist-search/", (req, res) => {
    const suchbegriff = req.query.query
    spotifyApi.searchArtists(suchbegriff)
        .then(function (data) {
            console.log(`Search artists by ${suchbegriff}`, data.body)
            const myArr = data.body.artists.items
            console.log(myArr)
            res.render("pages/search", {
                myArr,
            })
        }, function (err) {
            console.error(err)
        })
})





const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Express server listening on port " + PORT);
})
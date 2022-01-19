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
    res.render("pages/index", {
        customClass: "customHeight",
    })
})

app.get("/artist-search/", (req, res) => {
    const suchbegriff = req.query.query
    spotifyApi.searchArtists(suchbegriff)
        .then(function (data) {
            const myArr = data.body.artists.items
            res.render("pages/search", {
                myArr,
                linkDesc: "View Albums",
                link: "artist"
            })
        }, function (err) {
            console.error(err)
            res.redirect("/")
        })
})

app.get("/artist/:id", (req, res) => {
    const id = req.params.id
    spotifyApi.getArtistAlbums(id).then(
        function (data) {
            const myArr = data.body.items
            res.render("pages/search", {
                myArr,
                linkDesc: "View Tracks",
                link: "album"
            })
        },
        function (err) {
            console.log(err)
        }
    )
})

app.get("/album/:id", (req, res) => {
    const id = req.params.id
    spotifyApi.getAlbumTracks(id)
        .then(function (data) {
            console.log(data.body.items)
            const album = data.body.items
            res.render("pages/album", {
                album,
            })
        }, function (err) {
            console.log("Oopsie!", err)
        })
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Express server listening on port " + PORT);
})
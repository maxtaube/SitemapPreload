var express = require("express");
const app = require("../app");
var router = express.Router();
const Sitemapper = require("sitemapper");
const formidable = require("formidable");
const https = require('node:https');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/url", function (req, res, next) {
  var url = "https://www.detact.com/sitemap_index.xml";
  console.log(`req body is ${req.body}`);

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

    try {
      console.log(fields);
      console.log(fields.url);
    } catch (error) {
      console.log(error)
    }
    

    const sitemap = new Sitemapper();

    sitemap
      .fetch(fields.url)
      .then(function (sites) {
        console.log(sites);


        // send sites back to client
        res.json({});
        

        /* or preload every link in sites.sites via https request*/
        sites.sites.forEach(function (site) {
          https.get(site.url, function (res) {
            console.log("got response: " + res.statusCode);
          }).on("error", function (e) {
            console.log("got error: " + e.message);
          });
        });


        /* sites.sites.forEach(function (site) {
          http.get(site.url, function (response) {
            console.log(site.url);
          }).on("error", function (err) {
            console.log("Error: " + err.message);
          }).end();
        }); */

        
        








        /* var options = {
          host: 'www.google.com',
          port: 80,
          path: '/upload',
          method: 'POST'
        };

        var req = http.request(options, function(res) {
          console.log('STATUS: ' + res.statusCode);
          console.log('HEADERS: ' + JSON.stringify(res.headers));
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
          });
        });
        
        req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
        }); */


      })
      .catch(function (err) {
        console.log(err);
        res.json(err);
      });
  });
});

module.exports = router;

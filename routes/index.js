var express = require("express");
const app = require("../app");
var router = express.Router();
const Sitemapper = require("sitemapper");
const formidable = require("formidable");
var https = require("https");

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
      console.log(fields.iframe);
    } catch (error) {
      console.log(error);
    }

    const sitemap = new Sitemapper();

    sitemap
      .fetch(fields.url)
      .then(function (sites) {
        console.log(sites);
        console.log(sites.sites.length);

        // send sites back to client
        if (fields.iframe === "true") {
          res.json(sites.sites);
        } else {
          /* or preload every link in sites.sites via https request*/
          var object = {};

          sites.sites.forEach((site) => {
            console.log(site);
            const options = {
              hostname: new URL(site).hostname,
              port: 443,
              path: new URL(site).pathname,
              method: "GET",
            };

            console.log(options);
            const req = https
              .request(options, (response) => {
                console.log(`statusCode: ${response.statusCode}`);
              })
              .on("error", (error) => {
                console.error(error);
                res.json(error);
              })
              .end();
          });
          object = { success: sites.sites.length };
          console.log(object);
          res.json(object);
        }
      })
      .catch(function (err) {
        console.log(err);
        res.json(err);
      });
  });
});

module.exports = router;

var express = require("express");
const app = require("../app");
var router = express.Router();
const Sitemapper = require("sitemapper");
const formidable = require("formidable");

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

        res.json(sites.sites);
        /* res.json(["https://www.detact.com/"]); */
      })
      .catch(function (err) {
        console.log(err);
        res.json(err);
      });
  });
});

module.exports = router;

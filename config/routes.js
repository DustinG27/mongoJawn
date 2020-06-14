module.exports = function (router) {
  // router that renders our homepage
  router.get("/", function (req, res) {
    res.render("home");
  });

  // router that renders the saved handlebars page
  router.get("/saved", function (req, res) {
    res.render("saved");
  });
};


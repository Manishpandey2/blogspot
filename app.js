const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/blogs", (req, res) => {
  res.render("blogs");
});

app.get("/categories", (req, res) => {
  res.render("categorie", {
    name: "manish",
    address: "Sankhuwasabha, Bihibare",
  });
});

app.use(express.static("public/css/"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`project has been started at port no ${PORT}`);
});

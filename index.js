import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/view"));

// set static file server
app.use(express.static("src/asset"));

// parsing data from client
app.use(express.urlencoded({ extended: false }));

// routing
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/testimonial", (req, res) => {
  res.render("testimonial");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/detail-project", (req, res) => {
  res.render("detail");
});
app.get("/add-project", (req, res) => {
  res.render("project");
});
app.post("/add-project", (req, res) => {
  const { title, startDate, endDate, Description, Technologies } = req.body;

  console.log(req.body);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

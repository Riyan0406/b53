import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
import path from "path";
import hbs from "hbs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/view"));

hbs.registerHelper("arrayIncludes", function (array, value) {
  return array.includes(value);
});

// set static file server
app.use(express.static("src/asset"));

// parsing data from client
app.use(express.urlencoded({ extended: false }));
const dataDami = [];

// routing
app.get("/", (req, res) => {
  res.render("index", { dataDami });
});
app.get("/testimonial", (req, res) => {
  res.render("testimonial");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/detail-project/:id", (req, res) => {
  const { id } = req.params;

  const dataCard = dataDami[parseInt(id)];
  console.log("detail", dataCard);

  res.render("detail", { dataDami: dataCard });
});
app.get("/add-project", (req, res) => {
  res.render("project");
});

app.post("/add-project", (req, res) => {
  const { title, startDate, endDate, Description, Technologies } = req.body;

  let startDatevelue = new Date(startDate);
  let endDateValue = new Date(endDate);

  let durasiWaktu = endDateValue.getTime() - startDatevelue.getTime();
  let durasiHari = durasiWaktu / (1000 * 3600 * 24);
  let durasiMinggu = Math.floor(durasiHari / 7);
  let sisaHari = durasiHari % 7;

  let durasiBulan = Math.floor(durasiHari / 30);
  let sisaHariBulan = durasiHari % 30;

  let durasiTahun = Math.floor(durasiHari / 365);
  let sisaHariTahun = durasiHari % 365;

  let durasiProject = "";

  if (durasiHari <= 6) {
    durasiProject = ` Durasi ${durasiHari + 1} Hari`;
  } else if (durasiTahun > 0) {
    if (sisaHariTahun > 0) {
      durasiProject = `Durasi ${durasiTahun} Tahun ${Math.floor(
        sisaHariTahun / 30
      )} Bulan ${Math.floor(sisaHariTahun % 30)} Hari`;
    } else {
      durasiProject = `Durasi ${durasiTahun} Tahun`;
    }
  } else if (durasiBulan > 0) {
    if (sisaHariBulan > 0) {
      durasiProject = `Durasi ${durasiBulan} Bulan ${sisaHari - 1} Hari`;
    } else {
      durasiProject = `Durasi ${durasiBulan} Bulan`;
    }
  } else if (sisaHari > 0) {
    durasiProject = `Durasi ${durasiMinggu} Minggu ${sisaHari} Hari`;
  } else {
    durasiProject = `Durasi ${durasiMinggu} Minggu`;
  }

  let currentTime = () => {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let month = currentDate.toLocaleString("en-US", { month: "short" });

    return month + " - " + hours + ":" + minutes + ":" + seconds;
  };

  let selectedTechnologies = Array.isArray(Technologies)
    ? Technologies
    : [Technologies];

  const data = {
    title,
    startDate,
    endDate,
    Technologies: selectedTechnologies,
    Description,
    durasiProject,
    postAd: currentTime(),
    author: "Riyan Maulana",
  };

  dataDami.unshift(data);
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  const { id } = req.params;

  const data = dataDami[parseInt(id)];
  data.id = parseInt(id);
  res.render("edit", { dataDami: data });
});
app.post("/edit", (req, res) => {
  const { id, title, startDate, endDate, Description, Technologies } = req.body;
  console.log("coba", req.body);

  let startDateValue = new Date(startDate);
  let endDateValue = new Date(endDate);

  let durasiWaktu = endDateValue.getTime() - startDateValue.getTime();
  let durasiHari = durasiWaktu / (1000 * 3600 * 24);
  let durasiMinggu = Math.floor(durasiHari / 7);
  let sisaHari = durasiHari % 7;

  let durasiBulan = Math.floor(durasiHari / 30);
  let sisaHariBulan = durasiHari % 30;

  let durasiTahun = Math.floor(durasiHari / 365);
  let sisaHariTahun = durasiHari % 365;

  let durasiProject = "";

  if (durasiHari <= 6) {
    durasiProject = ` Durasi ${durasiHari + 1} Hari`;
  } else if (durasiTahun > 0) {
    if (sisaHariTahun > 0) {
      durasiProject = `Durasi ${durasiTahun} Tahun ${Math.floor(
        sisaHariTahun / 30
      )} Bulan ${Math.floor(sisaHariTahun % 30)} Hari`;
    } else {
      durasiProject = `Durasi ${durasiTahun} Tahun`;
    }
  } else if (durasiBulan > 0) {
    if (sisaHariBulan > 0) {
      durasiProject = `Durasi ${durasiBulan} Bulan ${sisaHari - 1} Hari`;
    } else {
      durasiProject = `Durasi ${durasiBulan} Bulan`;
    }
  } else if (sisaHari > 0) {
    durasiProject = `Durasi ${durasiMinggu} Minggu ${sisaHari} Hari`;
  } else {
    durasiProject = `Durasi ${durasiMinggu} Minggu`;
  }

  let currentTime = () => {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let month = currentDate.toLocaleString("en-US", { month: "short" });

    return month + " - " + hours + ":" + minutes + ":" + seconds;
  };
  let selectedTechnologies = Array.isArray(Technologies)
    ? Technologies
    : [Technologies];

  dataDami[parseInt(id)] = {
    title,
    startDate,
    endDate,
    Description,
    Technologies: selectedTechnologies,
    durasiProject,
    postAt: currentTime(),
  };
  console.log("edit-post", dataDami);
  res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
  const { id } = req.params;

  dataDami.splice(id, 1);
  console.log("delete", dataDami);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

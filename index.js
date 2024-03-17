import express from "express";
import { fileURLToPath } from "url";
import { dirname, format } from "path";
import { createRequire } from "module";
import path from "path";
import hbs from "hbs";
import fs from "fs";
import bcrypt from "bcrypt";
import session from "express-session";
import flash from "express-flash";
import upload from "./middleware/upload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/view"));

hbs.registerHelper("arrayIncludes", function (array, value) {
  return array.includes(value);
});

app.use("/upload", express.static(path.join(__dirname, "src/upload")));

//setup flash
app.use(flash());
//setup session express
app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: new session.MemoryStore(),
    save: true,
    resave: false,
    secret: "Arkanul Adelis",
  })
);

// set static file server
app.use(express.static("src/asset"));

// parsing data from client
app.use(express.urlencoded({ extended: false }));
const dataDami = [];

// connection database

const configPath = path.resolve(__dirname, "src/config/config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

import { Sequelize, QueryTypes, cast } from "sequelize";
import { error } from "console";
const sequelize = new Sequelize(config.development);
// Lakukan sesuatu dengan sequelize...

///
let currentTime = () => {
  let currentDate = new Date();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();
  let month = currentDate.toLocaleString("en-US", { month: "short" });

  return month + " - " + hours + ":" + minutes + ":" + seconds;
};
// routing

app.get("/", async (req, res) => {
  try {
    const query = `SELECT projects.*, "Users"."Name" AS authorName
    FROM projects
    LEFT JOIN "Users" ON projects.author_id = "Users".id;    
    `;
    let projects = await sequelize.query(query, { type: QueryTypes.SELECT });
    projects = projects.map((project) => {
      let startDateValue = new Date(project.start_date);
      let endDateValue = new Date(project.end_date);

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

      if (req.session.idUser === project.author_id) {
        project.isOwner = true;
      } else {
        project.isOwner = false;
      }

      project.durasiProject = durasiProject;
      project.created_at = currentTime();
      project.isLogin = req.session.isLogin;
      return project;
    });
    console.log("req session", req.session.idUser);

    res.render("index", {
      dataDami: projects,
      isLogin: req.session.isLogin,
      user: req.session.user,
      idUser: req.session.idUser,
    });
  } catch (error) {
    console.log("catc", error);
  }
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
  res.render("project", {
    isLogin: req.session.isLogin,
    user: req.session.user,
    idUser: req.session.idUser,
  });
});
app.post("/add-project", upload.single("image"), async (req, res) => {
  const { title, startDate, endDate, Description, Technologies } = req.body;
  console.log("req body", req.body);
  const image = req.file.filename;
  const id_user = req.session.idUser;
  const query = `INSERT INTO public.projects(
     title, start_date, end_date, description, technologies, image, author_id, created_at, updated_at)
    VALUES ('${title}','${startDate}','${endDate}','${Description}','{${Technologies}}','${image}','${id_user}', NOW(), NOW())`;

  const data = await sequelize.query(query, { type: QueryTypes.INSERT });

  console.log("post", data);
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const obj = await sequelize.query(
      `SELECT id, title, start_date, end_date, description, technologies, image, author_id, created_at, updated_at FROM projects WHERE id = ${id}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const data = obj[0];
    data.start_date = data.start_date.toISOString().split("T")[0];
    data.end_date = data.end_date.toISOString().split("T")[0];

    console.log("edit view", data);
    res.render("edit", {
      dataDami: data,
      isLogin: req.session.isLogin,
      user: req.session.user,
    });
  } catch (error) {
    console.log("edit", error);
  }
});
app.post("/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startDate, endDate, Description, Technologies } = req.body;
    const idUser = req.session.idUser;

    let image;
    if (req.file) {
      image = req.file.filename;
    }
    let query = `
  UPDATE public.projects
  SET title='${title}', start_date='${startDate}', end_date='${endDate}', description='${Description}', technologies='{${Technologies}}',`;
    if (image) {
      query += `image='${image}', `;
    }
    query += `author_id='${idUser}', created_at=NOW(), updated_at=NOW()
    WHERE id=${id}`;

    const obj = await sequelize.query(query, { type: QueryTypes.UPDATE });

    console.log("update-post", { dataDami: obj });
    res.redirect("/");
  } catch (error) {
    console.error("update", error);
  }
});

app.get("/delete/:id", (req, res) => {
  const { id } = req.params;

  dataDami.splice(id, 1);
  console.log("delete", dataDami);
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const users = await bcrypt.hash(password, 10, (error, hashPassword) => {
      const query = `INSERT INTO public."Users" ("Name" , email , password , "createdAt", "updatedAt") VALUES ('${name}', '${email}', '${hashPassword}', NOW(), NOW())`;
      sequelize.query(query, { type: QueryTypes.INSERT });
    });

    res.redirect("/login");
  } catch (error) {
    console.log("register", error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = `SELECT * FROM "Users" WHERE email = '${email}'`;
    const users = await sequelize.query(query, { type: QueryTypes.SELECT });

    const match = await bcrypt.compare(password, users[0].password);
    if (!match) {
      req.flash("danger", "mohon ulangi, inputan anda ada yang salah !");
      return res.redirect("/login");
    } else {
      req.session.isLogin = true;
      req.session.idUser = users[0].id;
      req.session.user = users[0].Name;
      req.flash("success", "login success");
      return res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    // Handle error
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

let dataProject = [];

function addData(event) {
  event.preventDefault();

  let title = document.getElementById("title").value;
  let startDate = document.getElementById("startdate").value;
  let endDate = document.getElementById("enddate").value;
  let description = document.getElementById("descrip").value;
  let image = document.getElementById("image").files[0];

  if (!image) {
    console.error("Tidak ada file gambar yang dipilih atau file tidak valid.");
    return;
  }

  //waktu post

  // Durasi Project
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
  console.log(durasiProject);

  let currentTime = () => {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let date = currentDate.getDate();
    let month = currentDate.toLocaleString("en-US", { month: "short" });
    let yers = currentDate.getFullYear();

    return (
      date +
      " " +
      month +
      " - " +
      yers +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  };

  // icon
  const golang = `<i class="fa-brands fa-golang"></i>`;
  const java = ` <i class="fa-brands fa-java"></i>`;
  const react = ` <i class="fa-brands fa-react"></i>`;
  const node = `<i class="fa-brands fa-node-js"></i>`;

  // cek kondisi
  let getIcon1 = document.getElementById("node").checked ? node : "";
  let getIcon2 = document.getElementById("java").checked ? java : "";
  let getIcon3 = document.getElementById("golang").checked ? golang : "";
  let getIcon4 = document.getElementById("react").checked ? react : "";

  let project = {
    title,
    startDate,
    endDate,
    durasiProject,
    description,
    image: URL.createObjectURL(image),
    getIcon1,
    getIcon2,
    getIcon3,
    getIcon4,
    postAt: currentTime(),
  };

  dataProject.unshift(project);
  renderProject();
  console.log(dataProject);
}

function renderProject() {
  console.log(document.getElementById("contents"));
  document.getElementById("contents").innerHTML = "";

  for (let index = 0; index < dataProject.length; index++) {
    // console.log(dataProject[index]);

    document.getElementById("contents").innerHTML += `

  <div class="card">
   <div class="img-p">
    <img src="${dataProject[index].image}" />
  </div>
  <div class="tech-a">
    <a href="/view/detail.html">${dataProject[index].title}</a>
    <p>${dataProject[index].postAt} | ${dataProject[index].durasiProject}</p>
  </div>
  <div class="descrip-p">
    <p>
     ${dataProject[index].description}
    </p>
  </div>
  <div class="icon-card">
    ${dataProject[index].getIcon1}
      ${dataProject[index].getIcon2}
      ${dataProject[index].getIcon3}
      ${dataProject[index].getIcon4}
  </div>
  <div class="putterr">
    <div class="putterr-left">
      <button class="bt-edit">Edit</button>
    </div>
    <div class="putterr-right">
      <button class="bt-hapus">Hapus</button>
    </div>

    </div>

`;
  }
}

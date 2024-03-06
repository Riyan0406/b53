const dataCard = new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "https://api.npoint.io/0b8e75795d13b81e0068", true);

  xhr.onload = () => {
    if (xhr.status == 200) {
      console.log(JSON.parse(xhr.responseText));
      resolve(JSON.parse(xhr.responseText));
    } else {
      console.log("Error Data Loading");
      reject("Error Data Loading");
    }
  };

  xhr.send();
});

function html(value) {
  return `
      <div class="card-testi">
      <img
        src="${value.image}"
        class="profile-testimonial"
      />
      <p class="kata-kata">
        ${value.quots}
      </p>
      <p class="riyan">- ${value.author}</p>
      <p class="bintang">${value.rating}<i class="fa-solid fa-star"></i> </p>
    </div>
      `;
}

async function allTestimonials() {
  try {
    const response = await dataCard;
    console.log(response);
    let testimonials = "";
    response.forEach((data) => {
      testimonials += html(data);
    });
    document.getElementById("testimonial").innerHTML = testimonials;
  } catch (error) {
    console.log(error);
  }
}
allTestimonials();

async function cardFiltered(rating) {
  const response = await dataCard;
  let testimonials = "";
  const filtered = response.filter((item) => {
    return item.rating == rating;
  });

  if (filtered == 0) {
    testimonials += `<h1> Data Not Found </h1>`;
  } else
    filtered.forEach((dataBAru) => {
      testimonials += html(dataBAru);
    });

  document.getElementById("testimonial").innerHTML = testimonials;
}

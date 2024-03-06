function submitData() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const number = document.getElementById("nomer").value;
  const select = document.getElementById("input-select").value;
  const message = document.getElementById("Description").value;

  if (name === "") {
    return alert("Isikan dulu nama");
  } else if (email === "") {
    return alert("Isikan dulu emailnya");
  } else if (number === "") {
    return alert("Tolong isi nomornya");
  } else if (select === "") {
    return alert("Isikan dulu subjectnya");
  } else if (message === "") {
    return alert("Tolong isi descripsinya");
  }

  let emailReceiver = "riyanmaulana04@gmail.com";
  let a = document.createElement("a");
  a.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailReceiver}&su=${select}&body=Hello, nama saya ${name}, ${message}, Tolong hubungi saya di ${email}, atau no wa ${number}`;
  a.click();

  let data = {
    nama: name,
    email: email,
    number: number,
    subject: select,
    message: message,
  };
  console.log(data);
}

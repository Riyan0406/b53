let hamburgerIsOpen = false;
const openHamburger = () => {
  let itemsBars = document.getElementById("items-bars");
  if (!hamburgerIsOpen) {
    itemsBars.style.display = "block";
    hamburgerIsOpen = true;
  } else {
    itemsBars.style.display = "none";
    hamburgerIsOpen = false;
  }
};

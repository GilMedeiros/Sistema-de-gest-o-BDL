var overlay = document.getElementById("overlay");
var sidebar = document.getElementById("sidebar");
var content = document.querySelector(".content");
var menuBtn = document.getElementById("menu-btn");
var isOpen = false;

menuBtn.addEventListener("click", function(event) {
  event.preventDefault();
  isOpen = !isOpen;
  if (isOpen) {
    overlay.style.display = "block";
    sidebar.style.left = "0";
    content.classList.add("menu-open");
  } else {
    overlay.style.display = "none";
    sidebar.style.left = "-250px";
    content.classList.remove("menu-open");
  }
});

overlay.addEventListener("click", function() {
  isOpen = false;
  overlay.style.display = "none";
  sidebar.style.left = "-250px";
  content.classList.remove("menu-open");
});

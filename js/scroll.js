window.addEventListener("scroll", function () {
  const elm = document.querySelector("#elm");
  const scroll = window.pageYOffset;
  if (scroll > 500) {
    elm.style.opacity = "1";
    elm.style.zIndex = "1";
    // console.log(scroll);
  } else {
    elm.style.opacity = "0";
    elm.style.zIndex = "-1";
    // console.log(scroll);
  }
});
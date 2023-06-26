document.addEventListener("DOMContentLoaded", () => {
  startSlider();
});
  
function startSlider() {
  setInterval(() => moveForward(), 5000);
}

let position = 0;
let slider = document.querySelector(".slider");
let dots = document.querySelector(".dots").children;

const imagesSet = [
  "img/banner0.png",
  "img/banner1.png",
  "img/banner2.png",
];
  
slider.src = "img/banner0.png";
    
function moveForward() {
  position = Number(position) + 1;
  
  if (position > imagesSet.length - 1) {
    position = 0;
    slider.src = `${imagesSet[position]}`;
  } else {
    slider.src = `${imagesSet[position]}`;
  }
  for (let key of dots) {
    key.style.backgroundColor = "#EFEEF6";
  }
  document.querySelector(`.dot${position}`).style.backgroundColor = "#9E98DC";
}
  
function selectDot(e) {
  let index = e.target.className;
  index = index.slice(-1);
  position = index;
  for (let key of dots) {
    key.style.backgroundColor = "#EFEEF6";
  }
  slider.src = `${imagesSet[position]}`;
  document.querySelector(`.dot${position}`).style.backgroundColor = "#9E98DC";
}
 
Array.from(dots).forEach(dot => {
  dot.addEventListener("click", selectDot);
});
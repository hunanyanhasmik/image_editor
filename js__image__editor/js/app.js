"use strict";
const container = document.querySelector(".container");
const imgInput = document.querySelector(".file-input");
const filterOptions = document.querySelectorAll(".filter-input");
const rotateOptions = document.querySelectorAll(".rotate button");
const filterImg = document.querySelector(".filter-img img");
const resetFilterBtn = document.querySelector(".reset-filter");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");
const left = document.querySelector("#left");
const right = document.querySelector("#right");
const horizontal = document.querySelector("#horizontal");
const vertical = document.querySelector("#vertical");

const mode = document.querySelector(".mode");
const toggleIcon = document.querySelector(".toggle-icon");
const moon = document.querySelector(".moon");
const sun = document.querySelector(".sun");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

let grey = document.querySelector("#grayscale");
let inversion = document.querySelector("#inversion");
let bright = document.querySelector("#brightness");
let blur = document.querySelector("#blur");
let saturate = document.querySelector("#saturate");
let sepia = document.querySelector("#sepia");
let opacity = document.querySelector("#opacity");
let hue = document.querySelector("#hue");
let contrast = document.querySelector("#contrast");

let rotate = 0, flipHorizontal = 1, flipVertical = 1;

mode.addEventListener("click", () => {
    document.body.classList.toggle("light");

    container.classList.toggle("light");
    toggleIcon.classList.toggle("light");

    if (toggleIcon.classList.contains("light")) {
        moon.style.display = "none";
        sun.style.display = "block";
    } else {
        moon.style.display = "block";
        sun.style.display = "none";
    }
});

function loadImage() {
    let file = imgInput.files[0];
    if (!file) return;
    filterImg.src = URL.createObjectURL(file);
    filterImg.addEventListener("load", () => {
        resetFilterBtn.click();
        container.classList.remove("disable");
    });
};

for (let i = 0; i < filterOptions.length; i++) {
    filterOptions[i].addEventListener("change", imageFiltering);

}

function imageFiltering() {
    filterImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;

    filterImg.style.filter = `grayscale(${grey.value}%) saturate(${saturate.value}%) hue-rotate(${hue.value}deg) invert(${inversion.value}%) contrast(${contrast.value}%) brightness(${bright.value}%) blur(${blur.value}px) sepia(${sepia.value}%) opacity(${opacity.value}%)`;

    ctx.filter = filterImg.style.filter = `grayscale(${grey.value}%) saturate(${saturate.value}%) hue-rotate(${hue.value}deg) invert(${inversion.value}%) contrast(${contrast.value}%) brightness(${bright.value}%) blur(${blur.value}px) sepia(${sepia.value}%) opacity(${opacity.value}%)`;

    ctx.drawImage(filterImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
};

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }

        canvas.width = filterImg.naturalWidth;
        canvas.height = filterImg.naturalHeight;

        ctx.translate(canvas.width / 2, canvas.height / 2);

        if (rotate !== 0) {
            ctx.rotate(rotate * Math.PI / 180);
        }
        ctx.scale(flipHorizontal, flipVertical);

        filterImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
        ctx.drawImage(filterImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    });
});

function resetFilter() {
    filterImg.style.filter = "none";
    filterImg.style.transform = `rotate(${0}deg) scale(${1}, ${1})`;

    for (let i = 0; i <= filterOptions.length - 1; i++) {
        if (i === 0 || i === 1 || i === 2 || i === 3) {
            filterOptions[i].value = "100";
        } else {
            filterOptions[i].value = "0";
        }
    }
    imageFiltering();
};

function saveImage() {
    let elementLink = document.createElement("a");
    elementLink.setAttribute('download', 'edited_image.png');

    let canvasData = canvas.toDataURL("image/png");
    canvasData.replace("image/png", "image/octet-stream");
    elementLink.setAttribute('href', canvasData);
    elementLink.click();
};

resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
imgInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => imgInput.click());

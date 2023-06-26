document.addEventListener("DOMContentLoaded", () => {
    bookRequest("Architecture", 0);
    document.querySelector(":root").style.setProperty("--hidden", "hidden");
    if (localStorage.getItem("cartCount") === null) {
      cart.dataset.styleType = "0";
    } else {
      cart.dataset.styleType = localStorage.getItem("cartCount");
      document.querySelector(":root").style.setProperty("--hidden", "visible");
    }
    cartCheck();
});
    
let cards = document.querySelector(".cards");
let catalog = document.querySelectorAll(".catalog_ul_a");
let loadMore = document.querySelector(".load_more");
let cart = document.querySelector(".cart");
const BUYNOW = "BUY NOW";
const INTHECART = "IN THE CART";
const formatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
});


function bookRequest(category, startPositon) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q="subject:${category}"&key=AIzaSyA1qT-iIe0RjxacQSFVui1sCk38szrgrcE&printType=books&startIndex=${startPositon}&maxResults=6&langRestrict=en`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        for (let i = 0; i < data.items.length; i++) {
            cards.innerHTML += `
            <div class="card">
                ${data.items[i].volumeInfo.imageLinks ?
                    `<img class="cover" src="${data.items[i].volumeInfo.imageLinks.thumbnail}" alt="book cover"></img>` :
                    "<img class=\"cover\" src=\"img/nocover.png\" alt=\"no cover\"></img>"}
                <div class="description">
                    ${data.items[i].volumeInfo.authors ?
                    `<div class="author">${data.items[i].volumeInfo.authors}</div>` :
                    "<div class=\"author\"></div>"}
                    <div class="title">${data.items[i].volumeInfo.title}</div>
                    ${data.items[i].volumeInfo.ratingsCount ?
                        `<div class="rating">${ratingStars(Math.round(data.items[i].volumeInfo.averageRating))} ${data.items[i].volumeInfo.ratingsCount} review</div>`
                        : "<div></div>"}
                        <div class="review">${review(data.items[i].volumeInfo.description)}</div>
                    ${data.items[i].saleInfo.retailPrice ?
                        `<div class="price">${formatter.format(data.items[i].saleInfo.retailPrice.amount)}</div>
                        <button class="buy" data-id=${data.items[i].id}>${purchaseBtnLabel(data.items[i].id)}</button>`
                        : `<div class="price">${data.items[i].saleInfo.saleability.replace(/_/g, " ")}</div>`}
                </div>
            </div>`;
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

catalog.forEach(link => {
    link.addEventListener("click", changeCategory);
});

function changeCategory(link) {
    cards.innerHTML = "";
    document.querySelector(".active").classList.remove("active");
    link.target.classList.add("active");
    let category = link.target.innerText;
    bookRequest(category, 0);
}

loadMore.addEventListener("click", () => {
    let activeCategory = document.querySelector(".active").innerText;
    let cardNumber = document.querySelectorAll(".card");
    bookRequest(activeCategory, cardNumber.length);
});
    
function ratingStars(num) {
    let stars = "";
    for (let i = 0; i < num; i++) {
        stars += `<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0L7.80568 3.5147L11.7063 4.1459L8.92165 6.9493L9.52671 10.8541L6 9.072L2.47329 10.8541L3.07835 6.9493L0.293661 4.1459L4.19432 3.5147L6 0Z" fill="#F2C94C"/>
        </svg>`;
    }
    for (let i = 0; i < 5 - num; i++) {
        stars += `<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0L7.80568 3.5147L11.7063 4.1459L8.92165 6.9493L9.52671 10.8541L6 9.072L2.47329 10.8541L3.07835 6.9493L0.293661 4.1459L4.19432 3.5147L6 0Z" fill="#EEEDF5"/>
        </svg>`;
    }
    return stars;
}
    
function review(description) {
    if (description) {
        if (description.length > 90) {
            return `${description.slice(0, 90)}…`;
        } else {
            return description;
        }
    } else {
        return "no description";
    }
}
    
function purchase(btn) {
    if (btn.innerText === BUYNOW) {
        if (localStorage.getItem("cartId") == null) {
            let arr = Array(btn.dataset.id);
            localStorage.setItem("cartId", JSON.stringify(arr));
        } else {
            let arr = JSON.parse(localStorage.getItem("cartId"));
            if (arr.length == 0) {
                let i = btn.dataset.id;
                arr = Array(i);
                localStorage.setItem("cartId", JSON.stringify(arr));
            } else {
                let i = btn.dataset.id;
                arr.push(i);
                localStorage.setItem("cartId", JSON.stringify(arr));
            }
        }
    
        btn.innerText = INTHECART;
        cart.dataset.styleType = Number(cart.dataset.styleType) + 1;
        localStorage.setItem("cartCount", `${cart.dataset.styleType}`);
        document.querySelector(":root").style.setProperty("--hidden", "visible");
    
    } else if (btn.innerText === INTHECART) {
        let arr = JSON.parse(localStorage.getItem("cartId"));
        let i = arr.filter(item => {
            return item != btn.dataset.id;
        });
       
        localStorage.setItem("cartId", JSON.stringify(i));
        btn.innerText = BUYNOW;
        cart.dataset.styleType = Number(cart.dataset.styleType) - 1;
        localStorage.setItem("cartCount", `${cart.dataset.styleType}`);
        cartCheck();
    }
}
    
function purchaseBtnLabel(btnId) {
    if (localStorage.getItem("cartId") == null) {
        return BUYNOW;
    } else {
        let cartArray = JSON.parse(localStorage.getItem("cartId"));
        let i = cartArray.filter(item => {
            return item == btnId;
        });
        
        if (i.length > 0) {
            return INTHECART;
        } else {
            return BUYNOW;
        }
    }
}

document.addEventListener("click", (e) => {
    const {target} = e;
    if (target.tagName === "BUTTON" && target.classList.contains("buy")) {
        purchase(target);
    }
});
    
function cartCheck() {
    if (localStorage.getItem("cartCount") > 0) {
        document.querySelector(":root").style.setProperty("--hidden", "visible");
    } else {
        document.querySelector(":root").style.setProperty("--hidden", "hidden");
    }
}
//load up entire ui with empty buttons

//when button clicked object literal
//key is desset name, value is amount
// when amount increases, access key and increase amount on object
//for every new key append to container
dessertGrid = document.getElementById("dessert-grid");
dessertCart = document.getElementById("cart");
aside = document.querySelector(".inside-aside");
theActualAside = document.querySelector("aside");
body = document.querySelector("body");

async function getData() {
  try {
    data = await fetch("./data.json");
    if (!data.ok) {
      throw new Error("fetching failed");
    }
    const jsonData = await data.json();

    init(jsonData);
  } catch (err) {
    console.error(err);
  }
}
let totalPrice = 0.0;
// main function
function init(jsonData) {
  const dessertList = {};
  createDessert(jsonData);
  desserts = document.querySelectorAll(".dessert-container");
  totalPriceElement = document.querySelector(".total-price");
  buyButton(desserts, dessertList, jsonData);
  changeAmount(desserts, dessertList, jsonData);
  const confrimButton = document.querySelector(".confirm-order");
  confrimButton.addEventListener("click", () => {
    theActualAside.classList.add("active");
    body.classList.add("active");
    createFinalContainer(dessertList, jsonData);
  });

  calculateTotal(dessertList, jsonData, totalPrice);

  //buyButton
  // add and minus
}

getData();

function calculateTotal(dessertList, jsonData) {
  keys = Object.keys(dessertList);
  let quantity = 0;
  const totalElement = document.querySelector(".total-price");

  console.log("this is the full price ", totalPrice);
  totalElement.textContent = totalPrice;

  let quantityElement = document.querySelector(".quantity");
  keys.forEach((key) => {
    quantity = quantity + dessertList[key];
    const result = jsonData.find((item) => item.name === key);
    console.log(result.price);
    console.log(dessertList[key]);
    //total price
    // totalPrice = parseFloat(dessertList[key]);
    // //  parseFloat(result.price);
    // totalPriceElement.textContent = totalPrice + "$";
    quantityElement.textContent = `( ${quantity})`;
  });

  const prices = document.querySelectorAll(".full-price");
  console.log("here are all the price", prices);
  totalPrice = 0.0;
  prices.forEach((price) => {
    let replacement = price.textContent.replace("$", "").trim();
    console.log("this is a price ", replacement);
    let indie = parseFloat(replacement);
    totalPrice = totalPrice + indie;
    totalElement.textContent = "$" + totalPrice;
    console.log("here is the total price ", totalPrice);
  });
}
function render(dessertList, jsonData, amount = 1) {
  dessertCart.innerHTML = "";

  keys = Object.keys(dessertList);
  desserts.forEach((element) => {
    let number = element.querySelector(".number");
    if (number.textContent == "0") {
      number.textContent = 1;
    }
  });
  keys.forEach((key) => {
    const result = jsonData.find((item) => item.name == key);

    resultName = result.name;
    console.log(resultName + "here is resultname");
    const formattedKey = resultName.replace(/\s+/g, "_");

    const item = dessertGrid.querySelector(`.${formattedKey}`);
    console.log(item);
    // let number = item.querySelector(".number").textContent;
    // if (number == 0) {
    //   number = 1;
    // }

    dessertBoughtContainer = document.createElement("section");
    dessertBoughtContainer.classList.add("dessert-bought");
    dessertBoughtContainer.classList.add(`${formattedKey}`);
    dessertBoughtContainer.innerHTML = `
    <h4>${result.name}</h4>
      <div class="product-details">
        <span class="amount"> 1x${dessertList[resultName]}</span>
        <span class="price" > @${result.price}</span>
        <span class="full-price"> $${
          result.price * dessertList[resultName]
        }</span>
      </div>`;

    dessertCart.appendChild(dessertBoughtContainer);
  });

  keys.forEach((key) => {
    if (dessertList[key] < 1) {
      console.log(key);
      delete dessertList[key];
      const formattedKey = key.replace(/\s+/g, "_");
      document.querySelector(`.${formattedKey}`).classList.remove("active");
      dessertCart.querySelector(`.${formattedKey}`).remove();
      reverseDessert = dessertGrid.querySelector(`.${formattedKey}`);
      const button = reverseDessert.querySelector(".add-to-cart");
      const amountButton = reverseDessert.querySelector(".amount-button");
      amountButton.classList.remove("active");
      button.style.display = "block";
    }
  });
  console.log(dessertList, jsonData);
}

function changeAmount(desserts, dessertList, jsonData) {
  desserts.forEach((dessert) => {
    const minus = dessert.querySelector(".minus");
    const plus = dessert.querySelector(".plus");
    const name = dessert.querySelector("h3").textContent;
    plus.addEventListener("click", (e) => {
      let amount = dessertList[name];
      amount = amount + 1;
      dessertList[name] = amount;
      const prevSibling = e.currentTarget.previousElementSibling;
      prevSibling.textContent = amount;

      render(dessertList, jsonData, amount);
      calculateTotal(dessertList, jsonData);
    });
    minus.addEventListener("click", (e) => {
      let amount = dessertList[name];
      amount = amount - 1;
      dessertList[name] = amount;
      const nextSibling = e.currentTarget.nextElementSibling;
      nextSibling.textContent = amount;
      render(dessertList, jsonData, amount);
      calculateTotal(dessertList, jsonData);
    });
  });
}

function buyButton(desserts, dessertList, jsonData) {
  desserts.forEach((dessert) => {
    const name = dessert.querySelector("h3").textContent;
    const button = dessert.querySelector(".add-to-cart");
    const amountButton = dessert.querySelector(".amount-button");
    button.addEventListener("click", () => {
      button.style.display = "none";
      amountButton.classList.add("active");
      dessert.classList.add("active");

      dessertList[name] = 1;
      render(dessertList, jsonData);
      calculateTotal(dessertList, jsonData);
    });
  });
}
//change the button vieew
// add to array

function createDessert(jsonData) {
  jsonData.forEach((element) => {
    dessertContainer = document.createElement("div");
    dessertGrid.appendChild(dessertContainer);
    dessertContainer.classList.add("dessert-container");
    const key = element.name;
    const formattedKey = key.replace(/\s+/g, "_");
    dessertContainer.classList.add(formattedKey);
    const number = element.price.toFixed(2);

    dessertContainer.innerHTML = `<div class="img-container">


    <picture>
    <source media="(max-width:600 )" srcset="${element.image.mobile}">
    <img src="${element.image.desktop}" alt="">

    </picture>
    <div class="buy-button-container">
        <div class="amount-button">
            <button class="minus"><span>-</span></button>
            <span class="number">1</span>
            <button class="plus"><span>+</span></button>
        </div>
      <button class="add-to-cart">Add to Cart</button>

    </div>

    </div>

    <div class="dessert-description">
    <p class="name">${element.category}</p>
    <h3>${element.name}</h3>
    
    <p class="price">${number}</p>

    </div>`;
  });
}

function createFinalContainer(dessertList, jsonData) {
  keys = Object.keys(dessertList);
  document.querySelector(".final-price").textContent = "$" + totalPrice;
  keys.forEach((key) => {
    console.log(key);
    const result = jsonData.find((item) => item.name == key);
    console.log("this is a result", result);
    resultImage = result.image.thumbnail;
    console.log("this is the result image ", resultImage);
    resultName = result.name;

    const formattedKey = resultName.replace(/\s+/g, "_");

    finalContainer = document.createElement("section");
    finalContainer.classList.add("final-container");

    console.log(formattedKey);
    finalContainer.innerHTML = `
    <div class="image-thumbail">
    <img class="thumbnail"src="${resultImage}">
    </div>
    <div class="right">
    <h4>${result.name}</h4>
      <div class="product-details">
        <span class="amount"> ${dessertList[resultName]}x</span>
        <span class="price" >${result.price}$</span>
        
      </div>
      
    </div>
    <span class="full-price">${result.price * dessertList[resultName]}$ </span>
      
      `;

    aside.appendChild(finalContainer);
  });
  finalButton = document.querySelector(".final-button");
  finalButton.addEventListener("click", () => {
    location.reload();
  });
}

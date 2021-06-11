let ProductList = [];
let Cart = [];

function renderProduct(arrProduct, type = "") {
    let content = "";
    arrProduct.map((product) => {
        if (type === "") {
            content += `
                <div class="col-4 mb-3">
                    <div class="card">
                        <img class="card-img-top" src="${product.image}" alt="">
                        <div class="card-body">
                            <h4 class="card-title">${product.name}</h4>
                            <p class="card-text">${product.price}$</p>
                            <button class="btn btn-success" onclick="addToCart('${product.id}')">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (product.type === type) {
            content += `
                <div class="col-4 mb-3">
                    <div class="card">
                        <img class="card-img-top" src="${product.image}" alt="">
                        <div class="card-body">
                            <h4 class="card-title">${product.name}</h4>
                            <p class="card-text">${product.price}$</p>
                            <button class="btn btn-success" onclick="addToCart('${product.id}')">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    document.querySelector(".product__list").innerHTML = content;
}

async function getDataProductApi() {
    try {
        let result = await axios({
            url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
            method: "get",
        });
        ProductList = result.data;
        renderProduct(ProductList);
    } catch (err) {
        console.log(err);
    }
}

function selectType() {
    let type = document.querySelector("#inputSelectType");
    let typeValue = type[type.selectedIndex].innerHTML;
    if (typeValue === "Samsung") {
        renderProduct(ProductList, "samsung");
    } else if (typeValue === "Iphone") {
        renderProduct(ProductList, "iphone");
    } else {
        renderProduct(ProductList);
    }
}

function renderCart(arrCart) {
    let content = "";
    arrCart.map((item) => {
        content += `
                <tr>
                    <td><img class="img-thumbnail" src="${
                        item.product.image
                    }" alt=""></td>
                    <td>${item.product.name}</td>
                    <td>${item.product.price}</td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-secondary" onclick="changeProduct('${
                                item.product.id
                            }', 'minus')">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button type="button" class="btn btn-secondary" onclick="changeProduct('${
                                item.product.id
                            }', 'plus')">+</button>
                        </div>
                    </td>
                    <td>
                        <p>${item.product.price * item.quantity}$</p>
                    </td>
                    <td><button class="btn btn-danger" onclick="deleteProduct('${
                        item.product.id
                    }')">X</button></td>
                </tr>
            `;
    });

    if (Cart.length !== 0) {
        let totalCart = 0;
        Cart.map((item) => (totalCart += item.product.price * item.quantity));
        content += `
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Tổng tiền</td>
                    <td>${totalCart}$</td>
                    <td><button class="btn btn-success" onclick="payCart()">Thanh toán</button></td>
                </tr>
            `;
    }

    document.querySelector("#productTable").innerHTML = content;
    luuStorage();
}

function addToCart(id) {
    ProductList.filter((itemProductList) => {
        if (itemProductList.id === id) {
            if (isProductInCart(Cart, id)) {
                Cart.filter((itemCart) => {
                    if (itemCart.product.id === id) itemCart.quantity++;
                });
            } else {
                let productCart = new ProductCart(itemProductList, 1);
                Cart.push(productCart);
            }
        }
    });

    renderCart(Cart);
}

function isProductInCart(arrCart, id) {
    var flag = false;
    for (let item of arrCart) {
        if (item.product.id === id) {
            flag = true;
            break;
        }
    }
    return flag;
}

function changeProduct(id, status) {
    Cart.filter((itemCart) => {
        if (itemCart.product.id === id) {
            switch (status) {
                case "minus":
                    itemCart.quantity === 1 ? 1 : itemCart.quantity--;
                    break;
                case "plus":
                    itemCart.quantity++;
                    break;
                default:
                    break;
            }
        }
    });
    renderCart(Cart);
}

function deleteProduct(id) {
    let delProduct = Cart.filter((itemCart) => itemCart.product.id !== id);
    Cart = delProduct;
    renderCart(Cart);
}

function payCart() {
    Cart.splice(0, Cart.length);
    renderCart(Cart);
}

function luuStorage() {
    let StorageCart = JSON.stringify(Cart);
    localStorage.setItem("Cart", StorageCart);
}

function layStorage() {
    if (localStorage.getItem("Cart")) {
        let StorageCart = localStorage.getItem("Cart");
        Cart = JSON.parse(StorageCart);
        renderCart(Cart);
    }
}

getDataProductApi();
layStorage();

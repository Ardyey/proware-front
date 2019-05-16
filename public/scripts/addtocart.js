const addToCart = document.querySelector('#addToCart');
const itemQuantity = document.querySelector('#quantity');
const itemDesc = document.querySelector('#itemTitle');
const itemPrice = document.querySelector('#itemPrice');
const closeBtn = document.querySelector('#closeButton');

$(document).ready(function() {
    quantityHandler();
    $(":input").inputmask();
});

const inputValue = () => {
    if(stocks < itemQuantity.value) {
        itemQuantity.value = stocks;
    }
    else {
        if (itemQuantity.value > 10) {
            itemQuantity.value = 10;
        } else if (!itemQuantity.value) {
            itemQuantity.value = 0;
        } 
    }
}

const quantityHandler = () => {
    let quantitiy = 0;
    $('.quantity-right-plus').click(function(e) {

        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        let quantity = parseInt($('#quantity').val());

        // If is not undefined
        // Increment
        if (quantity < 10 && stocks > quantity) {
            $('#quantity').val(quantity + 1);
        } 
    });

    $('.quantity-left-minus').click(function(e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        let quantity = parseInt($('#quantity').val());

        // If is not undefined

        // Decrement
        if (quantity > 1) {
            $('#quantity').val(quantity - 1);
        }
    });
}

const addItem = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('itemCode');
    fetch(https://tranquil-forest-40707.herokuapp.com/add_citem', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            itemCode: myParam,
            itemQuantity: itemQuantity.value,
            itemDesc: itemDesc.textContent,
            itemPrice: itemPrice.textContent
        })
    })
    .then(response => response.json())
    .then(status => {
        if (status.isSuccess) {
            $("#showConfirm").modal('toggle');
        } else {
            window.alert("Error adding item!");
        }
    })
    .catch(err => console.log("ERROR1!: ", err))
}

addToCart.addEventListener('click', addItem);
itemQuantity.addEventListener('keyup', inputValue);
closeButton.addEventListener('click', () => {
    window.location.href = '/all_products';
})
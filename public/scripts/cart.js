const totalPrice = document.querySelector('#totalPrice');
const itemQuantity = [...document.querySelectorAll('.number')];
const deleteBtn = [...document.querySelectorAll('.deleteBtn')];
const button = document.querySelector('#checkoutBtn');
const modDelBtn = document.querySelector('#deleteButton');
const closeBtn = document.querySelector('#closeButton');
let quantity, priceId, delItem, stock = '';

$(document).ready(function() {
	getPrice();
})

const getPrice = () => {
	fetch('http://localhost:3002/total_price.json')
		.then(response => response.json())
		.then(price => {
			if (price) {
				totalPrice.innerHTML = price;
			}
		})
}

const changeQuantity = () => {
	fetch('http://localhost:3002/cart_cquantity', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				itemQuantity: quantity,
				itemCode: priceId
			})
		})
		.then(response => response.json())
		.then(item => {
			getPrice();
		})
	
}

const typeHandler = (e) => {
	stock = $(event.target).closest('.product').find(".stock").text();
	if(!e.target.value){
		e.target.value = 0;
	}
	else if(e.target.value > parseInt(stock)){
		e.target.value = parseInt(stock);
	}
	else {
		quantity = (e.target.value > 10) ? 10 : e.target.value;
		priceId = e.target.name;
	}
}

const buttonIndentifier = (e) => {
	delItem = e.target.name;
	$('#deleteModal').modal('toggle');
}

const deleteItem = () => {
	fetch('http://localhost:3002/delete_citem', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				itemCode: delItem
			})
		})
		.then(response => response.json())
		.then(item => {
			if (item.isSuccess) {
				$("#deleteModal").modal('hide');
				document.querySelector('#actionResult').innerHTML = "Item Successfully Deleted!";
				$("#showConfirm").modal('toggle');
			} else {
				window.alert("Error deleting item!");
			}
		})
}

Array.from(itemQuantity).forEach((element) => {
	element.addEventListener('input', typeHandler);
	element.addEventListener('input', changeQuantity);
});

Array.from(deleteBtn).forEach((element) => {
	element.addEventListener('click', buttonIndentifier);
});

deleteButton.addEventListener('click', deleteItem);

closeButton.addEventListener('click', () => {
	window.location.reload(false);
})
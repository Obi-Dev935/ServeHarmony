let addtoCart = (button) => {
  let menuItemId = button.getAttribute('data-id'); // Use getAttribute to get the item ID from the button
  let itemImg = button.getAttribute('data-img'); 
  let itemName = button.getAttribute('data-name');
  let itemPrice = button.getAttribute('data-price');

  fetch('/cart/add', {method: "POST", headers: {'Content-Type': 'application/json', },body: JSON.stringify({ menuItemId, itemImg, itemName, itemPrice, quantity: 1 }),})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Item added to cart');
    } else {
      console.log('Failed to add item to cart');
    }
  })
  .catch(error => console.error('Error:', error));
    // if (search === undefined) {
    //   basket.push({
    //     id: itemId,
    //     item: 1,
    //   });
    // } else {
    //   search.item += 1;
    // }
  
    // localStorage.setItem("data", JSON.stringify(basket));
    // update(itemId); // Update UI
};  

  
// let update = (itemId) => {
//     // You need an element with id="item_<itemId>" for each item
//     let element = document.getElementById(`item_${itemId}`);
//     if (element) {
//       let search = basket.find((x) => x.id === itemId);
//       element.innerText = search ? search.item : 0; // Update this element with the item count
//     }
//     // calculation();
// };
  
// let calculation = () => {
//     let cartIcon = document.getElementById("cartAmount");
//     if (cartIcon) {
//       cartIcon.innerText = basket.reduce((total, item) => total + item.item, 0);
//     }
//   };
  
//   calculation(); // Initial update on page load

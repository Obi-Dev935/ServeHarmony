let basket = JSON.parse(localStorage.getItem("data")) || [];

/**
 * ! Basket to hold all the selected items
 * ? the getItem part is retrieving data from the local storage
 * ? if local storage is blank, basket becomes an empty array
 */

let addtoCart = (button) => {
    let itemId = button.getAttribute('data-id'); // Use getAttribute to get the item ID from the button
    let search = basket.find((x) => x.id === itemId);
  
    if (search === undefined) {
      basket.push({
        id: itemId,
        item: 1,
      });
    } else {
      search.item += 1;
    }
  
    localStorage.setItem("data", JSON.stringify(basket));
    update(itemId); // Update UI
};
  
let update = (itemId) => {
    // You need an element with id="item_<itemId>" for each item
    let element = document.getElementById(`item_${itemId}`);
    if (element) {
      let search = basket.find((x) => x.id === itemId);
      element.innerText = search ? search.item : 0; // Update this element with the item count
    }
    // calculation();
};
  
// let calculation = () => {
//     let cartIcon = document.getElementById("cartAmount");
//     if (cartIcon) {
//       cartIcon.innerText = basket.reduce((total, item) => total + item.item, 0);
//     }
//   };
  
//   calculation(); // Initial update on page load

const addtoCart = (button) => {
  let menuItemId = button.getAttribute('data-id');
  let itemImg = button.getAttribute('data-img'); 
  let itemName = button.getAttribute('data-name');
  let itemPrice = button.getAttribute('data-price');

  fetch('/cart/add', {method: "POST", headers: {'Content-Type': 'application/json', },
  body: JSON.stringify({ menuItemId, itemImg, itemName, itemPrice, quantity: 1 }),})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showNotification('Item added to cart');
      console.log('Item added to cart');
    } else {
      console.log('Failed to add item to cart');
    }
  })
  .catch(error => 
    console.error('Error:', error));
};  

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification show';
  notification.innerText = message;

  document.body.appendChild(notification);

  // Remove the notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
// let calculation = () => {
//     let cartIcon = document.getElementById("cartAmount");
//     if (cartIcon) {
//       cartIcon.innerText = basket.reduce((total, item) => total + item.item, 0);
//     }
//   };
  
//   calculation(); // Initial update on page load

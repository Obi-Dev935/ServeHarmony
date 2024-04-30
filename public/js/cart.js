const removeFromCart = (menuItemId) => {
    fetch(`/cart/remove`, {
      method: 'POST', headers: {'Content-Type': 'application/json',},body: JSON.stringify({ menuItemId }), // Send the item ID to be removed
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Item removed from cart');
        location.reload(); // Reload the page to reflect changes
      } else {
        console.log('Failed to remove item from cart');
      }
    })
    .catch(error => console.error('Error:', error));

};

const confirmOrder = () => {
  fetch('/restaurant/order/confirm', {method: 'POST', headers: {'Content-Type': 'application/json'}})
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error confirming your order. Please try again.');
  });
};

// .then(data => {
  //   if (data.success) {
  //     // Redirect to success page or display confirmation message
  //   } else {
  //     alert('There was an error confirming your order. Please try again.');
  //   }
  // })
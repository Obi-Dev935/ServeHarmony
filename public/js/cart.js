// // Assuming shopItemsData is available and contains the full details of items.
// let shopItemsData = [
//     // ... your items data here
//   ];
  
//   let generateCartItems = () => {
//     if (basket.length !== 0) {
//       let itemsHTML = basket.map((x) => {
//         let { id, item } = x;
//         let search = shopItemsData.find(y => y.id === id) || {};
//         return `
//           <div class="cart-item">
//             <img width="100" src="${search.img}" alt="${search.name}" />
//             <div class="details">
//               <div class="title-price-x">
//                 <h4 class="title-price">
//                   <p>${search.name}</p>
//                   <p class="cart-item-price">$ ${search.price}</p>
//                 </h4>
//                 <i onclick="removeItem('${id}')" class="bi bi-x-lg"></i>
//               </div>
//               <div class="cart-buttons">
//                 <div class="buttons">
//                   <i onclick="decrement('${id}')" class="bi bi-dash-lg"></i>
//                   <div id="quantity_${id}" class="quantity">${item}</div>
//                   <i onclick="increment('${id}')" class="bi bi-plus-lg"></i>
//                 </div>
//               </div>
//               <h3>$ ${item * search.price}</h3>
//             </div>
//           </div>
//         `;
//       }).join("");
//       document.getElementById('ShoppingCart').innerHTML = itemsHTML;
//     } else {
//       document.getElementById('ShoppingCart').innerHTML = '';
//       document.getElementById('label').innerHTML = `
//         <h2>Cart is Empty</h2>
//         <a href="index.html">
//           <button class="HomeBtn">Back to Home</button>
//         </a>
//       `;
//     }
//   };
  
//   // Call this function to initially load the cart items when the page loads or when the cart is updated.
//   generateCartItems();
  
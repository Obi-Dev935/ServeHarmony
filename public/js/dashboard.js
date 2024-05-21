document.addEventListener("DOMContentLoaded", function(event) {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
      
    const closePopupButton = document.getElementById('closePopup');
    closePopupButton.addEventListener("click", (e) => {
      popup.style.display = 'none';
    });
  
    const loginForm = document.querySelector('.form');
    loginForm.addEventListener("submit", (e) => {
      // You can add any form validation here if needed
      popup.style.display = 'none';
    });
});
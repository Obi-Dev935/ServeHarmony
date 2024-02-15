document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("phoneNumberForm");
    form.addEventListener("submit", (e) => {
      let number = document.getElementById("phoneNumber").value;
      if(!number){
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Phone Number should not be left empty!");
        return;      
      } else {
        const regex = /^05\d{8}$/;
        const valid = regex.test(number);
        if(!valid){
          e.preventDefault(); // Stop form submission
          displayErrorMessageByID("number_err", "Incorrect Number format!");
          return;
        }
      }
    });
});

function displayErrorMessageByID(elementID, message){
    const element = document.getElementById(elementID);
    element.innerText = message;
}

// function submitForm() {
//     window.location.href = '/ChoicePage'; // Updated to reflect your desired redirect URL
// }
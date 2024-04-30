const validation = () => {
  document.addEventListener("DOMContentLoaded", () => { // a function that checks the phone number input
    const form = document.getElementById("phoneNumberForm");
    form.addEventListener("submit", (e) => {
      let number = document.getElementById("phoneNumber").value;
      const pattern = /^05\d{8}$/;  // Phone Number pattern that must start with 05 and have a total of 10 numbers
      const valid = pattern.test(number);
      if(!number){  // IF Statement that checks whether the phone number is empty or not
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Phone Number should not be left empty!");
        return;      
      } else if(number.length > 10 || number.length < 10){
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Phone Number should not be more than 10 characters");
        return;      
      } else if(number.length < 10){
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Phone Number should not be less than 10 characters");
        return;      
      } else if(!valid) {
        // IF Statement that checks whether the phone number matches the pattern
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Invalid Number format!");
        return;
      }
    });
  });
};

function displayErrorMessageByID(elementID, message){  // function thats return an Error Message 
    const element = document.getElementById(elementID);
    element.innerText = message;
}

validation();

module.exports = validation;
// function submitForm() {
//     window.location.href = '/ChoicePage'; // Updated to reflect your desired redirect URL
// }
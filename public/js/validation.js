const loginValidation = () => {
  document.addEventListener("DOMContentLoaded", () => { // a function that checks the phone number input
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", (e) => {
      let number = document.getElementById("phoneNumber").value;
      const pattern = /^05\d{8}$/;  // Phone Number pattern that must start with 05 and have a total of 10 numbers
      const valid = pattern.test(number);
      if(!number){  // IF Statement that checks whether the phone number is empty or not
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Phone Number should not be left empty!");
        return;      
      } else if(number.length > 10){
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Phone Number should not be more than 10 characters");
        return;      
      } else if(number.length < 10){
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Phone Number should not be less than 10 characters");
        return;      
      } else if(!valid) {
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Invalid Number format!");
        return;
      }
    });
  });
};

const registerValidation = () => {
  document.addEventListener("DOMContentLoaded", () => { // a function that checks the phone number input
    const form = document.getElementById("registerForm");
    form.addEventListener("submit", (e) => {
      let number = document.getElementById("phoneNumber").value;
      const pattern = /^05\d{8}$/;  // Phone Number pattern that must start with 05 and have a total of 10 numbers
      const valid = pattern.test(number);
      if(!number){  // IF Statement that checks whether the phone number is empty or not
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Phone Number should not be left empty!");
        return;      
      } else if(number.length > 10){
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Phone Number should not be more than 10 characters");
        return;      
      } else if(number.length < 10){
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Phone Number should not be less than 10 characters");
        return;      
      } else if(!valid) {
        e.preventDefault(); // Stop form submission
        displayErrorMessageByID("number_err", "Invalid Number format!");
        return;
      }
    });
  });
};

function displayErrorMessageByID(elementID, message){ 
    const element = document.getElementById(elementID);
    element.innerText = message;
}

loginValidation();
registerValidation();

const signinBtn = document.querySelector('.signinBtn');
const signupBtn = document.querySelector('.signupBtn');
const body = document.querySelector('body');
signupBtn.onclick = function(){body.classList.add('slide');}
signinBtn.onclick = function(){body.classList.remove('slide');}
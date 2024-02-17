document.addEventListener("DOMContentLoaded", function(event) {
    const closePopupButton = document.getElementById('closePopup');
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
    
    const formPeople = document.getElementById("peopleNumber");
    formPeople.addEventListener("submit", (e) => {
      let number = document.getElementById("numberOfPeople").value;
      if(number == 0){
        e.preventDefault();
        displayErrorMessageByID("numberofpeople_err", "Number of People should not be 0");
        return;
      }else if (number < 0 ){
        e.preventDefault();
        displayErrorMessageByID("numberofpeople_err", "Number of People should not be in negative");
        return;
      }else{
        closePopupButton.addEventListener('submit', () => {
          const popup = document.getElementById('popup');
          popup.style.display = 'none';
        });
      }
    });
    function displayErrorMessageByID(elementID, message){
      const element = document.getElementById(elementID);
      element.innerText = message;
    }
  
    // Additional functionality for submitting the number of people
    // const submitPeopleButton = document.getElementById('submitPeople');
    // const numberOfPeopleInput = document.getElementById('numberOfPeople');

    // submitPeopleButton.addEventListener('click', () => {
    //  const numberOfPeople = numberOfPeopleInput.value;
    // });
});
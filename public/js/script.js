document.addEventListener("DOMContentLoaded", function(event) {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
    
  const closePopupButton = document.getElementById('closePopup');
  closePopupButton.addEventListener("submit", (e) => {
    let numberOfPeople = document.getElementById("numberOfPeople").value;
    console.log(numberOfPeople);
    if(numberOfPeople == 0){
      e.preventDefault();
      displayErrorMessageByID("numberofpeople_err", "Number of People should not be 0");
    }else if(numberOfPeople < 0 ){
      e.preventDefault();
      displayErrorMessageByID("numberofpeople_err", "Number of People should not be in negative");
    }else{
      popup.style.display = 'none';
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
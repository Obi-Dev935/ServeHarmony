document.addEventListener("DOMContentLoaded", function(event) {
    const closePopupButton = document.getElementById('closePopup');
    const popup = document.getElementById('popup');
    popup.style.display = 'block';

    closePopupButton.addEventListener('click', () => {
      const popup = document.getElementById('popup');
      popup.style.display = 'none';
    });
    // Additional functionality for submitting the number of people
    const submitPeopleButton = document.getElementById('submitPeople');
    const numberOfPeopleInput = document.getElementById('numberOfPeople');

    submitPeopleButton.addEventListener('click', () => {
     const numberOfPeople = numberOfPeopleInput.value;
    });
});
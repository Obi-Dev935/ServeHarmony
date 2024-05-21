describe('PhoneNumber Validation', () => {
  // Setup the DOM environment for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="phoneNumberForm">
        <input id="phoneNumber" type="text"/>
        <button type="submit">Submit</button>
      </form>
    `;
    validation(); // Initialize the validation function
  });

  // Test valid phone number
  it('should allow submission for a valid phone number', () => {
    document.getElementById('phoneNumber').value = '0512345678';
    document.getElementById('phoneNumberForm').dispatchEvent(new Event('submit', { cancelable: true }));

    expect(displayErrorMessageByID).not.toHaveBeenCalled();
  });

  // Test empty phone number
  it('should prevent submission and show error for an empty phone number', () => {
    document.getElementById('phoneNumber').value = '';
    document.getElementById('phoneNumberForm').dispatchEvent(new Event('submit', { cancelable: true }));

    expect(displayErrorMessageByID).toHaveBeenCalledWith("number_err", "Phone Number should not be left empty!");
  });

  // Test phone number length > 10
  it('should prevent submission and show error for a phone number longer than 10 characters', () => {
    document.getElementById('phoneNumber').value = '051234567890';
    document.getElementById('phoneNumberForm').dispatchEvent(new Event('submit', { cancelable: true }));

    expect(displayErrorMessageByID).toHaveBeenCalledWith("number_err", "Phone Number should not be more than 10 characters");
  });

  // Test invalid phone number format
  it('should prevent submission and show error for an invalid phone number formats', () => {
    document.getElementById('phoneNumber').value = '1234567890';
    document.getElementById('phoneNumberForm').dispatchEvent(new Event('submit', { cancelable: true }));

    expect(displayErrorMessageByID).toHaveBeenCalledWith("number_err", "Invalid Number format!");
  });
});

  
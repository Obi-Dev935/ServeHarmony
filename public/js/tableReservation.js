document.addEventListener('DOMContentLoaded', () => {
    // Set the minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    document.getElementById('date').setAttribute('min', minDate);

    const reservationForm = document.getElementById('reservationForm'); // Ensure the form has this ID

    reservationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const people = document.getElementById('people').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const specialRequests = document.getElementById('specialRequests').value;
        const storeId = document.getElementsByName('storeId')[0].value;
        const storeType = document.getElementsByName('storeType')[0].value;

        try {
            const response = await fetch('/submitReservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    people,
                    date,
                    time,
                    specialRequests,
                    storeId,
                    storeType
                }),
            });

            if (response.ok) {
                const reservationDetails = response;
                console.log('Reservation submitted successfully:', reservationDetails);
                if (storeType === 'restaurant') {
                    window.location.href = `/restaurant/menu/${storeId}`;
                } else if (storeType === 'cafe') {
                    window.location.href = `/cafe/menu/${storeId}`;
                } else {
                    console.error('Invalid store type.');
                }
            } else {
                console.error('Failed to submit reservation:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting reservation:', error.message);
        }
    });
});

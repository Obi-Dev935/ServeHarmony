document.addEventListener('DOMContentLoaded', () => {
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
                const reservationDetails = await response;
                console.log('Reservation submitted successfully:', reservationDetails);
                if (storeType === 'restaurant') {
                    window.location.href = `/restaurant/menu/${storeId}`;
                } else if (storeType === 'cafe') {
                    window.location.href = `/cafe/menu/${storeId}`;
                } else {
                    console.error('Invalid store type.');
                }
            }
        } catch (error) {
            console.error('Error submitting reservation:', error.message);
            console.error('Failed to submit reservation:', response.statusText);
        }
    });
});

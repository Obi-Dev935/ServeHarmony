document.addEventListener('DOMContentLoaded', () => {
    const reservationForm = document.getElementById('reservationForm'); // Ensure the form has this ID

    reservationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const people = document.getElementById('people').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const requests = document.getElementById('requests').value;
        const restaurantId = document.getElementsByName('restaurantId')[0].value;

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
                    requests,
                    restaurantId
                }),
            });

            if (response.ok) {
                const reservationDetails = await response;
                console.log('Reservation submitted successfully:', reservationDetails);
                window.location.href = `/restaurant/menu/${restaurantId}`;
            }
        } catch (error) {
            console.error('Error submitting reservation:', error.message);
            console.error('Failed to submit reservation:', response.statusText);
        }
    });
});

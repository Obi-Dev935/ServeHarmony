// Animation script
document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".cardd");
    cards.forEach(card => {
        const anim = gsap.fromTo(card, 
            { autoAlpha: 0, y: 100, x: -100, rotate: -10 },
            { duration: 0.6, autoAlpha: 1, y: 0, x: 0, rotate: 0 }
        );
        ScrollTrigger.create({
            trigger: card,
            animation: anim,
        });
    });
});
// Live search script
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('input[name="search"]');
    const mainContainer = document.querySelector('.grid');

    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.trim();

        fetch(`/restaurantPage?search=${encodeURIComponent(searchValue)}`, {
            headers: { 'Accept': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            mainContainer.innerHTML = ''; // Clear current content
            if (data.length > 0) {
                data.forEach(restaurant => {
                    mainContainer.innerHTML += `
                        <div class="cardd">
                            <a href="/restaurant/menu/${restaurant._id}">
                                <img src="/images/${restaurant.image}" alt="${restaurant.name}">
                            </a>
                            <h2>${restaurant.name}</h2>
                            <p><strong>Open Hours: </strong>${restaurant.openHours}</p>
                            <p><strong>Location:</strong>${restaurant.address}</p>
                            <button><a href="/TableReservation/${restaurant._id}">Dine in</a></button>
                            <button><a href="/restaurant/menu/${restaurant._id}">Take Away</a></button>
                        </div>
                    `;
                });
            } else {
                mainContainer.innerHTML = '<p>No restaurants found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            mainContainer.innerHTML = '<p>Error loading restaurants.</p>';
        });
    });
});
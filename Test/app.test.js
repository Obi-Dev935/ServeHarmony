const request = require('supertest');
const express = require('express');
const { app, server } = require('../app'); // Adjust the path as necessary

afterAll(() => {
    server.close(); // Close the server after all tests
});

describe('Test the root path', () => {
  test('It should respond with the ChoicePage', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('ChoicePage');
  });
});

describe('Test the /login path', () => {
  test('It should respond with the login page', async () => {
    const response = await request(app).get('/login');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Login');
  });

  test('It should handle login POST request', async () => {
    const response = await request(app)
      .post('/login')
      .send({ phoneNumber: 'testuser', password: 'testpassword' });
    expect(response.statusCode).toBe(302); // Assuming a redirect on success
  });
});

describe('Test the /register path', () => {
  test('It should handle register POST request', async () => {
    const response = await request(app)
      .post('/register')
      .send({ phoneNumber: 'testuser', password: 'testpassword' });
    expect(response.statusCode).toBe(302); // Assuming a redirect on success
  });
});

describe('Test the /submitReservation path', () => {
  test('It should save a new reservation', async () => {
    const reservationData = {
      storeId: '123',
      storeType: 'restaurant',
      name: 'John Doe',
      people: 4,
      date: '2023-10-10',
      time: '19:00',
      specialRequests: 'Window seat'
    };

    const response = await request(app)
      .post('/submitReservation')
      .send(reservationData);
    expect(response.statusCode).toBe(302); // Assuming a redirect on success
  });
});

describe('Test the /restaurantPage path', () => {
    test('It should respond with a list of restaurants', async () => {
      const response = await request(app).get('/restaurantPage');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  
    test('It should handle search query', async () => {
      const response = await request(app).get('/restaurantPage?search=test');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
});

describe('Test the /cafePage path', () => {
    test('It should respond with a list of cafes', async () => {
      const response = await request(app).get('/cafePage');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  
    test('It should handle search query', async () => {
      const response = await request(app).get('/cafePage?search=test');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
});

describe('Test the /cart/add path', () => {
    test('It should add an item to the cart', async () => {
      const itemData = {
        menuItemId: '123',
        itemName: 'Test Item',
        itemPrice: 10,
        itemImg: 'test.jpg',
        quantity: 1
    };
    const response = await request(app)
    .post('/cart/add')
    .send(itemData);
  expect(response.statusCode).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.cart).toContainEqual(expect.objectContaining(itemData));
    });

test('It should increment quantity if item already exists in cart', async () => {
    const itemData = {
      menuItemId: '123',
      itemName: 'Test Item',
      itemPrice: 10,
      itemImg: 'test.jpg',
      quantity: 1
    };

    // Add item first time
    await request(app).post('/cart/add').send(itemData);

    // Add item second time
    const response = await request(app).post('/cart/add').send(itemData);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    const cartItem = response.body.cart.find(item => item.menuItemId === '123');
    expect(cartItem.quantity).toBe(2);
  });
});

describe('Test the /cart/remove path', () => {
    test('It should remove an item from the cart', async () => {
      const itemData = {
        menuItemId: '123',
        itemName: 'Test Item',
        itemPrice: 10,
        itemImg: 'test.jpg',
        quantity: 1
      };
  
      // Add item first
      await request(app).post('/cart/add').send(itemData);
  
      // Remove item
      const response = await request(app).post('/cart/remove').send({ menuItemId: '123' });
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.cart).not.toContainEqual(expect.objectContaining({ menuItemId: '123' }));
      });
    });
    describe('Test the /restaurant/order/confirm path', () => {
    test('It should confirm an order', async () => {
    const itemData = {
    menuItemId: '123',
    itemName: 'Test Item',
    itemPrice: 10,
    itemImg: 'test.jpg',
    quantity: 1
};
// Add item to cart
await request(app).post('/cart/add').send(itemData);
// Confirm order
const response = await request(app).post('/restaurant/order/confirm');
expect(response.statusCode).toBe(200);
expect(response.body.success).toBe(true);
expect(response.body.orderId).toBeDefined();
    });
    test('It should return 400 if cart is empty', async () => {
    const response = await request(app).post('/restaurant/order/confirm');
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Cart is empty');
    });
    });
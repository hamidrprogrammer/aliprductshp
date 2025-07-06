export const subTotal = (id, price) => {
  let subTotalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  carts.forEach((item) => {
    if (item.id === id) {
      subTotalCost = item.quantitiy * price;
    }
  });
  return subTotalCost;
};

export const quantity = (id) => {
  let product = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  carts.forEach((item) => {
    if (item.id === id) {
      product = item.quantitiy;
    }
  });
  return product;
};

export const totalCost = () => {
  let totalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  carts.forEach((item) => {
    totalCost += item.quantitiy * item.price;
  });
  return totalCost;
};

export const removeFromCart = (productId) => {
  let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  if (cart.length !== 0) {
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  return cart; // Return updated cart for immediate state update if needed
};
const cartList = []
export default cartList
export const updateQuantityInCart = (productId, newQuantity) => {
  let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  if (cart.length !== 0) {
    cart = cart.map((item) => {
      if (item.id === productId) {
        return { ...item, quantitiy: newQuantity };
      }
      return item;
    });
    // Prevent quantity from going below 1 or above stock (though stock check should be ideally done before calling this)
    // For now, just ensure quantity is at least 1
    cart = cart.map(item => item.id === productId && item.quantitiy < 1 ? {...item, quantitiy: 1} : item);

    localStorage.setItem("cart", JSON.stringify(cart));
  }
  return cart; // Return updated cart
};

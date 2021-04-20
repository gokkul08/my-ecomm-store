import { useState, createContext, useContext, useEffect } from 'react';
import products from "../products";
import {initiateCheckout} from "../lib/payments";

const defaultCart = {
    products: {}
};

export const CartContext = createContext();

export function useCartState() {

    const [cart, updateCart] = useState(defaultCart);

    useEffect(() => {
        const stateFromStorage = window.localStorage.getItem('spacejelly_cart');
        const data = stateFromStorage && JSON.parse(stateFromStorage);
        if (data) {
            updateCart(data);
        }
    }, []);

    useEffect(() => {
        const data = JSON.stringify(cart);
        window.localStorage.setItem('spacejelly_cart', data);
    }, [cart]);

    const cartItems = Object.keys(cart.products).map(key => {
        const product = products.find(({id}) => `${id}` === `${key}`);
        return {
            ...cart.products[key],
            pricePerItem: product.price
        }
    });

    const subTotal = cartItems.reduce((accumulator, {pricePerItem, quantity}) => {
        return accumulator + (pricePerItem * quantity);
    }, 0);

    const totalItems = cartItems.reduce((accumulator, {quantity}) => {
        return accumulator + quantity;
    }, 0);

    function addToCart({id} = {}) {
        updateCart(prev => {
            let cartState = {...prev};

            if (cartState.products[id]) {
                cartState.products[id].quantity = cartState.products[id].quantity + 1;
            } else {
                cartState.products[id] = {
                    id,
                    quantity: 1
                }
            }

            return cartState;
        })
    }

    function updateItem({ id, quantity }) {
        updateCart(prev => {
            let cartState = {...prev};

            if (cartState.products[id]) {
                cartState.products[id].quantity = quantity;
            }

            return cartState;
        })
    }

    function checkOut() {
        initiateCheckout({
            lineItems: cartItems.map(item => {
                return {
                    price: item.id,
                    quantity: item.quantity
                }
            })
        });
    }

    return {
        cart,
        cartItems,
        subTotal,
        totalItems,
        addToCart,
        updateItem,
        checkOut
    }
}

export function useCart() {
    const cart = useContext(CartContext);
    return cart;
}

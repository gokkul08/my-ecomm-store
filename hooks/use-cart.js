import { useState } from 'react';
import products from "../products";
import {initiateCheckout} from "../lib/payments";

const defaultCart = {
    products: {}
};

export default function useCart() {

    const [cart, updateCart] = useState(defaultCart);

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

    console.log(subTotal);

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
        subTotal,
        totalItems,
        addToCart,
        checkOut
    }
};

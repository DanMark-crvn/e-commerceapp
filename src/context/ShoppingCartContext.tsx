import { ReactNode, createContext, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: number
    quantity: number
}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItem[]

}

const ShoppingCartContext = createContext({} as ShoppingCartContext) 

export function useShoppingCart() {
  return (
    useContext(ShoppingCartContext)
  )
}


export function ShoppingCartProvider({children} : ShoppingCartProviderProps){
    const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[])

    
    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    function getItemQuantity(id: number){
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseCartQuantity(id: number){
        setCartItems(currentItems => {
            if (currentItems.find(item => item.id === id) == null){
                return [...currentItems, {id, quantity: 1}]
            } else{
                return currentItems.map(items => {
                    if(items.id === id){
                        return {...items, quantity: items.quantity + 1}
                    } else{
                        return items
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id: number){
        setCartItems(currentItems => {
            if (currentItems.find(item => item.id === id) ?.quantity === 1){
                return currentItems.filter(item => item.id !== id)
            } else{
                return currentItems.map(items => {
                    if(items.id === id){
                        return {...items, quantity: items.quantity - 1}
                    } else{
                        return items
                    }
                })
            }
        })
    }

    function removeFromCart(id: number){
        setCartItems(currentItems =>{
            return currentItems.filter(item => item.id !== id)
        })
    }

    return (
        <ShoppingCartContext.Provider value={{getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, openCart, closeCart, cartItems, cartQuantity}}>
            {children}
            <ShoppingCart isOpen={isOpen} />
        </ShoppingCartContext.Provider>
    )
}

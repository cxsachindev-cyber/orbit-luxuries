// context/store-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  getDoc,
  writeBatch
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { dummyProducts } from "@/lib/data/dummy-images";

// Define types - MAKE SURE TO EXPORT THESE
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  sizes: string[];
  specs: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selected: boolean;
  chosenSize?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface Order extends OrderData {
  id: string;
  orderDate: any;
  status: string;
  userId: string;
  userEmail: string;
  createdAt?: string | Date;
}

// Product type for adding/updating (without id)
export interface ProductInput {
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  sizes: string[];
  specs: string[];
}

interface StoreContextValue {
  // Auth
  user: User | null;
  authLoading: boolean;
  loginUser: (email: string, password?: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  
  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  addNewProduct: (product: ProductInput) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProduct: (productId: string, product: Partial<ProductInput>) => Promise<void>;
  
  // Cart
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCartItemSelection: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getSelectedItems: () => CartItem[];
  
  // Orders
  orders: Order[];
  createOrder: (orderData: OrderData) => Promise<void>;
  fetchOrders: (userId?: string) => Promise<Order[]>;
  loadingOrders: boolean;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<void>;
  
  // Wishlist
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const router = useRouter();

  // ============================================================
  // 🎯 FETCH ORDERS FUNCTION - DEFINED FIRST
  // ============================================================
  const fetchOrders = async (userId?: string): Promise<Order[]> => {
    const targetUserId = userId || user?.uid;
    if (!targetUserId) {
      console.log("No user, skipping orders fetch");
      return [];
    }
    
    setLoadingOrders(true);
    try {
      console.log("Fetching orders for user:", targetUserId);
      const ordersRef = collection(db, "users", targetUserId, "orders");
      const q = query(ordersRef, orderBy("orderDate", "desc"));
      const querySnapshot = await getDocs(q);
      
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedOrders.push({
          id: doc.id,
          ...data,
        } as Order);
      });
      
      setOrders(fetchedOrders);
      console.log(`✅ Fetched ${fetchedOrders.length} orders successfully`);
      return fetchedOrders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    } finally {
      setLoadingOrders(false);
    }
  };

  // ============================================================
  // 🎯 LOAD CART FROM FIRESTORE - users/{uid}/cart/{productId}
  // ============================================================
  const loadCartFromFirestore = async (userId: string): Promise<CartItem[]> => {
    try {
      const cartRef = collection(db, "users", userId, "cart");
      const querySnapshot = await getDocs(cartRef);
      
      const items: CartItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as CartItem);
      });
      
      console.log(`✅ Loaded ${items.length} cart items from Firestore for user:`, userId);
      return items;
    } catch (error) {
      console.error("Error loading cart from Firestore:", error);
      return [];
    }
  };

  // ============================================================
  // 🎯 SAVE CART TO FIRESTORE - users/{uid}/cart/{productId}
  // ============================================================
  const saveCartToFirestore = async (userId: string, cartItems: CartItem[]) => {
    try {
      const batch = writeBatch(db);
      const cartRef = collection(db, "users", userId, "cart");
      
      // Get existing cart items to delete
      const existingDocs = await getDocs(cartRef);
      
      // Delete all existing cart items
      existingDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Add all new cart items
      cartItems.forEach((item) => {
        const docRef = doc(db, "users", userId, "cart", item.id);
        batch.set(docRef, {
          ...item,
          addedAt: serverTimestamp(),
        });
      });
      
      await batch.commit();
      console.log(`💾 Saved ${cartItems.length} cart items to Firestore for user:`, userId);
    } catch (error) {
      console.error("Error saving cart to Firestore:", error);
    }
  };

  // ============================================================
  // 🎯 SAVE WISHLIST TO FIRESTORE - users/{uid}/wishlist/{productId}
  // ============================================================
  const saveWishlistToFirestore = async (userId: string, wishlistItems: string[]) => {
    try {
      const batch = writeBatch(db);
      const wishlistRef = collection(db, "users", userId, "wishlist");
      
      // Get existing wishlist items to delete
      const existingDocs = await getDocs(wishlistRef);
      
      // Delete all existing wishlist items
      existingDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Add all new wishlist items
      wishlistItems.forEach((productId) => {
        const docRef = doc(db, "users", userId, "wishlist", productId);
        batch.set(docRef, {
          productId,
          addedAt: serverTimestamp(),
        });
      });
      
      await batch.commit();
      console.log(`💾 Saved ${wishlistItems.length} wishlist items to Firestore for user:`, userId);
    } catch (error) {
      console.error("Error saving wishlist to Firestore:", error);
    }
  };

  // ============================================================
  // 🎯 LOAD WISHLIST FROM FIRESTORE - SIMPLIFIED (just loads, no cleaning)
  // ============================================================
  const loadWishlistFromFirestore = async (userId: string): Promise<string[]> => {
    try {
      const wishlistRef = collection(db, "users", userId, "wishlist");
      const querySnapshot = await getDocs(wishlistRef);
      
      const items: string[] = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.id);
      });
      
      console.log(`📋 Raw wishlist items from Firestore: ${items.length} items`);
      return items;
    } catch (error) {
      console.error("Error loading wishlist from Firestore:", error);
      return [];
    }
  };

  // ============================================================
  // 🎯 FETCH PRODUCTS FROM FIRESTORE - ALWAYS FETCH (no user check)
  // ============================================================
  const fetchProducts = async () => {
    try {
      console.log("📦 Fetching products from Firestore...");
      const productsRef = collection(db, "products");
      const querySnapshot = await getDocs(productsRef);
      
      const fetchedProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedProducts.push({
          id: doc.id,
          ...data,
        } as Product);
      });
      
      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        setProductsLoaded(true);
        console.log(`✅ Loaded ${fetchedProducts.length} products from Firestore`);
        return fetchedProducts;
      } else {
        // ✅ Use dummy data if no products in Firestore
        console.log("⚠️ No products in Firestore, using dummy products");
        setProducts(dummyProducts);
        setProductsLoaded(true);
        console.log(`✅ Loaded ${dummyProducts.length} dummy products`);
        return dummyProducts;
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(dummyProducts);
      setProductsLoaded(true);
      console.log(`✅ Loaded ${dummyProducts.length} dummy products as fallback`);
      return dummyProducts;
    }
  };

  // ============================================================
  // ✅ FETCH PRODUCTS ON MOUNT - ALWAYS FETCH FROM FIRESTORE
  // ============================================================
  useEffect(() => {
    if (!productsLoaded) {
      fetchProducts();
    }
  }, []);

  // ============================================================
  // 🧹 CLEAN WISHLIST AFTER PRODUCTS ARE LOADED
  // ============================================================
  useEffect(() => {
    const cleanWishlistAfterProductsLoad = async () => {
      // Only run if products are loaded, user exists, and wishlist has items
      if (productsLoaded && products.length > 0 && user && wishlist.length > 0) {
        console.log(`🔄 Validating wishlist with ${products.length} products and ${wishlist.length} wishlist items...`);
        
        const validItems = wishlist.filter(id => products.some(p => p.id === id));
        const invalidItems = wishlist.filter(id => !products.some(p => p.id === id));
        
        if (invalidItems.length > 0) {
          console.log(`🧹 Found ${invalidItems.length} invalid wishlist items, cleaning up...`);
          console.log(`   Invalid IDs:`, invalidItems);
          console.log(`   Valid IDs:`, validItems);
          
          // Update Firestore
          await saveWishlistToFirestore(user.uid, validItems);
          
          // Update state
          setWishlist(validItems);
          localStorage.setItem('wishlist', JSON.stringify(validItems));
          
          console.log(`✅ Cleaned wishlist: ${validItems.length} valid items remain`);
        } else {
          console.log(`✅ All ${wishlist.length} wishlist items are valid`);
        }
      }
    };
    
    cleanWishlistAfterProductsLoad();
  }, [productsLoaded, products, user, wishlist]);

  // ============================================================
  // ✅ AUTH STATE LISTENER - LOADS USER DATA PER USER
  // ============================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔄 Auth state changed:", user?.uid || "No user");
      
      // ✅ Clear current local state BEFORE loading new user
      setCart([]);
      setWishlist([]);
      setOrders([]);
      
      setUser(user);
      setAuthLoading(false);
      
      // ✅ Products should already be loaded from the mount useEffect
      // But if not, fetch them
      if (!productsLoaded) {
        await fetchProducts();
      }
      
      if (user) {
        // ✅ Load user data (cart, wishlist, orders)
        const [cartItems, wishlistItems, ordersData] = await Promise.all([
          loadCartFromFirestore(user.uid),
          loadWishlistFromFirestore(user.uid),
          fetchOrders(user.uid),
        ]);
        
        // ✅ Set state with the user's data
        setCart(cartItems);
        setWishlist(wishlistItems);
        setOrders(ordersData);
        
        // Save to localStorage for quick access
        localStorage.setItem('cart', JSON.stringify(cartItems));
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        
        console.log(`✅ User ${user.uid} data loaded: ${cartItems.length} cart items, ${wishlistItems.length} wishlist items`);
      } else {
        // ✅ No user - clear localStorage but NOT Firestore
        localStorage.removeItem('cart');
        localStorage.removeItem('wishlist');
      }
      
      setIsInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Save to Firestore when cart changes (only if user exists)
  useEffect(() => {
    if (isInitialized && user) {
      localStorage.setItem('cart', JSON.stringify(cart));
      saveCartToFirestore(user.uid, cart);
    }
  }, [cart, isInitialized, user]);

  // ✅ Save to Firestore when wishlist changes (only if user exists)
  useEffect(() => {
    if (isInitialized && user) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      saveWishlistToFirestore(user.uid, wishlist);
    }
  }, [wishlist, isInitialized, user]);

  // 🎯 ADD NEW PRODUCT
  const addNewProduct = async (product: ProductInput) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to add products");
      }

      const productsRef = collection(db, "products");
      const docRef = await addDoc(productsRef, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
      });

      const newProduct: Product = {
        ...product,
        id: docRef.id,
      };
      setProducts(prev => [newProduct, ...prev]);

      console.log("Product added successfully with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  // 🎯 DELETE PRODUCT
  const deleteProduct = async (productId: string) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to delete products");
      }

      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);

      setProducts(prev => prev.filter(p => p.id !== productId));

      console.log("Product deleted successfully:", productId);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  // 🎯 UPDATE PRODUCT
  const updateProduct = async (productId: string, product: Partial<ProductInput>) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to update products");
      }

      const productRef = doc(db, "products", productId);
      
      await updateDoc(productRef, {
        ...product,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });

      setProducts(prev => 
        prev.map(p => 
          p.id === productId 
            ? { ...p, ...product } 
            : p
        )
      );

      console.log("Product updated successfully:", productId);
    } catch (error: any) {
      console.error("Error updating product:", error);
      
      if (error.message && error.message.includes("No document to update")) {
        throw new Error(`Product with ID "${productId}" no longer exists. It may have been deleted.`);
      }
      throw error;
    }
  };

  // 🎯 UPDATE ORDER STATUS - FIXED ✅
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to update order status");
      }

      const updateData = { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      // 1. ✅ Update Root collection (for Admin Panel)
      try {
        const rootOrderRef = doc(db, "orders", orderId);
        await setDoc(rootOrderRef, updateData, { merge: true });
        console.log(`✅ Updated root orders/${orderId} to ${newStatus}`);
      } catch (error) {
        console.warn("⚠️ Could not update root orders, continuing...", error);
      }

      // 2. ✅ Update User subcollection (for Customer Profile)
      try {
        const userOrderRef = doc(db, "users", user.uid, "orders", orderId);
        await setDoc(userOrderRef, updateData, { merge: true });
        console.log(`✅ Updated users/${user.uid}/orders/${orderId} to ${newStatus}`);
      } catch (error) {
        console.warn("⚠️ Could not update user orders, continuing...", error);
      }

      // 3. ✅ Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        )
      );

      console.log(`✅ Order ${orderId} status updated to: ${newStatus}`);
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  // ============================================================
  // 🛒 CART FUNCTIONS
  // ============================================================
  const addToCart = (product: Product, size?: string) => {
    if (!user) {
      console.log("Please login to add items to cart");
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && item.chosenSize === size
      );
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.chosenSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { 
          ...product, 
          quantity: 1, 
          selected: true,
          chosenSize: size || '' 
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleCartItemSelection = (productId: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getSelectedItems = () => {
    return cart.filter(item => item.selected);
  };

  // 🎯 CREATE ORDER - FIXED ✅
  const createOrder = async (orderData: OrderData) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to create an order");
      }

      const orderPayload = {
        ...orderData,
        orderDate: new Date().toISOString(),
        status: "Pending",
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
      };

      // 1. ✅ Save to Root collection (for Admin Panel)
      const rootOrdersRef = collection(db, "orders");
      const rootDocRef = await addDoc(rootOrdersRef, orderPayload);
      console.log(`✅ Order saved to root orders with ID: ${rootDocRef.id}`);

      // 2. ✅ Save to User subcollection (for Customer Profile)
      const userOrdersRef = collection(db, "users", user.uid, "orders");
      const userDocRef = await addDoc(userOrdersRef, orderPayload);
      console.log(`✅ Order saved to user orders with ID: ${userDocRef.id}`);

      // 3. ✅ Clear selected items from cart
      const remainingItems = cart.filter(item => !item.selected);
      setCart(remainingItems);
      
      // Save updated cart to Firestore
      if (user) {
        await saveCartToFirestore(user.uid, remainingItems);
      }

      // 4. ✅ Refresh orders
      await fetchOrders(user.uid);

      alert("🎉 Order placed successfully!");
    } catch (error) {
      console.error("❌ Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  // ============================================================
  // ❤️ WISHLIST FUNCTIONS
  // ============================================================
  const toggleWishlist = (productId: string) => {
    if (!user) {
      console.log("Please login to add items to wishlist");
      return;
    }
    
    setWishlist(prev => {
      const isInWishlist = prev.includes(productId);
      const newWishlist = isInWishlist
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      return newWishlist;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // ============================================================
  // 🔐 AUTH FUNCTIONS
  // ============================================================
  const loginUser = async (email: string, password?: string) => {
    try {
      if (password) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard');
      } else {
        console.log("User logged in via admin:", email);
        router.push('/');
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // ✅ LOGOUT - ONLY clear frontend state, NEVER delete Firestore data
  const logoutUser = async () => {
    try {
      // ✅ Only clear local state - DO NOT delete Firestore documents
      setWishlist([]);
      setCart([]);
      setOrders([]);
      setProductsLoaded(false);
      localStorage.removeItem('wishlist');
      localStorage.removeItem('cart');
      
      await signOut(auth);
      router.push('/');
      console.log("👋 User logged out, data preserved in Firestore");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <StoreContext.Provider
      value={{ 
        user,
        authLoading,
        loginUser,
        logoutUser,
        products,
        setProducts,
        addNewProduct,
        deleteProduct,
        updateProduct,
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCartItemSelection,
        clearCart,
        getCartTotal,
        getSelectedItems,
        orders,
        createOrder,
        fetchOrders,
        loadingOrders,
        updateOrderStatus,
        wishlist,
        wishlistCount,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
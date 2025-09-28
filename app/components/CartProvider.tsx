"use client";
import React, {createContext, useContext, useMemo, useState} from "react";

export type Item = {
  id: string;
  name: string;
  size: "S"|"M"|"L";
  fruits: string[];      // max 2 se non stagionale
  seasonal: boolean;
  price: number;         // prezzo unitario (già con moltiplicatore taglia)
  qty: number;
};

type CartCtx = {
  items: Item[];
  add: (i: Omit<Item,"id"|"qty"> & { qty?: number }) => void;
  remove: (id: string) => void;
  clear: () => void;
  subtotal: number;
  delivery: number;
  total: number;
};

export const DELIVERY_FEE = 4.90;

const Ctx = createContext<CartCtx | null>(null);

function makeId(i: Omit<Item,"id"|"qty">){
  const fruitsKey = i.seasonal ? "stagionale" : i.fruits.slice(0,2).sort().join("-");
  return `${i.name}-${i.size}-${fruitsKey}`.toLowerCase();
}

export function CartProvider({children}:{children: React.ReactNode}) {
  const [items, setItems] = useState<Item[]>([]);

  const add: CartCtx["add"] = (i) => {
    const id = makeId(i);
    const qty = i.qty ?? 1;
    setItems(prev => {
      const existing = prev.find(x => x.id === id);
      if (existing) return prev.map(x => x.id === id ? {...x, qty: x.qty + qty} : x);
      return [...prev, { id, qty, ...i }];
    });
  };

  const remove: CartCtx["remove"] = (id) => setItems(prev => prev.filter(x => x.id !== id));
  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s,x) => s + x.price * x.qty, 0), [items]);
  const delivery = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  const value: CartCtx = {items, add, remove, clear, subtotal, delivery, total};

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(){
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}
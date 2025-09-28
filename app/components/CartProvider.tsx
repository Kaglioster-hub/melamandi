'use client';
import React, {createContext, useContext, useMemo, useState} from 'react';

export type Size = 'S'|'M'|'L';
export type Fruit = 'Mele'|'Pere'|'Banane'|'Arance'|'Stagionale';

export type Item = {
  id: string;
  name: 'Base'|'Esotico'|'Deluxe';
  size: Size;
  fruits: Fruit[]; // max 2 or ['Stagionale']
  unit: number;    // prezzo unitario scontato (senza consegna)
  qty: number;
};

type CartCtx = {
  items: Item[];
  add: (i: Omit<Item,'id'>) => void;
  remove: (id: string) => void;
  clear: () => void;
  subtotal: number;
  delivery: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);
export const DELIVERY = 4.90;

export function CartProvider({children}:{children: React.ReactNode}) {
  const [items,setItems] = useState<Item[]>([]);
  const add: CartCtx['add'] = (i) => {
    const id = ${i.name}--;
    setItems(prev => {
      const existing = prev.find(x => x.id === id);
      if (existing) {
        return prev.map(x => x.id===id ? {...x, qty: x.qty + i.qty} : x);
      }
      return [...prev, {...i, id}];
    });
  };
  const remove = (id:string) => setItems(prev=>prev.filter(x=>x.id!==id));
  const clear = () => setItems([]);

  const subtotal = useMemo(()=> items.reduce((s,i)=> s + i.unit*i.qty, 0), [items]);
  const delivery = items.length ? DELIVERY : 0;
  const total = subtotal + delivery;

  const value = {items, add, remove, clear, subtotal, delivery, total};
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(){
  const v = useContext(Ctx);
  if(!v) throw new Error('useCart fuori da CartProvider');
  return v;
}

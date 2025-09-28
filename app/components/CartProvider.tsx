"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Size = "S" | "M" | "L";
export type Item = { id:string; name:string; size:Size; fruits:string[]; seasonal:boolean; price:number; qty:number; };
type AddInput = { name:string; size:Size; fruits:string[]; seasonal:boolean; price:number; };
type CartCtx = {
  items: Item[]; add:(i:AddInput)=>void; remove:(id:string)=>void; setQty:(id:string,qty:number)=>void; clear:()=>void;
  subtotal:number; delivery:number; total:number;
};

const DELIVERY = 4.9;
const STORAGE_KEY = "mm-cart-v1";
const Ctx = createContext<CartCtx|null>(null);

export function CartProvider({ children }:{ children:React.ReactNode }){
  const [items,setItems] = useState<Item[]>([]);
  useEffect(()=>{ try{ const raw = localStorage.getItem(STORAGE_KEY); if(raw) setItems(JSON.parse(raw)); }catch{} },[]);
  useEffect(()=>{ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }catch{} },[items]);

  const add:CartCtx["add"] = (i) => {
    const id = [i.name, i.size, i.seasonal ? "stagionale" : i.fruits.slice().sort().join("+")].join("-");
    setItems(prev => {
      const ex = prev.find(x => x.id === id);
      if (ex) return prev.map(x => x.id === id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { id, qty:1, ...i }];
    });
  };

  const remove  = (id:string) => setItems(prev => prev.filter(x => x.id !== id));
  const setQty  = (id:string, qty:number) => setItems(prev => prev.map(x => x.id === id ? { ...x, qty:Math.max(1,qty) } : x));
  const clear   = () => setItems([]);

  const subtotal = useMemo(()=> items.reduce((s,i)=> s + i.price * i.qty, 0), [items]);
  const delivery = items.length ? DELIVERY : 0;
  const total = +(subtotal + delivery).toFixed(2);

  const value:CartCtx = { items, add, remove, setQty, clear, subtotal:+subtotal.toFixed(2), delivery, total };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useCart(){ const v = useContext(Ctx); if(!v) throw new Error("useCart must be used inside CartProvider"); return v; }
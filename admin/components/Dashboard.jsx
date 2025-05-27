
import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Ordini Ricevuti</h1>
      <table className="w-full border text-sm">
        <thead><tr><th>Data</th><th>Cliente</th><th>Cesto</th><th>Totale</th><th>Tracking</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{new Date(o.created_at).toLocaleString()}</td>
              <td>{o.customer_name}</td>
              <td>{o.basket_type}</td>
              <td>{o.total}€</td>
              <td>{o.tracking_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

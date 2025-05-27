
import { supabase } from './client'

export async function saveOrder(data) {
  const { error } = await supabase.from('orders').insert([data])
  return error
}

import { supabase } from './supabase';

export async function listCustomers(companyId){
  const {data,error}=await supabase.from('customers').select('*').eq('company_id',companyId).order('created_at',{ascending:false});
  if(error) throw error; return data;
}
export async function createCustomer(input){
  const {data,error}=await supabase.from('customers').insert(input).select().single();
  if(error) throw error; return data;
}
export async function createKitchen(input){
  const {data,error}=await supabase.from('kitchens').insert(input).select().single();
  if(error) throw error; return data;
}
export async function createBox(input){
  const {data,error}=await supabase.from('boxes').insert(input).select().single();
  if(error) throw error; return data;
}
export async function deleteBox(boxId){
  const {error}=await supabase.from('boxes').delete().eq('id',boxId);
  if(error) throw error;
}
export async function renumberBoxes(kitchenId){
  const {data,error}=await supabase.from('boxes').select('id,created_at').eq('kitchen_id',kitchenId).order('created_at',{ascending:true});
  if(error) throw error;
  for(let i=0;i<data.length;i++){
    const {error:updateError}=await supabase.from('boxes').update({box_number:i+1,name:`Boîte ${String(i+1).padStart(3,'0')}`}).eq('id',data[i].id);
    if(updateError) throw updateError;
  }
  return data.map((b,i)=>({...b,box_number:i+1,name:`Boîte ${String(i+1).padStart(3,'0')}`}));
}
export async function calculateBox(boxId){
  const {data,error}=await supabase.rpc('calculate_box',{p_box_id:boxId});
  if(error) throw error; return data;
}
export async function listBoxes(kitchenId){
  const {data,error}=await supabase.from('boxes').select('*').eq('kitchen_id',kitchenId).order('created_at',{ascending:true});
  if(error) throw error; return data;
}

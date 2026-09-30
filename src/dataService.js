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
export async function calculateBox(boxId){
  const {data,error}=await supabase.rpc('calculate_box',{p_box_id:boxId});
  if(error) throw error; return data;
}
export async function listBoxes(kitchenId){
  const {data,error}=await supabase.from('boxes').select('*').eq('kitchen_id',kitchenId).order('box_number');
  if(error) throw error; return data;
}

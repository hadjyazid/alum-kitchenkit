import React,{useEffect,useMemo,useState} from 'react';
import {supabase} from './supabase';
export default function KitchenBOM({kitchenId}){
 const [rows,setRows]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 useEffect(()=>{if(kitchenId)load(kitchenId)},[kitchenId]);
 async function load(id){setLoading(true);setError('');try{const {data,error}=await supabase.rpc('calculate_kitchen_purchase',{p_kitchen_id:id});if(error)throw error;setRows(data||[])}catch(e){setError(e.message)}finally{setLoading(false)}}
 const total=useMemo(()=>rows.reduce((s,r)=>s+Number(r.cost||0),0),[rows]);
 return <section className="panel kitchen-bom"><div className="panelhead"><div><h2>Kitchen BOM & Cost</h2><p>إجمالي المواد المطلوبة للطبخية حسب وحدات الشراء.</p></div><button className="primary" disabled={!kitchenId||loading} onClick={()=>load(kitchenId)}>Recalculer</button></div>{error&&<div className="error">{error}</div>}<div className="bom-summary"><div><span>Articles</span><b>{rows.length}</b></div><div><span>Coût matières</span><b>{total.toLocaleString('fr-DZ')} DA</b></div></div><div className="bom-table"><div className="bom-head"><span>Material</span><span>Besoin</span><span>Achat</span><span>Prix unité</span><span>Coût</span></div>{rows.map(r=><div className="bom-row" key={r.material_id}><b>{r.name}</b><span>{fmt(r.required_quantity)} {r.unit}</span><span>{fmt(r.purchase_quantity)} {r.material_type==='profile'?'unités':r.material_type==='sheet'?'plaques':r.unit}</span><span>{Number(r.unit_price||0).toLocaleString('fr-DZ')} DA</span><strong>{Number(r.cost||0).toLocaleString('fr-DZ')} DA</strong></div>)}{!rows.length&&!loading&&<div className="empty-row">Aucune donnée BOM pour cette cuisine.</div>}</div></section>
}
function fmt(v){return Number(v||0).toLocaleString('fr-DZ',{maximumFractionDigits:3})}

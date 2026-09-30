import React,{useMemo,useState} from 'react';
import {calculateBox,workshopDefaults} from './boxRules';
export default function Box(){
 const [form,setForm]=useState({name:'Boîte 001',length:'415',height:'760',depth:'580',shelves:'0',doors:'0',topResin:true});
 const set=(k,v)=>setForm(f=>({...f,[k]:v}));
 const result=useMemo(()=>calculateBox(form),[form]);
 return <section className="box-page">
  <div className="panel"><div className="panelhead"><div><h2>{form.name}</h2><p>Dimensions et options de fabrication</p></div><span className="badge">Calcul automatique</span></div>
   <div className="formgrid">
    {[["name","Nom"],["length","Longueur (mm)"],["height","Hauteur (mm)"],["depth","Profondeur (mm)"],["shelves","Nombre d'étagères"]].map(([k,l])=><label key={k}>{l}<input value={form[k]} onChange={e=>set(k,e.target.value)}/></label>)}
    <label>Nombre de portes<select value={form.doors} onChange={e=>set('doors',e.target.value)}><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></label>
    <label className="check"><input type="checkbox" checked={form.topResin} onChange={e=>set('topResin',e.target.checked)}/> Résine supérieure</label>
   </div>
  </div>
  <div className="results">
   <div className="panel"><h3>Profiles</h3><Row n="1 Départ" v={`${result.profiles.oneDepart.toFixed(0)} mm`} /><Row n="2 Départes Long" v={`${result.profiles.longDepart.toFixed(0)} mm`} /><Row n="2 Départes Court" v={`${result.profiles.shortDepart.toFixed(0)} mm`} /></div>
   <div className="panel"><h3>Résine</h3><Row n="Joints / côtés" v={`${result.resin.side.toFixed(6)} m²`} /><Row n="Arrière" v={`${result.resin.back.toFixed(6)} m²`} /><Row n="Fond" v={`${result.resin.bottom.toFixed(6)} m²`} /><Row n="Étagères" v={`${result.resin.shelves.toFixed(6)} m²`} /><Row n="Dessus" v={`${result.resin.top.toFixed(6)} m²`} /><strong>Total: {result.resin.total.toFixed(6)} m²</strong></div>
   <div className="panel"><h3>Portes & accessoires</h3><Row n="Largeur porte" v={result.doors.count?`${result.doors.width.toFixed(1)} mm`:'—'} /><Row n="Hauteur porte" v={result.doors.count?`${result.doors.height.toFixed(1)} mm`:'—'} /><Row n="Ouvrant" v={`${result.doors.ouvrantLengthPieces+result.doors.ouvrantHeightPieces} pcs`} /><Row n="Charnière" v={`${result.doors.hinges} pcs`} /><Row n="Coins étagères" v={`${result.shelves.coinPieces} pcs`} /></div>
  </div>
 </section>
}
function Row({n,v}){return <div className="row"><span>{n}</span><b>{v}</b></div>}

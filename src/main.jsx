import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LayoutDashboard,Users,ChefHat,Package,Warehouse,Scissors,Factory,Settings,Plus,Calculator} from 'lucide-react';
import './styles.css';

const menu=[['Dashboard',LayoutDashboard],['Clients',Users],['Kitchens',ChefHat],['Materials',Package],['Stock',Warehouse],['Cutting Optimizer',Scissors],['Production',Factory],['Settings',Settings]];
function App(){const [page,setPage]=useState('Dashboard');return <div className="app"><aside><div className="brand"><div className="logo">AK</div><div><strong>Alum KitchenKit</strong><small>Kitchen manufacturing</small></div></div><nav>{menu.map(([name,Icon])=><button className={page===name?'active':''} onClick={()=>setPage(name)} key={name}><Icon size={18}/>{name}</button>)}</nav></aside><main><header><div><h1>{page}</h1><p>Gestion de fabrication de cuisines aluminium</p></div><button className="primary"><Plus size={17}/> Nouveau</button></header>{page==='Dashboard'?<Dashboard/>:<Placeholder page={page}/>}</main></div>}
function Dashboard(){return <><section className="cards"><Card title="Clients" value="0"/><Card title="Kitchens" value="0"/><Card title="En production" value="0"/><Card title="Stock alertes" value="0"/></section><section className="panel"><div className="panelhead"><div><h2>Bienvenue dans Alum KitchenKit</h2><p>Commencez par créer un client puis sa cuisine.</p></div><div className="calc"><Calculator size={22}/></div></div><div className="steps"><div><b>01</b><span>Créer un client</span></div><div><b>02</b><span>Créer une cuisine</span></div><div><b>03</b><span>Ajouter les boîtes</span></div><div><b>04</b><span>Calcul automatique</span></div></div></section></>}
function Card({title,value}){return <div className="card"><span>{title}</span><strong>{value}</strong></div>}
function Placeholder({page}){return <section className="panel empty"><Package size={38}/><h2>{page}</h2><p>Module prêt à être connecté à Supabase.</p></section>}
createRoot(document.getElementById('root')).render(<App/>);

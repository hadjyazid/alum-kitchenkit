import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LayoutDashboard,Users,ChefHat,Package,Warehouse,Scissors,Factory,Settings,Plus,Calculator,Box as BoxIcon,LogOut} from 'lucide-react';
import './styles.css';
import Workspace from './Workspace';
import MaterialsStock from './MaterialsStock';
import {supabase} from './supabase';

const menu=[['Dashboard',LayoutDashboard],['Clients',Users],['Kitchens',ChefHat],['Materials',Package],['Stock',Warehouse],['Cutting Optimizer',Scissors],['Production',Factory],['Settings',Settings]];

function App(){
 const [session,setSession]=useState(null),[company,setCompany]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{let mounted=true;supabase.auth.getSession().then(async({data})=>{if(!mounted)return;setSession(data.session);if(data.session)await loadCompany();setLoading(false)});const {data:{subscription}}=supabase.auth.onAuthStateChange(async(_event,next)=>{setSession(next);if(next)await loadCompany();else setCompany(null)});return()=>{mounted=false;subscription.unsubscribe()}},[]);
 async function loadCompany(){try{const {data,error}=await supabase.from('company_members').select('company_id,companies(*)').eq('user_id',(await supabase.auth.getUser()).data.user.id).limit(1).maybeSingle();if(error)throw error;if(data?.companies)setCompany(data.companies);else setCompany(false)}catch(e){setError(e.message)}}
 async function signOut(){await supabase.auth.signOut()}
 if(loading)return <div className="auth-shell"><div className="auth-card"><h1>Alum KitchenKit</h1><p>Chargement...</p></div></div>;
 if(!session)return <AuthScreen/>;
 if(company===false)return <CompanySetup onCreated={loadCompany}/>;
 if(!company)return <div className="auth-shell"><div className="auth-card"><h1>Alum KitchenKit</h1><p>{error||'Chargement de votre entreprise...'}</p></div></div>;
 return <AppShell company={company} onSignOut={signOut}/>;
}

function AuthScreen(){
 const [mode,setMode]=useState('login'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 async function submit(e){e.preventDefault();setBusy(true);setError('');setMessage('');try{if(mode==='login'){const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error}else{const {data,error}=await supabase.auth.signUp({email,password});if(error)throw error;setMessage(data.session?'Compte créé.':'Compte créé. Si la confirmation email est activée, vérifiez votre boîte mail puis connectez-vous.');setMode('login')}}catch(e){setError(e.message)}finally{setBusy(false)}}
 return <div className="auth-shell"><div className="auth-card"><div className="brand auth-brand"><div className="logo">AK</div><div><strong>Alum KitchenKit</strong><small>Kitchen manufacturing</small></div></div><h1>{mode==='login'?'Connexion':'Créer un compte'}</h1><p>Accédez à vos clients, matériaux, stock et productions.</p>{error&&<div className="error">{error}</div>}{message&&<div className="success">{message}</div>}<form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></label><label>Mot de passe<input type="password" required minLength="6" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==='login'?'current-password':'new-password'}/></label><button className="primary" disabled={busy}>{busy?'...':mode==='login'?'Se connecter':'Créer le compte'}</button></form><button className="link-button" onClick={()=>{setMode(mode==='login'?'signup':'login');setError('');setMessage('')}}>{mode==='login'?"Créer un nouveau compte":"J'ai déjà un compte"}</button></div></div>
}

function CompanySetup({onCreated}){
 const [name,setName]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(e){e.preventDefault();setBusy(true);setError('');try{const {error}=await supabase.rpc('create_company_for_current_user',{p_name:name});if(error)throw error;await onCreated()}catch(e){setError(e.message)}finally{setBusy(false)}}
 return <div className="auth-shell"><div className="auth-card"><div className="brand auth-brand"><div className="logo">AK</div><div><strong>Alum KitchenKit</strong><small>Kitchen manufacturing</small></div></div><h1>Créer votre entreprise</h1><p>Cette entreprise sera l'espace partagé pour vos utilisateurs, clients, cuisines et stock.</p>{error&&<div className="error">{error}</div>}<form onSubmit={submit}><label>Nom de l'entreprise<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Ma société Aluminium"/></label><button className="primary" disabled={busy}>{busy?'Création...':'Continuer'}</button></form></div></div>
}

function AppShell({company,onSignOut}){const [page,setPage]=useState('Dashboard');return <div className="app"><aside><div className="brand"><div className="logo">AK</div><div><strong>Alum KitchenKit</strong><small>{company.name}</small></div></div><nav>{menu.map(([name,Icon])=><button className={page===name?'active':''} onClick={()=>setPage(name)} key={name}><Icon size={18}/>{name}</button>)}</nav><button className="logout" onClick={onSignOut}><LogOut size={17}/> Déconnexion</button></aside><main><header><div><h1>{page}</h1><p>Gestion de fabrication de cuisines aluminium</p></div><button className="primary"><Plus size={17}/> Nouveau</button></header>{page==='Dashboard'?<Dashboard/>:page==='Kitchens'?<Workspace/>:page==='Materials'||page==='Stock'?<MaterialsStock/>:<Placeholder page={page}/>}</main></div>}
function Dashboard(){return <><section className="cards"><Card title="Clients" value="—"/><Card title="Kitchens" value="—"/><Card title="En production" value="—"/><Card title="Stock alertes" value="—"/></section><section className="panel"><div className="panelhead"><div><h2>Bienvenue dans Alum KitchenKit</h2><p>Votre espace de travail est connecté à Supabase.</p></div><div className="calc"><Calculator size={22}/></div></div><div className="steps"><div><b>01</b><span>Créer un client</span></div><div><b>02</b><span>Créer une cuisine</span></div><div><b>03</b><span>Ajouter les boîtes</span></div><div><b>04</b><span>Calcul automatique</span></div></div></section></>}
function Card({title,value}){return <div className="card"><span>{title}</span><strong>{value}</strong></div>}
function Placeholder({page}){return <section className="panel empty"><BoxIcon size={38}/><h2>{page}</h2><p>Module en cours de connexion aux données réelles.</p></section>}

createRoot(document.getElementById('root')).render(<App/>);

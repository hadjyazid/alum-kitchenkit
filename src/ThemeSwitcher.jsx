import React,{useEffect,useState} from 'react';
import {Moon,Sun,Palette} from 'lucide-react';
import {COLOR_THEMES,applyTheme,getStoredTheme,saveTheme} from './theme';
import './theme-switcher.css';

const labels={blue:'Blue',indigo:'Indigo',emerald:'Emerald',violet:'Violet',orange:'Orange',rose:'Rose'};

export default function ThemeSwitcher(){
  const [theme,setTheme]=useState(getStoredTheme());
  useEffect(()=>{applyTheme(theme.mode,theme.colorTheme)},[]);
  const setMode=mode=>{const next={...theme,mode};setTheme(next);saveTheme(next.mode,next.colorTheme)};
  const setColor=colorTheme=>{const next={...theme,colorTheme};setTheme(next);saveTheme(next.mode,next.colorTheme)};
  return <div className="theme-switcher" aria-label="Appearance settings">
    <button className="theme-mode-btn" type="button" onClick={()=>setMode(theme.mode==='dark'?'light':'dark')} title={theme.mode==='dark'?'Light mode':'Dark mode'} aria-label={theme.mode==='dark'?'Light mode':'Dark mode'}>
      {theme.mode==='dark'?<Sun size={17}/>:<Moon size={17}/>}<span>{theme.mode==='dark'?'Light':'Dark'}</span>
    </button>
    <label className="theme-color-select"><Palette size={16}/><span className="sr-only">Color theme</span><select value={theme.colorTheme} onChange={e=>setColor(e.target.value)} aria-label="Color theme">
      {COLOR_THEMES.map(color=><option key={color} value={color}>{labels[color]}</option>)}
    </select></label>
  </div>;
}

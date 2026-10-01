import React, {useEffect, useMemo, useState} from 'react';
import {ArrowRight, CheckCircle2, Clock3, FileText, Plus, Sparkles} from 'lucide-react';
import {listKitchens, deleteKitchen} from './dataService';
import './dashboard.css';

export default function Dashboard({company, onAdd, onViewAll}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      setProjects(await listKitchens(company.id));
    } catch (e) {
      setError(e.message || 'Impossible de charger les projets.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [company.id]);

  const stats = useMemo(() => {
    const drafts = projects.filter(project => project.status === 'draft').length;
    return {
      total: projects.length,
      drafts,
      saved: projects.length - drafts,
    };
  }, [projects]);

  return (
    <div className="saas-dashboard">
      <section className="dashboard-welcome ds-card">
        <div className="dashboard-welcome-copy">
          <div className="dashboard-eyebrow"><Sparkles size={15}/> Espace de travail</div>
          <h2>Bonjour{company?.name ? `, ${company.name}` : ''}.</h2>
          <p>Gérez vos projets de fabrication depuis un espace unique, clair et rapide.</p>
        </div>
        <button className="ds-btn ds-btn-primary dashboard-create" onClick={onAdd}>
          <Plus size={18}/> Ajouter un projet
        </button>
      </section>

      <section className="dashboard-section" aria-labelledby="dashboard-overview-title">
        <div className="dashboard-section-heading">
          <div>
            <h2 id="dashboard-overview-title" className="ds-section-title">Vue d’ensemble</h2>
            <p className="ds-section-description">L’état actuel de votre espace de production.</p>
          </div>
        </div>

        <div className="dashboard-kpis">
          <KpiCard icon={<FileText size={18}/>} label="Projets" value={loading ? '—' : stats.total} detail="Total des projets" />
          <KpiCard icon={<Clock3 size={18}/>} label="Brouillons" value={loading ? '—' : stats.drafts} detail="À finaliser" tone="warning" />
          <KpiCard icon={<CheckCircle2 size={18}/>} label="Enregistrés" value={loading ? '—' : stats.saved} detail="Projets enregistrés" tone="success" />
        </div>
      </section>

      <section className="dashboard-projects-card ds-card" aria-labelledby="dashboard-projects-title">
        <div className="dashboard-projects-header">
          <div>
            <div className="dashboard-eyebrow">Gestion</div>
            <h2 id="dashboard-projects-title" className="ds-section-title">Vos projets</h2>
            <p className="ds-section-description">Accédez à votre liste complète et retrouvez rapidement un projet.</p>
          </div>
          <button className="ds-btn ds-btn-secondary dashboard-secondary-action" onClick={onViewAll}>
            Voir tous les projets <ArrowRight size={16}/>
          </button>
        </div>

        {error && <div className="dashboard-alert" role="alert">{error}</div>}

        {!loading && projects.length === 0 && (
          <div className="dashboard-empty-state">
            <div className="dashboard-empty-icon"><FileText size={22}/></div>
            <div>
              <strong>Aucun projet pour le moment</strong>
              <p>Créez votre premier projet pour commencer votre préparation de fabrication.</p>
            </div>
            <button className="ds-btn ds-btn-primary" onClick={onAdd}><Plus size={17}/> Créer un projet</button>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <button className="dashboard-projects-link" onClick={onViewAll}>
            <span><FileText size={18}/><span><strong>Ouvrir la liste des projets</strong><small>{projects.length} projet{projects.length > 1 ? 's' : ''} disponible{projects.length > 1 ? 's' : ''}</small></span></span>
            <ArrowRight size={18}/>
          </button>
        )}
      </section>
    </div>
  );
}

function KpiCard({icon, label, value, detail, tone = 'primary'}) {
  return (
    <article className={`dashboard-kpi dashboard-kpi-${tone}`}>
      <div className="dashboard-kpi-top">
        <span className="dashboard-kpi-icon">{icon}</span>
        <span className="dashboard-kpi-label">{label}</span>
      </div>
      <strong className="dashboard-kpi-value">{value}</strong>
      <span className="dashboard-kpi-detail">{detail}</span>
    </article>
  );
}

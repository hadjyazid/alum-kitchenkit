import React, {useEffect, useMemo, useState} from 'react';
import {ArrowRight, CheckCircle2, Clock3, FileText, Plus, Sparkles, Trash2} from 'lucide-react';
import {listKitchens, listBoxes, deleteKitchen} from './dataService';
import './dashboard.css';

export default function Dashboard({company, onAdd, onOpen, onViewAll}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const rows = await listKitchens(company.id);
      const enriched = await Promise.all(rows.map(async project => ({
        ...project,
        boxCount: (await listBoxes(project.id)).length,
      })));
      setProjects(enriched);
    } catch (e) {
      setError(e.message || 'Impossible de charger les projets.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [company.id]);

  const stats = useMemo(() => {
    const drafts = projects.filter(project => project.status === 'draft').length;
    return {total: projects.length, drafts, saved: projects.length - drafts};
  }, [projects]);

  async function removeProject(event, project) {
    event.stopPropagation();
    if (!window.confirm(`Supprimer le projet « ${project.name || 'Projet sans nom'} » ?\n\nCette action supprimera définitivement le projet et toutes ses boîtes.`)) return;
    setDeletingId(project.id);
    try {
      await deleteKitchen(project.id);
      setProjects(current => current.filter(item => item.id !== project.id));
    } catch (e) {
      setError(e.message || 'Impossible de supprimer le projet.');
    } finally {
      setDeletingId(null);
    }
  }

  const visibleProjects = projects.slice(0, 4);

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
            <p className="ds-section-description">Les derniers projets de votre espace.</p>
          </div>
          <button className="ds-btn ds-btn-secondary dashboard-secondary-action" onClick={onViewAll}>
            Voir tous les projets <ArrowRight size={16}/>
          </button>
        </div>

        {error && <div className="dashboard-alert" role="alert">{error}</div>}

        {loading && <div className="dashboard-loading">Chargement des projets…</div>}

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
          <div className="dashboard-project-list">
            {visibleProjects.map(project => (
              <div className="dashboard-project-row" key={project.id} role="button" tabIndex={0}
                onClick={() => onOpen?.(project.id)}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') onOpen?.(project.id); }}>
                <div className="dashboard-project-main">
                  <div className="dashboard-project-title-row">
                    <strong>{project.name || 'Projet sans nom'}</strong>
                    <span className={`dashboard-project-status ${project.status === 'draft' ? 'is-draft' : 'is-saved'}`}>
                      {project.status === 'draft' ? 'Brouillon' : 'Enregistré'}
                    </span>
                  </div>
                  <span className="dashboard-project-meta">
                    {project.customers?.name || 'Client non renseigné'} · {project.customers?.phone || 'Téléphone non renseigné'} · {project.reference || 'Sans référence'}
                  </span>
                </div>
                <div className="dashboard-project-actions">
                  <span className="dashboard-project-boxes">{project.boxCount || 0} boîte{project.boxCount === 1 ? '' : 's'}</span>
                  <button className="dashboard-project-delete" type="button" disabled={deletingId === project.id}
                    onClick={event => removeProject(event, project)} aria-label={`Supprimer ${project.name || 'le projet'}`}>
                    <Trash2 size={16}/>
                  </button>
                  <ArrowRight size={17} className="dashboard-project-arrow" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && projects.length > 4 && (
          <button className="dashboard-projects-link" onClick={onViewAll}>
            <span><FileText size={18}/><span><strong>Ouvrir la liste complète</strong><small>{projects.length} projets disponibles</small></span></span>
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
      <div className="dashboard-kpi-top"><span className="dashboard-kpi-icon">{icon}</span><span className="dashboard-kpi-label">{label}</span></div>
      <strong className="dashboard-kpi-value">{value}</strong>
      <span className="dashboard-kpi-detail">{detail}</span>
    </article>
  );
}

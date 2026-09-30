import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';
import './cutting-print.css';

export default function CuttingOptimizer({ productionOrderId }) {
  const [sheets, setSheets] = useState([]);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productionOrderId) loadPlans();
    else {
      setSheets([]);
      setSheetIndex(0);
      setError('');
    }
  }, [productionOrderId]);

  async function loadPlans() {
    setError('');
    const { data, error: queryError } = await supabase
      .from('cutting_plans')
      .select('*')
      .eq('production_order_id', productionOrderId)
      .order('sheet_number');

    if (queryError) {
      setError(queryError.message);
      setSheets([]);
      return;
    }

    setSheets(
      (data || []).map((row) => ({
        number: row.sheet_number,
        width: Number(row.sheet_width_mm || 0),
        height: Number(row.sheet_height_mm || 0),
        parts: Array.isArray(row.parts) ? row.parts : [],
      }))
    );
    setSheetIndex(0);
  }

  const current = sheets[sheetIndex];
  const utilization = useMemo(() => {
    if (!current || !current.width || !current.height) return 0;
    const used = current.parts.reduce(
      (total, part) => total + Number(part.w || 0) * Number(part.h || 0),
      0
    );
    return (used / (current.width * current.height)) * 100;
  }, [current]);

  if (!productionOrderId) {
    return (
      <section className="panel empty">
        <h2>Cutting Optimizer</h2>
        <p>Sélectionnez un ordre de production.</p>
      </section>
    );
  }

  if (!current) {
    return (
      <section className="panel empty">
        <h2>Cutting Optimizer</h2>
        {error ? <p>{error}</p> : <p>Aucun plan de coupe généré pour cette production.</p>}
      </section>
    );
  }

  return (
    <section className="cutting-page">
      <div className="cutting-toolbar no-print">
        <div>
          <h2>Cutting Optimizer</h2>
          <p>Plan de coupe • {current.width} × {current.height} mm</p>
        </div>
        <div className="toolbar-actions">
          <button onClick={() => setZoom((value) => Math.max(0.5, value - 0.1))}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((value) => Math.min(1.5, value + 0.1))}>+</button>
          <button className="primary" onClick={() => window.print()}>Print — Atelier</button>
        </div>
      </div>

      <div className="cutting-layout">
        <aside className="sheet-list no-print">
          <h3>Plans</h3>
          {sheets.map((item, index) => (
            <button
              className={index === sheetIndex ? 'selected' : ''}
              onClick={() => setSheetIndex(index)}
              key={item.number}
            >
              <b>Plaque {String(item.number).padStart(2, '0')}</b>
              <span>{item.width} × {item.height} mm</span>
              <small>{item.parts.length} pièces</small>
            </button>
          ))}
        </aside>

        <div className="canvas-wrap">
          <div className="sheet-meta no-print">
            <span>Utilisation <b>{utilization.toFixed(1)}%</b></span>
            <span>Déchets <b>{Math.max(0, 100 - utilization).toFixed(1)}%</b></span>
            <span>{current.parts.length} pièces</span>
          </div>

          <div className="print-sheet">
            <div className="print-header">
              <h1>Alum KitchenKit</h1>
              <h2>Plan de coupe — Plaque {String(current.number).padStart(2, '0')}</h2>
              <p>{current.width} × {current.height} mm</p>
            </div>

            <div className="sheet-stage">
              <div
                className="sheet"
                style={{
                  width: `${current.width * 0.25 * zoom}px`,
                  height: `${current.height * 0.25 * zoom}px`,
                }}
              >
                {current.parts.map((part, index) => (
                  <div
                    key={index}
                    className="cut-piece"
                    style={{
                      left: Number(part.x || 0) * 0.25 * zoom,
                      top: Number(part.y || 0) * 0.25 * zoom,
                      width: Number(part.w || 0) * 0.25 * zoom,
                      height: Number(part.h || 0) * 0.25 * zoom,
                    }}
                  >
                    <strong>{part.name}</strong>
                    <span>{part.w} × {part.h} mm</span>
                    {part.rotated && <em>↻</em>}
                  </div>
                ))}
                <div className="dimension top">{current.width} mm</div>
                <div className="dimension left">{current.height} mm</div>
              </div>
            </div>

            <div className="print-parts">
              <h3>Pièces à couper</h3>
              {current.parts.map((part, index) => (
                <div className="part-row" key={index}>
                  <span className="part-index">{index + 1}</span>
                  <div>
                    <b>{part.name}</b>
                    <small>{part.w} × {part.h} mm {part.rotated ? '• Rotée' : ''}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

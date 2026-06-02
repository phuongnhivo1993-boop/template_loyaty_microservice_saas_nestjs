'use client';
import { useState, useRef } from 'react';
import Modal from './Modal';
import { useToast } from './Toast';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  entity: string;
  entityLabel: string;
  onImportComplete: () => void;
}

export default function ImportModal({ open, onClose, entity, entityLabel, onImportComplete }: ImportModalProps) {
  const { showToast } = useToast();
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [mode, setMode] = useState<'csv' | 'excel'>('csv');
  const [result, setResult] = useState<{ created: number; errors: { row: number; message: string }[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleImportCsv = async () => {
    if (!csvText.trim()) { showToast('Please paste CSV data', 'error'); return; }
    setImporting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/import/${entity}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvText }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message || 'Import failed', 'error'); return; }
      setResult(data);
      if (data.errors?.length === 0) {
        showToast(`Imported ${data.created} ${entityLabel} successfully`, 'success');
        onImportComplete();
        onClose();
      }
    } catch { showToast('Network error', 'error'); }
    setImporting(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setResult(null);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(',')[1];
        const res = await fetch(`/api/import/${entity}/excel`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64 }),
        });
        const data = await res.json();
        if (!res.ok) { showToast(data.message || 'Import failed', 'error'); return; }
        setResult(data);
        if (data.errors?.length === 0) {
          showToast(`Imported ${data.created} ${entityLabel} successfully`, 'success');
          onImportComplete();
          onClose();
        }
        setImporting(false);
      };
      reader.readAsDataURL(file);
    } catch { showToast('Network error', 'error'); setImporting(false); }
  };

  return (
    <Modal open={open} title={`Import ${entityLabel}`} onClose={onClose} width={520}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setMode('csv')} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', background: mode === 'csv' ? '#2563eb' : 'white', color: mode === 'csv' ? 'white' : '#475569', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>CSV</button>
        <button onClick={() => setMode('excel')} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', background: mode === 'excel' ? '#2563eb' : 'white', color: mode === 'excel' ? 'white' : '#475569', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Excel (.xlsx)</button>
      </div>

      {mode === 'csv' ? (
        <>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Paste CSV data below. First row must be column headers.</p>
          <textarea value={csvText} onChange={e => setCsvText(e.target.value)} rows={10}
            placeholder={`name,email,status\nJohn,john@example.com,ACTIVE`}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical' }} />
        </>
      ) : (
        <>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Upload an Excel (.xlsx) file. First row must be column headers.</p>
          <input ref={fileRef} type="file" accept=".xlsx" onChange={handleFileChange} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
        </>
      )}

      {result && result.errors.length > 0 && (
        <div style={{ marginTop: '12px', padding: '12px', background: '#fef2f2', borderRadius: '8px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>Created: {result.created} | Errors: {result.errors.length}</p>
          {result.errors.slice(0, 5).map((e, i) => (
            <p key={i} style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>Row {e.row}: {e.message}</p>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button type="button" onClick={onClose}
          style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>Cancel</button>
        {mode === 'csv' && (
          <button onClick={handleImportCsv} disabled={importing}
            style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: importing ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
            {importing ? 'Importing...' : 'Import CSV'}
          </button>
        )}
      </div>
    </Modal>
  );
}

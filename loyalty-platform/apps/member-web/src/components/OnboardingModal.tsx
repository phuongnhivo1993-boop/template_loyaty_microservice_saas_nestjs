'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const STEPS = 3;

export default function OnboardingModal() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('onboarding_seen');
    if (!seen) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('onboarding_seen', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl" style={{ background: 'var(--card)', borderRadius: '16px', padding: '24px', margin: '0 16px', maxWidth: '384px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{t('onboarding.welcome', { platform: 'Loyalty+' })}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
              {t('onboarding.step1Desc')}
            </p>
          </div>
        )}
        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎁</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{t('onboarding.step2Title')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
              {t('onboarding.step2Desc')}
            </p>
          </div>
        )}
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{t('onboarding.step3Title')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
              {t('onboarding.step3Desc')}
            </p>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '16px 0' }}>
          {Array.from({ length: STEPS }, (_, i) => (
            <div key={i} style={{ width: step === i + 1 ? '16px' : '8px', height: '8px', borderRadius: '4px', background: step === i + 1 ? 'var(--primary)' : 'var(--border)', transition: 'all 0.3s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={dismiss} className="btn btn-sm btn-outline" style={{ flex: 1, textAlign: 'center' }}>
            {t('onboarding.skip')}
          </button>
          {step < STEPS ? (
            <button onClick={() => setStep(s => s + 1)} className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
              {t('common.next')}
            </button>
          ) : (
            <button onClick={dismiss} className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
              {t('onboarding.getStarted')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

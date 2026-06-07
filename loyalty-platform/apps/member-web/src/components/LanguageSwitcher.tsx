'use client';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');
  };
  return (
    <button onClick={toggleLanguage} className="btn btn-sm btn-outline" style={{ width: 'auto' }}>
      {i18n.language === 'vi' ? 'EN' : 'VI'}
    </button>
  );
}

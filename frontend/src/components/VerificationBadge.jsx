import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, CheckCircle2, AlertCircle, Clock, AlertTriangle } from 'lucide-react';

export const VerificationBadge = ({ status }) => {
  const { t } = useLanguage();

  switch (status) {
    case 'officially_verified':
      return (
        <span className="badge-verified badge-officially-verified" title="Verified against official district and state gazetteers">
          <ShieldCheck size={14} />
          {t.badges.officially_verified}
        </span>
      );
    case 'cross_verified':
      return (
        <span className="badge-verified badge-cross-verified" title="Cross-verified through academic and cultural registers">
          <CheckCircle2 size={14} />
          {t.badges.cross_verified}
        </span>
      );
    case 'locally_reported':
      return (
        <span className="badge-verified badge-locally-reported" title="Locally reported neighborhood or landmark">
          <AlertCircle size={14} />
          {t.badges.locally_reported}
        </span>
      );
    case 'pending_verification':
      return (
        <span className="badge-verified badge-pending-verification" title="Awaiting field verification audit">
          <Clock size={14} />
          {t.badges.pending_verification}
        </span>
      );
    case 'disputed_information':
      return (
        <span className="badge-verified badge-disputed-information" title="Historical date or origin under academic debate">
          <AlertTriangle size={14} />
          {t.badges.disputed_information}
        </span>
      );
    default:
      return null;
  }
};

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return <h2>{t('notFound')}</h2>;
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <h1 className="h4 text-muted">{t('notFound')}</h1>
      <p className="text-muted">
        Но вы можете перейти
        {' '}
        <a href={routes.rootPath()}>на главную страницу</a>
      </p>
    </div>
  );
}

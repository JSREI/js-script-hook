import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Support.css';

interface Contributor {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  contributions: number;
}

const Support: React.FC = () => {
  const { t } = useTranslation();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.github.com/repos/JSREI/js-script-hook/contributors');
        
        if (!response.ok) {
          throw new Error(`${t('support.error.githubApiFailed')}: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 转换数据为我们需要的格式
        const formattedContributors = data.map((contributor: any) => ({
          username: contributor.login,
          avatarUrl: contributor.avatar_url,
          profileUrl: contributor.html_url,
          contributions: contributor.contributions
        }));
        
        setContributors(formattedContributors);
        setLoading(false);
      } catch (err) {
        console.error(`${t('support.error.failedToLoad')}:`, err);
        setError(t('support.error.cannotLoadContributors'));
        setLoading(false);
      }
    };

    fetchContributors();
  }, [t]);

  return (
    <section id="support" className="support">
      <div className="container">
        <div className="section-header">
          <h2>{t('support.title')}</h2>
          <p>{t('support.description')}</p>
        </div>

        <div className="support-grid">
          {/* 问题反馈 */}
          <div className="support-card">
            <div className="card-header">
              <h3>{t('support.feedback.title')}</h3>
              <svg className="icon" viewBox="0 0 24 24" width="24" height="24">
                <path d="M20 3H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.7 11.5h1.7v1.7h-1.7v-1.7zm0-7.3h1.7v5.7h-1.7V7.2z" fill="currentColor" />
              </svg>
            </div>
            <p>{t('support.feedback.description')}</p>
            <div className="button-container">
              <a href="https://github.com/JSREI/js-script-hook/issues/new" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                {t('support.feedback.createIssue')}
              </a>
            </div>
          </div>

          {/* 贡献者墙 */}
          <div className="support-card">
            <div className="card-header">
              <h3>{t('support.contributors.title')}</h3>
              <svg className="icon" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
              </svg>
            </div>
            <p>{t('support.contributors.description')}</p>
            
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>{t('support.contributors.loading')}</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
              </div>
            ) : (
              <div className="contributors-avatars">
                {contributors.map((contributor, index) => (
                  <a 
                    key={index} 
                    href={contributor.profileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contributor-link"
                    title={`${contributor.username} - ${contributor.contributions} ${t('support.contributors.commits')}`}
                  >
                    <img 
                      src={contributor.avatarUrl} 
                      alt={`${t('support.contributors.avatarAlt', { username: contributor.username })}`} 
                      className="contributor-avatar"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support; 
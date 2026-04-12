export function SkeletonLoader() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-icon"></div>
            <div className="skeleton-content">
              <div className="skeleton-value"></div>
              <div className="skeleton-label"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="skeleton-section">
        <div className="skeleton-header">
          <div className="skeleton-title"></div>
          <div className="skeleton-button"></div>
        </div>

        <div className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton-proxy-card">
              <div className="skeleton-proxy-header">
                <div className="skeleton-badge"></div>
                <div className="skeleton-status"></div>
              </div>

              <div>
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <div key={j} className="skeleton-info-row">
                    <div className="skeleton-info-label"></div>
                    <div className="skeleton-info-value"></div>
                  </div>
                ))}
              </div>

              <div className="skeleton-actions">
                <div className="skeleton-action-btn"></div>
                <div className="skeleton-action-btn"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

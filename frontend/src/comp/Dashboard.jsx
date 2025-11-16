function Dashboard({ topThree }) {
  if (!topThree || topThree.length === 0) {
    return (
      <div className="dashboard">
        <h2>Top Matches</h2>
        <p className="no-matches">No colleges match your criteria. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>🏆 Your Top 3 Matches</h2>
      <div className="top-three-grid">
        {topThree.map((college, index) => (
          <div key={college.id || index} className={`college-card top-match rank-${index + 1}`}>
            <div className="rank-badge">{index + 1}</div>
            
            <h3>{college.name}</h3>
            <p className="location">{college.city}, {college.state}</p>
            
            <div className="match-score">
              <div className="score-circle">
                <span className="score-number">{Math.round(college.matchScore)}</span>
                <span className="score-label">Match</span>
              </div>
            </div>

            <div className="college-stats">
              <div className="stat">
                <span className="stat-label">Net Price</span>
                <span className="stat-value">${college.net_price?.toLocaleString() || 'N/A'}</span>
              </div>
              
              <div className="stat">
                <span className="stat-label">Grad Rate</span>
                <span className="stat-value">{college.grad_rate || 'N/A'}%</span>
              </div>
              
              <div className="stat">
                <span className="stat-label">Median Debt</span>
                <span className="stat-value">${college.median_debt?.toLocaleString() || 'N/A'}</span>
              </div>
              
              {college.median_earnings && (
                <div className="stat">
                  <span className="stat-label">Median Earnings</span>
                  <span className="stat-value">${college.median_earnings?.toLocaleString()}</span>
                </div>
              )}

              {college.childcare_available && (
                <div className="stat highlight">
                  <span className="stat-label">✓ Childcare Available</span>
                  <span className="stat-value">${college.childcare_cost?.toLocaleString() || 'N/A'}/yr</span>
                </div>
              )}
            </div>

            <div className="college-highlights">
              {college.acceptance_rate && (
                <span className="highlight-badge">
                  {college.acceptance_rate}% acceptance
                </span>
              )}
              {college.demographic_type && college.demographic_type !== 'All Demographics' && (
                <span className="highlight-badge demographic">
                  {college.demographic_type}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
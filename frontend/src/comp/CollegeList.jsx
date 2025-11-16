function CollegeList({ colleges, total }) {
  // Show only colleges after the top 3
  const remainingColleges = colleges.slice(3);

  if (remainingColleges.length === 0) {
    return null;
  }

  return (
    <div className="college-list">
      <h2>All Matching Colleges ({total} total)</h2>
      
      <div className="colleges-grid">
        {remainingColleges.map((college, index) => (
          <div key={college.id || index} className="college-card">
            <div className="college-header">
              <h4>{college.name}</h4>
              <span className="match-badge">{Math.round(college.matchScore)}% match</span>
            </div>
            
            <p className="location">{college.city}, {college.state}</p>

            <div className="college-details">
              <div className="detail-row">
                <span>Net Price:</span>
                <strong>${college.net_price?.toLocaleString() || 'N/A'}</strong>
              </div>
              
              <div className="detail-row">
                <span>Graduation Rate:</span>
                <strong>{college.grad_rate || 'N/A'}%</strong>
              </div>
              
              <div className="detail-row">
                <span>Median Debt:</span>
                <strong>${college.median_debt?.toLocaleString() || 'N/A'}</strong>
              </div>

              {college.median_earnings && (
                <div className="detail-row">
                  <span>Median Earnings:</span>
                  <strong>${college.median_earnings?.toLocaleString()}</strong>
                </div>
              )}

              {college.acceptance_rate && (
                <div className="detail-row">
                  <span>Acceptance Rate:</span>
                  <strong>{college.acceptance_rate}%</strong>
                </div>
              )}

              {college.childcare_available && (
                <div className="detail-row highlight">
                  <span>Childcare Available:</span>
                  <strong>${college.childcare_cost?.toLocaleString() || 'Included'}/yr</strong>
                </div>
              )}
            </div>

            {college.demographic_type && college.demographic_type !== 'All Demographics' && (
              <div className="demographic-tag">
                {college.demographic_type}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollegeList;
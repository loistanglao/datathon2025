import { useState } from 'react';
import './App.css';
import FilterPanel from './Components/FilterPanel';
import Dashboard from './Components/Dashboard';
import CollegeList from './Components/CollegeList';
import TableauFilteredDashboard from './Components/TableauFilteredDashboard';

function App() {
  const [filters, setFilters] = useState({
    maxBudget: 50000,
    minGradRate: 0,
    demographic: 'Any',
    statePreference: 'Any',
    maxDebt: 50000,
    isStudentParent: false
  });

  const [weights, setWeights] = useState({
    budget: 3,      // Strong preference
    gradRate: 2,    // Medium preference
    state: 1,       // Weak preference
    debt: 3,        // Strong preference
    childcare: 2    // Medium preference (if applicable)
  });

  const [sortBy, setSortBy] = useState('matchScore');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/colleges/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filters, weights, sortBy })
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      alert('Error connecting to server. Make sure your backend is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 College Match Finder</h1>
        <p>Find your perfect college match based on your preferences</p>
      </header>

      <div className="app-container">
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          weights={weights}
          setWeights={setWeights}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onSearch={handleSearch}
          loading={loading}
        />

        <div className="results-section">
          {results && (
            <>
              <Dashboard topThree={results.topThree} />
              
              {/* Toggle between list view and analytics */}
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${!showAnalytics ? 'active' : ''}`}
                  onClick={() => setShowAnalytics(false)}
                >
                  📋 List View
                </button>
                <button 
                  className={`toggle-btn ${showAnalytics ? 'active' : ''}`}
                  onClick={() => setShowAnalytics(true)}
                >
                  📊 Analytics View
                </button>
              </div>

              {showAnalytics ? (
                <TableauFilteredDashboard 
                  colleges={results.colleges}
                  filters={filters}
                />
              ) : (
                <CollegeList 
                  colleges={results.colleges} 
                  total={results.total}
                />
              )}
            </>
          )}

          {!results && (
            <div className="empty-state">
              <h2>Ready to find your match?</h2>
              <p>Set your preferences on the left and click "Find Matches" to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
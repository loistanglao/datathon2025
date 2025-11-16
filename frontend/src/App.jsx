import { useState } from 'react';
import './App.css';
import FilterPanel from './comp/FilterPanel';
import Dashboard from './comp/Dashboard';
import CollegeList from './comp/CollegeList';

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
              <CollegeList 
                colleges={results.colleges} 
                total={results.total}
              />
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
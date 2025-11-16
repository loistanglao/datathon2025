import { useState } from 'react';

const US_STATES = [
  'Any', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA',
  'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
  'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
  'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const DEMOGRAPHICS = [
  'Any',
  'Hispanic-Serving Institution',
  'Historically Black College',
  'Tribal College',
  'Women\'s College',
  'All Demographics'
];

function FilterPanel({ filters, setFilters, weights, setWeights, sortBy, setSortBy, onSearch, loading }) {
  const [showWeights, setShowWeights] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleWeightChange = (key, value) => {
    setWeights(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  const getWeightLabel = (value) => {
    if (value === 1) return 'Weak';
    if (value === 2) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="filter-panel">
      <h2>Your Preferences</h2>

      <div className="filter-group">
        <label>
          Max Budget (Net Price)
          <span className="filter-value">${filters.maxBudget.toLocaleString()}</span>
        </label>
        <input
          type="range"
          min="0"
          max="80000"
          step="1000"
          value={filters.maxBudget}
          onChange={(e) => handleFilterChange('maxBudget', parseInt(e.target.value))}
        />
      </div>

      <div className="filter-group">
        <label>
          Min Graduation Rate
          <span className="filter-value">{filters.minGradRate}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={filters.minGradRate}
          onChange={(e) => handleFilterChange('minGradRate', parseInt(e.target.value))}
        />
      </div>

      <div className="filter-group">
        <label>
          Max Acceptable Debt
          <span className="filter-value">${filters.maxDebt.toLocaleString()}</span>
        </label>
        <input
          type="range"
          min="0"
          max="100000"
          step="5000"
          value={filters.maxDebt}
          onChange={(e) => handleFilterChange('maxDebt', parseInt(e.target.value))}
        />
      </div>

      <div className="filter-group">
        <label>State Preference</label>
        <select
          value={filters.statePreference}
          onChange={(e) => handleFilterChange('statePreference', e.target.value)}
        >
          {US_STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Demographic (Optional)</label>
        <select
          value={filters.demographic}
          onChange={(e) => handleFilterChange('demographic', e.target.value)}
        >
          {DEMOGRAPHICS.map(demo => (
            <option key={demo} value={demo}>{demo}</option>
          ))}
        </select>
      </div>

      <div className="filter-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={filters.isStudentParent}
            onChange={(e) => handleFilterChange('isStudentParent', e.target.checked)}
          />
          I am a student parent (show childcare options)
        </label>
      </div>

      <div className="weight-section">
        <button 
          className="toggle-weights"
          onClick={() => setShowWeights(!showWeights)}
        >
          {showWeights ? '▼' : '▶'} Adjust Preference Strength
        </button>

        {showWeights && (
          <div className="weights-container">
            <div className="weight-item">
              <label>
                Budget Priority
                <span className="weight-label">{getWeightLabel(weights.budget)}</span>
              </label>
              <input
                type="range"
                min="1"
                max="3"
                value={weights.budget}
                onChange={(e) => handleWeightChange('budget', e.target.value)}
              />
            </div>

            <div className="weight-item">
              <label>
                Graduation Rate Priority
                <span className="weight-label">{getWeightLabel(weights.gradRate)}</span>
              </label>
              <input
                type="range"
                min="1"
                max="3"
                value={weights.gradRate}
                onChange={(e) => handleWeightChange('gradRate', e.target.value)}
              />
            </div>

            <div className="weight-item">
              <label>
                State Priority
                <span className="weight-label">{getWeightLabel(weights.state)}</span>
              </label>
              <input
                type="range"
                min="1"
                max="3"
                value={weights.state}
                onChange={(e) => handleWeightChange('state', e.target.value)}
              />
            </div>

            <div className="weight-item">
              <label>
                Debt Priority
                <span className="weight-label">{getWeightLabel(weights.debt)}</span>
              </label>
              <input
                type="range"
                min="1"
                max="3"
                value={weights.debt}
                onChange={(e) => handleWeightChange('debt', e.target.value)}
              />
            </div>

            {filters.isStudentParent && (
              <div className="weight-item">
                <label>
                  Childcare Priority
                  <span className="weight-label">{getWeightLabel(weights.childcare)}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={weights.childcare}
                  onChange={(e) => handleWeightChange('childcare', e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="filter-group">
        <label>Sort Results By</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="matchScore">Best Match Score</option>
          <option value="lowestCost">Lowest Cost</option>
          <option value="highestGradRate">Highest Graduation Rate</option>
          <option value="highestEarnings">Highest Earnings</option>
        </select>
      </div>

      <button 
        className="search-button"
        onClick={onSearch}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Find Matches'}
      </button>
    </div>
  );
}

export default FilterPanel;
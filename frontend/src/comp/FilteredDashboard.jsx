import { useEffect, useRef, useState } from 'react';

function FilteredDashboard({ colleges, filters }) {
  const vizRef = useRef(null);
  const [viz, setViz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with YOUR actual Tableau Public URL after you publish
  const TABLEAU_URL = 'https://public.tableau.com/views/YourCollegeDashboard/MainDashboard';

  useEffect(() => {
    // Load Tableau JavaScript API
    const loadTableauAPI = () => {
      if (document.getElementById('tableau-api-script')) return;
      
      const script = document.createElement('script');
      script.id = 'tableau-api-script';
      script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
      script.async = true;
      script.onload = () => {
        console.log('Tableau API loaded');
        initializeViz();
      };
      script.onerror = () => {
        setError('Failed to load Tableau API');
        setIsLoading(false);
      };
      document.body.appendChild(script);
    };

    loadTableauAPI();

    return () => {
      if (viz) {
        viz.dispose();
      }
    };
  }, []);

  useEffect(() => {
    // Apply filters when colleges data changes
    if (viz && colleges && colleges.length > 0) {
      applyFiltersToTableau();
    }
  }, [colleges, viz]);

  const initializeViz = () => {
    if (!vizRef.current || !window.tableau) return;

    try {
      const options = {
        hideTabs: true,
        hideToolbar: false,
        width: '100%',
        height: '850px',
        onFirstInteractive: () => {
          console.log('Tableau visualization is ready');
          setIsLoading(false);
          if (colleges && colleges.length > 0) {
            applyFiltersToTableau();
          }
        }
      };

      const newViz = new window.tableau.Viz(vizRef.current, TABLEAU_URL, options);
      setViz(newViz);
    } catch (err) {
      console.error('Error initializing Tableau:', err);
      setError('Failed to initialize Tableau visualization');
      setIsLoading(false);
    }
  };

  const applyFiltersToTableau = async () => {
    if (!viz || !colleges || colleges.length === 0) return;

    try {
      const workbook = viz.getWorkbook();
      const activeSheet = workbook.getActiveSheet();

      // Get worksheet (adjust name based on your Tableau dashboard)
      const worksheets = activeSheet.getWorksheets();
      const worksheet = worksheets.length > 0 ? worksheets[0] : activeSheet;

      // Filter by college names (showing only matched colleges)
      const collegeNames = colleges.map(c => c.name);
      await worksheet.applyFilterAsync(
        'College Name', // This field name must match your Tableau field
        collegeNames,
        window.tableau.FilterUpdateType.REPLACE
      );

      console.log(`Filtered Tableau to show ${collegeNames.length} colleges`);

      // Optional: Apply additional filters based on user preferences
      if (filters.statePreference && filters.statePreference !== 'Any') {
        await worksheet.applyFilterAsync(
          'State',
          [filters.statePreference],
          window.tableau.FilterUpdateType.REPLACE
        );
      }

      // Optional: Apply budget range filter
      if (filters.maxBudget) {
        await worksheet.applyRangeFilterAsync('Net Price', {
          min: 0,
          max: filters.maxBudget
        });
      }

    } catch (err) {
      console.error('Error applying filters to Tableau:', err);
      // Don't set error state - visualization might still work
    }
  };

  const resetFilters = async () => {
    if (!viz) return;

    try {
      const workbook = viz.getWorkbook();
      const activeSheet = workbook.getActiveSheet();
      const worksheets = activeSheet.getWorksheets();
      const worksheet = worksheets.length > 0 ? worksheets[0] : activeSheet;

      await worksheet.clearFilterAsync('College Name');
      console.log('Filters cleared');
    } catch (err) {
      console.error('Error clearing filters:', err);
    }
  };

  const exportToPDF = () => {
    if (viz) {
      viz.showExportPDFDialog();
    }
  };

  const exportToImage = () => {
    if (viz) {
      viz.showExportImageDialog();
    }
  };

  const refreshData = () => {
    if (viz) {
      viz.refreshDataAsync();
    }
  };

  if (!colleges || colleges.length === 0) {
    return (
      <div className="tableau-dashboard empty">
        <h2>📊 Tableau Analytics</h2>
        <p className="empty-message">
          Find matching colleges to see Tableau visualizations
        </p>
      </div>
    );
  }

  return (
    <div className="tableau-dashboard">
      <div className="tableau-header">
        <div>
          <h2>📊 Tableau Analytics Dashboard</h2>
          <p className="tableau-subtitle">
            Showing {colleges.length} matched colleges
          </p>
        </div>
        <div className="tableau-actions">
          <button onClick={resetFilters} className="action-btn">
            Reset Filters
          </button>
          <button onClick={refreshData} className="action-btn">
            Refresh Data
          </button>
          <button onClick={exportToImage} className="action-btn">
            Export Image
          </button>
          <button onClick={exportToPDF} className="action-btn">
            Export PDF
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="tableau-loading">
          <div className="loading-spinner"></div>
          <p>Loading Tableau visualization...</p>
        </div>
      )}

      {error && (
        <div className="tableau-error">
          <p>⚠️ {error}</p>
          <p className="error-hint">
            Make sure you've replaced TABLEAU_URL with your actual Tableau Public URL
          </p>
        </div>
      )}

      <div 
        ref={vizRef} 
        className="tableau-viz-container"
        style={{ display: isLoading ? 'none' : 'block' }}
      />

      <div className="tableau-insights">
        <h3>Key Insights from Matched Colleges</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <span className="insight-icon">💰</span>
            <span className="insight-number">
              ${Math.round(colleges.reduce((sum, c) => sum + (c.net_price || 0), 0) / colleges.length).toLocaleString()}
            </span>
            <span className="insight-label">Average Net Price</span>
          </div>
          
          <div className="insight-card">
            <span className="insight-icon">🎓</span>
            <span className="insight-number">
              {Math.round(colleges.reduce((sum, c) => sum + (c.grad_rate || 0), 0) / colleges.length)}%
            </span>
            <span className="insight-label">Average Graduation Rate</span>
          </div>
          
          <div className="insight-card">
            <span className="insight-icon">💳</span>
            <span className="insight-number">
              ${Math.round(colleges.reduce((sum, c) => sum + (c.median_debt || 0), 0) / colleges.length).toLocaleString()}
            </span>
            <span className="insight-label">Average Median Debt</span>
          </div>
          
          <div className="insight-card">
            <span className="insight-icon">🗺️</span>
            <span className="insight-number">
              {new Set(colleges.map(c => c.state)).size}
            </span>
            <span className="insight-label">States Represented</span>
          </div>

          {colleges.some(c => c.median_earnings) && (
            <div className="insight-card">
              <span className="insight-icon">💼</span>
              <span className="insight-number">
                ${Math.round(
                  colleges
                    .filter(c => c.median_earnings)
                    .reduce((sum, c) => sum + c.median_earnings, 0) / 
                  colleges.filter(c => c.median_earnings).length
                ).toLocaleString()}
              </span>
              <span className="insight-label">Average Median Earnings</span>
            </div>
          )}

          {colleges.some(c => c.childcare_available) && (
            <div className="insight-card highlight">
              <span className="insight-icon">👶</span>
              <span className="insight-number">
                {colleges.filter(c => c.childcare_available).length}
              </span>
              <span className="insight-label">With Childcare Available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilteredDashboard;
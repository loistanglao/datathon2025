import { useEffect, useRef } from 'react';

function TableauVisualization({ colleges }) {
  const vizRef = useRef(null);

  useEffect(() => {
    // Load Tableau's JavaScript API
    const script = document.createElement('script');
    script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // If you have a Tableau Public URL, replace this placeholder
  const tableauUrl = 'https://public.tableau.com/views/YourWorkbookName/YourDashboardName';

  return (
    <div className="tableau-container">
      <h2>📊 Visual Analysis</h2>
      
      <div className="tableau-viz">
        <tableau-viz
          ref={vizRef}
          src={tableauUrl}
          width="100%"
          height="800"
          toolbar="bottom"
          hide-tabs
        />
      </div>

      {/* Alternative: Using iframe */}
      {/* <iframe
        src={`${tableauUrl}?:embed=yes&:showVizHome=no`}
        width="100%"
        height="800"
        frameBorder="0"
        allowFullScreen
      /> */}
    </div>
  );
}

export default TableauVisualization;
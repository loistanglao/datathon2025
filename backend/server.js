const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Load college data from CSV
let collegeData = [];

fs.readFile(path.join(__dirname, 'data', 'schools.csv'), 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading CSV:', err);
    return;
  }
  
  Papa.parse(data, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => {
      collegeData = results.data;
      console.log(`Loaded ${collegeData.length} colleges`);
    }
  });
});

// Calculate match score based on user preferences
function calculateMatchScore(college, filters, weights) {
  let score = 0;
  let totalWeight = 0;

  // Budget score (lower is better)
  if (filters.maxBudget && college.net_price) {
    const budgetWeight = weights.budget || 1;
    if (college.net_price <= filters.maxBudget) {
      score += budgetWeight * 100;
    } else {
      const overBudget = (college.net_price - filters.maxBudget) / filters.maxBudget;
      score += budgetWeight * Math.max(0, 100 - (overBudget * 100));
    }
    totalWeight += budgetWeight;
  }

  // Graduation rate score
  if (filters.minGradRate && college.grad_rate) {
    const gradWeight = weights.gradRate || 1;
    if (college.grad_rate >= filters.minGradRate) {
      score += gradWeight * 100;
    } else {
      score += gradWeight * (college.grad_rate / filters.minGradRate) * 100;
    }
    totalWeight += gradWeight;
  }

  // State preference score
  if (filters.statePreference && college.state) {
    const stateWeight = weights.state || 1;
    if (college.state === filters.statePreference) {
      score += stateWeight * 100;
    }
    totalWeight += stateWeight;
  }

  // Debt score (lower is better)
  if (filters.maxDebt && college.median_debt) {
    const debtWeight = weights.debt || 1;
    if (college.median_debt <= filters.maxDebt) {
      score += debtWeight * 100;
    } else {
      const overDebt = (college.median_debt - filters.maxDebt) / filters.maxDebt;
      score += debtWeight * Math.max(0, 100 - (overDebt * 100));
    }
    totalWeight += debtWeight;
  }

  // Childcare affordability (for student parents)
  if (filters.isStudentParent && college.childcare_available) {
    const childcareWeight = weights.childcare || 1;
    score += childcareWeight * 100;
    totalWeight += childcareWeight;
  }

  return totalWeight > 0 ? score / totalWeight : 0;
}

// Filter and score colleges
app.post('/api/colleges/match', (req, res) => {
  const { filters, weights = {}, sortBy = 'matchScore' } = req.body;

  let results = collegeData.filter(college => {
    // Hard filters (must meet these)
    if (filters.maxBudget && college.net_price > filters.maxBudget) return false;
    if (filters.minGradRate && college.grad_rate < filters.minGradRate) return false;
    if (filters.maxDebt && college.median_debt > filters.maxDebt) return false;
    if (filters.statePreference && college.state !== filters.statePreference) {
      // Allow if state preference is "Any"
      if (filters.statePreference !== 'Any') return false;
    }
    if (filters.demographic && college.demographic_type !== filters.demographic) {
      if (filters.demographic !== 'Any') return false;
    }

    return true;
  });

  // Calculate match scores
  results = results.map(college => ({
    ...college,
    matchScore: calculateMatchScore(college, filters, weights)
  }));

  // Sort results
  results.sort((a, b) => {
    switch (sortBy) {
      case 'matchScore':
        return b.matchScore - a.matchScore;
      case 'lowestCost':
        return a.net_price - b.net_price;
      case 'highestGradRate':
        return b.grad_rate - a.grad_rate;
      case 'highestEarnings':
        return (b.median_earnings || 0) - (a.median_earnings || 0);
      default:
        return b.matchScore - a.matchScore;
    }
  });

  res.json({
    total: results.length,
    colleges: results,
    topThree: results.slice(0, 3)
  });
});

// Get all colleges (for initial load/testing)
app.get('/api/colleges', (req, res) => {
  res.json(collegeData);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
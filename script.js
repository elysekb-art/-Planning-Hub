// Your published master spreadsheet web stream address
const baseSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQUnZ0VuktIcWuFqft3846yVp9XEywo3Rs3fTZUBx5TRgmvYIIqFa6TqhD1jmlCMWr9Q0uPyxaM7NJ8/pub?output=csv&gid=';

const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');
const dashboardGrid = document.getElementById('dashboard-grid');
const altView = document.getElementById('alternative-view');

// Active tracking tab state
let currentGid = '1742096038'; 

async function fetchPlannerData(gid) {
  try {
    const response = await fetch(`${baseSpreadsheetUrl}${gid}`);
    if (!response.ok) throw new Error('Data fetch stream failure');
    const text = await response.text();
    const rows = text.split('\n').map(row => row.split(','));
    
    if (dashboardGrid.style.display !== 'none') {
      renderDashboardGrid(rows);
    } else {
      renderListView(rows);
    }
  } catch (error) {
    console.error("Workbook connection error:", error);
    altView.innerHTML = `<div style="padding:20px; color:red;">Workbook connection error. Ensure your sheet is "Published to Web".</div>`;
  }
}

function renderDashboardGrid(rows) {
  const cards = document.querySelectorAll('.card-body');
  if(rows.length > 0) {
    for (let i = 0; i < 5; i++) {
      const colIndex = i + 1; 
      cards[i].innerHTML = `
        <span class="date-tag">${rows[10]?.[colIndex] || ''}</span><br><br>
        <div class="lesson-block"><strong>Upper El:</strong> ${rows[11]?.[colIndex] || '—'}</div>
        <div class="lesson-block"><strong>Lower El:</strong> ${rows[12]?.[colIndex] || '—'}</div>
        <div class="lesson-block"><strong>Early Child:</strong> ${rows[13]?.[colIndex] || '—'}</div>
        <div class="lesson-block"><strong>Middle Sch:</strong> ${rows[14]?.[colIndex] || '—'}</div>
        <div class="lesson-block"><strong>K-3:</strong> ${rows[15]?.[colIndex] || '—'}</div>
        <div class="lesson-block"><strong>4-6:</strong> ${rows[16]?.[colIndex] || '—'}</div>
      `;
    }
  }
}

function renderListView(rows) {
  let htmlOutput = `<div class="data-sheet-card"><table>`;
  rows.slice(0, 50).forEach(row => {
    const cleanCells = row.map(cell => cell.replace(/^"|"$/g, '').trim());
    if (cleanCells.some(cell => cell !== '')) {
      htmlOutput += `<tr>${cleanCells.map(cell => `<td>${cell || '—'}</td>`).join('')}</tr>`;
    }
  });
  htmlOutput += `</table></div>`;
  altView.innerHTML = htmlOutput;
}

navItems.forEach(item => {
  item.addEventListener('click', () => {
    document.querySelector('.nav-item.active').classList.remove('active');
    item.classList.add('active');
    
    const tabType = item.getAttribute('data-tab');
    pageTitle.textContent = item.textContent.trim();
    
    if (tabType === 'dashboard') {
      dashboardGrid.style.display = 'grid';
      altView.style.display = 'none';
      currentGid = '1742096038'; // Dashboard tab
      fetchPlannerData(currentGid);
    } else {
      dashboardGrid.style.display = 'none';
      altView.style.display = 'block';
      altView.innerHTML = '<div style="padding:20px; color:#666;">Loading spreadsheet workbook data...</div>';
      
      // Match each navigation button directly to its exact workbook tab number
      if (tabType === 'warmups') currentGid = '583952045';      // Daily Warmups GID
      if (tabType === 'monthly') currentGid = '112001550';      // Monthly View GID
      if (tabType === 'curriculum') currentGid = '2093554746';   // Curriculum Map GID
      if (tabType === 'rosters') currentGid = '1457850558';      // Roster GID
      
      fetchPlannerData(currentGid);
    }
  });
});

// Primary setup call
fetchPlannerData(currentGid);

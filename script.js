// AUTH SYSTEM
window.onload = () => {
  const user = localStorage.getItem("fanzoraUser");
  if (user) {
    showApp();
  }

  document.getElementById("auth-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const birthdate = new Date(document.getElementById("birthdate").value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    const dayDiff = today.getDate() - birthdate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 18) {
      document.getElementById("auth-message").innerText = "You must be at least 18 years old to use Fanzora.";
      return;
    }

    localStorage.setItem("fanzoraUser", username);
    showApp();
  });
};

function showApp() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("main-app").style.display = "block";
}

function logout() {
  localStorage.removeItem("fanzoraUser");
  location.reload();
}

// LOAD LIVE SCORES WITH FANTASY POINTS AND ERROR HANDLING
async function loadLiveScores() {
  const container = document.getElementById("scores-container");
  container.innerHTML = "<p>Loading live matches and fantasy points...</p>";

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'db2d688e15mshc5c4628851de414p19f157jsnbbdea597f1b8',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };

  try {
    const res = await fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all', options);
    const data = await res.json();

    if (!data.response || data.response.length === 0) {
      container.innerHTML = "<p>No live matches right now.</p>";
      return;
    }

    container.innerHTML = '';

    for (const match of data.response) {
      let homePoints = 0;
      let awayPoints = 0;

      try {
        const statsRes = await fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures/players?fixture=${match.fixture.id}`, options);
        const statsData = await statsRes.json();

        if (statsData.response && statsData.response.length > 0) {
          statsData.response.forEach(player => {
            player.statistics.forEach(stat => {
              const goals = stat.goals.total || 0;
              const assists = stat.goals.assists || 0;
              const yellow = stat.cards.yellow || 0;

              const points = (goals * 5) + (assists * 3) - (yellow * 1);

              if (player.team.id === match.teams.home.id) homePoints += points;
              else if (player.team.id === match.teams.away.id) awayPoints += points;
            });
          });
        }
      } catch (e) {
        console.warn(`No player stats for fixture ${match.fixture.id}`, e);
        // Default points to 0 if error
        homePoints = 0;
        awayPoints = 0;
      }

      const card = document.createElement("div");
      card.className = "score-card";
      card.innerHTML = `
        <strong>${match.teams.home.name}</strong> ${match.goals.home} - ${match.goals.away} <strong>${match.teams.away.name}</strong><br>
        <small>${match.league.name} – ${match.fixture.status.short}</small><br>
        <em>Fantasy Points: ${homePoints.toFixed(1)} - ${awayPoints.toFixed(1)}</em>
      `;
      container.appendChild(card);
    }
  } catch (err) {
    container.innerHTML = `<p>Error loading scores. Try again later.</p>`;
    console.error(err);
  }
}




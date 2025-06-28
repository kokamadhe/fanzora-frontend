async function loadLiveScores() {
  const container = document.getElementById("scores-container");
  container.innerHTML = "<p>Loading live matches...</p>";

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
    data.response.forEach(match => {
      const card = document.createElement("div");
      card.className = "score-card";
      card.innerHTML = `
        <strong>${match.teams.home.name}</strong> ${match.goals.home} - ${match.goals.away} <strong>${match.teams.away.name}</strong><br>
        <small>${match.league.name} – ${match.fixture.status.short}</small>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    container.innerHTML = `<p>Error loading scores. Try again later.</p>`;
    console.error(err);
  }
}

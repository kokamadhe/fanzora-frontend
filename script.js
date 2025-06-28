async function loadLiveScores() {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'db2d688e15mshc5c4628851de414p19f157jsnbbdea597f1b8',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };

  const res = await fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all', options);
  const data = await res.json();

  let text = '';
  data.response.forEach(match => {
    text += `${match.teams.home.name} ${match.goals.home} - ${match.goals.away} ${match.teams.away.name} (${match.league.name})\n`;
  });

  document.getElementById('output').textContent = text || 'No live matches right now.';
}

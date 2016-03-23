// Calculate scores
function getDKScore(game) {
  var score = 0;
  var mod = {};
  var bs = {};
  var totals = {};

  // Set point modifiers
  mod = {
    pts: 1,
    tpm: .5,
    reb: 1.25,
    ast: 1.5,
    stl: 2.0,
    blk: 2.0,
    to: -0.5,
    dd: 1.5,
    td: 3
  }

  // Get actual values
  bs = {
    pts: game[24],
    tpm: game[10],
    reb: game[18],
    ast: game[19],
    stl: game[20],
    blk: game[21],
    to: game[22],
    dd: 0,
    td: 0
  }

  // Check for dd & td
  // Number of double digit stats
  var dd_stats = 0;
  for(var key in bs) {
    // Only consider PTS, AST, REB, BLK, STLS
    if(key == 'tpm' || key == 'to' || key == 'dd' || key == 'td') {
      continue;
    } else if(bs[key] >= 10) {
      dd_stats += 1;
    }
  }

  // Assign proper values
  if (dd_stats >= 3) {
    bs.dd = 1;
    bs.td = 1;
  } else if(dd_stats >=2) {
    bs.dd = 1;
  }

  for(var key in mod) {
    score += (mod[key] * bs[key]);
  }
  return score;
}

// Calculate FanDuel Score
function getFDScore(game) {
  var score = 0;
  var mod = {};
  var bs = {};
  var totals = {};

  // Set point modifiers
  mod = {
    pts: 1,
    reb: 1.2,
    ast: 1.5,
    stl: 2,
    blk: 2,
    to: -1,
  }

  // Get actual values
  bs = {
    pts: game[24],
    reb: game[18],
    ast: game[19],
    stl: game[20],
    blk: game[21],
    to: game[22],
  }

  for(var key in mod) {
    score += (mod[key] * bs[key]);
  }

  // Check for rounding
  if(Math.round(score) !== score) {
    score = Math.round(score * 10) / 10;
  }
  return score;
}
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = function(callback) {
  request(`https://api.freegeoip.app/json/?apikey=5200a000-a670-11ec-b719-e711442508bd`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    }
    const { ip } = JSON.parse(body);
    callback(null, ip);
  });
};

// const endPoint = `https://ipvigilante.com/${ip}`;

const fetchCoordsByIP = function(ip, callback) {
  request(`https://api.freegeoip.app/json/${ip}?apikey=5200a000-a670-11ec-b719-e711442508bd`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    }
    const {latitude, longitude} = JSON.parse(body);
    return callback(null, {latitude, longitude});
  })
}

const fetchISSFlyOverTimes = function(coords, callback) {
  const myUrl ='https://iss-pass.herokuapp.com/json/?lat=49.2489&lon=-122.7954'
  
  request(myUrl, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    };
    const passes = JSON.parse(body).response
    callback(null, passes);
  });
}

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(data, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};
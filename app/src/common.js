function isOK(code) {
  if(code == 0) {
    return true;
  } else if(code == 1) {
    return false;
  }
  return false;
}
function GET(url, param) {
  let cb;
  if(typeof param == "function") cb = param;
  fetch(url + ".json", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (!response.ok) { 
      return Promise.reject(response.statusText);
    }
    return response.json();
  }).then(rs => {
    cb && cb(rs);
  });
}
function POST(url, param) {
  

}
export {
  GET,
  POST,
  isOK
};
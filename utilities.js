//Function for showing request path and time  in the console when a request to a path is made
function pathMiddleware(req, res, next) {
  const path = req.path;
  let method = req.method;
  let date = new Date();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let time = hour + ":" + (minutes < 10 ? "0" + minutes : minutes);
  if (path == "/favicon.ico") return next();
  console.log({ path, method, time });
  next();
}

//Filters text for preventing injections
function textWash(text) {
  let filter = ["<", ">", "/", "|", "?", "#", "~", "*"];
  text = text.split("");
  let newText = text.filter((ele) => (filter.includes(ele) ? "" : ele));
  return newText.join("");
}

//takes an object and an array.
//removes the keys from the object that is present int the array
//returns filtered object --> used to remove extra attributes from request object.
function filterObj(obj, arr) {
  let filteredObj = {};
  for (let key in obj) {
    if (arr.includes(key)) continue;
    filteredObj[key] = obj[key];
  }
  return filteredObj;
}

function ReturnMessage(error = false, message, result = {}) {
  return { error, message, result };
}

module.exports = { pathMiddleware, textWash, filterObj, ReturnMessage };

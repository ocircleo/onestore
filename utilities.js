//Function for showing request path and time  in the console when a request to a path is made
function pathMiddleware(req, res, next) {
  const path = req.path;
  let method = req.method;
  let date = new Date();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let sec = date.getSeconds();
  let time = hour + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + sec;
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
function textWashRegex(text) {
  let filter = ["<", ">", "/", "|", "?", "#", "~", "*", `"`, `'`];
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
function GenerateDataUrl(brand, model) {
  brand = brand.trim();
  model = model.trim();
  return brand.replace(/ /g, "-") + "-" + model.replace(/ /g, "-");
}
function queryOrganizer(queryParams) {
  let queryArrayFilter = [
    "inStock",
    "min",
    "max",
    "processor",
    "ram",
    "storage",
    "graphics",
    "page",
    "sort",
    "brand",
    "text",
  ];
  let storage = {
    128: 128,
    256: 256,
    512: 512,
    1: 1024,
    2: 2048,
    3: 3072,
  };
  let gpu = {};
  let filteredQuery = {};
  let queryArray = Object.keys(queryParams);
  //filters for unknown parameter passed in the query parameter
  queryArray.forEach((ele) => {
    if (queryArrayFilter.includes(ele)) filteredQuery[ele] = queryParams[ele];
  });
  //the final query object
  let finalQuery = {};
  //transforms query parameter to specified format ex: Array or number also filter the text from some symbols like: <, |, ~
  for (let item in filteredQuery) {
    switch (item) {
      case "inStock":
        if (filteredQuery[item].length == 0) continue;
        finalQuery.inStock = filteredQuery[item] == "true" ? true : false;
        break;
      case "min":
        finalQuery.min = Number(filteredQuery[item])
          ? Number(filteredQuery[item])
          : 0;
        break;
      case "max":
        finalQuery.max = Number(filteredQuery[item])
          ? Number(filteredQuery[item])
          : 1000000;
        break;
      case "processor":
        if (filteredQuery[item].length == 0) continue;
        finalQuery.processor = filteredQuery[item].split(",");
        break;
      case "ram":
        if (filteredQuery[item].length == 0) continue;
        let ram = filteredQuery[item].split(",");
        finalQuery.ram = ram.map((ele) => Number(ele));
        break;
      case "storage":
        if (filteredQuery[item].length == 0) continue;
        let arr = filteredQuery[item].split(",");
        let temArray = [];
        for (let i = 0; i < arr.length; i++) {
          if (storage[arr[i]]) temArray.push(storage[arr[i]]);
        }
        finalQuery.storage = temArray;
        break;
      case "graphics":
        if (filteredQuery[item].length == 0) continue;
        finalQuery.graphics = filteredQuery[item].split(",");
        break;
      case "brand":
        if (filteredQuery[item].length == 0) continue;
        finalQuery.brand = filteredQuery[item];
        break;
      case "text":
        if (filteredQuery[item].length == 0) continue;
        finalQuery.text = textWash(filteredQuery[item]);
        break;
      case "sort":
        if (!Number(filteredQuery[item])) finalQuery.sort = 1;
        else if (Number(filteredQuery[item]) > 0) finalQuery.sort = 1;
        else finalQuery.sort = -1;
        break;
      case "page":
        if (!Number(filteredQuery[item])) finalQuery.page = 0;
        else
          finalQuery.page = Math.abs(Math.trunc(Number(filteredQuery[item])));
        break;
    }
  }
  return finalQuery;
}

module.exports = {
  pathMiddleware,
  textWash,
  textWashRegex,
  filterObj,
  ReturnMessage,
  GenerateDataUrl,
  queryOrganizer,
};

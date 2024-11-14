// let oj = {};
// oj["hello.name"] = "salman";
// console.log(oj["salman"]);

function imgIndexGenerator(index, arr) {
  index = Number(index);
  let y;
  if (arr[index]) y = 0;
  else y = arr.length;
  console.log(y);
  return y;
}

let newArray = [1, 3, 4];
imgIndexGenerator(2, newArray);
imgIndexGenerator(12, newArray);
imgIndexGenerator(17, newArray);
imgIndexGenerator(-1, newArray);

interface String {
  toCapitalize(): String;
}

String.prototype.toCapitalize = function () {
  var myString: string = String(this);
  myString = myString
    .toLowerCase()
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
  return myString;
};

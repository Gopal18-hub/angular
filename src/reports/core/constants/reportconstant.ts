export namespace Reportconstants {
  var d = new Date();
  //d.setMonth(d.getMonth() - 3)
  export const minimumDate = {
    oneMonth: new Date(d.setMonth(d.getMonth() - 1)),
  };
}

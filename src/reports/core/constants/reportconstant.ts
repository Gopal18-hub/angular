export namespace Reportconstants {
  export const minimumDate = {
    oneMonth: new Date(Date.now()).setMonth(
      new Date(Date.now()).getMonth() - 1
    ),
  };
}

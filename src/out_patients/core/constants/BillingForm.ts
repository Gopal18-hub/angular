export namespace BillingForm {
  // Payment Methods Form Data
  export const refundFormData = {
    title: "",
    type: "object",
    properties: {
      amount: {
        type: "number",
      },
      chequeno: {
        type: "number",
      },
      chequeissuedate: {
        type: "date",
        maximum: new Date(),
      },
      chequebankname: {
        type: "autocomplete",
      },
      chequebranchname: {
        type: "string",
      },
      chequeamount: {
        type: "number",
      },
      chequeauth: {
        type: "string",
      },
      creditcardno: {
        type: "number",
      },
      creditholdername: {
        type: "string",
      },
      creditbankno: {
        type: "number",
      },
      creditbatchno: {
        type: "string",
      },
      creditamount: {
        type: "number",
      },
      creditapproval: {
        type: "number",
      },
      creditterminal: {
        type: "string",
      },
      creditacquiring: {
        type: "string",
      },
      demandddno: {
        type: "string",
      },
      demandissuedate: {
        type: "date",
        maximum: new Date(),
      },
      demandbankname: {
        type: "autocomplete",
      },
      demandbranch: {
        type: "string",
      },
      demandamount: {
        type: "number",
      },
      demandauth: {
        type: "string",
      },
      mobilesendermobile: {
        type: "number",
      },
      mobilesendermmid: {
        type: "number",
      },
      mobilesendername: {
        type: "string",
      },
      mobilebankname: {
        type: "string",
      },
      mobilebranchname: {
        type: "string",
      },
      mobilebeneficary: {
        type: "number",
      },
      mobiletransactionamt: {
        type: "number",
      },
      mobiletransactionref: {
        type: "string",
      },
      onlinetransacid: {
        type: "string",
      },
      onlinebookingid: {
        type: "string",
      },
      onlinecardvalidate: {
        type: "radio",
        required: false,
        options: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" },
        ],
      },
      onlinecontactno: {
        type: "number",
      },
      onlineamount: {
        type: "number",
      },
      paytmamount: {
        type: "number",
      },
      paytmwallet: {
        type: "string",
      },
      paytmsendermobile: {
        type: "number",
      },
      paytmsenername: {
        type: "string",
      },
      paytmotp: {
        type: "number",
      },
      paytmtransacref: {
        type: "string",
      },
      paytmorderid: {
        type: "string",
      },
      upicardno: {
        type: "number",
      },
      upitransactionid: {
        type: "string",
      },
      upibankname: {
        type: "string",
      },
      upiamount: {
        type: "number",
      },
      upibatchno: {
        type: "string",
      },
      upiapproval: {
        type: "string",
      },
      upiterminal: {
        type: "string",
      },
      upiacquiring: {
        type: "string",
      },
      internetmobile: {
        type: "number",
      },
      internetemail: {
        type: "string",
      },
      internetamount: {
        type: "number",
      },
      dueamount: {
        type: "string",
      },
      dueamountauthorisedby: {
        type: "string",
      },
      dueamountduebillremarks: {
        type: "textarea",
      },
      chequevaliditydate: {
        type: "date",
        maximum: new Date(),
      },
      demandvaliditydate: {
        type: "date",
        maximum: new Date(),
      },
      mobilewallet: {
        type: "dropdown",
      },
      mobileotp: {
        type: "string",
      },
      mobileorderid: {
        type: "string",
      },
    },
  };

  // Form 60 Form Data
  export const form60FormData = {
    title: "",
    type: "object",
    properties: {
      aadharno: {
        type: "number",
      },
      appliedforpan: {
        type: "checkbox",
        options: [
          {
            title: "",
          },
        ],
      },
      dateofapplication: {
        type: "date",
        maximum: new Date(),
      },
      applicationno: {
        type: "number",
      },
      agriculturalincome: {
        type: "string",
      },
      otherthanagriculturalincome: {
        type: "string",
      },
      iddocumenttype: {
        type: "autocomplete",
      },
      iddocidentityno: {
        type: "number",
      },
      idnameofauthority: {
        type: "string",
      },
      tickforsamedoc: {
        type: "checkbox",
        options: [
          {
            title: "",
          },
        ],
      },
      addressdocumenttype: {
        type: "autocomplete",
      },
      addressdocidentityno: {
        type: "number",
      },
      addressnameofauthority: {
        type: "string",
      },
      remarks: {
        type: "string",
      },
    },
  };
}

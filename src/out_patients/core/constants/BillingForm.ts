export namespace BillingForm {

    // Payment Methods Form Data
    export const refundFormData = {
        title: "",
        type: "object",
        properties: {
          cashamount: {
             type: "number",
             defaultValue: "0.00",
           },
          chequeno: {
            type: "number"
          },
          chequeissuedate: {
            type: "date",
            maximum: new Date(),
          },
          chequebankname: {
            type: "string"
          },
          chequebranchname: {
            type: "string"
          },
          chequeamount: {
            type: "number",
            defaultValue: "0.00"
          },
          chequeauth: {
            type: "string"
          },
          creditcardno: {
            type: "number"
          },
          creditholdername: {
            type: "string"
          },
          creditbankno:{
            type: "number"
          },
          creditbatchno:{
            type: "string"
          },
          creditamount: {
            type: "number",
            defaultValue: "0.00"
          },
          creditapproval: {
            type: "number"
          },
          creditterminal: {
            type: "string"
          },
          creditacquiring: {
            type: "string"
          },
          demandddno: {
            type: "string"
          },
          demandissuedate: {
            type: "date",
            maximum: new Date(),
          },
          demandbankname: {
            type: "autocomplete"
          },
          demandbranchname: {
            type: "string"
          },
          demandamount: {
            type: "number",
            defaultValue: "0.00"
          },
          demandauth: {
            type: "string"
          },
          mobilesendermobile: {
            type: "number"
          },
          mobilesendermmid: {
            type: "number"
          },
          mobilesendername: {
            type: "string"
          },
          mobilebankname: {
            type: "string"
          },
          mobilebranchname: {
            type: "string"
          },
          mobilebeneficary: {
            type: "number"
          },
          mobiletransactionamt: {
            type: "number"
          },
          mobiletransactionref: {
            type: "string"
          },
          onlinetransacid: {
            type: "string"
          },
          onlinebookingid: {
            type: "string"
          },
          onlinecardvalidate: {
            type: "radio",
            required: false,
            options: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" }
            ]
          },
          onlinecontactno: {
            type: "number"
          },
          onlineamount: {
            type: "number",
            defaultValue: "0.00"
          },
          paytmamount: {
            type: "number",
            defaultValue: "0.00"
          },
          paytmwallet: {
            type: "string"
          },
          paytmsendermobile: {
            type: "number"
          },
          paytmsenername: {
            type: "string"
          },
          paytmotp: {
            type: "number"
          },
          paytmtransacref: {
            type: "string"
          },
          paytmorderid: {
            type: "string"
          },
          upicardno: {
            type: "number"
          },
          upitransactionid: {
            type: "string"
          },
          upibankname: {
            type: "string"
          },
          upiamount : {
            type: "number",
            defaultValue: "0.00"
          },
          upibatchno: {
            type: "string"
          },
          upiapproval: {
            type: "string"
          },
          upiterminal: {
            type: "string"
          },
          upiacquiring: {
            type: "string"
          },
          internetmobile: {
              type: "number"
          },
          internetemail: {
              type: "string"
          },
          internetamount: {
              type: "number",
              defaultValue: "0.00"
          },
	        dueamount: {
              type: "string",
              defaultValue: "0.00"
          },
          dueamountauthorisedby: {
              type: "string"
          },
          dueamountduebillremarks: {
              type: "textarea"
          },
          chequevaliditydate:{
            type: "date",
            maximum: new Date(),
          },
          demandvaliditydate:{
            type: "date",
            maximum: new Date(),
          },
          mobilewallet:{
            type: "dropdown"
          },
          mobileotp:{
            type: "string"
          },
          mobileorderid:{
            type: "string"
          }
        },
    };
    
    // Form 60 Form Data
    export const form60FormData = {
        title: "",
        type: "object",
        properties: {
          aadharno: {
            type: "number",
           // pattern: "^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"
          },
          appliedforpan: {
            type: "checkbox",
            options: [{
              title: ''
            }]
          },
          dateofapplication: {
            type: "date",
            maximum: new Date(),
          },
          applicationno: {
            type: "number"
          },
          agriculturalincome: {
            type: "string"
          },
          otherthanagriculturalincome: {
            type: "string"
          },
          iddocumenttype: {
            type: "dropdown"
          },
          iddocidentityno: {
            type: "string"
          },
          idnameofauthority: {
            type: "string"
          },
          tickforsamedoc: {
            type: "checkbox",
            options: [{
              title: ''
            }]
          },
          addressdocumenttype: {
            type: "dropdown"
          },
          addressdocidentityno: {
            type: "string"
          },
          addressnameofauthority: {
            type: "string"
          },
          remarks: {
            type: "string"
          }
        },
    };
      //service deposit form data
  export const servicedepositFormData = {
    type: "object",

    title: "",

    properties: {
      servicetype: {
        type: "autocomplete",
      },

      deposithead: {
        type: "autocomplete",
      },
    },
  };
}
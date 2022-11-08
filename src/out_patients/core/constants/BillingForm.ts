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
            defaultValue: new Date(),
          },
          chequebankname: {
            type: "autocomplete",
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
          creditbankname: {
            type: "autocomplete",
          },
          creditbatchno:{
            type: "string"
          }, //10
          creditamount: {
            type: "number",
            defaultValue: "0.00"
          },
          creditapproval: {
            type: "string"
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
            defaultValue: new Date(),
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
          }, //20
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
          }, //30
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
          }, ///40
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
              type: "tel",
          },
          internetemail: {
              type: "string"
          }, //50
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
            defaultValue: new Date(),
            minimum: new Date()
          },
          demandvaliditydate:{
            type: "date",
            defaultValue: new Date(),
            minimum: new Date()
          },
          mobilewallet:{
            type: "dropdown",
          },
          mobileotp:{
            type: "string",
          },
          mobileorderid:{
            type: "string",
          }, //60
          posimei:{
            type: "string",
          },
          creditcardtransactionid:{
            type: "string",
          },
          internetremarks: {
            type: "textarea"
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
            type: "dropdown",
            placeholder: "<--Select-->",
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
            type: "dropdown",
            placeholder: "<--Select-->",
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
        type: "dropdown",
      },

      deposithead: {
        type: "dropdown",
       emptySelect: true,
       placeholder: "Select Advance Type",
      },
    },
  };
}
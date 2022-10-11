export namespace PaymentMethods {
  export const methods: any = {
    cash: {
      label: "Cash",
      form: "cashForm",
    },
    cheque: {
      label: "Cheque",
      form: "chequeForm",
    },
    credit: { label: "Credit Card", form: "creditForm" },
    demand: { label: "Demand Draft", form: "demandDraftForm" },
    mobilepayment: { label: "Mobile Payment", form: "mobilePaymentForm" },
    onlinepayment: { label: "Online Payment", form: "onlinePaymentForm" },
    upi: { label: "UPI", form: "upiForm" },
  };

  export const cashForm = {
    title: "Cash Details",
    type: "object",
    properties: {
      price: {
        type: "number",
        defaultValue: "0.00",
        label: "Amount",
      },
    },
  };

  export const chequeForm = {
    title: "Cheque Details",
    type: "object",
    properties: {
      price: {
        type: "number",
        defaultValue: "0.00",
        label: "Amount",
      },
      chequeno: {
        type: "number",
        label: "Cheque No",
      },
      chequeissuedate: {
        type: "date",
        maximum: new Date(),
        label: "Issue Date",
      },
      chequebankname: {
        type: "string",
        label: "Bank Name",
      },
      chequebranchname: {
        type: "string",
        label: "Branch Name",
      },

      chequeauth: {
        type: "string",
        label: "Authorised By",
      },
    },
  };

  export const creditForm = {
    title: "Credit Card Details",
    type: "object",
    properties: {
      price: {
        type: "number",
        defaultValue: "0.00",
        label: "Amount",
      },
      creditcardno: {
        type: "number",
        label: "Card No.",
      },
      creditholdername: {
        type: "string",
        label: "Card Holder Name",
      },
      creditbankno: {
        type: "number",
        label: "Bank Name",
      },
      creditbatchno: {
        type: "string",
        label: "Batch No.",
      }, //10

      creditapproval: {
        type: "number",
        label: "Approval Code",
      },
      creditterminal: {
        type: "string",
        label: "Terminal ID",
      },
      creditacquiring: {
        type: "string",
        label: "Acquiring Bank",
      },
    },
  };

  export const demandDraftForm = {
    title: "Demand Draft Details",
    type: "object",
    properties: {
      price: {
        type: "number",
        defaultValue: "0.00",
        label: "Amount",
      },
      demandddno: {
        type: "string",
        label: "DD No.",
      },
      demandissuedate: {
        type: "date",
        maximum: new Date(),
        label: "Issue Date",
      },
      demandbankname: {
        type: "autocomplete",
        label: "Bank Name",
      },
      demandbranchname: {
        type: "string",
        label: "Branch Name",
      },

      demandauth: {
        type: "string",
        label: "Authorised By",
      }, //20
    },
  };

  export const mobilePaymentForm = {
    title: "Mobile Payment Details",
    type: "object",
    properties: {
      mobilesendermobile: {
        type: "number",
        label: "Sender Mobile",
      },
      mobilesendermmid: {
        type: "number",
        label: "Sender MMID No.",
      },
      mobilesendername: {
        type: "string",
        label: "Sender Name",
      },
      mobilebankname: {
        type: "string",
        label: "Bank Name",
      },
      mobilebranchname: {
        type: "string",
        label: "Branch Name",
      },
      mobilebeneficary: {
        type: "number",
        label: "Beneficiary Mob No.",
      },
      mobiletransactionamt: {
        type: "number",
        label: "Transaction Amount",
      },
      mobiletransactionref: {
        type: "string",
        label: "Transaction Reference",
      },
    },
  };

  export const onlinePaymentForm = {
    title: "Online Payment Details",
    type: "object",
    properties: {
      price: {
        type: "number",
        defaultValue: "0.00",
        label: "Amount",
      },
      onlinetransacid: {
        type: "string",
        label: "Transaction ID",
      },
      onlinebookingid: {
        type: "string",
        label: "Booking ID",
      }, //30
      onlinecardvalidate: {
        type: "radio",
        required: false,
        options: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" },
        ],
        label: "Card Validate",
      },
      onlinecontactno: {
        type: "number",
        label: "Contact No.",
      },
    },
  };

  export const paytmForm = {
    title: "",
    type: "object",
    properties: {
      price: {
        type: "number",
        defaultValue: "0.00",
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
      }, ///40
    },
  };

  export const upiForm = {
    title: "UPI Payment Details",
    type: "object",
    properties: {
      price: {
        type: "number",
        defaultValue: "0.00",
        label: "Amount",
      },
      upicardno: {
        type: "number",
        label: "Card No.",
      },
      upitransactionid: {
        type: "string",
        label: "Transaction ID",
      },
      upibankname: {
        type: "string",
        label: "Bank Name",
      },

      upibatchno: {
        type: "string",
        label: "Batch No.",
      },
      upiapproval: {
        type: "string",
        label: "Approval Code",
      },
      upiterminal: {
        type: "string",
        label: "Terminal ID",
      },
      upiacquiring: {
        type: "string",
        label: "Acquiring Bank",
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
        type: "dropdown",
        placeholder: "<--Select-->",
      },
      iddocidentityno: {
        type: "string",
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
        type: "dropdown",
        placeholder: "<--Select-->",
      },
      addressdocidentityno: {
        type: "string",
      },
      addressnameofauthority: {
        type: "string",
      },
      remarks: {
        type: "string",
      },
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

export namespace PaymentMethods {
  export const wallets: any = ["PayTM"];
  export const methods: any = {
    cash: {
      label: "Cash",
      form: "cashForm",
    },
    cheque: {
      label: "Cheque",
      form: "chequeForm",
      payloadKey: "tab_cheque",
    },
    credit: {
      label: "Credit / Debit Card",
      form: "creditForm",
      payloadKey: "tab_credit",
    },
    debit: { label: "Debit Card", form: "debitForm", payloadKey: "tab_debit" },
    demand: {
      label: "Demand Draft",
      form: "demandDraftForm",
      payloadKey: "tab_dd",
    },
    mobilepayment: {
      label: "Mobile Payment",
      form: "paytmForm",
      payloadKey: "tab_Mobile",
    },
    onlinepayment: {
      label: "Online Payment",
      form: "onlinePaymentForm",
      payloadKey: "tab_Online",
    },
    upi: { label: "UPI", form: "upiForm", payloadKey: "tab_UPI" },
  };

  export const tab_cheque = (values: any) => {
    return {
      chequeNo: values.chequeNo,
      chequeDate: values.chequeDate,
      bankName: values.bankName.title,
      branchName: values.branchName,
      city: "",
      flag: 1,
    };
  };

  export const tab_dd = (values: any) => {
    return {
      ddNumber: values.ddNumber,
      ddDate: values.ddDate,
      bankName: values.bankName.title,
      branchName: values.branchName,
      flag: 1,
    };
  };

  export const tab_credit = (values: any) => {
    return {
      posimei: values.posimei,
      transactionid: values.transactionid,
      ccNumber: values.ccNumber,
      creditholdername: values.creditholdername,
      cCvalidity: values.cCvalidity,
      bankName: values.bankName.title,
      approvalno: values.approvalno,
      approvalcode: values.approvalcode,
      terminalID: values.terminalID,
      acquirer: values.acquirer,
      banktid: values.banktid,
    };
  };

  export const tab_debit = (values: any) => {
    return {
      posimei: values.posimei,
      transactionid: values.transactionid,
      ccNumber: values.ccNumber,
      creditholdername: values.creditholdername,
      cCvalidity: values.cCvalidity,
      bankName: values.bankName.title,
      creditbatchno: values.creditbatchno,
      creditapproval: values.creditapproval,
      creditterminal: values.creditterminal,
      creditacquiring: values.creditacquiring,
      banktid: values.banktid,
    };
  };

  export const tab_Mobile = (values: any) => {
    return {
      // mobileNo: values.mobileNo,
      // mmid: values.mmid,
      // senderName: values.senderName,
      // bankName: values.bankName,
      // branchName: values.branchName,
      // beneficiaryMobile: values.beneficiaryMobile,
      // transactionRef: values.transactionRef,

      mobileNo: values.mobileNo,
      mmid: values.paytmorderid,
      senderName: "",
      bankName: wallets[0],
      branchName: "",
      beneficiaryMobile: values.paytmotp,
      transactionRef: values.paytmtransacref,
    };
  };

  export const tab_Online = (values: any) => {
    return {
      transactionId: values.transactionId,
      bookingId: values.bookingId,
      cardValidation: values.cardValidation,
      onlineContact: values.onlineContact,
    };
  };

  export const tab_UPI = (values: any) => {
    return {
      ccNumber_UPI: values.ccNumber_UPI,
      cCvalidity_UPI: values.cCvalidity_UPI,
      approvalno_UPI: values.approvalno_UPI,
      bankname_UPI: values.bankname_UPI,
      flagman_UPI: values.flagman_UPI,
      approvalcode_UPI: values.approvalcode_UPI,
      terminalID_UPI: values.terminalID_UPI,
      acquirer_UPI: values.acquirer_UPI,
      cardholdername_UPI: values.cardholdername_UPI,
    };
  };

  export const cashForm = (options: any) => {
    return {
      title: "Cash Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Cash",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
          require: true,
        },
      },
    };
  };

  export const chequeForm = (options: any) => {
    return {
      title: "Cheque Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Cheque",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
          require: true,
        },
        chequeNo: {
          type: "number",
          label: "Cheque No",
          require: true,
        },
        chequeDate: {
          type: "date",
          maximum: new Date(),
          label: "Issue Date",
          require: true,
        },
        bankName: {
          type: "autocomplete",
          label: "Bank Name",
          options: options.bankList,
          require: true,
        },
        branchName: {
          type: "string",
          label: "Branch Name",
          require: true,
        },
        chequeauth: {
          type: "string",
          label: "Authorised By",
          require: true,
        },
      },
    };
  };

  export const creditForm = (options: any) => {
    return {
      title: "Credit Card Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Credit Card",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
          require: true,
        },
        posimei: {
          type: "dropdown",
          label: "POS IMEI",
          require: true,
        },
        transactionid: {
          type: "string",
          label: "Transaction ID",
          require: true,
        },
        ccNumber: {
          type: "number",
          label: "Card No.",
          require: true,
        },
        creditholdername: {
          type: "string",
          label: "Card Holder Name",
          require: true,
        },
        cCvalidity: {
          type: "date",
          label: "Validity",
          require: true,
        },
        bankName: {
          type: "autocomplete",
          label: "Bank Name",
          options: options.bankList,
          require: true,
        },
        approvalno: {
          type: "string",
          label: "Batch No.",
          require: true,
        }, //10

        approvalcode: {
          type: "number",
          label: "Approval Code",
          require: true,
        },
        terminalID: {
          type: "string",
          label: "Terminal ID",
          require: true,
        },
        acquirer: {
          type: "string",
          label: "Acquiring Bank",
          require: true,
        },
        banktid: {
          type: "string",
          label: "Bank TID",
          require: true,
        },
      },
      actionItems: [
        {
          label: "Manual",
          type: "",
        },
        {
          label: "Get Approval",
        },
        {
          label: "Retry",
          type: "",
        },
      ],
    };
  };

  export const debitForm = (options: any) => {
    return {
      title: "Debit Card Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Debit Card",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
          require: true,
        },
        posimei: {
          type: "dropdown",
          label: "POS IMEI",
          require: true,
        },
        transactionid: {
          type: "string",
          label: "Transaction ID",
          require: true,
        },
        ccNumber: {
          type: "number",
          label: "Card No.",
          require: true,
        },
        creditholdername: {
          type: "string",
          label: "Card Holder Name",
          require: true,
        },
        cCvalidity: {
          type: "date",
          label: "Validity",
          require: true,
        },
        bankName: {
          type: "autocomplete",
          label: "Bank Name",
          options: options.bankList,
          require: true,
        },
        creditbatchno: {
          type: "string",
          label: "Batch No.",
          require: true,
        }, //10

        creditapproval: {
          type: "number",
          label: "Approval Code",
          require: true,
        },
        creditterminal: {
          type: "string",
          label: "Terminal ID",
          require: true,
        },
        creditacquiring: {
          type: "string",
          label: "Acquiring Bank",
          require: true,
        },
        banktid: {
          type: "string",
          label: "Bank TID",
          require: true,
        },
      },
      actionItems: [
        {
          label: "Manual",
          type: "",
        },
        {
          label: "Get Approval",
        },
        {
          label: "Retry",
          type: "",
        },
      ],
    };
  };

  export const demandDraftForm = (options: any) => {
    return {
      title: "Demand Draft Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Demand Draft",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
          require: true,
        },
        ddNumber: {
          type: "string",
          label: "DD No.",
          require: true,
        },
        ddDate: {
          type: "date",
          maximum: new Date(),
          label: "Issue Date",
          require: true,
        },
        bankName: {
          type: "autocomplete",
          label: "Bank Name",
          options: options.bankList,
          require: true,
        },
        branchName: {
          type: "string",
          label: "Branch Name",
          require: true,
        },
        demandauth: {
          type: "string",
          label: "Authorised By",
          require: true,
        }, //20
      },
    };
  };

  export const mobilePaymentForm = (options: any) => {
    return {
      title: "Mobile Payment Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Cash Payment by Mobile",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
          require: true,
        },
        mobileNo: {
          type: "number",
          label: "Sender Mobile",
          require: true,
        },
        mmid: {
          type: "number",
          label: "Sender MMID No.",
          require: true,
        },
        senderName: {
          type: "string",
          label: "Sender Name",
          require: true,
        },
        bankName: {
          type: "string",
          label: "Bank Name",
          require: true,
        },
        branchName: {
          type: "string",
          label: "Branch Name",
          require: true,
        },
        beneficiaryMobile: {
          type: "number",
          label: "Beneficiary Mob No.",
          require: true,
        },
        // mobiletransactionamt: {
        //   type: "number",
        //   label: "Transaction Amount",
        // },
        transactionRef: {
          type: "string",
          label: "Transaction Reference",
          require: true,
        },
      },
      actionItems: [
        {
          label: "Recheck",
          type: "",
        },
        {
          label: "OK",
        },
      ],
    };
  };

  export const onlinePaymentForm = (options: any) => {
    return {
      title: "Online Payment Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Online Payment",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
          require: true,
        },
        transactionId: {
          type: "string",
          label: "Transaction ID",
          require: true,
        },
        bookingId: {
          type: "string",
          label: "Booking ID",
          require: true,
        }, //30
        cardValidation: {
          type: "radio",
          required: false,
          options: [
            { title: "Yes", value: "yes" },
            { title: "No", value: "no" },
          ],
          label: "Card Validation",
          require: true,
        },
        onlineContact: {
          type: "number",
          label: "Contact No.",
          require: true,
        },
      },
      actionItems: [
        {
          label: "Search",
          type: "",
        },
        {
          label: "Clear",
        },
      ],
    };
  };

  export const paytmForm = (options: any) => {
    return {
      title: "Mobile Payment Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Cash Payment by Mobile",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
          require: true,
        },
        paytmwallet: {
          type: "autocomplete",
          label: "Wallet",
          placeholder: "PayTM",
          require: true,
        },
        mobileNo: {
          type: "number",
          label: "Sender Mobile No.",
          require: true,
        },
        // paytmsenername: {
        //   type: "string",
        // },
        paytmotp: {
          type: "number",
          label: "OTP",
          require: true,
        },
        paytmtransacref: {
          type: "string",
          label: "Transaction Reference",
          require: true,
        },
        paytmorderid: {
          type: "string",
          label: "Order ID",
          require: true,
        }, ///40
      },
      actionItems: [
        {
          label: "Recheck",
          type: "",
        },
        {
          label: "OK",
        },
      ],
    };
  };

  export const upiForm = (options: any) => {
    return {
      title: "UPI Payment Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "UPI",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
          require: true,
        },
        ccNumber_UPI: {
          type: "number",
          label: "Card No.",
          require: true,
        },
        cardholdername_UPI: {
          type: "string",
          label: "Card Holder Name",
          require: true,
        },
        cCvalidity_UPI: {
          type: "date",
          label: "Validity",
          require: true,
        },
        approvalno_UPI: {
          type: "string",
          label: "Transaction ID",
          require: true,
        },
        bankname_UPI: {
          type: "string",
          label: "Bank Name",
          require: true,
        },
        flagman_UPI: {
          type: "string",
          label: "Batch No.",
          require: true,
        },
        approvalcode_UPI: {
          type: "string",
          label: "Approval Code",
          require: true,
        },
        terminalID_UPI: {
          type: "string",
          label: "Terminal ID",
          require: true,
        },
        acquirer_UPI: {
          type: "string",
          label: "Acquiring Bank",
          require: true,
        },
      },
      actionItems: [
        {
          label: "Get Status",
          type: "",
        },
        {
          label: "OK",
        },
      ],
    };
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

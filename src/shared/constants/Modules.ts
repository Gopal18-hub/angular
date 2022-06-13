export namespace MaxModules {
  const modules = [
    {
      title: "Out Patients",
      id: 1,
      defaultPath: "/out-patients",
      moreOptions: true,
      childrens: [
        {
          id: 11,
          title: "Registration",
          defaultPath: "registration",
          moreOptions: true,
          childrens: [
            {
              id: 111,
              title: "OP Registration",
              defaultPath: "/registration/op-registration",
            },
            {
              id: 112,
              title: "Find Patient",
              defaultPath: "/registration/find-patient",
            },
            {
              id: 113,
              title: "Duplicate Reg Merging",
              defaultPath: "/registration/dup-reg-merging",
            },
            {
              id: 114,
              title: "Registration Unmerging",
              defaultPath: "/registration/registration-unmerging",
            },
          ],
        },
        {
          id: 12,
          title: "Out Patient Billing",
          defaultPath: "",
          childrens: [],
          moreOptions: true,
        },
      ],
    },
    {
      title: "Emergency",
      id: 2,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "In-Patients",
      id: 3,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "MMS",
      id: 4,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Operation Theater",
      id: 5,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "MIS reports",
      id: 6,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Physicians",
      id: 7,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Laboratory",
      id: 8,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Adverse Events",
      id: 9,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Donate Blood",
      id: 10,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Administration",
      id: 11,
      defaultPath: "",
      childrens: [],
    },
  ];

  export function getModules() {
    return modules;
  }
}

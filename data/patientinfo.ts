const patientInfoDev = {
    referralNumber: "REF-000200007",
    firstName: "Ali",
    lastName: "Ahmed",
    dateOfBirth: "01/07/1982",
    postalCode: "B1 1YU",
    hospitalNumber: "133Test",
    NHSNumber: "4567321",
    service: "Ajovy",
    diagnosis: "Ankylosing Spondylitis",
    referralStatus: "On Hold",
    provider: "Kings way Hospital",
    referrer: "Eddie Brock   ",
  };
  
  const patientInfoUAT = {
    referralNumber: "REF-000200007",
    firstName: "Ali",
    lastName: "Ahmed",
    dateOfBirth: "01/07/1982",
    postalCode: "B1 1YU",
    hospitalNumber: "133Test",
    NHSNumber: "4567321",
    service: "Ajovy",
    diagnosis: "Ankylosing Spondylitis",
    referralStatus: "On Hold",
    provider: "Kings way Hospital",
    referrer: "Eddie Brock   ",
  };
  
  export const patientInfo =
    process.env.ENV === "UAT" ? patientInfoUAT : patientInfoDev;
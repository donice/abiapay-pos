
  const csvData = `first_name,middle_name,surname,birth_date,gender,lga,guardian_phone_number,guardian_abssin,school_name,school_address,student_school_id,state_of_origin,state_of_residence,house_no,street\nJohnson,,Mba,1/20/2020,Male,1,9126818976,1624653099,St. Maris,,,901992012,Abia State,,,\nMark,,Mobebe,9/18/2021,Male,8,9130989281,1624653099,Catholic Secondary School,,129102921,,Abia State,,,`;

  export const downloadCSV = () => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk_abssin_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

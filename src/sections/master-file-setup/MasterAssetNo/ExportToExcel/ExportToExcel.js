import React from "react";
import ExcelJS from "exceljs";

const ExportToExcel = ({ tableData }) => {
  if (tableData !== "" && tableData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("AutoNo List");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Module Code", key: "cnt_mst_module_cd", width: 15 },
      { header: "Description", key: "cnt_mst_desc", width: 22 },
      { header: "Auto Numbering", key: "cnt_mst_numbering", width: 15 },
      { header: "Prefix", key: "cnt_mst_prefix", width: 15 },
      { header: "Counter", key: "cnt_mst_counter", width: 15 },
    ];

    // Add data to the worksheet
    tableData.forEach((rowData) => {
      worksheet.addRow(rowData);
    });

    const headerRow = worksheet.getRow(1);
    // Apply styling to header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { size: 12, bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2F5597" },
      };
      cell.alignment = { horizontal: "center", vertical: "center" };
    });

    // Apply styling to data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.font = { size: 11, color: { argb: "#000" } }; // Customize font for data rows
        row.alignment = { horizontal: "center", vertical: "middle" }; // Center data text
      }
    });

    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Auto_No_list_Data.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportToExcel;

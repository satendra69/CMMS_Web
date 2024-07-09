import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import Moment from "moment";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Iconify from "src/components/iconify";
//import WorkStockNoPopupData from "./WorkStockNoPopupData";
import WorkStockNoPopupData from "src/sections/maintenance/component_module/Planning/WorkStockNoPopupData";
//import logo from "../../../../assets/img/screw.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import httpCommon from "src/http-common";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const AssetSpares = ({ onRowClick, data }) => {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);
  const [MaterialOrderResult, setMaterialOrderResult] = React.useState([]);

  const [show, setShow] = useState(false);
 
  const handleShow = () => {
    setShow(true);
    setInputFields(updatedInputFields);
  };

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [StockNo, setStockNo] = useState([]);
  const [selected_StockNo, setSelected_StockNo] = useState([]);
  const [Description, setDescription] = useState("");

  const [PartNo, setPartNo] = useState("");

  const [TotalOh, setTotalOh] = useState("");
  const [QtyNeeded, setQtyNeeded] = useState("");


  const [StockLocation, setStockLocation] = useState([]);
  const [selected_StockLocation, setSelected_StockLocation] = useState([]);


  const [ChargeCostCenter, setChargeCostCenter] = useState([]);
  const [selected_ChargeCostCenter, setSelected_ChargeCostCenter] = useState(
    []
  );

  const [ChargeAccount, setChargeAccount] = useState([]);
  const [selected_ChargeAccount, setSelected_ChargeAccount] = useState([]);

  
  

  const location = useLocation();

  const [Button_save, setButton_save] = useState("");

  const [RowID, setRowID] = useState(data.RowID);
  const [RowID2, setRowID2] = useState("");
  const [WorkOrderNo, setWorkOrderNo] = useState(data.WorkOrderNo);
  const [selected_Charge_Cost_Center, setselected_Charge_Cost_Center] =
    useState(data.selected_Charge_Cost_Center);

  //const [AssetNo, setAssetNo] = useState(data.Asset_No.split(' : ')[0]);
  const [AssetNo, setAssetNo] = useState();
  const [UOM, setUOM] = useState("");
  const [ItemCost, setItemCost] = useState("");
  const [MaterialRequestNo, setMaterialRequestNo] = useState("");
  const [MrLineNo, setMrLineNo] = useState("");
  const [MrApprovalStatus, setMrApprovalStatus] = useState("");
  const [ActualQuantity, setActualQuantity] = useState("");
  const [ContractPoNo, setContractPoNo] = useState("");
  const [ContractPoLine, setContractPoLine] = useState("");
  const [getStockNo, setGetStockNo] = useState([]);
  const [modalOpenAsset, setModalOpenAsset] = useState(false);
  const [modalRowDt, setmodalRowDt] = useState("");

  const [astMstLabel, setAstMstLabel] = useState([]);
  const [AssetMandatoryFiled, setAssetMandatoryFiled] = useState([]);
 

  useEffect(() => {
    get_Asset_Spares(site_ID, RowID);
    getAssetSparesFromLebel();
    getAssetMandatoryfiled();
  }, [location]);
  // First Api
  const get_Asset_Spares = async (site_ID, RowID) => {
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.get(
        `/get_asset_spares.php?site_cd=${site_ID}&RowID=${RowID}`
      );
     //  console.log("response____Asset_Spares___", response);
      if (response.data.status === "SUCCESS") {
        setHeader(response.data.data.header);
        setResult(response.data.data.result);
        Swal.close();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  };
  //Header
  const renderTableHeader = () => {
    const cellStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "center" ,
    };
    return (
      <>
        <TableCell key="select" ></TableCell>
        {Object.keys(Header).map((attr) => (
          <TableCell key={attr} style={cellStyle}>
            {attr}
          </TableCell>
        ))}
      </>
    );
  };

  //Body
  const renderTableRows = () => {

    return Result.map((result, index) => (
      <TableRow key={index} onClick={(event) => handleRowClick(result, event)} 
      style={{ cursor: "pointer", transition: "background-color 0.3s" }}
      onMouseEnter={(event) => event.currentTarget.style.backgroundColor = "#f0f0f0"}
      onMouseLeave={(event) => event.currentTarget.style.backgroundColor = "transparent"}
      >
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {index + 1}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.ast_ls1_stock_no}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.ast_ls1_varchar1}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.itm_mst_desc}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.ast_ls1_qty_needed}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.itm_mst_ttl_oh}
        </TableCell>
       
      </TableRow>
    ));
  };

// Get All Filed label Name
const getAssetSparesFromLebel = async () => {
  try {
    const response = await httpCommon.get("/get_asset_spares_and_usage_from_lebal.php");
    if (response.data.status === "SUCCESS") {
      setAstMstLabel(response.data.data.ast_ls1);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
  // Get All Filed label Name
  const getAssetMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_asset_spares_and_usage_from_mandatory_filed.php");
      
      if (response.data && response.data.data && response.data.data.MandatoryField) {

        if (response.data.data.MandatoryField.length > 0) {
          
          setAssetMandatoryFiled(response.data.data.MandatoryField);
  
        }
  
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

const findCustomizeLabel = (columnName) => {
  if (!Array.isArray(astMstLabel)) return "";
  const matchingColumn = astMstLabel.find(
    (item) => item.column_name === columnName
  );
  return matchingColumn ? matchingColumn.customize_label : "";

};

const findCustomizerequiredLabel = (columnName) => {
  const foundItem = AssetMandatoryFiled.find(item => item.column_name === columnName);
  if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
  }
  return "";
};

  const handleRowClick = (data) => {
   // console.log("clickRow__",data)
    setRowID2(data.RowID);
    setStockNo(data.ast_ls1_stock_no);
    setPartNo(data.ast_ls1_varchar1);
    setDescription(data.ast_ls1_desc);
    setQtyNeeded(data.ast_ls1_qty_needed);
    setTotalOh(data.itm_mst_ttl_oh);

    setShowModal(true);
  };
  const resetData = () => {
    setSelected_StockNo("");
    setPartNo("");
    setTotalOh("");
    setmodalRowDt("");
    setDescription("");
    setQtyNeeded("");
   
  };
  function CustomTextField({ rightIcons, ...props }) {
    return (
      <TextField
        {...props}
        InputProps={{
          endAdornment: rightIcons && (
            <div
              style={{ display: "flex", flexDirection: "row", color: "#000" }}
            >
              {rightIcons.map((icon, index) => (
                <IconButton key={index}>{icon}</IconButton>
              ))}
            </div>
          ),
        }}
      />
    );
  }
  // Add New Row button click
  const [inputFields, setInputFields] = useState([
    {
      site_ID: site_ID,
      mst_RowID: RowID,
      emp_mst_login_id: emp_mst_login_id,
      selectStock: "",
      setDescription: "",
      setPartNo:"",
      setTotalOh: "",
      setQtyNeeded:"",
    },
  ]);
  // Add New button funcation
  const addInputField = (event) => {
    event.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
      if (inputFields.selectStock.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Stock No is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.setDescription.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Description is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.setPartNo === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Part Number is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }
    });
    if (isValid) {
      setInputFields([
        ...inputFields,
        {
          site_ID: site_ID,
          mst_RowID: RowID,
          emp_mst_login_id: emp_mst_login_id,
          selectStock: "",
          setDescription: "",
          setPartNo:"",
          setQtyNeeded:"",
          setTotalOh: "",
        },
      ]);
    }
  };
  const removeInputFields = (index) => {
    const rows = [...inputFields];
    if (index !== undefined) {
      rows.splice(index, 1);
    } else {
      rows.splice(1, rows.length);
    }

    setInputFields(rows);
  };
  const handleClose = () => {
    setShow(false);
    resetData();
    removeInputFields();
  };
  // Clear State data
  const updatedInputFields = inputFields.map((field) => {
    return {
      ...field,
      selectStock: "",
      setDescription: "",
      setPartNo:"",
      setQtyNeeded: "",
      setTotalOh:"",

    };
  });

  const handleEditClick = async () => {
    setModalOpenAsset(true);
  };

  const handleCloseModal2 = () => {
    setModalOpenAsset(false);
  };

  // Stock Popup Data Get onclcik
  const handleRowPopupData = async (
    index,
    rowData,
    RowDescp,
    secondRowData
  ) => {
    // Use the row data in the second component
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    if (rowData !== undefined && rowData !== null) {
      setmodalRowDt(rowData);
      try {
        const response = await httpCommon.get(
          "/get_Asset_StockNo_dataMaterial.php?site_cd=" +
            site_ID +
            "&itm_mst_stockno=" +
            rowData
        );
        if (response.data.status === "SUCCESS") {
         
          setGetStockNo(response.data.data);
          setStockNo(modalRowDt + ":" + response.data.data[0].itm_mst_desc);

          
          const list = [...inputFields];

          const stockDt = modalRowDt;
          list[index]["selectStock"] = stockDt;
          setInputFields(list);

          const newData = response.data.data[0].itm_mst_desc;
          list[index]["setDescription"] = newData;
          setInputFields(list);

          const newData2 = response.data.data[0].itm_mst_partno;
          list[index]["setPartNo"] = newData2;
          setInputFields(list);

          const newData3 = response.data.data[0].itm_det_ttl_oh;
          list[index]["setTotalOh"] = newData3;
          setInputFields(list);

          Swal.close();
        }
      } catch (error) {
        console.error("Error posting form data:", error);
      }
    }
    if (secondRowData == "1") {
      setModalOpenAsset(false);
    }
  };

  const PopupRowDataSelect = () => {
    if (modalRowDt === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select one option!",
      });
    } else {
      setModalOpenAsset(false);
    }
  };

  const handleCancelClick = () => {
    setmodalRowDt("");
  };

  const handleNumericInputChange_14 = (e, setterFunction) => {
    let { value } = e.target;
    value = value.replace(/[^\d.]/g, ''); // Remove non-numeric characters except decimal
    value = value.slice(0, 14); // Limit to 16 characters including decimals and commas

    const parts = value.split('.');
    let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (integerPart.length > 11) {
      integerPart = integerPart.slice(0, 12) + '.' + integerPart.slice(12, 14);
    }
    let decimalPart = parts[1] ? parts[1].slice(0, 2) : '';

    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
   
  };

  const handleChange = async (index, fieldName, value, event) => {
    const list = [...inputFields];
    if (fieldName == "setQtyNeeded") {
      
      handleNumericInputChange_14(event, (value) => {

        list[index][fieldName] = value;
    
        setInputFields(list);
    
      });
      setQtyNeeded(value);
    } else if(fieldName == "setPartNo"){
      list[index][fieldName] = value.slice(0, 16);
      setPartNo(value);
    }else {
      list[index][fieldName] = value;
      setInputFields(list);
    }

    // if (fieldName == "setQtyNeeded") {
    //   setQtyNeeded(value);
    // }
  };

  // Submit Data in database
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
      if (inputFields.selectStock.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Stock No is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.setPartNo.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Part Number is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }else if (inputFields.setDescription.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Description is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }
    });
    if (isValid) {
      Swal.fire({
        title: "Please Wait!",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
    //  Swal.showLoading();
      
      try {
        const response = await httpCommon.post(
          "/insert_asset_spares_table_data.php",
          inputFields
        );
       // console.log("response_____sparec__",response);

        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Asset Spare Request!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            setResult([...Result, inputFields]);
            get_Asset_Spares(site_ID, RowID);
            // console.log("inputFields_after",inputFields);

            if (result.isConfirmed) {
              // Call the next function when the user clicks the "OK" button

              removeInputFields();
              handleClose();
            }
          });
        }
      } catch (error) {
        console.error("Error posting form data:", error);
      }
    }
  };

  // Handel Update button click
  const handleUpdateButtonClick = async (e) =>{
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    var json_UpdateAsset = {
      site_cd: site_ID,
      PartNo:PartNo.trim(),
      QtyNeeded:QtyNeeded.trim(),
      RowID:RowID2,
      auditUser:emp_mst_login_id,
    }
    console.log("json_UpdateAsset____",json_UpdateAsset);
    //update_asset_Specification
    try {
      const response = await httpCommon.post(
        "/update_asset_Spares.php",
        JSON.stringify(json_UpdateAsset)
      );
    //  console.log("json_Asset Data", response);
      if (response.data.status === "SUCCESS") {
         Swal.close();
        
         Swal.fire({
           icon: "success",
           customClass: {
             container: "swalcontainercustom",
           },
           title: response.data.status,
           text: response.data.message,
         }).then((result) => {
          setResult([...Result, inputFields]);
          get_Asset_Spares(site_ID, RowID);
    
          if (result.isConfirmed) {
             handleCloseModal();
          }
        });
       }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops somthing is wrong...",
        text: error,
      });
    }
  }
  
  return (
    <>
      <div>
        <div style={{ paddingBottom: "20px", backgroundColor: "white" }}>
          <div
            className="template-demo"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ marginRight: "5px" }}>
            <Iconify
                      icon="fluent:window-dev-tools-20-regular"
                      width="30px" height="30px"
                      style={{ fontSize: "24px" }}
                    />
            </div>
            <div
              className="template-demo"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginRight: "10px", fontWeight: "bold" }}>
              Spares
              </div>
            
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>{renderTableHeader()}</TableRow>
              </TableHead>
              <TableBody>{renderTableRows()}</TableBody>
            </Table>
          </TableContainer>
        </div>
        <div>
          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={show}
            maxWidth="lg"
            fullWidth
            disableBackdropClick
            sx={{
              width: "50vw",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "20px",
            }}
          >
            <DialogTitle
              sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}
              id="customized-dialog-title"
              className="dailogTitWork"
            >
              <Iconify
              
                icon="fluent:window-dev-tools-20-regular"
                width="30px"
                height="30px"
                style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
              />
              <div>Add Spares</div> {/* Title */}
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Iconify icon="material-symbols:close" />
            </IconButton>
            <DialogContent dividers>
              <div
                style={{
                  width: "100%",
                  marginTop: "15px",
                }}
              >
                <div className="row">
                  <div className="col-sm-12 WrkOdrMtb">
                    {inputFields.map((data, index) => {
                      const {
                        selectStock,
                        setDescription,
                        setPartNo,
                        setQtyNeeded,
                        setTotalOh,
                      } = data;
                      return (
                        <div className="row my-3 tb" key={index}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography
                                style={{
                                  color: "#2196f3",
                                  textDecoration: "underline",
                                  fontWeight: 600,
                                  fontSize: 16,
                                }}
                              >
                                Line {index + 1}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: "right" }}>
                              {inputFields.length !== 1 && (
                                <Button
                                  className="workmarerial_dlt"
                                  onClick={() => removeInputFields(index)}
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </Button>
                              )}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            spacing={1.5}
                            className="timeCartPopuplabel"
                          >
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_ls1_stock_no") || "Requiredlabel"}> {findCustomizeLabel("ast_ls1_stock_no") ||
                                    "Stock No:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  data.selectStock != "" ? data.selectStock : ""
                                }
                                disabled
                                placeholder="Select..."
                                style={{ color: "#000" }}
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={handleCancelClick}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleEditClick}
                                  />,
                                ]}
                              />
                            </Grid>
                            {/* Model stock no  */}
                            <Dialog
                              onClose={handleCloseModal2}
                              aria-labelledby="customized-dialog-title"
                              open={modalOpenAsset}
                              maxWidth="lg"
                              fullWidth
                              disableBackdropClick
                              sx={{
                                width: "100vw",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "20px",
                              }}
                            >
                              
                              <DialogTitle
                                sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}
                                id="customized-dialog-title"
                                className="dailogTitWork"
                              >
                                <Iconify
                                  icon="flowbite:list-outline"
                                  width="30px"
                                  height="30px"
                                  style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
                                />
                                <div> Stock</div> {/* Title */}
                              </DialogTitle>
                              <IconButton
                                aria-label="close"
                                onClick={handleCloseModal2}
                                sx={{
                                  position: "absolute",
                                  right: 8,
                                  top: 8,
                                  color: (theme) => theme.palette.grey[500],
                                }}
                              >
                                <Iconify icon="material-symbols:close" />
                              </IconButton>
                              <DialogContent dividers>
                                <div
                                  style={{
                                    width: "100%",
                                    marginTop: "15px",
                                  }}
                                >
                                  <WorkStockNoPopupData
                                    onRowClick={(
                                      rowData,
                                      RowDescp,
                                      secondRowData
                                    ) =>
                                      handleRowPopupData(
                                        index,
                                        rowData,
                                        RowDescp,
                                        secondRowData
                                      )
                                    }
                                  />
                                </div>
                              </DialogContent>
                              <DialogActions
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "10px",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  type="button"
                                  size="small"
                                  startIcon={
                                    <Iconify icon="material-symbols:close" />
                                  }
                                  className="Material_Close_btn"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCloseModal2();
                                  }}
                                >
                                  Close
                                </Button>

                                <div className="timeCartSubmit">
                                  <Button
                                    variant="contained"
                                    type="button"
                                    size="small"
                                    className="Material_Submit_btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      PopupRowDataSelect();
                                    }}
                                    style={{ marginLeft: "5px" }}
                                  >
                                    Select
                                  </Button>
                                </div>
                              </DialogActions>
                            </Dialog>
                            {/* End of stock model */}
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("ast_ls1_varchar1") || "Requiredlabel"}>{findCustomizeLabel("ast_ls1_varchar1") ||
                                    "Part Number:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                
                                  value={data.setPartNo.toUpperCase()}
                                  // onChange={(e) => {
                                  //   // setActualHour(e.target.value);
                                  // }}
                                 
                                  onChange={(e) =>
                                    handleChange(index, 'setPartNo', e.target.value)
                                  }
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("ast_ls1_desc")}>{findCustomizeLabel("ast_ls1_desc") ||
                                    "Description:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  type="text"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setDescription != ""
                                      ? data.setDescription
                                      : ""
                                  }
                                
                                
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("ast_ls1_qty_needed")}>{findCustomizeLabel("ast_ls1_qty_needed") ||
                                    "Quantity Needed:"}</label>
                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  value={setQtyNeeded}
                                  onChange={(event) =>
                                    handleChange(
                                      index,
                                      "setQtyNeeded",
                                      event.target.value,
                                      event
                                    )
                                  }
                                  InputProps={{
                                    inputProps: { style: { textAlign: 'right' } }
                                    }}
                                  placeholder=".000"
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("ast_ls1_ttl_oh")}>{findCustomizeLabel("ast_ls1_ttl_oh") ||
                                    "Total OH:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setTotalOh != ""
                                      ? data.setTotalOh
                                      : ""
                                  }
                                  onChange={(e) => {
                                    // setActualHour(e.target.value);
                                  }}
                                />
                              
                              </Grid>

                              
                            </Grid>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </DialogContent>
              <DialogActions
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
              >
                
                <Button
                      variant="soft"
                      color="error"
                      className="CloseButton"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClose();
                      }}
                      startIcon={<Iconify icon="jam:close" />}
                    >
                      Close
                </Button>

                <div className="timeCartSubmit" style={{ display: "flex", alignItems: "center" }}>
                  
                  <Button
                  
                  variant="contained"
                  className='AddNewButton'
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={addInputField}
                  style={{ marginRight: "10px" }}
                >
              
              Add
                </Button>
                  
                  <Button
                  variant="contained"
                  className="SaveButton assetSpares"
                  startIcon={<Iconify icon="mingcute:save-fill" />}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    marginRight: "10px",
                  }}
                  onClick={handleAddButtonClick}
                  
                >
                  Save
                </Button>
                </div>
              </DialogActions>
            </Dialog>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button
              type="button"
              className="tabAddButton"
              onClick={handleShow}
            >
              + Add Spares
            </Button>
          </div>
        </div>

      {/*  Row Click to open model popup */}
      <BootstrapDialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
         
          <Iconify
                      icon="fluent:window-dev-tools-20-regular"
                      width="25px" height="25px"
                      style={{fontSize: "24px", marginRight: "5px"  }}
                    />
          <div>Update Spares</div> {/* Title */}
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
        <DialogContent dividers>
          <div
            style={{
              width: "100%",
              marginTop: "15px",
            }}
          >
            <div className="row">
              <div className="col-sm-12 WrkOdrMtb">
         
                 
                    <div className="row my-3 tb">
                    
                      <Grid
                        container
                        spacing={1.5}
                        className="timeCartPopuplabel"
                      >
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("ast_ls1_stock_no") || "Requiredlabel"}> {findCustomizeLabel("ast_ls1_stock_no") ||
                                    "Stock No:"}</label>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={StockNo}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("ast_ls1_varchar1") || "Requiredlabel"}>{findCustomizeLabel("ast_ls1_varchar1") ||
                                    "Part Number:"}</label>
                        </Grid>

                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            value={PartNo}
                           // onChange={(event) => setPartNo(event.target.value)}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 25 ) {
                                setPartNo(value);
                              }
                              
                              }}
                          />
                        </Grid>

                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("ast_ls1_desc")}>{findCustomizeLabel("ast_ls1_desc") ||
                                    "Description:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Description}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("ast_ls1_qty_needed")}>{findCustomizeLabel("ast_ls1_qty_needed") ||
                                    "Quantity Needed:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            type="text"
                            className="Extrasize"
                            fullWidth
                            value={QtyNeeded}
                           // onChange={(event) => setQtyNeeded(event.target.value)}
                            onChange={(e) => handleNumericInputChange_14(e, setQtyNeeded)}
                            InputProps={{
                              inputProps: { style: { textAlign: 'right' } }
                            }}
                          />
                        
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("ast_ls1_ttl_oh")}>{findCustomizeLabel("ast_ls1_ttl_oh") ||
                            "Total OH:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={TotalOh}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  
              
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <Button
            variant="soft"
            color="error"
            className="CloseButton"
            onClick={(e) => {
              e.preventDefault();
              handleCloseModal();
            }}
            startIcon={<Iconify icon="jam:close" />}
          >
            Close
          </Button>

          <div
            className="timeCartSubmit"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Button
              variant="contained"
              className="SaveButton assetSpares"
              startIcon={<Iconify icon="mingcute:save-fill" />}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                marginRight: "10px",
              }}
              onClick={handleUpdateButtonClick}
            >
              Save
            </Button>
           
          </div>
        </DialogActions>
      </BootstrapDialog>

    </>
  );
};

export default AssetSpares;

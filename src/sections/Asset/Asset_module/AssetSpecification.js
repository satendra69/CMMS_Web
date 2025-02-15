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
import TextareaAutosize from "@mui/material/TextareaAutosize";
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

const AssetSpecification = ({ onRowClick, data }) => {
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

  const [StockLocation, setStockLocation] = useState([]);
  const [selected_StockLocation, setSelected_StockLocation] = useState([]);

  const [Description, setDescription] = useState("");
  const [PartNo, setPartNo] = useState("");
  const [TotalOh, setTotalOh] = useState("");

  const [ChargeCostCenter, setChargeCostCenter] = useState([]);
  const [selected_ChargeCostCenter, setSelected_ChargeCostCenter] = useState(
    []
  );

  const [ChargeAccount, setChargeAccount] = useState([]);
  const [selected_ChargeAccount, setSelected_ChargeAccount] = useState([]);

  const [QtyNeeded, setQtyNeeded] = useState("");

  const location = useLocation();

  const [Button_save, setButton_save] = useState("");

  const [RowID, setRowID] = useState(data.RowID);
  const [RowID2, setRowID2] = useState("");
  const [WorkOrderNo, setWorkOrderNo] = useState(data.WorkOrderNo);
  const [selected_Charge_Cost_Center, setselected_Charge_Cost_Center] =
    useState(data.selected_Charge_Cost_Center);

  //const [AssetNo, setAssetNo] = useState(data.Asset_No.split(' : ')[0]);
  const [getDescription, setGetDescription] = useState();
  const [UOM, setUOM] = useState("");
  const [Rating,setRating] = useState("");
  const [ItemCost, setItemCost] = useState("");
  const [MaterialRequestNo, setMaterialRequestNo] = useState("");
  const [MrLineNo, setMrLineNo] = useState("");
  const [MrApprovalStatus, setMrApprovalStatus] = useState("");
  const [ActualQuantity, setActualQuantity] = useState("");
  const [ContractPoNo, setContractPoNo] = useState("");
  const [ContractPoLine, setContractPoLine] = useState("");
  const [getStockNo, setGetStockNo] = useState([]);
  //const [modalOpenAsset, setModalOpenAsset] = useState(false);
  const [modalRowDt, setmodalRowDt] = useState("");
  const [UsageUOM, setUsageUOM] = useState([]);
  const [selectedUom, setSelectedUom] = useState([]);
  const [MeterInstallDate, setMeterInstallDate] = useState(new Date());
  const [UsageDate, setUsageDate] = useState(new Date());
  const [MeterID, setMeterID] = useState();
  const [Selected_UsageUOM, setSelected_UsageUOM] = useState([]);

  const [astRetLabel, setRetLabel] = useState([]);

  const [AssetSpecificationMandatoryFiled, setAssetSpecificationMandatoryFiled] = useState([]);

  useEffect(() => {
    get_Asset_Specification(site_ID, RowID);
    getSpecificationUOM(site_ID);
    getAssetSpecificationFromLebel();
    getAssetSpecificationMandatoryfiled();
  }, [location]);

  // First Api
  const get_Asset_Specification = async (site_ID, RowID) => {
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
        `/get_asset_specification.php?site_cd=${site_ID}&RowID=${RowID}`
      );
      // console.log("response____Asset_Specfication___", response);
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
  // Get UOM
  const getSpecificationUOM = async () => {
    try {
     // console.log("ht again_____");
      const response = await httpCommon.get(
        `/getSpecificationUOM.php?site_cd=${site_ID}`
      );
      //console.log("response____Asset_Usage___", response);
      if (response.data.status === "SUCCESS") {
        setUsageUOM(response.data.data.result);
        let UOMLIST = response.data.data.result.map((item) => ({
          label: item.uom_mst_uom + " : " + item.uom_mst_desc,
          value: item.uom_mst_desc,
          key: item.uom_mst_uom,
        }));
        setUsageUOM(UOMLIST);
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

  
  // Get All Filed label Name
const getAssetSpecificationFromLebel = async () => {
  try {
    const response = await httpCommon.get("/get_asset_specification_form_lebel.php");
   
    if (response.data.status === "SUCCESS") {
      setRetLabel(response.data.data.ast_rat);
      //setAstdetLabel(response.data.data.ast_ls2);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getAssetSpecificationMandatoryfiled = async () => {
  try {
    const response = await httpCommon.get("/get_asset_specification_from_mandatory_filed.php");
    
    if (response.data && response.data.data && response.data.data.MandatoryField) {

      if (response.data.data.MandatoryField.length > 0) {
        
        setAssetSpecificationMandatoryFiled(response.data.data.MandatoryField);

      }

    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const findCustomizeLabel = (columnName) => {
  if (!Array.isArray(astRetLabel)) return "";
  const matchingColumn = astRetLabel.find(
    (item) => item.column_name === columnName
  );
  return matchingColumn ? matchingColumn.customize_label : "";

};

const findCustomizerequiredLabel = (columnName) => {
  const foundItem = AssetSpecificationMandatoryFiled.find(item => item.column_name === columnName);
  if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
  }
  return "";
};


  //Header
  const renderTableHeader = () => {
    const cellStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "left",
    };
    return (
      <>
        <TableCell key="select"></TableCell>
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
      // Add hover effect
      onMouseEnter={(event) => event.currentTarget.style.backgroundColor = "#f0f0f0"}
      onMouseLeave={(event) => event.currentTarget.style.backgroundColor = "transparent"}
      >
        <TableCell style={{ padding: "5px 15px", textAlign: "left" }}>
          {index + 1}
        </TableCell>
        <TableCell style={{ padding: "5px 15px", textAlign: "left" }}>
          {result.ast_rat_desc}
        </TableCell>
        <TableCell style={{ padding: "5px 15px", textAlign: "left" }}>
          {result.ast_rat_rating}
        </TableCell>

        <TableCell style={{ padding: "5px 15px", textAlign: "left" }}>
          {result.ast_rat_uom}
        </TableCell>
      </TableRow>
    ));
  };
  const handleRowClick = (data) => {
   
    setGetDescription(data.ast_rat_desc);
    setRating(data.ast_rat_rating);
    setUOM(data.ast_rat_uom);
    setRowID2(data.RowID);
    
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

  // Add New Row button click
  const [inputFields, setInputFields] = useState([
    {
      site_ID: site_ID,
      mst_RowID: RowID,
      emp_mst_login_id: emp_mst_login_id,
      ast_rat_uom: "",
      ast_rat_rating: "",
      ast_rat_desc: "",
    },
  ]);
  // Add New button funcation
  const addInputField = (event) => {
    event.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
      if (inputFields.ast_rat_desc.trim() === "") {
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
      setInputFields([
        ...inputFields,
        {
          site_ID: site_ID,
          mst_RowID: RowID,
          emp_mst_login_id: emp_mst_login_id,
          ast_rat_uom: "",
          ast_rat_desc: "",
          ast_rat_rating: "",
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
  
  // Clear State data
  const updatedInputFields = inputFields.map((field) => {
    return {
      ...field,
      ast_rat_uom: "",
      ast_rat_desc: "",
      ast_rat_rating: "",
    };
  });

  const handleChange = async (index, fieldName, value) => {
    const list = [...inputFields];
    if (fieldName == "ast_rat_desc") {
      list[index][fieldName] = value.slice(0, 255);
      setInputFields(list);
     
    } else if (fieldName == "ast_rat_rating") {
      list[index][fieldName] = value.slice(0, 10);
      setInputFields(list);
     
    } else {
      list[index][fieldName] = value;
      setInputFields(list);
    }
    if (fieldName == "ast_rat_uom") {
      //setSelected_ChargeCostCenter(value);
      setSelected_UsageUOM(value);
    }
  };
  const handleClose = () => {
    setShow(false);
    resetData();
    removeInputFields();
  };
  // Submit Data in database
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
      if (inputFields.ast_rat_desc.trim() === "") {
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
        Swal.showLoading();
      // console.log("inputFields____post",inputFields);
      try {
        const response = await httpCommon.post(
          "/insert_asset_specification_table_data.php",
          inputFields
        );
      //  console.log("inputFields____postAfter22", response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Asset Specification Request!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            setResult([...Result, inputFields]);
            get_Asset_Specification(site_ID, RowID);
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
  //Sum calculation
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
      getDescription:getDescription.trim(),
      Rating:Rating.trim(),
      UOM:UOM,
      RowID:RowID2,
      auditUser:emp_mst_login_id,
    }
    //update_asset_Specification
    try {
      const response = await httpCommon.post(
        "/update_asset_specification.php",
        JSON.stringify(json_UpdateAsset)
      );
     // console.log("json_Asset Data", response);
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
          get_Asset_Specification(site_ID, RowID);
    
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
            <div style={{ marginRight: "10px" }}>
              <Iconify
                icon="mdi:axis-arrow-info"
                width="25px"
                height="25px"
                style={{ fontSize: "30px" }}
              />
            </div>
            <div
              className="template-demo"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                Specification
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
              sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
              id="customized-dialog-title"
              className="dailogTitWork"
            >
              <Iconify
                icon="mdi:axis-arrow-info"
                width="25px"
                height="25px"
                style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
              />
              <div>Add Specification</div> {/* Title */}
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
                      const { ast_rat_uom, ast_rat_desc, ast_rat_rating } =
                        data;
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
          
                              <label className={findCustomizerequiredLabel("ast_rat_desc") || "Requiredlabel"}> {findCustomizeLabel("ast_rat_desc") ||
                                    "Description:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextareaAutosize
                                variant="outlined"
                                size="small"
                                minRows={2.9}
                                className="TxtAra"
                                style={{ width: '100%' }} 
                                fullWidth
                                value={ast_rat_desc}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_rat_desc",
                                    event.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_rat_rating") }> {findCustomizeLabel("ast_rat_rating") ||
                                    "Rating:"}</label>
                            </Grid>

                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                className="Extrasize"
                                fullWidth
                                value={ast_rat_rating}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_rat_rating",
                                    event.target.value
                                  )
                                }
                              />
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                            
                              <label className={findCustomizerequiredLabel("ast_rat_uom")}> {findCustomizeLabel("ast_rat_uom") ||
                                    "UOM:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={UsageUOM}
                                value={data.ast_rat_uom}
                                onChange={(event, newValue) =>
                                  handleChange(index, "ast_rat_uom", newValue)
                                }
                                disableAnimation
                                renderInput={(params) => (
                                  <div>
                                    <TextField
                                      {...params}
                                      placeholder="Select..."
                                      variant="outlined"
                                      size="small"
                                      className="Extrasize"
                                    />
                                  </div>
                                )}
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

              <div
                className="timeCartSubmit"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Button
                  variant="contained"
                  className="AddNewButton"
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
            + Add Specification
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
            icon="mdi:axis-arrow-info"
            width="25px"
            height="25px"
            style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
          />
          <div>Update Specification</div> {/* Title */}
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
                        <label className={findCustomizerequiredLabel("ast_rat_desc") || "Requiredlabel"}> {findCustomizeLabel("ast_rat_desc") ||
                             "Description:"}</label>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            value={getDescription}
                           // onChange={(event) => setGetDescription(event.target.value)}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 255) {
                                setGetDescription(value);
                              }
                              
                              }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("ast_rat_rating") }> {findCustomizeLabel("ast_rat_rating") ||
                                    "Rating:"}</label>
                        </Grid>

                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            value={Rating}
                           // onChange={(event) => setRating(event.target.value)}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 10) {
                                setRating(value);
                              }
                              
                              }}
                          />
                        </Grid>

                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("ast_rat_uom")}> {findCustomizeLabel("ast_rat_uom") ||
                                    "UOM:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <Autocomplete
                            options={UsageUOM}
                            value={UOM}
                           
                            onChange={(event, newValue) => setUOM(newValue)}
                            disableAnimation
                          //  getOptionLabel={(option) => option.label}
                            
                            renderInput={(params) => (
                              <div>
                                <TextField
                                  {...params}
                                  placeholder="Select..."
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                />
                              </div>
                            )}
                         
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

export default AssetSpecification;

import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
// @mui
import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
// @bootstrap

import TextareaAutosize from "@mui/material/TextareaAutosize";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import IconButton from "@mui/material/IconButton";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
// import CloseIcon from '@mui/icons-material/Close';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Checkbox ,Radio} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

import { useLocation, useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "moment";
import "moment-timezone";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
// utils

// routes
import { RouterLink } from "src/routes/components";

import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Toastfy
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";

// import WorkOrderAssetNo from "../WorkOrderAssetNo";

import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import AssetParentIdList from "src/sections/Asset/AssetParentIdList";
import InventoryMasterLocation from "../Table/InventoryMasterLocationListForm";


import PmSetup from "src/sections/Asset/Asset_module/PmSetup";
//import WoHistory from "../Asset_module/AssetWoHistory";
import WoHistory from "src/sections/Asset/Asset_module/AssetWoHistory";
import RelocationHistory from "src/sections/Asset/Asset_module/RelocationHistory";
import CheckList from "src/sections/Asset/Asset_module/AssetCheckList";
import AssetSpares from "src/sections/Asset/Asset_module/AssetSpares";
import AssetUsage from "src/sections/Asset/Asset_module/AssetUsage";
import AssetSpecification from "src/sections/Asset/Asset_module/AssetSpecification";
import InventoryMasterTaxCode from "../Table/InventoryMasterTaxCodeListForm";

//import WorkOrderSpecialOrder from "../component_module/Planning/WorkOrderSpecialOrder";
const MySwal = withReactContent(Swal);
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const StepContainer = styled("div")`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  position: relative;
  :before {
    content: "";
    position: absolute;
    background: #4694d1;
    height: 90%;
    width: 2px;
    top: 50%;
    transform: translateY(-50%);
    left: 15px;
  }
  :after {
    content: "";
    position: absolute;
    background: #f3e7f3;
    height: ${({ width }) => width};
    width: 2px;
    top: 45%;
    transition: 0.4s ease;
    transform: translateY(-50%);
    left: 14px;
  }
`;

// ----------------------------------------------------------------------

export default function InventoryForm({ currentUser, onPageChange }) {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_name = localStorage.getItem("emp_mst_name");
  const location = useLocation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [progress, setProgress] = useState(0);

  const state = location.state || {};
  const {
    RowID,
    Ast_no,
    DuplicatRowid,
    DupRowID,
    DupAst_no,
    currentPage,
    selectedOption,
  } = state || {};
  // console.log("RowID____update",RowID);
  const { completeRowID } = location.state || {};
  const { closeRowID } = location.state || {};

  const [loading, setLoading] = useState(true);

  const [itmMstLabel, setItmMstLabel] = useState([]);
  const [itmdetLabel, setItmdetLabel] = useState([]);

  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const settings = useSettingsContext();

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImages2, setSelectedImages2] = useState([]);

  const [selectedPdfFiles, setSelectedPdfFiles] = useState([]);
  const [RefImg, setRefImg] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [getDbImg, setDbImg] = useState();
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [removedRefItems, setRemovedRefItems] = useState([]);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [imageSelect, setImageSelect] = useState({ name: "", path: "" });
  const [Tabvalue, setTabValue] = useState(0);

  const [showdd, setShowdd] = useState(false);
  const [handalImg, sethandalImg] = useState({});
  const handleClosedd = () => setShowdd(false);
  const [showdd2, setShowdd2] = useState(false);
  const handleClosedd2 = () => setShowdd2(false);

  const [Asset_No, setAsset_No] = useState("");
  const [TotalAssetNo, setTotalAssetNo] = useState(0);
  const [TotalSearch, setTotalSearch] = useState("");
  const [viewedTotlRows, setViewedTotlRows] = useState(0);

  // form filed state
  const [AssetNo, setAssetNo] = useState("");
  const [Status, setStatus] = useState([]);
  const [selected_Status, setSelected_Status] = useState([]);

  const [Asset_CriFactor, setAsset_CriFactor] = useState([]);
  const [selected_CriFactor, setselected_CriFactor] = useState([]);

  const [Area_ID, setArea_ID] = useState("");

  const [Asset_Type, setAsset_Type] = useState([]);
  const [selected_AssetType, setselectedAssetType] = useState([]);

  const [Asset_Code, setAsset_Code] = useState([]);
  const [selected_AssetCode, setselectedAssetCode] = useState([]);

  const [Asset_Group_Code, setAsset_Group_Code] = useState([]);
  const [selected_AssetGroupCode, setselectedAssetGroupCode] = useState([]);

  const [Charge_Cost_Center, setCharge_Cost_Center] = useState([]);
  const [selected_Charge_Cost_Center, setSelected_Charge_Cost_Center] =
    useState([]);

  const [Work_Area, setWork_Area] = useState([]);
  const [selected_Work_Area, setSelected_Work_Area] = useState([]);

  const [Asset_Location, setAsset_Location] = useState([]);
  const [selected_Asset_Location, setSelected_Asset_Location] = useState([]);

  const [Asset_Level, setAsset_Level] = useState([]);
  const [selected_Asset_Level, setSelected_Asset_Level] = useState([]);

  const [Work_Group, setWork_Group] = useState([]);
  const [selected_Work_Group, setSelected_Work_Group] = useState([]);

  const [Permanent_ID, setPermanent_ID] = useState(0);

  const [SafetyRequirement, setSafetyRequirement] = useState("");
  const [BarcodeCount, setBarcodeCount] = useState("0");
  const [ManufactureCode, setManufactureCode] = useState("");
  const [AssetCost, setAssetCost] = useState("");
  const [ResidualValue, setResidualValue] = useState([]);
  const [Permanent_IDFlag, setPermanentIDFlag] = useState([]);
  const [CustomerCode, setCustomerCode] = useState("");
  const [selected_Customer_Code, setSelected_Customer_Code] = useState([]);

  const [Contract_Account, setContract_Account] = useState([]);
  const [selected_Contract_Account, setSelected_Contract_Account] = useState(
    []
  );
  const [PurchaseDate, setPurchaseDate] = useState(new Date());
  const [Select_PurchaseDate, setSelectPurchaseDate] = useState("");

  const [WarrantyDate, setWarrantyDate] = useState(new Date());
  const [Select_WarrantyDate, setSelectWarrantyDate] = useState("");

  const [Labor_Account, setLabor_Account] = useState([]);
  const [selected_Labor_Account, setSelected_Labor_Account] = useState([]);

  const [ExpectedLifeYear, setExpectedLifeYear] = useState("");

  const [Material_Account, setMaterial_Account] = useState([]);
  const [selected_Material_Account, setSelected_Material_Account] = useState(
    []
  );

  const [DepreciationMethod, setDepreciationMethod] = useState([
    { label: "Straight-Line", value: "SL" },
    { label: "Declining-Balance", value: "DB" },
    { label: "Double-Declining", value: "DD" },
  ]);
  const [selected_Depreciation_Method, setSelectedDepreciationMethod] =
    useState([]);

  const [UDFText_1, setUDFText_1] = useState("");
  const [UDFText_2, setUDFText_2] = useState("");
  
  const [UDFText_11, setUDFText_11] = useState("");
  const [UDFText_12, setUDFText_12] = useState("");
  const [UDFText_13, setUDFText_13] = useState("");
  const [UDFText_14, setUDFText_14] = useState("");
  const [UDFText_15, setUDFText_15] = useState("");
  const [UDFText_16, setUDFText_16] = useState("");
  const [UDFText_17, setUDFText_17] = useState("");
  const [UDFText_18, setUDFText_18] = useState("");
  const [UDFText_19, setUDFText_19] = useState("");
  const [UDFText_20, setUDFText_20] = useState("");
  const [UDFText_21, setUDFText_21] = useState("");
  const [UDFText_22, setUDFText_22] = useState("");
  const [UDFText_23, setUDFText_23] = useState("");
  const [UDFText_24, setUDFText_24] = useState("");
  const [UDFText_25, setUDFText_25] = useState("");
  const [UDFText_26, setUDFText_26] = useState("");
  const [UDFText_27, setUDFText_27] = useState("");
  const [UDFText_28, setUDFText_28] = useState("");
  const [UDFText_29, setUDFText_29] = useState("");
  const [UDFText_30, setUDFText_30] = useState("");

  
  const [UDFNumber_6, setUDFNumber_6] = useState("0.00");
  const [UDFNumber_7, setUDFNumber_7] = useState("0.00");
  const [UDFNumber_8, setUDFNumber_8] = useState("0.00");
  const [UDFNumber_9, setUDFNumber_9] = useState("0.00");
  const [UDFNumber_10, setUDFNumber_10] = useState("0.00");
  const [UDFNumber_11, setUDFNumber_11] = useState("0.00");
  const [UDFNumber_12, setUDFNumber_12] = useState("0.00");
  const [UDFNumber_13, setUDFNumber_13] = useState("0.00");
  const [UDFNumber_14, setUDFNumber_14] = useState("0.00");
  const [UDFNumber_15, setUDFNumber_15] = useState("0.00");

 
  const [UDFDate_6, setUDFDate_6] = useState(new Date());
  const [UDFDate_7, setUDFDate_7] = useState(new Date());
  const [UDFDate_8, setUDFDate_8] = useState(new Date());
  const [UDFDate_9, setUDFDate_9] = useState(new Date());
  const [UDFDate_10, setUDFDate_10] = useState(new Date());
  const [UDFDate_11, setUDFDate_11] = useState(new Date());
  const [UDFDate_12, setUDFDate_12] = useState(new Date());
  const [UDFDate_13, setUDFDate_13] = useState(new Date());
  const [UDFDate_14, setUDFDate_14] = useState(new Date());
  const [UDFDate_15, setUDFDate_15] = useState(new Date());

  const [isAssetStatusEmpty, setIsAssetStatusEmpty] = useState(false);
  const [isAssetCriticalFactorEmpty, setIsAssetCriticalFactorEmpty] =
    useState(false);
  const [isAssetShortDescEmpty, setIsAssetShortDescEmpty] = useState(false);
  const [isAssetTypeEmpty, setIsAssetTypeEmpty] = useState(false);
  const [isAssetCodeEmpty, setIsAssetCodeEmpty] = useState(false);
  const [isAssetGroupCodeEmpty, setIsAssetGroupCodeEmpty] = useState(false);
  const [isAssetWorkAreaEmpty, setIsAssetWorkAreaEmpty] = useState(false);
  const [isAssetLocation, setIsAssetLocation] = useState(false);
  const [isAssetLeavelEmpty, setIsAssetLeavelEmpty] = useState(false);
  const [isAssetCostCenterEmpty, setIsAssetCostCenterEmpty] = useState(false);

  const [Plan_Priority, setPlan_Priority] = useState([]);
  const [selected_Project_ID, setSelected_Project_ID] = useState([]);
  const [selected_Plan_Priority, setSelected_Plan_Priority] = useState([]);

  const [Fault_Code, setFault_Code] = useState([]);
  const [selected_Fault_Code, setSelected_Fault_Code] = useState([]);
  const [Asset_Status, setAsset_Status] = useState([]);

  const [Supervisor_ID, setSupervisor_ID] = useState([]);

  const [Asset_Laboraccount, setAsset_Laboraccount] = useState([]);

  const [Cause_Code, setCause_Code] = useState([]);
  const [Action_Code, setAction_Code] = useState([]);
  const [Delay_Code, setDelay_Code] = useState([]);
  const [Work_Type, setWork_Type] = useState([]);
  const [Work_Class, setWork_Class] = useState([]);
  const [Original_Periority, setOriginal_Periority] = useState([]);

  const [Originator, setOriginator] = useState([]);
  const [WorkOrderNo, setWorkOrderNo] = useState("");

  const [selected_Asset_Status, setSelected_Asset_Status] = useState([]);
  const [selected_Asset_Group_Code, setSelected_Asset_Group_Code] = useState(
    []
  );

  const [selected_Originator, setSelected_Originator] = useState([]);

  const [Phone, setPhone] = useState("");
  const [OriginationDate, setOriginationDate] = useState(new Date());
  const [DueDate, setDueDate] = useState(new Date());
  const [CorrectiveAction, setCorrectiveAction] = useState("");
  const [selected_Original_Periority, setSelected_Original_Periority] =
    useState([]);
  const [selected_Cause_Code, setSelected_Cause_Code] = useState([]);
  const [ScheduleDate, setScheduleDate] = useState();
  const [selected_Action_Code, setSelected_Action_Code] = useState([]);
  const [ExceptionDate, setExceptionDate] = useState();
  const [selected_Delay_Code, setSelected_Delay_Code] = useState([]);
  const [StatusChangeDate, setStatusChangeDate] = useState();
  const [Project_ID, setProject_ID] = useState([]);

  const [selected_Work_Type, setSelected_Work_Type] = useState([]);
  const [CompletionDate, setCompletionDate] = useState();
  const [CompletionDate2, setCompletionDate2] = useState(new Date());

  const [selected_Work_Class, setSelected_Work_Class] = useState([]);
  const [CloseDate, setCloseDate] = useState();
  const [CloseDate2, setCloseDate2] = useState(new Date());
  const [selected_Supervisor_ID, setSelected_Supervisor_ID] = useState([]);
  const [Planner, setPlanner] = useState([]);
  const [selected_Planner, setSelected_Planner] = useState([]);

  const [Approver, setApprover] = useState([]);
  const [selected_Approver, setSelected_Approver] = useState([]);

  const [Assign_To, setAssign_To] = useState([]);
  const [selected_Assign_To, setSelected_Assign_To] = useState([]);

  const [Temporary_Asset, setTemporary_Asset] = useState(false);
  const [CheckBox_Temporary_Asset, setCheckBox_Temporary_Asset] = useState("0");

  const [Approved, setApproved] = useState(false);
  const [CheckBox_Approved, setCheckBox_Approved] = useState("0");

  const [Safety, setSafety] = useState(false);
  const [CheckBox_Safety, setCheckBox_Safety] = useState("0");

  const [Credit_Cost_Center, setCredit_Cost_Center] = useState([]);
  const [selected_Credit_Cost_Center, setSelected_Credit_Cost_Center] =
    useState([]);

  const [Miscellaneous_Account, setMiscellaneous_Account] = useState([]);
  const [selected_Miscellaneous_Account, setSelected_Miscellaneous_Account] =
    useState([]);

  const [Columns, setColumns] = useState([]);
  const [Data, setData] = useState([]);
  const [AutoNumring, setAutoNumring] = useState("");

  const [UDFNote1, setUDFNote1] = useState("");

  const [Button_save, setButton_save] = useState("");
  const [getDbImgRowId, setDbImgRowId] = useState("");
  const [SpecialOdrResult, setSpecialOdrResult] = useState([]);

  const [steps, setsteps] = useState([]);
  const StatushandleClose = () => setStatusShow(false);

  const [StatusShow, setStatusShow] = useState(false);

  const [message, setMessage] = useState("");
  const [imageComment, setimageComment] = useState(null);
  const messageRef = useRef(null);
  const [AllCommnet, setAllComment] = useState([]);

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef2 = useRef(null);
  const [selectedImageCommnt, setSelectedImageCommnt] = useState(null);

  const [uploadImgShow, setUploadImgShow] = useState(false);
  const UploadImghandleClose = () => setUploadImgShow(false);
  const chatContainerRef = useRef(null);
  const [isFiledValueEmpty, setIsFiledValueEmpty] = useState(false);

  const [isChargeCostEmpty, setIsChargeCostEmpty] = useState(false);
  const [isFaultCodeEmpty, setIsFaultCodeEmpty] = useState(false);
  const [isOriginalPeriorityEmpty, setIsOriginalPeriorityEmpty] =
    useState(false);
  const [isWorkTypeEmpty, setIsWorkTypeEmpty] = useState(false);
  const [isWorkGroupEmpty, setIsWorkGroupEmpty] = useState(false);
  const [isAssetNoEmpty, setIsAssetNoEmpty] = useState(false);
  const [isCorrectiveValueEmpty, setIsCorrectiveValueEmpty] = useState(false);
  const [isCauseCodeValueEmpty, setIsCauseCodeValueEmpty] = useState(false);
  const [isActionCodeValueEmpty, setIsActionCodeValueEmpty] = useState(false);
  const [isOpenWork, setIsOpenWork] = useState(true);
  const [isOpenAsset, setIsOpenAsset] = useState(true);

  const autocompleteRef = useRef(null);
  const assetNoAutocompleteRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const [PMSetupShow, setPMSetupShow] = useState(false);
  const PMSetuphandleClose = () => setPMSetupShow(false);
  const PMSetuphandleShow = () => setPMSetupShow(true);

  const [WOHistoryShow, setWOHistoryShow] = useState(false);
  const WOHistoryhandleClose = () => setWOHistoryShow(false);
  const WOHistoryhandleShow = () => setWOHistoryShow(true);

  const [RelocationHistoryShow, setRelocationHistoryShow] = useState(false);
  const RelocationHistoryhandleClose = () => setRelocationHistoryShow(false);
  const RelocationHistoryhandleShow = () => setRelocationHistoryShow(true);

  const [CheckListShow, setCheckListShow] = useState(false);
  const CheckListhandleClose = () => setCheckListShow(false);
  const CheckListhandleShow = () => setCheckListShow(true);

  const[InventoryMandatoryFiled, setInventoryMandatoryFiled] = useState([]);
  const [errorField, setErrorField] = useState(null);

  // console.log("InventoryMandatoryFiled____",InventoryMandatoryFiled);
  /*   new state added by satya 24-5-2024 */

  const [type, setType] = useState([
    { label: "Stock", value: "P" },
    { label: "Tool", value: "T" },
    { label: "Serialize", value: "S" },
    { label: "Serialize With Asset", value: "Z" },
  ]);



  const [selected_Type, setSelected_Type] = useState([]);

  const [stockNo, setStockNo] = useState([]);
  const [stockNoText, setStockNoText] = useState([]);

  const [commodity, setCommodity] = useState([]);
  const [selected_Commodity, setSelected_Commodity] = useState([]);

  const [stockGroup, setStockGroup] = useState([]);
  const [selected_stockGroup, setSelected_stockGroup] = useState([]);

  const [orderRule, setOrderRule] = useState([]);
  const [selected_orderRule, setSelected_orderRule] = useState([]);

  const [costCenter, setCostCenter] = useState([]);
  const [selected_costCenter, setSelected_costCenter] = useState([]);

  const [account, setAccount] = useState([]);
  const [selected_account, setSelected_account] = useState([]);

  const [Short_Description, setShort_Description] = useState("");
  const [Long_Description, setLong_Description] = useState("");

  const [continuousadd, setcontinuousAdd] = useState(false);

  const [partDeacStatus, setpartDeacStatus] = useState([]);
  const [selected_partDeacStatus, setSelected_partDeacStatus] = useState([]);

  const [issueUom, setIssueUom] = useState([]);
  const [selected_issueUom, setSelected_IssueUom] = useState([]);

  const [recivedUom, setRecivedUom] = useState([]);
  const [selected_recivedUom, setSelected_RecivedUom] = useState([]);
  
  const [conversionFactor, setConversionFactor] = useState("1.0000");
  
  const [storageType, setStorageType] = useState([]);
  const [selected_storageType, setSelected_StorageType] = useState([]);

  const [Cube, setCube] = useState("");
  const [shelfLife, setshelfLife] = useState("");

  const [eOQ, setEOQ] = useState("");
  const [countFrequency, setCountFrequency] = useState("");
  const [averageLeadTime, setAverageLeadTime] = useState("");


  const [autoSpare, setAutoSpare] = useState(0);
  const [criticalSpare, setriticalSpare] = useState(0);
  const [HazardousMaterial, setHazardousMaterial] = useState(0);

  const [abcClass, setAbcClass] = useState("");
  const [orderPoint, setOrderPoint] = useState("");
  const [maximumInvtr, setMaximumInvtr] = useState("");
  

  const [MasterLocationCode, setMasterLocationCode] = useState("");
  const MasterLocationCodeRef = useRef(null);

  const [PartNo, setPartNo] = useState("");

 
  const [udfNote1, setUdfNote1] = useState("");
  const [assetNoSet, setAssetNoSet] = useState("");
  const [weightSet, setWeightSet] = useState("");
  const [UDFText_3, setUDFText_3] = useState("");
  const [UDFText_4, setUDFText_4] = useState("");
  const [UDFText_5, setUDFText_5] = useState("");
  const [UDFText_6, setUDFText_6] = useState("");
  const [UDFText_7, setUDFText_7] = useState("");
  const [UDFText_8, setUDFText_8] = useState("");
  const [UDFText_9, setUDFText_9] = useState("");
  const [UDFText_10, setUDFText_10] = useState("");

  const [UDFNumber_1, setUDFNumber_1] = useState("0.00");
  const [UDFNumber_2, setUDFNumber_2] = useState("0.00");
  const [UDFNumber_3, setUDFNumber_3] = useState("0.00");
  const [UDFNumber_4, setUDFNumber_4] = useState("0.00");
  const [UDFNumber_5, setUDFNumber_5] = useState("0.00");

  const [UDFDate_1, setUDFDate_1] = useState(new Date());
  const [UDFDate_2, setUDFDate_2] = useState(new Date());
  const [UDFDate_3, setUDFDate_3] = useState(new Date());
  const [UDFDate_4, setUDFDate_4] = useState(new Date());
  const [UDFDate_5, setUDFDate_5] = useState(new Date());

  const [accountType, setAccountType] = useState([
    { label: "INVENTORY", value: "I" },
    { label: "EXPENSE", value: "E" },
    
  ]);

  const [selected_AccountType, setSelected_AccountType] = useState([]);
  const [taxCode, setTaxCode] = useState("");
 
  const [ytdUsage, setYtdUsage] = useState("0.0000");
  const [ytdTurns, setYtdTurns] = useState("0.0000");
  const [ytdStockouts, setYtdStockouts] = useState("0.0000");
  const [lastyrUsage, setLastyrUsage] = useState("0.0000");
  const [lastyrTurns, setLastyrTurns] = useState("0.0000");
  const [lastyrStkouts, setLastyrStkouts] = useState("0.0000");
 
  const ccyFormat = (num) => `${num.toFixed(2)}`;
  
  const rowsddd = [

  { id: 1, code:'AVG', costingRule: 'Average', itemCost: '', totalOnHand: 0, totalRepairLocation: 0, value: 0 },
  { id: 2, code:'STD', costingRule: 'Standard', itemCost: '', totalOnHand: 0, totalRepairLocation: 0, value: 0 },
  { id: 3, code:'LST', costingRule: 'Last', itemCost: '', totalOnHand: 0, totalRepairLocation: 0, value: 0 },
  { id: 4, code:'FIFO', costingRule: 'FIFO', itemCost: '', totalOnHand: 0, totalRepairLocation: 0, value: 0 },
    ];

  const [selectedRowd, setSelectedRowd] = useState(null);
  const [costingValue, setcostingValue] = useState("");
  const [inputValues, setInputValues] = useState({});
  
 // console.log("costingValue___",costingValue);
  const handleRadioChange = (rowId,value) => {
    setSelectedRowd(rowId);
    setcostingValue(value);
  
    if (!inputValues[rowId]) {
      setInputValues(prevValues => ({
        ...prevValues,
        [rowId]: { itemCost: '' }
      }));
    }
    // setInputValues(prevValues => ({
    //   ...Object.keys(prevValues).reduce((acc, key) => {
    //     acc[key] = { itemCost: key == rowId ? prevValues[key]?.itemCost : '' };
    //     return acc;
    //   }, {}),
    //   [rowId]: { itemCost: prevValues[rowId]?.itemCost || '' }
    // }));
  };

  const handleInputChange = (rowId, value) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [rowId]: { ...prevValues[rowId], itemCost: value }
    }));
  };
  const [getissuePrice, setissuePrice] = useState("");
  const selectedRowData = rowsddd.find(row => row.id === selectedRowd);
  const itemCost = parseFloat(inputValues[selectedRowd]?.itemCost || 0);
  const issuePrice = parseFloat(inputValues[selectedRowd]?.itemCost || 0);

// Error State 
const [isTypeEmpty, setIsTypeEmpty] = useState(false);
const [isCommodityCodeEmpty,setIsCommodityCodeEmpty] = useState(false);
const [isStockNo,setIsStockNo] = useState(false);
const [isMasterLocationEmpty, setIsMasterLocationEmpty] = useState(false);
const [isOrderRuleEmpty, setIsOrderRuleEmpty] = useState(false);
const [isCostCenterEmpty,setIsCostCenterEmpty] = useState(false);
const [isAccountEmpty,setIsAccountEmpty] = useState(false);
const [isDescEmpty,setIsDescEmpty] = useState(false);
const [isPartDeacEmpty,setIsPartDeacEmpty] = useState(false);
const [isIssueUomEmpty,setIsIssueUomEmpty] = useState(false);
const [isReciveUomEmpty,setIsReciveUomEmpty] = useState(false);
 
  useEffect(() => {
    async function fetchData() {
      if (typeof RowID !== "undefined" && RowID !== null && RowID !== "") {
        setButton_save("Update");
        console.log("Edit_______page___");
        await get_inventory_master_form_data();
        await fetchStatusData();
        await getInventoryFromLebel();
        await getInventoryMandatoryfiled();
      } else if (
        typeof DuplicatRowid !== "undefined" &&
        DuplicatRowid !== null &&
        DuplicatRowid !== ""
      ) {
        setButton_save("Duplicate");
        await get_inventory_master_form_data();
        await fetchStatusData();
        await getInventoryFromLebel();
        await getInventoryMandatoryfiled();
      } else {
        await getInventoryFromLebel();
        await fetchStatusData();
        await getInventoryMandatoryfiled();
        //  await fetchStusPriortyData();
        setButton_save("Save");
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // test funcation

  // Get All Filed label Name
  const getInventoryFromLebel = async () => {
    try {
      const response = await httpCommon.get(
        "/get_InventoryMasterFormLebal.php"
      );
      //console.log("response____getLabel",response);
      if (response.data.status === "SUCCESS") {
        setItmMstLabel(response.data.data.itm_mst);
        setItmdetLabel(response.data.data.itm_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Get All Filed label Name
  const getInventoryMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_inventoryMasterMandatoryFiled.php");
      if (response.data.data.MandatoryField.length > 0) {
        setInventoryMandatoryFiled(response.data.data.MandatoryField);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const get_inventory_master_form_data = async () => {
    var json = {
      site_cd: site_ID,
      RowId:
        DuplicatRowid !== undefined && DuplicatRowid !== "" ? DupRowID : RowID,
    };
    try {
      const response = await httpCommon.post(
        "/get_inventory_Edit_formData.php",
        JSON.stringify(json)
      );
       console.log("Get_inventory Data", response);
      if (response.data.status === "SUCCESS") {
        const data = response.data.data[0];
        
        if (RowID !== undefined && RowID !== "") {
         // setStockNoText(data.itm_mst_stockno);
          setStockNoText(data.itm_mst_stockno);
          setissuePrice(data.itm_det_issue_price);
          setAbcClass(data.itm_det_abc_class);
        }

        setShort_Description(data.itm_mst_desc);
        setLong_Description(data.itm_mst_ext_desc);

        if (data.itm_mst_type === "P") {
          setSelected_Type({ label: "Stock" });
        } else if (data.itm_mst_type === "T") {
          setSelected_Type({ label: "Tool" });
        } else if (data.itm_mst_type === "S") {
          setSelected_Type({ label: "Serialize" });
        } else if (data.itm_mst_type === "Z") {
          setSelected_Type({ label: "Serialize With Asset" });
        }
        
        if (data.itm_mst_mstr_locn !== undefined && data.itm_mst_mstr_locn !== null) {
          setMasterLocationCode(data.itm_mst_mstr_locn);
        }
        setSelected_orderRule({
          label:
            data.itm_mst_order_rule +
            " : " +
            data.odr_mst_desc,
        });
        setSelected_costCenter({
          label:
            data.itm_mst_costcenter +
            " : " +
            data.cost_center_desc,
        });
        setSelected_account({
          label:
            data.itm_mst_account +
            " : " +
            data.account_desc,
        });

        const labelCommodity = (data.itm_mst_com_code === null && data.com_mst_desc === null) 
          ? "" 
          : `${data.itm_mst_com_code || ""} : ${data.com_mst_desc || ""}`;
        setSelected_Commodity({ labelCommodity });

        const labelstockGroup = (data.itm_mst_itm_grp === null && data.itm_group_desc === null) 
          ? "" 
          : `${data.itm_mst_itm_grp || ""} : ${data.itm_group_desc || ""}`;
          setSelected_stockGroup({ labelstockGroup });


        setSelected_partDeacStatus({
          label:
            data.itm_det_part_deac_status +
            " : " +
            data.part_deac_desc,
        });
        setSelected_IssueUom({
          label:
             data.itm_det_issue_uom +
            " : " +
             data.issue_uom_desc,
        });

        setSelected_RecivedUom({
          label:
             data.itm_det_rcv_uom +
            " : " +
             data.issue_uom_desc,
        });

        const labelStorageType = (data.itm_det_storage_type === null && data.storage_desc === null) 
          ? "" 
          : `${data.itm_det_storage_type || ""} : ${data.storage_desc || ""}`;
          setSelected_StorageType({ labelStorageType });

        setPartNo(data.itm_mst_partno);
        setCube(data.itm_det_cube);
        setshelfLife(data.itm_det_shelf_life);
        setAutoSpare(data.itm_det_auto_spare);
        setriticalSpare(data.itm_det_critical_spare);
        setHazardousMaterial(data.itm_det_hzd_mtl);
        
        setOrderPoint(data.itm_det_order_pt);
        setMaximumInvtr(data.itm_det_maximum);
        setUdfNote1(data.itm_det_note1);
        setAssetNoSet(data.itm_det_varchar1);
        setWeightSet(data.itm_det_varchar2);
        setUDFText_3(data.itm_det_varchar3);
        setUDFText_4(data.itm_det_varchar4);
        setUDFText_5(data.itm_det_varchar5);
        setUDFText_6(data.itm_det_varchar6);
        setUDFText_7(data.itm_det_varchar7);
        setUDFText_8(data.itm_det_varchar8);
        setUDFText_9(data.itm_det_varchar9);
        setUDFText_10(data.itm_det_varchar10);

        setUDFNumber_1(data.itm_det_numeric1);
        setUDFNumber_2(data.itm_det_numeric2);
        setUDFNumber_3(data.itm_det_numeric3);
        setUDFNumber_4(data.itm_det_numeric4);
        setUDFNumber_5(data.itm_det_numeric5);

        if (data.itm_det_datetime1 == null) {
          setUDFDate_1("");
        } else {
          const apiDate = data.itm_det_datetime1.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_1(formattedDate);
        }

        if (data.itm_det_datetime2 == null) {
          setUDFDate_2("");
        } else {
          const apiDate = data.itm_det_datetime2.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_2(formattedDate);
        }

        if (data.itm_det_datetime3 == null) {
          setUDFDate_3("");
        } else {
          const apiDate = data.itm_det_datetime3.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_3(formattedDate);
        }

        if (data.itm_det_datetime4 == null) {
          setUDFDate_4("");
        } else {
          const apiDate = data.itm_det_datetime4.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_4(formattedDate);
        }

        if (data.itm_det_datetime5 == null) {
          setUDFDate_5("");
        } else {
          const apiDate = data.itm_det_datetime5.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_5(formattedDate);
        }

        if (data.itm_det_acct_type === "I") {
          setSelected_AccountType({ label: "INVENTORY" });
        } else if (data.itm_det_acct_type === "E") {
          setSelected_AccountType({ label: "EXPENSE" });
        }
        
        setTaxCode(data.itm_det_tax_cd);  //  itm_det_cr_code
        setcostingValue(data.itm_det_cr_code);
       

        if (RowID !== undefined && RowID !== "") {
          const matchedRow = rowsddd.find(row => row.code === data.itm_det_cr_code);
          if (matchedRow) {
            setSelectedRowd(matchedRow.id);
            setInputValues(prevValues => ({
              ...prevValues,
              [matchedRow.id]: { itemCost: data.itm_det_issue_price }
            }));
          }
        }
       
       
        if (DuplicatRowid == null) {
          fetchImgData();
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops select Inventory Not Found...",
        text: error,
      });
    }
  };

  // Second Api call fetch all dropdowwn data
  const fetchStatusData = async () => {
    try {
      const response = await httpCommon.get(
        "/get_InventoryMasterFormDropdown.php?site_cd=" + site_ID
      );
       //console.log("response____status__111", response);
      let Commodity = response.data.data.CommodityCode.map((item) => ({
        label: item.com_mst_com_code + " : " + item.com_mst_desc,
        value: item.com_mst_desc,
        key: item.com_mst_com_code,
      }));

      setCommodity(Commodity);

      let StockGroup = response.data.data.StockGroup.map((item) => ({
        label: item.itm_grp_cd + " : " + item.itm_grp_desc,
        value: item.itm_grp_desc,
      }));
      setStockGroup(StockGroup);

      let Order_Rule = response.data.data.OrderRule.map((item) => ({
        label: item.odr_mst_odr + " : " + item.odr_mst_desc,
        value: item.odr_mst_desc,
      }));
      setOrderRule(Order_Rule);

      let Charge_Cost_Center = response.data.data.CostCenter.map((item) => ({
        label: item.costcenter + " : " + item.descs,
        value: item.descs,
      }));
      setCostCenter(Charge_Cost_Center);

      let Accoun_t = response.data.data.Account.map((item) => ({
        label: item.account + " : " + item.descs,
        value: item.descs,
      }));
      setAccount(Accoun_t);

      let partDeacStatus = response.data.data.PartDeac.map((item) => ({
        label: item.itm_sts_status + " : " + item.itm_sts_desc,
        value: item.itm_sts_desc,
      }));
      setpartDeacStatus(partDeacStatus);

      let IssueUom = response.data.data.IssueUoM.map((item) => ({
        label: item.uom_mst_uom + " : " + item.uom_mst_desc,
        value: item.uom_mst_desc,
      }));
      setIssueUom(IssueUom);

      let RecivedUom = response.data.data.IssueUoM.map((item) => ({
        label: item.uom_mst_uom + " : " + item.uom_mst_desc,
        value: item.uom_mst_desc,
      }));
      setRecivedUom(RecivedUom);

      let Storage_type = response.data.data.StorageType.map((item) => ({
        label: item.stt_mst_stt + " : " + item.stt_mst_desc,
        value: item.stt_mst_desc,
      }));
      setStorageType(Storage_type);

      let Storage_no = response.data.data.StockNO.map((item) => ({
        label: item.ast_grp_grp_cd + " : " + item.ast_grp_desc,
        value: item.ast_grp_desc,
      }));
      setStockNo(Storage_no);

      /*   end */
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Thired Api Call
  const fetchImgData = async () => {
    try {
      const response = await httpCommon.get(
        "/get_inventory_Edit_form_img.php?RowID=" + RowID
      );

      //  console.log("response____img____",response);
      if (response.data.data) {
        // Check if AllImgGet exists and has items

        if (
          response.data.data.AllImgGet &&
          response.data.data.AllImgGet.length > 0
        ) {
          setDbImg(response.data.data.AllImgGet);
          setDbImgRowId(response.data.data.AllImgGet[0].RowID);
          setImageSelect({
            name: response.data.data.AllImgGet[0].file_name,
            path: response.data.data.AllImgGet[0].attachment,
          });
        }

        // Check if AllRef exists and has items
        if (response.data.data.AllRef && response.data.data.AllRef.length > 0) {
          setRefImg(response.data.data.AllRef);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const openSaveImg = () => {
    setShowdd2(true);
  };
  // First main Img funcation
  const handleDeleteImgApi = (ImgIDdlt) => {
    const updatedImages = getDbImg.filter((image) => image.RowID !== ImgIDdlt);

    // Update the state with the new array of images after the deletion
    setDbImg(updatedImages);
    setDisabledBtn(true);
    setImageSelect({ name: "", path: "" });
  };
  const handleImgChangeSingle = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
      setDisabledBtn(true);
    }
    // Img set for data api
    if (getDbImg != "") {
      setDbImg("");
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSelect({ name: file.name, path: reader.result });
    };

    reader.readAsDataURL(file);
  };
  const clearDataImg = () => {
    setImage("");
  };
  const handleClearImg = (event) => {
    event.preventDefault();
    clearDataImg();
    setDisabledBtn(false);
  };
  const handleImgChangeSingle2 = (e) => {
    setDisabledBtn(false);
  };
  // Refrence Imge funcation
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleDeleteImg = (e) => {
    const s = selectedImages.filter((item, index) => index !== e);
    setSelectedImages(s);
  };
  const handleShowdata = (item) => {
    setSelectedImage(item.attachment);
    setShowdd(true);
  };
  const openPDFInNewTab = (fileName) => {
    const binaryData = atob(fileName);

    const byteArray = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    // Step 3: Create a Blob from the typed array
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Step 4: Generate a URL for the blob
    const url = URL.createObjectURL(blob);

    // Step 5: Open the URL in a new tab
    window.open(url, "_blank");
  };
  const handleDeleteReferenceApi = (RefImgDlt) => {
    const removedItem = RefImg.find((item) => item.RowID === RefImgDlt);
    const updatedRefImg = RefImg.filter((item) => item.RowID !== RefImgDlt);
    setRefImg(updatedRefImg);
    setRemovedRefItems((prevRemovedRefItems) => [
      ...prevRemovedRefItems,
      removedItem,
    ]);
  };
  const handleShowdd = (e, rowData) => {
    sethandalImg(rowData);
    setShowdd(true);
  };
  const isMyStateEmpty =
    Object.keys(handalImg).length === 0 && handalImg.constructor === Object;
  function handleImageChange(event) {
    const files = event.target.files;

    setSelectedPdfFiles((prevSelectedPdfFiles) => [
      ...prevSelectedPdfFiles,
      ...files,
    ]);
    const selectedImagesArray = [...selectedImages2];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageData = {
          name: files[i].name,
          type: files[i].type,
          base64: event.target.result,
        };
        selectedImagesArray.push(imageData);
        if (selectedImagesArray.length === files.length) {
          setSelectedImages2(selectedImagesArray);
          //setImageSelect({ name: file.name, path: reader.result });
        }
      };
      reader.readAsDataURL(files[i]);
    }
    setSelectedImages([...selectedImages, ...files]);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    selectedImages.forEach((file) => {
      formData.append("files[]", file);
    });
  };
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = itmMstLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };
  // WorkReq Label Details table
  const findCustomizeLabelDet = (columnName) => {
    const matchingColumn = itmdetLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = InventoryMandatoryFiled.find(
      (item) => item.column_name === columnName
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
    }
    return "";
  };

  // staya added today

    const [modalOpenMasterLocation, setOpenMasterLocation] = useState(false);
    const [modalOpenInventoryMasteLocation, setModalOpenInventoryMasteLocation] =
    useState(false);

    const [modalOpenInventoryTaxCode, setModalOpenInventoryTaxCode] = useState(false);

  //get Asset Parent Flag data onther component
  const handleEditClick = () => {
    setOpenMasterLocation(true);
  };

  const handleCancelClick = () => {
    setPermanentIDFlag("");
  };

  function handleCloseModal() {
    setOpenMasterLocation(false);
  }

  const handleCancelMasterLocation = () => {
    setMasterLocationCode("");
  };
  const handleEditClickMasterLocation = () => {
    setModalOpenInventoryMasteLocation(true);
    setIsMasterLocationEmpty(false);
  };
  function handleCloseModalMasterLocation() {
    setModalOpenInventoryMasteLocation(false);
  }

  const handleCancelTaxCode = () => {
    setTaxCode("");
  };

  const handleEditClickTaxCode = () => {
    setModalOpenInventoryTaxCode(true);
  };
  function handleCloseModalMasterTaxCode() {
    setModalOpenInventoryTaxCode(false);
  }
  const get_assetmaster_select = async (selected_asset) => {
    let site_ID = localStorage.getItem("site_ID");
    const parts = selected_asset.split(":");
    const valueBeforeColon = parts[0].trim();

    if (selected_asset != "") {
      try {
        const response = await httpCommon.get(
          "/get_workOrderAssetmaster_select.php?site_cd=" +
            site_ID +
            "&ast_mst_asset_no=" +
            valueBeforeColon +
            "&asset_shortdesc=" +
            "" +
            "&cost_center=" +
            "" +
            "&asset_status=" +
            "" +
            "&asset_type=" +
            "" +
            "&asset_grpcode=" +
            "" +
            "&work_area=" +
            "" +
            "&asset_locn=" +
            "" +
            "&asset_code=" +
            "" +
            "&ast_lvl=" +
            "" +
            "&ast_sts_typ_cd=" +
            "" +
            "&createby=" +
            "" +
            "&service_type=" +
            "" +
            "&block=" +
            "" +
            "&floor=" +
            ""
        );

        if (response.data.status === "SUCCESS") {
          setSelected_Asset_Status({
            label: response.data.data["0"].ast_mst_asset_status,
          });
          setSelected_Asset_Status({
            label: response.data.data["0"].ast_mst_asset_status,
          });
          setSelected_Asset_Group_Code({
            label:
              response.data.data["0"].ast_mst_asset_grpcode +
              " : " +
              response.data.data["0"].ast_grp_desc,
          });
          setSelected_Charge_Cost_Center({
            label:
              response.data.data["0"].ast_mst_cost_center +
              " : " +
              response.data.data["0"].descs,
          });
          setSelected_Work_Area({
            label:
              response.data.data["0"].ast_mst_work_area +
              " : " +
              response.data.data["0"].mst_war_desc,
          });
          setSelected_Asset_Level({
            label:
              response.data.data["0"].ast_mst_ast_lvl +
              " : " +
              response.data.data["0"].ast_lvl_desc,
          });
          setSelected_Asset_Location({
            label:
              response.data.data["0"].ast_mst_asset_locn +
              " : " +
              response.data.data["0"].ast_loc_desc,
          });
          setSelected_Work_Group({
            label:
              response.data.data["0"].ast_mst_wrk_grp +
              " : " +
              response.data.data["0"].wrk_grp_desc,
          });

          Swal.close();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.data,
          });
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Oops get_assetmaster_select...",
          text: e,
        });
      }
    }
  };

  const handleSelectedAssetNo = (dataa) => {
    get_assetmaster_select(dataa);
  };

  const handleRowData2 = (dataLenth, dataa, dataSecond) => {
    // Use the row data in the second component
    setPermanentIDFlag(dataa);

    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
    // if (dataa !== undefined && dataa !== null) {
    //   handleSelectedAssetNo(dataa);
    // }
    if (dataSecond == "1") {
      setOpenMasterLocation(false);
      setTotalSearch("");
    }
  };

  const handleRowData3 = (dataLenth, dataa, dataSecond) => {
    // Use the row data in the second component
    setMasterLocationCode(dataa);

    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
    // if (dataa !== undefined && dataa !== null) {
    //   handleSelectedAssetNo(dataa);
    // }
    if (dataSecond == "1") {
      setModalOpenInventoryMasteLocation(false);
      setTotalSearch("");
    }
  };
  

  const handleRowDataPagechg = (pageCount) => {
    setViewedTotlRows(pageCount);
  };

  const handelRowSearch = (searchTotl) => {
    setTotalSearch(searchTotl);
  };

  const handleRowDataTaxCode = (dataLenth, dataa, dataSecond) => {
    // Use the row data in the second component
    setTaxCode(dataa);

    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
    // if (dataa !== undefined && dataa !== null) {
    //   handleSelectedAssetNo(dataa);
    // }
    if (dataSecond == "1") {
      setModalOpenInventoryTaxCode(false);
      setTotalSearch("");
    }
  };
  const handleRowDataPagechgTaxCode = (pageCount) => {
    setViewedTotlRows(pageCount);
  };

  const handelRowSearchTaxCode = (searchTotl) => {
    setTotalSearch(searchTotl);
  };

  function CustomTextField({ rightIcons, ...props }) {
    return (
      <TextField
        {...props}
        InputProps={{
          endAdornment: rightIcons && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              {rightIcons.map((icon, index) => (
                <IconButton key={index} onClick={icon.props.onClick}>
                  {icon}
                </IconButton>
              ))}
            </div>
          ),
        }}
      />
    );
  }
//console.log("selected_Type______",selected_Type);
  /*   add new asset code by stay */
  const New_Inventory = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });

     // Swal.showLoading();
    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
   //let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");
    console.log("emp_mst_login_id____",emp_mst_login_id);

     let TotalOH = "0.0000";
     let IssuePrice = "0.00";
     let SerializeCounter = "100001";

   // selected_Commodity
     let Commodity, setCommodity;
     if (selected_Commodity.label == "" || selected_Commodity.label == null) {
      setCommodity = "";
     } else {
      Commodity = selected_Commodity.label.split(":");
       setCommodity = Commodity[0];
      // console.log("Commodity: ", Commodity[0])
     }

    //selected_StockNo stockNoText
     let selectedStockNo, setselectedStockNo;
     if (stockNoText.label == "" || stockNoText.label == null) {
      setselectedStockNo = stockNoText;
     } else {
      selectedStockNo = stockNoText.label.split(":");
       setselectedStockNo = selectedStockNo[0];
      // console.log("selectedStockNo: ", selectedStockNo[0])
     }

    //selected_stockGroup
    let selectedstockGroup, setselectedstockGroup;
     if (selected_stockGroup.label == "" || selected_stockGroup.label == null) {
      setselectedstockGroup = "";
     } else {
      selectedstockGroup = selected_stockGroup.label.split(":");
      setselectedstockGroup = selectedstockGroup[0];
       //console.log("selectedstockGroup: ", selectedstockGroup[0])
     } 

     //selected_orderRule
     let selectedorderRule, setselectedorderRule;
     if (selected_orderRule.label == "" || selected_orderRule.label == null) {
      setselectedorderRule = "";
     } else {
      selectedorderRule = selected_orderRule.label.split(":");
      setselectedorderRule = selectedorderRule[0];
       //console.log("selectedstockGroup: ", selectedorderRule[0])
     } 
     //selected_costCenter
     let selectedcostCenter, setselectedcostCenter;
     if (selected_costCenter.label == "" || selected_costCenter.label == null) {
      setselectedcostCenter = "";
     } else {
      selectedcostCenter = selected_costCenter.label.split(":");
      setselectedcostCenter = selectedcostCenter[0];
       //console.log("selectedstockGroup: ", selectedcostCenter[0])
     } 
     //selected_account
     let selectedaccount, setselectedaccount;
     if (selected_account.label == "" || selected_account.label == null) {
      setselectedaccount = "";
     } else {
      selectedaccount = selected_account.label.split(":");
      setselectedaccount = selectedaccount[0];
       //console.log("selectedstockGroup: ", selectedaccount[0])
     } 
     //selected_partDeacStatus,
     let selectedpartDeacStatus, setselectedpartDeacStatus;
     if (selected_partDeacStatus.label == "" || selected_partDeacStatus.label == null) {
      setselectedpartDeacStatus = "";
     } else {
      selectedpartDeacStatus = selected_partDeacStatus.label.split(":");
      setselectedpartDeacStatus = selectedpartDeacStatus[0];
       //console.log("selectedstockGroup: ", selectedpartDeacStatus[0])
     } 
     //selected_issueUom,
     let selectedissueUom, setselectedissueUom;
     if (selected_issueUom.label == "" || selected_issueUom.label == null) {
      setselectedissueUom = "";
     } else {
      selectedissueUom = selected_issueUom.label.split(":");
      setselectedissueUom = selectedissueUom[0];
       //console.log("selectedstockGroup: ", selectedissueUom[0])
     }
     //selected_recivedUom,
     let selectedrecivedUom, setselectedrecivedUom;
     if (selected_recivedUom.label == "" || selected_recivedUom.label == null) {
      setselectedrecivedUom = "";
     } else {
      selectedrecivedUom = selected_recivedUom.label.split(":");
      setselectedrecivedUom = selectedrecivedUom[0];
       //console.log("selectedstockGroup: ", selectedrecivedUom[0])
     }
     //selected_storageType
     let selectedstorageType, setselectedstorageType;
     if (selected_storageType.label == "" || selected_storageType.label == null) {
      setselectedstorageType = "";
     } else {
      selectedstorageType = selected_storageType.label.split(":");
      setselectedstorageType = selectedstorageType[0];
      // console.log("selectedstockGroup: ", selectedstorageType[0])
     }
   
      // select UDFDate_1 
      let date_of_1 = "";
      if (UDFDate_1 == "" || UDFDate_1 == null) {
        date_of_1 = "";
      } else {
        date_of_1 = Moment(UDFDate_1)
          .format("yyyy-MM-DD HH:mm:ss")
          .trim();
      }
      // select UDFDate_2
      let date_of_2 = "";
      if (UDFDate_2 == "" || UDFDate_2 == null) {
        date_of_2 = "";
      } else {
        date_of_2 = Moment(UDFDate_2)
          .format("yyyy-MM-DD HH:mm:ss")
          .trim();
      }
      // select UDFDate_3
      let date_of_3 = "";
      if (UDFDate_3 == "" || UDFDate_3 == null) {
        date_of_3 = "";
      } else {
        date_of_3 = Moment(UDFDate_3)
          .format("yyyy-MM-DD HH:mm:ss")
          .trim();
      }
      // select UDFDate_4
      let date_of_4 = "";
      if (UDFDate_4 == "" || UDFDate_4 == null) {
        date_of_4 = "";
      } else {
        date_of_4 = Moment(UDFDate_4)
          .format("yyyy-MM-DD HH:mm:ss")
          .trim();
      }

      // select UDFDate_5
      let date_of_5 = "";
      if (UDFDate_5 == "" || UDFDate_5 == null) {
        date_of_5 = "";
      } else {
        date_of_5 = Moment(UDFDate_5)
          .format("yyyy-MM-DD HH:mm:ss")
          .trim();
      }
      let itmmsttype = "";

      if (selected_Type) {
        switch (selected_Type.label) {
          case "Stock":
            itmmsttype = "P";
            break;
          case "Tool":
            itmmsttype = "T";
            break;
          case "Serialize":
            itmmsttype = "S";
            break;
          case "Serialize With Asset":
            itmmsttype = "Z";
            break;
          default:
            itmmsttype = "";
            break;
        }
      }

    // selected_AccountType
    let selectedAccountType, setselectedAccountType;
     if (selected_AccountType.label == "" || selected_AccountType.label == null) {
      setselectedAccountType = "";
     } else {
      selectedAccountType = selected_AccountType.label;
      setselectedAccountType = selectedAccountType;
       //console.log("selectedstockGroup: ", selectedAccountType[0])
     }

    let missingFields = [];

    var json_AssetInsert = {
      site_cd: site_ID,
      itm_mst_stockno: setselectedStockNo ? setselectedStockNo.trim() : stockNoText,
      itm_mst_partno: PartNo.trim(),
      itm_mst_desc: Short_Description.trim(),
      itm_mst_issue_price: IssuePrice.trim(),
      itm_mst_ttl_oh: TotalOH.trim(),
      itm_mst_issue_uom: setselectedissueUom.trim(),
      itm_mst_com_code: setCommodity.trim(),
      itm_mst_mstr_locn: MasterLocationCode.trim(),
      itm_mst_non_stk_flg: "0",
      itm_mst_tool_flg: "0",
      itm_mst_order_rule: setselectedorderRule.trim(),
      itm_mst_costcenter: setselectedcostCenter.trim(),
      itm_mst_account: setselectedaccount.trim(),
      itm_mst_rec_supplier:"NULL",
      itm_mst_ext_desc: Long_Description.trim(),
      itm_mst_serialize_flg: "1",
      itm_mst_auto_serialize_flg: "1",
      itm_mst_serialize_counter: SerializeCounter.trim(),
      itm_mst_type: itmmsttype,
      itm_mst_itm_grp: setselectedstockGroup,
      itm_det_issue_uom:setselectedissueUom.trim(),
      itm_det_rcv_uom:setselectedrecivedUom.trim(),
      itm_det_auto_spare:autoSpare,   
      itm_det_critical_spare:criticalSpare,
      itm_det_hzd_mtl:HazardousMaterial,
      itm_det_storage_type:setselectedstorageType,
      itm_det_cube:Cube,
      itm_det_cr_code:costingValue ? costingValue : "",
      itm_det_abc_class:abcClass,
      itm_det_shelf_life:shelfLife,
      itm_det_order_pt:orderPoint,
      itm_det_maximum:maximumInvtr,
      itm_det_part_deac_status:setselectedpartDeacStatus.trim(),
      itm_det_acct_type: selectedAccountType !== "" ? (selectedAccountType === "INVENTORY" ? "I" : "E") : "",
      itm_det_avg_cost:issuePrice,
      itm_det_tax_cd:taxCode,  
      itm_det_varchar1:assetNoSet ? assetNoSet.trim() : assetNoSet,
      itm_det_varchar2:weightSet ? weightSet.trim() : weightSet,
      itm_det_varchar3:UDFText_3 ? UDFText_3.trim() : UDFText_3,
      itm_det_varchar4:UDFText_4 ? UDFText_4.trim() : UDFText_4,
      itm_det_varchar5:UDFText_5 ? UDFText_5.trim() : UDFText_5,
      itm_det_varchar6:UDFText_6 ? UDFText_6.trim() : UDFText_6,
      itm_det_varchar7:UDFText_7 ? UDFText_7.trim() : UDFText_7,
      itm_det_varchar8:UDFText_8 ? UDFText_8.trim() : UDFText_8,
      itm_det_varchar9:UDFText_9 ? UDFText_9.trim() : UDFText_9,
      itm_det_varchar10:UDFText_10 ? UDFText_10.trim() : UDFText_10,
      itm_det_numeric1:UDFNumber_1 ? UDFNumber_1.trim() : "0.0000",
      itm_det_numeric2:UDFNumber_2 ? UDFNumber_2.trim() : "0.0000",
      itm_det_numeric3:UDFNumber_3 ? UDFNumber_3.trim() : "0.0000",
      itm_det_numeric4:UDFNumber_4 ? UDFNumber_4.trim() : "0.0000",
      itm_det_numeric5:UDFNumber_5 ? UDFNumber_5.trim() : "0.0000",
      itm_det_datetime1:date_of_1 ? date_of_1.trim() : date_of_1,
      itm_det_datetime2:date_of_2 ? date_of_2.trim() : date_of_2,
      itm_det_datetime3:date_of_3 ? date_of_3.trim() : date_of_3,
      itm_det_datetime4:date_of_4 ? date_of_4.trim() : date_of_4,
      itm_det_datetime5:date_of_5 ? date_of_5.trim() : date_of_5,
      itm_det_note1:udfNote1,
      audit_user:emp_mst_login_id.trim(),
      itm_mst_create_by:emp_mst_login_id.trim(),
      ImgUpload: imageSelect,
    };

    console.log("json_AssetInsert___",json_AssetInsert);
    for (let i = 0; i < InventoryMandatoryFiled.length; i++) {
      const item = InventoryMandatoryFiled[i];
      const fieldValue = json_AssetInsert[item.column_name];
      if (fieldValue !== null && fieldValue.trim() === "") {
        missingFields = item.customize_label;
        setErrorField(item.column_name);
        break;
      }
    }

    // If any fields are missing, display an error message
    if (Button_save !== "Duplicate" && missingFields.length > 0) {
      Swal.close();

      const errorMessage = `Please fill the required field: ${missingFields}`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else {
      try {
        const response = await httpCommon.post(
          "/insert_new_inventroyMaster.php",
          JSON.stringify(json_AssetInsert)
        );
        console.log("json_Master Data", response);

        if (response.data.status === "SUCCESS") {
          // console.log("responseJson", response.data.ROW_ID);
          Swal.close();
          Swal.fire({
            icon: "success",
            customClass: {
              container: "swalcontainercustom",
            },
            title: response.data.status,
            text: response.data.message,
          }).then(() => {
            navigate(`/dashboard/InventoryMaster/list`);
          });
        } else {
          Swal.close();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.data,
          });
        }
      } catch (error) {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops Somthing is wrong...",
          text: error,
        });
      }
    }
  };

  const Update_Inventory = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();

    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    // let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    let TotalOH = "0.0000";
    let IssuePrice = "0.00";
    let SerializeCounter = "100001";

  // selected_Commodity
    let Commodity, setCommodity;
    if (selected_Commodity.label == "" || selected_Commodity.label == null) {
     setCommodity = "";
    } else {
     Commodity = selected_Commodity.label.split(":");
      setCommodity = Commodity[0];
     // console.log("Commodity: ", Commodity[0])
    }

   //selected_StockNo stockNoText
    let selectedStockNo, setselectedStockNo;
    if (stockNoText.label == "" || stockNoText.label == null) {
     setselectedStockNo = stockNoText;
    } else {
     selectedStockNo = stockNoText.label.split(":");
      setselectedStockNo = selectedStockNo[0];
     // console.log("selectedStockNo: ", selectedStockNo[0])
    }

   //selected_stockGroup
   let selectedstockGroup, setselectedstockGroup;
    if (selected_stockGroup.label == "" || selected_stockGroup.label == null) {
     setselectedstockGroup = "";
    } else {
     selectedstockGroup = selected_stockGroup.label.split(":");
     setselectedstockGroup = selectedstockGroup[0];
      //console.log("selectedstockGroup: ", selectedstockGroup[0])
    } 

    //selected_orderRule
    let selectedorderRule, setselectedorderRule;
    if (selected_orderRule.label == "" || selected_orderRule.label == null) {
     setselectedorderRule = "";
    } else {
     selectedorderRule = selected_orderRule.label.split(":");
     setselectedorderRule = selectedorderRule[0];
      //console.log("selectedstockGroup: ", selectedorderRule[0])
    } 
    //selected_costCenter
    let selectedcostCenter, setselectedcostCenter;
    if (selected_costCenter.label == "" || selected_costCenter.label == null) {
     setselectedcostCenter = "";
    } else {
     selectedcostCenter = selected_costCenter.label.split(":");
     setselectedcostCenter = selectedcostCenter[0];
      //console.log("selectedstockGroup: ", selectedcostCenter[0])
    } 
    //selected_account
    let selectedaccount, setselectedaccount;
    if (selected_account.label == "" || selected_account.label == null) {
     setselectedaccount = "";
    } else {
     selectedaccount = selected_account.label.split(":");
     setselectedaccount = selectedaccount[0];
      //console.log("selectedstockGroup: ", selectedaccount[0])
    } 
    //selected_partDeacStatus,
    let selectedpartDeacStatus, setselectedpartDeacStatus;
    if (selected_partDeacStatus.label == "" || selected_partDeacStatus.label == null) {
     setselectedpartDeacStatus = "";
    } else {
     selectedpartDeacStatus = selected_partDeacStatus.label.split(":");
     setselectedpartDeacStatus = selectedpartDeacStatus[0];
      //console.log("selectedstockGroup: ", selectedpartDeacStatus[0])
    } 
    //selected_issueUom,
    let selectedissueUom, setselectedissueUom;
    if (selected_issueUom.label == "" || selected_issueUom.label == null) {
     setselectedissueUom = "";
    } else {
     selectedissueUom = selected_issueUom.label.split(":");
     setselectedissueUom = selectedissueUom[0];
      //console.log("selectedstockGroup: ", selectedissueUom[0])
    }
    //selected_recivedUom,
    let selectedrecivedUom, setselectedrecivedUom;
    if (selected_recivedUom.label == "" || selected_recivedUom.label == null) {
     setselectedrecivedUom = "";
    } else {
     selectedrecivedUom = selected_recivedUom.label.split(":");
     setselectedrecivedUom = selectedrecivedUom[0];
      //console.log("selectedstockGroup: ", selectedrecivedUom[0])
    }
    //selected_storageType
    let selectedstorageType, setselectedstorageType;
    if (selected_storageType.label == "" || selected_storageType.label == null) {
     setselectedstorageType = "";
    } else {
     selectedstorageType = selected_storageType.label.split(":");
     setselectedstorageType = selectedstorageType[0];
     // console.log("selectedstockGroup: ", selectedstorageType[0])
    }
  
     // select UDFDate_1 
     let date_of_1 = "";
     if (UDFDate_1 == "" || UDFDate_1 == null) {
       date_of_1 = "";
     } else {
       date_of_1 = Moment(UDFDate_1)
         .format("yyyy-MM-DD HH:mm:ss")
         .trim();
     }
     // select UDFDate_2
     let date_of_2 = "";
     if (UDFDate_2 == "" || UDFDate_2 == null) {
       date_of_2 = "";
     } else {
       date_of_2 = Moment(UDFDate_2)
         .format("yyyy-MM-DD HH:mm:ss")
         .trim();
     }
     // select UDFDate_3
     let date_of_3 = "";
     if (UDFDate_3 == "" || UDFDate_3 == null) {
       date_of_3 = "";
     } else {
       date_of_3 = Moment(UDFDate_3)
         .format("yyyy-MM-DD HH:mm:ss")
         .trim();
     }
     // select UDFDate_4
     let date_of_4 = "";
     if (UDFDate_4 == "" || UDFDate_4 == null) {
       date_of_4 = "";
     } else {
       date_of_4 = Moment(UDFDate_4)
         .format("yyyy-MM-DD HH:mm:ss")
         .trim();
     }

     // select UDFDate_5
     let date_of_5 = "";
     if (UDFDate_5 == "" || UDFDate_5 == null) {
       date_of_5 = "";
     } else {
       date_of_5 = Moment(UDFDate_5)
         .format("yyyy-MM-DD HH:mm:ss")
         .trim();
     }
   // selected_AccountType
   let selectedAccountType, setselectedAccountType;
    if (selected_AccountType.label == "" || selected_AccountType.label == null) {
     setselectedAccountType = "";
    } else {
     selectedAccountType = selected_AccountType.label;
     setselectedAccountType = selectedAccountType;
      //console.log("selectedstockGroup: ", selectedAccountType)
    }

    //Check Img state
    let setDbImgRowIdUpdate;
    if (getDbImgRowId == "" || getDbImgRowId == null) {
      setDbImgRowIdUpdate = "";
    } else {
      setDbImgRowIdUpdate = getDbImgRowId;
    }
    let missingFields = [];

    var json_AssetUpdate = {
      site_cd: site_ID,
      itm_mst_stockno: setselectedStockNo ? setselectedStockNo.trim() : stockNoText,
      itm_mst_partno: PartNo ? PartNo.trim() : "",
      itm_mst_desc: Short_Description.trim(),
      itm_mst_issue_price: IssuePrice.trim(),
      itm_mst_ttl_oh: TotalOH.trim(),
      itm_mst_issue_uom: setselectedissueUom.trim(),
      itm_mst_com_code: setCommodity.trim(),
      itm_mst_mstr_locn: MasterLocationCode.trim(),
      itm_mst_non_stk_flg: "0",
      itm_mst_tool_flg: "0",
      itm_mst_order_rule: setselectedorderRule.trim(),
      itm_mst_costcenter: setselectedcostCenter.trim(),
      itm_mst_account: setselectedaccount.trim(),
      itm_mst_rec_supplier:"NULL",
      itm_mst_ext_desc: Long_Description ? Long_Description.trim() : "",
      itm_mst_serialize_flg: "1",
      itm_mst_auto_serialize_flg: "1",
      itm_mst_serialize_counter: SerializeCounter.trim(),
      itm_mst_type: selected_Type.label,
      itm_mst_itm_grp: setselectedstockGroup,
      itm_det_issue_uom:setselectedissueUom.trim(),
      itm_det_rcv_uom:setselectedrecivedUom.trim(),
      itm_det_auto_spare:autoSpare,   
      itm_det_critical_spare:criticalSpare,
      itm_det_hzd_mtl:HazardousMaterial,
      itm_det_storage_type:setselectedstorageType,
      itm_det_cube:Cube,
      itm_det_cr_code:costingValue ? costingValue : "",
      itm_det_abc_class:abcClass,
      itm_det_shelf_life:shelfLife,
      itm_det_order_pt:orderPoint,
      itm_det_maximum:maximumInvtr,
      itm_det_part_deac_status:setselectedpartDeacStatus.trim(),
      itm_det_acct_type: selectedAccountType !== "" ? (selectedAccountType === "INVENTORY" ? "I" : "E") : "",
      itm_det_avg_cost:issuePrice,
      itm_det_tax_cd:taxCode,  
      itm_det_varchar1:assetNoSet ? assetNoSet.trim() : assetNoSet,
      itm_det_varchar2:weightSet ? weightSet.trim() : weightSet,
      itm_det_varchar3:UDFText_3 ? UDFText_3.trim() : UDFText_3,
      itm_det_varchar4:UDFText_4 ? UDFText_4.trim() : UDFText_4,
      itm_det_varchar5:UDFText_5 ? UDFText_5.trim() : UDFText_5,
      itm_det_varchar6:UDFText_6 ? UDFText_6.trim() : UDFText_6,
      itm_det_varchar7:UDFText_7 ? UDFText_7.trim() : UDFText_7,
      itm_det_varchar8:UDFText_8 ? UDFText_8.trim() : UDFText_8,
      itm_det_varchar9:UDFText_9 ? UDFText_9.trim() : UDFText_9,
      itm_det_varchar10:UDFText_10 ? UDFText_10.trim() : UDFText_10,
      itm_det_numeric1:UDFNumber_1 ? UDFNumber_1.trim() : "0.0000",
      itm_det_numeric2:UDFNumber_2 ? UDFNumber_2.trim() : "0.0000",
      itm_det_numeric3:UDFNumber_3 ? UDFNumber_3.trim() : "0.0000",
      itm_det_numeric4:UDFNumber_4 ? UDFNumber_4.trim() : "0.0000",
      itm_det_numeric5:UDFNumber_5 ? UDFNumber_5.trim() : "0.0000",
      itm_det_datetime1:date_of_1 ? date_of_1.trim() : date_of_1,
      itm_det_datetime2:date_of_2 ? date_of_2.trim() : date_of_2,
      itm_det_datetime3:date_of_3 ? date_of_3.trim() : date_of_3,
      itm_det_datetime4:date_of_4 ? date_of_4.trim() : date_of_4,
      itm_det_datetime5:date_of_5 ? date_of_5.trim() : date_of_5,
      itm_det_note1:udfNote1,

      audit_user: emp_mst_login_id.trim(),
      itm_mst_create_by: emp_mst_login_id.trim(),
      itm_aud_originator: emp_mst_login_id.trim(),
      itm_mst_create_date: get_date,

      ImgGetDbImgRowId: setDbImgRowIdUpdate,
      ImgUpload: imageSelect,
      SpecialOdrResult: SpecialOdrResult,

      removedRefItems: removedRefItems,
      RowID: RowID,
    };
    console.log("json_AssetUpdate____", json_AssetUpdate);
    for (let i = 0; i < InventoryMandatoryFiled.length; i++) {
      const item = InventoryMandatoryFiled[i];
      const fieldValue = json_AssetUpdate[item.column_name];
      if (fieldValue !== null && fieldValue.trim() === "") {
        missingFields = item.customize_label;
        setErrorField(item.column_name);
        break; // Stop loop as soon as a missing field is found
      }
    }
    console.log("Code block executed");
    // If any fields are missing, display an error message
    if (missingFields.length > 0) {
      Swal.close();

      const errorMessage = `Please fill the required field: ${missingFields}`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else {
      try {
        const response = await httpCommon.post(
          "/update_inventory_master.php", 
          JSON.stringify(json_AssetUpdate)
        );
        console.log("response_____", response);
        if (response.data.status === "SUCCESS") {
          // if (selectedPdfFiles.length > 0) {
          //   const formData = new FormData();
          //   for (let i = 0; i < selectedPdfFiles.length; i++) {
          //     formData.append("files[]", selectedPdfFiles[i]);
          //   }
          //   formData.append("site_cd", site_ID);
          //   formData.append("RowID", RowID);
          //   formData.append("audit_user", emp_mst_login_id.trim());

          //   try {
          //     const response = await httpCommon.post(
          //       "/AssetFormReferenceMultipalImgUpload.php",
          //       formData,
          //       {
          //         headers: {
          //           "Content-Type": "multipart/form-data", // Ensure proper content type
          //         },
          //       }
          //     );
          //     //  console.log("upload_mltipal____",response);
          //     if (response.data.status == "SUCCESS") {
          //       Swal.close();
          //       Swal.fire({
          //         icon: "success",
          //         customClass: {
          //           container: "swalcontainercustom",
          //         },
          //         title: response.data.status,
          //         text: response.data.message,
          //       }).then(() => {
          //         // navigate(`/dashboard/work/order`);
          //         navigate(`/dashboard/asset/list`, {
          //           state: {
          //             currentPage,
          //             selectedOption,
          //           },
          //         });
          //       });
          //     }
          //   } catch (error) {
          //     console.log("error__", error);
          //     //Handle error  WorkOrderNo
          //   }
          // } else {
          //   Swal.close();
          //   Swal.fire({
          //     icon: "success",
          //     customClass: {
          //       container: "swalcontainercustom",
          //     },
          //     title: response.data.status,
          //     text: response.data.message,
          //   }).then(() => {
          //     if (response.data.status === "SUCCESS") {
          //       // navigate(`/dashboard/work/order`);
          //       navigate(`/dashboard/asset/list`, {
          //         state: {
          //           currentPage,
          //           selectedOption,
          //         },
          //       });
          //     }
          //   });
          // }
          Swal.close();
            Swal.fire({
              icon: "success",
              customClass: {
                container: "swalcontainercustom",
              },
              title: response.data.status,
              text: response.data.message,
            }).then(() => {
              if (response.data.status === "SUCCESS") {
                // navigate(`/dashboard/work/order`);
                navigate(`/dashboard/InventoryMaster/list`, {
                  state: {
                    currentPage,
                    selectedOption,
                  },
                });
              }
            });
        } else {
          Swal.close();
          Swal.fire({
            icon: "error",
            customClass: {
              container: "swalcontainercustom",
            },
            title: "Oops...",
            text: response.data,
          });
        }
      } catch (error) {
        Swal.close();

        Swal.fire({
          icon: "error",
          customClass: {
            container: "swalcontainercustom",
          },
          title: "Oops Data Not Updated...",
          text: error,
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  // Save button // update button click funcation
 
  const onClickChange = (event) => {  
    event.preventDefault();
    if (selected_Type == "" || selected_Type == null) {
      setIsTypeEmpty(true);
      const errorMessage = "Please fill the required field Type is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    }  else if (stockNoText == "" || stockNoText == null) {
      setIsStockNo(true);
      const errorMessage =
        "Please fill the required field Stock No is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (MasterLocationCode == "" || MasterLocationCode == null) {
      setIsMasterLocationEmpty(true);
      const errorMessage =
        "Please fill the required field Master Location is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_orderRule == "" || selected_orderRule == null) {
      setIsOrderRuleEmpty(true);
      const errorMessage =
        "Please fill the required field Order Rule is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      selected_costCenter == "" ||
      selected_costCenter == null
    ) {
      setIsCostCenterEmpty(true);
      const errorMessage =
        "Please fill the required field Cost Center is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_account == "" || selected_account == null) {
      setIsAccountEmpty(true);
      const errorMessage = "Please fill the required field Account is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      Short_Description == "" ||
      Short_Description == null
    ) {
      setIsDescEmpty(true);
      const errorMessage =
        "Please fill the required field Description is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_partDeacStatus == "" || selected_partDeacStatus == null) {
      setIsPartDeacEmpty(true);
      const errorMessage = "Please fill the required field Part Deac Status is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      selected_issueUom == "" ||
      selected_issueUom == null
    ) {
      setIsIssueUomEmpty(true);
      const errorMessage =
        "Please fill the required field Issue UOM is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    }else if (
      selected_recivedUom == "" ||
      selected_recivedUom == null
    ) {
      setIsReciveUomEmpty(true);
      const errorMessage =
        "Please fill the required field Recive UOM is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else {
      if (Button_save === "Save") {
        New_Inventory();
      } else if (Button_save === "Update") {
        Update_Inventory();
      }
    }
  };

  useEffect(() => {
    let timer;
    if (snackbarOpen) {
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            setSnackbarOpen(false);
            return 0;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, 400);
    } else {
      setProgress(0);
    }
    return () => {
      clearInterval(timer);
    };
  }, [snackbarOpen]);

  const onClickDuplicate = (event) => {
    event.preventDefault();
    if (Button_save === "Duplicate") {
      // console.log("claing Api to duplicate key ");
      New_Inventory();
    }
  };

  const onClickChangeComplete = (event) => {
    event.preventDefault();

    if (selected_Status === "" || selected_Status === null) {
      setIsFiledValueEmpty(true);
    } else if (CorrectiveAction === "" || CorrectiveAction === null) {
      setIsCorrectiveValueEmpty(true);
    } else if (
      selected_Cause_Code.label === "" ||
      selected_Cause_Code.label === null
    ) {
      setIsCauseCodeValueEmpty(true);
    } else if (
      selected_Action_Code.label === "" ||
      selected_Action_Code.label === null
    ) {
      setIsActionCodeValueEmpty(true);
    } else {
      if (Button_save === "Completed") {
        // console.log("Completed____btn");
        Update_complete();
      }
    }
  };

  const onClickChangeClose = (event) => {
    event.preventDefault();

    if (selected_Status === "" || selected_Status === null) {
      setIsFiledValueEmpty(true);
    } else if (CorrectiveAction === "" || CorrectiveAction === null) {
      setIsCorrectiveValueEmpty(true);
    } else if (
      selected_Cause_Code.label === "" ||
      selected_Cause_Code.label === null
    ) {
      setIsCauseCodeValueEmpty(true);
    } else if (
      selected_Action_Code.label === "" ||
      selected_Action_Code.label === null
    ) {
      setIsActionCodeValueEmpty(true);
    } else {
      if (Button_save === "Close Order") {
        // console.log("close____btn");
        Update_closeOrder();
      }
    }
  };
  const onClickCancel = () => {
    navigate(`/dashboard/InventoryMaster/list`, {
      state: {
        currentPage,
        selectedOption,
      },
    });
  };

  // Complete button click api
  const Update_complete = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    const formattedDate = CompletionDate2
      ? Moment(CompletionDate2).format("YYYY-MM-DD HH:mm:ss.SSS")
      : "";
    let CompleteStatus;
    if (selected_Status.label === "" || selected_Status.label === null) {
      CompleteStatus = "";
    } else {
      const Status2 = selected_Status.label.split(":");
      CompleteStatus = Status2[0];
      ////console.log("Status: ", Status[0])
    }

    let selectedActionCode;
    if (
      selected_Action_Code.label === "" ||
      selected_Action_Code.label === null
    ) {
      selectedActionCode("");
    } else {
      const ActionCode = selected_Action_Code.label.split(":");
      selectedActionCode = ActionCode[0];
    }

    let selectedCauseCode;
    if (
      selected_Cause_Code.label === "" ||
      selected_Cause_Code.label === null
    ) {
      selectedCauseCode("");
    } else {
      const CauseCode2 = selected_Cause_Code.label.split(":");
      selectedCauseCode = CauseCode2[0];
    }
    var json_workorder = {
      site_cd: site_ID,
      wko_mst_status: CompleteStatus,
      audit_user: emp_mst_name.trim(),
      wko_det_cmpl_date: formattedDate,
      wko_det_corr_action: CorrectiveAction,
      wko_sts_wo_no: WorkOrderNo,
      mst_RowID: completeRowID,
      wko_det_act_code: selectedActionCode,
      wko_det_cause_code: selectedCauseCode,
    };

    try {
      const response = await httpCommon.post(
        "/complete_workorder.php",
        JSON.stringify(json_workorder)
      );
      console.log("res", response);
      if (response.data.status == "SUCCESS") {
        Swal.close();
        Swal.fire({
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
          title: response.data.status,
          text: response.data.message,
        }).then(() => {
          navigate(`/dashboard/work/order`);
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
  };

  // Close button click Api
  const Update_closeOrder = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    // Swal.showLoading();
    const formattedDate = CloseDate2
      ? Moment(CloseDate2).format("YYYY-MM-DD HH:mm:ss.SSS")
      : "";
    let CloseStatus;
    if (selected_Status.label === "" || selected_Status.label === null) {
      CloseStatus = "";
    } else {
      const Status2 = selected_Status.label.split(":");
      CloseStatus = Status2[0];
      ////console.log("Status: ", Status[0])
    }

    let selectedActionCode;
    if (
      selected_Action_Code.label === "" ||
      selected_Action_Code.label === null
    ) {
      selectedActionCode("");
    } else {
      const ActionCode = selected_Action_Code.label.split(":");
      selectedActionCode = ActionCode[0];
    }

    let selectedCauseCode;
    if (
      selected_Cause_Code.label === "" ||
      selected_Cause_Code.label === null
    ) {
      selectedCauseCode("");
    } else {
      const CauseCode2 = selected_Cause_Code.label.split(":");
      selectedCauseCode = CauseCode2[0];
    }
    var json_workorder = {
      site_cd: site_ID,
      wko_mst_status: CloseStatus,
      audit_user: emp_mst_name.trim(),
      wko_det_close_date: formattedDate,
      wko_det_corr_action: CorrectiveAction,
      wko_sts_wo_no: WorkOrderNo,
      mst_RowID: closeRowID,
      wko_det_act_code: selectedActionCode,
      wko_det_cause_code: selectedCauseCode,
    };

    try {
      const response = await httpCommon.post(
        "/Close_workorder.php",
        JSON.stringify(json_workorder)
      );
      console.log("res", response);
      if (response.data.status == "SUCCESS") {
        Swal.close();
        Swal.fire({
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
          title: response.data.status,
          text: response.data.message,
        }).then(() => {
          navigate(`/dashboard/work/order`);
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
  };

  // Status Audit PopUp

  const formatDuration = (duration) => {
    // const seconds = Math.floor(duration % 60);
    const minutes = Math.floor(duration % 60);
    const hours = Math.floor((duration % 1440) / 60);
    const days = Math.floor(duration / 1440);

    if (days > 0) {
      return `${days}d: ${hours}h: ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h: ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "";
    }
    // return `${days}d: ${hours}h: ${minutes}m`;
  };
  const getsteps = async () => {
    // console.log("enter_getSteps___");
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();

    try {
      const responseJson = await httpCommon.get(
        `/get_assetmaster_statusaudit.php?site_cd=${site_ID}&RowID=${RowID}`
      );
      // console.log("responseJson___audit",responseJson);
      if (responseJson.data.status === "SUCCESS") {
        // console.log('get_workordermaster_statusaudit', responseJson.data.data)

        let Status = responseJson.data.data.map((item, index) => ({
          label: item.ast_sts_desc,
          label1: item.ast_aud_status,
          label2: item.emp_mst_name,
          label3: item.audit_user,
          label4: `${new Date(item.ast_aud_start_date.date).toLocaleString(
            "default",
            {
              weekday: "short",
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }
          )}`,
          label5: formatDuration(item.duration),
          step: index + 1,
        }));
        setsteps(Status);

        Swal.close();
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responseJson.data.message,
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  };
  const StatushandleShow = () => {
    setStatusShow(true);
    getsteps();
  };

  const handleImageChange2 = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // const base64String = reader.result.split(',')[1];
        const base64String2 = reader.result.split(",")[1];

        const base64String = reader.result;

        const fileName = file.name;
        setImagePreview(base64String);
        // Set the state with the base64 string and file name
        setimageComment({
          base64: base64String2,
          fileName: fileName,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCmmnt = async () => {
    Swal.fire({ title: "Loading.... !", allowOutsideClick: false });
    Swal.showLoading();

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_name = localStorage.getItem("emp_mst_name");

    const inputValue = messageRef.current.value;

    const newComment = {
      // Add other properties as needed
      audit_user: emp_mst_login_id, // Replace with the actual user
      audit_date: {
        date: Moment().format("YYYY-MM-DD HH:mm:ss"),
        timezone_type: 3,
        timezone: "UTC",
      },
      wko_ls11_sts_upd: inputValue,
      attachment:
        imageComment && imageComment.base64 ? imageComment.base64 : null,
    };
    setAllComment((prevComments) => [...prevComments, newComment]);

    var json_workorder = {
      site_cd: site_ID,
      RowId: RowID,
      commentMsg: inputValue,
      Emp_name: emp_mst_name,
      Emp_login_Name: emp_mst_login_id,
      orderNo: WorkOrderNo,
      ImgUpload: imageComment,
    };

    try {
      const response = await httpCommon.post(
        "/insert_comment.php",
        JSON.stringify(json_workorder)
      );
      console.log("json_workordercommet Data", response);

      if (response.data.status === "SUCCESS") {
        console.log("responseJson", response.data.ROW_ID);
        Swal.close();
        //  setCommentShow(false);

        if (messageRef.current) {
          messageRef.current.value = "";
        }
        setImagePreview("");
        setimageComment("");
        // scrollChatToBottom();
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data,
        });
      }
    } catch (error) {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Oops get_WorkOrder_select...",
        text: error,
      });
    }

    imageComment(null);
  };

  const handleImageClick = (imageData) => {
    setSelectedImageCommnt(imageData);
  };
  const handleImageClickSHow = () => {
    setUploadImgShow(true);
  };
  const handleUploadCloseClick = () => {
    setImagePreview("");
  };
  const handleSelectedFaultCode = (selectedOption) => {
    const newValue =
      selectedOption && selectedOption.value ? selectedOption : null;
    // setDescription(newValue ? newValue.value : null);
  };

  // OnChange to check error funcation
  const handleStatusChange = (event, value) => {
    setSelected_Commodity(value);
    setIsAssetStatusEmpty(false);
  };
  const handleAssetStatusChange = (event, value) => {
    setSelected_Asset_Status(value);
    setIsAssetStatusEmpty(false);
  };
  const handlePlanPriorityChange = async (event, value) => {
    const newValue = value === null ? null : value;
    setSelected_Plan_Priority(newValue);
    if (value && value.label) {
      const labelParts = value.label.split(":");
      const valueBeforeColon = labelParts[0].trim();

      if (valueBeforeColon !== "") {
        try {
          const response = await httpCommon.get(
            `GetDueDatePlanPriority.php?ID=${valueBeforeColon}&site_cd=${site_ID}`
          );
          if (response.data.status === "SUCCESS") {
            const dueDateIncrement = response.data.data; // Assuming response.data.data contains the increment in milliseconds
            if (!isNaN(dueDateIncrement)) {
              //const dt = new Date();
              const millisecondsToAdd = dueDateIncrement * 60 * 1000;
              const newDate = new Date(
                OriginationDate.getTime() + millisecondsToAdd
              );
              setDueDate(newDate);
              Swal.close();
              setLoading(false);
            } else {
              console.error("Invalid dueDateIncrement:", response.data.data);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
  };

  const handleChargeCostChange = (event, value) => {
    setSelected_Charge_Cost_Center(value);
    setIsChargeCostEmpty(false);
  };
  const handleFaultCodeChange = (event, value) => {
    const newValue = value === null ? null : value;

    setSelected_Fault_Code(newValue);
    handleSelectedFaultCode(newValue);
    setIsFaultCodeEmpty(false);
  };
  const handleOriginalPeriorityChange = (event, value) => {
    setSelected_Original_Periority(value);
    setIsOriginalPeriorityEmpty(false);
  };
  const handleWorkTypeChange = (event, value) => {
    setSelected_Work_Type(value);
    setIsWorkTypeEmpty(false);
  };
  const handleWorkGroupChange = (event, value) => {
    setSelected_Work_Group(value);
    setIsWorkGroupEmpty(false);
  };

  const toggleDiv = () => {
    setIsOpenWork(!isOpenWork);
  };

  const toggleDivAsset = () => {
    setIsOpenAsset(!isOpenAsset);
  };
  const handleDataFromSecondComponent = (data) => {
    console.log("data++++++++", data);
    window.location.reload();
  };

  const handleToggle = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleContinueCheckboxChange = (event) => {

    setcontinuousAdd(event.target.checked);

  };


  return (
    <>
      <Helmet>
        <title>
          {RowID
            ? "Update Inventory"
            : DuplicatRowid
            ? "Duplicate Inventory"
            : "Create New Inventory"}
        </title>
        <meta name="description" content="Create New Inventory" />
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div
          className="CustomBreadAssetSave asset"
          style={{
            position: "-webkit-sticky",
            position: "sticky",
            top: "55px",
            backgroundColor: "white",
            zIndex: 1000,
            borderBottom: "1px solid #00000021",
            height: "60px !important",
          }}
        >
          <CustomBreadcrumbs
            // heading="Create Work Order"
            heading={
              RowID
                ? `Update ${WorkOrderNo} Inventory`
                : DuplicatRowid
                ? "Duplicate Inventory"
                : "Create New Inventory"
            }
            links={[
              {
                name: "Inventory",
              },
              { name: RowID ? "Update" : "Create" },
            ]}
            action={
              <div style={{ display: "flex", alignItems: "center" }}>
                {(() => {
                  if (
                    DuplicatRowid !== undefined &&
                    DuplicatRowid !== null &&
                    DuplicatRowid !== ""
                  ) {
                    return (
                      <div>
                        <Button
                          component={RouterLink}
                          onClick={onClickDuplicate}
                          variant="contained"
                          className="SaveButton"
                          startIcon={<Iconify icon="mingcute:save-fill" />}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "10px",
                          }}
                        >
                          {Button_save === "Duplicate" ? "Save" : Button_save}
                        </Button>
                        <Button
                          variant="soft"
                          color="error"
                          className="CloseButton"
                          startIcon={<Iconify icon="jam:close" />}
                          onClick={onClickCancel}
                        >
                          Close
                        </Button>
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        <Button
                          component={RouterLink}
                          onClick={onClickChange}
                          variant="contained"
                          className="SaveButton"
                          startIcon={<Iconify icon="mingcute:save-fill" />}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "10px",
                          }}
                          disabled={Status.some(
                            (item) =>
                              item.key ===
                                (
                                  selected_Status?.label?.split(" : ")[2] ?? ""
                                ).trim() && item.key === "CLOSE"
                          )}
                        >
                          {Button_save}
                        </Button>
                        <Button
                          variant="soft"
                          color="error"
                          className="CloseButton"
                          startIcon={<Iconify icon="jam:close" />}
                          onClick={onClickCancel}
                        >
                          Close
                        </Button>
                      </div>
                    );
                  }
                })()}
              </div>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        </div>
        <div>
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              {/* toggle view strting from here */}
              <div
                className="MainOrderFromGd"
                style={{ backgroundColor: "white" }}
              >
                <Grid container spacing={0}>
                  <Grid xs={12} md={12}>
                    <Card sx={{ padding: "10px 24px 15px 24px" }}>
                      <div style={{ display: "flex" }}>
                        <button className="ToggleBttnIcon" onClick={toggleDiv}>
                          <Iconify
                            icon="fluent-mdl2:pen-workspace"
                            style={{ marginRight: "5px", width: "17px" }}
                          />{" "}
                          Inventory Master
                          {isOpenWork ? (
                            <Iconify
                              icon="ep:arrow-up-bold"
                              style={{ marginLeft: "4px", width: "12px" }}
                            />
                          ) : (
                            <Iconify
                              icon="ep:arrow-down-bold"
                              style={{ marginLeft: "4px", width: "12px" }}
                            />
                          )}
                        </button>
                      </div>
                      {isOpenWork && (
                        <Grid container spacing={0}>
                          <Grid xs={12} md={10}>
                            {/* ************************************* img ******************************************* */}
                            <div className="col-md-2 mobileImgversion">
                              <div className="row">
                                <div className="row ImgShowMobile">
                                  <div>
                                    <label htmlFor="upload-button">
                                      {getDbImg && getDbImg.length > 0 ? (
                                        <div>
                                          <img
                                            src={getDbImg[0].attachment}
                                            className="imgCurPont"
                                            // width="200"
                                            // height="180"
                                            alt="Base64 Image"
                                            onClick={openSaveImg}
                                          />
                                          <div className="col btnCenter">
                                            <button
                                              type="button"
                                              className="btn dlt"
                                              onClick={() =>
                                                handleDeleteImgApi(
                                                  getDbImg[0].RowID
                                                )
                                              }
                                              style={{
                                                display: "flex",
                                                alignItems: "center",

                                                justifyContent: "center",
                                                marginTop: "10px",
                                              }}
                                            >
                                              <Iconify
                                                icon="fluent:delete-48-filled"
                                                style={{ fontSize: "24px" }}
                                              />
                                              Delete
                                            </button>
                                          </div>
                                        </div>
                                      ) : image.preview ? (
                                        <div>
                                          <img
                                            src={image.preview}
                                            alt="dummy"
                                            // width="200"
                                            // height="180"
                                            className="imgCurPont"
                                            onClick={openSaveImg}
                                          />
                                          <div className="col btnCenter">
                                            <button
                                              type="button"
                                              className="btn dlt"
                                              onClick={handleClearImg}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                              }}
                                            >
                                              <Iconify
                                                icon="fluent:delete-48-filled"
                                                style={{ marginRight: "5px" }}
                                              />
                                              Delete
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <span className="fa-stack fa-2x mb-2">
                                            <img
                                              src={require("../../../../assets/img/Add_Image_icon.png")}
                                              className="sliderimg2"
                                              onClick={handleImgChangeSingle2}
                                              width="200"
                                              height="180"
                                              alt=""
                                            />
                                          </span>
                                        </>
                                      )}
                                    </label>
                                    {getDbImg && getDbImg.length > 0 ? (
                                      <div></div>
                                    ) : (
                                      <div>
                                        <input
                                          type="file"
                                          id="upload-button"
                                          disabled={disabledBtn}
                                          style={{ display: "none" }}
                                          onChange={handleImgChangeSingle}
                                        />
                                      </div>
                                    )}
                                    <br />
                                  </div>
                                  <BootstrapDialog
                                    onClose={handleClosedd2}
                                    aria-labelledby="customized-dialog-title"
                                    open={showdd2}
                                  >
                                    <IconButton
                                      aria-label="close"
                                      onClick={handleClosedd2}
                                      sx={{
                                        position: "absolute",
                                        right: 8,
                                        top: 8,
                                        color: (theme) =>
                                          theme.palette.grey[500],
                                      }}
                                    >
                                      X
                                    </IconButton>
                                    <DialogContent
                                      dividers
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {getDbImg && getDbImg.length > 0 ? (
                                        <div>
                                          <img
                                            src={getDbImg[0].attachment}
                                            alt="dummy"
                                            className="dummyImg"
                                            onClick={openSaveImg}
                                          />
                                        </div>
                                      ) : (
                                        <img
                                          src={image.preview}
                                          alt="dummy"
                                          style={{
                                            height: "50%",
                                            width: "50%",
                                          }}
                                          onClick={openSaveImg}
                                          className="dummyImg"
                                        />
                                      )}
                                    </DialogContent>
                                  </BootstrapDialog>
                                </div>
                              </div>
                            </div>
                            <Box
                              rowGap={2}
                              columnGap={2}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "repeat(1, 1fr)",
                                sm: "repeat(2, 1fr)",
                              }}
                              width="100%"
                              marginBottom={1.5}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                width="100%"
                                rowGap={2}
                                columnGap={1}
                              >
                                <Stack flexGrow={1} spacing={1}>
                                  <Typography
                                    variant="subtitle2"
                                    className="Requiredlabel"
                                  >
                                    
                                    {findCustomizeLabel("itm_mst_type") ||
                                      "Type"}
                                  </Typography>
                                
                                  <Autocomplete
                                    options={type}
                                    value={(selected_Type?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                    onChange={(event, value) => {
                                      setSelected_Type(value);
                                      setIsTypeEmpty(false);

                                    }}
                                
                                    disableAnimation
                                    disabled={RowID !== "" && RowID !== null && RowID !== undefined}
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          placeholder="Select..."
                                          variant="outlined"
                                          size="small"
                                          className={`Extrasize ${
                                            isTypeEmpty
                                              ? "errorEmpty"
                                              : ""
                                          }`}
                                          ref={autocompleteRef}
                                        />
                                      </div>
                                    )}
                                  />
                                </Stack>
                              </Box>

                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="flex"
                                alignItems="center"
                                width="100%"
                              >
                                <Stack flexGrow={1} spacing={1}>
                                  <Typography
                                    variant="subtitle2"
                                    className=""
                                  >
                                    {findCustomizeLabel("itm_mst_com_code") ||
                                      "Commodity Code"}
                                  </Typography>

                                  <Autocomplete
                                    options={commodity}
                                    value={(selected_Commodity?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                    onChange={handleStatusChange}
                                    disableAnimation
                                    renderInput={(params) => (
                                      <div>
                                     
                                        <TextField
                                          {...params}
                                          placeholder="Select..."
                                          variant="outlined"
                                          size="small"
                                          className={`Extrasize ${
                                            isCommodityCodeEmpty
                                              ? "errorEmpty"
                                              : ""
                                          }`}
                                          ref={autocompleteRef}
                                        />
                                      </div>
                                    )}
                                  />
                                </Stack>
                               
                              </Box>
                            </Box>

                            <Box
                              rowGap={2}
                              columnGap={2}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "repeat(1, 1fr)",
                                sm: "repeat(2, 1fr)",
                              }}
                              marginBottom={0}
                            >
                              <Stack spacing={1}>
                                <Typography
                                  variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("itm_mst_stockno") ||
                                    "Stock No"}
                                </Typography>
                            
                                {selected_Type.label &&
                                selected_Type.label ===
                                  "Serialize With Asset" ? (
                                  <Autocomplete
                                    options={stockNo}
                                    value = {stockNoText}
                                    // value={(stockNoText? stockNoText.label == stockNoText : "")
                                    //   .split(" : ")
                                    //   .slice(0, 2)
                                    //   .join(" : ")}
                                    onChange={(event, value) => {
                                      setStockNoText(value);
                                      setIsStockNo(false);
                                    }}
                                    disableAnimation
                                    disabled={RowID !== "" && RowID !== null && RowID !== undefined}
                                    renderInput={(params) => (
                                     
                                      <div>
                                        <TextField
                                          {...params}
                                          placeholder="Select..."
                                          variant="outlined"
                                          size="small"
                                          className={`Extrasize ${
                                            isStockNo
                                              ? "errorEmpty"
                                              : ""
                                          }`}
                                          style={{ width: "100%" }}
                                          ref={autocompleteRef}
                                        />
                                      </div>
                                    )}
                                  />
                                ) : (
                                  <TextField
                                    id="outlined-basic"
                                    size="small"
                                    variant="outlined"
                                    value={(stockNoText ? stockNoText : "")}
                                    onChange={(e) => {
                                      setStockNoText(e.target.value);
                                      setIsStockNo(false);
                                     
                                    }}
                                    disabled={RowID !== "" && RowID !== null && RowID !== undefined}
                                    className={`Extrasize ${
                                      isStockNo
                                        ? "errorEmpty"
                                        : ""
                                    }`}
                                    fullWidth
                                  />
                                )}
                              </Stack>
                              <Box
                                rowGap={1}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    variant="subtitle2"
                                    
                                  >
                                    {findCustomizeLabel("itm_mst_itm_grp") ||
                                      "Stock Group"}
                                  </Typography>

                                  <Autocomplete
                                    options={stockGroup}
                                    value={(selected_stockGroup?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                    onChange={(event, value) => {
                                      setSelected_stockGroup(value);
                                      setIsAssetCriticalFactorEmpty(false);
                                    }}
                                    disableAnimation
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          placeholder="Select..."
                                          variant="outlined"
                                          size="small"
                                          className={`Extrasize ${
                                            isAssetCriticalFactorEmpty
                                              ? "errorEmpty"
                                              : ""
                                          }`}
                                          style={{ width: "100%" }}
                                          ref={autocompleteRef}
                                        />
                                      </div>
                                    )}
                                  />
                                </Stack>
                              </Box>
                            </Box>

                            <Box
                              rowGap={2}
                              columnGap={2}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "repeat(1, 1fr)",
                                sm: "repeat(2, 1fr)",
                              }}
                              marginBottom={0}
                            >
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                  <Typography variant="subtitle2" className="Requiredlabel" >
                                  {findCustomizeLabel("itm_mst_mstr_locn") ||
                                    "Master Location"}
                                    
                                  </Typography>
                                  <div ref={MasterLocationCodeRef}>
                                    <CustomTextField
                                      id="outlined-basic"
                                      variant="outlined"
                                      size="small"
                                      className={`Extrasize ${
                                        isMasterLocationEmpty
                                          ? "errorEmpty"
                                          : ""
                                      }`}
                                      
                                      fullWidth
                                      value={MasterLocationCode || ""}
                                      disabled={RowID !== "" && RowID !== null && RowID !== undefined}
                                      placeholder="Select..."
                                      rightIcons={[
                                        <Iconify
                                          icon="material-symbols:close"
                                          onClick={handleCancelMasterLocation}
                                        />,
                                        <Iconify
                                          icon="tabler:edit"
                                          onClick={handleEditClickMasterLocation}
                                        />,
                                      ]}
                                    />
                                  </div>
                                </Stack>
                              <Box
                                rowGap={1}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "itm_mst_partno"
                                    )}
                                  >
                                    {findCustomizeLabel("itm_mst_partno") ||
                                      "Part No"}
                                  </Typography>
                                  <TextField
                                    id="outlined-basic"
                                    size="small"
                                    variant="outlined"
                                    value={PartNo}
                                    onChange={(e) => {
                                      setPartNo(e.target.value);
                                     
                                    }}
                                    
                                    className={
                                      errorField === "itm_mst_stockno"
                                        ? "erroBorderadd"
                                        : ""
                                    }
                                    fullWidth
                                  />
                                </Stack>
                              </Box>
                            </Box>

                            <Box
                              rowGap={2}
                              columnGap={2}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "repeat(1, 1fr)",
                                sm: "repeat(2, 1fr)",
                              }}
                              marginBottom={0}
                            >
                              <Stack spacing={1}>
                                <Typography
                                  variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("itm_mst_order_rule") ||
                                    "Order Rule"}
                                </Typography>

                                <Autocomplete
                                  options={orderRule}
                                  value={(selected_orderRule?.label || "")
                                    .split(" : ")
                                    .slice(0, 2)
                                    .join(" : ")}
                                  onChange={(event, value) => {
                                    setSelected_orderRule(value);
                                    setIsOrderRuleEmpty(false);
                                  }}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        
                                        className={`Extrasize ${
                                          isOrderRuleEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              <Box
                                rowGap={1}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "itm_mst_ttl_oh"
                                    )}
                                  >
                                    {findCustomizeLabel("itm_mst_ttl_oh") ||
                                      "Total OH"}
                                  </Typography>
                                  <TextField
                                    id="outlined-basic"
                                    size="small"
                                    disabled
                                    variant="outlined"
                                    value="0.0000"
                                   
                                    className={
                                      errorField === "itm_mst_stockno"
                                        ? "erroBorderadd"
                                        : ""
                                    }
                                    fullWidth
                                  />
                                </Stack>
                              </Box>
                            </Box>
                            <Box
                              rowGap={2}
                              columnGap={2}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "repeat(1, 1fr)",
                                sm: "repeat(2, 1fr)",
                              }}
                              marginBottom={0}
                            >
                              <Stack spacing={1}>
                                <Typography
                                  variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("itm_mst_costcenter") ||
                                    "Cost Center"}
                                </Typography>

                                <Autocomplete
                                  options={costCenter}
                                  value={(selected_costCenter?.label || "")
                                    .split(" : ")
                                    .slice(0, 2)
                                    .join(" : ")}
                                  onChange={(event, value) => {
                                    setSelected_costCenter(value);
                                    setIsCostCenterEmpty(false);
                                  }}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isCostCenterEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              <Box
                                rowGap={1}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "itm_mst_issue_price"
                                    )}
                                  >
                                    {findCustomizeLabel(
                                      "itm_mst_issue_price"
                                    ) || "Issue Price"}
                                  </Typography>
                                  <TextField
                                    id="outlined-basic"
                                    size="small"
                                    disabled
                                    variant="outlined"
                                    value={getissuePrice ? getissuePrice :"0.0000"}
                                   
                                    className={
                                      errorField === "itm_mst_stockno"
                                        ? "erroBorderadd"
                                        : ""
                                    }
                                    fullWidth
                                  />
                                </Stack>
                              </Box>
                            </Box>
                            <Box
                              rowGap={2}
                              columnGap={2}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "repeat(1, 1fr)",
                                sm: "repeat(2, 1fr)",
                              }}
                              marginBottom={0}
                            >
                              <Stack spacing={1}>
                                <Typography
                                  variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("itm_mst_account") ||
                                    "Account"}
                                </Typography>

                                <Autocomplete
                                  options={account}
                                  value={(selected_account?.label || "")
                                    .split(" : ")
                                    .slice(0, 2)
                                    .join(" : ")}
                                  onChange={(event, value) => {
                                    setSelected_account(value);
                                    setIsAccountEmpty(false);
                                  }}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAccountEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              <Box
                                rowGap={1}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "itm_mst_partnoss"
                                    )}
                                  >
                                    {findCustomizeLabel("itm_mst_partnoss") ||
                                      "Serialize Counter:"}
                                  </Typography>
                                  <TextField
                                    id="outlined-basic"
                                    size="small"
                                    disabled
                                    variant="outlined"
                                    value="100001"
                                   
                                    className={
                                      errorField === "itm_mst_stockno"
                                        ? "erroBorderadd"
                                        : ""
                                    }
                                    fullWidth
                                  />
                                </Stack>
                              </Box>
                            </Box>

                            <Box
                              rowGap={2}
                              columnGap={2}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "repeat(1, 1fr)",
                                sm: "repeat(2, 1fr)",
                              }}
                              marginBottom={0}
                            >
                              <Stack spacing={1}>
                                <Typography
                                  variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("itm_mst_desc") ||
                                    "Description"}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  placeholder="Description..."
                                  minRows={6.5}
                                  value={Short_Description}
                                  onChange={(e) => {
                                    setShort_Description(e.target.value);
                                    setIsDescEmpty(false);
                                  }}
                                  //  className="TxtAra"
                                  className={`Extrasize ${
                                    isDescEmpty
                                      ? "errorEmpty"
                                      : "TxtAra"
                                  }`}
                                />
                              </Stack>
                              <Box
                                rowGap={1}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "itm_mst_ext_desc"
                                    )}
                                  >
                                    {findCustomizeLabel("itm_mst_ext_desc") ||
                                      "Extended Description"}
                                  </Typography>
                                  <TextareaAutosize
                                    aria-label="empty textarea"
                                    placeholder="Extended Description..."
                                    minRows={6.5}
                                    value={Long_Description}
                                    onChange={(e) => {
                                      setErrorField(null);
                                      setLong_Description(e.target.value);
                                    }}
                                    className={
                                      errorField === "ast_mst_asset_longdesc"
                                        ? "erroBorderadd"
                                        : "TxtAra"
                                    }
                                  />
                                </Stack>
                              </Box>
                            </Box>
                            <Box rowGap={1} columnGap={1} display="grid" marginBottom={1}>
                              <Stack direction="row" spacing={1} sx={{ pb: 1.5 }} alignItems="center">
                                <Typography
                                  variant="subtitle2"
                                  className={findCustomizerequiredLabel("itm_det_auto_spare")}
                                >
                                  {findCustomizeLabel("continuous_add") || "Continuous Add"}
                                 
                                </Typography>
                                <Checkbox className="customeCheckBox"
                                  checked={continuousadd}
                                  onChange={handleContinueCheckboxChange} />
                              </Stack>
                            </Box>
                          </Grid>
                          <Grid xs={12} md={2} className="imgGird">
                            <Card sx={{ pt: 2, pb: 0, px: 3 }}>
                              <Box
                                sx={{
                                  mb: 5,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {/* ************************************* img ******************************************* */}

                                <div className="col-md-2">
                                  <div className="row">
                                    <div className="row ImgShowMobile">
                                      <div>
                                        <label htmlFor="upload-button">
                                          {getDbImg && getDbImg.length > 0 ? (
                                            <div>
                                              <img
                                                src={getDbImg[0].attachment}
                                                className="imgCurPont"
                                                // width="200"
                                                // height="180"
                                                alt="Base64 Image"
                                                onClick={openSaveImg}
                                              />
                                              <div className="col btnCenter">
                                                <button
                                                  type="button"
                                                  className="btn dlt"
                                                  onClick={() =>
                                                    handleDeleteImgApi(
                                                      getDbImg[0].RowID
                                                    )
                                                  }
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",

                                                    justifyContent: "center",
                                                    marginTop: "10px",
                                                  }}
                                                >
                                                  <Iconify
                                                    icon="fluent:delete-48-filled"
                                                    style={{ fontSize: "24px" }}
                                                  />
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                          ) : image.preview ? (
                                            <div>
                                              <img
                                                src={image.preview}
                                                alt="dummy"
                                                // width="200"
                                                // height="180"
                                                className="imgCurPont"
                                                onClick={openSaveImg}
                                              />
                                              <div className="col btnCenter">
                                                <button
                                                  type="button"
                                                  className="btn dlt"
                                                  onClick={handleClearImg}
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                  }}
                                                >
                                                  <Iconify
                                                    icon="fluent:delete-48-filled"
                                                    style={{
                                                      marginRight: "5px",
                                                    }}
                                                  />
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <>
                                              <span className="fa-stack fa-2x mb-2">
                                                <img
                                                  src={require("../../../../assets/img/Add_Image_icon.png")}
                                                  className="sliderimg2"
                                                  onClick={
                                                    handleImgChangeSingle2
                                                  }
                                                  width="200"
                                                  height="180"
                                                  alt=""
                                                />
                                              </span>
                                            </>
                                          )}
                                        </label>
                                        {getDbImg && getDbImg.length > 0 ? (
                                          <div></div>
                                        ) : (
                                          <div>
                                            <input
                                              type="file"
                                              id="upload-button"
                                              disabled={disabledBtn}
                                              style={{ display: "none" }}
                                              onChange={handleImgChangeSingle}
                                            />
                                          </div>
                                        )}
                                        <br />
                                      </div>
                                      <BootstrapDialog
                                        onClose={handleClosedd2}
                                        aria-labelledby="customized-dialog-title"
                                        open={showdd2}
                                      >
                                        <IconButton
                                          aria-label="close"
                                          onClick={handleClosedd2}
                                          sx={{
                                            position: "absolute",
                                            right: 8,
                                            top: 8,
                                            color: (theme) =>
                                              theme.palette.grey[500],
                                          }}
                                        >
                                          X
                                        </IconButton>
                                        <DialogContent
                                          dividers
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                          }}
                                        >
                                          {getDbImg && getDbImg.length > 0 ? (
                                            <div>
                                              <img
                                                src={getDbImg[0].attachment}
                                                alt="dummy"
                                                className="dummyImg"
                                                onClick={openSaveImg}
                                              />
                                            </div>
                                          ) : (
                                            <img
                                              src={image.preview}
                                              alt="dummy"
                                              style={{
                                                height: "50%",
                                                width: "50%",
                                              }}
                                              onClick={openSaveImg}
                                              className="dummyImg"
                                            />
                                          )}
                                        </DialogContent>
                                      </BootstrapDialog>
                                    </div>
                                  </div>
                                </div>
                              </Box>
                            </Card>
                          </Grid>
                        </Grid>
                      )}
                    </Card>
                  </Grid>
                </Grid>
              </div>
              {/* toggle view End */}

              <Grid container spacing={3}>
                <Grid xs={12} md={12}>
                  <Card sx={{ p: 3 }}>
                    <Tabs
                      value={Tabvalue}
                      onChange={handleChange}
                      aria-label="Basic tabs"
                      defaultValue={0}
                    >
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="mdi:information-outline"
                              style={{ marginRight: "4px" }}
                            />
                            Details
                          </div>
                        }
                      />

                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="mdi:finance"
                              style={{ marginRight: "4px" }}
                            />
                            Financial
                          </div>
                        }
                      />
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="mdi:shop-location-outline"
                              style={{ marginRight: "4px" }}
                            />
                            Location
                          </div>
                        }
                      />
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="mdi:axis-arrow-info"
                              style={{ marginRight: "4px" }}
                            />
                            Supplier
                          </div>
                        }
                      />
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="codicon:references"
                              style={{ marginRight: "4px" }}
                            />
                            Reference
                          </div>
                        }
                      />
                    </Tabs>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 0}
                      sx={{ marginTop: "16px" }}
                    >
                      {/*Details*/}

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className="Requiredlabel"
                            >
                              {findCustomizeLabelDet(
                                "itm_det_part_deac_status"
                              ) || "Part Deac Status"}
                            </Typography>
                            <Autocomplete
                              options={partDeacStatus}
                              value={selected_partDeacStatus?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_partDeacStatus(value);
                                setIsPartDeacEmpty(false);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  //  onClick={handleClickProjectID}
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isPartDeacEmpty ? "errorEmpty" : ""
                                  }`}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className="Requiredlabel"
                            >
                              {findCustomizeLabelDet("itm_det_issue_uom") ||
                                "Issue UOM"}
                            </Typography>
                            <Autocomplete
                              options={issueUom}
                              value={selected_issueUom?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_IssueUom(value);
                                setIsIssueUomEmpty(false);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isIssueUomEmpty ? "errorEmpty" : ""
                                  }`}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className="Requiredlabel"
                            >
                              {findCustomizeLabelDet("itm_det_rcv_uom") ||
                                "Receive UOM"}
                            </Typography>
                            <Autocomplete
                             
                              options={recivedUom}
                              value={selected_recivedUom?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_RecivedUom(value);
                                setIsReciveUomEmpty(false);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  className={`Extrasize ${
                                    isReciveUomEmpty ? "errorEmpty" : ""
                                  }`}
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("itm_det_rcv_uom_") ||
                                "Conversion Factor:"}
                            </Typography>
                           
                            <TextField
                              name="name"
                              size="small"
                              disabled
                              value={conversionFactor}
                              className="ExtrasizeDisable"
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_storage_type"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_storage_type") ||
                                "Storage Type"}
                            </Typography>
                            <Autocomplete
                              options={storageType}
                              value={selected_storageType?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_StorageType(value);
                                setIsAssetGroupCodeEmpty(false);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  className={`Extrasize ${
                                    isAssetGroupCodeEmpty ? "errorEmpty" : ""
                                  }`}
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_cube"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_cube") || "Cube"}
                            </Typography>
                          
                            <TextField
                              id="outlined-basic"
                              size="small"
                              placeholder=".0000"
                              variant="outlined"
                              value={Cube}
                              onChange={(e) => {
                                setCube(e.target.value);
                                
                              }}
                              className={
                                errorField === "itm_mst_stockno"
                                  ? "erroBorderadd"
                                  : ""
                              }
                              fullWidth
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_shelf_life"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_shelf_life") ||
                                "Shelf Life"}
                              
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              variant="outlined"
                              value={shelfLife}
                              onChange={(e) => {
                                setshelfLife(e.target.value);
                                
                              }}
                              className={
                                errorField === "itm_mst_stockno"
                                  ? "erroBorderadd"
                                  : ""
                              }
                              fullWidth
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              
                            >
                              {findCustomizeLabelDet("itm_det_eoq") || "EOQ"}
                            </Typography>
                          
                            <TextField
                              name="name"
                              size="small"
                              placeholder="0"
                              disabled
                              value={eOQ}
                              onChange={(e) => {
                                setEOQ(e.target.value);
                              }}
                               
                              className="ExtrasizeDisable"
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              
                            >
                              {findCustomizeLabelDet("itm_det_eoqqq") ||
                                "Count Frequency:"}
                            </Typography>
                             
                            <TextField
                              name="name"
                              size="small"
                              disabled
                              value={countFrequency}
                              onChange= {(e) => {
                                  setCountFrequency(e.target.value);
                                }}
                              className="ExtrasizeDisable"
                            />
                          </Stack>
                          
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                             
                            >
                              {findCustomizeLabelDet("itm_det_eoqqq") ||
                                "Average Lead Time:"}
                            </Typography>

                            <TextField
                              name="name"
                              size="small"
                              disabled
                              value={averageLeadTime}
                              onChange= {(e) => {
                                setAverageLeadTime(e.target.value);
                              }}
                              className="ExtrasizeDisable"
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_auto_spare"
                              )}
                            >
                              {findCustomizeLabel("itm_det_auto_spare") ||
                                "Auto Spare"}
                            </Typography>
                           
                            <Checkbox className="customeCheckBox"
                                  checked={autoSpare === 1}
                                  onChange={(e) => {
                                    setAutoSpare(e.target.checked ? 1 : 0);
                                  }} />
                                  
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_critical_spare"
                              )}
                            >
                              {findCustomizeLabel("itm_det_critical_spare") ||
                                "Critical Spare"}
                            </Typography> 
                            <Checkbox className="customeCheckBox"
                                  checked={criticalSpare === 1}
                                  onChange={(e) => {
                                    setriticalSpare(e.target.checked ? 1 : 0);
                                  }} />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_hzd_mtl"
                              )}
                            >
                              {findCustomizeLabel("itm_det_hzd_mtl") ||
                                "Hazardous Material"}
                              
                            </Typography>
                            <Checkbox className="customeCheckBox"
                                  checked={HazardousMaterial === 1}
                                  onChange={(e) => {
                                    setHazardousMaterial(e.target.checked ? 1 : 0);
                                  }} />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_abc_class"
                              )}
                            >
                              {findCustomizeLabel("itm_det_abc_class") ||
                                "ABC Class"}
                            </Typography>
                        
                            <TextField
                              id="outlined-basic"
                              size="small"
                              value={abcClass}
                              onChange={(e) => {
                                setAbcClass(e.target.value.toUpperCase().slice(0, 1));
                              }}
                              className={
                                errorField === "ast_mst_safety_rqmts"
                                  ? "erroBorderadd"
                                  : "TxtAra"
                              }
                              variant="outlined"
                              fullWidth
                              inputProps={{ maxLength: 1, style: { textTransform: 'uppercase' } }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_order_pt"
                              )}
                            >
                              {findCustomizeLabel("itm_det_order_pt") ||
                                "Order Point"}
                            </Typography>
                            
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              value={orderPoint}
                              onChange={(e) => {
                                setOrderPoint(e.target.value);
                              }}
                              fullWidth
                              placeholder=".0000"
                              
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_maximum"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_maximum") ||
                                "Maximum"}
                            </Typography>

                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              value={maximumInvtr}
                              onChange={(e) => {
                                setMaximumInvtr(e.target.value);
                              }}
                              className={
                                errorField === "ast_det_mfg_cd"
                                  ? "erroBorderadd"
                                  : ""
                              }
                              fullWidth
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_lastactdate"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_lastactdate") ||
                                "Last Activity Date"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_lastcntdate"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_lastcntdate") ||
                                "Last Count Date"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_next_cnt_date"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_next_cnt_date") ||
                                "Next Count Date"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                      <Box sx={{ marginTop: "8px",mb:1 }}>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr",
                            alignItems: "center",
                            borderBottom: "1px solid #cfcfcf",
                            paddingBottom: "10px",
                            fontWeight: "500",
                          }}
                        >
                          <Iconify
                          className="IconCss"
                              icon="mdi:folder-information-outline"
                              style={{ marginRight: "4px" }}
                            />
                           UDF
                        </div>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box
                            rowGap={0}
                            columnGap={0}
                            display="grid"
                            marginBottom={1}
                          >
                            <Stack spacing={1}>
                              <Typography
                                variant="subtitle2"
                                className={findCustomizerequiredLabel(
                                  "itm_det_note1"
                                )}
                              >
                                {findCustomizeLabelDet("itm_det_note1") ||
                                  "UDF Note1"}
                              </Typography>
                            
                              <TextareaAutosize
                                aria-label="empty textarea"
                                placeholder="Note..."
                                minRows={6.5}
                                value={udfNote1}
                                onChange={(e) => {
                                 // setErrorField(null);
                                  setUdfNote1(e.target.value);
                                }}
                                className={
                                  errorField === "ast_mst_asset_longdesc"
                                    ? "erroBorderadd"
                                    : "TxtAra"
                                }
                              />
                            </Stack>
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_varchar1"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_varchar1") ||
                                "Asset No"}
                            </Typography>

                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={assetNoSet}
                              onChange={(e) => {
                                setAssetNoSet(e.target.value);
                               // setErrorField(null);
                              }}
                              className={
                                errorField === "ast_det_varchar1"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_varchar2"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_varchar2") ||
                                "Weight"}
                            </Typography>
                           
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={weightSet}
                              onChange={(e) => {
                                setWeightSet(e.target.value);
                                //setErrorField(null);
                              }}
                              className={
                                errorField === "ast_det_varchar2"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_varchar3"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_varchar3") ||
                                "UDF Text3"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_3}
                              onChange={(e) => {
                                setUDFText_3(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "ast_det_varchar3"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_varchar4"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_varchar4") ||
                                "UDF Text4"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_4}
                              onChange={(e) => {
                                setUDFText_4(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "itm_det_varchar4"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_varchar5"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_varchar5") ||
                                "UDF Text5"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_5}
                              onChange={(e) => {
                                setUDFText_5(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "itm_det_varchar5"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_varchar6"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_varchar6") ||
                                "UDF Text6"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_6}
                              onChange={(e) => {
                                setUDFText_6(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "itm_det_varchar6"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_varchar7"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_varchar7") ||
                                "UDF Text7"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_7}
                              onChange={(e) => {
                                setUDFText_7(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "itm_det_varchar7"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_varchar8"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_varchar8") ||
                                "UDF Text8"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_8}
                              onChange={(e) => {
                                setUDFText_8(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "itm_det_varchar8"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_varchar9"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_varchar9") ||
                                "Manufacturer"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_9}
                              onChange={(e) => {
                                setUDFText_9(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "itm_det_varchar9"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_varchar10"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_varchar10") ||
                                "Made In"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_10}
                              onChange={(e) => {
                                setUDFText_10(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "ast_det_varchar23"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_numeric1"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_numeric1") ||
                                "Billable Cost"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFNumber_1}
                              onChange={(e) => {
                                setUDFNumber_1(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "ast_det_varchar24"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>

                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_numeric2"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_numeric2") ||
                                "UDF Numeric2"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              defaultValue={UDFNumber_2}
                              onChange={(e) => {
                                setUDFNumber_2(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "itm_det_numeric2"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_numeric3"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_numeric3") ||
                                "UDF Numeric3"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              defaultValue={UDFNumber_3}
                              onChange={(e) => {
                                setUDFNumber_3(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "itm_det_numeric3"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_numeric4"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_numeric4") ||
                                "UDF Numeric4"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              defaultValue={UDFNumber_4}
                              onChange={(e) => {
                                setUDFNumber_4(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "itm_det_numeric4"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_numeric5"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_numeric5") ||
                                "UDF Numeric5"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              defaultValue={UDFNumber_5}
                              onChange={(e) => {
                                setUDFNumber_5(e.target.value);
                                setErrorField(null);
                              }}
                              className={
                                errorField === "itm_det_numeric5"
                                  ? "erroBorderadd"
                                  : ""
                              }
                            />
                          </Stack>

                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_datetime1"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_datetime1") ||
                                "UDF Date1"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_1}
                              format="dd/MM/yyyy HH:mm"
                              className={
                                errorField === "itm_det_datetime1"
                                  ? "erroBorderadd"
                                  : "Extrasize"
                              }
                              onChange={(newDate) => {
                                setUDFDate_1(newDate); // Update your state with the new value
                                setErrorField(null);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_datetime2"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_datetime2") ||
                                "UDF Date2"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_2}
                              format="dd/MM/yyyy HH:mm"
                              className={
                                errorField === "itm_det_datetime2"
                                  ? "erroBorderadd"
                                  : "Extrasize"
                              }
                              onChange={(newDate) => {
                                setUDFDate_2(newDate); // Update your state with the new value
                                setErrorField(null);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_datetime3"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_datetime3") ||
                                "UDF Date3"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_3}
                              format="dd/MM/yyyy HH:mm"
                              className={
                                errorField === "itm_det_datetime3"
                                  ? "erroBorderadd"
                                  : "Extrasize"
                              }
                              onChange={(newDate) => {
                                setUDFDate_3(newDate);
                                setErrorField(null);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_datetime4"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_datetime4") ||
                                "UDF Date4"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_4}
                              format="dd/MM/yyyy HH:mm"
                              className={
                                errorField === "itm_det_datetime4"
                                  ? "erroBorderadd"
                                  : "Extrasize"
                              }
                              onChange={(newDate) => {
                                setUDFDate_4(newDate);
                                setErrorField(null);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "itm_det_datetime5"
                              )}
                            >
                              {findCustomizeLabelDet("itm_det_datetime5") ||
                                "UDF Date5"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_5}
                              format="dd/MM/yyyy HH:mm"
                              className={
                                errorField === "itm_det_datetime5"
                                  ? "erroBorderadd"
                                  : "Extrasize"
                              }
                              onChange={(newDate) => {
                                setUDFDate_5(newDate); // Update your state with the new value
                                setErrorField(null);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                      <Box sx={{ marginTop: "8px" }}>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr",
                            alignItems: "center",
                            borderBottom: "1px solid #cfcfcf",
                            paddingBottom: "10px",
                            fontWeight: "500",
                          }}
                        >
                          <Iconify
                            className="IconCss"
                            icon="tdesign:calculation-1"
                            style={{ marginRight: "4px" }}
                          />
                          Reorder Calculation
                        </div>
                      </Box>
                      <Grid container spacing={2} sx={{ mt: 1.5, mb: 2.5 }}>
                        <TableContainer
                          component={Paper}
                          sx={{ border: 1, borderColor: "grey.400" }}
                        >
                          <Table
                            sx={{ minWidth: 700, borderCollapse: "collapse" }}
                            aria-label="spanning table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  align="left"
                                  colSpan={1}
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  Details
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  Price
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  Total On-Hand:
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    borderBottom: "1px solid #00000017",
                                    paddingRight: "32px",
                                  }}
                                >
                                  1
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  Reserved:
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  1 (-){" "}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  Shortage:
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  1 (-){" "}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  Quantity Available:
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    borderBottom: "1px solid #00000017",
                                    paddingRight: "32px",
                                  }}
                                >
                                  0
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  PR Outstanding:
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  0 (+){" "}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  PO Outstanding:
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  0 (+){" "}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={1}
                                  align="center"
                                  sx={{ borderBottom: "1px solid #00000017" }}
                                >
                                  Reorder SubTotal:
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    borderBottom: "1px solid #00000017",
                                    paddingRight: "20px",
                                  }}
                                >
                                  20
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Box>

                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 1}
                      sx={{ marginTop: "16px" }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              //className="Requiredlabel"
                            >
                              {findCustomizeLabelDet(
                                "itm_det_acct_type"
                              ) || "Account Type"}
                            </Typography>
                            <Autocomplete   
                              options={accountType}
                              value={selected_AccountType?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_AccountType(value);
                               // setIsAssetTypeEmpty(false);
                              }}
                              disabled={RowID !== "" && RowID !== null && RowID !== undefined}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  //  onClick={handleClickProjectID}
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isAssetTypeEmpty ? "errorEmpty" : ""
                                  }`}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("itm_det_ytd_usage") ||
                                "YTD Usage:"}
                            </Typography>
                          
                            <TextField
                              name="name"
                              size="small"
                              disabled
                              value={ytdUsage}
                              className="ExtrasizeDisable"
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("itm_det_ytd_turns") ||
                                "YTD Turns:"}
                            </Typography>
                            
                            <TextField
                              name="name"
                              size="small"
                              disabled
                              value={ytdTurns}
                              className="ExtrasizeDisable"
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("itm_det_ytd_stockouts") ||
                                "YTD Stockouts:"}
                            </Typography>

                            <TextField
                              name="name"
                              size="small"
                              disabled
                              value={ytdStockouts}
                              className="ExtrasizeDisable"
                            />
                          </Stack>
                        
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("ast_det_cus_code")}>
                            {findCustomizeLabelDet("itm_det_tax_cd") ||
                              "Tax Code"}
                            </Typography>
                            <div ref={MasterLocationCodeRef}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                className={`ExtrasizeDisable ${
                                  isAssetNoEmpty ? "errorEmpty" : ""
                                }`}
                                
                                fullWidth
                                value={taxCode || ""}
                                disabled
                                placeholder="Select..."
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={handleCancelTaxCode}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleEditClickTaxCode}
                                  />,
                                ]}
                              />
                            </div>
                                </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("itm_det_lastyr_usage") ||
                                "Last Year Usage:"}
                            </Typography>
                        
                            <TextField
                              name="name"
                              size="small"
                              disabled
                              value={lastyrUsage}
                              className="ExtrasizeDisable"
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("itm_det_lastyr_turns") ||
                                "Last Year Turns:"}
                            </Typography>
                       
                            <TextField
                              name="name"
                              size="small"
                              disabled
                              value={lastyrTurns}
                              className="ExtrasizeDisable"
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("itm_det_lastyr_stkouts") ||
                                "Last Year Stockouts:"}
                            </Typography>

                            <TextField
                              name="name"
                              size="small"
                              disabled
                              value={lastyrStkouts}
                              className="ExtrasizeDisable"
                            />
                          </Stack>
                      
                        </Grid>
                        </Grid>
                       <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 700,mt:2 }} aria-label="spanning table">
                            <TableHead>
                              
                              <TableRow>
                                <TableCell>Costing Rule</TableCell>
                                <TableCell align="center">Item Cost (A)</TableCell>
                                <TableCell align="center">Total On Hand (B)</TableCell>
                                <TableCell align="center">Total Repair Location (C)</TableCell>
                                <TableCell align="center">Value A*(B-C)</TableCell>
                              
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rowsddd.map((row) => (
                                <TableRow key={row.id}>
                                  <TableCell>
                                    <Radio
                                      checked={selectedRowd === row.id}
                                      onChange={() => handleRadioChange(row.id,row.code)}
                                      value={row.id}
                                      name="costing-rule-radio"
                                      inputProps={{ 'aria-label': row.costingRule }}
                                    />
                                    {row.costingRule}
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                     // defaultValue={row.itemCost}
                                      value={inputValues[row.id]?.itemCost || row.itemCost}
                                      onChange={(e) => handleInputChange(row.id, e.target.value)}
                                      type="number"
                                      disabled={selectedRowd !== row.id}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      defaultValue={row.totalOnHand}
                                      type="number"
                                      disabled
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      defaultValue={row.totalRepairLocation}
                                      type="number"
                                      disabled
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      defaultValue={row.value}
                                      type="number"
                                      disabled
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                              {selectedRowData && (
                                <>
                                  <TableRow>
                                  <TableCell rowSpan={3} />
                                    <TableCell colSpan={3}>Surcharge</TableCell>
                                    <TableCell align="right">Surcharge Value</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell colSpan={3}>0%</TableCell>
                                    <TableCell align="right">0.00</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell colSpan={3}>Item Cost:</TableCell>
                                    <TableCell align="right">{ccyFormat(itemCost)}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                  <TableCell rowSpan={3} />
                                    <TableCell colSpan={3}>Issue Price:</TableCell>
                                    <TableCell align="right">{ccyFormat(issuePrice)}</TableCell>
                                  </TableRow>
                                </>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 2}
                      sx={{ marginTop: "16px" }}
                    >
                      {RowID && (
                        <AssetUsage
                          data={{
                            RowID: RowID,
                          }}
                          onDataFromSecondComponent={
                            handleDataFromSecondComponent
                          }
                        />
                      )}
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 3}
                      sx={{ marginTop: "16px" }}
                    >
                      {RowID && (
                        <AssetSpecification
                          data={{
                            RowID: RowID,
                          }}
                        />
                      )}
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 4}
                      sx={{ marginTop: "16px" }}
                    >
                      {RowID && (
                        <div>
                          <div
                            style={{
                              paddingBottom: "20px",
                              backgroundColor: "white",
                            }}
                          >
                            <div
                              className="template-demo"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <div style={{ marginRight: "0px" }}>
                                <Iconify
                                  icon="codicon:references"
                                  style={{
                                    marginRight: "4px",
                                    width: "30px",
                                    height: "30px",
                                  }}
                                />
                              </div>
                              <div
                                className="template-demo"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <div
                                  style={{
                                    marginRight: "10px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Reference
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table table-hover mt-2 col-sm-12 astFimg">
                              <thead>
                                <tr>
                                  <th>Image</th>
                                  <th>File Name</th>
                                  <th>Audit User</th>
                                  <th>Audit Date</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {RefImg !== "" &&
                                  RefImg !== null &&
                                  RefImg.map((item, index) => (
                                    <tr
                                      key={index}
                                      className="tableRow_Attachment_hover"
                                    >
                                      <td>
                                        {item.file_name
                                          .toLowerCase()
                                          .endsWith(".pdf") ? (
                                          <FontAwesomeIcon
                                            icon={faFilePdf}
                                            onClick={() =>
                                              openPDFInNewTab(item.attachment)
                                            }
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                            }}
                                            className="fntpdf"
                                          />
                                        ) : (
                                          <img
                                            key={index}
                                            src={item.attachment}
                                            style={{
                                              width: "60px",
                                              height: "60px",
                                            }}
                                            onClick={() => handleShowdata(item)}
                                          />
                                        )}
                                      </td>

                                      <td>{item.file_name}</td>
                                      <td>{item.audit_user}</td>
                                      <td>
                                        {new Date(
                                          item.audit_date.date
                                        ).toLocaleString("en-US", {
                                          year: "numeric",
                                          month: "2-digit",
                                          day: "2-digit",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          second: "2-digit",
                                          // Show milliseconds with 3 digits
                                        })}
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDeleteReferenceApi(item.RowID)
                                          }
                                          className="btn multiplsimg"
                                        >
                                          <Iconify icon="carbon:close-outline" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}

                                {selectedImages.map((image, index) =>
                                  image && index === undefined ? (
                                    <tr>
                                      <td>
                                        <img
                                          src={RefImg["0"].attachment}
                                          style={{
                                            width: "60px",
                                            height: "60px",
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  ) : image.name
                                      .toLowerCase()
                                      .endsWith(".pdf") ? (
                                    <tr key={index}>
                                      <td>
                                        <FontAwesomeIcon
                                          icon={faFilePdf}
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                          }}
                                        />
                                      </td>
                                      <td>{image.name}</td>
                                      <td>Admin</td>
                                      <td>
                                        {new Date().toLocaleString() + ""}
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleDeleteImg(index);
                                          }}
                                        >
                                          <Iconify icon="carbon:close-outline" />
                                        </button>
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr key={index}>
                                      <td>
                                        <img
                                          key={index}
                                          src={URL.createObjectURL(image)}
                                          alt="Uploaded image"
                                          onClick={(e) =>
                                            handleShowdd(e, image)
                                          }
                                        />
                                      </td>
                                      <td>{image.name}</td>
                                      <td>Admin</td>
                                      <td>
                                        {new Date().toLocaleString() + ""}
                                      </td>

                                      <td>
                                        <button
                                          type="button"
                                          className="btn"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleDeleteImg(index);
                                          }}
                                        >
                                          <Iconify icon="carbon:close-outline" />
                                        </button>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>

                              {isMyStateEmpty ? (
                                <BootstrapDialog
                                  onClose={handleClosedd}
                                  aria-labelledby="customized-dialog-title"
                                  open={showdd}
                                >
                                  <IconButton
                                    aria-label="close"
                                    onClick={handleClosedd}
                                    sx={{
                                      position: "absolute",
                                      right: 8,
                                      top: 8,
                                      color: (theme) => theme.palette.grey[500],
                                    }}
                                  >
                                    <Iconify
                                      icon="carbon:close-outline"
                                      style={{ marginRight: "4px" }}
                                    />
                                  </IconButton>
                                  <DialogContent dividers>
                                    <Typography gutterBottom>
                                      <img
                                        src={selectedImage}
                                        style={{
                                          width: "100%",
                                          height: "auto",
                                        }}
                                      />
                                    </Typography>
                                  </DialogContent>
                                </BootstrapDialog>
                              ) : (
                                <BootstrapDialog
                                  onClose={handleClosedd}
                                  aria-labelledby="customized-dialog-title"
                                  open={showdd}
                                >
                                  <IconButton
                                    aria-label="close"
                                    onClick={handleClosedd}
                                    sx={{
                                      position: "absolute",
                                      right: 8,
                                      top: 8,
                                      color: (theme) => theme.palette.grey[500],
                                    }}
                                  >
                                    <Iconify icon="carbon:close-outline" />
                                  </IconButton>
                                  <DialogContent dividers>
                                    <Typography gutterBottom>
                                      <img
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                        }}
                                        src={URL.createObjectURL(handalImg)}
                                        alt="Uploaded image"
                                      />
                                    </Typography>
                                  </DialogContent>
                                </BootstrapDialog>
                              )}
                            </table>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "20px",
                            }}
                          >
                            <form onSubmit={handleSubmit} className="row">
                              <div className="col-sm-10 text-center">
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                  multiple
                                  onChange={handleImageChange}
                                  className="form-control form-control-lg"
                                  id="formFileMultiple"
                                />
                                <Button
                                  onClick={handleButtonClick}
                                  type="submit"
                                  // className="btn Refbtl"
                                  className="tabAddButton"
                                >
                                  + Add Attachment
                                </Button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                    </Box>
                    <Grid
                      container
                      xs={12}
                      md={12}
                      justifyContent="flex-end"
                      style={{ paddingRight: "20px", marginTop: "20px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Button
                          component={RouterLink}
                          // href={paths.dashboard.work.neworder}
                          variant="contained"
                          className="SaveButton"
                          startIcon={<Iconify icon="mingcute:save-fill" />}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "10px",
                          }}
                          onClick={onClickChange}
                          disabled={
                            (completeRowID !== undefined &&
                              completeRowID !== "" &&
                              completeRowID !== null) ||
                            (selected_Status &&
                              selected_Status.label === "CLO : CLOSED")
                          }
                        >
                          {Button_save === "Duplicate" ? "Save" : Button_save}
                        </Button>
                        <Button
                          variant="soft"
                          color="error"
                          className="CloseButton"
                          onClick={onClickCancel}
                          startIcon={<Iconify icon="jam:close" />}
                        >
                          Close
                        </Button>
                      </div>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
              {/* Asset Parent Flag model popup */}
              <BootstrapDialog
                onClose={handleCloseModal}
                aria-labelledby="customized-dialog-title"
                open={modalOpenMasterLocation}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Parent ID
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
                  <div className="TblSelect">
                    <AssetParentIdList
                      onRowClick={handleRowData2}
                      onChangePage={handleRowDataPagechg}
                      onSearchChange={handelRowSearch}
                    />
                  </div>
                </DialogContent>
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span class="TotlFont">
                      {TotalSearch
                        ? // Content to render if condition1 is true
                          TotalSearch
                        : viewedTotlRows
                        ? // Content to render if condition2 is true
                          TotalAssetNo - viewedTotlRows
                        : TotalAssetNo
                        ? // Content to render if condition3 is true
                          TotalAssetNo
                        : // Content to render if none of the conditions are true
                          0}
                      &nbsp;Asset
                    </span>
                  </div>

                  <div className="mlauto">
                    <Button variant="primary" onClick={handleCloseModal}>
                      Select
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
              {/* Asset model popup end*/}

              {/* Inventory Master Location model popup */}
              <BootstrapDialog
                onClose={handleCloseModalMasterLocation}
                aria-labelledby="customized-dialog-title"
                open={modalOpenInventoryMasteLocation}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                 Master Location
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModalMasterLocation}
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
                  <div className="TblSelect">
                    <InventoryMasterLocation
                      onRowClick={handleRowData3}
                      onChangePage={handleRowDataPagechg}
                      onSearchChange={handelRowSearch}
                    />
                  </div>
                </DialogContent>
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span class="TotlFont">
                      {TotalSearch
                        ? // Content to render if condition1 is true
                          TotalSearch
                        : viewedTotlRows
                        ? // Content to render if condition2 is true
                          TotalAssetNo - viewedTotlRows
                        : TotalAssetNo
                        ? // Content to render if condition3 is true
                          TotalAssetNo
                        : // Content to render if none of the conditions are true
                          0}
                      &nbsp;Total
                    </span>
                  </div>

                  <div className="mlauto">
                    <Button
                      variant="primary"
                      onClick={handleCloseModalMasterLocation}
                    >
                      Select
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
              {/* Inventory Master Tax Code model popup end*/}

                  {/* Inventory Master Location model popup */}
              <BootstrapDialog
                onClose={handleCloseModalMasterLocation}
                aria-labelledby="customized-dialog-title"
                open={modalOpenInventoryTaxCode}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                 Tax Code
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModalMasterTaxCode}
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
                  <div className="TblSelect">
                    <InventoryMasterTaxCode
                      onRowClick={handleRowDataTaxCode}
                      onChangePage={handleRowDataPagechgTaxCode}
                      onSearchChange={handelRowSearchTaxCode}
                    />
                  </div>
                </DialogContent>
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span class="TotlFont">
                      {TotalSearch
                        ? // Content to render if condition1 is true
                          TotalSearch
                        : viewedTotlRows
                        ? // Content to render if condition2 is true
                          TotalAssetNo - viewedTotlRows
                        : TotalAssetNo
                        ? // Content to render if condition3 is true
                          TotalAssetNo
                        : // Content to render if none of the conditions are true
                          0}
                      &nbsp;Total
                    </span>
                  </div>

                  <div className="mlauto">
                    <Button
                      variant="primary"
                      onClick={handleCloseModalMasterTaxCode}
                    >
                      Select
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
              {/* Inventory Master Tax Code model popup end*/}

              {/******************** Status Details ********************/}
              <div>
                <BootstrapDialog
                  onClose={StatushandleClose}
                  aria-labelledby="customized-dialog-title"
                  open={StatusShow}
                  maxWidth="lg"
                  fullWidth
                >
                  <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    className="dailogTitWork"
                  >
                    Asset Status Audit
                  </DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={StatushandleClose}
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
                        maxWidth: "600px",
                        marginLeft: "110px",
                        marginTop: "-30px",
                      }}
                    >
                      <StepContainer>
                        {steps.map(
                          ({
                            step,
                            label,
                            label1,
                            label2,
                            label3,
                            label4,
                            label5,
                          }) => (
                            <div
                              key={step}
                              style={{ position: "relative", zIndex: 1 }}
                            >
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "grey",
                                  position: "absolute",
                                  left: "-81px",
                                  top: "45px",
                                  width: "80px",
                                  height: "20px",
                                  borderRadius: "5%",
                                  textAlign: "right",
                                }}
                              >
                                {label5}
                              </div>
                              <div
                                step={step}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: "#4694d1",
                                  border: `3px solid ${
                                    step === "completed" ? "#0080FF" : "#F3E7F3"
                                  }`,
                                  transition: "0.4s ease",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{ fontSize: "15px", color: "#f3e7f3" }}
                                >
                                  {step}
                                </div>
                              </div>

                              <div
                                style={{
                                  position: "relative",
                                  bottom: "30px",
                                  textAlign: "left",
                                  left: "50px",
                                }}
                              >
                                <div
                                  key={step}
                                  style={{ fontSize: "15px", color: "#4a154b" }}
                                >
                                  {label} ({label1})
                                </div>
                              </div>

                              <div
                                style={{
                                  position: "relative",
                                  bottom: "30px",
                                  textAlign: "left",
                                  left: "50px",
                                }}
                              >
                                <div
                                  key={step}
                                  style={{ fontSize: "11px", color: "grey" }}
                                >
                                  Status Update By: {label2} ({label3})
                                </div>
                              </div>

                              <div
                                style={{
                                  position: "relative",
                                  bottom: "30px",
                                  textAlign: "left",
                                  left: "50px",
                                }}
                              >
                                <div
                                  key={step}
                                  style={{ fontSize: "11px", color: "grey" }}
                                >
                                  On Start Date: {label4}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </StepContainer>
                    </div>
                  </DialogContent>
                </BootstrapDialog>
              </div>
              {/******************** Comments add Details ********************/}

              {/* single Upload Img Show */}
              <BootstrapDialog
                onClose={UploadImghandleClose}
                aria-labelledby="customized-dialog-title"
                open={uploadImgShow}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Selected Image
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={UploadImghandleClose}
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
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="upload_img"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </div>
                </DialogContent>
              </BootstrapDialog>
              {/******************** PM Setup ********************/}
              <BootstrapDialog
                onClose={PMSetuphandleClose}
                aria-labelledby="customized-dialog-title"
                open={PMSetupShow}
                maxWidth="lg"
                fullWidth
              >
                {/* <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  PM Setup
                </DialogTitle> */}
                <IconButton
                  aria-label="close"
                  onClick={PMSetuphandleClose}
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
                  <PmSetup
                    data={{
                      RowID: RowID,
                      WorkOrderNo: WorkOrderNo,
                      Asset_No: AssetNo,
                    }}
                  />
                </DialogContent>
              </BootstrapDialog>

              {/******************** WO History ********************/}
              <BootstrapDialog
                onClose={WOHistoryhandleClose}
                aria-labelledby="customized-dialog-title"
                open={WOHistoryShow}
                maxWidth="lg"
                fullWidth
              >
                <IconButton
                  aria-label="close"
                  onClick={WOHistoryhandleClose}
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
                  <WoHistory
                    data={{
                      RowID: RowID,
                      WorkOrderNo: WorkOrderNo,
                      Asset_No: AssetNo,
                    }}
                  />
                </DialogContent>
              </BootstrapDialog>

              {/******************** Relocation History ********************/}
              <BootstrapDialog
                onClose={RelocationHistoryhandleClose}
                aria-labelledby="customized-dialog-title"
                open={RelocationHistoryShow}
                maxWidth="lg"
                fullWidth
              >
                <IconButton
                  aria-label="close"
                  onClick={RelocationHistoryhandleClose}
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
                  <RelocationHistory
                    data={{
                      RowID: RowID,
                      WorkOrderNo: WorkOrderNo,
                      Asset_No: AssetNo,
                    }}
                  />
                </DialogContent>
              </BootstrapDialog>

              {/******************** Check List ********************/}
              <BootstrapDialog
                onClose={CheckListhandleClose}
                aria-labelledby="customized-dialog-title"
                open={CheckListShow}
                maxWidth="lg"
                fullWidth
              >
                <IconButton
                  aria-label="close"
                  onClick={CheckListhandleClose}
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
                  <CheckList
                    data={{
                      RowID: RowID,
                      WorkOrderNo: WorkOrderNo,
                      Asset_No: AssetNo,
                    }}
                  />
                </DialogContent>
              </BootstrapDialog>
              <div className="AssetFromSnackbar">
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={null}
                  onClose={handleCloseSnackbar}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  // sx={{
                  //   boxShadow: '0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)'
                  // }}
                  sx={{
                    boxShadow:
                      "0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)",
                    "& .MuiAlert-filledError": {
                      backgroundColor: "#fff",
                      color: "#000",
                      fontWeight: "600",
                      position: "relative",
                      animation: snackbarOpen
                        ? "bounce-in 0.5s ease-out"
                        : "none", // Apply bouncing animation conditionally
                    },
                  }}
                >
                  <Alert
                    onClose={handleCloseSnackbar}
                    severity="error"
                    variant="filled"
                    // sx={{ backgroundColor: '#fff', color: '#000', fontWeight: '600', position: 'relative' }}
                    sx={{
                      "@keyframes bounce-in": {
                        "0%": { transform: "scale(0.9)" },
                        "50%": { transform: "scale(1.05)" },
                        "100%": { transform: "scale(1)" },
                      },
                    }}
                  >
                    {snackbarMessage}

                    <LinearProgress
                      variant="determinate"
                      value={snackbarOpen ? 100 - progress : 0}
                      style={{
                        width: "99%",
                        position: "absolute",
                        bottom: "0",
                        marginLeft: "-50px",
                      }}
                      sx={{
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "green", // Change the color here
                        },
                      }}
                    />
                  </Alert>
                </Snackbar>
              </div>
            </>
          )}
        </div>
      </Container>
      <ToastContainer />
    </>
  );
}

InventoryForm.propTypes = {
  currentUser: PropTypes.object,
};

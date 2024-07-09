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

import Grid from "@mui/material/Unstable_Grid2";

import Checkbox from "@mui/material/Checkbox";
import { useLocation, useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
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



// components
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";
import refrencImg from "../../../assets/img/specification.png";
// import WorkOrderAssetNo from "../WorkOrderAssetNo";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import GetAssetList from "../PopupModel/GetAssetList";

//import AssetCustomerCodeList from "../AssetCustomerCodeList"

//import PmSetup from "../Asset_module/PmSetup";
//import WoHistory from "../Asset_module/AssetWoHistory";
//import RelocationHistory from "../Asset_module/RelocationHistory";
//import CheckList from "../Asset_module/AssetCheckList";
import loderImg from "../../../assets/img/loder.gif";


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

export default function CreateNewPmform ({ currentUser, onPageChange }) {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_name = localStorage.getItem("emp_mst_name");
  const location = useLocation();
  
  const state = location.state || {};

    const { RowID, PM_no, currentPage, selectedOption } = state || {};
  

  const { completeRowID } = location.state || {};
  const { closeRowID } = location.state || {};

  const [loading, setLoading] = useState(true);

  const [PmMstLabel, setPmMstLabel] = useState([]);
  const [PmdetLabel, setPmdetLabel] = useState([]);

  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const settings = useSettingsContext();

  const currentDate = new Date();
  const formattedDateTime = currentDate.toISOString().slice(0, 16);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImages2, setSelectedImages2] = useState([]);
  const [selectedDate, setSelectedDate] = useState(currentDate);
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


// New State added by stya

const [Pm_type, setPm_type] = useState([{label:'Asset',value:'Asset'},{label:'Group',value:'Group'}]); 
const [selected_PmType, setselected_PmType] = useState([]);

const [modalOpenAsset, setModalOpenAsset] = useState(false);
const [modalOpenAssetCustomerCode, setModalOpenAssetCustomerCode] = useState(false);

const [Status, setStatus] = useState([]);
const [selected_Status, setSelected_Status] = useState([]);

const [isCheckedFlag, setIsCheckedFlag] = useState(false); 
const [isCheckedLoop, setIsCheckedLoop] = useState(false);
const [isCheckedPmDate, setIsCheckedPmDate] = useState(false);

const [FrequencyCode, setFrequencyCode] = useState([]);
const [selected_FrequencyCode, setSelected_FrequencyCode] = useState([]);

const [PlanPriority, setPlanPriority] = useState([]);
const [selected_PlanPriority, setSelected_PlanPriority] = useState([]);

const [LeadDay, setLeadDay] = useState("");
const [ShadowGroup, setShadowGroup] = useState("");

const [PmLPMUOM, setPmLPMUOM] = useState([]);
const [selected_PmLPMUOM, setselected_PmLPMUOM] = useState([]);

const [LPMDate, setLPMDate] = useState(new Date());
const [LPMClosedDate, setLPMClosedDate] = useState(new Date());

const [FaultCode ,setFaultCode] = useState([]);
const [selected_FaultCode, setselected_FaultCode] = useState([]);

const [NextDueSate, setNextDueDate] = useState("");
const [NextCreateDate, setNextCreateDate] = useState("");

const [Short_Description, setShort_Description] = useState("");

const [PmOriginator ,setPmOriginator] = useState([]);
const [selected_PmOriginator ,setselected_PmOriginator] = useState([]);





// End -----staya close code
const [Asset_CriFactor, setAsset_CriFactor] = useState([]); 
const [selected_CriFactor, setselected_CriFactor] = useState([]);

  
  const [Long_Description, setLong_Description] = useState("");

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

  const [Permanent_ID, setPermanent_ID] = useState("");

  const [SafetyRequirement, setSafetyRequirement] = useState("");
  const [BarcodeCount, setBarcodeCount] = useState("0");
  const [ManufactureCode, setManufactureCode] = useState("");
  const [AssetCost, setAssetCost] = useState([]);
  const [ResidualValue, setResidualValue] = useState([]);
  const [Permanent_IDFlag, setPermanentIDFlag] =useState([]);
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

  const [DepreciationMethod, setDepreciationMethod] = useState([{ label: "Straight-Line", value: "SL" }, { label: "Declining-Balance", value: "DB" }, { label: "Double-Declining", value: "DD" }]);
  const [selected_Depreciation_Method, setSelectedDepreciationMethod] = useState([]);

  const [UDFText_1, setUDFText_1] = useState("");
  const [UDFText_2, setUDFText_2] = useState("");
  const [UDFText_3, setUDFText_3] = useState("");
  const [UDFText_4, setUDFText_4] = useState("");
  const [UDFText_5, setUDFText_5] = useState("");
  const [UDFText_6, setUDFText_6] = useState("");
  const [UDFText_7, setUDFText_7] = useState("");
  const [UDFText_8, setUDFText_8] = useState("");
  const [UDFText_9, setUDFText_9] = useState("");
  const [UDFText_10, setUDFText_10] = useState("");
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

  const [UDFNumber_1, setUDFNumber_1] = useState();
  const [UDFNumber_2, setUDFNumber_2] = useState();
  const [UDFNumber_3, setUDFNumber_3] = useState();
  const [UDFNumber_4, setUDFNumber_4] = useState();
  const [UDFNumber_5, setUDFNumber_5] = useState();
  const [UDFNumber_6, setUDFNumber_6] = useState();
  const [UDFNumber_7, setUDFNumber_7] = useState();
  const [UDFNumber_8, setUDFNumber_8] = useState();
  const [UDFNumber_9, setUDFNumber_9] = useState();
  const [UDFNumber_10, setUDFNumber_10] = useState();
  const [UDFNumber_11, setUDFNumber_11] = useState();
  const [UDFNumber_12, setUDFNumber_12] = useState();
  const [UDFNumber_13, setUDFNumber_13] = useState();
  const [UDFNumber_14, setUDFNumber_14] = useState();
  const [UDFNumber_15, setUDFNumber_15] = useState();

  const [UDFDate_1, setUDFDate_1] = useState(new Date());
  const [UDFDate_2, setUDFDate_2] = useState(new Date());
  const [UDFDate_3, setUDFDate_3] = useState(new Date());
  const [UDFDate_4, setUDFDate_4] = useState(new Date());
  const [UDFDate_5, setUDFDate_5] = useState(new Date());
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
  const [isAssetCriticalFactorEmpty, setIsAssetCriticalFactorEmpty] = useState(false);
  const [isAssetShortDescEmpty,setIsAssetShortDescEmpty] = useState(false);
  const [isAssetTypeEmpty, setIsAssetTypeEmpty] =useState(false);
  const [isAssetCodeEmpty,setIsAssetCodeEmpty] = useState(false);
  const [isAssetGroupCodeEmpty,setIsAssetGroupCodeEmpty]= useState(false);
  const [isAssetWorkAreaEmpty,setIsAssetWorkAreaEmpty] = useState(false);
  const [isAssetLocation,setIsAssetLocation] =useState(false);
  const [isAssetLeavelEmpty,setIsAssetLeavelEmpty] = useState(false);
  const [isAssetCostCenterEmpty,setIsAssetCostCenterEmpty] = useState(false);





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
  const CustomerCodeRef = useRef(null);
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
  /*   new state added by satya  */

  useEffect(() => {
    async function fetchData() {
      if (RowID && PM_no) {
        setButton_save("Update");
        await get_assetmaster_selected();
        await fetchStatusData();
        await getPMFormLebel();
      } else {
        await getPMFormLebel();
        await fetchStatusData();
      //  await fetchStusPriortyData();
        setButton_save("Save");
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // test funcation

  // Get All Filed label Name
  const getPMFormLebel = async () => {
    try {
      const response = await httpCommon.get("/getPMFormLebal.php");
      // console.log("response____getLabel",response);
      if (response.data.status === "SUCCESS") {
        setPmMstLabel(response.data.data.prm_mst);
        setPmdetLabel(response.data.data.prm_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const get_workordermaster_select = async () => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();

    try {
      let responseJson;
      if (
        completeRowID !== undefined &&
        completeRowID !== null &&
        completeRowID !== ""
      ) {
        responseJson = await httpCommon.get(
          "/get_workordermaster_select.php?RowID=" + completeRowID
        );
      } else if (
        closeRowID !== undefined &&
        closeRowID !== null &&
        closeRowID !== ""
      ) {
        responseJson = await httpCommon.get(
          "/get_workordermaster_select.php?RowID=" + closeRowID
        );
      } else {
        responseJson = await httpCommon.get(
          "/get_workordermaster_select.php?RowID=" + RowID
        );
      }
      // console.log("responseJson___today", responseJson);
      if (responseJson.data.status === "SUCCESS") {
        const gt = JSON.stringify(responseJson);

        // *** Set All data to state

        setWorkOrderNo(responseJson.data.data["0"].wko_mst_wo_no);
        setAsset_No(responseJson.data.data["0"].wko_mst_assetno);
        setSelected_Status({
          label: responseJson.data.data[0].wko_mst_status,
        });

        setSelected_Asset_Status({
          label: responseJson.data.data[0].wko_mst_asset_status,
        });
        setSelected_Plan_Priority({
          label: responseJson.data.data[0].wko_mst_plan_priority,
        });
        setSelected_Asset_Group_Code({
          label: responseJson.data.data["0"].wko_mst_asset_group_code,
        });
        setSelected_Charge_Cost_Center({
          label: responseJson.data.data[0].wko_mst_chg_costcenter,
        });
        setSelected_Work_Area({
          label: responseJson.data.data[0].wko_mst_work_area,
        });
        setSelected_Originator({
          label: responseJson.data.data[0].wko_mst_originator,
        });
        setSelected_Asset_Level({
          label: responseJson.data.data[0].wko_mst_asset_level,
        });
        setPhone(responseJson.data.data["0"].wko_mst_phone);

        setSelected_Asset_Location({
          label: responseJson.data.data[0].wko_mst_asset_location,
        });
        setSelected_Fault_Code({
          label: responseJson.data.data[0].wko_mst_flt_code,
        });
      //  setDescription(responseJson.data.data["0"].wko_mst_descs);
        //setDbImg(responseJson.data.data['0'].attachment)

        if (responseJson.data.data["0"].wko_mst_org_date == null) {
          setOriginationDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_mst_org_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setOriginationDate(formattedDate);
        }

        if (responseJson.data.data["0"].wko_mst_due_date == null) {
          setDueDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_mst_due_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setDueDate(formattedDate);
        }

        setCorrectiveAction(responseJson.data.data["0"].wko_det_corr_action);
        setSelected_Project_ID({
          label: responseJson.data.data[0].wko_mst_project_id,
        });

        setSelected_Original_Periority({
          label: responseJson.data.data[0].wko_mst_orig_priority,
        });
        setSelected_Cause_Code({
          label: responseJson.data.data[0].wko_det_cause_code,
        });

        if (responseJson.data.data["0"].wko_det_sched_date == null) {
          setScheduleDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_sched_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setScheduleDate(formattedDate);
        }

        setSelected_Action_Code({
          label: responseJson.data.data[0].wko_det_act_code,
        });

        if (responseJson.data.data["0"].wko_det_exc_date == null) {
          setExceptionDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_exc_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setExceptionDate(formattedDate);
        }
        setSelected_Delay_Code({
          label: responseJson.data.data[0].wko_det_delay_cd,
        });

        if (responseJson.data.data["0"].wko_det_sc_date == null) {
          setStatusChangeDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_sc_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setStatusChangeDate(formattedDate);
        }

        setSelected_Work_Type({
          label: responseJson.data.data[0].wko_det_work_type,
        });

        if (responseJson.data.data["0"].wko_det_cmpl_date == null) {
          setCompletionDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_cmpl_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setCompletionDate(formattedDate);
        }
        setSelected_Work_Class({
          label: responseJson.data.data[0].wko_det_work_class,
        });

        if (responseJson.data.data["0"].wko_det_clo_date == null) {
          setCloseDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_clo_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setCloseDate(formattedDate);
        }

        setSelected_Work_Group({
          label: responseJson.data.data[0].wko_det_work_grp,
        });

        setSelected_Supervisor_ID({
          label: responseJson.data.data[0].wko_det_supv_id,
        });
        setSelected_Planner({
          label: responseJson.data.data[0].wko_det_planner,
        });
        setSelected_Approver({
          label: responseJson.data.data[0].wko_det_approver,
        });
        setSelected_Assign_To({
          label: responseJson.data.data[0].wko_det_assign_to,
        });
        setPermanent_ID(responseJson.data.data["0"].wko_det_perm_id);
        setTemporary_Asset(responseJson.data.data["0"].wko_det_temp_asset);
        setApproved(responseJson.data.data["0"].wko_det_approved);
        setSafety(responseJson.data.data["0"].wko_det_safety);

        setSelected_Customer_Code({
          label: responseJson.data.data[0].wko_det_customer_cd,
        });
        setSelected_Labor_Account({
          label: responseJson.data.data[0].wko_det_laccount,
        });
        setSelected_Material_Account({
          label: responseJson.data.data[0].wko_det_maccount,
        });
        setSelected_Credit_Cost_Center({
          label: responseJson.data.data[0].wko_det_crd_costcenter,
        });
        setSelected_Contract_Account({
          label: responseJson.data.data[0].wko_det_caccount,
        });
        setSelected_Miscellaneous_Account({
          label: responseJson.data.data[0].wko_det_saccount,
        });

        setUDFNote1(responseJson.data.data["0"].wko_det_note1);
        setUDFText_1(responseJson.data.data["0"].wko_det_varchar1);
        setUDFText_2(responseJson.data.data["0"].wko_det_varchar2);
        setUDFText_3(responseJson.data.data["0"].wko_det_varchar3);
        setUDFText_4(responseJson.data.data["0"].wko_det_varchar4);
        setUDFText_5(responseJson.data.data["0"].wko_det_varchar5);
        setUDFText_6(responseJson.data.data["0"].wko_det_varchar6);
        setUDFText_7(responseJson.data.data["0"].wko_det_varchar7);
        setUDFText_8(responseJson.data.data["0"].wko_det_varchar8);
        setUDFText_9(responseJson.data.data["0"].wko_det_varchar9);
        setUDFText_10(responseJson.data.data["0"].wko_det_varchar10);

        setUDFNumber_1(responseJson.data.data["0"].wko_det_numeric1);
        setUDFNumber_2(responseJson.data.data["0"].wko_det_numeric2);
        setUDFNumber_3(responseJson.data.data["0"].wko_det_numeric3);
        setUDFNumber_4(responseJson.data.data["0"].wko_det_numeric4);
        setUDFNumber_5(responseJson.data.data["0"].wko_det_numeric5);

        if (responseJson.data.data["0"].wko_det_datetime1 == null) {
          setUDFDate_1("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_datetime1.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_1(formattedDate);
        }

        if (responseJson.data.data["0"].wko_det_datetime2 == null) {
          setUDFDate_2("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_datetime2.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_2(formattedDate);
        }

        if (responseJson.data.data["0"].wko_det_datetime3 == null) {
          setUDFDate_3("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_datetime3.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_3(formattedDate);
        }
        if (responseJson.data.data["0"].wko_det_datetime4 == null) {
          setUDFDate_4("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_datetime4.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_4(formattedDate);
        }

        if (responseJson.data.data["0"].wko_det_datetime5 == null) {
          setUDFDate_5("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_datetime5.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_5(formattedDate);
        }
        fetchStatusData();

        Swal.close();
        fetchImgData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responseJson.data,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops get_WorkOrder_select...",
        text: error,
      });
    }
  };
  const get_assetmaster_selected = async () => {
    var json = {

        "site_cd": site_ID,
        "ast_mst_asset_no": PM_no,
        "asset_shortdesc": "",
        "cost_center": "",
        "asset_status": "",
        "asset_type": "",
        "asset_grpcode": "",
        "work_area": "",
        "asset_locn": "",
        "asset_code": "",
        "ast_lvl": "",
        "ast_sts_typ_cd": "",
        "createby": "",
        "service_type": "",
        "block": "",
        "floor": "",
        "RowId": RowID
    }
    try {
      const response = await httpCommon.post(
        "/get_assetmaster_select.php",
        JSON.stringify(json)
      );
      console.log("Get_Asset Data", response);
      if (response.data.status === "SUCCESS") {
        setAssetNo(response.data.data["0"].ast_mst_asset_no);
        setSelected_Status({
          label: response.data.data[0].ast_mst_asset_status + " : " + response.data.data["0"].ast_sts_desc
        });
        setShort_Description(response.data.data["0"].ast_mst_asset_shortdesc);
        setselected_CriFactor({ label: response.data.data["0"].ast_mst_cri_factor + " : " + response.data.data["0"].ast_cri_desc });
        setArea_ID(response.data.data["0"].ast_mst_perm_id);
        setLong_Description(response.data.data["0"].ast_mst_asset_longdesc);
        setselectedAssetType({ label: response.data.data["0"].ast_mst_asset_type + " : " + response.data.data["0"].ast_type_descs });
        setselectedAssetCode({ label: response.data.data["0"].ast_mst_asset_code + " : " + response.data.data["0"].ast_cod_desc });
        setselectedAssetGroupCode({ label: response.data.data["0"].ast_mst_asset_grpcode + " : " + response.data.data["0"].ast_grp_desc});
        setSelected_Charge_Cost_Center({ label: response.data.data["0"].ast_mst_cost_center + " : " + response.data.data["0"].descs });
        setSelected_Work_Area({ label: response.data.data["0"].ast_mst_work_area + " : " + response.data.data["0"].mst_war_desc });
        setSelected_Asset_Location({ label: response.data.data["0"].ast_mst_asset_locn + " : " + response.data.data["0"].ast_loc_desc });
        setSelected_Asset_Level({ label: response.data.data["0"].ast_mst_ast_lvl + " : " + response.data.data["0"].ast_lvl_desc });
        setSelected_Work_Group({ label: response.data.data["0"].ast_mst_wrk_grp + " : " + response.data.data["0"].wrk_grp_desc });

        setPermanent_ID(response.data.data["0"].ast_mst_parent_id);
        setPermanentIDFlag(response.data.data["0"].ast_mst_parent_id);
        setSafetyRequirement(response.data.data["0"].ast_mst_safety_rqmts);
        setBarcodeCount(response.data.data["0"].ast_mst_print_count);
        setManufactureCode(response.data.data["0"].ast_det_mfg_cd);
        setAssetCost(response.data.data["0"].ast_det_asset_cost);
        setResidualValue(response.data.data["0"].ast_det_repl_cost);
     
       setSelectedDepreciationMethod({ label: response.data.data["0"].ast_det_depr_method });
       setSelected_Contract_Account({ label: response.data.data["0"].ast_det_c_account });
       setSelected_Labor_Account({ label: response.data.data["0"].ast_det_l_account });
       setSelected_Material_Account({ label: response.data.data["0"].ast_det_m_account });
   
      if (response.data.data["0"].ast_det_purchase_date == null) {
        setPurchaseDate("");
      } else {
        const apiDate = response.data.data["0"].ast_det_purchase_date.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setPurchaseDate(formattedDate);
      }
      if (response.data.data["0"].ast_det_warranty_date == null) {   
        setWarrantyDate("");
      } else {
        const apiDate = response.data.data["0"].ast_det_warranty_date.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setWarrantyDate(formattedDate);
      }
      setExpectedLifeYear(response.data.data["0"].ast_det_depr_term);
      setCustomerCode(response.data.data["0"].ast_det_cus_code);

      setUDFText_1(response.data.data["0"].ast_det_varchar1);
      setUDFText_2(response.data.data["0"].ast_det_varchar2);
      setUDFText_3(response.data.data["0"].ast_det_varchar3);
      setUDFText_4(response.data.data["0"].ast_det_varchar4);
      setUDFText_5(response.data.data["0"].ast_det_varchar5);
      setUDFText_6(response.data.data["0"].ast_det_varchar6);
      setUDFText_7(response.data.data["0"].ast_det_varchar7);
      setUDFText_8(response.data.data["0"].ast_det_varchar8);
      setUDFText_9(response.data.data["0"].ast_det_varchar9);
      setUDFText_10(response.data.data["0"].ast_det_varchar10);

      setUDFText_11(response.data.data["0"].ast_det_varchar11);
      setUDFText_12(response.data.data["0"].ast_det_varchar12);
      setUDFText_13(response.data.data["0"].ast_det_varchar13);
      setUDFText_14(response.data.data["0"].ast_det_varchar14);
      setUDFText_15(response.data.data["0"].ast_det_varchar15);
      setUDFText_16(response.data.data["0"].ast_det_varchar16);
      setUDFText_17(response.data.data["0"].ast_det_varchar17);
      setUDFText_18(response.data.data["0"].ast_det_varchar18);
      setUDFText_19(response.data.data["0"].ast_det_varchar19);
      setUDFText_20(response.data.data["0"].ast_det_varchar20);

      setUDFText_21(response.data.data["0"].ast_det_varchar21);
      setUDFText_22(response.data.data["0"].ast_det_varchar22);
      setUDFText_23(response.data.data["0"].ast_det_varchar23);
      setUDFText_24(response.data.data["0"].ast_det_varchar24);
      setUDFText_25(response.data.data["0"].ast_det_varchar25);
      setUDFText_26(response.data.data["0"].ast_det_varchar26);
      setUDFText_27(response.data.data["0"].ast_det_varchar27);
      setUDFText_28(response.data.data["0"].ast_det_varchar28);
      setUDFText_29(response.data.data["0"].ast_det_varchar29);
      setUDFText_30(response.data.data["0"].ast_det_varchar30);

      setUDFNumber_1(response.data.data["0"].ast_det_numeric1);
      setUDFNumber_2(response.data.data["0"].ast_det_numeric2);
      setUDFNumber_3(response.data.data["0"].ast_det_numeric3);
      setUDFNumber_4(response.data.data["0"].ast_det_numeric4);
      setUDFNumber_5(response.data.data["0"].ast_det_numeric5);
      setUDFNumber_6(response.data.data["0"].ast_det_numeric6);
      setUDFNumber_7(response.data.data["0"].ast_det_numeric7);
      setUDFNumber_8(response.data.data["0"].ast_det_numeric8);
      setUDFNumber_9(response.data.data["0"].ast_det_numeric9);
      setUDFNumber_10(response.data.data["0"].ast_det_numeric10);
      setUDFNumber_11(response.data.data["0"].ast_det_numeric11);
      setUDFNumber_12(response.data.data["0"].ast_det_numeric12);
      setUDFNumber_13(response.data.data["0"].ast_det_numeric13);
      setUDFNumber_14(response.data.data["0"].ast_det_numeric14);
      setUDFNumber_15(response.data.data["0"].ast_det_numeric15);

    
      if (response.data.data["0"].ast_det_datetime1 == null) {   
        setUDFDate_1("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime1.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_1(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime2 == null) {   
        setUDFDate_2("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime2.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_2(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime3 == null) {   
        setUDFDate_3("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime3.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_3(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime4 == null) {   
        setUDFDate_4("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime4.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_4(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime5 == null) {   
        setUDFDate_5("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime5.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_5(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime6 == null) {   
        setUDFDate_6("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime6.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_6(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime7 == null) {   
        setUDFDate_7("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime7.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_7(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime8 == null) {   
        setUDFDate_8("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime8.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_8(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime9 == null) {   
        setUDFDate_9("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime9.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_9(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime10 == null) {   
        setUDFDate_10("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime10.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_10(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime11 == null) {   
        setUDFDate_11("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime11.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_11(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime12 == null) {   
        setUDFDate_12("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime12.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_12(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime13 == null) {   
        setUDFDate_13("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime13.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_13(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime14 == null) {   
        setUDFDate_14("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime14.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_14(formattedDate);
      }
      if (response.data.data["0"].ast_det_datetime15 == null) {   
        setUDFDate_15("");
      } else {
        const apiDate = response.data.data["0"].ast_det_datetime15.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_15(formattedDate);
      }
       
      fetchImgData();
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
        title: "Oops get_Asset select Not Found...",
        text: error,
      });
    }
  }
  
  // Second Api call fetch all dropdowwn data
  const fetchStatusData = async () => {
    try {
      const response = await httpCommon.get(
        "/get_asset_dropdownlist.php?site_cd=" + site_ID
      );
      // console.log("response____status__", response); 
        
      let Status = response.data.data.AssetStatusList.map((item) => ({
        label: item.ast_sts_status + " : " + item.ast_sts_desc,
        value: item.ast_sts_desc,
        key: item.ast_sts_status,
      }));
      setStatus(Status);

      let FrequencyCode = response.data.data.AssetFrequencyCode.map((item) => ({
        label: item.prm_fcd_freq_code + " : " + item.prm_fcd_desc,
        value: item.prm_fcd_desc,
        key: item.prm_fcd_freq_code,
      }));
      setFrequencyCode(FrequencyCode);
     
      let PlanPriority = response.data.data.AssetPlanPriority.map((item) => ({
        label: item.wrk_pri_pri_cd + " : " + item.wrk_pri_desc,
        value: item.wrk_pri_desc,
        key: item.wrk_pri_pri_cd,
      }));
      setPlanPriority(PlanPriority);

      let PmLPMUOM = response.data.data.AssetLPMUOM.map((item) => ({
        label: item.uom_mst_uom + " : " + item.uom_mst_desc,
        value: item.uom_mst_desc,
        key:item.uom_mst_uom,
      }));
      setPmLPMUOM(PmLPMUOM);

      let FaultCode = response.data.data.AssetFaultCode.map((item) => ({
        label: item.wrk_flt_fault_cd + " : " + item.wrk_flt_desc,
        value: item.wrk_flt_desc,
        key:item.wrk_flt_fault_cd,
      }));
      setFaultCode(FaultCode);

      let Asset_Group_Code = response.data.data.AssetGroupCode.map((item) => ({
        label: item.ast_grp_grp_cd + " : " + item.ast_grp_desc,
        value: item.ast_grp_desc,
      }));
      setAsset_Group_Code(Asset_Group_Code);

      let Work_Area = response.data.data.AssetZone.map((item) => ({
        label: item.mst_war_work_area + " : " + item.mst_war_desc,
        value: item.mst_war_desc,
      }));
      setWork_Area(Work_Area);

      let Charge_Cost_Center = response.data.data.Assetcostcenter.map(
        (item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.descs,
        })
      );
      setCharge_Cost_Center(Charge_Cost_Center);

      let Work_Group = response.data.data.Assetwrkgrp.map((item) => ({
        label: item.wrk_grp_grp_cd + " : " + item.wrk_grp_desc,
        value: item.wrk_grp_desc,
      }));
      setWork_Group(Work_Group);

      let Asset_Level = response.data.data.Assetleavel.map((item) => ({
        label: item.ast_lvl_ast_lvl + " : " + item.ast_lvl_desc,
        value: item.ast_lvl_desc,
      }));
      setAsset_Level(Asset_Level);

      let Asset_Location = response.data.data.Assetlocation.map((item) => ({
        label: item.ast_loc_ast_loc + " : " + item.ast_loc_desc,
        value: item.ast_loc_desc,
      }));
      setAsset_Location(Asset_Location);

      let Asset_Type = response.data.data.AssetType.map((item) => ({
        label: item.ast_type_cd + " : " + item.ast_type_descs,
        value: item.ast_type_descs,
      }));
      setAsset_Type(Asset_Type);

      let Asset_Code = response.data.data.AssetCode.map((item) => ({
        label: item.ast_cod_ast_cd + " : " + item.ast_cod_desc,
        value: item.ast_cod_desc,
      }));
      setAsset_Code(Asset_Code);

      let Asset_CriFactor = response.data.data.Assetcriticalfactor.map((item) => ({
        label: item.ast_cri_cri_factor + " : " + item.ast_cri_desc,
        value: item.ast_cri_desc,
      }));
      setAsset_CriFactor(Asset_CriFactor);

      let Asset_laboraccount = response.data.data.Assetlaboraccount.map((item) => ({
        label: item.account + " : " + item.descs,
        value: item.descs,
      }));
      setAsset_Laboraccount(Asset_laboraccount);

      /*   end */

      let Plan_Priority = response.data.data.PlanPeriority.map((item) => ({
        label: item.wrk_pri_pri_cd + " : " + item.wrk_pri_desc,
        value: item.wrk_pri_desc,
      }));
      setPlan_Priority(Plan_Priority);

      let Fault_Code = response.data.data.FaultCode.map((item) => ({
        label: item.wrk_flt_fault_cd + " : " + item.wrk_flt_desc,
        value: item.wrk_flt_desc,
      }));
      setFault_Code(Fault_Code);

      let Asset_Status = response.data.data.AssetStatus.map((item) => ({
        label: item.ast_sts_status + " : " + item.ast_sts_desc,
        value: item.ast_sts_desc,
      }));
      setAsset_Status(Asset_Status);




    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Get Status And Plan Priorty Data
  const fetchStusPriortyData = async () => {
    try {
      const response = await httpCommon.get(
        "/GetWordkOrderStatus_Plan_PriorityData.php"
      );
      if (response.data.status == "SUCCESS") {
        setSelected_Status({
          label: response.data.data.dft_mst_wko_sts,
        });
        setSelected_Plan_Priority({
          label: response.data.data.dft_mst_wko_pri,
        });
        setSelected_Originator({
          label: emp_mst_name,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Thired Api Call
  const fetchImgData = async () => {
    console.log("callto api");
    try {
      const response = await httpCommon.get(
        "/get_asset_edit_img.php?RowID=" + RowID
      );
    //  console.log("response____img____",response);
        if (response.data.data) {
          // Check if AllImgGet exists and has items
         // console.log("response____img____2",response);
          if (response.data.data.AllImgGet && response.data.data.AllImgGet.length > 0) {
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

  //Alert msg swal
  const displayWarning = (Tabvalue) => {
    Swal.fire({
      title: "Warning!",
      text: "You must save Work Order before you go into" + " " + Tabvalue,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    selectedImages.forEach((file) => {
      formData.append("files[]", file);
    });
  };
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = PmMstLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };
  // WorkReq Label Details table
  const findCustomizeLabelDet = (columnName) => {
    const matchingColumn = PmdetLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };

  // staya added today
  
  
  //get Asset Parent Flag data onther component
  const handleEditClick = () => {
    setModalOpenAsset(true);
  };

  const handleCancelClick = () => {
    setPermanentIDFlag("");
  };
  function handleCloseModal() {
    setModalOpenAsset(false);
  }

  const handleCancelClickCustomeCode = () =>{
    setCustomerCode("");
  }
  const handleEditClickCustomerCode = () =>{
    setModalOpenAssetCustomerCode(true);
  }
  function handleCloseModalCustomeCode() {
    setModalOpenAssetCustomerCode(false);
  }

  const get_assetmaster_select = async (selected_asset) => {
    
    let site_ID = localStorage.getItem("site_ID");
    const parts = selected_asset.split(':');
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
      setModalOpenAsset(false);
      setTotalSearch("");
    }
  };
 
  const handleRowData3 = (dataLenth, dataa, dataSecond) => {
    // Use the row data in the second component
    setCustomerCode(dataa);
   
    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
    // if (dataa !== undefined && dataa !== null) {
    //   handleSelectedAssetNo(dataa);
    // }
    if (dataSecond == "1") {
      setModalOpenAssetCustomerCode(false);
      setTotalSearch("");
    }
  };

  const handleRowDataPagechg = (pageCount) => {
    setViewedTotlRows(pageCount);
  };

  const handelRowSearch = (searchTotl) => {
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
                <IconButton key={index}>{icon}</IconButton>
              ))}
            </div>
          ),
        }}
      />
    );
  }
 
  const handleClickProjectID = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderProjectID.php?site_cd=" + site_ID
      );
      let Project_ID = response.data.data.WorkProjectID.map((item) => ({
        label: item.prj_mst_prj_cd + " : " + item.prj_mst_desc,
        value: item.prj_mst_desc,
      }));
      setProject_ID(Project_ID);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickSupervisorId = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderSupervisorId.php?site_cd=" + site_ID
      );
      let Supervisor_ID = response.data.data.WorkSupervisorID.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
        value: item.emp_mst_name,
      }));
      setSupervisor_ID(Supervisor_ID);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickPlanner = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderPlanner.php?site_cd=" + site_ID
      );
      let Planner = response.data.data.WorkPlanner.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
        value: item.emp_mst_name,
      }));
      setPlanner(Planner);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickApprover = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderApprover.php?site_cd=" + site_ID
      );
      let Approver = response.data.data.WorkApprover.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
        value: item.emp_mst_name,
      }));
      setApprover(Approver);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickAssignTo = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderApprover.php?site_cd=" + site_ID
      );
      let Assign_To = response.data.data.WorkApprover.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
        value: item.emp_mst_name,
      }));
      setAssign_To(Assign_To);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickCustomerCode = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderCustomerCode.php?site_cd=" + site_ID
      );
      let CustomerCode = response.data.data.WorkCustomerCode.map((item) => ({
        label: item.cus_mst_customer_cd + " : " + item.cus_mst_desc,
        value: item.cus_mst_desc,
      }));
     // setCustomer_Code(CustomerCode);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickCostCenter = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderCostCenter.php?site_cd=" + site_ID
      );
      let Credit_Cost_Center = response.data.data.WorkCostCenter.map(
        (item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.descs,
        })
      );
      setCredit_Cost_Center(Credit_Cost_Center);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickLaborAccount = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderLaborAccount.php?site_cd=" + site_ID
      );
      let Labor_Account = response.data.data.WorkLaborAccount.map((item) => ({
        label: item.account + " : " + item.descs,
        value: item.descs,
      }));
      setLabor_Account(Labor_Account);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickContractAccount = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderLaborAccount.php?site_cd=" + site_ID
      );
      let Contract_Account = response.data.data.WorkLaborAccount.map(
        (item) => ({
          label: item.account + " : " + item.descs,
          value: item.descs,
        })
      );
      setContract_Account(Contract_Account);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickMaterialAccount = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderLaborAccount.php?site_cd=" + site_ID
      );
      let Material_Account = response.data.data.WorkLaborAccount.map(
        (item) => ({
          label: item.account + " : " + item.descs,
          value: item.descs,
        })
      );
      setMaterial_Account(Material_Account);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickMiscellaneousAccount = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderLaborAccount.php?site_cd=" + site_ID
      );
      let Miscellaneous_Account = response.data.data.WorkLaborAccount.map(
        (item) => ({
          label: item.account + " : " + item.descs,
          value: item.descs,
        })
      );
      setMiscellaneous_Account(Miscellaneous_Account);
    } catch (error) {
      console.error(error);
    }
  };
  const handleOnChangeTemporaryAsset = () => {
    setTemporary_Asset(!Temporary_Asset);

    if (!Temporary_Asset) {
      ////console.log('1')
      setCheckBox_Temporary_Asset("1");
    } else {
      ////console.log('0')
      setCheckBox_Temporary_Asset("0");
    }
  };

  const handleOnChangeApproved = () => {
    setApproved(!Approved);

    if (!Approved) {
      ////console.log('1')
      setCheckBox_Approved("1");
    } else {
      ////console.log('0')
      setCheckBox_Approved("0");
    }
  };

  const handleOnChangeSafety = () => {
    setSafety(!Safety);

    if (!Safety) {
      ////console.log('1')
      setCheckBox_Safety("1");
    } else {
      ////console.log('0')
      setCheckBox_Safety("0");
    }
  };
  const scrollToField = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

/*   add new asset code by stay */
  const New_Asset = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
   // console.log("enter_____save");
    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    //Select Status
    let Status, setStatus;
    if (selected_Status.label == "" || selected_Status.label == null) {
      setStatus = "";
    } else {
      Status = selected_Status.label.split(":");
      setStatus = Status[0];
     // console.log("Status: ", Status[0])
    }
    //CustomerCode Permanent_IDFlag
    let PermanentIDFlag , setPermanentIDFlag;
    if (Permanent_IDFlag === "" || Permanent_IDFlag === null) {
      setPermanentIDFlag = "";
    } else {
      PermanentIDFlag = Permanent_IDFlag.split(":");
      setPermanentIDFlag = PermanentIDFlag[0].trim();
    //  console.log("PermanentIDFlag: ", setPermanentIDFlag)
    }

    //Select Asset_Critical 
    let Asset_Critical, setAsset_Critical;
    if (selected_CriFactor == "" || selected_CriFactor == null) {
      setAsset_Critical = "";
    } else {
      Asset_Critical = selected_CriFactor.label.split(":");
      setAsset_Critical = Asset_Critical[0];
    //  console.log("Asset_Critical ", setAsset_Critical)
    }

    //Select Asset Type 
    let Asset_Type, setAsset_Type;
    if (selected_AssetType == "" || selected_AssetType == null) {
      setAsset_Type = "";
    } else {
      Asset_Type = selected_AssetType.label.split(":");
      setAsset_Type = Asset_Type[0];
     // console.log("Asset_Critical ", setAsset_Type)
    }

    //Select Asset Code 
    let Asset_Code, setAsset_Code;
    if (selected_AssetCode == "" || selected_AssetCode == null) {
      setAsset_Code = "";
    } else {
      Asset_Code = selected_AssetCode.label.split(":");
      setAsset_Code = Asset_Code[0];
    //  console.log("Asset_Code ", setAsset_Code);
    }

    //Select Asset Group Code 
    let Asset_GroupCode, setAsset_GroupCode;
    if (selected_AssetGroupCode == "" || selected_AssetGroupCode == null) {
      setAsset_GroupCode = "";
    } else {
      Asset_GroupCode = selected_AssetGroupCode.label.split(":");
      setAsset_GroupCode = Asset_GroupCode[0];
   //   console.log("Asset_GroupCode ", setAsset_GroupCode);
    }

    //Select Cost Center 
    let Asset_CostCenter, setAsset_CostCenter;
    if (selected_Charge_Cost_Center == "" || selected_Charge_Cost_Center == null) {
      setAsset_CostCenter = "";
    } else {
      Asset_CostCenter = selected_Charge_Cost_Center.label.split(":");
      setAsset_CostCenter = Asset_CostCenter[0];
   //   console.log("Asset_CostCenter ", setAsset_CostCenter);
    }

    //Select Zone 
    let Asset_WorkArea, setAsset_WorkArea;
    if (selected_Work_Area == "" || selected_Work_Area == null) {
      setAsset_WorkArea = "";
    } else {
      Asset_WorkArea = selected_Work_Area.label.split(":");
      setAsset_WorkArea = Asset_WorkArea[0];
   //   console.log("Asset_WorkArea ", setAsset_WorkArea);
    }

  //Select Asset Location 
  let Asset_Location, setAsset_Location;
  if (selected_Asset_Location == "" || selected_Asset_Location == null) {
    setAsset_Location = "";
  } else {
    Asset_Location = selected_Asset_Location.label.split(":");
    setAsset_Location = Asset_Location[0];
  //  console.log("Asset_Location ", setAsset_Location);
  }

 //Select Asset Level
 let Asset_Level, setAsset_Level;
 if (selected_Asset_Level === "" || selected_Asset_Level === null) {
   setAsset_Level = "";
 } else {
   Asset_Level = selected_Asset_Level.label.split(":");
   setAsset_Level = Asset_Level[0];
 //  console.log("Asset_Level ", Asset_Level[0])
 }

 //Select Asset Work Group
 let Asset_WorkGroup, setAsset_WorkGroup;
 if (selected_Work_Group === "" || selected_Work_Group === null) {
  setAsset_WorkGroup = "";
 } else {
  Asset_WorkGroup = selected_Work_Group.label.split(":");
   setAsset_WorkGroup = Asset_WorkGroup[0];
  // console.log("Asset_WorkGroup ", Asset_WorkGroup[0])
 }

//Select Labor Account
let LaborAccountValue;
if (
  selected_Labor_Account.length === 0 ||
  selected_Labor_Account[0] === null
) {
  LaborAccountValue = "";
} else {
  const LaborAccount = selected_Labor_Account.label.split(":");
  LaborAccountValue = LaborAccount[0];
}

//Select Material Account
let MaterialAccountValue;
if (
  
  selected_Material_Account.length === 0 ||
  selected_Material_Account[0] === null
) {
  MaterialAccountValue = "";
} else {
  const MaterialAccount = selected_Material_Account.label.split(":");
  MaterialAccountValue = MaterialAccount[0];
}

//Select Contract Account
let ContractAccountValue;
if (
  
  selected_Contract_Account.length === 0 ||
  selected_Contract_Account[0] === null
) {
  ContractAccountValue = "";
} else {
  const ContractAccount = selected_Contract_Account.label.split(":");
  ContractAccountValue = ContractAccount[0];
}

  //Select Customer Code
  let CustomerCodeValue;
  if (
    selected_Customer_Code.length === 0 ||
    selected_Customer_Code[0] === null
  ) {
    CustomerCodeValue = "";
  } else {
    const CustomerCode = selected_Customer_Code.label.split(":");
    CustomerCodeValue = CustomerCode[0].trim();
  }

  //Select Purchase Date
  let date_of_purchase = "";
  if (PurchaseDate == "" || PurchaseDate == null) {
    date_of_purchase = "";
  } else {
    date_of_purchase = Moment(PurchaseDate)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //  console.log("purchase_date ", date_of_purchase);
  }

  //Select Warranty Date
  let date_of_Warranty = "";
  if (WarrantyDate == "" || WarrantyDate == null) {
    date_of_purchase = "";
  } else {
    date_of_Warranty = Moment(WarrantyDate)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
  //    console.log("Warranty__date ", date_of_Warranty);
  }

  // select UDFDate_1 
  let date_of_1 = "";
  if (UDFDate_1 == "" || UDFDate_1 == null) {
    date_of_1 = "";
  } else {
    date_of_1 = Moment(UDFDate_1)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_1 ", date_of_1);
  }

  // select UDFDate_2 
  let date_of_2 = "";
  if (UDFDate_2 == "" || UDFDate_2 == null) {
    date_of_2 = "";
  } else {
    date_of_2 = Moment(UDFDate_2)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
      //console.log("UDFDate_2 ", date_of_2);
  }

  // select UDFDate_3 
  let date_of_3 = "";
  if (UDFDate_3 == "" || UDFDate_3 == null) {
    date_of_3 = "";
  } else {
    date_of_3 = Moment(UDFDate_3)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_3 ", date_of_3);
  }

  // select UDFDate_4 
  let date_of_4 = "";
  if (UDFDate_4 == "" || UDFDate_4 == null) {
    date_of_4 = "";
  } else {
    date_of_4 = Moment(UDFDate_4)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_4 ", date_of_4);
  }

  // select UDFDate_5 
  let date_of_5 = "";
  if (UDFDate_5 == "" || UDFDate_5 == null) {
    date_of_5 = "";
  } else {
    date_of_5 = Moment(UDFDate_5)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_5 ", date_of_5);
  }

  // select UDFDate_6 
  let date_of_6 = "";
  if (UDFDate_6 == "" || UDFDate_6 == null) {
    date_of_6 = "";
  } else {
    date_of_6 = Moment(UDFDate_6)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_6 ", date_of_6);
  }

  // select UDFDate_7 
  let date_of_7 = "";
  if (UDFDate_7 == "" || UDFDate_7 == null) {
    date_of_7 = "";
  } else {
    date_of_7 = Moment(UDFDate_7)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_7 ", date_of_7);
  }

  // select UDFDate_8 
  let date_of_8 = "";
  if (UDFDate_8 == "" || UDFDate_8 == null) {
    date_of_8 = "";
  } else {
    date_of_8 = Moment(UDFDate_8)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_8 ", date_of_8);
  }

  // select UDFDate_9 
  let date_of_9 = "";
  if (UDFDate_9 == "" || UDFDate_9 == null) {
    date_of_9 = "";
  } else {
    date_of_9 = Moment(UDFDate_9)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_9 ", date_of_9);
  }

  // select UDFDate_10 
  let date_of_10 = "";
  if (UDFDate_10 == "" || UDFDate_10 == null) {
    date_of_10 = "";
  } else {
    date_of_10 = Moment(UDFDate_10)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
  //    console.log("UDFDate_10 ", date_of_10);
  }

  // select UDFDate_11 
  let date_of_11 = "";
  if (UDFDate_11 == "" || UDFDate_11 == null) {
    date_of_11 = "";
  } else {
    date_of_11 = Moment(UDFDate_11)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_11 ", date_of_11);
  }

  // select UDFDate_12 
  let date_of_12 = "";
  if (UDFDate_12 == "" || UDFDate_12 == null) {
    date_of_12 = "";
  } else {
    date_of_12 = Moment(UDFDate_12)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_12 ", date_of_12);
  }

  // select UDFDate_13 
  let date_of_13 = "";
  if (UDFDate_13 == "" || UDFDate_13 == null) {
    date_of_13 = "";
  } else {
    date_of_13 = Moment(UDFDate_13)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_13 ", date_of_13);
  }

  // select UDFDate_14 
  let date_of_14 = "";
  if (UDFDate_14 == "" || UDFDate_14 == null) {
    date_of_14 = "";
  } else {
    date_of_14 = Moment(UDFDate_14)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_14 ", date_of_14);
  }

  // select UDFDate_15 
  let date_of_15 = "";
  if (UDFDate_15 == "" || UDFDate_15 == null) {
    date_of_15 = "";
  } else {
    date_of_15 = Moment(UDFDate_15)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_15 ", date_of_15);
  }


    var json_AssetInsert = {
      site_cd: site_ID,
      ast_mst_asset_no: AssetNo.trim(),
      ast_mst_asset_status: setStatus.trim(),
      ast_mst_asset_shortdesc: Short_Description.trim(),
      ast_mst_cri_factor: setAsset_Critical.trim(),
      ast_mst_asset_longdesc: Long_Description.trim(),
      ast_mst_perm_id: Area_ID.trim(),
      ast_mst_asset_type: setAsset_Type.trim(),
      ast_mst_work_area: setAsset_WorkArea.trim(),
      ast_mst_asset_code: setAsset_Code.trim(),
      ast_mst_asset_locn: setAsset_Location.trim(),
      ast_mst_asset_grpcode: setAsset_GroupCode.trim(),
      ast_mst_ast_lvl: setAsset_Level.trim(),
      ast_mst_cost_center: setAsset_CostCenter.trim(),
      ast_mst_wrk_grp: setAsset_WorkGroup.trim(),
      ast_mst_parent_flag: setPermanentIDFlag.trim(),
      ast_mst_parent_id: Permanent_ID.trim(),
      ast_mst_safety_rqmts: SafetyRequirement.trim(),
      ast_mst_print_count: BarcodeCount.trim(),
      ast_det_mfg_cd: ManufactureCode.trim(),
      ast_det_modelno: "",
      ast_det_purchase_date: date_of_purchase,
      ast_det_repl_cost: "",
      ast_det_warranty_date: date_of_Warranty,
      ast_det_depr_term: ExpectedLifeYear && typeof ExpectedLifeYear === 'string' ? ExpectedLifeYear.trim() : ExpectedLifeYear,
      ast_det_cus_code: CustomerCode.trim(),
      ast_det_depr_method: "",
      ast_det_depr_date: "",
      ast_det_depr_by: "",
      ast_det_acc_depr_cost: "",
      ast_det_net_book_value: "",
      ast_det_dispose_date: "",
      ast_det_dispose_by: "",
      ast_det_dispose_type: "",
      ast_det_dispose_value: "",

      ast_det_varchar1: UDFText_1.trim(),
      ast_det_varchar2: UDFText_2.trim(),
      ast_det_varchar3: UDFText_3.trim(),
      ast_det_varchar4: UDFText_4.trim(),
      ast_det_varchar5: UDFText_5.trim(),
      ast_det_varchar6: UDFText_6.trim(),
      ast_det_varchar7: UDFText_7.trim(),
      ast_det_varchar8: UDFText_8.trim(),
      ast_det_varchar9: UDFText_9.trim(),
      ast_det_varchar10: UDFText_10.trim(),
      ast_det_varchar11: UDFText_11.trim(),
      ast_det_varchar12: UDFText_12.trim(),
      ast_det_varchar13: UDFText_13.trim(),
      ast_det_varchar14: UDFText_14.trim(),
      ast_det_varchar15: UDFText_15.trim(),
      ast_det_varchar16: UDFText_16.trim(),
      ast_det_varchar17: UDFText_17.trim(),
      ast_det_varchar18: UDFText_18.trim(),
      ast_det_varchar19: UDFText_19.trim(),
      ast_det_varchar20: UDFText_20.trim(),
      ast_det_varchar21: UDFText_21.trim(),
      ast_det_varchar22: UDFText_22.trim(),
      ast_det_varchar23: UDFText_23.trim(),
      ast_det_varchar24: UDFText_24.trim(),
      ast_det_varchar25: UDFText_25.trim(),
      ast_det_varchar26: UDFText_26.trim(),
      ast_det_varchar27: UDFText_27.trim(),
      ast_det_varchar28: UDFText_28.trim(),
      ast_det_varchar29: UDFText_29.trim(),
      ast_det_varchar30: UDFText_30.trim(),

      ast_det_numeric1: "0.00",
      ast_det_numeric2: "0.00",
      ast_det_numeric3: "0.00",
      ast_det_numeric4: "0.00",
      ast_det_numeric5: "0.00",
      ast_det_numeric6: "0.00",
      ast_det_numeric7: "0.00",
      ast_det_numeric8: "0.00",
      ast_det_numeric9: "0.00",
      ast_det_numeric10: "0.00",
      ast_det_numeric11: "0.00",
      ast_det_numeric12: "0.00",
      ast_det_numeric13: "0.00",
      ast_det_numeric14: "0.00",
      ast_det_numeric15: "0.00",

      ast_det_datetime1: date_of_1,
      ast_det_datetime2: date_of_2,
      ast_det_datetime3: date_of_3,
      ast_det_datetime4: date_of_4,
      ast_det_datetime5: date_of_5,
      ast_det_datetime6: date_of_6,
      ast_det_datetime7: date_of_7,
      ast_det_datetime8: date_of_8,
      ast_det_datetime9: date_of_9,
      ast_det_datetime10: date_of_10,
      ast_det_datetime11: date_of_11,
      ast_det_datetime12: date_of_12,
      ast_det_datetime13: date_of_13,
      ast_det_datetime14: date_of_14,
      ast_det_datetime15: date_of_15,

      asset_type_ID: AutoNumring.trim(),
      ImgUpload: imageSelect,
      audit_user: emp_mst_login_id.trim(),
      ast_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
    };

   // console.log("json_asset_insert", json_AssetInsert);
    try {
      const response = await httpCommon.post(
        "/insert_new_asset2.php",
        JSON.stringify(json_AssetInsert)
      );
      console.log("json_Asset Data", response);

      if (response.data.status === "SUCCESS") {
        console.log("responseJson", response.data.ROW_ID);
        Swal.close();
        Swal.fire({
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
          title: response.data.status,
          text: response.data.message,
        }).then(() => {
          navigate(`/dashboard/asset/list`);
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
        title: "Oops get_WorkOrder_select...",
        text: error,
      });
    }
  };

  const Update_Asset = async () => {
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
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    //Select Status
    let Status, setStatus;
    if (selected_Status.label == "" || selected_Status.label == null) {
      setStatus = "";
    } else {
      Status = selected_Status.label.split(":");
      setStatus = Status[0];
     // console.log("Status: ", Status[0])
    }
    //CustomerCode Permanent_IDFlag
    let PermanentIDFlag , setPermanentIDFlag;
    if (Permanent_IDFlag === "" || Permanent_IDFlag === null) {
      setPermanentIDFlag = "";
    } else {
      PermanentIDFlag = Permanent_IDFlag.split(":");
      setPermanentIDFlag = PermanentIDFlag[0].trim();
    //  console.log("PermanentIDFlag: ", setPermanentIDFlag)
    }

    //Select Asset_Critical 
    let Asset_Critical, setAsset_Critical;
    if (selected_CriFactor == "" || selected_CriFactor == null) {
      setAsset_Critical = "";
    } else {
      Asset_Critical = selected_CriFactor.label.split(":");
      setAsset_Critical = Asset_Critical[0];
    //  console.log("Asset_Critical ", setAsset_Critical)
    }

    //Select Asset Type 
    let Asset_Type, setAsset_Type;
    if (selected_AssetType == "" || selected_AssetType == null) {
      setAsset_Type = "";
    } else {
      Asset_Type = selected_AssetType.label.split(":");
      setAsset_Type = Asset_Type[0];
     // console.log("Asset_Critical ", setAsset_Type)
    }

    //Select Asset Code 
    let Asset_Code, setAsset_Code;
    if (selected_AssetCode == "" || selected_AssetCode == null) {
      setAsset_Code = "";
    } else {
      Asset_Code = selected_AssetCode.label.split(":");
      setAsset_Code = Asset_Code[0];
    //  console.log("Asset_Code ", setAsset_Code);
    }

    //Select Asset Group Code 
    let Asset_GroupCode, setAsset_GroupCode;
    if (selected_AssetGroupCode == "" || selected_AssetGroupCode == null) {
      setAsset_GroupCode = "";
    } else {
      Asset_GroupCode = selected_AssetGroupCode.label.split(":");
      setAsset_GroupCode = Asset_GroupCode[0];
   //   console.log("Asset_GroupCode ", setAsset_GroupCode);
    }

    //Select Cost Center 
    let Asset_CostCenter, setAsset_CostCenter;
    if (selected_Charge_Cost_Center == "" || selected_Charge_Cost_Center == null) {
      setAsset_CostCenter = "";
    } else {
      Asset_CostCenter = selected_Charge_Cost_Center.label.split(":");
      setAsset_CostCenter = Asset_CostCenter[0];
   //   console.log("Asset_CostCenter ", setAsset_CostCenter);
    }

    //Select Zone 
    let Asset_WorkArea, setAsset_WorkArea;
    if (selected_Work_Area == "" || selected_Work_Area == null) {
      setAsset_WorkArea = "";
    } else {
      Asset_WorkArea = selected_Work_Area.label.split(":");
      setAsset_WorkArea = Asset_WorkArea[0];
   //   console.log("Asset_WorkArea ", setAsset_WorkArea);
    }

  //Select Asset Location 
  let Asset_Location, setAsset_Location;
  if (selected_Asset_Location == "" || selected_Asset_Location == null) {
    setAsset_Location = "";
  } else {
    Asset_Location = selected_Asset_Location.label.split(":");
    setAsset_Location = Asset_Location[0];
  //  console.log("Asset_Location ", setAsset_Location);
  }

 //Select Asset Level
 let Asset_Level, setAsset_Level;
 if (selected_Asset_Level === "" || selected_Asset_Level === null) {
   setAsset_Level = "";
 } else {
   Asset_Level = selected_Asset_Level.label.split(":");
   setAsset_Level = Asset_Level[0];
 //  console.log("Asset_Level ", Asset_Level[0])
 }

 //Select Asset Work Group
 let Asset_WorkGroup, setAsset_WorkGroup;
 if (selected_Work_Group === "" || selected_Work_Group === null) {
  setAsset_WorkGroup = "";
 } else {
  Asset_WorkGroup = selected_Work_Group.label.split(":");
   setAsset_WorkGroup = Asset_WorkGroup[0];
  // console.log("Asset_WorkGroup ", Asset_WorkGroup[0])
 }

//Select Labor Account
//console.log("selected_Labor_Account____",selected_Labor_Account);
let LaborAccountValue;
if (
  selected_Labor_Account.label === "" ||
  selected_Labor_Account.label === null
) {
  LaborAccountValue = "";
} else {
  const LaborAccount = selected_Labor_Account.label.split(":");
  LaborAccountValue = LaborAccount[0];
}

//Select Material Account
let MaterialAccountValue;
if (
  
  selected_Material_Account.label === "" ||
  selected_Material_Account.label === null
) {
  MaterialAccountValue = "";
} else {
  const MaterialAccount = selected_Material_Account.label.split(":");
  MaterialAccountValue = MaterialAccount[0];
}

//Select Contract Account
let ContractAccountValue;
if (
  
  selected_Contract_Account.label === "" ||
  selected_Contract_Account.label === null
) {
  ContractAccountValue = "";
} else {
  const ContractAccount = selected_Contract_Account.label.split(":");
  ContractAccountValue = ContractAccount[0];
}

  //Select Customer Code
  let CustomerCodeValue;
  if (
    selected_Customer_Code.length === 0 ||
    selected_Customer_Code[0] === null
  ) {
    CustomerCodeValue = "";
  } else {
    const CustomerCode = selected_Customer_Code.label.split(":");
    CustomerCodeValue = CustomerCode[0].trim();
  }

  //Select Purchase Date
  let date_of_purchase = "";
  if (PurchaseDate == "" || PurchaseDate == null) {
    date_of_purchase = "";
  } else {
    date_of_purchase = Moment(PurchaseDate)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //  console.log("purchase_date ", date_of_purchase);
  }

  //Select Warranty Date
  let date_of_Warranty = "";
  if (WarrantyDate == "" || WarrantyDate == null) {
    date_of_purchase = "";
  } else {
    date_of_Warranty = Moment(WarrantyDate)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
  //    console.log("Warranty__date ", date_of_Warranty);
  }

  // select UDFDate_1 
  let date_of_1 = "";
  if (UDFDate_1 == "" || UDFDate_1 == null) {
    date_of_1 = "";
  } else {
    date_of_1 = Moment(UDFDate_1)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_1 ", date_of_1);
  }

  // select UDFDate_2 
  let date_of_2 = "";
  if (UDFDate_2 == "" || UDFDate_2 == null) {
    date_of_2 = "";
  } else {
    date_of_2 = Moment(UDFDate_2)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
      //console.log("UDFDate_2 ", date_of_2);
  }

  // select UDFDate_3 
  let date_of_3 = "";
  if (UDFDate_3 == "" || UDFDate_3 == null) {
    date_of_3 = "";
  } else {
    date_of_3 = Moment(UDFDate_3)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_3 ", date_of_3);
  }

  // select UDFDate_4 
  let date_of_4 = "";
  if (UDFDate_4 == "" || UDFDate_4 == null) {
    date_of_4 = "";
  } else {
    date_of_4 = Moment(UDFDate_4)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_4 ", date_of_4);
  }

  // select UDFDate_5 
  let date_of_5 = "";
  if (UDFDate_5 == "" || UDFDate_5 == null) {
    date_of_5 = "";
  } else {
    date_of_5 = Moment(UDFDate_5)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_5 ", date_of_5);
  }

  // select UDFDate_6 
  let date_of_6 = "";
  if (UDFDate_6 == "" || UDFDate_6 == null) {
    date_of_6 = "";
  } else {
    date_of_6 = Moment(UDFDate_6)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_6 ", date_of_6);
  }

  // select UDFDate_7 
  let date_of_7 = "";
  if (UDFDate_7 == "" || UDFDate_7 == null) {
    date_of_7 = "";
  } else {
    date_of_7 = Moment(UDFDate_7)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_7 ", date_of_7);
  }

  // select UDFDate_8 
  let date_of_8 = "";
  if (UDFDate_8 == "" || UDFDate_8 == null) {
    date_of_8 = "";
  } else {
    date_of_8 = Moment(UDFDate_8)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_8 ", date_of_8);
  }

  // select UDFDate_9 
  let date_of_9 = "";
  if (UDFDate_9 == "" || UDFDate_9 == null) {
    date_of_9 = "";
  } else {
    date_of_9 = Moment(UDFDate_9)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_9 ", date_of_9);
  }

  // select UDFDate_10 
  let date_of_10 = "";
  if (UDFDate_10 == "" || UDFDate_10 == null) {
    date_of_10 = "";
  } else {
    date_of_10 = Moment(UDFDate_10)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
  //    console.log("UDFDate_10 ", date_of_10);
  }

  // select UDFDate_11 
  let date_of_11 = "";
  if (UDFDate_11 == "" || UDFDate_11 == null) {
    date_of_11 = "";
  } else {
    date_of_11 = Moment(UDFDate_11)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_11 ", date_of_11);
  }

  // select UDFDate_12 
  let date_of_12 = "";
  if (UDFDate_12 == "" || UDFDate_12 == null) {
    date_of_12 = "";
  } else {
    date_of_12 = Moment(UDFDate_12)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_12 ", date_of_12);
  }

  // select UDFDate_13 
  let date_of_13 = "";
  if (UDFDate_13 == "" || UDFDate_13 == null) {
    date_of_13 = "";
  } else {
    date_of_13 = Moment(UDFDate_13)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_13 ", date_of_13);
  }

  // select UDFDate_14 
  let date_of_14 = "";
  if (UDFDate_14 == "" || UDFDate_14 == null) {
    date_of_14 = "";
  } else {
    date_of_14 = Moment(UDFDate_14)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_14 ", date_of_14);
  }

  // select UDFDate_15 
  let date_of_15 = "";
  if (UDFDate_15 == "" || UDFDate_15 == null) {
    date_of_15 = "";
  } else {
    date_of_15 = Moment(UDFDate_15)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_15 ", date_of_15);
  }
  //Check Img state
  let setDbImgRowIdUpdate;
  if (getDbImgRowId == "" || getDbImgRowId == null) {
    setDbImgRowIdUpdate = "";
  } else {
    setDbImgRowIdUpdate = getDbImgRowId;
  }

    var json_AssetUpdate = {
      site_cd: site_ID,
      ast_mst_asset_no: AssetNo.trim(),
      ast_mst_asset_status: setStatus.trim(),
      ast_mst_asset_shortdesc: Short_Description ? Short_Description.trim() : Short_Description,
      ast_mst_cri_factor: setAsset_Critical.trim(),
      ast_mst_asset_longdesc:Long_Description ? Long_Description.trim() : Long_Description,
      ast_mst_perm_id: Area_ID ? Area_ID.trim() : Area_ID,
      ast_mst_asset_type: setAsset_Type.trim(),
      ast_mst_work_area: setAsset_WorkArea.trim(),
      ast_mst_asset_code: setAsset_Code.trim(),
      ast_mst_asset_locn: setAsset_Location.trim(),
      ast_mst_asset_grpcode: setAsset_GroupCode.trim(),
      ast_mst_ast_lvl: setAsset_Level.trim(),
      ast_mst_cost_center: setAsset_CostCenter.trim(),
      ast_mst_wrk_grp: setAsset_WorkGroup.trim(),
      ast_mst_parent_flag: setPermanentIDFlag.trim(),
      ast_mst_parent_id: Permanent_ID ? Permanent_ID.trim() : Permanent_ID,
      ast_mst_safety_rqmts: SafetyRequirement ? SafetyRequirement.trim() : SafetyRequirement,
      ast_mst_print_count: BarcodeCount ? BarcodeCount.trim() : BarcodeCount,
      ast_det_mfg_cd: ManufactureCode ? ManufactureCode.trim() : ManufactureCode,
      ast_det_modelno: "",
      ast_det_purchase_date: date_of_purchase,
      ast_det_repl_cost: ResidualValue ? ResidualValue.trim() : "0",
      ast_det_warranty_date: date_of_Warranty,
      ast_det_depr_term: ExpectedLifeYear && typeof ExpectedLifeYear === 'string' ? ExpectedLifeYear.trim() : ExpectedLifeYear,
      ast_det_cus_code: CustomerCode ? CustomerCode.trim() : CustomerCode,
      ast_det_depr_method: "",
      ast_det_depr_date: "",
      ast_det_depr_by: "",
      ast_det_acc_depr_cost: "",
      ast_det_net_book_value: "",
      ast_det_dispose_date: "",
      ast_det_dispose_by: "",
      ast_det_dispose_type: "",
      ast_det_dispose_value: "",

      ast_det_varchar1: UDFText_1 ? UDFText_1.trim() : UDFText_1,
      ast_det_varchar2: UDFText_2 ? UDFText_2.trim() : UDFText_2,
      ast_det_varchar3: UDFText_3 ? UDFText_3.trim() : UDFText_3,
      ast_det_varchar4: UDFText_4 ? UDFText_4.trim() : UDFText_4,
      ast_det_varchar5: UDFText_5 ? UDFText_5.trim() : UDFText_5,
      ast_det_varchar6: UDFText_6 ? UDFText_6.trim() : UDFText_6,
      ast_det_varchar7: UDFText_7 ? UDFText_7.trim() : UDFText_7,
      ast_det_varchar8: UDFText_8 ? UDFText_8.trim() : UDFText_8,
      ast_det_varchar9: UDFText_9 ? UDFText_9.trim() : UDFText_9,
      ast_det_varchar10: UDFText_10 ? UDFText_10.trim() : UDFText_10,
      ast_det_varchar11: UDFText_11 ? UDFText_11.trim() : UDFText_11,
      ast_det_varchar12: UDFText_12 ? UDFText_12.trim() : UDFText_12,
      ast_det_varchar13: UDFText_13 ? UDFText_13.trim() : UDFText_13,
      ast_det_varchar14: UDFText_14 ? UDFText_14.trim() : UDFText_14,
      ast_det_varchar15: UDFText_15 ? UDFText_15.trim() : UDFText_15,
      ast_det_varchar16: UDFText_16 ? UDFText_16.trim() : UDFText_16,
      ast_det_varchar17: UDFText_17 ? UDFText_17.trim() : UDFText_17,
      ast_det_varchar18: UDFText_18 ? UDFText_18.trim() : UDFText_18,
      ast_det_varchar19: UDFText_19 ? UDFText_19.trim() : UDFText_19,
      ast_det_varchar20: UDFText_20 ? UDFText_20.trim() : UDFText_20,
      ast_det_varchar21: UDFText_21 ? UDFText_21.trim() : UDFText_21,
      ast_det_varchar22: UDFText_22 ? UDFText_22.trim() : UDFText_22,
      ast_det_varchar23: UDFText_23 ? UDFText_23.trim() : UDFText_23,
      ast_det_varchar24: UDFText_24 ? UDFText_24.trim() : UDFText_24,
      ast_det_varchar25: UDFText_25 ? UDFText_25.trim() : UDFText_25,
      ast_det_varchar26: UDFText_26 ? UDFText_26.trim() : UDFText_26,
      ast_det_varchar27: UDFText_27 ? UDFText_27.trim() : UDFText_27,
      ast_det_varchar28: UDFText_28 ? UDFText_28.trim() : UDFText_28,
      ast_det_varchar29: UDFText_29 ? UDFText_29.trim() : UDFText_29,
      ast_det_varchar30: UDFText_30 ? UDFText_30.trim() : UDFText_30,

      ast_det_numeric1: "0.00",
      ast_det_numeric2: "0.00",
      ast_det_numeric3: "0.00",
      ast_det_numeric4: "0.00",
      ast_det_numeric5: "0.00",
      ast_det_numeric6: "0.00",
      ast_det_numeric7: "0.00",
      ast_det_numeric8: "0.00",
      ast_det_numeric9: "0.00",
      ast_det_numeric10: "0.00",
      ast_det_numeric11: "0.00",
      ast_det_numeric12: "0.00",
      ast_det_numeric13: "0.00",
      ast_det_numeric14: "0.00",
      ast_det_numeric15: "0.00",

      ast_det_datetime1: date_of_1,
      ast_det_datetime2: date_of_2,
      ast_det_datetime3: date_of_3,
      ast_det_datetime4: date_of_4,
      ast_det_datetime5: date_of_5,
      ast_det_datetime6: date_of_6,
      ast_det_datetime7: date_of_7,
      ast_det_datetime8: date_of_8,
      ast_det_datetime9: date_of_9,
      ast_det_datetime10: date_of_10,
      ast_det_datetime11: date_of_11,
      ast_det_datetime12: date_of_12,
      ast_det_datetime13: date_of_13,
      ast_det_datetime14: date_of_14,
      ast_det_datetime15: date_of_15,

      asset_type_ID: AutoNumring.trim(),

      audit_user: emp_mst_login_id.trim(),
      ast_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
      ast_mst_create_date: get_date,

      ImgGetDbImgRowId: setDbImgRowIdUpdate,
      ImgUpload: imageSelect,
      SpecialOdrResult: SpecialOdrResult,

      removedRefItems: removedRefItems,
      RowID: RowID,
    };
  
    try {
      const response = await httpCommon.post(
        "/update_asset.php",
        JSON.stringify(json_AssetUpdate)
      );
     // console.log("response____update",response);

      if (response.data.status === "SUCCESS") {
        if (selectedPdfFiles.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < selectedPdfFiles.length; i++) {
            formData.append("files[]", selectedPdfFiles[i]);
          }
          formData.append("site_cd", site_ID);
          formData.append("RowID", RowID);
          formData.append("audit_user", emp_mst_login_id.trim());
        
          try {
          
            const response = await httpCommon.post(
              "/AssetFormReferenceMultipalImgUpload.php",
              formData,
              {
                headers: {
                    'Content-Type': 'multipart/form-data' // Ensure proper content type
                }
            }
            );
          //  console.log("upload_mltipal____",response);
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
               // navigate(`/dashboard/work/order`);
               navigate(`/dashboard/asset/list`, {
                state: {
                  currentPage,
                  selectedOption,
                },
              });
              });
            }
          } catch (error) {
            console.log("error__", error);
            //Handle error  WorkOrderNo
          }
        } else {
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
             navigate(`/dashboard/asset/list`, {
              state: {
                currentPage,
                selectedOption,
              },
            });
            }
          });
        }
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
  };

  // Save button // update button click funcation
  const onClickChange = (event) => {
    event.preventDefault();
    if (selected_Status == "" || selected_Status == null) {
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom erro",
        },
        html: '<div style="display: block; color: #b71d18c7; font-size: 18px; font-weight: 600; line-height: 26px;">Please fill the required field Status is required </div>',
        showConfirmButton: false,
        timer: 3000,
        backdrop: false,
      });
      setIsAssetStatusEmpty(true);
    //  setIsAssetCriticalFactorEmpty(true);
    }else if(selected_CriFactor == "" || selected_CriFactor == null){
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom erro",
        },
        html: '<div style="display: block; color: #b71d18c7; font-size: 18px; font-weight: 600; line-height: 26px;">Please fill the required field Critical Factor is required </div>',
        showConfirmButton: false,
        timer: 3000,
        backdrop: false,
      });
      setIsAssetCriticalFactorEmpty(true);
    }else if(Short_Description == "" || Short_Description == null){
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom erro",
        },
        html: '<div style="display: block; color: #b71d18c7; font-size: 18px; font-weight: 600; line-height: 26px;">Please fill the required field Short Description is required </div>',
        showConfirmButton: false,
        timer: 3000,
        backdrop: false,
      });
      setIsAssetShortDescEmpty(true);
    }else if(selected_AssetType == "" || selected_AssetType == null){
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom erro",
        },
        html: '<div style="display: block; color: #b71d18c7; font-size: 18px; font-weight: 600; line-height: 26px;">Please fill the required field Asset Type is required </div>',
        showConfirmButton: false,
        timer: 3000,
        backdrop: false,
      });
      setIsAssetTypeEmpty(true);
    }else if(selected_AssetCode == "" || selected_AssetCode == null){
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom erro",
        },
        html: '<div style="display: block; color: #b71d18c7; font-size: 18px; font-weight: 600; line-height: 26px;">Please fill the required field Asset Code is required </div>',
        showConfirmButton: false,
        timer: 3000,
        backdrop: false,
      });
      setIsAssetCodeEmpty(true);
    }else if(selected_AssetGroupCode == "" || selected_AssetGroupCode == null){
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom erro",
        },
        html: '<div style="display: block; color: #b71d18c7; font-size: 18px; font-weight: 600; line-height: 26px;">Please fill the required field Asset Group Code is required </div>',
        showConfirmButton: false,
        timer: 3000,
        backdrop: false,
      });
      setIsAssetGroupCodeEmpty(true);
     
    }else if(selected_Work_Area == "" || selected_Work_Area == null){
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom erro",
        },
        html: '<div style="display: block; color: #b71d18c7; font-size: 18px; font-weight: 600; line-height: 26px;">Please fill the required field Zone is required </div>',
        showConfirmButton: false,
        timer: 3000,
        backdrop: false,
      });
      setIsAssetWorkAreaEmpty(true);
    }else if(selected_Asset_Location == "" || selected_Asset_Location == null){
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom erro",
        },
        html: '<div style="display: block; color: #b71d18c7; font-size: 18px; font-weight: 600; line-height: 26px;">Please fill the required field Asset Location is required </div>',
        showConfirmButton: false,
        timer: 3000,
        backdrop: false,
      });
      setIsAssetLocation(true);
    }else if(selected_Asset_Level == "" || selected_Asset_Level == null){
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom erro",
        },
        html: '<div style="display: block; color: #b71d18c7; font-size: 18px; font-weight: 600; line-height: 26px;">Please fill the required field Leavel is required </div>',
        showConfirmButton: false,
        timer: 3000,
        backdrop: false,
      });
      setIsAssetLeavelEmpty(true);
    }else if(selected_Charge_Cost_Center == "" || selected_Charge_Cost_Center == null){
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom erro",
        },
        html: '<div style="display: block; color: #b71d18c7; font-size: 18px; font-weight: 600; line-height: 26px;">Please fill the required field Cost Center is required </div>',
        showConfirmButton: false,
        timer: 3000,
        backdrop: false,
      });
      setIsAssetCostCenterEmpty(true);
      
    } else {
      if (Button_save === "Save") {
        New_Asset();
    
      } else if (Button_save === "Update") {
        Update_Asset();
      }
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
        console.log("Completed____btn");
       
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
        console.log("close____btn");
       
      }
    }
  };
  const onClickCancel = () => {
   
   navigate(`/dashboard/PreventiveSetup/Maintenance`, {
    state: {
      currentPage,
      selectedOption,
    },
  });
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
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false , customClass: {
      container: "swalcontainercustom",
    }, });
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
        scrollChatToBottom();

      
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
  const Refreshdatapopup = () => {
  
  };
  const scrollChatToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollChatToBottom();
  }, [AllCommnet]);
  
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
    setSelected_Status(value);
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
 

// New Funcation added 16-04-2024
const handleCheckboxChangeFlag = (event) => {
    setIsCheckedFlag(event.target.checked); // Update the isChecked state based on the checked state of the checkbox
  };
  const handleCheckboxChangeLoop = (event) => {
    setIsCheckedLoop(event.target.checked); // Update the isChecked state based on the checked state of the checkbox
  };
  const handleCheckboxChangePmDate = (event) => {
    setIsCheckedPmDate(event.target.checked); // Update the isChecked state based on the checked state of the checkbox
  };

  // onclick funcation 
  const handleClickOriginator = async () => {
    console.log("hhhhh____");
    try {
        console.log("enter if contion____");
        const response = await httpCommon.get(
            "/get_asset_dropdownlist.php?site_cd=" + site_ID + "&type=Originator"
        );

        console.log("response____get3333",response);
  
    //   let Originator = response.data.data.WorkOriginator.map((item) => ({
    //     label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
    //     value: item.emp_mst_empl_id,
    //   }));
    //   setOriginator(Originator);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {RowID
            ? "Update Asset"
            : completeRowID
            ? "Complete Work Order"
            : closeRowID
            ? "Close Asset"
            : "Create New PM"}
        </title>
        <meta name="description" content="Create New PM" />
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
                ? `Update ${WorkOrderNo} PM`
                : completeRowID
                ? `Complete ${WorkOrderNo} Order`
                : closeRowID
                ? `Close ${WorkOrderNo} Asset`
                : "Create New PM"
            }
            links={[
              {
                name: "PM",
              },
              { name: RowID ? "Update" : "Create" },
            ]}
            action={
              <div style={{ display: "flex", alignItems: "center" }}>
                {(() => {
                  if (
                    completeRowID !== undefined &&
                    completeRowID !== null &&
                    completeRowID !== ""
                  ) {
                    return (
                      <div>
                        <Button
                          component={RouterLink}
                          onClick={onClickChangeComplete}
                          variant="contained"
                          startIcon={<Iconify icon="mingcute:save-fill" />}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "10px",
                          }}
                        >
                          {Button_save}
                        </Button>
                        <Button
                          variant="soft"
                          color="error"
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
                          PM Master
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
                                              src={require("../../../assets/img/Add_Image_icon.png")}
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
                              marginBottom={1.5}
                            >
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_mst_pm_no") ||
                                    "PM ID"}
                                </Typography>
                                <TextField
                                  name="name"
                                  size="small"
                                  disabled
                                  defaultValue={AssetNo}
                                  className="ExtrasizeDisable"
                                />
                              </Stack>
                             
                              </Box>
                              
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                
                              >
                                <Stack spacing={1}>
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel("prm_mst_curr_wo") ||
                                      "Current Work Order"}
                                  </Typography>
                                  
                                  <TextField
                                  name="name"
                                  size="small"
                                  disabled
                                  defaultValue=""
                                  className="ExtrasizeDisable"
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
                              marginBottom={1.5}
                            >
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_mst_type") ||
                                    "PM Type"}
                                </Typography>
                                     
                                <Autocomplete
                                    options={Pm_type}
                                    value={(selected_PmType?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      onChange={(event, value) => {
                                        setselected_PmType(value);
                                        
                                      }}
                                    disableAnimation
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          placeholder="Select..."
                                          variant="outlined"
                                          size="small"
                                          className="Extrasize"
                                          style={{ width: "100%" }}
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
                                display="grid"
                                
                              >
                                <Stack spacing={1}>
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel("prm_mst_assetlocn") ||
                                      "Asset Location"}
                                  </Typography>
                                  
                                  <TextField
                                  name="name"
                                  size="small"
                                  disabled
                                  defaultValue={AssetNo}
                                  className="ExtrasizeDisable"
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
                              marginBottom={1.5}
                            >
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                            {findCustomizeLabel("prm_mst_assetno") ||
                             "Asset No"}
                              <Iconify
                                icon="mdi:required"
                                style={{
                                  color: "red",
                                  marginLeft: "1px",
                                  height: "12px",
                                  width: "8px",
                                }}
                              />
                            </Typography>
                            <div ref={assetNoAutocompleteRef}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                className={`ExtrasizeDisable ${
                                  isAssetNoEmpty ? "errorEmpty" : ""
                                }`}
                                
                                fullWidth
                                value={Permanent_IDFlag || ""}
                                disabled
                                placeholder="Select..."
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
                            </div>
                          </Stack>
                             
                                
                              </Box>
                              
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                
                              >
                                <Stack spacing={1}>
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel("prm_mst_lpm_usg") ||
                                      "LPM Usage"}
                                  </Typography>
                                  
                                  <TextField
                                  name="name"
                                  size="small"
                                  disabled
                                  defaultValue=".00"
                                  className="ExtrasizeDisable"
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
                              marginBottom={1.5}
                            >
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_mst_dflt_status") ||
                                    "Default WO Status"}
                                </Typography>
                                <Autocomplete
                                    options={Status}
                                    value={(selected_Status?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      onChange={(event, value) => {
                                        setSelected_Status(value);
                                        setIsAssetStatusEmpty(false);
                                        
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
                                            isAssetStatusEmpty
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
                              
                              <Box
                                display="flex"
                                flexDirection="row"
                                justifyContent="space-between"
                                alignItems="center"
                                rowGap={2}
                                columnGap={1}
                                >
                                <Stack width="30%" direction="column">
                                <Stack spacing={1}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box>
                                    <Typography variant="subtitle2">
                                    {findCustomizeLabel("prm_mst_disable_flag") || "Disable Flag"}
                                    </Typography>
                                    <Checkbox
                                    checked={isCheckedFlag}
                                    onChange={handleCheckboxChangeFlag}
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                    </Box>
                                    </Stack>
                                    </Stack>
                                </Stack>
                                <Stack width="30%" direction="column">
                                <Stack spacing={1}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box>
                                    <Typography variant="subtitle2">
                                    {findCustomizeLabel("prm_mst_closed_loop") ||
                                      "Closed Loop?"}
                                  </Typography>
                                    <Checkbox
                                    checked={isCheckedLoop}
                                    onChange={handleCheckboxChangeLoop}
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                    </Box>
                                    </Stack>
                                    </Stack>
                                </Stack>
                                <Stack width="30%" direction="column">
                                <Stack spacing={1}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box>
                                    <Typography variant="subtitle2">
                                    {findCustomizeLabel("prm_mst_cal_startdate") ||
                                      "PM Schedule Date"}
                                  </Typography>
                                    <Checkbox
                                    checked={isCheckedPmDate}
                                    onChange={handleCheckboxChangePmDate}
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                    </Box>
                                </Stack>
                                </Stack>
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
                              marginBottom={1.5}
                            >
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              > 
                                <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_mst_freq_code") ||
                                    "Frequency Code"}
                                </Typography>
                                <Autocomplete
                                    options={FrequencyCode}
                                    value={(selected_FrequencyCode?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      onChange={(event, value) => {
                                        setSelected_FrequencyCode(value);
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
                              
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                
                              >
                                <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_mst_plan_priority") ||
                                    "Plan Priority"}
                                </Typography>
                                <Autocomplete
                                    options={PlanPriority}
                                    value={(selected_PlanPriority?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      onChange={(event, value) => {
                                        setSelected_PlanPriority(value);
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
                            </Box>
                          
                            <Box
                              rowGap={2}
                              columnGap={2}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "repeat(1, 1fr)",
                                sm: "repeat(2, 1fr)",
                              }}
                              marginBottom={1.5}
                            >
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_mst_lead_day") ||
                                    "Lead Day"}
                                </Typography>
                                <TextField
                                  name="name"
                                  size="small"
                                  type="number" 
                                  defaultValue={LeadDay}
                                  onChange={(e) => {
                                    setLeadDay(e.target.value);
                                   
                                  }}
                                 
                                />
                              </Stack>
                             
                                
                              </Box>
                              
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                                
                              >
                                
                                <Stack spacing={1}>
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel("prm_mst_shadow_grp") ||
                                      "Shadow Group"}
                                  </Typography>
                                  
                                  <TextField
                                  name="name"
                                  size="small"
                                  defaultValue={ShadowGroup}
                                  onChange={(e) => {
                                    setShadowGroup(e.target.value);
                                   
                                  }}
                                  
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
                              marginBottom={1.5}
                            >
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_mst_meter_id") ||
                                    "Meter ID"}
                                </Typography>
                                <Autocomplete
                                    options={Asset_CriFactor}
                                    value={(selected_CriFactor?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      onChange={(event, value) => {
                                        setselected_CriFactor(value);
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
                              
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >

                                    <Stack spacing={1}>
                                   <Typography variant="subtitle2">
                                    {findCustomizeLabel("prm_mst_lpm_date") ||
                                      "LPM Date"}
                                  </Typography>
                                  
                                  <DateTimePicker
                                    value={LPMDate}
                                    format="dd/MM/yyyy HH:mm"
                                    className="Extrasize"
                                    onChange={(newDate) => {
                                        setLPMDate(newDate); // Update your state with the new value
                                    }}
                                    slotProps={{
                                        textField: {
                                        fullWidth: true,
                                        },
                                    }}
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
                              marginBottom={1.5}
                            >
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_mst_lpm_uom") ||
                                    "LPM UOM"}
                                </Typography>
                                
                                <Autocomplete
                                    options={PmLPMUOM}
                                    value={(selected_PmLPMUOM?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      onChange={(event, value) => {
                                        setselected_PmLPMUOM(value);
                                        
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
                              
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                   <Typography variant="subtitle2">
                                    {findCustomizeLabel("prm_mst_lpm_closed_date") ||
                                      "LPM Closed Date"}
                                  </Typography>
                                 
                                  <DateTimePicker
                                    value={LPMClosedDate}
                                    format="dd/MM/yyyy HH:mm"
                                    className="Extrasize"
                                    onChange={(newDate) => {
                                        setLPMClosedDate(newDate); // Update your state with the new value
                                    }}
                                    slotProps={{
                                        textField: {
                                        fullWidth: true,
                                        },
                                    }}
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
                              marginBottom={1.5}
                            >
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >
                                <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_mst_flt_code") ||
                                    "Fault Code"}
                                </Typography>
                                <Autocomplete
                                    options={FaultCode}
                                    value={(selected_FaultCode?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      onChange={(event, value) => {
                                        setselected_FaultCode(value);
                                        
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
                              
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                marginBottom={1}
                              >

                                    <Stack spacing={1}>
                                   <Typography variant="subtitle2">
                                    {findCustomizeLabel("prm_mst_next_due") ||
                                      "Next Due"}
                                  </Typography>
                             
                                  <DateTimePicker
                                    value={NextDueSate}
                                    format="dd/MM/yyyy HH:mm"
                                    className="Extrasize"
                                    onChange={(newDate) => {
                                        setNextDueDate(newDate); // Update your state with the new value
                                    }}
                                    slotProps={{
                                        textField: {
                                        fullWidth: true,
                                        },
                                    }}
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
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_mst_desc") ||
                                    "Description"}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  placeholder="Descriptions..."
                                  minRows={6.5}
                                  value={Short_Description}
                                  onChange={(e) => {
                                    setShort_Description(e.target.value);
                                    setIsAssetShortDescEmpty(false);
                                  }}
                                //  className="TxtAra"
                                  className={`Extrasize ${
                                    isAssetShortDescEmpty
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
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel("prm_mst_next_create") ||
                                      "Next Create Date"}
                                  </Typography>
                                  
                                  <DateTimePicker
                                    value={NextCreateDate}
                                    format="dd/MM/yyyy HH:mm"
                                    className="Extrasize"
                                    onChange={(newDate) => {
                                        setNextCreateDate(newDate); // Update your state with the new value
                                    }}
                                    slotProps={{
                                        textField: {
                                        fullWidth: true,
                                        },
                                    }}
                                    />
                               
                                </Stack>
                              </Box>
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
                                                  src={require("../../../assets/img/Add_Image_icon.png")}
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
                              icon="akar-icons:info-fill"
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
                              icon="material-symbols:date-range-outline"
                              style={{ marginRight: "4px" }}
                            />
                            UDF1
                          </div>
                        }
                      />
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="mdi:planner-outline"
                              style={{ marginRight: "4px" }}
                            />
                            Planning
                          </div>
                        }
                      />
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="guidance:time"
                              style={{ marginRight: "4px" }}
                            />
                            Time Card
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
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_originator") ||
                                "Originator"}
                            </Typography>
                        
                            <Autocomplete
                              options={PmOriginator}
                              getOptionLabel={(option) => option.label}
                              value={selected_PmOriginator?.label ?? ""}
                              onChange={(event, newValue) => {
                                // This will be triggered when an option is selected
                                handleClickOriginator();
                              }}
                             
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  onClick={handleClickOriginator}
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isAssetTypeEmpty
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_approver") ||
                                "Approver"}
                            </Typography>
                            <Autocomplete
                              options={Asset_Code}
                              value={selected_AssetCode?.label ?? ""}
                              onChange={(event, value) => {
                                setselectedAssetCode(value);
                                setIsAssetCodeEmpty(false);
                                
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isAssetCodeEmpty
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_planner") ||
                                "Planner"}
                            </Typography>
                            <Autocomplete
                              options={Asset_Group_Code }
                              value={selected_AssetGroupCode?.label ?? ""}
                              onChange={(event, value) => {
                                setselectedAssetGroupCode(value);
                                setIsAssetGroupCodeEmpty(false);
                                
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  className={`Extrasize ${
                                    isAssetGroupCodeEmpty
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_chg_costcenter") ||
                                "Charge Cost Center"}
                            </Typography>
                            <Autocomplete 
                              options={Charge_Cost_Center}
                              value={selected_Charge_Cost_Center?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Charge_Cost_Center(value || null);
                                setIsAssetCostCenterEmpty(false);
                              
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  className={`Extrasize ${
                                    isAssetCostCenterEmpty
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_crd_costcenter") ||
                                "Credit Cost Center"}
                            </Typography>
                            <Autocomplete 
                              options={Charge_Cost_Center}
                              value={selected_Charge_Cost_Center?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Charge_Cost_Center(value || null);
                                setIsAssetCostCenterEmpty(false);
                              
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  className={`Extrasize ${
                                    isAssetCostCenterEmpty
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_l_account") ||
                                "Labor Account"}
                            </Typography>
                            <Autocomplete 
                              options={Charge_Cost_Center}
                              value={selected_Charge_Cost_Center?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Charge_Cost_Center(value || null);
                                setIsAssetCostCenterEmpty(false);
                              
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  className={`Extrasize ${
                                    isAssetCostCenterEmpty
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_m_account") ||
                                "Material Account"}
                              <Iconify
                                icon="mdi:required"
                                style={{
                                  color: "red",
                                  marginLeft: "1px",
                                  height: "12px",
                                  width: "8px",
                                }}
                              />
                            </Typography>
                            <div ref={assetNoAutocompleteRef}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                className={`ExtrasizeDisable ${
                                  isAssetNoEmpty ? "errorEmpty" : ""
                                }`}
                                
                                fullWidth
                                value={Permanent_IDFlag || ""}
                                disabled
                                placeholder="Select..."
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
                            </div>
                          </Stack>
                         
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_c_account") ||
                                "Contract Account"}
                              <Iconify
                                icon="mdi:required"
                                style={{
                                  color: "red",
                                  marginLeft: "1px",
                                  height: "12px",
                                  width: "8px",
                                }}
                              />
                            </Typography>
                            <Autocomplete
                              options={Work_Area}
                              value={selected_Work_Area?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Work_Area(value || null);
                                setIsAssetWorkAreaEmpty(false);
                               
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isAssetWorkAreaEmpty ? "errorEmpty" : ""
                                  }`}
                                  ref={autocompleteRef}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_project_id") ||
                                "Project ID"}
                            </Typography>

                            <Autocomplete
                              options={Asset_Location }
                              value={selected_Asset_Location?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Asset_Location(value || null);
                                setIsAssetLocation(false);
                                
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isAssetLocation ? "errorEmpty" : ""
                                  }`}
                                  ref={autocompleteRef}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_customer_cd") ||
                                "Clinic Code"}
                            </Typography>

                            <Autocomplete
                              options={Asset_Level}
                              value={selected_Asset_Level?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Asset_Level(value || null);
                                setIsAssetLeavelEmpty(false);
                               
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isAssetLeavelEmpty ? "errorEmpty" : ""
                                  }`}
                                  ref={autocompleteRef}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_safety") ||
                                "Safety"}
                            </Typography>

                            <Autocomplete
                              options={Work_Group}
                              value={selected_Work_Group?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Work_Group(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isOriginalPeriorityEmpty ? "errorEmpty" : ""
                                  }`}
                                  ref={autocompleteRef}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_varchar20") ||
                                "Varchar20"}
                            </Typography>

                            <Autocomplete
                              options={Work_Group}
                              value={selected_Work_Group?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Work_Group(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isOriginalPeriorityEmpty ? "errorEmpty" : ""
                                  }`}
                                  ref={autocompleteRef}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_cause_code") ||
                                "Cause Code"}
                            </Typography>

                            <Autocomplete
                              options={Work_Group}
                              value={selected_Work_Group?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Work_Group(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isOriginalPeriorityEmpty ? "errorEmpty" : ""
                                  }`}
                                  ref={autocompleteRef}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_act_code") ||
                                "Action Code"}
                            </Typography>

                            <Autocomplete
                              options={Work_Group}
                              value={selected_Work_Group?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Work_Group(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={`Extrasize ${
                                    isOriginalPeriorityEmpty ? "errorEmpty" : ""
                                  }`}
                                  ref={autocompleteRef}
                                />
                              )}
                            />
                          </Stack>
                          
                          
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_work_area") ||
                                "Work Area"}
                                  
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              value={SafetyRequirement}
                              onChange={(e) => {
                                setSafetyRequirement(e.target.value);
                              }}
                              variant="outlined"
                              fullWidth
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("prm_det_asset_level") ||
                                "Asset Level"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              value={BarcodeCount}
                              onChange={(e) => {
                                setBarcodeCount(e.target.value);
                              }}
                              fullWidth
                              placeholder="0"
                              disabled
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_work_locn") ||
                                "Work Location"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              value={ManufactureCode}
                              onChange={(e) => {
                                setManufactureCode(e.target.value);
                              }}
                              fullWidth
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_work_grp") ||
                                "Work Group"}
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
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_work_type") ||
                                "Work Type"}
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
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_work_class") ||
                                "Work Class"}
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
                
                    </Box>
                   
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 1}
                      sx={{ marginTop: "16px" }}
                    >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_det_note1") ||
                                    "Note1"}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  placeholder="Descriptions..."
                                  minRows={6.5}
                                  value={Short_Description}
                                  onChange={(e) => {
                                    setShort_Description(e.target.value);
                                    setIsAssetShortDescEmpty(false);
                                  }}
                                //  className="TxtAra"
                                  className={`Extrasize ${
                                    isAssetShortDescEmpty
                                      ? "errorEmpty"
                                      : "TxtAra"
                                  }`}
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                             <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("prm_det_note2") ||
                                    "Note2"}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  placeholder="Descriptions..."
                                  minRows={6.5}
                                  value={Short_Description}
                                  onChange={(e) => {
                                    setShort_Description(e.target.value);
                                    setIsAssetShortDescEmpty(false);
                                  }}
                                //  className="TxtAra"
                                  className={`Extrasize ${
                                    isAssetShortDescEmpty
                                      ? "errorEmpty"
                                      : "TxtAra"
                                  }`}
                                />
                              </Stack>
                            </Grid>
                        </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar1") ||
                                "Varchar1"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_1}
                              onChange={(e) => {
                                setUDFText_1(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar2") ||
                                "Varchar2"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_2}
                              onChange={(e) => {
                                setUDFText_2(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar3") ||
                                "Varchar3"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_3}
                              onChange={(e) => {
                                setUDFText_3(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar4") ||
                                "Varchar4"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_4}
                              onChange={(e) => {
                                setUDFText_4(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar5") ||
                                "Varchar5"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_5}
                              onChange={(e) => {
                                setUDFText_5(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar6") ||
                                "Varchar6"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_6}
                              onChange={(e) => {
                                setUDFText_6(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar7") ||
                                "Varchar7"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_7}
                              onChange={(e) => {
                                setUDFText_7(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar8") ||
                                "Varchar8"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              variant="outlined"
                              fullWidth
                              defaultValue={UDFText_8}
                              onChange={(e) => {
                                setUDFText_8(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar9") ||
                                "Varchar9"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_9}
                              onChange={(e) => {
                                setUDFText_9(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar10") ||
                                "Varchar10"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_10}
                              onChange={(e) => {
                                setUDFText_10(e.target.value);
                              }}
                            />
                          </Stack>
                         
                        </Grid>
                        <Grid item xs={12} md={3}>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar11") ||
                                "Varchar11"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_11}
                              onChange={(e) => {
                                setUDFText_11(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar12") ||
                                "Varchar12"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_12}
                              onChange={(e) => {
                                setUDFText_12(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar13") ||
                                "Varchar13"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_13}
                              onChange={(e) => {
                                setUDFText_13(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar14") ||
                                "Varchar14"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_14}
                              onChange={(e) => {
                                setUDFText_14(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar15") ||
                                "Varchar15"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_15}
                              onChange={(e) => {
                                setUDFText_15(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar16") ||
                                "Varchar16"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_16}
                              onChange={(e) => {
                                setUDFText_16(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar17") ||
                                "Varchar17"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_17}
                              onChange={(e) => {
                                setUDFText_17(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar18") ||
                                "Varchar18"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_18}
                              onChange={(e) => {
                                setUDFText_18(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar19") ||
                                "Varchar19"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_19}
                              onChange={(e) => {
                                setUDFText_19(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_varchar20") ||
                                "Varchar20"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_20}
                              onChange={(e) => {
                                setUDFText_20(e.target.value);
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                        
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_numeric1") ||
                                "Numeric1"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              defaultValue={UDFNumber_1}
                              onChange={(e) => {
                                setUDFNumber_1(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_numeric2") ||
                                "Numeric2"}
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
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_numeric3") ||
                                "Numeric3"}
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
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_numeric4") ||
                                "Numeric4"}
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
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_numeric5") ||
                                "Numeric5"}
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
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_numeric6") ||
                                "Numeric6"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              defaultValue={UDFNumber_6}
                              onChange={(e) => {
                                setUDFNumber_6(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_numeric7") ||
                                "Numeric7"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              defaultValue={UDFNumber_7}
                              onChange={(e) => {
                                setUDFNumber_7(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_numeric8") ||
                                "Numeric8"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              defaultValue={UDFNumber_8}
                              onChange={(e) => {
                                setUDFNumber_8(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_numeric9") ||
                                "Numeric9"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              defaultValue={UDFNumber_9}
                              onChange={(e) => {
                                setUDFNumber_9(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_numeric10") ||
                                "Numeric10"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              defaultValue={UDFNumber_10}
                              onChange={(e) => {
                                setUDFNumber_10(e.target.value);
                              }}
                            />
                          </Stack>
                        
                        </Grid>
                        <Grid item xs={12} md={3}>
                        
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_datetime1") ||
                                "Date1"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_1} 
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_1(newDate); // Update your state with the new value
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_datetime2") ||
                                "Date2"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_2}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_2(newDate); // Update your state with the new value
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_datetime3") ||
                                "Date3"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_3}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_3(newDate); // Update your state with the new value
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_datetime4") ||
                                "Date4"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_4}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_4(newDate); // Update your state with the new value
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_datetime5") ||
                                "Date5"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_5}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_5(newDate); // Update your state with the new value
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_datetime6") ||
                                "Date6"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_6}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_6(newDate); // Update your state with the new value
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_datetime7") ||
                                "Date7"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_7}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_7(newDate); // Update your state with the new value
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_datetime8") ||
                                "Date8"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_8}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_8(newDate); // Update your state with the new value
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_datetime1") ||
                                "Date9"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_9}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_9(newDate); // Update your state with the new value
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("prm_det_datetime10") ||
                                "Date10"}
                            </Typography>
                            <DateTimePicker
                              value={UDFDate_10}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_10(newDate); // Update your state with the new value
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

                      
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 2}
                      sx={{ marginTop: "16px" }}
                    >
                      {/* {RowID && (
                        <WorkOrderSpecialOrder
                          data={{
                            RowID: RowID,
                            WorkOrderNo: WorkOrderNo,
                            Asset_No: Asset_No,
                          }}
                        />
                      )} */}
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 3}
                      sx={{ marginTop: "16px" }}
                    >
                      {/* {RowID && (
                        <WorkOrderTimeCard
                          data={{
                            RowID: RowID,
                            WorkOrderNo: WorkOrderNo,
                            Asset_No: Asset_No,
                          }}
                          onDataFromSecondComponent={
                            handleDataFromSecondComponent
                          }
                        />
                      )} */}
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 4}
                      sx={{ marginTop: "16px" }}
                    >
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
                            <div style={{ marginRight: "10px" }}>
                              <img
                                src={refrencImg}
                                style={{ width: "60px", height: "60px" }}
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
                                    <button
                                      onClick={handleButtonClick}
                                      type="submit"
                                      className="btn Refbtl"
                                    >
                                      + Add Attachment
                                    </button>
                                  </div>
                                </form>
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
                                  <tr key={index}>
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
                                        <Iconify
                                          icon="fluent:delete-48-filled"
                                          style={{ fontSize: "24px" }}
                                        />
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
                                    <td>{new Date().toLocaleString() + ""}</td>
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
                                        onClick={(e) => handleShowdd(e, image)}
                                      />
                                    </td>
                                    <td>{image.name}</td>
                                    <td>Admin</td>
                                    <td>{new Date().toLocaleString() + ""}</td>

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
                                      style={{ width: "100%", height: "auto" }}
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
                                      style={{ height: "100%", width: "100%" }}
                                      src={URL.createObjectURL(handalImg)}
                                      alt="Uploaded image"
                                    />
                                  </Typography>
                                </DialogContent>
                              </BootstrapDialog>
                            )}
                          </table>
                        </div>
                      </div>
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 5}
                      sx={{ marginTop: "16px" }}
                    ></Box>
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
                          {Button_save}
                        </Button>
                        <Button
                          variant="soft"
                          color="error"
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
                open={modalOpenAsset}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Asset No
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
                    <GetAssetList
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

               {/* Asset Customer Code model popup */}
               <BootstrapDialog
                onClose={handleCloseModalCustomeCode}
                aria-labelledby="customized-dialog-title"
                open={modalOpenAssetCustomerCode}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Customer Code
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModalCustomeCode}
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
                    {/* <AssetCustomerCodeList
                      onRowClick={handleRowData3}
                      onChangePage={handleRowDataPagechg}
                      onSearchChange={handelRowSearch}
                    /> */}
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
                    <Button variant="primary" onClick={handleCloseModalCustomeCode}>
                      Select
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
               {/* Asset customer code model popup end*/}

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
                 
                    {/* <PmSetup 
                    data={{
                        RowID: RowID,
                        WorkOrderNo: WorkOrderNo,
                        Asset_No: AssetNo,
                      }}
                    /> */}
                  
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
                 
                    {/* <WoHistory 
                    data={{
                        RowID: RowID,
                        WorkOrderNo: WorkOrderNo,
                        Asset_No: AssetNo,
                      }}
                    /> */}
                  
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
                    {/* <RelocationHistory 
                    data={{
                        RowID: RowID,
                        WorkOrderNo: WorkOrderNo,
                        Asset_No: Asset_No,
                      }}
                    /> */}
                  
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
                    {/* <CheckList 
                    data={{
                        RowID: RowID,
                        WorkOrderNo: WorkOrderNo,
                        Asset_No: AssetNo,
                      }}
                    /> */}
                  
                </DialogContent>
              </BootstrapDialog>
            </>
          )}
        </div>
      </Container>
    </>
  );
}

CreateNewPmform.propTypes = {
  currentUser: PropTypes.object,
};

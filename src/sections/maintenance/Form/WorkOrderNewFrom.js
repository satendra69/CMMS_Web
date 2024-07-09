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

// Toastfy
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

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
import WorkOrderAssetNo from "../WorkOrderAssetNo";
import Tooltip from "@mui/material/Tooltip";
import WorkOrderTimeCard from "../component_module/WordOrderTimeCard";
import loderImg from "../../../assets/img/loder.gif";
import WorkOrderSpecialOrder from "../component_module/Planning/WorkOrderSpecialOrder";

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

export default function WordOrderNewForm({ currentUser, onPageChange }) {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_name = localStorage.getItem("emp_mst_name");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [progress, setProgress] = useState(0);

  // const currentPage = searchParams.get('currentPage') || 1;
  // const selecOption = searchParams.get('optvl') || "";

  const state = location.state || {};
  const { RowID} = state || {};
  const { currentPage, selectedOption } = state;

  const { completeRowID } = location.state || {};
  const { closeRowID } = location.state || {};

  const [loading, setLoading] = useState(true);

  const [wkoMstLabel, setWkoMstLabel] = useState([]);
  const [wkodetLabel, setWkoDetLabel] = useState([]);

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
  const [imguploadStatus, setImguploadStatus] = useState("");
  const [imguploadRefStatus, setImguploadRefStatus] = useState("");
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
  const [Status, setStatus] = useState([]);
  const [Plan_Priority, setPlan_Priority] = useState([]);
  const [selected_Project_ID, setSelected_Project_ID] = useState([]);
  const [selected_Plan_Priority, setSelected_Plan_Priority] = useState([]);
  const [Asset_Group_Code, setAsset_Group_Code] = useState([]);
  const [Fault_Code, setFault_Code] = useState([]);
  const [selected_Fault_Code, setSelected_Fault_Code] = useState([]);
  const [Asset_Status, setAsset_Status] = useState([]);
  const [Charge_Cost_Center, setCharge_Cost_Center] = useState([]);
  const [selected_Charge_Cost_Center, setSelected_Charge_Cost_Center] =
    useState([]);
  const [Supervisor_ID, setSupervisor_ID] = useState([]);
  const [Work_Group, setWork_Group] = useState([]);
  const [selected_Work_Group, setSelected_Work_Group] = useState([]);
  const [Asset_Level, setAsset_Level] = useState([]);
  const [selected_Asset_Level, setSelected_Asset_Level] = useState([]);
  const [Asset_Location, setAsset_Location] = useState([]);
  const [Cause_Code, setCause_Code] = useState([]);
  const [Action_Code, setAction_Code] = useState([]);
  const [Delay_Code, setDelay_Code] = useState([]);
  const [Work_Type, setWork_Type] = useState([]);
  const [Work_Class, setWork_Class] = useState([]);
  const [Original_Periority, setOriginal_Periority] = useState([]);
  const [Work_Area, setWork_Area] = useState([]);
  const [Originator, setOriginator] = useState([]);
  const [WorkOrderNo, setWorkOrderNo] = useState("");
  const [selected_Status, setSelected_Status] = useState([]);
  const [selected_Asset_Status, setSelected_Asset_Status] = useState([]);
  const [selected_Asset_Group_Code, setSelected_Asset_Group_Code] = useState(
    []
  );
  const [selected_Work_Area, setSelected_Work_Area] = useState([]);
  const [selected_Originator, setSelected_Originator] = useState([]);
  const [selected_Asset_Location, setSelected_Asset_Location] = useState([]);
  const [Description, setDescription] = useState("");
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

  const [Permanent_ID, setPermanent_ID] = useState("");

  const [Temporary_Asset, setTemporary_Asset] = useState(false);
  const [CheckBox_Temporary_Asset, setCheckBox_Temporary_Asset] = useState("0");

  const [Approved, setApproved] = useState(false);
  const [CheckBox_Approved, setCheckBox_Approved] = useState("0");

  const [Safety, setSafety] = useState(false);
  const [CheckBox_Safety, setCheckBox_Safety] = useState("0");

  const [Customer_Code, setCustomer_Code] = useState([]);
  const [selected_Customer_Code, setSelected_Customer_Code] = useState([]);

  const [Labor_Account, setLabor_Account] = useState([]);
  const [selected_Labor_Account, setSelected_Labor_Account] = useState([]);

  const [Material_Account, setMaterial_Account] = useState([]);
  const [selected_Material_Account, setSelected_Material_Account] = useState(
    []
  );

  const [Credit_Cost_Center, setCredit_Cost_Center] = useState([]);
  const [selected_Credit_Cost_Center, setSelected_Credit_Cost_Center] =
    useState([]);

  const [Contract_Account, setContract_Account] = useState([]);
  const [selected_Contract_Account, setSelected_Contract_Account] = useState(
    []
  );

  const [Miscellaneous_Account, setMiscellaneous_Account] = useState([]);
  const [selected_Miscellaneous_Account, setSelected_Miscellaneous_Account] =
    useState([]);

  const [Columns, setColumns] = useState([]);
  const [Data, setData] = useState([]);
  const [AutoNumring, setAutoNumring] = useState("");

  const [UDFNote1, setUDFNote1] = useState("");
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

  const [UDFNumber_1, setUDFNumber_1] = useState("");
  const [UDFNumber_2, setUDFNumber_2] = useState("");
  const [UDFNumber_3, setUDFNumber_3] = useState("");
  const [UDFNumber_4, setUDFNumber_4] = useState("");
  const [UDFNumber_5, setUDFNumber_5] = useState("");

  const [UDFDate_1, setUDFDate_1] = useState("");
  const [UDFDate_2, setUDFDate_2] = useState("");
  const [UDFDate_3, setUDFDate_3] = useState("");
  const [UDFDate_4, setUDFDate_4] = useState("");
  const [UDFDate_5, setUDFDate_5] = useState("");
  const [Button_save, setButton_save] = useState("");
  const [getDbImgRowId, setDbImgRowId] = useState("");
  const [SpecialOdrResult, setSpecialOdrResult] = useState([]);

  const [steps, setsteps] = useState([]);
  const StatushandleClose = () => setStatusShow(false);

  const [StatusShow, setStatusShow] = useState(false);

  const [AssignStatusShow, setAssignStatusShow] = useState(false);
  const AssignStatushandleClose = () => setAssignStatusShow(false);
  const [AssignStatusToOther, setAssignStatusOther] = useState([]);

  const [CommentShow, setCommentShow] = useState(false);
  const CommenthandleClose = () => setCommentShow(false);
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
  const [isAssetStatusEmpty, setIsAssetStatusEmpty] = useState(false);

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

  const [WorkOrderMandatoryFiled, setWorkOrderMandatoryFiled] = useState([]);
  const [errorField, setErrorField] = useState(null);

  const [isWorkOrderStatusEmpty, setIsWorkOrderStatusEmpty] = useState(false);
  const [isWorkDescEmpty, setIsWorkDescEmpty] = useState(false);
  const [isWorkOrderAssetNoEmpty, setisWorkOrderAssetNoEmpty] = useState(false);
  const [isChargeCostEmpty, setIsChargeCostEmpty] = useState(false);

  const autocompleteRef = useRef(null);
  const assetNoAutocompleteRef = useRef(null);
  const faultCodeAutocompleteRef = useRef(null);

  const [isFormFiled, setIsFormFiled] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (RowID !== "" && RowID !== null && RowID !== undefined) {
        setButton_save("Update");
        await get_workordermaster_select();
        await getWorkOrderLebel();
        await getWorkOrderMandatoryfiled();
      } else if (
        completeRowID !== undefined &&
        completeRowID !== null &&
        completeRowID !== ""
      ) {
        //setSelected_Status
        setButton_save("Completed");
        await get_workordermaster_select();
        await getWorkOrderLebel();
        await getWorkOrderMandatoryfiled();
      } else if (
        closeRowID !== undefined &&
        closeRowID !== null &&
        closeRowID !== ""
      ) {
        setButton_save("Close Order");
        await get_workordermaster_select();
        await getWorkOrderLebel();
        await getWorkOrderMandatoryfiled();
      } else {
        await getWorkOrderLebel();
        await getWorkOrderMandatoryfiled();
        await fetchStatusData();
        await fetchStusPriortyData();
        setButton_save("Save");
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // Get All Filed label Name
  const getWorkOrderLebel = async () => {
    try {
      const response = await httpCommon.get("/getWorkOrderFromLebal.php");

      if (response.data.status === "SUCCESS") {
        setWkoMstLabel(response.data.data.wko_mst);
        setWkoDetLabel(response.data.data.wko_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getWorkOrderMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrder_mandatoryFiled.php"
      );
      if (response.data.data.MandatoryField.length > 0) {
        setWorkOrderMandatoryFiled(response.data.data.MandatoryField);
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
      
        if (responseJson.data.data[0].wko_mst_flt_code == null) {
          setSelected_Fault_Code("");
        } else {
          setSelected_Fault_Code({
            label: responseJson.data.data[0].wko_mst_flt_code,
          });
        }

        setDescription(responseJson.data.data["0"].wko_mst_descs);
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
  //console.log("WorkOrderMandatoryFiled____",WorkOrderMandatoryFiled);
  // Second Api call
  const fetchStatusData = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderStatus.php?site_cd=" + site_ID
      );
      console.log("response____status__", response);
      let Status = response.data.data.WorkStatus.map((item) => ({
        label: item.wrk_sts_status + " : " + item.wrk_sts_desc,
        value: item.wrk_sts_desc,
        key: item.wrk_sts_typ_cd,
      }));

      setStatus(Status);
      if (
        completeRowID !== undefined &&
        completeRowID !== null &&
        completeRowID !== ""
      ) {
        const completeStatus = Status.find(
          (status) => status.key === "COMPLETE"
        );

        setSelected_Status(completeStatus);
      }

      if (
        closeRowID !== undefined &&
        closeRowID !== null &&
        closeRowID !== ""
      ) {
        const closeStatus = Status.find((status) => status.key === "CLOSE");

        setSelected_Status(closeStatus);
      }

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

      let Asset_Group_Code = response.data.data.AssetGroupCode.map((item) => ({
        label: item.ast_grp_grp_cd + " : " + item.ast_grp_desc,
        value: item.ast_grp_desc,
      }));
      setAsset_Group_Code(Asset_Group_Code);

      let Charge_Cost_Center = response.data.data.ChargeCostCenter.map(
        (item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.descs,
        })
      );
      setCharge_Cost_Center(Charge_Cost_Center);

      let Work_Group = response.data.data.WorkGroup.map((item) => ({
        label: item.wrk_grp_grp_cd + " : " + item.wrk_grp_desc,
        value: item.wrk_grp_desc,
      }));
      setWork_Group(Work_Group);

      let Asset_Level = response.data.data.AssetLevel.map((item) => ({
        label: item.ast_lvl_ast_lvl + " : " + item.ast_lvl_desc,
        value: item.ast_lvl_desc,
      }));
      setAsset_Level(Asset_Level);

      let Asset_Location = response.data.data.AssetLocation.map((item) => ({
        label: item.ast_loc_ast_loc + " : " + item.ast_loc_desc,
        value: item.ast_loc_desc,
      }));
      setAsset_Location(Asset_Location);

      let Cause_Code = response.data.data.CasuseCode.map((item) => ({
        label: item.wrk_ccd_cause_cd + " : " + item.wrk_ccd_desc,
        value: item.wrk_ccd_desc,
      }));
      setCause_Code(Cause_Code);

      let Action_Code = response.data.data.ActionCode.map((item) => ({
        label: item.wrk_act_action_cd + " : " + item.wrk_act_desc,
        value: item.wrk_act_desc,
      }));
      setAction_Code(Action_Code);

      let Delay_Code = response.data.data.WKO_Delay_Code.map((item) => ({
        label: item.wrk_dcd_delay_cd + " : " + item.wrk_dcd_desc,
        value: item.wrk_dcd_desc,
      }));
      setDelay_Code(Delay_Code);

      let Work_Type = response.data.data.WorkType.map((item) => ({
        label: item.wrk_typ_typ_cd + " : " + item.wrk_typ_desc,
        value: item.wrk_typ_desc,
      }));
      setWork_Type(Work_Type);

      let Work_Class = response.data.data.WorkPermitType.map((item) => ({
        label: item.wrk_cls_cls_cd + " : " + item.wrk_cls_desc,
        value: item.wrk_cls_desc,
      }));
      setWork_Class(Work_Class);

      let Original_Periority = response.data.data.OriginalPeriority.map(
        (item) => ({
          label: item.wrk_pri_pri_cd + " : " + item.wrk_pri_desc,
          value: item.wrk_pri_desc,
        })
      );
      setOriginal_Periority(Original_Periority);

      let Work_Area = response.data.data.Work_Area.map((item) => ({
        label: item.mst_war_work_area + " : " + item.mst_war_desc,
        value: item.mst_war_desc,
      }));
      setWork_Area(Work_Area);
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
    // console.log("fetch___img___");
    try {
      const response = await httpCommon.get(
        "/get_WorkOrderImg.php?RowID=" + RowID
      );
      //   console.log("response_____img___get___",response);
      if (response.data.data) {
        // Check if AllImgGet exists and has items
        if (
          response.data.data.AllImgGet &&
          response.data.data.AllImgGet.length > 0
        ) {
          setDbImg(response.data.data.AllImgGet);
          setImguploadStatus(response.data.data.AllImgGet[0].ImgStatus);
          // setDbImgRowId(response.data.data.AllImgGet[0].RowID);
          setImageSelect({
            name: response.data.data.AllImgGet[0].file_name,
            path: response.data.data.AllImgGet[0].attachment,
          });
        }

        // Check if AllRef exists and has items
        if (response.data.data.AllRef && response.data.data.AllRef.length > 0) {
          setRefImg(response.data.data.AllRef);
          setImguploadRefStatus(response.data.data.AllRef[0].ImgStatusRef);
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
    setDbImgRowId(ImgIDdlt);
    setImguploadStatus("NEW_SINGLE_IMG");
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
      setImguploadStatus("NEW_SINGLE_IMG");
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
    // console.log("click this button___");
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
    setImguploadRefStatus("Ref_New_img");
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
    const matchingColumn = wkoMstLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };
  // WorkReq Label Details table
  const findCustomizeLabelDet = (columnName) => {
    const matchingColumn = wkodetLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = WorkOrderMandatoryFiled.find(
      (item) => item.column_name === columnName
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
    }
    return "";
  };

  const [modalOpenAsset, setModalOpenAsset] = useState(false);

  //get WorkOrderAssetNo onther component
  const handleEditClick = () => {
    setModalOpenAsset(true);
  };

  const handleCancelClick = () => {
    setAsset_No("");
  };
  function handleCloseModal() {
    setModalOpenAsset(false);
    Swal.close();

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

    setAsset_No(dataa);
    setIsAssetNoEmpty(false);

    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
    if (dataa !== undefined && dataa !== null) {
      handleSelectedAssetNo(dataa);
    }
    if (dataSecond == "1") {
      setModalOpenAsset(false);
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
  const handleClickOriginator = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderOriginator.php?site_cd=" + site_ID
      );
      let Originator = response.data.data.WorkOriginator.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
        value: item.emp_mst_empl_id,
      }));
      setOriginator(Originator);
    } catch (error) {
      console.error(error);
    }
  };
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
      setErrorField(null);
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
      setErrorField(null);
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
      setCustomer_Code(CustomerCode);
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
  const onClickChange = (event) => {
    event.preventDefault();
    if (selected_Status == "" || selected_Status == null) {
      setIsWorkOrderStatusEmpty(true);
      const errorMessage = "Please fill the required field Status is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (Description == "" || Description == null) {
      setIsWorkDescEmpty(true);
      const errorMessage =
        "Please fill the required field Description is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (Asset_No == "" || Asset_No == null) {
      setisWorkOrderAssetNoEmpty(true);
      const errorMessage =
        "Please fill the required field Asse No is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      selected_Charge_Cost_Center == "" ||
      selected_Charge_Cost_Center == null
    ) {
      setIsChargeCostEmpty(true);
      const errorMessage =
        "Please fill the required field Charge Cost Center is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      selected_Original_Periority == "" ||
      selected_Original_Periority == null
    ) {
      setIsOriginalPeriorityEmpty(true);
      const errorMessage =
        "Please fill the required field Original Periority is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else {
      if (Button_save === "Save") {
        New_WorkOrder();

        // resetData();
      } else if (Button_save === "Update") {
        Update_WorkOrder();
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
        console.log("close____btn");
        Update_closeOrder();
      }
    }
  };
  const onClickCancel = () => {
    //navigate(`/dashboard/work/order?currentPage=${currentPage}&selecOption=${selecOption}`);
    // navigate(`/dashboard/work/order`);
    navigate(`/dashboard/work/order`, {
      state: {
        currentPage,
        selectedOption,
      },
    });
  };

  const New_WorkOrder = async () => {
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
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    //Select Asset No

    let EmptyAsset;
    if (Asset_No == "" || Asset_No == null) {
      EmptyAsset = "";
    } else {
      // Asset_No = selected_Asset_No.label.split(":")
      const EmptyAssetSplit = Asset_No.split(":");
      EmptyAsset = EmptyAssetSplit[0];
    }

    //Select Status
    let Status, setStatus;
    if (selected_Status.label == "" || selected_Status.label == null) {
      setStatus = "";
    } else {
      Status = selected_Status.label.split(":");
      setStatus = Status[0];
      ////console.log("Status: ", Status[0])
    }

    //Select Asset Status
    let Asset_Status, setAsset_Status;
    if (selected_Asset_Status == "" || selected_Asset_Status == null) {
      setAsset_Status = "";
    } else {
      Asset_Status = selected_Asset_Status.label.split(":");
      setAsset_Status = Asset_Status[0];
      //console.log("Asset_Status ", setAsset_Status)
    }

    //Select Plan Priority
    let Plan_Priority, setPlan_Priority;
    if (selected_Plan_Priority == "" || selected_Plan_Priority == null) {
      setPlan_Priority = "";
    } else {
      Plan_Priority = selected_Plan_Priority.label.split(":");
      setPlan_Priority = Plan_Priority[0];
      ////console.log("Plan_Priority ", Plan_Priority[0])
    }

    //Select Asset Group Code
    let Asset_Group_Code, setAsset_Group_Code;
    if (
      selected_Asset_Group_Code.label == "" ||
      selected_Asset_Group_Code.label == null
    ) {
      setAsset_Group_Code = "";
    } else {
      Asset_Group_Code = selected_Asset_Group_Code.label.split(":");
      setAsset_Group_Code = Asset_Group_Code[0];
      ////console.log("Asset_Group_Code ", Asset_Group_Code[0])
    }

    //Select Origination Date
    let date_of_origination = "";
    if (OriginationDate == "" || OriginationDate == null) {
      date_of_origination = "";
    } else {
      date_of_origination = Moment(OriginationDate)
        .utcOffset("+08:00")
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("OD ", date_of_origination);
    }

    //Select Charge Cost Center
    let Charge_Cost_Center, setCharge_Cost_Center;

    if (
      selected_Charge_Cost_Center == "" ||
      selected_Charge_Cost_Center == null
    ) {
      setCharge_Cost_Center = "";
    } else {
      Charge_Cost_Center = selected_Charge_Cost_Center.label.split(":");
      setCharge_Cost_Center = Charge_Cost_Center[0];
      ////console.log("Work_Area ", Work_Area[0])
    }
    ////console.log("Charge_Cost_Center: ", Charge_Cost_Center[0])

    //Select Due Date
    let date_of_due = "";
    if (DueDate == "" || DueDate == null) {
      date_of_due = "";
    } else {
      date_of_due = Moment(DueDate).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("DD ", date_of_due);
    }

    //Select Work Area
    let Work_Area, setWork_Area;
    if (selected_Work_Area == "" || selected_Work_Area == null) {
      setWork_Area = "";
    } else {
      Work_Area = selected_Work_Area.label.split(":");
      setWork_Area = Work_Area[0];
      ////console.log("Work_Area ", Work_Area[0])
    }

    //Select Originator
    let Originator, setOriginator;
    if (selected_Originator == "" || selected_Originator == null) {
      setOriginator = "";
    } else {
      Originator = selected_Originator.label.split(":");
      setOriginator = Originator[0];
      ////console.log("Originator ", Originator[0])
    }

    //Select Asset Level
    let Asset_Level, setAsset_Level;
    if (selected_Asset_Level === "" || selected_Asset_Level === null) {
      setAsset_Level = "";
    } else {
      Asset_Level = selected_Asset_Level.label.split(":");
      setAsset_Level = Asset_Level[0];
      ////console.log("Asset_Level ", Asset_Level[0])
    }

    //Select Phone
    ////console.log("Phone: ", Phone)

    //Select Asset Location
    let Asset_Location, setAsset_Location;
    if (selected_Asset_Location == "" || selected_Asset_Location == null) {
      setAsset_Location = "";
    } else {
      Asset_Location = selected_Asset_Location.label.split(":");
      setAsset_Location = Asset_Location[0];
      ////console.log("Asset_Location ", Asset_Location[0])
    }

    //Select Fault Code
    //let Fault_Code = selected_Fault_Code.label.split(":");
    ////console.log("Fault_Code: ", Fault_Code[0])

    let Fault_Code, setFault_Code;
    if (selected_Fault_Code == "" || selected_Fault_Code == null) {
      setFault_Code = "";
    } else {
      Fault_Code = selected_Fault_Code.label.split(":");
      setFault_Code = Fault_Code[0];
      //console.log("Asset_Status ", setAsset_Status)
    }

    //Select Project ID
    let Project_ID, setProject_ID;

    ////console.log('Project_ID', selected_Project_ID.label)
    if (selected_Project_ID.label == "" || selected_Project_ID.label == null) {
      setProject_ID = "";
    } else {
      Project_ID = selected_Project_ID.label.split(":");
      setProject_ID = Project_ID[0];
      ////console.log("Project_ID ", Project_ID[0])
    }

    //Select Original Periority
    let Original_Periority, setOriginal_Periority;
    ////console.log("Original_Periority: ", Original_Periority[0])
    if (
      selected_Original_Periority.label == "" ||
      selected_Original_Periority.label == null
    ) {
      setOriginal_Periority = "";
    } else {
      Original_Periority = selected_Original_Periority.label.split(":");
      setOriginal_Periority = Original_Periority[0];
      ////console.log("Project_ID ", Project_ID[0])
    }

    //Select Cause Code
    let Cause_Code, setCause_Code;
    if (selected_Cause_Code == "" || selected_Cause_Code == null) {
      setCause_Code = "";
    } else {
      Cause_Code = selected_Cause_Code.label.split(":");
      setCause_Code = Cause_Code[0];
      ////console.log("Cause_Code ", Cause_Code[0])
    }

    //Select Work Type
    let Work_Type, setWork_Type;
    if (selected_Work_Type == "" || selected_Work_Type == null) {
      setWork_Type = "";
    } else {
      Work_Type = selected_Work_Type.label.split(":");
      setWork_Type = Work_Type[0];
      ////console.log("Cause_Code ", Cause_Code[0])
    }
    //Select Schedule Date
    let date_of_schedule = "";
    if (ScheduleDate == "" || ScheduleDate == null) {
      date_of_schedule = "";
    } else {
      date_of_schedule = Moment(ScheduleDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("SD ", date_of_schedule);
    }

    //Select Action Code
    let Action_Code, setAction_Code;
    if (selected_Action_Code == "" || selected_Action_Code == null) {
      setAction_Code = "";
    } else {
      Action_Code = selected_Action_Code.label.split(":");
      setAction_Code = Action_Code[0];
      ////console.log("Action_Code ", Action_Code[0])
    }

    //Select Exception Date
    let date_of_exception = "";
    if (ExceptionDate == "" || ExceptionDate == null) {
      date_of_exception = "";
    } else {
      date_of_exception = Moment(ExceptionDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("EB ", date_of_exception);
    }

    //Select Delay Code
    let Delay_Code, setDelay_Code;
    if (selected_Delay_Code.label == "" || selected_Delay_Code.label == null) {
      setDelay_Code = "";
    } else {
      Delay_Code = selected_Delay_Code.label.split(":");
      setDelay_Code = Delay_Code[0];
      ////console.log("Delay_Code ", Delay_Code[0])
    }

    //Select Status Change Date
    let date_of_status_change = "";
    if (StatusChangeDate == "" || StatusChangeDate == null) {
      date_of_status_change = "";
    } else {
      date_of_status_change = Moment(StatusChangeDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("SCB ", date_of_status_change);
    }

    //Select Completion Date
    let date_of_completion = "";
    if (CompletionDate == "" || CompletionDate == null) {
      date_of_completion = "";
    } else {
      date_of_completion = Moment(CompletionDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("CD ", date_of_completion);
    }

    //Select Work Class
    let Work_Class, setWork_Class;
    if (selected_Work_Class == "" || selected_Work_Class == null) {
      setWork_Class = "";
    } else {
      Work_Class = selected_Work_Class.label.split(":");
      setWork_Class = Work_Class[0];
      ////console.log("Work_Class ", Work_Class[0])
    }

    //Select Close Date
    let date_of_close = "";
    if (CloseDate == "" || CloseDate == null) {
      date_of_close = "";
    } else {
      date_of_close = Moment(CloseDate).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("CLOD ", date_of_close);
    }

    //Select Work Group
    let Work_Group = selected_Work_Group.label.split(":");
    ////console.log("Work_Group: ", Work_Group[0])

    //Select Supervisor ID
    let Supervisor_ID, setSupervisor_ID;
    if (
      selected_Supervisor_ID.label == "" ||
      selected_Supervisor_ID.label == null
    ) {
      setSupervisor_ID = "";
    } else {
      Supervisor_ID = selected_Supervisor_ID.label.split(":");
      setSupervisor_ID = Supervisor_ID[0];
      ////console.log("Supervisor_ID ", Supervisor_ID[0])
    }

    //Select Planner
    let Planner, setPlanner;
    if (selected_Planner.label == "" || selected_Planner.label == null) {
      setPlanner = "";
    } else {
      Planner = selected_Planner.label.split(":");
      setPlanner = Planner[0];
      ////console.log("Planner ", Planner[0])
    }

    //Select Approver
    // console.log("selected_Approver___",selected_Approver);
    let Approver, setApprover;

    if (selected_Approver.length === 0 || selected_Approver[0] === null) {
      setApprover = "";
    } else {
      // Assuming you're checking the first element in the array
      Approver = selected_Approver.label.split(":");
      setApprover = Approver[0];
      // console.log("Approver ", Approver[0]);
    }

    //Select Assign To
    let Assign_To, setAssign_To;
    if (selected_Assign_To == "" || selected_Assign_To == null) {
      setAssign_To = "";
    } else {
      Assign_To = selected_Assign_To.label.split(":");
      setAssign_To = Assign_To[0];
      ////console.log("Assign_To ", Assign_To[0])
    }

    //Select WKO Customer Code
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

    //Select WKO Labor Account
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

    //Select WKO Material Account
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

    //Select WKO Credit Cost Center
    let CreditCostCenterValue;
    if (
      selected_Credit_Cost_Center.length === 0 ||
      selected_Credit_Cost_Center[0] === null
    ) {
      CreditCostCenterValue = "";
    } else {
      const CreditCenter = selected_Credit_Cost_Center.label.split(":");
      CreditCostCenterValue = CreditCenter[0];
    }

    //Select WKO Contract Account
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

    //Select WKO Miscellaneous Account
    let MiscellaneousAccountValue;
    if (
      selected_Miscellaneous_Account.length === 0 ||
      selected_Miscellaneous_Account[0] === null
    ) {
      MiscellaneousAccountValue = "";
    } else {
      const MiscellaneousAccount =
        selected_Miscellaneous_Account.label.split(":");
      MiscellaneousAccountValue = MiscellaneousAccount[0];
    }
    //Select Date 1
    let date_1 = "";
    if (UDFDate_1 == "" || UDFDate_1 == null) {
      date_1 = "";
    } else {
      date_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date1 ", date_1);
    }

    //Select Date 2
    let date_2 = "";
    if (UDFDate_2 == "" || UDFDate_2 == null) {
      date_2 = "";
    } else {
      date_2 = Moment(UDFDate_2).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date2 ", date_2);
    }

    //Select Date 3
    let date_3 = "";
    if (UDFDate_3 == "" || UDFDate_3 == null) {
      date_3 = "";
    } else {
      date_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date3 ", date_3);
    }

    //Select Date 4
    let date_4 = "";
    if (UDFDate_4 == "" || UDFDate_4 == null) {
      date_4 = "";
    } else {
      date_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date4 ", date_4);
    }

    //Select Date 5
    let date_5 = "";
    if (UDFDate_5 == "" || UDFDate_5 == null) {
      date_5 = "";
    } else {
      date_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date5 ", date_5);
    }
    let missingFields = [];

    var json_workorder_Insert = {
      site_cd: site_ID,
      wko_mst_wo_no: WorkOrderNo.trim(),
      wko_mst_assetno: EmptyAsset.trim(),
      wko_mst_status: setStatus.trim(),
      wko_mst_asset_status: setAsset_Status.trim(),
      wko_mst_plan_priority: setPlan_Priority.trim(),
      wko_mst_asset_group_code: setAsset_Group_Code.trim(),
      wko_mst_org_date: date_of_origination,
      wko_mst_chg_costcenter: setCharge_Cost_Center.trim(),
      wko_mst_due_date: date_of_due,
      wko_mst_work_area: setWork_Area.trim(),
      wko_mst_originator: setOriginator.trim(),
      wko_mst_asset_level: setAsset_Level.trim(),
      wko_mst_phone: Phone.trim(),
      wko_mst_asset_location: setAsset_Location.trim(),
      wko_mst_flt_code: setFault_Code.trim(),
      wko_mst_descs: Description.trim(),

      wko_mst_project_id: setProject_ID.trim(),
      wko_mst_orig_priority: setOriginal_Periority.trim(),
      wko_det_corr_action: CorrectiveAction.trim(),
      wko_det_cause_code: setCause_Code.trim(),
      wko_det_sched_date: date_of_schedule,
      wko_det_act_code: setAction_Code.trim(),
      wko_det_exc_date: date_of_exception,
      wko_det_delay_cd: setDelay_Code.trim(),
      wko_det_sc_date: date_of_status_change,
      wko_det_work_type: setWork_Type.trim(),
      wko_det_cmpl_date: date_of_completion,
      wko_det_work_class: setWork_Class.trim(),
      wko_det_clo_date: date_of_close,
      wko_det_work_grp: Work_Group[0].trim(),
      wko_det_supv_id: setSupervisor_ID.trim(),
      wko_det_planner: setPlanner.trim(),
      wko_det_approver: setApprover.trim(),
      wko_det_assign_to: setAssign_To.trim(),
      wko_det_perm_id: Permanent_ID,
      wko_det_temp_asset: CheckBox_Temporary_Asset,
      wko_det_approved: CheckBox_Approved,
      wko_det_safety: CheckBox_Safety,

      wko_det_customer_cd: CustomerCodeValue,
      wko_det_laccount: LaborAccountValue.trim(),
      wko_det_maccount: MaterialAccountValue.trim(),
      wko_det_crd_costcenter: CreditCostCenterValue.trim(),
      wko_det_caccount: ContractAccountValue.trim(),
      wko_det_saccount: MiscellaneousAccountValue.trim(),

      wko_det_note1: UDFNote1 ? UDFNote1.trim() : "",
      wko_det_varchar1: UDFText_1 ? UDFText_1.trim() : "",
      wko_det_varchar2: UDFText_2 ? UDFText_2.trim() : "",
      wko_det_varchar3: UDFText_3 ? UDFText_3.trim() : "",
      wko_det_varchar4: UDFText_4 ? UDFText_4.trim() : "",
      wko_det_varchar5: UDFText_5 ? UDFText_5.trim() : "",
      wko_det_varchar6: UDFText_6 ? UDFText_6.trim() : "",
      wko_det_varchar7: UDFText_7 ? UDFText_7.trim() : "",
      wko_det_varchar8: UDFText_8 ? UDFText_8.trim() : "",
      wko_det_varchar9: UDFText_9 ? UDFText_9.trim() : "",
      wko_det_varchar10: UDFText_10 ? UDFText_10.trim() : "",

      wko_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : "",
      wko_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : "",
      wko_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : "",
      wko_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : "",
      wko_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : "",

      wko_det_datetime1: date_1 ? date_1.trim() : date_1,
      wko_det_datetime2: date_2 ? date_2.trim() : date_2,
      wko_det_datetime3: date_3 ? date_3.trim() : date_3,
      wko_det_datetime4: date_4 ? date_4.trim() : date_4,
      wko_det_datetime5: date_5 ? date_5.trim() : date_5,

      asset_type_ID: AutoNumring.trim(),
      ImgUpload: imageSelect,
      audit_user: emp_mst_login_id.trim(),
      wko_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
      wko_mst_create_date: get_date,
      cnt_mst_numbering: AutoNumring,
    };
    for (let i = 0; i < WorkOrderMandatoryFiled.length; i++) {
      const item = WorkOrderMandatoryFiled[i];
      const fieldValue = json_workorder_Insert[item.column_name];
      if (fieldValue !== null && fieldValue.trim() === "") {
        missingFields = item.customize_label;
        setErrorField(item.column_name);
        break;
      }
    }
    if (missingFields.length > 0) {
      Swal.close();

      const errorMessage = `Please fill the required field: ${missingFields}`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else {
      // console.log("json_workorder_insert", json_workorder);
      try {
        const response = await httpCommon.post(
          "/insert_new_workorder.php",
          JSON.stringify(json_workorder_Insert)
        );
         console.log("json_workorderNew Data", response);

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
            navigate(`/dashboard/work/order`);
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
    }
  };

  console.log("Asset_No____",Asset_No);
  const Update_WorkOrder = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
  //  Swal.showLoading();

    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    // let RowID = localStorage.getItem("RowID");

    //Select Asset No
    let EmptyAsset;
    if (Asset_No == "" || Asset_No == null) {
      EmptyAsset = "";
    } else {
      // Asset_No = selected_Asset_No.label.split(":")
      const EmptyAssetSplit = Asset_No.split(":");
      EmptyAsset = EmptyAssetSplit[0];
    }

    //Select Status
    let Status, setStatus;
    if (selected_Status.label === "" || selected_Status.label === null) {
      setIsWorkOrderStatusEmpty(true);
      const errorMessage = "Please fill the required field Status is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      Swal.close();
      return;
    } else {
      Status = selected_Status.label.split(":");
      setStatus = Status[0];
    }

    //Select Asset Status
    let Asset_Status, setAsset_Status;
    if (
      selected_Asset_Status.label === "" ||
      selected_Asset_Status.label === null
    ) {
      // console.log("selected_Asset_Status", selected_Asset_Status);
      setAsset_Status = "";
    } else {
      Asset_Status = selected_Asset_Status.label.split(":");
      setAsset_Status = Asset_Status[0];
    }

    //Select Plan Priority !selected_Originator || !selected_Originator.label
    let Plan_Priority, setPlan_Priority;
    if (!selected_Plan_Priority || !selected_Plan_Priority.label) {
      setPlan_Priority = "";
    } else {
      Plan_Priority = selected_Plan_Priority.label.split(":");
      setPlan_Priority = Plan_Priority[0];
      ////console.log("Plan_Priority ", Plan_Priority[0])
    }

    //Select Asset Group Code
    let Asset_Group_Code;
    if (!selected_Asset_Group_Code || !selected_Asset_Group_Code.label) {
      Asset_Group_Code = "";
    } else {
      const AssetGroupCode = selected_Asset_Group_Code.label.split(":");
      Asset_Group_Code = AssetGroupCode[0];
      ////console.log("Asset_Group_Code ", Asset_Group_Code[0])
    }

    //Select Origination Date
    let date_of_origination = "";
    if (OriginationDate == "" || OriginationDate == null) {
      date_of_origination = "";
    } else {
      date_of_origination = Moment(OriginationDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("OD ", date_of_origination);
    }

    //Select Charge Cost Center
    let Charge_Cost_Center, setCharge_Cost_Center;
    if (
      selected_Charge_Cost_Center.label == "" ||
      selected_Charge_Cost_Center.label == null
    ) {
     setIsChargeCostEmpty(true);
      const errorMessage =
        "Please fill the required field Charge Cost Center is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      Swal.close();
      return;
    } else {
      Charge_Cost_Center = selected_Charge_Cost_Center.label.split(":");
      setCharge_Cost_Center = Charge_Cost_Center[0];
      ////console.log("Charge_Cost_Center: ", Charge_Cost_Center[0])
    }

    //Select Due Date
    let date_of_due = "";
    if (DueDate == "" || DueDate == null) {
      date_of_due = "";
    } else {
      date_of_due = Moment(DueDate).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("DD ", date_of_due);
    }

    //Select Work Area
    let Work_Area, setWork_Area;
    if (selected_Work_Area == "" || selected_Work_Area == null) {
      setWork_Area = "";
    } else {
      Work_Area = selected_Work_Area.label.split(":");
      setWork_Area = Work_Area[0];
      ////console.log("Work_Area ", Work_Area[0])
    }

    //Select Originator
    let OriginatorUP;

    if (!selected_Originator || !selected_Originator.label) {
      OriginatorUP = "";
    } else {
      const Originator2 = selected_Originator.label.split(":");
      OriginatorUP = Originator2[0];
    }

    //Select Asset Level
    let Asset_Level;

    if (!selected_Asset_Level || !selected_Asset_Level.label) {
      Asset_Level = "";
    } else {
      const AssetLevel = selected_Asset_Level.label.split(":");
      Asset_Level = AssetLevel[0];
    }

    //Select Asset Location
    let Asset_Location, setAsset_Location;
    if (selected_Asset_Location == "" || selected_Asset_Location == null) {
      setAsset_Location = "";
    } else {
      Asset_Location = selected_Asset_Location.label.split(":");
      setAsset_Location = Asset_Location[0];
      ////console.log("Asset_Location ", Asset_Location[0])
    }

    //Select Fault Code

    let Fault_Code;
    if (!selected_Fault_Code || !selected_Fault_Code.label) {
      Fault_Code = "";
    } else {
      const Fault_Code2 = selected_Fault_Code.label.split(":");
      Fault_Code = Fault_Code2[0];
    }
    ////console.log("Fault_Code: ", Fault_Code[0])

    //Select Project ID
    let Project_ID, setProject_ID;

    ////console.log('Project_ID', selected_Project_ID.label)
    if (selected_Project_ID.label == "" || selected_Project_ID.label == null) {
      setProject_ID = "";
    } else {
      Project_ID = selected_Project_ID.label.split(":");
      setProject_ID = Project_ID[0];
      ////console.log("Project_ID ", Project_ID[0])
    }

    //Select Original Periority

    let OriginalPeriorityValue;
    if (
      selected_Original_Periority.label === "" ||
      selected_Original_Periority.label === null
    ) {
      setIsOriginalPeriorityEmpty(true);
      const errorMessage =
        "Please fill the required field Original Periority is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      Swal.close();
      return;
    } else {
      const OriginalPeriority = selected_Original_Periority.label.split(":");
      OriginalPeriorityValue = OriginalPeriority[0];
      ////console.log("Original_Periority ", Original_Periority[0])
    }

    //Select Cause Code
    let Cause_Code;

    if (!selected_Cause_Code || !selected_Cause_Code.label) {
      Cause_Code = "";
    } else {
      const Cause_Code2 = selected_Cause_Code.label.split(":");
      Cause_Code = Cause_Code2[0];
      ////console.log("Cause_Code ", Cause_Code[0])
    }

    //Select Schedule Date
    let date_of_schedule = "";
    if (ScheduleDate == "" || ScheduleDate == null) {
      date_of_schedule = "";
    } else {
      date_of_schedule = Moment(ScheduleDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("SD ", date_of_schedule);
    }

    //Select Action Code
    let Action_Code;
    if (!selected_Action_Code || !selected_Action_Code.label) {
      Action_Code = "";
    } else {
      const Action_Code2 = selected_Action_Code.label.split(":");
      Action_Code = Action_Code2[0];
      ////console.log("Action_Code ", Action_Code[0])
    }

    //Select Exception Date
    let date_of_exception = "";
    if (ExceptionDate == "" || ExceptionDate == null) {
      date_of_exception = "";
    } else {
      date_of_exception = Moment(ExceptionDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("EB ", date_of_exception);
    }

    //Select Delay Code
    let Delay_Code;
    if (!selected_Delay_Code || !selected_Delay_Code.label) {
      Delay_Code = "";
    } else {
      const Delay_Code2 = selected_Delay_Code.label.split(":");
      Delay_Code = Delay_Code2[0];
      ////console.log("Delay_Code ", Delay_Code[0])
    }

    //Select Status Change Date
    let date_of_status_change = "";
    if (StatusChangeDate == "" || StatusChangeDate == null) {
      date_of_status_change = "";
    } else {
      date_of_status_change = Moment(StatusChangeDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("SCB ", date_of_status_change);
    }

    //Select Work Type
    let WorkTypeValue;
    if (selected_Work_Type.label === "" || selected_Work_Type.label === null) {
      WorkTypeValue = "";
    } else {
      const WorkType = selected_Work_Type.label.split(":");
      WorkTypeValue = WorkType[0];
      //console.log("Work_Type ", Work_Type[0])
    }

    //Select Completion Date
    let date_of_completion = "";
    if (CompletionDate == "" || CompletionDate == null) {
      date_of_completion = "";
    } else {
      date_of_completion = Moment(CompletionDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("CD ", date_of_completion);
    }

    //Select Work Class
    let Work_Class;
    if (!selected_Work_Class || !selected_Work_Class.label) {
      Work_Class = "";
    } else {
      const Work_Class2 = selected_Work_Class.label.split(":");
      Work_Class = Work_Class2[0];
      ////console.log("Work_Class ", Work_Class[0])
    }

    //Select Close Date
    let date_of_close = "";
    if (CloseDate == "" || CloseDate == null) {
      date_of_close = "";
    } else {
      date_of_close = Moment(CloseDate).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("CLOD ", date_of_close);
    }

    //Select Work Group

    let WorkGroupValue;
    if (
      selected_Work_Group.label === "" ||
      selected_Work_Group.label === null
    ) {
      WorkGroupValue = "";
    } else {
      const WorkGroup = selected_Work_Group.label.split(":");
      WorkGroupValue = WorkGroup[0].trim();
      ////console.log("Work_Group ", Work_Group[0])
    }

    //Select Supervisor ID
    let Supervisor_ID;
    if (!selected_Supervisor_ID || !selected_Supervisor_ID.label) {
      Supervisor_ID = "";
    } else {
      const Supervisor_ID2 = selected_Supervisor_ID.label.split(":");
      Supervisor_ID = Supervisor_ID2[0];
      ////console.log("Supervisor_ID ", Supervisor_ID[0])
    }

    //Select Planner
    let Planner;
    if (!selected_Planner || !selected_Planner.label) {
      Planner = "";
    } else {
      const Planner2 = selected_Planner.label.split(":");
      Planner = Planner2[0];
      ////console.log("Planner ", Planner[0])
    }

    //Select Approver
    let Approver;
    if (!selected_Approver || !selected_Approver.label) {
      Approver = "";
    } else {
      const Approver2 = selected_Approver.label.split(":");
      Approver = Approver2[0];
      ////console.log("Approver ", Approver[0])
    }

    //Select Assign To
    let Assign_To;
    if (!selected_Assign_To || !selected_Assign_To.label) {
      Assign_To = "";
    } else {
      const Assign_To2 = selected_Assign_To.label.split(":");
      Assign_To = Assign_To2[0];
      ////console.log("Assign_To ", Assign_To[0])
    }

    //Select WKO Customer Code
    let CustomerCodeValue;
    if (!selected_Customer_Code || !selected_Customer_Code.label) {
      CustomerCodeValue = "";
    } else {
      const CustomerCode = selected_Customer_Code.label.split(":");
      CustomerCodeValue = CustomerCode[0].trim();
    }

    //Select WKO Labor Account
    let LaborAccountValue;
    if (!selected_Labor_Account || !selected_Labor_Account.label) {
      LaborAccountValue = "";
    } else {
      const LaborAccount = selected_Labor_Account.label.split(":");
      LaborAccountValue = LaborAccount[0];
    }

    //Select WKO Material Account
    let MaterialAccountValue;
    if (!selected_Material_Account || !selected_Material_Account.label) {
      MaterialAccountValue = "";
    } else {
      const MaterialAccount = selected_Material_Account.label.split(":");
      MaterialAccountValue = MaterialAccount[0];
    }

    //Select WKO Credit Cost Center
    let CreditCostCenterValue;
    if (!selected_Credit_Cost_Center || !selected_Credit_Cost_Center.label) {
      CreditCostCenterValue = "";
    } else {
      const CreditCenter = selected_Credit_Cost_Center.label.split(":");
      CreditCostCenterValue = CreditCenter[0];
    }

    //Select WKO Contract Account
    let ContractAccountValue;
    if (!selected_Contract_Account || !selected_Contract_Account.label) {
      ContractAccountValue = "";
    } else {
      const ContractAccount = selected_Contract_Account.label.split(":");
      ContractAccountValue = ContractAccount[0];
    }

    //Select WKO Miscellaneous Account
    let MiscellaneousAccountValue;
    if (
      !selected_Miscellaneous_Account ||
      !selected_Miscellaneous_Account.label
    ) {
      MiscellaneousAccountValue = "";
    } else {
      const MiscellaneousAccount =
        selected_Miscellaneous_Account.label.split(":");
      MiscellaneousAccountValue = MiscellaneousAccount[0];
    }

    //Check Img state
    let setDbImgRowIdUpdate;
    if (getDbImgRowId == "" || getDbImgRowId == null) {
      setDbImgRowIdUpdate = "";
    } else {
      setDbImgRowIdUpdate = getDbImgRowId;
    }

    //Select Date 1
    let date_1 = "";
    if (UDFDate_1 == "" || UDFDate_1 == null) {
      date_1 = "";
    } else {
      date_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date1 ", date_1);
    }

    //Select Date 2
    let date_2 = "";
    if (UDFDate_2 == "" || UDFDate_2 == null) {
      date_2 = "";
    } else {
      date_2 = Moment(UDFDate_2).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date2 ", date_2);
    }

    //Select Date 3
    let date_3 = "";
    if (UDFDate_3 == "" || UDFDate_3 == null) {
      date_3 = "";
    } else {
      date_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date3 ", date_3);
    }

    //Select Date 4
    let date_4 = "";
    if (UDFDate_4 == "" || UDFDate_4 == null) {
      date_4 = "";
    } else {
      date_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date4 ", date_4);
    }

    //Select Date 5
    let date_5 = "";
    if (UDFDate_5 == "" || UDFDate_5 == null) {
      date_5 = "";
    } else {
      date_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date5 ", date_5);
    }

    let setDescriptionValue;
    if (Description == "" || Description == null) {
      setIsWorkDescEmpty(true);
      const errorMessage =
        "Please fill the required field Description is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      Swal.close();
      return;
    } else {
      setDescriptionValue = Description;
      ////console.log("Date5 ", date_5);
    }

    let missingFields = [];

    var json_workorder_update = {
      site_cd: site_ID,
      wko_mst_wo_no: WorkOrderNo.trim(),
      wko_mst_assetno: EmptyAsset.trim(),
      wko_mst_status: setStatus.trim(),
      wko_mst_asset_status: setAsset_Status.trim(),
      wko_mst_plan_priority: setPlan_Priority.trim(),
      wko_mst_asset_group_code: Asset_Group_Code.trim(),
      wko_mst_org_date: date_of_origination,
      wko_mst_chg_costcenter: Charge_Cost_Center[0].trim(),
      wko_mst_due_date: date_of_due,
      wko_mst_work_area: setWork_Area.trim(),
      wko_mst_originator: OriginatorUP.trim(),
      wko_mst_asset_level: Asset_Level.trim(),
      wko_mst_phone: Phone,
      wko_mst_asset_location: setAsset_Location.trim(),
      wko_mst_flt_code: Fault_Code.trim(),
      wko_mst_descs: setDescriptionValue,

      wko_det_corr_action: CorrectiveAction,
      wko_mst_project_id: setProject_ID.trim(),
      wko_mst_orig_priority: OriginalPeriorityValue,
      wko_det_cause_code: Cause_Code.trim(),
      wko_det_sched_date: date_of_schedule,
      wko_det_act_code: Action_Code.trim(),
      wko_det_exc_date: date_of_exception,
      wko_det_delay_cd: Delay_Code.trim(),
      wko_det_sc_date: date_of_status_change,
      wko_det_work_type: WorkTypeValue,
      wko_det_cmpl_date: date_of_completion,
      wko_det_work_class: Work_Class.trim(),
      wko_det_clo_date: date_of_close,
      wko_det_work_grp: WorkGroupValue,
      wko_det_supv_id: Supervisor_ID.trim(),
      wko_det_planner: Planner.trim(),
      wko_det_approver: Approver.trim(),
      wko_det_assign_to: Assign_To.trim(),
      wko_det_perm_id: Permanent_ID,
      wko_det_temp_asset: CheckBox_Temporary_Asset,
      wko_det_approved: CheckBox_Approved,
      wko_det_safety: CheckBox_Safety,

      wko_det_customer_cd: CustomerCodeValue,
      wko_det_laccount: LaborAccountValue.trim(),
      wko_det_maccount: MaterialAccountValue.trim(),
      wko_det_crd_costcenter: CreditCostCenterValue.trim(),
      wko_det_caccount: ContractAccountValue.trim(),
      wko_det_saccount: MiscellaneousAccountValue.trim(),

      wko_det_note1: UDFNote1,
      wko_det_varchar1: UDFText_1 ? UDFText_1.trim() : "",
      wko_det_varchar2: UDFText_2 ? UDFText_2.trim() : "",
      wko_det_varchar3: UDFText_3 ? UDFText_3.trim() : "",
      wko_det_varchar4: UDFText_4 ? UDFText_4.trim() : "",
      wko_det_varchar5: UDFText_5 ? UDFText_5.trim() : "",
      wko_det_varchar6: UDFText_6 ? UDFText_6.trim() : "",
      wko_det_varchar7: UDFText_7 ? UDFText_7.trim() : "",
      wko_det_varchar8: UDFText_8 ? UDFText_8.trim() : "",
      wko_det_varchar9: UDFText_9 ? UDFText_9.trim() : "",
      wko_det_varchar10: UDFText_10 ? UDFText_10.trim() : "",

      wko_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : "",
      wko_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : "",
      wko_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : "",
      wko_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : "",
      wko_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : "",

      wko_det_datetime1: date_1 ? date_1.trim() : date_1,
      wko_det_datetime2: date_2 ? date_2.trim() : date_2,
      wko_det_datetime3: date_3 ? date_3.trim() : date_3,
      wko_det_datetime4: date_4 ? date_4.trim() : date_4,
      wko_det_datetime5: date_5 ? date_5.trim() : date_5,

      asset_type_ID: AutoNumring.trim(),

      audit_user: emp_mst_login_id.trim(),
      wko_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
      wko_mst_create_date: get_date,
      SingleImguploadStatus: imguploadStatus,
      ImguploadRefStatus: imguploadRefStatus ? imguploadRefStatus : "EMPTY",
      ImgGetDbImgRowId: setDbImgRowIdUpdate,
      ImgUpload: imageSelect,
      SpecialOdrResult: SpecialOdrResult,

      // "ImgUploadMultiPal": selectedImages2,
      //"AllPlaningData":AllPlaningData,
      removedRefItems: removedRefItems,
      RowID: RowID,
      selectedPdfFiles: selectedPdfFiles,
    };
console.log("json_workorder_update____",json_workorder_update);

for (let i = 0; i < WorkOrderMandatoryFiled.length; i++) {
  const item = WorkOrderMandatoryFiled[i];
  const fieldValue = json_workorder_update[item.column_name];
  if (fieldValue !== null && fieldValue.trim() === "") {
    missingFields = item.customize_label;
    setErrorField(item.column_name);
    break;
  }
}
if (missingFields.length > 0) {
  Swal.close();

  const errorMessage = `Please fill the required field: ${missingFields}`;
  setSnackbarOpen(true);
  setSnackbarMessage(errorMessage);
  setSnackbarSeverity("error");
  return;

} else {
    try {
      const response = await httpCommon.post(
        "/update_workorder.php",
        JSON.stringify(json_workorder_update)
      );
     // console.log("response___order___", response);
      // Swal.close();
      if (response.data.status === "SUCCESS") {
        if (selectedPdfFiles.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < selectedPdfFiles.length; i++) {
            formData.append("files[]", selectedPdfFiles[i]);
          }
          formData.append("site_cd", site_ID);
          formData.append("RowID", RowID);
          formData.append("RefImgUploadStatus", imguploadRefStatus);
          formData.append("audit_user", emp_mst_login_id.trim());

          try {
            const response = await httpCommon.post(
              "/WorkOrderReferenceMultiImgUpload.php",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data", // Ensure proper content type
                },
              }
            );
            console.log("img___upload___", response);

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
                navigate(`/dashboard/work/order`, {
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
              navigate(`/dashboard/work/order`, {
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
}
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
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    //Select Status
    let setStatus = "";

    if (selected_Status.label) {
      console.log("selected_Status:", selected_Status);
      console.log("selected_Status.label:", selected_Status.label);

      // Split the label and log the result
      const splitLabel = selected_Status.label.split(":");
      console.log("splitLabel:", splitLabel);

      // Assign setStatus and log it
      setStatus = splitLabel[0].trim(); // Trim to remove any extra spaces
    }

    try {
      let responseJson;
      if (
        completeRowID !== undefined &&
        completeRowID !== null &&
        completeRowID !== ""
      ) {
        responseJson = await httpCommon.get(
          `/get_workordermaster_statusaudit.php?site_cd=${site_ID}&RowID=${completeRowID}`
        );
      } else if (
        closeRowID !== undefined &&
        closeRowID !== null &&
        closeRowID !== ""
      ) {
        responseJson = await httpCommon.get(
          `/get_workordermaster_statusaudit.php?site_cd=${site_ID}&RowID=${closeRowID}`
        );
      } else if (setStatus && setStatus === "CMP") {
        responseJson = await httpCommon.get(
          `/get_workordermaster_complete_statusaudit.php?site_cd=${site_ID}&RowID=${RowID}`
        );
      } else if (setStatus && setStatus === "CLO") {
        responseJson = await httpCommon.get(
          `/get_workordermaster_complete_statusaudit.php?site_cd=${site_ID}&RowID=${RowID}`
        );
      } else {
        responseJson = await httpCommon.get(
          `/get_workordermaster_statusaudit.php?site_cd=${site_ID}&RowID=${RowID}`
        );
      }
       //console.log("responseJson___status",responseJson);
      if (responseJson.data.status === "SUCCESS") {
        // console.log('get_workordermaster_statusaudit', responseJson.data.data)

        let Status = responseJson.data.data.map((item, index) => {
          let date = new Date(item.wko_sts_start_date.date);
          let formattedDate = date.toLocaleDateString("en-GB");
          let formattedTime = date.toLocaleString("default", {
            hour: "numeric",
            minute: "numeric",
            hour12: true, // 3:37 PM
          });
          let formattedWeekday = date.toLocaleString("default", {
            weekday: "short",
          }); // Fri

          return {
            label: item.wrk_sts_desc,
            label1: item.wko_sts_status,
            label2: item.emp_mst_name,
            label3: item.wko_sts_originator,
            label4: `${formattedWeekday} ${formattedDate} ${formattedTime}`,
            label5: formatDuration(item.duration),
            label6: item.wrk_sts_desc,
            step: index + 1,
          };
        });
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
      console.log("Error", error);
    }
  };

  const StatushandleShow = () => {
    setStatusShow(true);
    getsteps();
  };
  const AssignStatushandleshow = () => {
    setAssignStatusShow(true);
    getAssignTosteps();
  };
  const getAssignTosteps = async () => {
    // console.log("enter_getSteps___");
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    // Swal.showLoading();

    try {
      let responseJson;
      if (
        completeRowID !== undefined &&
        completeRowID !== null &&
        completeRowID !== ""
      ) {
        responseJson = await httpCommon.get(
          `/get_assignTo_history.php?site_cd=${site_ID}&RowID=${completeRowID}`
        );
      } else if (
        closeRowID !== undefined &&
        closeRowID !== null &&
        closeRowID !== ""
      ) {
        responseJson = await httpCommon.get(
          `/get_assignTo_history.php?site_cd=${site_ID}&RowID=${closeRowID}`
        );
      } else {
        responseJson = await httpCommon.get(
          `/get_assignTo_history.php?site_cd=${site_ID}&RowID=${RowID}`
        );
      }
      //console.log("responseJson___RowID",responseJson);
      if (responseJson.data.status === "SUCCESS") {
        let AssignStatus = responseJson.data.data.map((item, index) => {
          let date = new Date(item.audit_date.date);
          let formattedDate = date.toLocaleDateString("en-GB");
          let formattedTime = date.toLocaleString("default", {
            hour: "numeric",
            minute: "numeric",
            hour12: true, // 3:37 PM
          });
          let formattedWeekday = date.toLocaleString("default", {
            weekday: "short",
          }); // Fri

          return {
            label: item.wko_ls7_emp_id,
            label1: item.column1,
            label4: `${formattedWeekday} ${formattedDate} ${formattedTime}`,
            label5: formatDuration(item.duration),
            step: index + 1,
          };
        });

        setAssignStatusOther(AssignStatus);

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
      console.log("error", error);
    }
  };
  const addCommnethandal = () => {
    setCommentShow(true);
    fetchAllCommentData();
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

    const inputValue = messageRef.current.value.trim();

    if (inputValue === "" && !imageComment) {
      console.log("both empty");
      Swal.close();
      return;
    }

    const newComment = {
      // Add other properties as needed
      wko_ls11_name: emp_mst_name,
      audit_user: emp_mst_login_id, // Replace with the actual user
      audit_date: {
        date: Moment().format("YYYY-MM-DD HH:mm:ss"),
        timezone_type: 3,
        timezone: "UTC",
      },
      wko_ls11_sts_upd: inputValue,
      attachment: imageComment ? imageComment.base64 : null,
    };
    setAllComment((prevComments) => [...prevComments, newComment]);

    const json_workorder = {
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
      //console.log("json_workordercommet Data", response);

      if (response.data.status === "SUCCESS") {
        Swal.close();
        if (messageRef.current) {
          messageRef.current.value = "";
        }
        setImagePreview("");
        setimageComment(null); // Use null instead of an empty string
        scrollChatToBottom();
        // fetchAllCommentData();
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
      console.error("Error submitting comment:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error submitting your comment. Please try again.",
      });
    }
  };

  const Refreshdatapopup = () => {
    fetchAllCommentData();
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
  // get all comment funcation
  const fetchAllCommentData = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    setLoading(true);
    try {
      const response = await httpCommon.get(
        `get_chart.php?mst_RowID=${RowID}&site_cd=${site_ID}&url=${httpCommon.defaults.baseURL}&folder=React_web&dvc_id=Web`
      );

      //   console.log("json_workordercommet Data", response);

      if (response.data.status === "SUCCESS") {
        setAllComment(response.data.data);
        Swal.close();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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


  // OnChange to check error funcation
  const handleStatusChange = (event, value) => {
    setSelected_Status(value);
    setIsFiledValueEmpty(false);
    setIsWorkOrderStatusEmpty(false);
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
    setIsChargeCostEmpty(false);
  };
  const handleFaultCodeChange = (selectedOption) => {
   // const newValue = value === null ? null : value;
   console.log("Description_____",Description);
   setSelected_Fault_Code(selectedOption);
   if (selectedOption) {
if(Description !== ""){
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to overwrite the description?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, overwrite it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setDescription(selectedOption.value);
        
      }
    });
  }else{
    setDescription(selectedOption.value);
  }
  } else {
    //setDescription("");
  }


   //
    //handleSelectedFaultCode(newValue);
    setIsFaultCodeEmpty(false);
    setErrorField(null);
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
    setErrorField(null);
  };

  const toggleDiv = () => {
    setIsOpenWork(!isOpenWork);
  };

  const toggleDivAsset = () => {
    setIsOpenAsset(!isOpenAsset);
  };
  const handleDataFromSecondComponent = (data) => {
   // console.log("data++++++++", data);
    window.location.reload();
  };

  const handleNumericInputChange = (e, setterFunction) => {
    let { value } = e.target;
    value = value.replace(/[^\d.]/g, ''); // Remove non-numeric characters except decimal
    value = value.slice(0, 16); // Limit to 16 characters including decimals and commas
  
    const parts = value.split('.');
    let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (integerPart.length > 11) {
      integerPart = integerPart.slice(0, 12) + '.' + integerPart.slice(12, 16);
    }
    let decimalPart = parts[1] ? parts[1].slice(0, 4) : '';
  
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
    setErrorField(null);
  };

  return (
    <>
      <Helmet>
        <title>
          {RowID
            ? "CMMS System"
            : completeRowID
            ? "CMMS System"
            : closeRowID
            ? "CMMS System"
            : "CMMS System"}
        </title>
        <meta name="description" content="New Work Order" />
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div
          className="CustomBreadAssetSave"
          style={{
            position: "-webkit-sticky",
            position: "sticky",
            top: "55px",
            backgroundColor: "white",
            zIndex: 1000,
            borderBottom: "1px solid #00000021",
            height: "105px",
          }}
        >
          <CustomBreadcrumbs
            // heading="Create Work Order"
            heading={
              RowID
                ? `Edit ${WorkOrderNo} Work Order`
                : completeRowID
                ? `Complete ${WorkOrderNo} Work Order`
                : closeRowID
                ? `Close ${WorkOrderNo} Work Order`
                : "Create New Work Order"
            }
            links={[
              {
                name: "Work Order",
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
                          className="SaveButton"
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
                          Cancel
                        </Button>
                      </div>
                    );
                  } else if (
                    closeRowID !== undefined &&
                    closeRowID !== null &&
                    closeRowID !== ""
                  ) {
                    return (
                      <div>
                        <Button
                          component={RouterLink}
                          onClick={onClickChangeClose}
                          variant="contained"
                          className="SaveButton"
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
                    {
                      //console.log("selected_Status___22", Status);
                    }
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
          <div className="cmmntBtn">
            {(() => {
              if (
                completeRowID !== undefined &&
                completeRowID !== null &&
                completeRowID !== ""
              ) {
                return (
                  <div>
                    <Button
                      onClick={addCommnethandal}
                      disabled={!completeRowID}
                    >
                      <Iconify
                        icon="mdi:comments-outline"
                        style={{
                          width: "15px",
                          marginRight: "5px",
                        }}
                      />{" "}
                      Add Comments
                    </Button>
                  </div>
                );
              } else if (
                closeRowID !== undefined &&
                closeRowID !== null &&
                closeRowID !== ""
              ) {
                return (
                  <div>
                    <Button onClick={addCommnethandal} disabled={!closeRowID}>
                      <Iconify
                        icon="mdi:comments-outline"
                        style={{
                          width: "15px",
                          marginRight: "5px",
                        }}
                      />
                      Add Comments
                    </Button>
                  </div>
                );
              } else {
                return (
                  <div>
                    <Button onClick={addCommnethandal} disabled={!RowID}>
                      <Iconify
                        icon="mdi:comments-outline"
                        style={{
                          width: "15px",
                          marginRight: "5px",
                        }}
                      />
                      Add Comments
                    </Button>
                  </div>
                );
              }
            })()}
          </div>
        </div>
        <div>
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              {/* Complete Status code */}
              {completeRowID !== undefined &&
                completeRowID !== null &&
                completeRowID !== "" && (
                  <div
                    className="MainOrderFromGd"
                    style={{ backgroundColor: "white" }}
                  >
                    <Grid container spacing={0}>
                      <Grid xs={12} md={12} className="CompleteDiv">
                        <Card sx={{ p: 3 }}>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "1fr",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Box
                              rowGap={2}
                              columnGap={1}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "90%",
                                sm: "90% 10%",
                              }}
                            >
                              <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("wko_mst_status") ||
                                    "Status"}
                                </Typography>
                                <Autocomplete
                                  options={Status.filter(
                                    (status) => status.key === "COMPLETE"
                                  )}
                                  value={(selected_Status?.label || "")
                                    .split(" : ")
                                    .slice(0, 2)
                                    .join(" : ")}
                                  onChange={handleStatusChange}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          isFiledValueEmpty ? "errorEmpty" : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              <Tooltip
                                title="Status Audit"
                                placement="right"
                                className="tooltipRht"
                                disabled={Button_save == "Save"}
                              >
                                <IconButton>
                                  <Iconify
                                    icon="pajamas:status-alert"
                                    onClick={StatushandleShow}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2">
                                {findCustomizeLabel("wko_det_cmpl_date") ||
                                  "Complete Date"}
                              </Typography>

                              <DateTimePicker
                                value={CompletionDate2}
                                format="dd/MM/yyyy HH:mm"
                                className="Extrasize"
                                onChange={(newDate) => {
                                  setCompletionDate2(newDate);
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                  },
                                }}
                              />
                            </Stack>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("wko_det_corr_action") ||
                                    "Corrective Actions"}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  placeholder="Corrective Action"
                                  size="small"
                                  value={CorrectiveAction}
                                  minRows={6}
                                  className={`TxtAra ${
                                    isCorrectiveValueEmpty ? "errorEmpty" : ""
                                  }`}
                                  style={{ width: "100%" }}
                                  onChange={(e) => {
                                    setCorrectiveAction(e.target.value);
                                    setIsCorrectiveValueEmpty(false);
                                  }}
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "repeat(1, 1fr)",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2">
                                {findCustomizeLabelDet("wko_det_cause_code") ||
                                  "Cause Code"}
                              </Typography>
                              <Autocomplete
                                options={Cause_Code}
                                value={selected_Cause_Code?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Cause_Code(value || null);
                                  setIsCauseCodeValueEmpty(false);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isCauseCodeValueEmpty ? "errorEmpty" : ""
                                    }`}
                                  />
                                )}
                              />
                            </Stack>
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2">
                                {findCustomizeLabelDet("wko_det_act_code") ||
                                  "Action Code"}
                              </Typography>
                              <Autocomplete
                                options={Action_Code}
                                value={selected_Action_Code?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Action_Code(value || null);
                                  setIsActionCodeValueEmpty(false);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isActionCodeValueEmpty ? "errorEmpty" : ""
                                    }`}
                                  />
                                )}
                              />
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </div>
                )}

              {/* Close Status code */}
              {closeRowID !== undefined &&
                closeRowID !== null &&
                closeRowID !== "" && (
                  <div
                    className="MainOrderFromGd"
                    style={{ backgroundColor: "white" }}
                  >
                    <Grid container spacing={0}>
                      <Grid xs={12} md={12} className="CompleteDiv">
                        <Card sx={{ p: 3 }}>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "1fr",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Box
                              rowGap={2}
                              columnGap={1}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "90%",
                                sm: "90% 10%",
                              }}
                            >
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("wko_mst_status") ||
                                    "Status"}
                                </Typography>
                                <Autocomplete
                                  options={Status.filter(
                                    (status) => status.key === "CLOSE"
                                  )}
                                  value={(selected_Status?.label || "")
                                    .split(" : ")
                                    .slice(0, 2)
                                    .join(" : ")}
                                  onChange={handleStatusChange}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          isFiledValueEmpty ? "errorEmpty" : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              <Tooltip
                                title="Status Audit"
                                placement="right"
                                className="tooltipRht"
                                disabled={Button_save == "Save"}
                              >
                                <IconButton>
                                  <Iconify
                                    icon="pajamas:status-alert"
                                    onClick={StatushandleShow}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2">
                                {findCustomizeLabel("wko_det_clo_date") ||
                                  "Close Date"}
                              </Typography>

                              <DateTimePicker
                                value={CloseDate2}
                                format="dd/MM/yyyy HH:mm"
                                className="Extrasize"
                                onChange={(newDate) => {
                                  setCloseDate2(newDate); // Update your state with the new value
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                  },
                                }}
                              />
                            </Stack>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("wko_det_corr_action") ||
                                    "Corrective Actions"}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  placeholder="Corrective Action"
                                  size="small"
                                  value={CorrectiveAction}
                                  minRows={6}
                                  className={`TxtAra ${
                                    isCorrectiveValueEmpty ? "errorEmpty" : ""
                                  }`}
                                  style={{ width: "100%" }}
                                  onChange={(e) => {
                                    setCorrectiveAction(e.target.value);
                                    setIsCorrectiveValueEmpty(false);
                                  }}
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "repeat(1, 1fr)",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2">
                                {findCustomizeLabelDet("wko_det_cause_code") ||
                                  "Cause Code"}
                              </Typography>
                              <Autocomplete
                                options={Cause_Code}
                                value={selected_Cause_Code?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Cause_Code(value || null);
                                  setIsCauseCodeValueEmpty(false);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isCauseCodeValueEmpty ? "errorEmpty" : ""
                                    }`}
                                  />
                                )}
                              />
                            </Stack>
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2">
                                {findCustomizeLabelDet("wko_det_act_code") ||
                                  "Action Code"}
                              </Typography>
                              <Autocomplete
                                options={Action_Code}
                                value={selected_Action_Code?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Action_Code(value || null);
                                  setIsActionCodeValueEmpty(false);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isActionCodeValueEmpty ? "errorEmpty" : ""
                                    }`}
                                  />
                                )}
                              />
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </div>
                )}

              {/* toggle view */}
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
                          Work Order
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
                            {/* ************************************* img mobile ******************************************* */}
                            <div className="col-md-2 mobileImgversion">
                              <div className="row">
                                <div className="row ImgShowMobile">
                                  <div>
                                    <label htmlFor="upload-button">
                                      {getDbImg && getDbImg.length > 0 ? (
                                        <div>
                                          <img
                                            src={
                                              getDbImg[0].attachment
                                                ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}`
                                                : ""
                                            }
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
                              <Stack spacing={1}>
                                <Typography
                                  variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("wko_mst_wo_no") ||
                                    "Work Order No"}
                                </Typography>
                                <TextField
                                  name="name"
                                  size="small"
                                  disabled
                                  defaultValue={WorkOrderNo}
                                  className="ExtrasizeDisable"
                                />
                              </Stack>
                              <Box
                                rowGap={2}
                                columnGap={1}
                                display="grid"
                                gridTemplateColumns={{
                                  xs: "85%",
                                  sm: "85% 10%",
                                }}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    variant="subtitle2"
                                    className="Requiredlabel"
                                  >
                                    {findCustomizeLabel("wko_mst_status") ||
                                      "Status"}
                                  </Typography>

                                  <Autocomplete
                                    options={Status.filter(
                                      (status) => status.key === "OPEN"
                                    )}
                                    value={(selected_Status?.label || "")
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
                                            isWorkOrderStatusEmpty
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
                                <Tooltip
                                  title="Status Audit"
                                  placement="right"
                                  className="tooltipRht"
                                  disabled={Button_save == "Save"}
                                >
                                  <IconButton>
                                    <Iconify
                                      icon="pajamas:status-alert"
                                      onClick={StatushandleShow}
                                    />
                                  </IconButton>
                                </Tooltip>
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
                              marginBottom={2}
                            >
                              <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("wko_mst_originator") ||
                                    "Originator"}
                                </Typography>
                                <Autocomplete
                                  options={Originator}
                                  value={selected_Originator?.label ?? ""}
                                  onChange={(event, value) => {
                                    setSelected_Originator(value || null);
                                  }}
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className="Extrasize"
                                        onClick={handleClickOriginator}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel(
                                    "wko_mst_plan_priority"
                                  ) || "Plan Periority"}
                                </Typography>
                                <Autocomplete
                                  options={Plan_Priority}
                                  value={selected_Plan_Priority?.label ?? ""}
                                  onChange={handlePlanPriorityChange}
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className="Extrasize"
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
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
                                  {findCustomizeLabel("wko_mst_phone") ||
                                    "Phone"}
                                </Typography>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  value={Phone}
                                 
                                  onChange={(e) => {
                             
                                    const value = e.target.value;
                                    if (value.length <= 20) {
                                      setPhone(value);
                                    }
                                    setErrorField(null); 
                                    setIsFormFiled(true);
                                  }}
                                />
                              </Stack>
                              <Box
                                rowGap={2}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                  xs: "repeat(1, 1fr)",
                                  sm: "repeat(2, 1fr)",
                                }}
                                marginBottom={2}
                              >
                                <Stack spacing={1}>
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel("wko_mst_org_date") ||
                                      "Origination Date"}
                                  </Typography>

                                  <DateTimePicker
                                    value={OriginationDate}
                                    format="dd/MM/yyyy HH:mm"
                                    className="Extrasize"
                                    sx={{ fontSize: "0.875rem" }}
                                    onChange={(newDate) => {
                                      setOriginationDate(newDate); // Update your state with the new value
                                    }}
                                    slotProps={{
                                      textField: {
                                        fullWidth: true,
                                      },
                                    }}
                                  />
                                </Stack>
                                <Stack spacing={1}>
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel(
                                      "wko_det_wr_due_date"
                                    ) || "Due Date"}
                                  </Typography>

                                  <DateTimePicker
                                    value={DueDate}
                                    format="dd/MM/yyyy HH:mm"
                                    className="Extrasize"
                                    onChange={(newDate) => {
                                      setDueDate(newDate); // Update your state with the new value
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
                              marginBottom={2}
                            >
                              <Stack spacing={1}>
                                <Typography
                                  variant="subtitle2"
                                  className={findCustomizerequiredLabel(
                                    "wko_mst_flt_code"
                                  )}
                                >
                                  {findCustomizeLabel("wko_mst_flt_code") ||
                                    "Fault Code"}
                                </Typography>
                                <Autocomplete
                                  options={Fault_Code}
                                  value={selected_Fault_Code?.label ?? ""}
                                
                                  onChange={(event, value) => {
                                    handleFaultCodeChange(value);
                                    setErrorField(null); 
                                    setIsFormFiled(true);
                                  }}
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={
                                          errorField === "ast_mst_perm_id"
                                            ? "erroBorderadd"
                                            : ""
                                        }
                                        ref={faultCodeAutocompleteRef}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                            </Box>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                              <Stack spacing={1}>
                                <Typography
                                  variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("wko_mst_descs") ||
                                    "Description..."}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  placeholder="Description..."
                                  minRows={6}
                                  value={Description}
                                 
                                  onChange={(e) => {
                             
                                    const value = e.target.value;
                                    if (value.length <= 2000) {
                                      setDescription(value);
                                    }
                                    setErrorField(null); 
                                    setIsFormFiled(true);
                                    setIsWorkDescEmpty(false);
                                  }}
                                  className={`Extrasize ${
                                    isWorkDescEmpty ? "errorEmpty" : "TxtAra"
                                  }`}
                                />
                              </Stack>
                            </Grid>
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
                                {/* ************************************* img web******************************************* */}

                                <div className="col-md-2">
                                  <div className="row">
                                    <div className="row ImgShowMobile">
                                      <div>
                                        <label htmlFor="upload-button">
                                          {getDbImg && getDbImg.length > 0 ? (
                                            <div>
                                              <img
                                                src={
                                                  getDbImg[0].attachment
                                                    ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}`
                                                    : ""
                                                }
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
                                                src={
                                                  getDbImg[0].attachment
                                                    ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}`
                                                    : ""
                                                }
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

              {/* Asset Work */}
              <div
                className="MainOrderFromGd"
                style={{ backgroundColor: "white" }}
              >
                <Grid container spacing={0}>
                  <Grid xs={12} md={12}>
                    <Card sx={{ padding: "10px 24px 15px 24px" }}>
                      <div style={{ display: "flex" }}>
                        <button
                          className="ToggleBttnIcon"
                          onClick={toggleDivAsset}
                        >
                          <Iconify
                            icon="carbon:user-settings"
                            style={{ marginRight: "2px", width: "20px" }}
                          />{" "}
                          Asset
                          {isOpenAsset ? (
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
                      {isOpenAsset && (
                        <Box
                          rowGap={2}
                          columnGap={2}
                          display="grid"
                          gridTemplateColumns={{
                            xs: "repeat(1, 1fr)",
                            sm: "repeat(2, 1fr)",
                          }}
                        >
                          <Stack spacing={1}>
                            <Typography
                              variant="subtitle2"
                              className="Requiredlabel"
                            >
                              {findCustomizeLabel("wko_mst_assetno") ||
                                "Asset No"}
                            </Typography>
                            <div ref={assetNoAutocompleteRef}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                className={`ExtrasizeDisable ${
                                  isWorkOrderAssetNoEmpty ? "errorEmpty" : ""
                                }`}
                                // ref={assetNoAutocompleteRef}
                                fullWidth
                                value={Asset_No || ""}
                                disabled
                                placeholder="Select..."
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={handleCancelClick}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleEditClick();
                                      setisWorkOrderAssetNoEmpty(false);
                                    }}
                                  />,
                                ]}
                              />
                            </div>
                          </Stack>
                          <Stack spacing={1}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_mst_asset_status"
                              )}
                            >
                              {findCustomizeLabel("wko_mst_asset_status") ||
                                "Asset Status"}
                            </Typography>
                            <Autocomplete
                              options={Asset_Status}
                              value={selected_Asset_Status?.label ?? ""}
                              onChange={handleAssetStatusChange}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className={
                                      errorField === "wko_mst_asset_status"
                                        ? "erroBorderadd"
                                        : ""
                                    }
                                    ref={autocompleteRef}
                                  />
                                </div>
                              )}
                            />
                          </Stack>

                          <Stack spacing={1}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_mst_asset_group_code"
                              )}
                            >
                              {findCustomizeLabel("wko_mst_asset_group_code") ||
                                "Asset Group Code"}
                            </Typography>
                            <Autocomplete
                              options={Asset_Group_Code}
                              value={selected_Asset_Group_Code?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Asset_Group_Code(value || null);
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className={
                                      errorField === "wko_mst_asset_group_code"
                                        ? "erroBorderadd"
                                        : ""
                                    }
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                          <Stack spacing={1}>
                            <Typography
                              variant="subtitle2"
                              className="Requiredlabel"
                            >
                              {findCustomizeLabel("wko_mst_chg_costcenter") ||
                                "Charge Cost Center"}
                            </Typography>
                            <Autocomplete
                              options={Charge_Cost_Center}
                              value={selected_Charge_Cost_Center}
                              onChange={handleChargeCostChange}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className={`Extrasize ${
                                      isChargeCostEmpty ? "errorEmpty" : ""
                                    }`}
                                    ref={autocompleteRef}
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_mst_work_area") ||
                                "Work Area"}
                            </Typography>
                            <Autocomplete
                              options={Work_Area}
                              value={selected_Work_Area}
                              onChange={(event, value) => {
                                setSelected_Work_Area(value || null);
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className="Extrasize"
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_mst_asset_level") ||
                                "Asset Level"}
                            </Typography>
                            <Autocomplete
                              options={Asset_Level}
                              value={selected_Asset_Level}
                              onChange={(event, value) => {
                                setSelected_Asset_Level(value || null);
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_mst_asset_location") ||
                                "Asset Location"}
                            </Typography>
                            <Autocomplete
                              options={Asset_Location}
                              value={selected_Asset_Location}
                              onChange={(event, value) => {
                                setSelected_Asset_Location(value || null);
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className="Extrasize"
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                        </Box>
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
                              icon="fluent-mdl2:financial"
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
                        <Grid item xs={12}>
                          <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_det_corr_action") ||
                                "Corrective Actions"}
                            </Typography>
                            <TextareaAutosize
                              aria-label="empty textarea"
                              placeholder="Corrective Action"
                              value={CorrectiveAction}
                              minRows={6}
                              className="TxtAra"
                              style={{ width: "100%" }} // Make it full-width
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 2000) {
                                  setCorrectiveAction(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                
                              }}
                            />
                          </Stack>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_mst_project_id") ||
                                "Project ID"}
                            </Typography>
                            <Autocomplete
                              options={Project_ID}
                              value={selected_Project_ID?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Project_ID(value);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  onClick={handleClickProjectID}
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_cause_code") ||
                                "Cause Code"}
                            </Typography>
                            <Autocomplete
                              options={Cause_Code}
                              value={selected_Cause_Code?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Cause_Code(value);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_act_code") ||
                                "Action Code"}
                            </Typography>
                            <Autocomplete
                              options={Action_Code}
                              value={selected_Action_Code?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Action_Code(value);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_delay_cd") ||
                                "Delay Code"}
                            </Typography>
                            <Autocomplete
                              options={Delay_Code}
                              value={selected_Delay_Code?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Delay_Code(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_work_type"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_work_type") ||
                                "Work Type"}
                            </Typography>
                            <Autocomplete
                              options={Work_Type}
                              value={selected_Work_Type?.label ?? ""}
                              onChange={(event, value) => {
                                // handleWorkTypeChange();
                                setSelected_Work_Type(value);
                                setErrorField(null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={
                                    errorField === "wko_det_work_type"
                                      ? "erroBorderadd"
                                      : ""
                                  }
                                  ref={autocompleteRef}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_work_class"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_work_class") ||
                                "Work Permit Type"}
                            </Typography>
                            <Autocomplete
                              options={Work_Class}
                              value={selected_Work_Class?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Work_Class(value || null);
                                setErrorField(null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={
                                    errorField === "wko_det_work_class"
                                      ? "erroBorderadd"
                                      : ""
                                  }
                                />
                              )}
                            />
                          </Stack>

                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_work_grp"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_work_grp") ||
                                "Work Group"}
                            </Typography>

                            <Autocomplete
                              options={Work_Group}
                              value={
                                selected_Work_Group !== null &&
                                selected_Work_Group !== ""
                                  ? selected_Work_Group.label
                                  : ""
                              }
                              onChange={handleWorkGroupChange}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  onClick={handleClickSupervisorId}
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={
                                    errorField === "wko_det_work_grp"
                                      ? "erroBorderadd"
                                      : ""
                                  }
                                  ref={autocompleteRef}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_supv_id"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_supv_id") ||
                                "Supervisor ID"}
                            </Typography>
                            <Autocomplete
                              options={Supervisor_ID}
                              value={selected_Supervisor_ID?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Supervisor_ID(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  onClick={handleClickSupervisorId}
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_planner"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_planner") ||
                                "Planner"}
                            </Typography>
                            <Autocomplete
                              options={Planner}
                              value={selected_Planner?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Planner(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  onClick={handleClickPlanner}
                                  variant="outlined"
                                  fullWidth
                                  className={
                                    errorField === "wko_det_planner"
                                      ? "erroBorderadd"
                                      : ""
                                  }
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_approver"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_approver") ||
                                "Approver"}
                            </Typography>
                            <Autocomplete
                              options={Approver}
                              value={selected_Approver?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Approver(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  onClick={handleClickApprover}
                                  variant="outlined"
                                  fullWidth
                                  className={
                                    errorField === "wko_det_approver"
                                      ? "erroBorderadd"
                                      : ""
                                  }
                                />
                              )}
                            />
                          </Stack>

                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_perm_id"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_perm_id") ||
                                "Permanent ID"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              placeholder="Area..."
                              size="small"
                              variant="outlined"
                              value={Permanent_ID}
                              onChange={(e) => {
                                setPermanent_ID(e.target.value);
                                setErrorField(null);
                              }}
                              fullWidth
                              className={
                                errorField === "wko_det_perm_id"
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
                              className="Requiredlabel"
                            >
                              {findCustomizeLabel("wko_mst_orig_priority") ||
                                "Original Periority"}
                            </Typography>
                            <Autocomplete
                              options={Original_Periority}
                              value={selected_Original_Periority?.label ?? ""}
                              onChange={handleOriginalPeriorityChange}
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
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_sched_date"
                              )}
                            >
                              {findCustomizeLabel("wko_det_sched_date") ||
                                "Schedule Date"}
                            </Typography>

                            <DateTimePicker
                              value={DueDate}
                              format="dd/MM/yyyy HH:mm"
                              className={
                                errorField === "wko_det_sched_date"
                                  ? "erroBorderadd"
                                  : "Extrasize"
                              }
                              onChange={(newDate) => {
                                setScheduleDate(newDate); // Update your state with the new value
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
                                "wko_det_exc_date"
                              )}
                            >
                              {findCustomizeLabel("wko_det_exc_date") ||
                                "Exception Date"}
                            </Typography>

                            <DateTimePicker
                              value={ExceptionDate}
                              format="dd/MM/yyyy HH:mm"
                              className={
                                errorField === "wko_det_exc_date"
                                  ? "erroBorderadd"
                                  : "Extrasize"
                              }
                              onChange={(newDate) => {
                                setExceptionDate(newDate); // Update your state with the new value
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
                                "wko_det_sc_date"
                              )}
                            >
                              {findCustomizeLabel("wko_det_sc_date") ||
                                "Status Change Date"}
                            </Typography>

                            <DateTimePicker
                              value={StatusChangeDate}
                              format="dd/MM/yyyy HH:mm"
                              className={
                                errorField === "wko_det_sc_date"
                                  ? "erroBorderadd"
                                  : "Extrasize"
                              }
                              onChange={(newDate) => {
                                setStatusChangeDate(newDate); // Update your state with the new value
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
                                "wko_det_cmpl_date"
                              )}
                            >
                              {findCustomizeLabel("wko_det_cmpl_date") ||
                                "Completion Date"}
                            </Typography>

                            <DateTimePicker
                              value={CompletionDate}
                              format="dd/MM/yyyy HH:mm"
                              className={
                                errorField === "wko_det_cmpl_date"
                                  ? "erroBorderadd"
                                  : "Extrasize"
                              }
                              onChange={(newDate) => {
                                setCompletionDate(newDate);
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
                                "wko_det_clo_date"
                              )}
                            >
                              {findCustomizeLabel("wko_det_clo_date") ||
                                "Close Date"}
                            </Typography>

                            <DateTimePicker
                              value={CloseDate}
                              format="dd/MM/yyyy HH:mm"
                              className={
                                errorField === "wko_det_clo_date"
                                  ? "erroBorderadd"
                                  : "Extrasize"
                              }
                              onChange={(newDate) => {
                                setCloseDate(newDate); // Update your state with the new value
                                setErrorField(null);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Stack>
                          <Stack
                            spacing={1}
                            sx={{
                              pb: 2,
                              display: "flex",
                              flexDirection: "row", // Set the flex direction to row
                              alignItems: "center", // Center items vertically
                              justifyContent: "space-between", // Create space between items
                            }}
                          >
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_det_temp_asset") ||
                                "Temporary Asset"}
                            </Typography>
                            <div className="customlayoutchk">
                              <FormControlLabel
                                control={<Checkbox color="primary" />}
                                checked={Temporary_Asset}
                                onChange={(value) => {
                                  handleOnChangeTemporaryAsset(value);
                                }}
                                labelPlacement="start" // Place the label on the left
                              />
                            </div>
                          </Stack>
                          <Stack
                            spacing={1}
                            sx={{
                              pb: 2,
                              display: "flex",
                              flexDirection: "row", // Set the flex direction to row
                              alignItems: "center", // Center items vertically
                              justifyContent: "space-between", // Create space between items
                            }}
                          >
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_det_approved") ||
                                "Approved"}
                            </Typography>
                            <div className="customlayoutchk">
                              <FormControlLabel
                                control={<Checkbox color="primary" />}
                                checked={Approved}
                                onChange={(value) => {
                                  handleOnChangeApproved(value);
                                }}
                                labelPlacement="start" // Place the label on the left
                              />
                            </div>
                          </Stack>
                          <Stack
                            spacing={1}
                            sx={{
                              pb: 2,
                              display: "flex",
                              flexDirection: "row", // Set the flex direction to row
                              alignItems: "center", // Center items vertically
                              justifyContent: "space-between", // Create space between items
                            }}
                          >
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_det_safety") || "Safety"}
                            </Typography>
                            <div className="customlayoutchk">
                              <FormControlLabel
                                control={<Checkbox color="primary" />}
                                checked={Safety}
                                onChange={(value) => {
                                  handleOnChangeSafety(value);
                                }}
                                labelPlacement="start" // Place the label on the left
                              />
                            </div>
                          </Stack>
                          <Stack
                            spacing={1}
                            sx={{
                              pb: 2,
                              display: "flex",
                              flexDirection: "row", // Set the flex direction to row
                              alignItems: "center", // Center items vertically
                              justifyContent: "space-between", // Create space between items
                            }}
                          >
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_det_wo_open") ||
                                "WO Open"}
                            </Typography>
                            <div className="customlayoutchk">&nbsp;Y</div>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box
                            rowGap={2}
                            columnGap={1}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "85%",
                              sm: "85% 10%",
                            }}
                          >
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2">
                                {findCustomizeLabelDet("wko_det_assign_to") ||
                                  "Assign To"}
                              </Typography>
                              <Autocomplete
                                options={Assign_To}
                                value={selected_Assign_To?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Assign_To(value || null);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    onClick={handleClickAssignTo}
                                    variant="outlined"
                                    style={{ width: "100%" }}
                                    fullWidth // Make it full-width
                                  />
                                )}
                              />
                            </Stack>
                            <Tooltip
                              title="Assign To Audit"
                              placement="right"
                              className="tooltipRhtAssign"
                              disabled={Button_save == "Save"}
                            >
                              <IconButton>
                                <Iconify
                                  icon="pajamas:status-alert"
                                  onClick={AssignStatushandleshow}
                                />
                              </IconButton>
                            </Tooltip>
                          </Box>

                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_wr_no") ||
                                "Work Request No"}
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
                              {findCustomizeLabelDet("wko_det_wr_due_date") ||
                                "WR Due Date"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              disabled
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_parent_wo") ||
                                "Parent WO"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              disabled
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_wr_org_date") ||
                                "WR Origination Date"}
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
                      {/* //chkFrm  financial */}

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_customer_cd") ||
                                "Customer Code"}
                            </Typography>
                            <Autocomplete
                              options={Customer_Code}
                              value={selected_Customer_Code?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Customer_Code(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  onClick={handleClickCustomerCode}
                                  variant="outlined"
                                  placeholder="Select..."
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet(
                                "wko_det_crd_costcenter"
                              ) || "Credit Cost Center"}
                            </Typography>
                            <Autocomplete
                              options={Credit_Cost_Center}
                              value={selected_Credit_Cost_Center?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Credit_Cost_Center(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="outlined"
                                  placeholder="Select..."
                                  onClick={handleClickCostCenter}
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_laccount") ||
                                "Labor Account"}
                            </Typography>
                            <Autocomplete
                              options={Labor_Account}
                              value={selected_Labor_Account?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Labor_Account(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  onClick={handleClickLaborAccount}
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_caccount") ||
                                "Contract Account"}
                            </Typography>
                            <Autocomplete
                              options={Contract_Account}
                              value={selected_Contract_Account?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Contract_Account(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="outlined"
                                  placeholder="Select..."
                                  onClick={handleClickContractAccount}
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_maccount") ||
                                "Material Account"}
                            </Typography>
                            <Autocomplete
                              options={Material_Account}
                              value={selected_Material_Account?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Material_Account(value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="outlined"
                                  placeholder="Select..."
                                  onClick={handleClickMaterialAccount}
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_saccount") ||
                                "Miscellaneous Account"}
                            </Typography>
                            <Autocomplete
                              options={Miscellaneous_Account}
                              value={
                                selected_Miscellaneous_Account?.label ?? ""
                              }
                              onChange={(event, value) => {
                                setSelected_Miscellaneous_Account(
                                  value || null
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="outlined"
                                  placeholder="Select..."
                                  onClick={handleClickMiscellaneousAccount}
                                  fullWidth // Make it full-width
                                />
                              )}
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
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_note1") ||
                                "Note1"}
                            </Typography>
                            <TextareaAutosize
                              aria-label="empty textarea"
                              placeholder="Note1..."
                              defaultValue={UDFNote1}
                              minRows={6}
                              className="TxtAra"
                              style={{ width: "100%" }} // Make it full-width
                              
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 1000) {
                                  setUDFNote1(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar1") ||
                                "Varchar1"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_1}
                             
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_1(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar2") ||
                                "Varchar2"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_2}
                             
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_2(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar3") ||
                                "Varchar3"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_3}
                             
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_3(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar4") ||
                                "Varchar4"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_4}
                             
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_4(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar5") ||
                                "Varchar5"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_5}
                              
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_5(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar6") ||
                                "Varchar6"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_6}
                             
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_6(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar7") ||
                                "Varchar7"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_7}
                              
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_7(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar8") ||
                                "Varchar8"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              variant="outlined"
                              fullWidth
                              defaultValue={UDFText_8}
                             
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_8(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar9") ||
                                "Varchar9"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_9}
                             
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_9(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar10") ||
                                "Varchar10"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              defaultValue={UDFText_10}
                            
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_10(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_numeric1") ||
                                "Numeric1"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              value={UDFNumber_1}
                              
                              onChange={(e) => {
                                
                                handleNumericInputChange(e, setUDFNumber_1);
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_numeric2") ||
                                "Numeric2"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              value={UDFNumber_2}
                              
                              onChange={(e) => {
                                
                                handleNumericInputChange(e, setUDFNumber_2);
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_numeric3") ||
                                "Numeric3"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              value={UDFNumber_3}
                             
                              onChange={(e) => {
                                
                                handleNumericInputChange(e, setUDFNumber_3);
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_numeric4") ||
                                "Numeric4"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              value={UDFNumber_4}
                              onChange={(e) => {
                                
                                handleNumericInputChange(e, setUDFNumber_4);
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_numeric5") ||
                                "Numeric5"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              value={UDFNumber_5}
                             
                              onChange={(e) => {
                                
                                handleNumericInputChange(e, setUDFNumber_5);
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_det_datetime1") ||
                                "Date1"}
                            </Typography>

                            <DateTimePicker
                              value={UDFDate_1}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_1(newDate);
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
                              {findCustomizeLabel("wko_det_datetime2") ||
                                "Date2"}
                            </Typography>

                            <DateTimePicker
                              // defaultValue={UDFDate_1}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_2(newDate);
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
                              {findCustomizeLabel("wko_det_datetime3") ||
                                "Date3"}
                            </Typography>

                            <DateTimePicker
                              // defaultValue={UDFDate_1}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_3(newDate);
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
                              {findCustomizeLabel("wko_det_datetime4") ||
                                "Date4"}
                            </Typography>

                            <DateTimePicker
                              // defaultValue={UDFDate_1}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_4(newDate);
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
                              {findCustomizeLabel("wko_det_datetime5") ||
                                "Date5"}
                            </Typography>

                            <DateTimePicker
                              // defaultValue={UDFDate_1}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              onChange={(newDate) => {
                                setUDFDate_5(newDate);
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
                      hidden={Tabvalue !== 3}
                      sx={{ marginTop: "16px" }}
                    >
                      {RowID && (
                        <WorkOrderSpecialOrder
                          data={{
                            RowID: RowID,
                            WorkOrderNo: WorkOrderNo,
                            Asset_No: Asset_No,
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
                      )}
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 5}
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
                                          src={
                                            RefImg[0].attachment
                                              ? `${httpCommon.defaults.baseURL}${RefImg[0].attachment}`
                                              : ""
                                          }
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
                                        src={
                                          RefImg[0].attachment
                                            ? `${httpCommon.defaults.baseURL}${RefImg[0].attachment}`
                                            : ""
                                        }
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
                                      // src={selectedImage}
                                      src={
                                        selectedImage
                                          ? `${httpCommon.defaults.baseURL}${selectedImage}`
                                          : ""
                                      }
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
                      hidden={Tabvalue !== 6}
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
                          {Button_save}
                        </Button>
                        <Button
                          variant="soft"
                          color="error"
                          onClick={onClickCancel}
                          startIcon={<Iconify icon="jam:close" />}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
              {/* Asset model popup */}
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
                  Select Asset No
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
                    <WorkOrderAssetNo
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
                    Work Order Status Audit
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
                            label6,
                            
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
                                  {label6} ({label1})
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
              {/********************* Assign To  *************************/}

              <div>
                <BootstrapDialog
                  onClose={AssignStatushandleClose}
                  aria-labelledby="customized-dialog-title"
                  open={AssignStatusShow}
                  maxWidth="lg"
                  fullWidth
                >
                  <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    className="dailogTitWork"
                  >
                    Assign History
                  </DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={AssignStatushandleClose}
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
                        {AssignStatusToOther.map(
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
                                  left: "-90px",
                                  top: "0px",
                                  width: "80px",
                                  height: "20px",
                                  borderRadius: "5%",
                                  textAlign: "right",
                                }}
                              >
                                {label4}
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
                                  {label}
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
                                  style={{
                                    fontSize: "12px",
                                    color: "grey",
                                    fontWeight: "600",
                                  }}
                                >
                                  {label1}
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
              <BootstrapDialog
                onClose={CommenthandleClose}
                aria-labelledby="customized-dialog-title"
                open={CommentShow}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{
                    m: 0,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Iconify
                      icon="quill:chat"
                      style={{
                        fontSize: "24px",
                        verticalAlign: "middle",
                        marginRight: "5px",
                      }}
                    />
                    <span style={{ fontSize: "16px", verticalAlign: "middle" }}>
                      Work Order Comment
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <IconButton
                      aria-label="close"
                      onClick={Refreshdatapopup}
                      sx={{
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <Iconify icon="tabler:refresh" />
                    </IconButton>
                    <IconButton
                      aria-label="close"
                      onClick={CommenthandleClose}
                      sx={{
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <Iconify icon="ic:baseline-close" />
                    </IconButton>
                  </div>
                </DialogTitle>

                <DialogContent dividers>
                  <div className="chat-container">
                    <div className="menud" ref={chatContainerRef}>
                      <ol className="chatd">
                        {loading ? (
                          <li>Loading...</li>
                        ) : (
                          AllCommnet.map((item, index) => (
                            <li
                              key={index}
                              className={`messagedd ${
                                item.wko_ls11_name === emp_mst_name
                                  ? "self2"
                                  : "other2"
                              }`}
                            >
                              <div
                                className={`avatar2 ${
                                  item.wko_ls11_name === emp_mst_name
                                    ? "top-left"
                                    : "bottom-right"
                                }`}
                              >
                                <span>
                                  {item.wko_ls11_name
                                    ? item.wko_ls11_name.charAt(0)
                                    : "?"}
                                </span>
                              </div>
                              <div className="msg2">
                                <div className="msfcls">
                                  <p className="usrName">
                                    <span>{item.wko_ls11_name}</span>
                                  </p>
                                  <p className="msgP">
                                    {Moment(item.audit_date.date).format(
                                      "DD/MM/YYYY HH:mm"
                                    )}
                                  </p>
                                  {item.full_size_link ? (
                                    <img
                                      src={item.full_size_link}
                                      alt="Comment Img"
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        marginBottom: "10px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  ) : item.attachment ? (
                                    <img
                                      src={`data:image/png;base64,${item.attachment}`}
                                      alt="Comment Img"
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        marginBottom: "10px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  ) : null}

                                  <p className="commentTxt">
                                    {item.wko_ls11_sts_upd && (
                                      <p>{item.wko_ls11_sts_upd}</p>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))
                        )}
                      </ol>
                    </div>
                    <div className="input-container">
                      <label htmlFor="file-upload" className="upload-icon">
                        <Iconify icon="fa:camera" />
                      </label>
                      <input
                        type="file"
                        id="file-upload"
                        ref={fileInputRef2}
                        style={{ display: "none" }}
                        onChange={handleImageChange2}
                      />

                      {imagePreview && (
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={imagePreview}
                            alt="Uploaded Preview"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50px",
                              marginRight: "5px",
                              cursor: "pointer",
                            }}
                            onClick={handleImageClickSHow}
                          />

                          {/* Close icon */}
                          <div
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              cursor: "pointer",
                              padding: "1px",
                              background: "rgba(255, 255, 255, 0.7)",
                              borderRadius: "50%",
                              width: "21px",
                              height: "22px",
                            }}
                            onClick={handleUploadCloseClick}
                          >
                            <Iconify icon="carbon:close-outline" />
                          </div>
                        </div>
                      )}

                      <input
                        type="text"
                        className="text_input"
                        placeholder="Comment..."
                        disabled={!!imagePreview}
                        ref={messageRef}
                      />
                      {selectedImage && (
                        <div className="upImgCntr">
                          <img
                            src={`data:image/png;base64,${selectedImage}`}
                            alt="Selected Image"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                          />
                        </div>
                      )}
                      <button
                        type="submit"
                        className="submit-button"
                        onClick={handleSubmitCmmnt}
                      >
                        <Iconify icon="fa:send" />
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </BootstrapDialog>

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
    </>
  );
}

WordOrderNewForm.propTypes = {
  currentUser: PropTypes.object,
};

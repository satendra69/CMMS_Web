import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Container from "@mui/material/Container";
// @bootstrap

import TextareaAutosize from "@mui/material/TextareaAutosize";
import AddLogInDialog from "../Form/LoginId/AddLogInDialog";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import IconButton from "@mui/material/IconButton";

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
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Unstable_Grid2";

import Checkbox from "@mui/material/Checkbox";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "moment";
import {
  faTimes,
  faPenToSquare,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// utils
import { fData } from "src/utils/format-number";
// routes
import { RouterLink } from "src/routes/components";
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { IoAddCircleSharp } from "react-icons/io5";
// components
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";
import refrencImg from "../specification.png";
import APIServices from "src/services/APIServices";
import DetailsSection from "../component_module/DetailsSection";
import MasterDialogEmployee from "./MasterDialogEmployee";
import MaintenceSection from "../component_module/MaintenceSection";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import { now } from "lodash";
import { format } from "date-fns";
import { Tooltip } from "@mui/material";
import PrSection from "./PrApprove/PrSection";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
// ----------------------------------------------------------------------

export default function EmployeForm({ currentUser }) {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
  const location = useLocation();

  const { state } = location;
  const [mandatoryFields, setMandatoryFields] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [showEmpl, setShowEmpl] = useState(true);

  const [imguploadStatus, setImguploadStatus] = useState("");
  const [imguploadRefStatus, setImguploadRefStatus] = useState("");
  const searchParams = new URLSearchParams(location.search);

  const Ast_no = searchParams.get("ast_no");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const settings = useSettingsContext();
  const [errorField, setErrorField] = useState(null);
  // default modal

  // Visible Hidden state
  const [visible, setVisible] = useState({
    pr: false,
    mr: false,
    sl: false,
  });

  const [maintenance, setMaintence] = useState([]);

  // maintenance function

  const addMaintenanceForm = async (inserted_id) => {
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

    const json = {
      maintenance,
      site_cd: site_ID,
      mst_RowID: inserted_id,
      audit_user: emp_mst_login_id,
    };
    try {
      // const response = await httpCommon.post(
      //   "/insert_new_emp_maintenance.php",json
      // );
      const response = await httpCommon.post(
        "/insert_new_emp_maintenance.php",
        json
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  // update maintense
  const updateMaintenanceForm = async (inserted_id) => {
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

    const json = {
      maintenance,
      site_cd: site_ID,
      mst_RowID: inserted_id,
      audit_user: emp_mst_login_id,
    };

    try {
      const response = await httpCommon.post(
        "/update_emp_maintenance.php",
        json
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const [PRData, setPRData] = useState({});

  const [checkboxData, setCheckboxData] = useState({
    emp_det_mr_approver: 0,
    emp_det_pr_approver: 0,
    emp_det_wo_budget_approver: 0,
    emp_det_wr_approver: 0,
    emp_det_planner: 0,
    emp_det_wo_gen_mr_pr: 0,
    emp_det_pm_generator: 0,
    emp_det_time_card_enter: 0,
    emp_det_time_card_void: 0,
    emp_det_core: 0,
    emp_det_wo_sched: 0,
    emp_det_po_buyer: 0,
    emp_det_supervisor: 0,
    emp_det_foreman: 0,
    emp_det_asset_tag_flag: 0,
    emp_det_checklist: 0,
    emp_det_mobile: 0,
    emp_det_supervisor_id: 0,
    emp_det_webwork: 0,
  });

  const handleCheckboxData = (e) => {
    setCheckboxData((pre) => ({
      ...pre,
      [e.target.name]: e.target.checked,
    }));
  };

  const [wkrMstLabel, setWkrMstLabel] = useState([]);
  const [wkrdetLabel, setWkrDetLabel] = useState([]);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [imageSelect, setImageSelect] = useState({ name: "", path: "" });
  const [getDbImg, setDbImg] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [showdd2, setShowdd2] = useState(false);
  const handleClosedd2 = () => setShowdd2(false);
  const [Button_save, setButton_save] = useState("");
  const [edited, setEdited] = useState(false);
  const [WorkRequestNo, setWorkRequestNo] = useState("");
  const [WorkRequestNo_disabled, setWorkRequestNo_disabled] = useState(false);
  const [ApprovalStatus, setApprovalStatus] = useState("");
  const [ApprovalStatus_disabled, setApprovalStatus_disabled] = useState(false);
  const [Charge_Cost_Center, setCharge_Cost_Center] = useState([]);
  const [selected_Charge_Cost_Center, setSelected_Charge_Cost_Center] =
    useState([]);
  const [Asset_No, setAsset_No] = useState([]);
  const [selected_Asset_No, setSelected_Asset_No] = useState([]);
  const [Asset_Location, setAsset_Location] = useState([]);
  const [selected_Asset_Location, setSelected_Asset_Location] = useState([]);
  const [OriginalPriority, setOriginalPriority] = useState([]);
  const [selected_OriginalPriority, setSelected_OriginalPriority] = useState(
    []
  );

  const queryParams = new URLSearchParams(location.search);
  const RowID = queryParams.get("rowID");

  const [Level, setLevel] = useState([]);
  const [selected_Level, setSelected_Level] = useState([]);
  const [OriginationDate, setOriginationDate] = useState(new Date());
  const [WorkType, setWorkType] = useState([]);
  const [selected_WorkType, setSelected_WorkType] = useState([]);
  const [DueDate, setDueDate] = useState(new Date());
  const [WorkClass, setWorkClass] = useState([]);
  const [selected_WorkClass, setSelected_WorkClass] = useState([]);
  const [Work_Group, setWork_Group] = useState([]);
  const [selected_Work_Group, setSelected_Work_Group] = useState([]);
  const [Work_Area, setWork_Area] = useState([]);
  const [selected_Work_Area, setSelected_Work_Area] = useState([]);
  const [ProjectID, setProjectID] = useState([]);
  const [selected_ProjectID, setSelected_ProjectID] = useState([]);
  const [Phone, setPhone] = useState("");
  const [Originator, setOriginator] = useState([]);
  const [selected_Originator, setSelected_Originator] = useState([]);
  const [FaultCode, setFaultCode] = useState([]);
  const [selected_FaultCode, setSelected_FaultCode] = useState([]);
  const [Description, setDescription] = useState("");
  const [UDFNote1, setUDFNote1] = useState("");
  const [UDFNote2, setUDFNote2] = useState("");
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

  const [UDFNumber_1, setUDFNumber_1] = useState(0);
  const [UDFNumber_2, setUDFNumber_2] = useState(0);
  const [UDFNumber_3, setUDFNumber_3] = useState(0);
  const [UDFNumber_4, setUDFNumber_4] = useState(0);
  const [UDFNumber_5, setUDFNumber_5] = useState(0);
  const [UDFNumber_6, setUDFNumber_6] = useState(0);
  const [UDFNumber_7, setUDFNumber_7] = useState(0);
  const [UDFNumber_8, setUDFNumber_8] = useState(0);
  const [UDFNumber_9, setUDFNumber_9] = useState(0);
  const [UDFNumber_10, setUDFNumber_10] = useState(0);

  const [UDFDate_1, setUDFDate_1] = useState("");
  const [UDFDate_2, setUDFDate_2] = useState("");
  const [UDFDate_3, setUDFDate_3] = useState("");
  const [UDFDate_4, setUDFDate_4] = useState("");
  const [UDFDate_5, setUDFDate_5] = useState("");
  const [UDFDate_6, setUDFDate_6] = useState("");
  const [UDFDate_7, setUDFDate_7] = useState("");
  const [UDFDate_8, setUDFDate_8] = useState("");
  const [UDFDate_9, setUDFDate_9] = useState("");
  const [UDFDate_10, setUDFDate_10] = useState("");

  const [ApprovedBy, setApprovedBy] = useState("");
  const [ApprovedDate, setApprovedDate] = useState(new Date());
  const [WorkOrderNo, setWorkOrderNo] = useState("");
  const [WorkStatus, setWorkStatus] = useState("");

  const [RejectedBy, setRejectedBy] = useState("");
  const [RejectedDate, setRejectedDate] = useState(new Date());
  const [RejectedDescription, setRejectedDescription] = useState("");

  const [ParentFlag, setParentFlag] = useState(false);
  const [selected_ParentFlag, setselected_ParentFlag] = useState("");
  const [columns, setcolumns] = useState([]);

  const [Tabvalue, setTabValue] = useState(0);
  const [filteredDataSource, setFilteredDataSource] = React.useState([]);
  const [name, setName] = useState("");
  const [ParentFlag_show, setParentFlag_Show] = useState(false);

  const [ApproveShow, setApproveShow] = useState(false);
  const ApprovehandleClose = () => setApproveShow(false);
  const ApprovehandleShow = () => setApproveShow(true);

  const [DisapproveShow, setDisapproveShow] = useState(false);
  const DisapprovehandleClose = () => setDisapproveShow(false);
  const DisapprovehandleShow = () => setDisapproveShow(true);

  const ParentFlag_handleClose = () => setParentFlag_Show(false);
  const ParentFlag_handleShow = () => setParentFlag_Show(true);

  const [AutoNumring, setAutoNumring] = useState("");

  // autocomplete state
  const [Status, setStatus] = useState([]);
  const [loginData, setLogin] = useState([]);
  const [usrGroup, setUsrGroup] = useState([]);
  const [craft, setCraft] = useState([]);
  const [workArea, setWorkArea] = useState([]);
  const [workGrp, setWorkGrp] = useState([]);
  const [superVisior, setSuperVisior] = useState([]);

  const [selected_Status, setSelected_Status] = useState([]);

  const [showApproveButton, setShowApproveButton] = useState(false);
  const handleCloseApproveButton = () => setShowApproveButton(false);
  const handleShowApproveButton = () => setShowApproveButton(true);
  const [Button_submit, setButton_submit] = useState("");
  const [RefImg, setRefImg] = useState([]);
  const [removedRefItems, setRemovedRefItems] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedPdfFiles, setSelectedPdfFiles] = useState([]);
  const [selectedImages2, setSelectedImages2] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [showdd, setShowdd] = useState(false);
  const [handalImg, sethandalImg] = useState({});
  const handleClosedd = () => setShowdd(false);
  const [getDbImgRowId, setDbImgRowId] = useState("");
  const fileInputRef = useRef(null);
  const [showErrorBorder, setShowErrorBorder] = useState(false);
  const [dialogNew, setDialogNew] = useState(false);
  const [refetch, setRefetch] = useState(false);
  // auto complete fields

  // Master Dialog
  const [DefaultModal, setDefaultModal] = useState(false);
  const [textField, setTextField] = useState("");
  const [data, setData] = useState({
    emp_mst_status: "",
    emp_mst_login_id: "",
    emp_mst_usr_grp: "",
    emp_det_craft: "",
    emp_det_work_area: "",
    emp_det_work_grp: "",
    emp_det_supervisor_id: "",
  });

  const [date, setDate] = useState({
    emp_mst_date_of_birth: "",
    emp_mst_dateofhire: "",
  });

  // shift
  const [shift, setShift] = useState([
    { label: "Morning", value: "M" },
    { label: "Afternoon", value: "L" },
    { label: "Evening", value: "E" },
  ]);
  const [selectedShift, setSelectedShift] = useState([]);

  const [payPeriod, setPayPeriod] = useState([
    { label: "BDCM STAFF", value: "BDCM STAFF" },
    { label: "LIMIT", value: "LIMIT" },
    { label: "CUSTOMER", value: "CUSTOMER" },
  ]);
  const [selectedPayPeriod, setSelectedPayPeriod] = useState([]);

  const [sex, setSex] = useState([
    { label: "MALE", value: "M" },
    { label: "FEMALE", value: "F" },
  ]);
  const [selectedSex, setSelectedSex] = useState([]);

  const [dashboardAcess, setdashboardAcess] = useState([
    { label: "Gauge Dashboard", value: "Gauge Dashboard" },
    { label: "KPI Dashboard", value: "KPI Dashboard" },
  ]);
  const [selectedDashboardAcess, setselectedDashboardAcess] = useState([]);

  const [mstatus, setMstatus] = useState([
    { label: "Single", value: "S" },
    { label: "Married", value: "M" },
    { label: "Divorced", value: "D" },
  ]);
  const [selectedMstatus, setselectedMstatus] = useState([]);
  const [tableData, setTableData] = useState([]);

  // Master Dialog End
  const [textFields, setTextFields] = useState({
    emp_mst_emg_name: "",
    emp_mst_emg_phone: "",
    emp_mst_empl_id: "",
    emp_mst_homephone: "",
    emp_mst_name: "",
    emp_mst_payrate: 0,
    emp_mst_remarks: "",
    emp_mst_title: "",
    emp_det_mr_limit: 0,
    emp_det_pr_approval_limit: 0,
    emp_det_wo_approval_limit: 0,
  });

  const filterDesc = (status) => {
    const response = Status.find((item) => item.emp_sts_status === status);
    if (response) {
      return response.emp_sts_status + " : " + response.emp_sts_typ_cd;
    } else {
      return "";
    }
  };

  const filterLogin = (status) => {
    const response = loginData.find((item) => item.empl_id === status);
    console.log("loginId", response);
    if (response) {
      return response.empl_id + " : " + response.name;
    } else {
      return "";
    }
  };

  const filterUsrGroup = (status) => {
    console.log("userGroup", usrGroup, "status", status);
    const response = usrGroup.find((item) => item.empl_id === status);
    console.log("loginId", response);
    if (response) {
      return response.empl_id + " : " + response.name;
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (RowID && state && state.row) {
      const fetchMaintence = async () => {
        const response = await httpCommon.get(
          "/get_emp_maintense.php?RowId=" + RowID
        );

        if (response.data.status === "SUCCESS") {
          setMaintence(response.data.data);
        }
      };
      fetchMaintence();
    }
  }, [RowID]);

  useEffect(() => {
    if (RowID && state && state.row) {
      const rowData = state.row;

      setData((pre) => ({
        ...data,
        emp_mst_status: filterDesc(rowData.emp_mst_status),
        // emp_mst_status:rowData.emp_mst_status,
        emp_mst_login_id: filterLogin(rowData.emp_mst_login_id),
        emp_mst_usr_grp: filterUsrGroup(rowData.emp_mst_usr_grp),
        emp_det_craft: rowData.emp_det_craft,
        emp_det_work_area: rowData.emp_det_work_area,
        emp_det_work_grp: rowData.emp_det_work_grp,
        emp_det_supervisor_id: rowData.emp_det_supervisor_id,
      }));
      setTextFields((pre) => ({
        ...pre,
        emp_mst_emg_name: rowData.emp_mst_emg_name
          ? rowData.emp_mst_emg_name
          : "",
        emp_mst_emg_phone: rowData.emp_mst_emg_phone
          ? rowData.emp_mst_emg_phone
          : "",
        emp_mst_empl_id: rowData.emp_mst_empl_id ? rowData.emp_mst_empl_id : "",
        emp_mst_homephone: rowData.emp_mst_homephone
          ? rowData.emp_mst_homephone
          : "",
        emp_mst_name: rowData.emp_mst_name ? rowData.emp_mst_name : "",
        emp_mst_payrate: rowData.emp_mst_payrate ? rowData.emp_mst_payrate : 0,
        emp_mst_remarks: rowData.emp_mst_remarks ? rowData.emp_mst_remarks : "",
        emp_mst_title: rowData.emp_mst_title ? rowData.emp_mst_title : "",
        emp_mst_payrate: rowData.emp_mst_payrate ? rowData.emp_mst_payrate : 0,
        emp_det_pr_approval_limit: rowData.emp_det_pr_approval_limit
          ? rowData.emp_det_pr_approval_limit
          : 0,
        emp_det_wo_approval_limit: rowData.emp_det_wo_approval_limit
          ? rowData.emp_det_wo_approval_limit
          : 0,
        emp_det_mr_limit: rowData.emp_det_mr_limit
          ? rowData.emp_det_mr_limit
          : 0,
        emp_det_email_id: rowData.emp_det_email_id
          ? rowData.emp_det_email_id
          : "",
      }));

      setCheckboxData((pre) => ({
        ...checkboxData,
        emp_det_mr_approver: rowData.emp_det_mr_approver
          ? rowData.emp_det_mr_approver
          : 0,
        emp_det_pr_approver: rowData.emp_det_pr_approver
          ? rowData.emp_det_pr_approver
          : 0,
        emp_det_wo_budget_approver: rowData.emp_det_wo_budget_approver
          ? rowData.emp_det_wo_budget_approver
          : 0,
        emp_det_wr_approver: rowData.emp_det_wr_approver
          ? rowData.emp_det_wr_approver
          : 0,
        emp_det_planner: rowData.emp_det_planner ? rowData.emp_det_planner : 0,
        emp_det_wo_gen_mr_pr: rowData.emp_det_wo_gen_mr_pr
          ? rowData.emp_det_wo_gen_mr_pr
          : 0,
        emp_det_pm_generator: rowData.emp_det_pm_generator
          ? rowData.emp_det_pm_generator
          : 0,
        emp_det_time_card_enter: rowData.emp_det_time_card_enter
          ? rowData.emp_det_time_card_enter
          : 0,
        emp_det_time_card_void: rowData.emp_det_time_card_void
          ? rowData.emp_det_time_card_void
          : 0,
        emp_det_core: rowData.emp_det_core ? rowData.emp_det_core : 0,
        emp_det_wo_sched: rowData.emp_det_wo_sched
          ? rowData.emp_det_wo_sched
          : 0,
        emp_det_po_buyer: rowData.emp_det_po_buyer
          ? rowData.emp_det_po_buyer
          : 0,
        emp_det_supervisor: rowData.emp_det_supervisor
          ? rowData.emp_det_supervisor
          : 0,
        emp_det_foreman: rowData.emp_det_foreman ? rowData.emp_det_foreman : 0,
        emp_det_asset_tag_flag: rowData.emp_det_asset_tag_flag
          ? rowData.emp_det_asset_tag_flag
          : 0,
        emp_det_checklist: rowData.emp_det_checklist
          ? rowData.emp_det_checklist
          : 0,
        emp_det_mobile: rowData.emp_det_mobile ? rowData.emp_det_mobile : 0,
        emp_det_supervisor_id: rowData.emp_det_supervisor_id
          ? rowData.emp_det_supervisor_id
          : 0,
        emp_det_webwork: rowData.emp_det_webwork ? rowData.emp_det_webwork : 0,
        emp_det_msetup_mobile_user: rowData.emp_det_msetup_mobile_user
          ? rowData.emp_det_msetup_mobile_user
          : 0,
      }));
      setShowEmpl(false);

      setDate((pre) => ({
        ...pre,
        // emp_mst_date_of_birth:rowData && rowData.emp_mst_date_of_birth && rowData.emp_mst_date_of_birth.date?new Date(rowData.emp_mst_date_of_birth.date):"",
        // emp_mst_dateofhire:rowData && rowData.emp_mst_dateofhire && rowData.emp_mst_dateofhire.date?new Date(rowData.emp_mst_dateofhire.date):"",

        emp_mst_date_of_birth:
          rowData &&
          rowData.emp_mst_date_of_birth &&
          rowData.emp_mst_date_of_birth.date
            ? rowData.emp_mst_date_of_birth.date
            : "",
        emp_mst_dateofhire:
          rowData &&
          rowData.emp_mst_dateofhire &&
          rowData.emp_mst_dateofhire.date
            ? rowData.emp_mst_dateofhire.date
            : "",
      }));

      setSelectedPayPeriod((pre) => ({
        label:
          rowData && rowData.emp_mst_pay_period
            ? rowData.emp_mst_pay_period
            : "",
        value:
          rowData && rowData.emp_mst_pay_period
            ? rowData.emp_mst_pay_period
            : "",
      }));
      if (rowData.emp_mst_marital_status === "M") {
        setselectedMstatus({
          label: "Married",
          value: "M",
        });
      }
      if (rowData.emp_mst_marital_status === "S") {
        setselectedMstatus({
          label: "Single",
          value: "S",
        });
      }
      if (rowData.emp_mst_marital_status === "D") {
        setselectedMstatus({
          label: "Divorced",
          value: "D",
        });
      }

      // shift
      if (rowData.emp_det_shift === "L") {
        setSelectedShift({
          label: "Afternoon",
          value: "D",
        });
      }

      if (rowData.emp_det_shift === "M") {
        setSelectedShift({
          label: "Morning",
          value: "M",
        });
      }

      if (rowData.emp_det_shift === "E") {
        setSelectedShift({
          label: "Evening",
          value: "E",
        });
      }

      // dashboard gauge
      setselectedDashboardAcess({
        label:
          rowData && rowData.emp_mst_dash_access
            ? rowData.emp_mst_dash_access
            : "",
        value:
          rowData && rowData.emp_mst_dash_access
            ? rowData.emp_mst_dash_access
            : "",
      });

      if (rowData.emp_mst_sex === "M") {
        setSelectedSex({
          label: "Male",
          value: "M",
        });
      }
      if (rowData.emp_mst_sex === "F") {
        setSelectedSex({
          label: "FEMALE",
          value: "F",
        });
      }

      // UDF TEXT AND NUM
      setUDFNote2(rowData.emp_det_note2);
      setUDFNote1(rowData.emp_det_note1);
      setUDFText_1(rowData.emp_det_varchar1);
      setUDFText_2(rowData.emp_det_varchar2);
      setUDFText_3(rowData.emp_det_varchar3);
      setUDFText_4(rowData.emp_det_varchar4);
      setUDFText_5(rowData.emp_det_varchar5);
      setUDFText_6(rowData.emp_det_varchar6);
      setUDFText_7(rowData.emp_det_varchar7);
      setUDFText_8(rowData.emp_det_varchar8);
      setUDFText_9(rowData.emp_det_varchar9);
      setUDFText_10(rowData.emp_det_varchar10);
      setUDFText_11(rowData.emp_det_varchar11);
      setUDFText_12(rowData.emp_det_varchar12);
      setUDFText_13(rowData.emp_det_varchar13);
      setUDFText_14(rowData.emp_det_varchar14);
      setUDFText_15(rowData.emp_det_varchar15);
      setUDFText_16(rowData.emp_det_varchar16);
      setUDFText_17(rowData.emp_det_varchar17);
      setUDFText_18(rowData.emp_det_varchar18);
      setUDFText_19(rowData.emp_det_varchar19);
      setUDFText_20(rowData.emp_det_varchar20);
      setUDFNumber_1(rowData.emp_det_numeric1);
      setUDFNumber_2(rowData.emp_det_numeric2);
      setUDFNumber_3(rowData.emp_det_numeric3);
      setUDFNumber_4(rowData.emp_det_numeric4);
      setUDFNumber_5(rowData.emp_det_numeric5);
      setUDFNumber_6(rowData.emp_det_numeric6);
      setUDFNumber_7(rowData.emp_det_numeric7);
      setUDFNumber_8(rowData.emp_det_numeric8);
      setUDFNumber_9(rowData.emp_det_numeric9);
      setUDFNumber_10(rowData.emp_det_numeric10);
      setUDFDate_1(
        rowData && rowData.emp_det_datetime1 && rowData.emp_det_datetime1.date
          ? rowData.emp_det_datetime1.date
          : ""
      );
      setUDFDate_2(
        rowData && rowData.emp_det_datetime2 && rowData.emp_det_datetime2.date
          ? rowData.emp_det_datetime2.date
          : ""
      );
      setUDFDate_3(
        rowData && rowData.emp_det_datetime3 && rowData.emp_det_datetime3.date
          ? rowData.emp_det_datetime3.date
          : ""
      );
      setUDFDate_4(
        rowData && rowData.emp_det_datetime4 && rowData.emp_det_datetime4.date
          ? rowData.emp_det_datetime4.date
          : ""
      );
      setUDFDate_5(
        rowData && rowData.emp_det_datetime5 && rowData.emp_det_datetime5.date
          ? rowData.emp_det_datetime5.date
          : ""
      );
      setUDFDate_6(
        rowData && rowData.emp_det_datetime6 && rowData.emp_det_datetime6.date
          ? rowData.emp_det_datetime6.date
          : ""
      );
      setUDFDate_7(
        rowData && rowData.emp_det_datetime7 && rowData.emp_det_datetime7.date
          ? rowData.emp_det_datetime7.date
          : ""
      );
      setUDFDate_8(
        rowData && rowData.emp_det_datetime8 && rowData.emp_det_datetime8.date
          ? rowData.emp_det_datetime8.date
          : ""
      );
      setUDFDate_9(
        rowData && rowData.emp_det_datetime9 && rowData.emp_det_datetime9.date
          ? rowData.emp_det_datetime9.date
          : ""
      );
      setUDFDate_10(
        rowData && rowData.emp_det_datetime10 && rowData.emp_det_datetime10.date
          ? rowData.emp_det_datetime10.date
          : ""
      );
    }
  }, [RowID, state]);

  const isMyStateEmpty =
    Object.keys(handalImg).length === 0 && handalImg.constructor === Object;

  useEffect(() => {
    if (RowID && state && state.row) {
      fetchImgData();
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (RowID !== "" && RowID !== null) {
        setButton_save("Update");
        await getEmployeeLebel();
      } else {
        await getEmployeeLebel();
        //   await fetchStatusData();
        await get_workrequest_status(site_ID, "All");
        setButton_save("Save");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // master Dialog UseEffect
  useEffect(() => {
    if (textField) {
      setDefaultModal(true);
    }
  }, [textField]);

  // get autocomplete status

  // get status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await httpCommon.get(
          "/get_employe_status.php?site_cd=" + site_ID
        );

        if (response.data.status === "SUCCESS") {
          setStatus(response.data.emp_status);
          if (RowID && state && state.row) {
            const rowData = state.row;
            const filterData = response.data.emp_status.find(
              (item) => item.emp_sts_status === rowData.emp_mst_status
            );
            setData((pre) => ({
              ...pre,
              emp_mst_status:
                filterData.emp_sts_status + " : " + filterData.emp_sts_typ_cd,
            }));
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchStatus();
  }, []);

  // get login id
  useEffect(() => {
    const fetchLoginId = async () => {
      try {
        const response = await httpCommon.get(
          "/get_all_login.php?site_cd=" + site_ID
        );

        if (response.data.status === "SUCCESS") {
          setLogin(response.data.emp_Id);
          if (RowID && state && state.row) {
            const rowData = state.row;

            const filterData = response.data.emp_Id.find(
              (item) => item.empl_id === rowData.emp_mst_login_id
            );
            if (filterData) {
              setData((pre) => ({
                ...pre,
                emp_mst_login_id: filterData.empl_id + " : " + filterData.name,
              }));
            }
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchLoginId();
  }, []);

  // get user group
  useEffect(() => {
    const fetchUserGrp = async () => {
      try {
        const response = await httpCommon.get(
          "/get_emp_user_group.php?site_cd=" + site_ID
        );

        if (response.data.status === "SUCCESS") {
          setUsrGroup(response.data.emp_usr_grp);

          if (RowID && state && state.row) {
            const rowData = state.row;
            const filterData = response.data.emp_usr_grp.find(
              (item) => item.usr_grp_usr_grp === rowData.emp_mst_usr_grp
            );
            if (filterData) {
              setData((pre) => ({
                ...pre,
                emp_mst_usr_grp:
                  filterData.usr_grp_usr_grp + " : " + filterData.usr_grp_desc,
              }));
            }
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchUserGrp();
  }, []);

  // get primary craft
  useEffect(() => {
    const fetchPrimaryCraft = async () => {
      try {
        const response = await httpCommon.get(
          "/get_emp_primary_craft.php?site_cd=" + site_ID
        );
        console.log("responseCraft", response);

        if (response.data.status === "SUCCESS") {
          setCraft(response.data.emp_primary_craft);

          if (RowID && state && state.row) {
            const rowData = state.row;
            const filterData = response.data.emp_primary_craft.find(
              (item) => item.crf_mst_crf_cd === rowData.emp_det_craft
            );
            setData((pre) => ({
              ...pre,
              emp_det_craft: filterData
                ? filterData.crf_mst_crf_cd + " : " + filterData.crf_mst_desc
                : "",
            }));
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchPrimaryCraft();
  }, []);

  // Work Area Autocomplete
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await httpCommon.get(
          "/get_emp_work_area.php?site_cd=" + site_ID
        );

        if (response.data.status === "SUCCESS") {
          setWorkArea(response.data.emp_work_area);
          if (RowID && state && state.row) {
            const rowData = state.row;
            const filterData = response.data.emp_work_area.find(
              (item) => item.mst_war_work_area === rowData.emp_det_work_area
            );
            if (filterData) {
              setData((pre) => ({
                ...pre,
                emp_det_work_area:
                  filterData.mst_war_work_area +
                  " : " +
                  filterData.mst_war_desc,
              }));
            }
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchStatus();
  }, []);

  // Work Group
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await httpCommon.get(
          "/get_emp_work_group.php?site_cd=" + site_ID
        );
        console.log("response_WG", response);

        if (response.data.status === "SUCCESS") {
          setWorkGrp(response.data.emp_work_group);
          if (RowID && state && state.row) {
            const rowData = state.row;
            const filterData = response.data.emp_work_group.find(
              (item) => item.wrk_grp_grp_cd === rowData.emp_det_work_grp
            );

            if (filterData) {
              setData((pre) => ({
                ...pre,
                emp_det_work_grp:
                  filterData.wrk_grp_grp_cd + " : " + filterData.wrk_grp_desc,
              }));
            }
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchStatus();
  }, []);

  // SuperVisior Id
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await httpCommon.get(
          "/get_emp_supervisior_id.php?site_cd=" + site_ID
        );
        console.log("SuperVisior", response);

        if (response.data.status === "SUCCESS") {
          setSuperVisior(response.data.emp_supervisior);
          if (RowID && state && state.row) {
            const rowData = state.row;
            const filterData = response.data.emp_supervisior.find(
              (item) => item.emp_mst_empl_id === rowData.emp_det_supervisor_id
            );

            if (filterData) {
              setData((pre) => ({
                ...pre,
                emp_det_supervisor_id:
                  filterData.emp_mst_empl_id + " : " + filterData.emp_mst_name,
              }));
            }
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchStatus();
  }, []);

  // get required fields
  useEffect(() => {
    const getMandoryFields = async () => {
      try {
        const response = await httpCommon.get("/getEmpMandatoryfiled.php");
        if (response.data.status === "SUCCESS") {
          setMandatoryFields(response.data.data.MandatoryField);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    getMandoryFields();
  }, []);

  // Get All Filed label Name
  const getEmployeeLebel = async () => {
    try {
      const response = await httpCommon.get(
        `/get_employe_label.php?site_cd=${site_ID}`
      );
      console.log("response_label", response);
      if (response.data.status === "SUCCESS") {
        // setMandatoryFields

        console.log("EmployeLabel", response);
        setWkrMstLabel(response.data.emp_label);
        setWkrDetLabel(response.data.data.wkr_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Get All Filed label Name End

  const get_workrequest_status = async (site_ID, type, selected_asset) => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();

    APIServices.get_dropdown(site_ID, type)
      .then((responseJson) => {
        //  console.log("get_dropdown", responseJson);
        if (responseJson.data.status === "SUCCESS") {
          // fetchImgData();

          for (var index in responseJson.data.data.Wko_Auto_numbering) {
            if (
              responseJson.data.data.Wko_Auto_numbering[index]
                .cnt_mst_numbering == "M"
            ) {
              setWorkRequestNo_disabled(false);
              setAutoNumring("M");
            } else {
              setWorkRequestNo_disabled(true);
              setAutoNumring("A");
            }
          }

          let Asset_No = responseJson.data.data.WKO_Asset_No.map((item) => ({
            label: item.ast_mst_asset_no + " : " + item.ast_mst_asset_status,
            value: item.ast_mst_asset_no,
          }));
          setAsset_No(Asset_No);
          //setFilteredDataSource(Asset_No)

          let Charge_Cost_Center = responseJson.data.data.CostCenter.map(
            (item) => ({
              label: item.costcenter + " : " + item.descs,
              value: item.descs,
            })
          );
          setCharge_Cost_Center(Charge_Cost_Center);

          let Asset_Location = responseJson.data.data.AssetLocation.map(
            (item) => ({
              label: item.ast_loc_ast_loc + " : " + item.ast_loc_desc,
              value: item.ast_loc_ast_loc,
            })
          );
          setAsset_Location(Asset_Location);

          let OriginalPriority =
            responseJson.data.data.WKO_Original_Periority.map((item) => ({
              label: item.wrk_pri_pri_cd + " : " + item.wrk_pri_desc,
              value: item.wrk_pri_pri_cd,
            }));
          setOriginalPriority(OriginalPriority);

          let Level = responseJson.data.data.AssetLevel.map((item) => ({
            label: item.ast_lvl_ast_lvl + " : " + item.ast_lvl_desc,
            value: item.ast_lvl_ast_lvl,
          }));
          setLevel(Level);

          let WorkType = responseJson.data.data.WKO_Work_Type.map((item) => ({
            label: item.wrk_typ_typ_cd + " : " + item.wrk_typ_desc,
            value: item.wrk_typ_typ_cd,
          }));
          setWorkType(WorkType);

          let WorkClass = responseJson.data.data.WKO_Work_Class.map((item) => ({
            label: item.wrk_cls_cls_cd + " : " + item.wrk_cls_desc,
            value: item.wrk_cls_cls_cd,
          }));
          setWorkClass(WorkClass);

          let Work_Group = responseJson.data.data.WKO_Work_Group.map(
            (item) => ({
              label: item.wrk_grp_grp_cd + " : " + item.wrk_grp_desc,
              value: item.wrk_grp_desc,
            })
          );
          setWork_Group(Work_Group);

          let Work_Area = responseJson.data.data.WKO_Work_Area.map((item) => ({
            label: item.mst_war_work_area + " : " + item.mst_war_desc,
            value: item.mst_war_desc,
          }));
          setWork_Area(Work_Area);

          let ProjectID = responseJson.data.data.WKO_ProjectID.map((item) => ({
            label: item.prj_mst_prj_cd + " : " + item.prj_mst_desc,
            value: item.prj_mst_prj_cd,
          }));
          setProjectID(ProjectID);

          let Originator = responseJson.data.data.WKO_Originator.map(
            (item) => ({
              label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
              value: item.emp_mst_empl_id,
            })
          );
          setOriginator(Originator);

          let FaultCode = responseJson.data.data.FaultCode.map((item) => ({
            label: item.wrk_flt_fault_cd + " : " + item.wrk_flt_desc,
            value: item.wrk_flt_desc,
          }));
          setFaultCode(FaultCode);

          let Status = responseJson.data.data.WKO_Status.map((item) => ({
            label: item.wrk_sts_status + " : " + item.wrk_sts_desc,
            value: item.wrk_sts_desc,
          }));
          setStatus(Status);

          // if (selected_asset == 'New_WorkRequest') {

          //     Swal.close();
          //     setButton_save("Save")

          // } else {

          //     setButton_save("Update")
          //     get_workrequest_select(site_ID, selected_asset);
          // }

          Swal.close();
        } else {
          Swal.close();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: responseJson.data.message,
          });
        }
      })
      .catch((e) => {
        Swal.close();

        Swal.fire({
          icon: "error",
          title: "Oops get_sitecode...",
          text: e,
        });
      });
  };

  // Get User Data using ROWID
  const get_workrequest_select = async () => {
    try {
      const responseJson = await httpCommon.get(
        "/get_workrequest_select.php?RowID=" + RowID
      );
      console.log("SELECT WKR: ", responseJson);
      if (responseJson.data.status === "SUCCESS") {
        // **************************************** check read data ******************************************

        for (var index in responseJson.data.data) {
          //  setRowID(responseJson.data.data[index].RowID)
          setWorkRequestNo(responseJson.data.data[index].wkr_mst_wr_no);
          setApprovalStatus(responseJson.data.data[index].wkr_mst_wr_status);
          setSelected_OriginalPriority({
            label: responseJson.data.data[index].wkr_mst_orig_priority,
          });
          setSelected_Originator({
            label: responseJson.data.data[index].wkr_mst_originator,
          });
          setPhone(responseJson.data.data[index].wkr_mst_phone);

          if (responseJson.data.data[index].wkr_mst_org_date == null) {
            setOriginationDate("");
          } else {
            //  setOriginationDate(Moment(responseJson.data.data[index].wkr_mst_org_date.date).format('YYYY-MM-DDTHH:mm:ss').trim())
            const apiDate = responseJson.data.data["0"].wkr_mst_org_date.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setOriginationDate(formattedDate);
          }

          setSelected_FaultCode({
            label:
              responseJson.data.data[index].wkr_mst_fault_code +
              " : " +
              responseJson.data.data[index].wkr_mst_wr_descs,
          });

          if (responseJson.data.data[index].wkr_mst_due_date == null) {
            setDueDate("");
          } else {
            //  setDueDate(Moment(responseJson.data.data[index].wkr_mst_due_date.date).format('YYYY-MM-DDTHH:mm:ss').trim())
            const apiDate = responseJson.data.data["0"].wkr_mst_due_date.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setDueDate(formattedDate);
          }

          setDescription(responseJson.data.data[index].wkr_mst_wr_descs);

          setSelected_Asset_No({
            label: responseJson.data.data[index].wkr_mst_assetno,
          });
          setSelected_Charge_Cost_Center({
            label: responseJson.data.data[index].wkr_mst_chg_costcenter,
          });
          setSelected_Work_Area({
            label: responseJson.data.data[index].wkr_mst_work_area,
          });
          setSelected_Work_Group({
            label: responseJson.data.data[index].wkr_mst_work_group,
          });
          setSelected_Asset_Location({
            label: responseJson.data.data[index].wkr_mst_assetlocn,
          });
          setSelected_WorkType({
            label: responseJson.data.data[index].wkr_mst_work_type,
          });
          setSelected_Level({
            label: responseJson.data.data[index].wkr_mst_location,
          });
          setSelected_WorkClass({
            label: responseJson.data.data[index].wkr_mst_work_class || "",
          });
          setSelected_ProjectID({
            label: responseJson.data.data[index].wkr_mst_projectid || "",
          });

          setUDFNote1(responseJson.data.data[index].wkr_det_note1);
          setUDFNote2(responseJson.data.data[index].wkr_det_note2);
          setUDFText_1(responseJson.data.data[index].wkr_det_varchar1);
          setUDFText_2(responseJson.data.data[index].wkr_det_varchar2);
          setUDFText_3(responseJson.data.data[index].wkr_det_varchar3);
          setUDFText_4(responseJson.data.data[index].wkr_det_varchar4);
          setUDFText_5(responseJson.data.data[index].wkr_det_varchar5);
          setUDFText_6(responseJson.data.data[index].wkr_det_varchar6);
          setUDFText_7(responseJson.data.data[index].wkr_det_varchar7);
          setUDFText_8(responseJson.data.data[index].wkr_det_varchar8);
          setUDFText_9(responseJson.data.data[index].wkr_det_varchar9);
          setUDFText_10(responseJson.data.data[index].wkr_det_varchar10);
          setUDFText_11(responseJson.data.data[index].wkr_det_varchar11);
          setUDFText_12(responseJson.data.data[index].wkr_det_varchar12);
          setUDFText_13(responseJson.data.data[index].wkr_det_varchar13);
          setUDFText_14(responseJson.data.data[index].wkr_det_varchar14);
          setUDFText_15(responseJson.data.data[index].wkr_det_varchar15);
          setUDFText_16(responseJson.data.data[index].wkr_det_varchar16);
          setUDFText_17(responseJson.data.data[index].wkr_det_varchar17);
          setUDFText_18(responseJson.data.data[index].wkr_det_varchar18);
          setUDFText_19(responseJson.data.data[index].wkr_det_varchar19);
          setUDFText_20(responseJson.data.data[index].wkr_det_varchar20);

          setUDFNumber_1(responseJson.data.data[index].wkr_det_numeric1);
          setUDFNumber_2(responseJson.data.data[index].wkr_det_numeric2);
          setUDFNumber_3(responseJson.data.data[index].wkr_det_numeric3);
          setUDFNumber_4(responseJson.data.data[index].wkr_det_numeric4);
          setUDFNumber_5(responseJson.data.data[index].wkr_det_numeric5);
          setUDFNumber_6(responseJson.data.data[index].wkr_det_numeric6);
          setUDFNumber_7(responseJson.data.data[index].wkr_det_numeric7);
          setUDFNumber_8(responseJson.data.data[index].wkr_det_numeric8);
          setUDFNumber_9(responseJson.data.data[index].wkr_det_numeric9);
          setUDFNumber_10(responseJson.data.data[index].wkr_det_numeric10);

          if (responseJson.data.data[index].wkr_det_datetime1 == null) {
            setUDFDate_1("");
          } else {
            const apiDate = responseJson.data.data["0"].wkr_det_datetime1.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setUDFDate_1(formattedDate);
          }

          if (responseJson.data.data[index].wkr_det_datetime2 == null) {
            setUDFDate_2("");
          } else {
            const apiDate = responseJson.data.data["0"].wkr_det_datetime2.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setUDFDate_2(formattedDate);
          }

          if (responseJson.data.data[index].wkr_det_datetime3 == null) {
            setUDFDate_3("");
          } else {
            const apiDate = responseJson.data.data["0"].wkr_det_datetime3.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setUDFDate_3(formattedDate);
          }

          if (responseJson.data.data[index].wkr_det_datetime4 == null) {
            setUDFDate_4("");
          } else {
            const apiDate = responseJson.data.data["0"].wkr_det_datetime4.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setUDFDate_4(formattedDate);
          }

          if (responseJson.data.data[index].wkr_det_datetime5 == null) {
            setUDFDate_5("");
          } else {
            const apiDate = responseJson.data.data["0"].wkr_det_datetime5.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setUDFDate_5(formattedDate);
          }

          if (responseJson.data.data[index].wkr_det_datetime6 == null) {
            setUDFDate_6("");
          } else {
            const apiDate = responseJson.data.data["0"].wkr_det_datetime6.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setUDFDate_6(formattedDate);
          }

          if (responseJson.data.data[index].wkr_det_datetime7 == null) {
            setUDFDate_7("");
          } else {
            const apiDate = responseJson.data.data["0"].wkr_det_datetime7.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setUDFDate_7(formattedDate);
          }

          if (responseJson.data.data[index].wkr_det_datetime8 == null) {
            setUDFDate_8("");
          } else {
            const apiDate = responseJson.data.data["0"].wkr_det_datetime8.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setUDFDate_8(formattedDate);
          }

          if (responseJson.data.data[index].wkr_det_datetime9 == null) {
            setUDFDate_9("");
          } else {
            const apiDate = responseJson.data.data["0"].wkr_det_datetime9.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setUDFDate_9(formattedDate);
          }

          if (responseJson.data.data[index].wkr_det_datetime10 == null) {
            setUDFDate_10("");
          } else {
            const apiDate = responseJson.data.data["0"].wkr_det_datetime10.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setUDFDate_10(formattedDate);
          }

          setApprovedBy(responseJson.data.data[index].wkr_det_approver);

          if (responseJson.data.data[index].wkr_det_appr_date == null) {
            setApprovedDate("");
          } else {
            const apiDate = responseJson.data.data["0"].wkr_det_appr_date.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setApprovedDate(formattedDate);
          }

          setWorkOrderNo(responseJson.data.data[index].wkr_det_wo);
          setWorkStatus(responseJson.data.data[index].wko_mst_status);

          setRejectedBy(responseJson.data.data[index].wkr_det_reject_by);
          // setDbImg(responseJson.data.data[index].attachment)

          if (responseJson.data.data[index].wkr_det_reject_date == null) {
            setRejectedDate("");
          } else {
            const apiDate =
              responseJson.data.data["0"].wkr_det_reject_date.date;
            const formattedDate = Moment(
              apiDate,
              "YYYY-MM-DD HH:mm:ss.SSSSSS"
            ).toDate();
            setRejectedDate(formattedDate);
          }
          setRejectedDescription(
            responseJson.data.data[index].wkr_det_reject_desc
          );
        }
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
        title: "Oops get_WorkRequest_select...",
        text: error,
      });
    }
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
    setDisabledBtn(true);
    setImguploadStatus("NEW_SINGLE_IMG");
    setImageSelect({ name: "", path: "" });
  };

  const handleClearImg = (event) => {
    event.preventDefault();
    clearDataImg();
    setDisabledBtn(false);
  };

  const clearDataImg = () => {
    setImage("");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    selectedImages.forEach((file) => {
      formData.append("files[]", file);
    });
  };
  const handleImgChangeSingle2 = (e) => {
    setDisabledBtn(false);
  };

  const handleSelectedFaultCode = (selectedOption) => {
    setSelected_FaultCode(selectedOption);
    // console.log(selectedOption.value);
    if (selectedOption) {
      setDescription(selectedOption.value);
    } else {
      setDescription(""); // Handle the case where selectedOption is null or undefined
    }
    // setDescription(selectedOption.value);
  };

  const get_assetmaster_select = (selected_asset) => {
    let site_ID = localStorage.getItem("site_ID");

    var json = {
      site_cd: site_ID,
      ast_mst_asset_no: selected_asset,
      asset_shortdesc: "",
      cost_center: "",
      asset_status: "",
      asset_type: "",
      asset_grpcode: "",
      work_area: "",
      asset_locn: "",
      asset_code: "",
      ast_lvl: "",
      ast_sts_typ_cd: "",
      createby: "",
      service_type: "",
      block: "",
      floor: "",
    };

    //console.log('select Asset', json)

    APIServices.get_assetmaster_select(JSON.stringify(json))
      .then((responseJson) => {
        //  console.log('select Asset', responseJson)

        if (responseJson.data.status === "SUCCESS") {
          for (var index in responseJson.data.data) {
            // setRowID(responseJson.data.data[index].RowID)
            // console.log('select Asset', responseJson.data.data[index].ast_mst_asset_no)

            setSelected_Asset_No({
              label: responseJson.data.data[index].ast_mst_asset_no,
            });
            setSelected_Charge_Cost_Center({
              label:
                responseJson.data.data[index].ast_mst_cost_center +
                " : " +
                responseJson.data.data[index].descs,
            });
            setSelected_Work_Area({
              label:
                responseJson.data.data[index].ast_mst_work_area +
                " : " +
                responseJson.data.data[index].mst_war_desc,
            });
            setSelected_Asset_Location({
              label:
                responseJson.data.data[index].ast_mst_asset_locn +
                " : " +
                responseJson.data.data[index].ast_loc_desc,
            });
            setSelected_Level({
              label:
                responseJson.data.data[index].ast_mst_ast_lvl +
                " : " +
                responseJson.data.data[index].ast_lvl_desc,
            });
            setSelected_Work_Group({
              label:
                responseJson.data.data[index].ast_mst_wrk_grp +
                " : " +
                responseJson.data.data[index].wrk_grp_desc,
            });
          }

          Swal.close();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: responseJson.data,
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Oops get_assetmaster_select...",
          text: "Something Went Wrong",
        });
      });
  };
  // Thired Api Call
  const fetchImgData = async () => {
    try {
      const response = await httpCommon.get("/get_emp_img.php?RowID=" + RowID);

      if (response.data.data.AllImgGet.length > 0) {
        setDbImg(response.data.data.AllImgGet);
        setDbImgRowId(response.data.data.AllImgGet[0].RowID);
        setImguploadStatus(response.data.data.AllImgGet[0].ImgStatus);

        setImageSelect({
          name: response.data.data.AllImgGet[0].file_name,
          path: response.data.data.AllImgGet[0].attachment,
        });
      }
      if (response.data.data.AllRef.length > 0) {
        setImguploadRefStatus(response.data.data.AllRef[0].ImgStatusRef);
        setRefImg(response.data.data.AllRef);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleClickNew = (e, result) => {
    if (result !== "backdropClick") {
      setDialogNew(!dialogNew);
    }
  };
  function handleImageChange(event) {
    const files = event.target.files;
    // console.log("files",files);
    //setSelectedPdfFiles(files);
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
  const handleButtonClick = () => {
    fileInputRef.current.click();
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
  const handleDeleteImg = (e) => {
    const s = selectedImages.filter((item, index) => index !== e);
    setSelectedImages(s);
  };
  const handleShowdata = (item) => {
    setSelectedImage(item.attachment);
    setShowdd(true);
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
  const handleSelectedAssetNo = (selectedOption) => {
    // console.log(selectedOption)

    //  get_assetmaster_select(selectedOption.value);

    setSelected_Asset_No(selectedOption);
    setSelected_Charge_Cost_Center(Charge_Cost_Center[0]);
    setSelected_Work_Area(Work_Area[0]);
    setSelected_Asset_Location(Asset_Location[0]);
    setSelected_Level(Level[0]);
    setSelected_Work_Group(Work_Group[0]);
  };

  // Customizable Label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = wkrMstLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };
  // WorkReq Label Details table
  const findCustomizeLabelDet = (columnName) => {
    const matchingColumn = wkrdetLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
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

  //Approval Status
  const approvalStatusMap = {
    W: "Awaiting (W)",
    A: "Approve (A)",
    D: "Disapprove (D)",
  };

  const approvalStatusColor = {
    W: "#2196F3",
    A: "#19D895",
    D: "#FF6258",
  };

  const getApprovalStatusStyle = (status) => {
    const baseStyle = {
      fontSize: "12px",
      color: "white",
      padding: "3px",
      borderRadius: "8px",
      fontWeight: "bold",
      backgroundColor: "rgb(255, 98, 88)",
      width: "185px",
      height: "25px",
      border: "1px solid",
      cursor: "pointer",
      marginTop: "10px",
    };

    if (status === "W") {
      return {
        ...baseStyle,
        backgroundColor: approvalStatusColor[status],
      };
    } else if (status === "A") {
      return {
        ...baseStyle,
        backgroundColor: approvalStatusColor[status],
      };
    } else if (status === "D") {
      return {
        ...baseStyle,
        backgroundColor: approvalStatusColor[status],
      };
    } else {
      return {};
    }
  };

  useEffect(() => {
    const fetchEmployeData = async () => {
      const curpage = 1;
      try {
        const response = await httpCommon.get(
          `/get_emp_table_data.php?site_cd=${site_ID}&page=${curpage}`
        );

        setTableData(response.data.employe_result.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchEmployeData();
  }, []);

  const onClickCancel = () => {
    navigate(`/dashboard/people/employ-list`);
  };
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeText = (e) => {
    let value = e.target.value;

    if (e.target.name === "emp_mst_empl_id") {
      // Convert value to uppercase
      value = value.toUpperCase();

      // Assuming tableData is defined somewhere in your code
      const isDuplicate = tableData.find(
        (item) => item.emp_mst_empl_id === value
      );

      if (isDuplicate) {
        setError(
          "Employee ID is set to be required to be unique at this location.Please enter a unique Employee ID"
        );
      } else {
        setError(""); // Clear error if the value is unique
      }
    }

    // Update the text fields state
    setTextFields((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  // handleCancel
  const handleCancelClick = (name) => {
    // setModalDefault(false);

    setData((pre) => ({
      ...pre,
      [name]: "",
    }));
  };

  //   handle edit
  const handleEditClick = (e) => {
    setTextField(e);
  };

  const handleClose = (e, result) => {
    if (result !== "backdropClick") {
      setTextField("");
      setDefaultModal(false);
    }
  };

  // on submit function handleSubmit

  const New_WorkRequest = async () => {
    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    // let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    if (error) {
      toast.error(
        `Employee ID is set to be required to be unique at this location.Please enter a unique Employee ID`,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          style: {
            width: "400px",
          },
        }
      );
    } else if (!textFields.emp_mst_empl_id) {
      toast.error(`Please fill the required field: Employee Id`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
    } else if (!textFields.emp_mst_name) {
      toast.error(`Please fill the required field: Name`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
    } else if (!data.emp_mst_status) {
      toast.error(`Please fill the required field: Status`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
    } else if (!data.emp_mst_usr_grp) {
      toast.error(`Please fill the required field: User Group`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
    } else {
      Swal.fire({ title: "Loading.... !", allowOutsideClick: false });
      Swal.showLoading();
      // Date

      //Select Date 1
      let date_1 = "";
      if (UDFDate_1 == "" || UDFDate_1 == null) {
        date_1 = "";
      } else {
        date_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
      }

      //Select Date 2
      let date_2 = "";
      if (UDFDate_2 == "" || UDFDate_2 == null) {
        date_2 = "";
      } else {
        date_2 = Moment(UDFDate_2).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date2 ", date_2);
      }

      //Select Date 3
      let date_3 = "";
      if (UDFDate_3 == "" || UDFDate_3 == null) {
        date_3 = "";
      } else {
        date_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date3 ", date_3);
      }

      //Select Date 4
      let date_4 = "";
      if (UDFDate_4 == "" || UDFDate_4 == null) {
        date_4 = "";
      } else {
        date_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date4 ", date_4);
      }

      //Select Date 5
      let date_5 = "";
      if (UDFDate_5 == "" || UDFDate_5 == null) {
        date_5 = "";
      } else {
        date_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date5 ", date_5);
      }

      //Select Date 6
      let date_6 = "";
      if (UDFDate_6 == "" || UDFDate_6 == null) {
        date_6 = "";
      } else {
        date_6 = Moment(UDFDate_6).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date6 ", date_6);
      }

      //Select Date 7
      let date_7 = "";
      if (UDFDate_7 == "" || UDFDate_7 == null) {
        date_7 = "";
      } else {
        date_7 = Moment(UDFDate_7).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date7 ", date_7);
      }

      //Select Date 8
      let date_8 = "";
      if (UDFDate_8 == "" || UDFDate_8 == null) {
        date_8 = "";
      } else {
        date_8 = Moment(UDFDate_8).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date8 ", date_8);
      }

      //Select Date 9
      let date_9 = "";
      if (UDFDate_9 == "" || UDFDate_9 == null) {
        date_9 = "";
      } else {
        date_9 = Moment(UDFDate_9).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date9 ", date_9);
      }

      //Select Date 10
      let date_10 = "";
      if (UDFDate_10 == "" || UDFDate_10 == null) {
        date_10 = "";
      } else {
        date_10 = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date10 ", date_10);
      }
      // Date End
      // doh
      let dob = "";
      if (
        date.emp_mst_date_of_birth == "" ||
        date.emp_mst_date_of_birth == null
      ) {
        date_10 = "";
      } else {
        dob = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date10 ", date_10);
      }

      // doh
      let doh = "";
      if (date.emp_mst_dateofhire == "" || date.emp_mst_dateofhire == null) {
        doh = "";
      } else {
        doh = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date10 ", date_10);
      }

      var json = {
        ...textFields,
        ...checkboxData,
        emp_mst_payrate:
          textFields && textFields.emp_mst_payrate
            ? textFields.emp_mst_payrate
            : 0,
        emp_det_mr_limit:
          textFields && textFields.emp_det_mr_limit
            ? textFields.emp_det_mr_limit
            : 0,
        emp_det_pr_approval_limit:
          textFields && textFields.emp_det_pr_approval_limit
            ? textFields.emp_det_pr_approval_limit
            : 0,
        emp_det_wo_approval_limit:
          textFields && textFields.emp_det_wo_approval_limit
            ? textFields.emp_det_wo_approval_limit
            : 0,
        emp_mst_empl_id: textFields.emp_mst_empl_id,
        emp_mst_status:
          data && data.emp_mst_status
            ? data.emp_mst_status.replace(/ .*/, "")
            : "",
        emp_mst_usr_grp:
          data && data.emp_mst_usr_grp
            ? data.emp_mst_usr_grp.replace(/ .*/, "")
            : "",
        emp_mst_login_id:
          data && data.emp_mst_login_id
            ? data.emp_mst_login_id.replace(/ .*/, "")
            : "",
        emp_det_work_area:
          data && data.emp_det_work_area
            ? data.emp_det_work_area.replace(/ .*/, "")
            : "",
        emp_det_craft:
          data && data.emp_det_craft
            ? data.emp_det_craft.replace(/ .*/, "")
            : "",
        emp_det_work_area:
          data && data.emp_det_work_area
            ? data.emp_det_work_area.replace(/ .*/, "")
            : "",
        emp_det_supervisor_id:
          data && data.emp_det_supervisor_id
            ? data.emp_det_supervisor_id.replace(/ .*/, "")
            : "",
        site_cd: site_ID,
        emp_det_note1: UDFNote1 ? UDFNote1.trim() : "",
        emp_det_note2: UDFNote2 ? UDFNote2.trim() : "",

        emp_det_varchar1: UDFText_1 ? UDFText_1.trim() : "",
        emp_det_varchar2: UDFText_2 ? UDFText_2.trim() : "",
        emp_det_varchar3: UDFText_3 ? UDFText_3.trim() : "",
        emp_det_varchar4: UDFText_4 ? UDFText_4.trim() : "",
        emp_det_varchar5: UDFText_5 ? UDFText_5.trim() : "",
        emp_det_varchar6: UDFText_6 ? UDFText_6.trim() : "",
        emp_det_varchar7: UDFText_7 ? UDFText_7.trim() : "",
        emp_det_varchar8: UDFText_8 ? UDFText_8.trim() : "",
        emp_det_varchar9: UDFText_9 ? UDFText_9.trim() : "",
        emp_det_varchar10: UDFText_10 ? UDFText_10.trim() : "",
        emp_det_varchar11: UDFText_11 ? UDFText_11.trim() : "",
        emp_det_varchar12: UDFText_12 ? UDFText_12.trim() : "",
        emp_det_varchar13: UDFText_13 ? UDFText_13.trim() : "",
        emp_det_varchar14: UDFText_14 ? UDFText_14.trim() : "",
        emp_det_varchar15: UDFText_15 ? UDFText_15.trim() : "",
        emp_det_varchar16: UDFText_16 ? UDFText_16.trim() : "",
        emp_det_varchar17: UDFText_17 ? UDFText_17.trim() : "",
        emp_det_varchar18: UDFText_18 ? UDFText_18.trim() : "",
        emp_det_varchar19: UDFText_19 ? UDFText_19.trim() : "",
        emp_det_varchar20: UDFText_20 ? UDFText_20.trim() : "",

        emp_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : 0,
        emp_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : 0,
        emp_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : 0,
        emp_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : 0,
        emp_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : 0,
        emp_det_numeric6: UDFNumber_6 ? UDFNumber_6.trim() : 0,
        emp_det_numeric7: UDFNumber_7 ? UDFNumber_7.trim() : 0,
        emp_det_numeric8: UDFNumber_8 ? UDFNumber_8.trim() : 0,
        emp_det_numeric9: UDFNumber_9 ? UDFNumber_9.trim() : 0,
        emp_det_numeric10: UDFNumber_10 ? UDFNumber_10.trim() : 0,

        emp_det_datetime1: date_1,
        emp_det_datetime2: date_2,
        emp_det_datetime3: date_3,
        emp_det_datetime4: date_4,
        emp_det_datetime5: date_5,
        emp_det_datetime6: date_6,
        emp_det_datetime7: date_7,
        emp_det_datetime8: date_8,
        emp_det_datetime9: date_9,
        emp_det_datetime10: date_10,

        emp_mst_date_of_birth: date.emp_mst_date_of_birth
          ? format(new Date(date.emp_mst_date_of_birth), "yyyy-MM-dd")
          : "",

        emp_mst_dateofhire: date.emp_mst_dateofhire
          ? format(new Date(date.emp_mst_dateofhire), "yyyy-MM-dd")
          : "",

        emp_mst_dash_access:
          selectedDashboardAcess && selectedDashboardAcess.value
            ? selectedDashboardAcess.value.replace(/ .*/, "")
            : "",
        emp_det_shift: selectedShift.value,
        emp_mst_sex: selectedMstatus.value,
        emp_mst_pay_period: selectedPayPeriod.value,
        emp_mst_marital_status: selectedMstatus.value,
        ImgUpload: imageSelect,
        audit_user: emp_mst_login_id.trim(),
        emp_mst_create_by: emp_mst_login_id.trim(),
        emp_det_core: checkboxData.emp_det_core ? checkboxData.emp_det_core : 1,
        emp_det_mobile: checkboxData.emp_det_mobile
          ? checkboxData.emp_det_mobile
          : 1,
        emp_det_webwork: checkboxData.emp_det_webwork
          ? checkboxData.emp_det_webwork
          : 1,
      };

      let missingFields = [];
      // for (let i = 0; i < mandatoryFields.length; i++) {
      //   const item = mandatoryFields[i];
      //   const fieldValue = json[item.column_name];
      //   if (fieldValue !== null && fieldValue.trim() === "") {
      //     missingFields = item.customize_label;
      //     setErrorField(item.column_name);
      //     break;
      //   }
      // }

      for (let i = 0; i < mandatoryFields.length; i++) {
        const item = mandatoryFields[i];
        const fieldValue = json[item.column_name];

        // Check if fieldValue exists and is not null or undefined before trimming
        if (
          fieldValue !== null &&
          fieldValue !== undefined &&
          fieldValue.trim() === ""
        ) {
          missingFields = item.customize_label;
          setErrorField(item.column_name);
          break;
        }
      }

      //     // // If any fields are missing, display an error message
      if (missingFields.length > 0) {
        Swal.close();

        const errorMessage = `Please fill the required field: ${missingFields}`;

        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          style: {
            width: "400px",
          },
        });
      } else {
        try {
          const response = await httpCommon.post("/insert_new_emp_2.php", json);

          if (response.data.status === "SUCCESS") {
            addMaintenanceForm(response.data.inserted_id);
            Swal.close();
            Swal.fire({
              icon: "success",
              title: response.data.status,
              text: response.data.message,
              timer: 2000,
            }).then(() => {
              navigate(`/dashboard/people/employ-list`);
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
            title: "Oops Data Not Insert...",
            text: error,
          });
        }
      }
    }
  };

  // update work request
  const Update_WorkRequest = async () => {
    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");
    const rowData = state.row;
    console.log("rowData", rowData);

    if (!textFields.emp_mst_empl_id) {
      toast.error(`Please fill the required field: Employee Id`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
    } else if (!textFields.emp_mst_name) {
      toast.error(`Please fill the required field: Name`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
    } else if (!data.emp_mst_status) {
      toast.error(`Please fill the required field: Status`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
    } else if (!data.emp_mst_status) {
      toast.error(`Please fill the required field: User Group`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
    } else {
      //Select Date 1
      let date_1 = "";
      if (UDFDate_1 == "" || UDFDate_1 == null) {
        date_1 = "";
      } else {
        date_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
      }

      //Select Date 2
      let date_2 = "";
      if (UDFDate_2 == "" || UDFDate_2 == null) {
        date_2 = "";
      } else {
        date_2 = Moment(UDFDate_2).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date2 ", date_2);
      }

      //Select Date 3
      let date_3 = "";
      if (UDFDate_3 == "" || UDFDate_3 == null) {
        date_3 = "";
      } else {
        date_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date3 ", date_3);
      }

      //Select Date 4
      let date_4 = "";
      if (UDFDate_4 == "" || UDFDate_4 == null) {
        date_4 = "";
      } else {
        date_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date4 ", date_4);
      }

      //Select Date 5
      let date_5 = "";
      if (UDFDate_5 == "" || UDFDate_5 == null) {
        date_5 = "";
      } else {
        date_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date5 ", date_5);
      }

      //Select Date 6
      let date_6 = "";
      if (UDFDate_6 == "" || UDFDate_6 == null) {
        date_6 = "";
      } else {
        date_6 = Moment(UDFDate_6).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date6 ", date_6);
      }

      //Select Date 7
      let date_7 = "";
      if (UDFDate_7 == "" || UDFDate_7 == null) {
        date_7 = "";
      } else {
        date_7 = Moment(UDFDate_7).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date7 ", date_7);
      }

      //Select Date 8
      let date_8 = "";
      if (UDFDate_8 == "" || UDFDate_8 == null) {
        date_8 = "";
      } else {
        date_8 = Moment(UDFDate_8).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date8 ", date_8);
      }

      //Select Date 9
      let date_9 = "";
      if (UDFDate_9 == "" || UDFDate_9 == null) {
        date_9 = "";
      } else {
        date_9 = Moment(UDFDate_9).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date9 ", date_9);
      }

      //Select Date 10
      let date_10 = "";
      if (UDFDate_10 == "" || UDFDate_10 == null) {
        date_10 = "";
      } else {
        date_10 = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date10 ", date_10);
      }
      // Date End

      // doh
      let dob = "";
      if (
        date.emp_mst_date_of_birth == "" ||
        date.emp_mst_date_of_birth == null
      ) {
        date_10 = "";
      } else {
        dob = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date10 ", date_10);
      }

      // doh
      let doh = "";
      if (date.emp_mst_dateofhire == "" || date.emp_mst_dateofhire == null) {
        doh = "";
      } else {
        doh = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date10 ", date_10);
      }

      //Check Img state
      let setDbImgRowIdUpdate;
      if (getDbImgRowId == "" || getDbImgRowId == null) {
        setDbImgRowIdUpdate = "";
      } else {
        setDbImgRowIdUpdate = getDbImgRowId;
      }

      let missingFields = [];

      var json = {
        ...textFields,
        ...checkboxData,
        emp_mst_payrate:
          textFields && textFields.emp_mst_payrate
            ? textFields.emp_mst_payrate
            : 0,
        emp_det_mr_limit:
          textFields && textFields.emp_det_mr_limit
            ? textFields.emp_det_mr_limit
            : 0,
        emp_det_pr_approval_limit:
          textFields && textFields.emp_det_pr_approval_limit
            ? textFields.emp_det_pr_approval_limit
            : 0,
        emp_det_wo_approval_limit:
          textFields && textFields.emp_det_wo_approval_limit
            ? textFields.emp_det_wo_approval_limit
            : 0,
        emp_mst_status:
          data && data.emp_mst_status
            ? data.emp_mst_status.replace(/ .*/, "")
            : "",
        emp_mst_usr_grp:
          data && data.emp_mst_usr_grp
            ? data.emp_mst_usr_grp.replace(/ .*/, "")
            : "",
        emp_mst_login_id:
          data && data.emp_mst_login_id
            ? data.emp_mst_login_id.replace(/ .*/, "")
            : "",
        emp_det_work_area:
          data && data.emp_det_work_area
            ? data.emp_det_work_area.replace(/ .*/, "")
            : "",
        emp_det_craft:
          data && data.emp_det_craft
            ? data.emp_det_craft.replace(/ .*/, "")
            : "",
        emp_det_work_area:
          data && data.emp_det_work_area
            ? data.emp_det_work_area.replace(/ .*/, "")
            : "",
        emp_det_work_grp:
          data && data.emp_det_work_grp
            ? data.emp_det_work_grp.replace(/ .*/, "")
            : "",
        emp_det_supervisor_id:
          data && data.emp_det_supervisor_id
            ? data.emp_det_supervisor_id.replace(/ .*/, "")
            : "",
        emp_det_core: checkboxData.emp_det_core ? checkboxData.emp_det_core : 1,
        emp_det_mobile: checkboxData.emp_det_mobile
          ? checkboxData.emp_det_mobile
          : 1,
        emp_det_webwork: checkboxData.emp_det_webwork
          ? checkboxData.emp_det_webwork
          : 1,
        site_cd: site_ID,
        emp_det_note1: UDFNote1 ? UDFNote1 : "",
        emp_det_note2: UDFNote2 ? UDFNote2 : "",
        emp_det_varchar1: UDFText_1 ? UDFText_1.trim() : "",
        emp_det_varchar2: UDFText_2 ? UDFText_2.trim() : "",
        emp_det_varchar3: UDFText_3 ? UDFText_3.trim() : "",
        emp_det_varchar4: UDFText_4 ? UDFText_4.trim() : "",
        emp_det_varchar5: UDFText_5 ? UDFText_5.trim() : "",
        emp_det_varchar6: UDFText_6 ? UDFText_6.trim() : "",
        emp_det_varchar7: UDFText_7 ? UDFText_7.trim() : "",
        emp_det_varchar8: UDFText_8 ? UDFText_8.trim() : "",
        emp_det_varchar9: UDFText_9 ? UDFText_9.trim() : "",
        emp_det_varchar10: UDFText_10 ? UDFText_10.trim() : "",
        emp_det_varchar11: UDFText_11 ? UDFText_11.trim() : "",
        emp_det_varchar12: UDFText_12 ? UDFText_12.trim() : "",
        emp_det_varchar13: UDFText_13 ? UDFText_13.trim() : "",
        emp_det_varchar14: UDFText_14 ? UDFText_14.trim() : "",
        emp_det_varchar15: UDFText_15 ? UDFText_15.trim() : "",
        emp_det_varchar16: UDFText_16 ? UDFText_16.trim() : "",
        emp_det_varchar17: UDFText_17 ? UDFText_17.trim() : "",
        emp_det_varchar18: UDFText_18 ? UDFText_18.trim() : "",
        emp_det_varchar19: UDFText_19 ? UDFText_19.trim() : "",
        emp_det_varchar20: UDFText_20 ? UDFText_20.trim() : "",

        emp_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : 0,
        emp_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : 0,
        emp_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : 0,
        emp_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : 0,
        emp_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : 0,
        emp_det_numeric6: UDFNumber_6 ? UDFNumber_6.trim() : 0,
        emp_det_numeric7: UDFNumber_7 ? UDFNumber_7.trim() : 0,
        emp_det_numeric8: UDFNumber_8 ? UDFNumber_8.trim() : 0,
        emp_det_numeric9: UDFNumber_9 ? UDFNumber_9.trim() : 0,
        emp_det_numeric10: UDFNumber_10 ? UDFNumber_10.trim() : 0,
        emp_det_datetime1: date_1,
        emp_det_datetime2: date_2,
        emp_det_datetime3: date_3,
        emp_det_datetime4: date_4,
        emp_det_datetime5: date_5,
        emp_det_datetime6: date_6,
        emp_det_datetime7: date_7,
        emp_det_datetime8: date_8,
        emp_det_datetime9: date_9,
        emp_det_datetime10: date_10,
        emp_mst_date_of_birth: date.emp_mst_date_of_birth
          ? format(new Date(date.emp_mst_date_of_birth), "yyyy-MM-dd")
          : "",
        emp_mst_dateofhire: date.emp_mst_dateofhire
          ? format(new Date(date.emp_mst_dateofhire), "yyyy-MM-dd")
          : "",
        emp_mst_dash_access:
          selectedDashboardAcess && selectedDashboardAcess.value
            ? selectedDashboardAcess.value.replace(/ .*/, "")
            : "",
        emp_det_shift: selectedShift.value,
        emp_mst_sex: selectedSex.value,
        emp_mst_pay_period: selectedPayPeriod.value,
        emp_mst_marital_status: selectedMstatus.value,
        ImgGetDbImgRowId: setDbImgRowIdUpdate,
        ImgUpload: imageSelect,
        audit_user: emp_mst_login_id.trim(),
        emp_mst_create_by: emp_mst_login_id.trim(),
        SingleImguploadStatus: imguploadStatus,
        ImguploadRefStatus: imguploadRefStatus ? imguploadRefStatus : "EMPTY",
        removedRefItems: removedRefItems,
        row_id: rowData.RowID,
      };

      for (let i = 0; i < mandatoryFields.length; i++) {
        const item = mandatoryFields[i];
        const fieldValue = json[item.column_name];
        if (
          fieldValue !== null &&
          fieldValue !== undefined &&
          fieldValue.trim() === ""
        ) {
          missingFields = item.customize_label;
          setErrorField(item.column_name);
          break;
        }
      }

      // // If any fields are missing, display an error message
      if (missingFields.length > 0) {
        Swal.close();

        const errorMessage = `Please fill the required field: ${missingFields}`;

        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          style: {
            width: "400px",
          },
        });
      } else {
        try {
          const response = await httpCommon.post("/update_emp_2.php", json);

          if (response.data.status === "SUCCESS") {
            // reference Image
            // if (selectedPdfFiles.length > 0) {
            //   const formData = new FormData();
            //   for (let i = 0; i < selectedPdfFiles.length; i++) {
            //     formData.append("files[]", selectedPdfFiles[i]);
            //   }
            //   formData.append("site_cd", site_ID);
            //   formData.append("RowID", RowID);
            //   formData.append("RefImgUploadStatus", imguploadRefStatus);
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
            // }

            Swal.fire({
              icon: "success",
              title: response.data.status,
              text: "Updated Successfully",
              timer: 2000,
            }).then(() => {
              navigate(`/dashboard/people/employ-list`);
            });
            updateMaintenanceForm(rowData.RowID);
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: response.data,
            });
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    }
  };
  // handle Submit end

  const onClickChange = (event) => {
    event.preventDefault();
    setShowErrorBorder(false);

    if (Button_save === "Save") {
      console.log("save___12", Button_save);
      New_WorkRequest();
    } else if (Button_save === "Update") {
      console.log("update___");
      Update_WorkRequest();
    }
  };
  return (
    <>
      {/* master Dialog */}

      <MasterDialogEmployee
        setData={setData}
        handleClose={handleClose}
        open={DefaultModal}
        name={textField}
      />

      <AddLogInDialog
        open={dialogNew}
        handleClose={handleClickNew}
        setRefetch={setRefetch}
      />

      {/* toaster */}
      <ToastContainer />

      <Helmet>
        <title>{RowID ? "Update Employee" : "Create New Employee"}</title>
        <meta name="description" content="Create New Employee" />
      </Helmet>
      <Container
        maxWidth={settings.themeStretch ? false : "lg"}
        sx={{ height: "120px" }}
      >
        <div
          className="CustomBreadAssetSave asset"
          style={{
            position: "-webkit-sticky",
            position: "sticky",
            top: "55px",
            backgroundColor: "white",
            zIndex: 1000,
            borderBottom: "1px solid #00000021",
            height: "120px !important",
          }}
        >
          <CustomBreadcrumbs
            heading={RowID ? `Update Employee` : "Create New Employee"}
            links={[
              {
                name: "Employee",
              },
              { name: RowID ? "Update" : "Create" },
            ]}
            action={
              <div style={{ display: "flex", alignItems: "center" }}>
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
              </div>
            }
            sx={{ mb: { xs: 5, md: 5 } }}
          />
        </div>
        <div>
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              <div
                className="MainOrderFromGd"
                style={{ backgroundColor: "white" }}
              >
                <Grid container spacing={0}>
                  <Grid xs={12} md={10} className="imgGird1">
                    <Card sx={{ p: 3 }}>
                      {/* Image Section */}
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
                                          handleDeleteImgApi(getDbImg[0].RowID)
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
                                        src={require("../Add_Image_icon.png")}
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
                                  color: (theme) => theme.palette.grey[500],
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
                                    style={{ height: "50%", width: "50%" }}
                                    onClick={openSaveImg}
                                    className="dummyImg"
                                  />
                                )}
                              </DialogContent>
                            </BootstrapDialog>
                          </div>
                        </div>
                      </div>

                      {/* Form Label */}
                      <Box
                        rowGap={2}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                          xs: "repeat(1, 1fr)",
                          sm: "repeat(2, 1fr)",
                        }}
                        alignItems="center"
                      >
                        {/*Employee ID */}
                        <Stack spacing={1}>
                          <Typography
                            variant="subtitle2"
                            style={{ color: "red" }}
                          >
                            {findCustomizeLabel("emp_mst_empl_id") ||
                              "Employee ID"}
                          </Typography>
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            name="emp_mst_empl_id"
                            size="small"
                            value={textFields.emp_mst_empl_id}
                            disabled={!showEmpl}
                            defaultValue={""}
                            onChange={handleChangeText}
                            className="Extrasize"
                            inputProps={{ maxLength: 50 }}
                          />
                        </Stack>
                        {/* Name */}
                        <Stack spacing={1.5}>
                          <Typography
                            variant="subtitle2"
                            style={{ color: "red" }}
                          >
                            {findCustomizeLabel("emp_mst_name") || "Name"}
                          </Typography>
                          <TextField
                            id="outlined-basic"
                            size="small"
                            variant="outlined"
                            className="Extrasize"
                            fullWidth
                            value={textFields.emp_mst_name}
                            name="emp_mst_name"
                            onChange={handleChangeText}
                            inputProps={{ maxLength: 50 }}

                            // InputProps={{
                            //  // style: getApprovalStatusStyle(ApprovalStatus),
                            //   // onMouseEnter: (e) => {
                            //   //   if (ApprovalStatus === 'A') {
                            //   //     e.target.style.backgroundColor = '#32ae83';
                            //   //   } else if (ApprovalStatus === 'D') {
                            //   //     e.target.style.backgroundColor = '#d73e33';
                            //   //   } else {
                            //   //     e.target.style.backgroundColor = '#2c80c5';
                            //   //   }
                            //   // },
                            //   onMouseLeave: (e) =>
                            //     (e.target.style.backgroundColor = getApprovalStatusStyle(ApprovalStatus).backgroundColor),
                            //   onClick: () => {
                            //     if (ApprovalStatus === 'A') {
                            //       ApprovehandleShow();
                            //     } else if (ApprovalStatus === 'D') {
                            //       DisapprovehandleShow();
                            //     }
                            //   },
                            // }}
                          />
                          {/* <button
                            type="button"
                            className="btn btn-icon-text"
                            style={getApprovalStatusStyle(ApprovalStatus)}
                            onMouseEnter={(e) => {
                              if (ApprovalStatus === "A") {
                                e.target.style.backgroundColor = "#32ae83";
                              } else if (ApprovalStatus === "D") {
                                e.target.style.backgroundColor = "#d73e33";
                              } else {
                                e.target.style.backgroundColor = "#2c80c5";
                              }
                            }}
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor =
                                getApprovalStatusStyle(
                                  ApprovalStatus
                                ).backgroundColor)
                            }
                            onClick={() => {
                              if (ApprovalStatus === "A") {
                                ApprovehandleShow();
                              } else if (ApprovalStatus === "D") {
                                DisapprovehandleShow();
                              }
                            }}
                          >
                            {approvalStatusMap[ApprovalStatus] ||
                              ApprovalStatus}{" "}
                            {ApprovalStatus === "A" ||
                            ApprovalStatus === "D" ? (
                              <span
                                style={{
                                  backgroundColor: "yellow",
                                  color: "red",
                                  fontSize: "12px",
                                  padding: "3px",
                                  borderRadius: "5px",
                                  marginLeft: "10px", // Adjust the margin as needed
                                }}
                              >
                                Read Only
                              </span>
                            ) : <span
                                style={{
                                  backgroundColor: "yellow",
                                  color: "red",
                                  fontSize: "12px",
                                  padding: "3px",
                                  borderRadius: "5px",
                                  marginLeft: "10px", // Adjust the margin as needed
                                }}
                              >
                                Read Only
                              </span>}
                           
                          </button> */}
                        </Stack>

                        {/* Droup Down */}

                        {/* <Stack spacing={1}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("emp_mst_status") ||
                              "Status"}
                          </Typography>
                          <Autocomplete
                            options={Originator}
                            defaultValue={selected_Originator}
                            onChange={(event, value) => {
                              setSelected_Originator(value);
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
                            {findCustomizeLabel("wkr_mst_orig_priority") ||
                              "Original Priority"}{" "}
                            <span style={{ marginRight: "4px", color: "red" }}>
                              *
                            </span>
                          </Typography>
                          <Autocomplete
                            options={OriginalPriority}
                            defaultValue={selected_OriginalPriority}
                            onChange={(event, value) => {
                              setSelected_OriginalPriority(value);
                            }}
                            renderInput={(params) => (
                              <div>
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  //  className="Extrasize"

                                  className={
                                    showErrorBorder &&
                                    (selected_OriginalPriority === null ||
                                      selected_OriginalPriority.length === 0)
                                      ? "red-border"
                                      : "NoReq"
                                  }
                                />
                              </div>
                            )}
                          />
                        </Stack> */}
                        {/* Status */}
                        <Stack spacing={1}>
                          <Typography
                            variant="subtitle2"
                            style={{ color: "red" }}
                          >
                            {findCustomizeLabel("emp_mst_status") || "Status"}
                          </Typography>
                          <div>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              name="emp_det_work_grp"
                              size="small"
                              // value={data ? data.LaborAccount : ""}
                              fullWidth
                              // value={Permanent_IDFlag || ""}
                              // disabled
                              placeholder="Select..."
                              value={data.emp_mst_status}
                              InputProps={{
                                endAdornment: (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      color: "#637381",
                                      gap: 10,
                                    }}
                                  >
                                    <Iconify
                                      icon="material-symbols:close"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        handleCancelClick("emp_mst_status")
                                      }
                                    />

                                    <Iconify
                                      icon="tabler:edit"
                                      onClick={() =>
                                        handleEditClick("emp_mst_status")
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ),
                              }}
                            />
                          </div>
                        </Stack>
                        {/* Status end */}

                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_title"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_title") || "Title"}{" "}
                            {/* <span style={{ marginRight: "4px", color: "red" }}>
                              *
                            </span> */}
                          </Typography>

                          <TextField
                            id="outlined-basic"
                            size="small"
                            variant="outlined"
                            className="Extrasize"
                            name="emp_mst_title"
                            fullWidth
                            value={textFields.emp_mst_title}
                            onChange={handleChangeText}
                            inputProps={{ maxLength: 60 }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{ color: "red" }}
                          >
                            {findCustomizeLabel("emp_mst_usr_grp") ||
                              "User Group"}{" "}
                          </Typography>

                          <div>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              name="emp_det_work_grp"
                              size="small"
                              value={data ? data.emp_mst_usr_grp : ""}
                              fullWidth
                              // value={Permanent_IDFlag || ""}
                              // disabled
                              placeholder="Select..."
                              InputProps={{
                                endAdornment: (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      color: "#637381",
                                      gap: 10,
                                    }}
                                  >
                                    <Iconify
                                      icon="material-symbols:close"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        handleCancelClick("emp_mst_usr_grp")
                                      }
                                    />

                                    <Iconify
                                      icon="tabler:edit"
                                      onClick={() =>
                                        handleEditClick("emp_mst_usr_grp")
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ),
                              }}
                            />
                          </div>
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_login_id"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_login_id") ||
                              "Login Id"}{" "}
                          </Typography>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              name="emp_mst_login_id"
                              size="small"
                              value={data.emp_mst_login_id}
                              fullWidth
                              placeholder="Select..."
                              InputProps={{
                                endAdornment: (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      color: "#637381",
                                      gap: 10,
                                    }}
                                  >
                                    <Iconify
                                      icon="material-symbols:close"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        handleCancelClick("emp_mst_login_id")
                                      }
                                    />

                                    <Iconify
                                      icon="tabler:edit"
                                      onClick={() =>
                                        handleEditClick("emp_mst_login_id")
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ),
                              }}
                            />
                            {/* <Tooltip title="Add new Login Id">
  <IconButton onClick={()=>setDialogNew(true)}>
    <IoAddCircleSharp />
  </IconButton>
</Tooltip> */}
                          </div>
                        </Stack>

                        {/* contact no */}
                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_homephone"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_homephone") ||
                              "Contact No"}{" "}
                          </Typography>

                          <TextField
                            id="outlined-basic"
                            size="small"
                            variant="outlined"
                            className="Extrasize"
                            name="emp_mst_homephone"
                            fullWidth
                            value={textFields.emp_mst_homephone}
                            onChange={handleChangeText}
                            inputProps={{ maxLength: 60 }}
                          />
                        </Stack>

                        {/* contact no end */}

                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_pay_period"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_pay_period") ||
                              "Pay Period"}{" "}
                          </Typography>

                          <Autocomplete
                            options={payPeriod}
                            value={selectedPayPeriod?.label ?? ""}
                            onChange={(event, value) => {
                              setSelectedPayPeriod(value);
                            }}
                            renderInput={(params) => (
                              <div>
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="outlined"
                                  className="Extrasize"
                                  // inputProps={{maxLength:}}
                                />
                              </div>
                            )}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_date_of_birth"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_date_of_birth") ||
                              "DOB"}{" "}
                          </Typography>
                          <DatePicker
                            format="dd/MM/yyyy"
                            className="Extrasize"
                            onChange={(newDate) => {
                              setDate((pre) => ({
                                ...pre,
                                emp_mst_date_of_birth: newDate,
                              }));
                            }}
                            value={new Date(date.emp_mst_date_of_birth)}
                            // value={date.emp_mst_date_of_birth}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                              },
                            }}
                          />
                        </Stack>

                        {/* DOH */}
                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_dateofhire"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_dateofhire") ||
                              "Date of Hire"}{" "}
                          </Typography>

                          <DatePicker
                            format="dd/MM/yyyy"
                            className="Extrasize"
                            onChange={(newDate) => {
                              setDate((pre) => ({
                                ...pre,
                                emp_mst_dateofhire: newDate,
                              })); // Update your state with the new value
                            }}
                            value={new Date(date.emp_mst_dateofhire)}
                            // value={date.emp_mst_dateofhire}

                            slotProps={{
                              textField: {
                                fullWidth: true,
                              },
                            }}
                          />
                        </Stack>

                        {/* pay rate */}
                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_dateofhire"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_payrate") ||
                              "Pay Rate"}{" "}
                          </Typography>

                          <TextField
                            id="outlined-basic"
                            size="small"
                            variant="outlined"
                            className="Extrasize"
                            type="number"
                            name="emp_mst_payrate"
                            value={textFields.emp_mst_payrate}
                            fullWidth
                            onChange={handleChangeText}
                            inputProps={{ maxLength: 25 }}
                          />
                        </Stack>

                        {/* Dashboard Acesss */}
                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_dash_access"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_dash_access") ||
                              "Dashboard Acess"}{" "}
                          </Typography>

                          <Autocomplete
                            options={dashboardAcess}
                            value={
                              selectedDashboardAcess
                                ? selectedDashboardAcess
                                : ""
                            }
                            onChange={(event, value) => {
                              setselectedDashboardAcess(value);
                            }}
                            renderInput={(params) => (
                              <div>
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select.."
                                  variant="outlined"
                                  className="Extrasize"
                                />
                              </div>
                            )}
                          />
                        </Stack>

                        {/* Emergency Name */}
                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_emg_name"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_emg_name") ||
                              "Emergency Name"}{" "}
                          </Typography>

                          <TextField
                            id="outlined-basic"
                            size="small"
                            variant="outlined"
                            className="Extrasize"
                            name="emp_mst_emg_name"
                            value={textFields.emp_mst_emg_name}
                            fullWidth
                            onChange={handleChangeText}
                          />
                        </Stack>

                        {/* Emergency Phone */}
                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_emg_phone"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_emg_phone") ||
                              "Emergency Phone"}{" "}
                          </Typography>

                          <TextField
                            id="outlined-basic"
                            size="small"
                            variant="outlined"
                            className="Extrasize"
                            name="emp_mst_emg_phone"
                            fullWidth
                            value={textFields.emp_mst_emg_phone}
                            onChange={handleChangeText}
                          />
                        </Stack>

                        {/* Sex */}
                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_sex" ? "red" : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_sex") || "Sex"}{" "}
                          </Typography>

                          <Autocomplete
                            options={sex}
                            value={selectedSex?.label ?? ""}
                            onChange={(event, value) => {
                              setSelectedSex(value);
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

                        {/* material Status */}

                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_marital_status"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabel("emp_mst_marital_status") ||
                              "Marital Status"}{" "}
                          </Typography>

                          <Autocomplete
                            options={mstatus}
                            value={
                              selectedMstatus && selectedMstatus.label
                                ? selectedMstatus.label
                                : ""
                            }
                            onChange={(event, value) => {
                              setselectedMstatus(value);
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
                          <Typography
                            variant="subtitle2"
                            style={{
                              color:
                                errorField === "emp_mst_remarks"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {findCustomizeLabelDet("emp_mst_remarks") ||
                              "Remark"}
                          </Typography>
                          <TextareaAutosize
                            aria-label="empty textarea"
                            name="emp_mst_remarks"
                            minRows={6.5}
                            value={textFields.emp_mst_remarks}
                            className="TxtAra"
                            style={{ width: "100%" }} // Make it full-width
                            // onChange={(e) => {
                            //   setUDFNote1(e.target.value);
                            // }}
                            onChange={handleChangeText}
                          />
                        </Stack>
                      </Box>
                    </Card>
                  </Grid>

                  <Grid xs={12} md={2} className="imgGird">
                    <Card sx={{ pt: 10, pb: 5, px: 3 }}>
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
                                        //  width="200"
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
                                          src={require("../Add_Image_icon.png")}
                                          className="sliderimg2"
                                          onClick={handleImgChangeSingle2}
                                          //  width="200"
                                          //  height="180"
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
                                    color: (theme) => theme.palette.grey[500],
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
                                      style={{ height: "50%", width: "50%" }}
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
              </div>

              {/* Tabs  Section   */}

              <Grid container spacing={3}>
                <Grid xs={12} md={12}>
                  <Card sx={{ p: 3 }}>
                    <Tabs
                      value={Tabvalue}
                      onChange={handleChange}
                      aria-label="Basic tabs"
                      defaultValue={0}
                      style={{ marginLeft: "-40px" }}
                    >
                      {/* 0 */}
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

                      {/* 1 */}
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

                      {/* 2 */}
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="material-symbols:date-range-outline"
                              style={{ marginRight: "4px" }}
                            />
                            UDF2
                          </div>
                        }
                      />

                      {/* 3 */}
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="wpf:maintenance"
                              style={{ marginRight: "4px" }}
                            />
                            Maintenance
                          </div>
                        }
                      />

                      {/* 4 */}
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="material-symbols:order-approve-outline"
                              style={{ marginRight: "4px" }}
                            />
                            PR Approval
                          </div>
                        }
                      />

                      {/* 5 */}
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="arcticons:autotools"
                              style={{ marginRight: "4px" }}
                            />
                            MR Approval
                          </div>
                        }
                      />

                      {/* 6 */}
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="ep:location-filled"
                              style={{ marginRight: "4px" }}
                            />
                            Stock Location
                          </div>
                        }
                      />

                      {/* 7 */}
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

                      {/* 8 */}
                      <Tab
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Iconify
                              icon="clarity:employee-group-solid"
                              style={{ marginRight: "4px" }}
                            />
                            Employee Work Group
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
                      <DetailsSection
                        findCustomizeLabel={findCustomizeLabel}
                        handleChangeText={handleChangeText}
                        textFields={textFields}
                        handleCancelClick={handleCancelClick}
                        handleEditClick={handleEditClick}
                        data={data}
                        visible={visible}
                        setVisible={setVisible}
                        checkboxData={checkboxData}
                        handleCheckboxData={handleCheckboxData}
                        setSelectedShift={setSelectedShift}
                        shift={shift}
                        selectedShift={selectedShift}
                      />
                    </Box>

                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 1}
                      sx={{ marginTop: "16px" }}
                    >
                      {/* List1 */}
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_note1") ||
                                "Note1"}
                            </Typography>
                            <TextareaAutosize
                              aria-label="empty textarea"
                              // placeholder={
                              //   findCustomizeLabelDet("emp_det_note1") ||
                              //   "Note1"
                              // }
                              minRows={6.5}
                              className="TxtAra"
                              style={{ width: "100%" }} // Make it full-width
                              value={UDFNote1}
                              onChange={(e) => {
                                setUDFNote1(e.target.value);
                              }}
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar1") ||
                                "Varchar1"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              name="emp_det_varchar1"
                              defaultValue={UDFText_1}
                              onChange={(e) => {
                                setUDFText_1(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar2") ||
                                "Varchar2"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              name="emp_det_varchar2"
                              defaultValue={UDFText_2}
                              onChange={(e) => {
                                setUDFText_2(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar3") ||
                                "Varchar3"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar2"
                              className="Extrasize"
                              defaultValue={UDFText_3}
                              onChange={(e) => {
                                setUDFText_3(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar4") ||
                                "Varchar4"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar4"
                              className="Extrasize"
                              defaultValue={UDFText_4}
                              onChange={(e) => {
                                setUDFText_4(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar5") ||
                                "Varchar5"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              name="emp_det_varchar5"
                              defaultValue={UDFText_5}
                              onChange={(e) => {
                                setUDFText_5(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar6") ||
                                "Varchar6"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar6"
                              className="Extrasize"
                              defaultValue={UDFText_6}
                              onChange={(e) => {
                                setUDFText_6(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar7") ||
                                "Varchar7"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar7"
                              className="Extrasize"
                              defaultValue={UDFText_7}
                              onChange={(e) => {
                                setUDFText_7(e.target.value);
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar8") ||
                                "Varchar8"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar8"
                              className="Extrasize"
                              defaultValue={UDFText_8}
                              onChange={(e) => {
                                setUDFText_8(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar9") ||
                                "Varchar9"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar9"
                              className="Extrasize"
                              defaultValue={UDFText_9}
                              onChange={(e) => {
                                setUDFText_9(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar10") ||
                                "Varchar10"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar10"
                              className="Extrasize"
                              defaultValue={UDFText_10}
                              onChange={(e) => {
                                setUDFText_10(e.target.value);
                              }}
                            />
                          </Stack>

                          {/* Numeric Value */}
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_numeric1") ||
                                "Numeric1"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              name="emp_det_numeric1"
                              defaultValue={UDFNumber_1}
                              onChange={(e) => {
                                setUDFNumber_1(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_numeric2") ||
                                "Numeric2"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              defaultValue={UDFNumber_2}
                              onChange={(e) => {
                                setUDFNumber_2(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_numeric3") ||
                                "Numeric3"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              defaultValue={UDFNumber_3}
                              onChange={(e) => {
                                setUDFNumber_3(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_numeric4") ||
                                "Numeric4"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              defaultValue={UDFNumber_4}
                              onChange={(e) => {
                                setUDFNumber_4(e.target.value);
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_numeric5") ||
                                "Numeric5"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              defaultValue={UDFNumber_5}
                              onChange={(e) => {
                                setUDFNumber_5(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_datetime1") ||
                                "Datetime1"}
                            </Typography>

                            <DateTimePicker
                              value={new Date(UDFDate_1)}
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
                              {findCustomizeLabelDet("emp_det_datetime2") ||
                                "Datetime2"}
                            </Typography>

                            <DateTimePicker
                              value={new Date(UDFDate_2)}
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
                              {findCustomizeLabelDet("emp_det_datetime3") ||
                                "Datetime3"}
                            </Typography>

                            <DateTimePicker
                              value={new Date(UDFDate_3)}
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
                              {findCustomizeLabelDet("emp_det_datetime4") ||
                                "Datetime4"}
                            </Typography>

                            <DateTimePicker
                              value={new Date(UDFDate_4)}
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
                              {findCustomizeLabelDet("emp_det_datetime5") ||
                                "Datetime5"}
                            </Typography>

                            <DateTimePicker
                              value={new Date(UDFDate_5)}
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
                      hidden={Tabvalue !== 2}
                      sx={{ marginTop: "16px" }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_note2") ||
                                "Note2"}
                            </Typography>
                            <TextareaAutosize
                              aria-label="empty textarea"
                              // placeholder={
                              //   findCustomizeLabelDet("emp_det_note2") ||
                              //   "Note2"
                              // }
                              minRows={6.5}
                              className="TxtAra"
                              style={{ width: "100%" }} // Make it full-width
                              defaultValue={UDFNote2}
                              onChange={(e) => {
                                setUDFNote2(e.target.value);
                              }}
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar11") ||
                                "Varchar11"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              name="emp_det_varchar1"
                              defaultValue={UDFText_11}
                              onChange={(e) => {
                                setUDFText_11(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar12") ||
                                "Varchar12"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              name="emp_det_varchar12"
                              defaultValue={UDFText_12}
                              onChange={(e) => {
                                setUDFText_12(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar13") ||
                                "Varchar13"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar13"
                              className="Extrasize"
                              defaultValue={UDFText_13}
                              onChange={(e) => {
                                setUDFText_13(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar14") ||
                                "Varchar14"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar14"
                              className="Extrasize"
                              defaultValue={UDFText_14}
                              onChange={(e) => {
                                setUDFText_14(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar15") ||
                                "Varchar15"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              name="emp_det_varchar15"
                              defaultValue={UDFText_15}
                              onChange={(e) => {
                                setUDFText_15(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar16") ||
                                "Varchar16"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar16"
                              className="Extrasize"
                              defaultValue={UDFText_16}
                              onChange={(e) => {
                                setUDFText_16(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar17") ||
                                "Varchar17"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar17"
                              className="Extrasize"
                              defaultValue={UDFText_17}
                              onChange={(e) => {
                                setUDFText_17(e.target.value);
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar18") ||
                                "Varchar18"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar18"
                              className="Extrasize"
                              defaultValue={UDFText_18}
                              onChange={(e) => {
                                setUDFText_18(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar19") ||
                                "Varchar19"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar19"
                              className="Extrasize"
                              defaultValue={UDFText_19}
                              onChange={(e) => {
                                setUDFText_19(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_varchar20") ||
                                "Varchar20"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              name="emp_det_varchar20"
                              className="Extrasize"
                              defaultValue={UDFText_20}
                              onChange={(e) => {
                                setUDFText_20(e.target.value);
                              }}
                            />
                          </Stack>

                          {/* Numeric Value */}
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_numeric6") ||
                                "Numeric6"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              name="emp_det_numeric11"
                              defaultValue={UDFNumber_6}
                              onChange={(e) => {
                                setUDFNumber_6(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_numeric7") ||
                                "Numeric7"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              defaultValue={UDFNumber_7}
                              onChange={(e) => {
                                setUDFNumber_7(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_numeric8") ||
                                "Numeric8"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              defaultValue={UDFNumber_8}
                              onChange={(e) => {
                                setUDFNumber_8(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_numeric9") ||
                                "Numeric9"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              defaultValue={UDFNumber_9}
                              onChange={(e) => {
                                setUDFNumber_9(e.target.value);
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_numeric10") ||
                                "Numeric10"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className="Extrasize"
                              defaultValue={UDFNumber_10}
                              onChange={(e) => {
                                setUDFNumber_10(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("emp_det_datetime6") ||
                                "Datetime6"}
                            </Typography>

                            <DateTimePicker
                              value={new Date(UDFDate_6)}
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
                              {findCustomizeLabelDet("emp_det_datetime7") ||
                                "Datetime7"}
                            </Typography>

                            <DateTimePicker
                              value={new Date(UDFDate_7)}
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
                              {findCustomizeLabelDet("emp_det_datetime8") ||
                                "Datetime8"}
                            </Typography>

                            <DateTimePicker
                              value={new Date(UDFDate_8)}
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
                              {findCustomizeLabelDet("emp_det_datetime9") ||
                                "Datetime9"}
                            </Typography>

                            <DateTimePicker
                              value={new Date(UDFDate_9)}
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
                              {findCustomizeLabelDet("emp_det_datetime10") ||
                                "Datetime10"}
                            </Typography>

                            <DateTimePicker
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              value={new Date(UDFDate_10)}
                              onChange={(newDate) => {
                                setUDFDate_10(newDate);
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
                      {RowID && state && state.row ? (
                        <MaintenceSection
                          setMaintenceResult={setMaintence}
                          MaintenceResult={maintenance}
                          RowIDProp={RowID}
                          state={state}
                        />
                      ) : (
                        <MaintenceSection
                          setMaintenceResult={setMaintence}
                          MaintenceResult={maintenance}
                          RowIDProp={""}
                          state={null}
                        />
                      )}
                    </Box>

                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 4}
                      sx={{ marginTop: "16px" }}
                    >
                      {checkboxData.emp_det_pr_approver ? (
                        <div>
                          <PrSection setData={setPRData} data={PRData} />
                        </div>
                      ) : null}
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 5}
                      sx={{ marginTop: "16px" }}
                    >
                      {checkboxData.emp_det_mr_approver ? (
                        <div>MR Approval</div>
                      ) : null}
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 6}
                      sx={{ marginTop: "16px" }}
                    ></Box>

                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 7}
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
                                        className="btnDltReq"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDeleteImg(index);
                                        }}
                                      >
                                        <Iconify
                                          icon="fluent:delete-48-filled"
                                          style={{
                                            fontSize: "24px",
                                            color: "red",
                                          }}
                                        />
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
                      hidden={Tabvalue !== 8}
                      sx={{ marginTop: "16px" }}
                    >
                      end Reference
                    </Box>

                    <Grid
                      container
                      xs={12}
                      md={12}
                      justifyContent="flex-end"
                      style={{ paddingRight: "20px", marginTop: "20px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {/* {ApprovalStatus !== "A" && ApprovalStatus !== "D" && (
                          <Button
                            component={RouterLink}
                            onClick={onClickChange}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:save-fill" />}
                            style={{ marginRight: "10px" }}
                          >
                            {Button_save}
                          </Button>
                        )}
                        <Button
                          variant="soft"
                          color="error"
                          onClick={onClickCancel}
                          startIcon={<Iconify icon="flat-color-icons:cancel" />}
                        >
                          Cancel
                        </Button> */}
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
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
                                    selected_Status?.label?.split(" : ")[2] ??
                                    ""
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
                      </div>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
              {/******************** Approve Details ********************/}
              <div>
                <BootstrapDialog
                  onClose={ApprovehandleClose}
                  aria-labelledby="customized-dialog-title"
                  open={ApproveShow}
                  maxWidth="md"
                  fullWidth
                >
                  <IconButton
                    aria-label="close"
                    onClick={ApprovehandleClose}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <Iconify icon="carbon:close-outline" />
                  </IconButton>
                  <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Approve Details
                  </DialogTitle>
                  <DialogContent dividers>
                    <Typography gutterBottom>
                      <Stack spacing={2} className="ApproveDailog">
                        <div>
                          <TextField
                            label="Approved By :"
                            fullWidth
                            defaultValue={ApprovedBy}
                            disabled
                          />
                        </div>
                        <div>
                          <DateTimePicker
                            label="Approved Date :"
                            value={ApprovedDate}
                            format="dd/MM/yyyy HH:mm"
                            className="Extrasize"
                            disabled
                            slotProps={{
                              textField: {
                                fullWidth: true,
                              },
                            }}
                          />
                        </div>
                        <div>
                          <TextField
                            label="Work Order No :"
                            variant="outlined"
                            value={WorkOrderNo}
                            disabled
                            fullWidth
                          />
                        </div>
                        <div>
                          <TextField
                            label="Work Status :"
                            variant="outlined"
                            value={WorkStatus}
                            disabled
                            fullWidth
                          />
                        </div>
                      </Stack>
                    </Typography>
                  </DialogContent>
                </BootstrapDialog>
              </div>

              {/******************** Disapprove Details ********************/}
              <div>
                <div>
                  <BootstrapDialog
                    onClose={DisapprovehandleClose}
                    aria-labelledby="customized-dialog-title"
                    open={DisapproveShow}
                    maxWidth="md"
                    fullWidth
                  >
                    <IconButton
                      aria-label="close"
                      onClick={DisapprovehandleClose}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <Iconify icon="carbon:close-outline" />
                    </IconButton>
                    <DialogTitle
                      sx={{ m: 0, p: 2 }}
                      id="customized-dialog-title"
                    >
                      Disapprove Details
                    </DialogTitle>
                    <DialogContent dividers>
                      <Typography gutterBottom>
                        <Stack spacing={2} className="ApproveDailog">
                          <div>
                            <TextField
                              label="Rejected By :"
                              fullWidth
                              defaultValue={RejectedBy}
                              disabled
                            />
                          </div>
                          <div>
                            <DateTimePicker
                              label="Rejected Date :"
                              value={RejectedDate}
                              format="dd/MM/yyyy HH:mm"
                              className="Extrasize"
                              disabled
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </div>
                          <div>
                            <TextField
                              label="RejectedDescription :"
                              variant="outlined"
                              value={RejectedDescription}
                              disabled
                              fullWidth
                            />
                          </div>
                        </Stack>
                      </Typography>
                    </DialogContent>
                  </BootstrapDialog>
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </>
  );
}

EmployeForm.propTypes = {
  currentUser: PropTypes.object,
};

import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
// @bootstrap

import TextareaAutosize from "@mui/material/TextareaAutosize";

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
import { useLocation, useNavigate } from "react-router-dom";

// Toastfy
import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';

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
import Tooltip from "@mui/material/Tooltip";
// utils
import { fData } from "src/utils/format-number";
// routes
import { RouterLink } from "src/routes/components";
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";

// components
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";
import refrencImg from "../../../assets/img/specification.png";
import WorkOrderAssetNo from "../WorkOrderAssetNo";
import APIServices from "src/services/APIServices";
import axios from "axios";

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

export default function WorkRequestForm({ currentUser }) {
  let site_ID = localStorage.getItem("site_ID");
  const location = useLocation();
  //const searchParams = new URLSearchParams(location.search);
  //const RowID = searchParams.get("rowID");
  //const Ast_no = searchParams.get("ast_no");

  const state = location.state || {};
  const { RowID, Ast_no} = state || {};

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const settings = useSettingsContext();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [progress, setProgress] = useState(0);

  const [wkrMstLabel, setWkrMstLabel] = useState([]);
  const [wkrdetLabel, setWkrDetLabel] = useState([]);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [imageSelect, setImageSelect] = useState({ name: "", path: "" });

  const [imguploadStatus, setImguploadStatus] = useState("");
  const [imguploadRefStatus, setImguploadRefStatus] = useState("");

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

  const [UDFNumber_1, setUDFNumber_1] = useState("");
  const [UDFNumber_2, setUDFNumber_2] = useState("");
  const [UDFNumber_3, setUDFNumber_3] = useState("");
  const [UDFNumber_4, setUDFNumber_4] = useState("");
  const [UDFNumber_5, setUDFNumber_5] = useState("");
  const [UDFNumber_6, setUDFNumber_6] = useState("");
  const [UDFNumber_7, setUDFNumber_7] = useState("");
  const [UDFNumber_8, setUDFNumber_8] = useState("");
  const [UDFNumber_9, setUDFNumber_9] = useState("");
  const [UDFNumber_10, setUDFNumber_10] = useState("");

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
  const [data, setdata] = useState([]);
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

  const [Status, setStatus] = useState([]);
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
  const isMyStateEmpty =
    Object.keys(handalImg).length === 0 && handalImg.constructor === Object;

    const [WorkReqMandatoryFiled, setWorkReqMandatoryFiled] = useState([]);
    const [errorField, setErrorField] = useState(null);

    const [isOriginalPriorityEmpty, setIsOriginalPriorityEmpty] = useState(false);
    const [isdescriptionEmpty, setIsdescriptionEmpty] = useState(false);
    const [isChargeCostCenterEmpty, setIsChargeCostCenterEmpty] = useState(false);

    const [steps, setsteps] = useState([]);
    const StatushandleClose = () => setStatusShow(false);
  
    const [StatusShow, setStatusShow] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (RowID !== "" && RowID !== null && RowID !== undefined) {
        setButton_save("Update");
        await getWorkReqLebel();
        await getWorkReqMandatoryfiled();
        await get_workrequest_select();
        await get_workrequest_status(site_ID, "All");
      } else {
        await getWorkReqLebel();
        await getWorkReqMandatoryfiled();
        //   await fetchStatusData();
        await get_workrequest_status(site_ID, "All");
        setButton_save("Save");
      }
      setLoading(false);
    }

    fetchData();
  }, []);
  // Get All Filed label Name
  const getWorkReqLebel = async () => {
    try {
      const response = await httpCommon.get("/getWorkReqFromLebal.php");

      if (response.data.status === "SUCCESS") {
        setWkrMstLabel(response.data.data.wkr_mst);
        setWkrDetLabel(response.data.data.wkr_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Get All Filed label Name
  const getWorkReqMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_work_request_mandatoryFiled.php");
       if (response.data.data.MandatoryField.length > 0) {
        setWorkReqMandatoryFiled(response.data.data.MandatoryField);
        
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const get_workrequest_status = async (site_ID, type, selected_asset) => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false  ,customClass: {
      container: "swalcontainercustom",
    }, });
    Swal.showLoading();

    APIServices.get_dropdown(site_ID, type)
      .then((responseJson) => {
       // console.log("get_dropdown", responseJson);
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
            label: item.ast_mst_asset_no + " : " + item.ast_mst_asset_shortdesc,
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
            label: responseJson.data.data[index].wkr_mst_fault_code + " : " + responseJson.data.data[index].wkr_mst_wr_descs,
          
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
  const handleDeleteImgApi = (ImgIDdlt) => {
    const updatedImages = getDbImg.filter((image) => image.RowID !== ImgIDdlt);
    // Update the state with the new array of images after the deletion
    setDbImg(updatedImages);
    setDbImgRowId(ImgIDdlt);
    setImguploadStatus("NEW_SINGLE_IMG");
    setDisabledBtn(true);
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

  // Thired Api Call
  const fetchImgData = async () => {
    try {
      const response = await httpCommon.get(
        "/get_WorkRequestImg.php?RowID=" + RowID
      );
     // console.log("response____img___request",response);
      if (response.data.data.AllImgGet.length > 0) {
        setDbImg(response.data.data.AllImgGet);
       // setDbImgRowId(response.data.data.AllImgGet[0].RowID);
       setImguploadStatus(response.data.data.AllImgGet[0].ImgStatus);
        setImageSelect({
          name: response.data.data.AllImgGet[0].file_name,
          path: response.data.data.AllImgGet[0].attachment,
        });
      }
      if (response.data.data.AllRef.length > 0) {
        setRefImg(response.data.data.AllRef);
        setImguploadRefStatus(response.data.data.AllRef[0].ImgStatusRef);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
    
    //  get_assetmaster_select(selectedOption.value);

    setSelected_Asset_No(selectedOption);
    // setSelected_Charge_Cost_Center(Charge_Cost_Center[0]);
    // setSelected_Work_Area(Work_Area[0]);
    // setSelected_Asset_Location(Asset_Location[0]);
    // setSelected_Level(Level[0]);
    // setSelected_Work_Group(Work_Group[0]);
  };
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

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = WorkReqMandatoryFiled.find(item => item.column_name === columnName);
    if (foundItem && foundItem.cf_label_required === "1") {
        return "Requiredlabel";
    }
    return "";
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
      marginTop: "10px"
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
  //get WorkOrderAssetNo onther component

  const onClickCancel = () => {
    navigate(`/dashboard/work/list`);
  };
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
 
  const New_WorkRequest = async () => {
    Swal.fire({ title: "Loading.... !", allowOutsideClick: false });
   // Swal.showLoading();
    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    //Select ApprovalStatus
    let ApprovalStatus = localStorage.getItem("wkr_mst_wr_status");
    //console.log("ApprovalStatus: ", ApprovalStatus);

    //Select Originator
    let Originator, setOriginator;
    if (selected_Originator == "" || selected_Originator == null) {
      setOriginator = "";
    } else {
      Originator = selected_Originator.label.split(":");
      setOriginator = Originator[0];
      // console.log("Originator ", Originator[0])
    }

    //Select Original Priority
    let OriginalPriority, setOriginalPriority;
    if (selected_OriginalPriority == "" || selected_OriginalPriority == null) {
      setOriginalPriority = "";
    } else {
      OriginalPriority = selected_OriginalPriority.label.split(":");
      setOriginalPriority = OriginalPriority[0];
      // console.log("OriginalPriority ", OriginalPriority[0])
    }

    //Select Phone
    //console.log("Phone: ", Phone)

    //Select Origination Date
    let date_of_origination = "";
    if (OriginationDate == "" || OriginationDate == null) {
      date_of_origination = "";
    } else {
      date_of_origination = Moment(OriginationDate)
        .utcOffset("+08:00")
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      // console.log("OD ", date_of_origination);
    }

    //Select Fault Code
    let FaultCode, setFaultCode;
    if (selected_FaultCode == "" || selected_FaultCode == null) {
      setFaultCode = "";
    } else {
      FaultCode = selected_FaultCode.label.split(":");
      setFaultCode = FaultCode[0];
      //console.log("FaultCode ", FaultCode[0])
    }

    //Select Due Date
    let date_of_due = "";
    if (DueDate == "" || DueDate == null) {
      date_of_due = "";
    } else {
      date_of_due = Moment(DueDate).format("yyyy-MM-DD HH:mm:ss").trim();
      //console.log("DD ", date_of_due);
    }

    //Select Description
    // console.log("Description: ", Description)

    //Select Asset No
    let Asset_No, setAsset_No;
    if (selected_Asset_No == "" || selected_Asset_No == null) {
      setAsset_No = "";
    } else {
      Asset_No = selected_Asset_No.label.split(":");
      setAsset_No = Asset_No[0];
      //console.log("Asset_No ", Asset_No[0])
    }

    //Select Charge Cost Center
    let Charge_Cost_Center = selected_Charge_Cost_Center.label.split(":");
    // console.log("Charge_Cost_Center: ", Charge_Cost_Center[0])

    //Select Work Area
    let Work_Area, setWork_Area;
    if (selected_Work_Area == "" || selected_Work_Area == null) {
      setWork_Area = "";
    } else {
      Work_Area = selected_Work_Area.label.split(":");
      setWork_Area = Work_Area[0];
      //console.log("Work_Area ", Work_Area[0])
    }

    //Select Work Group
    let Work_Group, setWork_Group;
    if (selected_Work_Group == "" || selected_Work_Group == null) {
      setWork_Group = "";
    } else {
      Work_Group = selected_Work_Group.label.split(":");
      setWork_Group = Work_Group[0];

    }
    //console.log("Work_Group: ", Work_Group[0])

    //Select Asset Location
    let Asset_Location, setAsset_Location;
    if (selected_Asset_Location == "" || selected_Asset_Location == null) {
      setAsset_Location = "";
    } else {
      Asset_Location = selected_Asset_Location.label.split(":");
      setAsset_Location = Asset_Location[0];
      // console.log("Asset_Location ", Asset_Location[0])
    }

    //Select Work Type
    let WorkType, setWorkType;
    if (selected_WorkType == "" || selected_WorkType == null) {
      setWorkType = "";
    } else {
      WorkType = selected_WorkType.label.split(":");
      setWorkType = WorkType[0];
      // console.log("WorkType ", WorkType[0])
    }

    //Select Level
    let Level, setLevel;
    if (selected_Level == "" || selected_Level == null) {
      setLevel = "";
    } else {
      Level = selected_Level.label.split(":");
      setLevel = Level[0];
      //console.log("Level ", Level[0])
    }

    //Select Work Class
    let WorkClass, setWorkClass;
    if (selected_WorkClass == "" || selected_WorkClass == null) {
      setWorkClass = "";
    } else {
      WorkClass = selected_WorkClass.label.split(":");
      setWorkClass = WorkClass[0];
      // console.log("WorkClass ", WorkClass[0])
    }

    //Select ProjectID
    let ProjectID, setProjectID;
    if (selected_ProjectID == "" || selected_ProjectID == null) {
      setProjectID = "";
    } else {
      ProjectID = selected_ProjectID.label.split(":");
      setProjectID = ProjectID[0];
      //console.log("ProjectID ", ProjectID[0])
    }

    //Select Date 1
    let date_1 = "";
    if (UDFDate_1 == "" || UDFDate_1 == null) {
      date_1 = "";
    } else {
      date_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
      // console.log("Date1 ", date_1);
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
    let missingFields = [];

    
    var json_workrequest = {
      site_cd: site_ID,
      wkr_mst_wr_no: WorkRequestNo.trim(),
      wkr_mst_wr_status: ApprovalStatus.trim(),
      wkr_mst_originator: setOriginator.trim(),
      wkr_mst_orig_priority: setOriginalPriority.trim(),
      wkr_mst_phone: Phone.trim(),
      wkr_mst_org_date: date_of_origination,
      wkr_mst_fault_code: setFaultCode.trim(),
      wkr_mst_due_date: date_of_due,
      wkr_mst_wr_descs: Description.trim(),

      wkr_mst_assetno: setAsset_No.trim(),
      wkr_mst_chg_costcenter: Charge_Cost_Center[0].trim(),
      wkr_mst_work_area: setWork_Area.trim(),
      wkr_mst_work_group: setWork_Group,
      wkr_mst_assetlocn: setAsset_Location.trim(),
      wkr_mst_work_type: setWorkType.trim(),
      wkr_mst_location: setLevel.trim(),
      wkr_mst_work_class: setWorkClass.trim(),
      wkr_mst_projectid: setProjectID.trim(),

      wkr_det_note1: UDFNote1 ? UDFNote1.trim() : "",
      wkr_det_note2: UDFNote2 ? UDFNote2.trim() : "",

      wkr_det_varchar1: UDFText_1 ? UDFText_1.trim() : "",
      wkr_det_varchar2: UDFText_2 ? UDFText_2.trim() : "",
      wkr_det_varchar3: UDFText_3 ? UDFText_3.trim() : "",
      wkr_det_varchar4: UDFText_4 ? UDFText_4.trim() : "",
      wkr_det_varchar5: UDFText_5 ? UDFText_5.trim() : "",
      wkr_det_varchar6: UDFText_6 ? UDFText_6.trim() : "",
      wkr_det_varchar7: UDFText_7 ? UDFText_7.trim() : "",
      wkr_det_varchar8: UDFText_8 ? UDFText_8.trim() : "",
      wkr_det_varchar9: UDFText_9 ? UDFText_9.trim() : "",
      wkr_det_varchar10: UDFText_10 ? UDFText_10.trim() : "",
      wkr_det_varchar11: UDFText_11 ? UDFText_11.trim() : "",
      wkr_det_varchar12: UDFText_12 ? UDFText_12.trim() : "",
      wkr_det_varchar13: UDFText_13 ? UDFText_13.trim() : "",
      wkr_det_varchar14: UDFText_14 ? UDFText_14.trim() : "",
      wkr_det_varchar15: UDFText_15 ? UDFText_15.trim() : "",
      wkr_det_varchar16: UDFText_16 ? UDFText_16.trim() : "",
      wkr_det_varchar17: UDFText_17 ? UDFText_17.trim() : "",
      wkr_det_varchar18: UDFText_18 ? UDFText_18.trim() : "",
      wkr_det_varchar19: UDFText_19 ? UDFText_19.trim() : "",
      wkr_det_varchar20: UDFText_20 ? UDFText_20.trim() : "",

      wkr_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : "",
      wkr_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : "",
      wkr_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : "",
      wkr_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : "",
      wkr_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : "",
      wkr_det_numeric6: UDFNumber_6 ? UDFNumber_6.trim() : "",
      wkr_det_numeric7: UDFNumber_7 ? UDFNumber_7.trim() : "",
      wkr_det_numeric8: UDFNumber_8 ? UDFNumber_8.trim() : "",
      wkr_det_numeric9: UDFNumber_9 ? UDFNumber_9.trim() : "",
      wkr_det_numeric10: UDFNumber_10 ? UDFNumber_10.trim() : "",

      wkr_det_datetime1: date_1 ? date_1.trim() : date_1,
      wkr_det_datetime2: date_2 ? date_2.trim() : date_2,
      wkr_det_datetime3: date_3 ? date_3.trim() : date_3,
      wkr_det_datetime4: date_4 ? date_4.trim() : date_4,
      wkr_det_datetime5: date_5 ? date_5.trim() : date_5,
      wkr_det_datetime6: date_6 ? date_6.trim() : date_6,
      wkr_det_datetime7: date_7 ? date_7.trim() : date_7,
      wkr_det_datetime8: date_8 ? date_8.trim() : date_8,
      wkr_det_datetime9: date_9 ? date_9.trim() : date_9,
      wkr_det_datetime10:date_10 ? date_10.trim() : date_10,

      asset_type_ID: AutoNumring.trim(),
      ImgUpload: imageSelect,
      audit_user: emp_mst_login_id.trim(),
      wkr_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
      wkr_mst_create_date: get_date,
      cnt_mst_numbering: AutoNumring,
    };
    console.log("json_workrequest____",json_workrequest);

   // console.log("WorkReqMandatoryFiled____",WorkReqMandatoryFiled);

    for (let i = 0; i < WorkReqMandatoryFiled.length; i++) {
      const item = WorkReqMandatoryFiled[i];
      const fieldValue = json_workrequest[item.column_name];
      if (fieldValue !== null && fieldValue.trim() === "") {
        missingFields = item.customize_label;
        setErrorField(item.column_name);
        break;
      }
    }
    
    // If any fields are missing, display an error message
    if (missingFields.length > 0) {
      Swal.close();
    
        const errorMessage = `Please fill the required field: ${missingFields}`;
        setSnackbarOpen(true);
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
    }else{ 
    try {
      const response = await httpCommon.post(
        "/insert_new_workrequest.php",
        JSON.stringify(json_workrequest)
      );
   //  console.log("response____word_req__",response);
      if (response.data.status === "SUCCESS") {
        Swal.close();
        Swal.fire({
          icon: "success",
          title: response.data.status,
          text: response.data.message,
        }).then(() => {
          navigate(`/dashboard/work/list`);
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
  };

  const Update_WorkRequest = async () => {
    Swal.fire({ title: "Loading.... !", allowOutsideClick: false });
    Swal.showLoading();

    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    //let RowID = localStorage.getItem("RowID");

    //Select ApprovalStatus
    let ApprovalStatus = localStorage.getItem("wkr_mst_wr_status");
    // console.log("ApprovalStatus: ", ApprovalStatus);

    //Select Originator
    let Originator, setOriginator;
    if (selected_Originator == "" || selected_Originator.label == null) {
      setOriginator = "";
    } else {
      Originator = selected_Originator.label.split(":");
      setOriginator = Originator[0];
      // console.log("Originator ", Originator[0])
    }
   
    //Select Original Priority
    let OriginalPriority, setOriginalPriority;
    if (selected_OriginalPriority === "" || selected_OriginalPriority.label === "" || selected_OriginalPriority.label === null) {
      //setOriginalPriority = "";
      setIsOriginalPriorityEmpty(true);
      const errorMessage = 'Please fill the required field Original Priority is required!';
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      Swal.close();
      return;
    } else {
      OriginalPriority = selected_OriginalPriority.label.split(":");
      setOriginalPriority = OriginalPriority[0];
      //console.log("selected_OriginalPriority___",selected_OriginalPriority);
    }

    //Select Phone
    // console.log("Phone: ", Phone)

    //Select Origination Date
    let date_of_origination = "";
    if (OriginationDate == "" || OriginationDate == null) {
      date_of_origination = "";
    } else {
      date_of_origination = Moment(OriginationDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      // console.log("OD ", date_of_origination);
    }

    //Select Fault Code
    let FaultCode, setFaultCode;
    if (selected_FaultCode == "" || selected_FaultCode.label == null) {
      setFaultCode = "";
    } else {
      FaultCode = selected_FaultCode.label.split(":");
      setFaultCode = FaultCode[0];
      // console.log("FaultCode ", FaultCode[0])
    }

    //Select Due Date
    let date_of_due = "";
    if (DueDate == "" || DueDate == null) {
      date_of_due = "";
    } else {
      date_of_due = Moment(DueDate).format("yyyy-MM-DD HH:mm:ss").trim();
      // console.log("DD ", date_of_due);
    }

    //Select Description
    // console.log("Description: ", Description)

    //Select Asset No
    let Asset_No, setAsset_No;
    if (selected_Asset_No == "" || selected_Asset_No.label == null) {
      setAsset_No = "";
    } else {
      Asset_No = selected_Asset_No.label.split(":");
      setAsset_No = Asset_No[0];
      // console.log("Asset_No ", Asset_No[0])
    }

    //Select Charge Cost Center
    let Charge_Cost_Center, setChargeCost_Center
    //= selected_Charge_Cost_Center.label.split(":");
    if (selected_Charge_Cost_Center == "" || selected_Charge_Cost_Center.label === "" || selected_Charge_Cost_Center.label == null) {
      //setChargeCost_Center = "";
      setIsChargeCostCenterEmpty(true);
      const errorMessage = 'Please fill the required field Charge Cost Center is required!';
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      Swal.close();
      return;
    } else {
      Charge_Cost_Center = selected_Charge_Cost_Center.label.split(":");
      setChargeCost_Center = Charge_Cost_Center[0];
      //  console.log("Work_Area ", Work_Area[0])
    }

    //Select Work Area
    let Work_Area, setWork_Area;
    if (selected_Work_Area == "" || selected_Work_Area.label == null) {
      setWork_Area = "";
    } else {
      Work_Area = selected_Work_Area.label.split(":");
      setWork_Area = Work_Area[0];
      //  console.log("Work_Area ", Work_Area[0])
    }

    //Select Work Group selected_Work_Group
    // let Work_Group = selected_Work_Group.label.split(":")
    let Work_Group, setWork_Group;
    if (selected_Work_Group.label == "" || selected_Work_Group.label == null) {
      setWork_Group = "";
    } else {
      Work_Group = selected_Work_Group.label.split(":");
      setWork_Group = Work_Group[0];
    }

    //Select Asset Location
    let Asset_Location, setAsset_Location;
    if (selected_Asset_Location == "" || selected_Asset_Location.label == null) {
      setAsset_Location = "";
    } else {
      Asset_Location = selected_Asset_Location.label.split(":");
      setAsset_Location = Asset_Location[0];
      //console.log("Asset_Location ", Asset_Location[0])
    }

    //Select Work Type
    let WorkType, setWorkType;
    if (selected_WorkType.label == "" || selected_WorkType.label == null) {
      setWorkType = "";
    } else {
      WorkType = selected_WorkType.label.split(":");
      setWorkType = WorkType[0];
      //console.log("WorkType ", WorkType[0])
    }

    //Select Level
    let Level, setLevel;
    if (selected_Level == "" || selected_Level.label == null) {
      setLevel = "";
    } else {
      Level = selected_Level.label.split(":");
      setLevel = Level[0];
      // console.log("Level ", Level[0])
    }

    //Select Work Class
    let WorkClass, setWorkClass;
    if (selected_WorkClass.label == "" || selected_WorkClass.label == null) {
      setWorkClass = "";
    } else {
      WorkClass = selected_WorkClass.label.split(":");
      setWorkClass = WorkClass[0];
      //console.log("WorkClass ", WorkClass[0])
    }

    //Select ProjectID
    let ProjectID, setProjectID;
    if (selected_ProjectID.label == "" || selected_ProjectID.label == null) {
      setProjectID = "";
    } else {
      ProjectID = selected_ProjectID.label.split(":");
      setProjectID = ProjectID[0];
      // console.log("ProjectID ", ProjectID[0])
    }
   
    //Select Date 1
    let date_1 = "";
    if (UDFDate_1 == "" || UDFDate_1 == null) {
      date_1 = "";
    } else {
      date_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("Date1 ", date_1);
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
      // console.log("Date3 ", date_3);
    }

    //Select Date 4
    let date_4 = "";
    if (UDFDate_4 == "" || UDFDate_4 == null) {
      date_4 = "";
    } else {
      date_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
      // console.log("Date4 ", date_4);
    }

    //Select Date 5
    let date_5 = "";
    if (UDFDate_5 == "" || UDFDate_5 == null) {
      date_5 = "";
    } else {
      date_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("Date5 ", date_5);
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
      // console.log("Date7 ", date_7);
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
      //console.log("Date10 ", date_10);
    }
    //Check Img state
    let setDbImgRowIdUpdate;
    if (getDbImgRowId == "" || getDbImgRowId == null) {
      setDbImgRowIdUpdate = "";
    } else {
      setDbImgRowIdUpdate = getDbImgRowId;
    }

  
    let setDescriptionAdd = "";
    if (Description == "" || Description == null) {
      setIsdescriptionEmpty(true);
      const errorMessage = 'Please fill the required field Description is required!';
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      Swal.close();
      return;
    } else {
      setDescriptionAdd = Description;
      //console.log("Date9 ", date_9);
    }


    let missingFields = [];

    var json_updateworkrequest = {
      site_cd: site_ID,
      wkr_mst_wr_no: WorkRequestNo?.trim() ?? "",
      wkr_mst_wr_status: ApprovalStatus?.trim() ?? "",
      wkr_mst_originator: setOriginator.trim(),
      wkr_mst_orig_priority: setOriginalPriority,
      wkr_mst_phone: Phone?.trim() ?? "",
      wkr_mst_org_date: date_of_origination,
      wkr_mst_fault_code: setFaultCode.trim(),
      wkr_mst_due_date: date_of_due,
      wkr_mst_wr_descs: setDescriptionAdd,

      wkr_mst_assetno: setAsset_No.trim(),
      wkr_mst_chg_costcenter: setChargeCost_Center.trim(),
      wkr_mst_work_area: setWork_Area.trim(),
      wkr_mst_work_group: Work_Group[0].trim(),
      wkr_mst_assetlocn: setAsset_Location.trim(),
      wkr_mst_work_type: setWorkType.trim(),
      wkr_mst_location: setLevel.trim(),
      wkr_mst_work_class: setWorkClass.trim(),
      wkr_mst_projectid: setProjectID.trim(),
      
      wkr_det_note1: UDFNote1 ? UDFNote1.trim() : "",
      wkr_det_note2: UDFNote2 ? UDFNote2.trim() : "",
      wkr_det_varchar1: UDFText_1 ? UDFText_1.trim() : "",
      wkr_det_varchar2: UDFText_2 ? UDFText_2.trim() : "",
      wkr_det_varchar3: UDFText_3 ? UDFText_3.trim() : "",
      wkr_det_varchar4: UDFText_4 ? UDFText_4.trim() : "",
      wkr_det_varchar5: UDFText_5 ? UDFText_5.trim() : "",
      wkr_det_varchar6: UDFText_6 ? UDFText_6.trim() : "",
      wkr_det_varchar7: UDFText_7 ? UDFText_7.trim() : "",
      wkr_det_varchar8: UDFText_8 ? UDFText_8.trim() : "",
      wkr_det_varchar9: UDFText_9 ? UDFText_9.trim() : "",
      wkr_det_varchar10: UDFText_10 ? UDFText_10.trim() : "",
      wkr_det_varchar11: UDFText_11 ? UDFText_11.trim() : "",
      wkr_det_varchar12: UDFText_12 ? UDFText_12.trim() : "",
      wkr_det_varchar13: UDFText_13 ? UDFText_13.trim() : "",
      wkr_det_varchar14: UDFText_14 ? UDFText_14.trim() : "",
      wkr_det_varchar15: UDFText_15 ? UDFText_15.trim() : "",
      wkr_det_varchar16: UDFText_16 ? UDFText_16.trim() : "",
      wkr_det_varchar17: UDFText_17 ? UDFText_17.trim() : "",
      wkr_det_varchar18: UDFText_18 ? UDFText_18.trim() : "",
      wkr_det_varchar19: UDFText_19 ? UDFText_19.trim() : "",
      wkr_det_varchar20: UDFText_20 ? UDFText_20.trim() : "",

      wkr_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : "",
      wkr_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : "",
      wkr_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : "",
      wkr_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : "",
      wkr_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : "",
      wkr_det_numeric6: UDFNumber_6 ? UDFNumber_6.trim() : "",
      wkr_det_numeric7: UDFNumber_7 ? UDFNumber_7.trim() : "",
      wkr_det_numeric8: UDFNumber_8 ? UDFNumber_8.trim() : "",
      wkr_det_numeric9: UDFNumber_9 ? UDFNumber_9.trim() : "",
      wkr_det_numeric10: UDFNumber_10 ? UDFNumber_10.trim() : "",

      wkr_det_datetime1: date_1 ? date_1.trim() : date_1,
      wkr_det_datetime2: date_2 ? date_2.trim() : date_2,
      wkr_det_datetime3: date_3 ? date_3.trim() : date_3,
      wkr_det_datetime4: date_4 ? date_4.trim() : date_4,
      wkr_det_datetime5: date_5 ? date_5.trim() : date_5,
      wkr_det_datetime6: date_6 ? date_6.trim() : date_6,
      wkr_det_datetime7: date_7 ? date_7.trim() : date_7,
      wkr_det_datetime8: date_8 ? date_8.trim() : date_8,
      wkr_det_datetime9: date_9 ? date_9.trim() : date_9,
      wkr_det_datetime10:date_10 ? date_10.trim() : date_10,
      SingleImguploadStatus:imguploadStatus,
      ImguploadRefStatus:imguploadRefStatus ? imguploadRefStatus :"EMPTY",
      ImgUpload: imageSelect,
      ImgGetDbImgRowId: setDbImgRowIdUpdate,
      removedRefItems: removedRefItems,
      asset_type_ID: AutoNumring.trim(),
      audit_user: emp_mst_login_id.trim(),
      wkr_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
      wkr_mst_create_date: get_date,
      RowID: RowID,
    };
   // console.log("json_workrequest_update",json_updateworkrequest);
    for (let i = 0; i < WorkReqMandatoryFiled.length; i++) {
      const item = WorkReqMandatoryFiled[i];
      const fieldValue = json_updateworkrequest[item.column_name];
      if (fieldValue !== null && fieldValue.trim() === "") {
        missingFields = item.customize_label;
        setErrorField(item.column_name);
        break;
      }
    }
    
    // If any fields are missing, display an error message
    if (missingFields.length > 0) {
      Swal.close();
    
        const errorMessage = `Please fill the required field: ${missingFields}`;
        setSnackbarOpen(true);
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
    }else{
    try {
      const response = await httpCommon.post(
        "/update_workrequest.php",
        JSON.stringify(json_updateworkrequest)
      );
     // console.log("update____",response);
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
              "/insert_work_request_reference_multiImg_upload.php",
              formData,
              {
                headers: {
                    'Content-Type': 'multipart/form-data' // Ensure proper content type
                }
            }
            );
          //  console.log("response____multipal__",response);
            if (response.data.status == "SUCCESS") {
              Swal.close();
              Swal.fire({
                icon: "success",
                title: response.data.status,
                text: response.data.message,
              }).then(() => {
                navigate(`/dashboard/work/list`);
              });
            }
          } catch (error) {
            console.log("error__", error);
            //Handle error
          }
        } else {
          Swal.close();
          Swal.fire({
            icon: "success",
            title: response.data.status,
            text: response.data.message,
          }).then(() => {
            if (response.data.status === "SUCCESS") {
              navigate(`/dashboard/work/list`);
            }
            
          });
        }
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
        title: "Oops Data Not Updated...",
        text: error,
      });
    }
  }
  };
  const onClickChange = (event) => {
    event.preventDefault();
   // setShowErrorBorder(false);
    if (selected_OriginalPriority == "" || selected_OriginalPriority == null) {
   
      setIsOriginalPriorityEmpty(true);
      const errorMessage = 'Please fill the required field Original Priority is required!';
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');

    }else if(Description == "" || Description == null){

      setIsdescriptionEmpty(true);
      const errorMessage = 'Please fill the required field Description is required!';
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');

    }else if(selected_Charge_Cost_Center == "" || selected_Charge_Cost_Center == null){

      setIsChargeCostCenterEmpty(true);
      const errorMessage = 'Please fill the required field Charge Cost Center is required!';
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');

    }else{
    
    if (Button_save === "Save") {
        New_WorkRequest();
    } else if (Button_save === "Update") {
        Update_WorkRequest();
    }
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
    console.log("enter_getSteps___");
   Swal.fire({ title: "Please Wait !", allowOutsideClick: false , customClass: {
     container: "swalcontainercustom",
   }, });
   Swal.showLoading();

   try {

     const responseJson = await httpCommon.get(
       `/get_work_request_approve_status.php?site_cd=${site_ID}&RowID=${RowID}`
     );
      console.log("responseJson___audit",responseJson);
     if (responseJson.data.status === "SUCCESS") {
       // console.log('get_workordermaster_statusaudit', responseJson.data.data)

       let Status = responseJson.data.data.map((item, index) => {

        let approvedBy;
        let date
        let approvedworkOrderNo;
        let approvedworkStatus;
        let rejectedBy;
        let rejecteeDesc;

        if(item.wkr_mst_wr_status === "A"){
          date = new Date(item.wkr_det_appr_date.date);
          approvedBy = item.wkr_det_approver;
          approvedworkStatus = item.wkr_mst_wr_status; 
          approvedworkOrderNo = item.wkr_det_wo;

        }else if(item.wkr_mst_wr_status === "D"){
          date = new Date(item.wkr_det_reject_date.date);
          rejectedBy = item.wkr_det_reject_by;
          rejecteeDesc = item.wkr_det_reject_desc;
        }
      // Fri
       
      let formattedDate = date.toLocaleDateString("en-GB"); 
      let formattedTime = date.toLocaleString("default", {
        hour: "numeric",
        minute: "numeric",
        hour12: true, // 3:37 PM
      });
      let formattedWeekday = date.toLocaleString("default", { weekday: "short" });
         return {
           label: approvedBy,
           label1: approvedworkStatus,
           label2: approvedworkOrderNo,
           label3: item.audit_user,
           label4: `${formattedWeekday} ${formattedDate} ${formattedTime}`,
           label5: formatDuration(item.duration),
           label6: rejectedBy,
           label7: rejecteeDesc,
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
     Swal.fire({
       icon: "error",
       title: "oops something went wrong...",
       text: error,
     });
   }
 };
  const StatushandleShow = () => {
    setStatusShow(true);
    getsteps();
  };
  const getInputStatusClass = () => {
    switch (ApprovalStatus) {
        case 'D':
            return 'customInputStatusD';
        case 'A':
            return 'customInputStatusA';
        case 'W':
            return 'customInputStatusW';
        default:
            return '';
    }
};
  return (
    <>
     <Helmet>
        <title>
          {RowID
            ? "CMMS System"
            : "CMMS System"}
        </title>
        <meta name="description" content="Create Work Request" />
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
            heading={
              RowID
                ? `Update ${WorkRequestNo? WorkRequestNo: ""} Work Request`
                : "Create New Work Request"
            }
            links={[
              {
                name: "Work Request",
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
                      className="SaveButton"
                      startIcon={<Iconify icon="mingcute:save-fill" />}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        marginRight: "10px",
                      }}
                      // disabled={Status.some(
                      //   (item) =>
                      //     item.key ===
                      //       (
                      //         selected_Status?.label?.split(" : ")[2] ?? ""
                      //       ).trim() && item.key === "CLOSE"
                      // )}
                    
                      disabled={ApprovalStatus && ApprovalStatus === "A" || ApprovalStatus === "D"}
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
            sx={{ mb: { xs: 3, md: 5 } }}
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
                       {/* ************************************* img web******************************************* */}
                      <div className="col-md-2 mobileImgversion">
                        <div className="row">
                          <div className="row ImgShowMobile">
                            <div>
                              <label htmlFor="upload-button">
                                {getDbImg && getDbImg.length > 0 ? (
                                  <div>
                                    <img
                                     src={getDbImg[0].attachment ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}` :""}
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
                                       src={getDbImg[0].attachment ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}` :""}
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
                          <Typography variant="subtitle2" className="Requiredlabel">
                            {findCustomizeLabel("wkr_mst_wr_no") ||
                              "Work Request No"}
                          </Typography>
                          <TextField
                            name="name"
                            size="small"
                            disabled
                            defaultValue={WorkRequestNo}
                            className="ExtrasizeDisable"
                          />
                        </Stack>
                        <Box
                          rowGap={2}
                          columnGap={1}
                          display="grid"
                          gridTemplateColumns={{
                            xs: "95%",
                            sm: "95% 10%",
                          }}
                            >
                        <Stack flexGrow={1} spacing={1}>
                          <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_wr_status")}>
                            {findCustomizeLabel("wkr_mst_wr_status") ||
                              "Approval Status"}
                          </Typography>
                          <Box display="flex" alignItems="center">
                          <Box display="flex" alignItems="center" flexGrow={1}>
                            
                            <Button
                              id="outlined-basic"
                              size="small"
                              variant="outlined"
                              className={`${errorField === "wkr_mst_wr_status"? "erroBorderadd" : ""} ${getInputStatusClass()}`}
                              onClick={StatushandleShow}
                              disabled={Button_save === "Save" || ApprovalStatus === "W"}
                              >
                              {ApprovalStatus? (approvalStatusMap[ApprovalStatus] || ApprovalStatus) : 'Awaiting (W)'}
                            </Button>
                           {(ApprovalStatus === 'A' || ApprovalStatus === 'D') && <span className="spanworkReqStstus">Read Only</span>}
                            </Box>
                            
                                </Box>
                         
                        </Stack>
                        </Box>
                        
                       
                        <Stack spacing={1}>
                        
                          <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_originator")}>
                            {findCustomizeLabel("wkr_mst_originator") ||
                              "Originator"}
                          </Typography>
                        
                          <Autocomplete
                            options={Originator}
                            defaultValue={selected_Originator ? selected_Originator.label : ''}
                            onChange={(event, value) => {
                              setSelected_Originator(value);
                              setErrorField(null); 
                            }}
                            renderInput={(params) => (
                              <div>
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  className={errorField === "wkr_mst_originator" ? "erroBorderadd" : "Extrasize"}
                                  
                                />
                              </div>
                            )}
                          />
                        </Stack>
                        <Stack spacing={1}>
                       
                          <Typography variant="subtitle2" className="Requiredlabel">
                            {findCustomizeLabel("wkr_mst_orig_priority") ||
                              "Original Priority"}{" "}
                            
                          </Typography>
                          
                          <Autocomplete
                            options={OriginalPriority}
                            defaultValue={selected_OriginalPriority ? selected_OriginalPriority.label : ''}
                            onChange={(event, value) => {
                              setSelected_OriginalPriority(value);
                              setIsOriginalPriorityEmpty(false);
                            }}
                            renderInput={(params) => (
                              <div>
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  //  className="Extrasize"
                                  className={`Extrasize ${
                                    isOriginalPriorityEmpty
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                />
                              </div>
                            )}
                          />
                        </Stack>
                        

                        <Stack spacing={1}>
                          <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_phone")}>
                            {findCustomizeLabel("wkr_mst_phone") || "Phone"}
                          </Typography>
                          <TextField
                            
                            id="outlined-basic"
                            size="small"
                            variant="outlined"
                            className={errorField === "wkr_mst_phone" ? "erroBorderadd" : "Extrasize"}
                            fullWidth
                            defaultValue={Phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setErrorField(null); 
                            }}
                          />
                        </Stack>
                        <Stack spacing={1}>
                          <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_org_date")}>
                            {findCustomizeLabel("wkr_mst_org_date") ||
                              "Origination Date"}
                          </Typography>

                          <DateTimePicker
                            value={OriginationDate}
                            format="dd/MM/yyyy HH:mm"
                            className={errorField === "wkr_mst_phone" ? "erroBorderadd" : "Extrasize"}
                            onChange={(newDate) => {
                              setOriginationDate(newDate); // Update your state with the new value
                              setErrorField(null); 
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                              },
                            }}
                          />
                        </Stack>
                        <Stack spacing={1}>
                          <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_fault_code")}>
                            {findCustomizeLabel("wkr_mst_fault_code") ||
                              "Fault Code"}{" "}
                           
                          </Typography>
                          <Autocomplete
                            options={FaultCode}
                            defaultValue={selected_FaultCode ? selected_FaultCode.label : ''}
                            onChange={(event, value) => {
                              handleSelectedFaultCode(value);
                              setErrorField(null); 
                            }}
                            renderInput={(params) => (
                              <div>
                                <TextField
                                  {...params}
                                  placeholder="Select..."
                                  variant="outlined"
                                  size="small"
                                  className={errorField === "wkr_mst_fault_code" ? "erroBorderadd" : "Extrasize"}
                                />
                              </div>
                            )}
                          />
                        </Stack>
                        <Stack spacing={1}>
                          <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_due_date")}>
                            {findCustomizeLabel("wkr_mst_due_date") ||
                              "Due Date"}
                          </Typography>

                          <DateTimePicker
                            value={DueDate}
                            format="dd/MM/yyyy HH:mm"
                            className={errorField === "wkr_mst_due_date" ? "erroBorderadd" : "Extrasize"}
                            onChange={(newDate) => {
                              setDueDate(newDate); // Update your state with the new value
                              setErrorField(null); 
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                              },
                            }}
                          />
                        </Stack>
                      </Box>
                      <Grid item xs={12} className="wkrTxt">
                        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                          <Typography variant="subtitle2" className="Requiredlabel">
                            {findCustomizeLabel("wkr_mst_wr_descs") ||
                              "Description"}{" "}
                            
                          </Typography>

                          <TextareaAutosize
                            aria-label="empty textarea"
                            placeholder={
                              findCustomizeLabel("wkr_mst_wr_descs") ||
                              "Description"
                            }

                            style={{ width: "100%" }}
                            minRows={6.5}
                            defaultValue={Description}
                            onChange={(e) => {
                              setDescription(e.target.value);
                              setIsdescriptionEmpty(false);
                              
                            }}
                          
                            className={`Extrasize ${
                              isdescriptionEmpty
                                ? "errorEmpty"
                                : "TxtAra"
                            }`}
                          />
                        </Stack>
                      </Grid>
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
                        {/* ************************************* img web ******************************************* */}

                        <div className="col-md-2">
                          <div className="row">
                            <div className="row ImgShowMobile">
                              <div>
                                <label htmlFor="upload-button">
                                  {getDbImg && getDbImg.length > 0 ? (
                                    <div>
                                      <img
                                       src={getDbImg[0].attachment ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}` :""}
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
                                          src={require("../../../assets/img/Add_Image_icon.png")}
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
                                        src={getDbImg[0].attachment ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}` :""}
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
                              icon="material-symbols:date-range-outline"
                              style={{ marginRight: "4px" }}
                            />
                            List 1
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
                            List 2
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
                        <Grid item xs={12} sm={4}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_assetno")}>
                              {findCustomizeLabel("wkr_mst_assetno") ||
                                "Asset No"}
                            </Typography>
                            <Autocomplete
                              options={Asset_No}
                              defaultValue={selected_Asset_No ? selected_Asset_No.label : ''} 
                              onChange={(event, value) => {
                                handleSelectedAssetNo(value);
                                setErrorField(null); 
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    placeholder="Select..."
                                    variant="outlined"
                                    size="small"
                                    className={errorField === "wkr_mst_assetno" ? "erroBorderadd" : "Extrasize"}
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" className="Requiredlabel">
                              {findCustomizeLabel("wkr_mst_chg_costcenter") ||
                                "Charge Cost Center"}{" "}
                              
                            </Typography>
                            <Autocomplete
                              options={Charge_Cost_Center}
                              defaultValue={selected_Charge_Cost_Center ? selected_Charge_Cost_Center.label : ''}
                              onChange={(event, value) => {
                                setSelected_Charge_Cost_Center(value);
                                setIsChargeCostCenterEmpty(false);
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className={`Extrasize ${
                                      isChargeCostCenterEmpty
                                        ? "errorEmpty"
                                        : ""
                                    }`}
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_work_area")}>
                              {findCustomizeLabel("wkr_mst_work_area") ||
                                "Work Area"}
                            </Typography>
                            <Autocomplete
                              options={Work_Area}
                              defaultValue={selected_Work_Area ? selected_Work_Area.label : ''}
                              onChange={(event, value) => {
                                setSelected_Work_Area(value);
                                setErrorField(null); 
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className={errorField === "wkr_mst_work_area" ? "erroBorderadd" : "Extrasize"}
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_work_group")}>
                              {findCustomizeLabel("wkr_mst_work_group") ||
                                "Work Group"}{" "}
                              
                            </Typography>
                            <Autocomplete
                              options={Work_Group}
                              defaultValue={selected_Work_Group ? selected_Work_Group.label : ''}
                              onChange={(event, value) => {
                                setSelected_Work_Group(value);
                                setErrorField(null); 
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className={errorField === "wkr_mst_work_group" ? "erroBorderadd" : "Extrasize"}
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_assetlocn")}>
                              {findCustomizeLabel("wkr_mst_assetlocn") ||
                                "Asset Location"}
                            </Typography>
                            <Autocomplete
                              options={Asset_Location}
                              defaultValue={selected_Asset_Location ? selected_Asset_Location.label : ''}
                              onChange={(event, value) => {
                                setSelected_Asset_Location(value);
                                setErrorField(null); 
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className={errorField === "wkr_mst_assetlocn" ? "erroBorderadd" : "Extrasize"}
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_work_type")}>
                              {findCustomizeLabel("wkr_mst_work_type") ||
                                "Work Type"}
                            </Typography>
                            
                            <Autocomplete
                              options={WorkType}
                              defaultValue={selected_WorkType ? selected_WorkType.label : ''}
                              onChange={(event, value) => {
                                setSelected_WorkType(value);
                                setErrorField(null); 
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className={errorField === "wkr_mst_work_type" ? "erroBorderadd" : "Extrasize"}
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_location")}>
                              {findCustomizeLabel("wkr_mst_location") ||
                                "Level"}
                            </Typography>
                            <Autocomplete
                              options={Level}
                              
                              defaultValue={selected_Level ? selected_Level.label : ''}
                              onChange={(event, value) => {
                                setSelected_Level(value);
                                setErrorField(null); 
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className={errorField === "wkr_mst_location" ? "erroBorderadd" : "Extrasize"}
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_work_class")}>
                              {findCustomizeLabel("wkr_mst_work_class") ||
                                "Work Class"}
                            </Typography>
                            <Autocomplete
                              options={WorkClass}
                              defaultValue={selected_WorkClass ? selected_WorkClass.label : ''}
                              onChange={(event, value) => {
                                setSelected_WorkClass(value);
                                setErrorField(null); 
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className={errorField === "wkr_mst_work_class" ? "erroBorderadd" : "Extrasize"}
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_mst_projectid")}>
                              {findCustomizeLabel("wkr_mst_projectid") ||
                                "Project ID"}
                            </Typography>
                            <Autocomplete
                              options={ProjectID}
                              defaultValue={selected_ProjectID ? selected_ProjectID.label : ''}
                              onChange={(event, value) => {
                                setSelected_ProjectID(value);
                                setErrorField(null); 
                              }}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className={errorField === "wkr_mst_projectid" ? "erroBorderadd" : "Extrasize"}
                                  />
                                </div>
                              )}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_note1")}>
                              {findCustomizeLabelDet("wkr_det_note1") ||
                                "Note1"}
                            </Typography>
                            <TextareaAutosize
                              aria-label="empty textarea"
                              placeholder="Note1"
                              defaultValue={UDFNote1}
                              minRows={6.5}
                              className={errorField === "wkr_det_note1" ? "erroBorderadd" : "TxtAra"}
                              style={{ width: "100%" }} // Make it full-width
                              onChange={(e) => {
                                setUDFNote1(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar1")}>
                              {findCustomizeLabelDet("wkr_det_varchar1") ||
                                "Varchar1"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_varchar1" ? "erroBorderadd" : "Extrasize"}
                              fullWidth
                              defaultValue={UDFText_1}
                              onChange={(e) => {
                                setUDFText_1(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar2")}>
                              {findCustomizeLabelDet("wkr_det_varchar2") ||
                                "Varchar2"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_varchar2" ? "erroBorderadd" : "Extrasize"}
                              fullWidth
                              defaultValue={UDFText_2}
                              onChange={(e) => {
                                setUDFText_2(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar3")}>
                              {findCustomizeLabelDet("wkr_det_varchar3") ||
                                "Varchar3"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_varchar3" ? "erroBorderadd" : "Extrasize"}
                              fullWidth
                              defaultValue={UDFText_3}
                              onChange={(e) => {
                                setUDFText_3(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar4")}>
                              {findCustomizeLabelDet("wkr_det_varchar4") ||
                                "Varchar4"}
                            </Typography>
                            <TextField
                             size="small"
                             variant="outlined"
                             className={errorField === "wkr_det_varchar4" ? "erroBorderadd" : "Extrasize"}
                             fullWidth
                              defaultValue={UDFText_4}
                              onChange={(e) => {
                                setUDFText_4(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar5")}>
                              {findCustomizeLabelDet("wkr_det_varchar5") ||
                                "Varchar5"}
                            </Typography>
                            <TextField
                             size="small"
                             variant="outlined"
                             className={errorField === "wkr_det_varchar5" ? "erroBorderadd" : "Extrasize"}
                             fullWidth
                              defaultValue={UDFText_5}
                              onChange={(e) => {
                                setUDFText_5(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar6")}>
                              {findCustomizeLabelDet("wkr_det_varchar6") ||
                                "Varchar6"}
                            </Typography>
                            <TextField
                             size="small"
                             variant="outlined"
                             className={errorField === "wkr_det_varchar6" ? "erroBorderadd" : "Extrasize"}
                             fullWidth
                              defaultValue={UDFText_6}
                              onChange={(e) => {
                                setUDFText_6(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar7")}>
                              {findCustomizeLabelDet("wkr_det_varchar7") ||
                                "Varchar7"}
                            </Typography>
                            <TextField
                             size="small"
                             variant="outlined"
                             className={errorField === "wkr_det_varchar7" ? "erroBorderadd" : "Extrasize"}
                             fullWidth
                              defaultValue={UDFText_7}
                              onChange={(e) => {
                                setUDFText_7(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                           <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar8")}>
                                {findCustomizeLabelDet("wkr_det_varchar8") ||
                                  "Varchar8"}
                              </Typography>
                              <TextField
                                size="small"
                                variant="outlined"
                                className={errorField === "wkr_det_varchar8" ? "erroBorderadd" : "Extrasize"}
                                fullWidth
                                defaultValue={UDFText_8}
                                onChange={(e) => {
                                  setUDFText_8(e.target.value);
                                  setErrorField(null); 
                                }}
                              />
                            </Stack>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar9")}>
                              {findCustomizeLabelDet("wkr_det_varchar9") ||
                                "Varchar9"}
                            </Typography>
                            <TextField
                             size="small"
                             variant="outlined"
                             className={errorField === "wkr_det_varchar9" ? "erroBorderadd" : "Extrasize"}
                             fullWidth
                              defaultValue={UDFText_9}
                              onChange={(e) => {
                                setUDFText_9(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar10")}>
                              {findCustomizeLabelDet("wkr_det_varchar10") ||
                                "Varchar10"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_varchar10" ? "erroBorderadd" : "Extrasize"}
                              fullWidth
                              defaultValue={UDFText_10}
                              onChange={(e) => {
                                setUDFText_10(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_numeric1")}>
                              {findCustomizeLabelDet("wkr_det_numeric1") ||
                                "Numeric1"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_numeric1" ? "erroBorderadd" : "Extrasize"}
                              fullWidth
                               placeholder=".0000"
                              defaultValue={UDFNumber_1}
                              onChange={(e) => {
                                setUDFNumber_1(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_numeric2")}>
                              {findCustomizeLabelDet("wkr_det_numeric2") ||
                                "Numeric2"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_numeric2" ? "erroBorderadd" : "Extrasize"}
                              fullWidth
                               placeholder=".0000"
                              defaultValue={UDFNumber_2}
                              onChange={(e) => {
                                setUDFNumber_2(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_numeric3")}>
                              {findCustomizeLabelDet("wkr_det_numeric3") ||
                                "Numeric3"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_numeric3" ? "erroBorderadd" : "Extrasize"}
                              fullWidth
                               placeholder=".0000"
                              defaultValue={UDFNumber_3}
                              onChange={(e) => {
                                setUDFNumber_3(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_numeric4")}>
                              {findCustomizeLabelDet("wkr_det_numeric4") ||
                                "Numeric4"}
                            </Typography>
                            <TextField
                             size="small"
                             variant="outlined"
                             className={errorField === "wkr_det_numeric4" ? "erroBorderadd" : "Extrasize"}
                             fullWidth
                              placeholder=".0000"
                              defaultValue={UDFNumber_4}
                              onChange={(e) => {
                                setUDFNumber_4(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_numeric5")}>
                              {findCustomizeLabelDet("wkr_det_numeric5") ||
                                "Numeric5"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_numeric5" ? "erroBorderadd" : "Extrasize"}
                              fullWidth
                               placeholder=".0000"
                              defaultValue={UDFNumber_5}
                              onChange={(e) => {
                                setUDFNumber_5(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_datetime1")}>
                              {findCustomizeLabelDet("wkr_det_datetime1") ||
                                "Datetime1"}
                            </Typography>

                            <DateTimePicker
                              value={UDFDate_1}
                              format="dd/MM/yyyy HH:mm"
                              className={errorField === "wkr_det_datetime1" ? "erroBorderadd" : "Extrasize"}
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
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_datetime2")}>
                              {findCustomizeLabel("wkr_det_datetime2") ||
                                "Datetime2"}
                            </Typography>

                            <DateTimePicker
                              value={UDFDate_2}
                              format="dd/MM/yyyy HH:mm"
                              className={errorField === "wkr_det_datetime2" ? "erroBorderadd" : "Extrasize"}
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
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_datetime3")}>
                              {findCustomizeLabel("wkr_det_datetime3") ||
                                "Datetime3"}
                            </Typography>

                            <DateTimePicker
                              value={UDFDate_3}
                              format="dd/MM/yyyy HH:mm"
                              className={errorField === "wkr_det_datetime3" ? "erroBorderadd" : "Extrasize"}
                              onChange={(newDate) => {
                                setUDFDate_3(newDate); // Update your state with the new value
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
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_datetime4")}>
                              {findCustomizeLabel("wkr_det_datetime4") ||
                                "Datetime4"}
                            </Typography>

                            <DateTimePicker
                              value={UDFDate_4}
                              format="dd/MM/yyyy HH:mm"
                              className={errorField === "wkr_det_datetime4" ? "erroBorderadd" : "Extrasize"}
                              onChange={(newDate) => {
                                setUDFDate_4(newDate); // Update your state with the new value
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
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_datetime5")}>
                              {findCustomizeLabel("wkr_det_datetime5") ||
                                "Datetime5"}
                            </Typography>

                            <DateTimePicker
                              value={UDFDate_5}
                              format="dd/MM/yyyy HH:mm"
                              className={errorField === "wkr_det_datetime5" ? "erroBorderadd" : "Extrasize"}

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
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_note2")}>
                              {findCustomizeLabelDet("wkr_det_note2") ||
                                "Note2"}
                            </Typography>
                            <TextareaAutosize
                              aria-label="empty textarea"
                              placeholder={
                                findCustomizeLabelDet("wkr_det_note2") ||
                                "Note2"
                              }
                              minRows={6.5}
                              className={errorField === "wkr_det_note2" ? "erroBorderadd" : "TxtAra"} 
                              style={{ width: "100%" }} // Make it full-width
                              defaultValue={UDFNote2}
                              onChange={(e) => {
                                setUDFNote2(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar11")}>
                              {findCustomizeLabelDet("wkr_det_varchar11") ||
                                "Varchar11"}
                            </Typography>
                            <TextField
                             size="small"
                             variant="outlined"
                             className={errorField === "wkr_det_varchar11" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFText_11}
                              onChange={(e) => {
                                setUDFText_11(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar12")}>
                              {findCustomizeLabelDet("wkr_det_varchar12") ||
                                "Varchar12"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_varchar12" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFText_12}
                              onChange={(e) => {
                                setUDFText_12(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar13")}>
                              {findCustomizeLabelDet("wkr_det_varchar13") ||
                                "Varchar13"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_varchar13" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFText_13}
                              onChange={(e) => {
                                setUDFText_13(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar14")}>
                              {findCustomizeLabelDet("wkr_det_varchar14") ||
                                "Varchar14"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_varchar14" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFText_14}
                              onChange={(e) => {
                                setUDFText_14(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar15")}>
                              {findCustomizeLabelDet("wkr_det_varchar15") ||
                                "Varchar15"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_varchar15" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFText_15}
                              onChange={(e) => {
                                setUDFText_15(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar16")}>
                              {findCustomizeLabelDet("wkr_det_varchar16") ||
                                "Varchar16"}
                            </Typography>
                            <TextField
                             size="small"
                             variant="outlined"
                             className={errorField === "wkr_det_varchar16" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFText_16}
                              onChange={(e) => {
                                setUDFText_16(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar17")}>
                              {findCustomizeLabelDet("wkr_det_varchar17") ||
                                "Varchar17"}
                            </Typography>
                            <TextField
                             size="small"
                             variant="outlined"
                             className={errorField === "wkr_det_varchar17" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFText_17}
                              onChange={(e) => {
                                setUDFText_17(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar18")}>
                                {findCustomizeLabelDet("wkr_det_varchar18") ||
                                  "Varchar18"}
                              </Typography>
                              <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_varchar18" ? "erroBorderadd" : "Extrasize"}
                                defaultValue={UDFText_18}
                                onChange={(e) => {
                                  setUDFText_18(e.target.value);
                                  setErrorField(null); 
                                }}
                              />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar19")}>
                              {findCustomizeLabelDet("wkr_det_varchar19") ||
                                "Varchar19"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_varchar19" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFText_19}
                              onChange={(e) => {
                                setUDFText_19(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_varchar20")}>
                              {findCustomizeLabelDet("wkr_det_varchar20") ||
                                "Varchar20"}
                            </Typography>
                            <TextField
                            size="small"
                            variant="outlined"
                            className={errorField === "wkr_det_varchar20" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFText_20}
                              onChange={(e) => {
                                setUDFText_20(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_numeric6")}>
                              {findCustomizeLabelDet("wkr_det_numeric6") ||
                                "Numeric6"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_numeric6" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFNumber_6}
                              placeholder=".0000"
                              onChange={(e) => {
                                setUDFNumber_6(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_numeric7")}>
                              {findCustomizeLabelDet("wkr_det_numeric7") ||
                                "Numeric7"}
                            </Typography>
                            <TextField
                             size="small"
                             variant="outlined"
                             className={errorField === "wkr_det_numeric7" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFNumber_7}
                              placeholder=".0000"
                              onChange={(e) => {
                                setUDFNumber_7(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_numeric8")}>
                              {findCustomizeLabelDet("wkr_det_numeric8") ||
                                "Numeric8"}
                            </Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              className={errorField === "wkr_det_numeric8" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFNumber_8}
                              placeholder=".0000"
                              onChange={(e) => {
                                setUDFNumber_8(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_numeric9")}>
                              {findCustomizeLabelDet("wkr_det_numeric9") ||
                                "Numeric9"}
                            </Typography>
                            <TextField
                             size="small"
                             variant="outlined"
                             className={errorField === "wkr_det_numeric9" ? "erroBorderadd" : "Extrasize"}
                              defaultValue={UDFNumber_9}
                              placeholder=".0000"
                              onChange={(e) => {
                                setUDFNumber_9(e.target.value);
                                setErrorField(null); 
                              }}
                            />
                          </Stack>
                          </Grid>
                          <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_numeric10")}>
                                {findCustomizeLabelDet("wkr_det_numeric10") ||
                                  "Numeric10"}
                              </Typography>
                              <TextField
                                size="small"
                                variant="outlined"
                                className={errorField === "wkr_det_numeric10" ? "erroBorderadd" : "Extrasize"}
                                defaultValue={UDFNumber_10}
                                placeholder=".0000"
                                onChange={(e) => {
                                  setUDFNumber_10(e.target.value);
                                  setErrorField(null); 
                                }}
                              />
                              </Stack>
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_datetime6")}>
                                {findCustomizeLabelDet("wkr_det_datetime6") ||
                                  "Datetime6"}
                              </Typography>

                                <DateTimePicker
                                  value={UDFDate_6}
                                  format="dd/MM/yyyy HH:mm"
                                  className={errorField === "wkr_det_datetime6" ? "erroBorderadd" : "Extrasize"}
                                  onChange={(newDate) => {
                                    setUDFDate_6(newDate); // Update your state with the new value
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
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_datetime7")}>
                              {findCustomizeLabelDet("wkr_det_datetime7") ||
                                "Datetime7"}
                            </Typography>

                            <DateTimePicker
                              value={UDFDate_7}
                              format="dd/MM/yyyy HH:mm"
                              className={errorField === "wkr_det_datetime7" ? "erroBorderadd" : "Extrasize"}
                              onChange={(newDate) => {
                                setUDFDate_7(newDate); // Update your state with the new value
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
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_datetime8")}>
                              {findCustomizeLabelDet("wkr_det_datetime8") ||
                                "Datetime8"}
                            </Typography>

                            <DateTimePicker
                              value={UDFDate_8}
                              format="dd/MM/yyyy HH:mm"
                              className={errorField === "wkr_det_datetime8" ? "erroBorderadd" : "Extrasize"}
                              onChange={(newDate) => {
                                setUDFDate_8(newDate); // Update your state with the new value
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
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_datetime9")}>
                              {findCustomizeLabelDet("wkr_det_datetime9") ||
                                "Datetime9"}
                            </Typography>

                            <DateTimePicker
                              value={UDFDate_9}
                              format="dd/MM/yyyy HH:mm"
                              className={errorField === "wkr_det_datetime9" ? "erroBorderadd" : "Extrasize"}
                              onChange={(newDate) => {
                                setUDFDate_9(newDate); // Update your state with the new value
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
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("wkr_det_datetime10")}>
                              {findCustomizeLabelDet("wkr_det_datetime10") ||
                                "Datetime10"}
                            </Typography>

                            <DateTimePicker
                              value={UDFDate_10}
                              format="dd/MM/yyyy HH:mm"
                              className={errorField === "wkr_det_datetime10" ? "erroBorderadd" : "Extrasize"}
                              onChange={(newDate) => {
                                setUDFDate_10(newDate);
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
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 2}
                      sx={{ marginTop: "16px" }}
                    ></Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 3}
                      sx={{ marginTop: "16px" }}
                    ></Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 4}
                      sx={{ marginTop: "16px" }}
                    >
                      {/* Refrence */}
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
                                          src={item.attachment ? `${httpCommon.defaults.baseURL}${item.attachment}` :""}
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
                                         src={RefImg[0].attachment ? `${httpCommon.defaults.baseURL}${RefImg[0].attachment}` :""}
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
                                      src={selectedImage ? `${httpCommon.defaults.baseURL}${selectedImage}` :""}
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
                                className="SaveButton"
                                startIcon={<Iconify icon="mingcute:save-fill" />}
                                style={{
                                  backgroundColor: "#4CAF50",
                                  color: "white",
                                  marginRight: "10px",
                                }}
                                disabled={ApprovalStatus && ApprovalStatus === "A" || ApprovalStatus === "D"}
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
                  <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
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

            {/******************** Status Details ********************/}
              <div>
                <BootstrapDialog
                  onClose={StatushandleClose}
                  aria-labelledby="customized-dialog-title"
                  open={StatusShow}
                 
                  fullWidth
                >
                  <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    className="dailogTitWork"
                  >
                    {ApprovalStatus !='' && ApprovalStatus === "D" ? "Disapprove" : "Approve"} Details
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
                        
                        marginTop: "-30px",
                      }}
                    >
                     
                   <Stack spacing={2} className="wkr_req_approvests_Popup" >
                      
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
                            label7,
                          }) => (
                            <div
                              key={step}
                              style={{ position: "relative", zIndex: 1 }}
                            >
                            <div>
                            {label1 === "A" ? (
                              
                                  <span>
                                     <TextField
                                      disabled
                                      fullWidth
                                        id="outlined-required"
                                        label="Approved By"
                                        defaultValue={label}
                                        style={{ marginBottom: '20px' }}
                                        InputLabelProps={{
                                          style: { color: '#000' }
                                        }}
                                      />
                                  
                                  </span>
                                ) : (
                                  <span>
                                    <TextField
                                      disabled
                                      fullWidth
                                        id="outlined-required"
                                        label="Rejected By"
                                        defaultValue={label6}
                                        style={{ marginBottom: '20px' }}
                                        InputLabelProps={{
                                          style: { color: '#000' }
                                        }}
                                      />
                                    
                                  </span>
                                )}
                              <div>
                              {label1 === "A" ? (
                                  <span>
                                   
                                    <TextField
                                      disabled
                                      fullWidth
                                        id="outlined-required"
                                        label="Approved Date"
                                        defaultValue={label4}
                                        style={{ marginBottom: '20px' }}
                                        InputLabelProps={{
                                          style: { color: '#000' }
                                        }}
                                      />
                                  </span>
                                ) : (
                                  <span>
                                    <TextField
                                      disabled
                                      fullWidth
                                        id="outlined-required"
                                        label="Rejected Date"
                                        defaultValue={label4}
                                        style={{ marginBottom: '20px' }}
                                        InputLabelProps={{
                                          style: { color: '#000' }
                                        }}
                                      />
                                  </span>
                                )}
                              </div>
                              <div>
                              {label1 === "A" ? (
                                  <span>
                                  
                                    <TextField
                                      disabled
                                      fullWidth
                                        id="outlined-required"
                                        label="Work Order No"
                                        defaultValue={label2}
                                        style={{ marginBottom: '20px' }}
                                        InputLabelProps={{
                                          style: { color: '#000' }
                                        }}
                                      />
                                  </span>
                                ) : (
                                  <span>
                                    <TextField
                                      disabled
                                      fullWidth
                                        id="outlined-required"
                                        label="Rejected Description"
                                        defaultValue={label7}
                                        style={{ marginBottom: '20px' }}
                                        multiline
                                        rows={4}
                                        InputLabelProps={{
                                          style: { color: '#000' }
                                        }}
                                      />
                                  </span>
                                )}
                              </div>
                              <div>
                              {label1 === "A" ? (
                                  <span>
                                    
                                     <TextField
                                      disabled
                                      fullWidth
                                        id="outlined-required"
                                        label="Work Status"
                                        defaultValue={label1 && label1=='A' ? "OPE - WO OPEN":""}
                                        style={{ marginBottom: '20px' }}
                                        InputLabelProps={{
                                          style: { color: '#000' }
                                        }}
                                      />
                                  </span>
                                ) : (
                                  <span>
                                   
                                  </span>
                                )}
                              </div>
                            
                            </div>
                            
                              
                            </div>
                          )
                        )}
                    
                      </Stack>
                    </div>
                  </DialogContent>
                </BootstrapDialog>
              </div>

                <div className="AssetFromSnackbar">       
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={null}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                // sx={{
                //   boxShadow: '0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)'
                // }}
                sx={{
                  boxShadow: '0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)',
                  '& .MuiAlert-filledError': {
                    backgroundColor: '#fff',
                    color: '#000',
                    fontWeight: '600',
                    position: 'relative',
                    animation: snackbarOpen ? 'bounce-in 0.5s ease-out' : 'none', // Apply bouncing animation conditionally
                  },
                }}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity="error"
                  variant="filled"
                  // sx={{ backgroundColor: '#fff', color: '#000', fontWeight: '600', position: 'relative' }}
                  sx={{
                    '@keyframes bounce-in': {
                      '0%': { transform: 'scale(0.9)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(1)' },
                    },
                  }}
                >
                  {snackbarMessage}
                  
                  <LinearProgress variant="determinate" value={snackbarOpen ? 100 - progress : 0} style={{ width: '99%', position: 'absolute', bottom: '0',marginLeft: '-50px',
                  }}
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'green', // Change the color here
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

WorkRequestForm.propTypes = {
  currentUser: PropTypes.object,
};

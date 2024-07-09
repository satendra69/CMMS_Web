import isEqual from "lodash/isEqual";
import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from "react-router-dom";
// @mui
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { ThreeCircles } from 'react-loader-spinner';
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";



// hooks
import { useBoolean } from "src/hooks/use-boolean";
// _mock

// components
import { useSettingsContext } from "src/components/settings";

import {
  useTable,
  getComparator,
  emptyRows,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/components/table";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Icon } from "@iconify/react";

import WorkOrderTableRow from "./workorder-table-row";
import WorkOrderTableFiltersResult from "./WorkOrderTableFiltersResult";
import WorkOrderCalendarView from "./WorkOrderCalendarView";
import ExportWorkOrderlistToExcel from "./ExportFIle/ExportWorkOrderlistToExcel";

const MySwal = withReactContent(Swal);
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "", label: "Action", width: 60 },
  { id: "col2", label: "Work Order No", width: 125, align : 'left'},
  { id: "col3", label: "Asset No", width: 100, padding: 10 },
  { id: "col6", label: "Status", width: 80 },
  { id: "col7", label: "Description", width: 250 },
  { id: "col8", label: "Charge Cost Center", width: 180 },
  { id: "col9", label: "Origination Date", width: 160 },
  { id: "col10", label: "Due Date", width: 170 },
  { id: "col11", label: "Completion Date", width: 150 },
  { id: "col12", label: "Close Date", width: 150 },
  { id: "col4", label: "Parent Wo", width: 120 },
  { id: "col5", label: "PM Group", width: 120 },
  { id: "col13", label: "Assign To", width: 125 },
  { id: "col14", label: "Planner", width: 125 },
  { id: "col15", label: "Fault Code", width: 125 },
  { id: "col16", label: "Cause Code", width: 125 },
  { id: "col17", label: "Action Code", width: 150 },
  { id: "col18", label: "Corrective Action", width: 250 },
  { id: "col19", label: "Originator", width: 155 },
  { id: "col20", label: "Phone", width: 135 },
  { id: "col21", label: "Project Id", width: 145 },
  { id: "col22", label: "Zone", width: 100 },
  { id: "col23", label: "Asset Location", width: 170 },
  { id: "col24", label: "Asset Level", width: 150 },
  { id: "col25", label: "Asset Group Code", width: 190 },
  { id: "col26", label: "Original Priority", width: 200 },
  { id: "col27", label: "Plan Priority", width: 200 },
  { id: "col28", label: "Temporary Asset", width: 200 },
  { id: "col29", label: "Work Request No", width: 200 },
  { id: "col30", label: "Area", width: 140 },
  { id: "col31", label: "Wr Origination Date", width: 230 },
  { id: "col32", label: "Wr Due Date", width: 140 },
  { id: "col33", label: "Work Type", width: 140 },
  { id: "col34", label: "Work Class", width: 140 },
  { id: "col35", label: "Labor Type", width: 140 },
  { id: "col36", label: "Status Change Date", width: 230 },
  { id: "col37", label: "Schedule Date", width: 180 },
  { id: "col38", label: "Exception Date", width: 180 },
  { id: "col39", label: "Contract No", width: 180 },
  { id: "col40", label: "Wo Category", width: 180 },
  { id: "col41", label: "Customer Code", width: 180 },
  { id: "col42", label: "Supervisor Id", width: 180 },
  { id: "col43", label: "Estimated Contract Cost", width: 250 },
  { id: "col44", label: "Contract Cost", width: 180 },
  { id: "col45", label: "Estimated Material Cost", width: 250 },
  { id: "col46", label: "Material Cost", width: 200 },
  { id: "col47", label: "Estimated Labor Cost", width: 230 },
  { id: "col48", label: "Labor Cost", width: 140 },
  { id: "col49", label: "Eservice No", width: 140 },
  { id: "col50", label: "Export File Directory", width: 230 },
  { id: "col51", label: "Response To Request", width: 230 },
  { id: "col52", label: "Job Id/service No", width: 200 },
  { id: "col53", label: "Wko Det~r~nvarchar5", width: 230 },
  { id: "col54", label: "SERVICE SATISFACTION", width: 230 },
  { id: "col55", label: "Work Location (Udf 7)", width: 230 },
  { id: "col56", label: "Area", width: 140 },
  { id: "col57", label: "Quality Of Service", width: 200 },
  { id: "col58", label: "Eps Purchaser", width: 170 },
  { id: "col59", label: "Labor Cost", width: 170 },
  { id: "col60", label: "Invoice Amt", width: 170 },
  { id: "col61", label: "Total Markup Cost", width: 200 },
  { id: "col62", label: "Down Time (Hour)", width: 200 },
  { id: "col63", label: "Wko Det~r~nnumeric5", width: 230 },
  { id: "col64", label: "Exported Date", width: 170 },
  { id: "col65", label: "Wko Det Datetime2", width: 230 },
  { id: "col66", label: "Acknowledge Date", width: 200 },
  { id: "col67", label: "Wko Det~r~ndatetime4", width: 230 },
  { id: "col68", label: "Wko Det~r~ndatetime5", width: 230 },
  { id: "col69", label: "Created By", width: 140 },
  { id: "col70", label: "Created Date", width: 160 },
];
const TABLE_HEADDB = [
  { id: "", label: "Action", width: 60 },
  { id: "col2", label: "PM ID", width: 145 },
  { id: "col3", label: "PM Type", width: 130, padding: 10 },
  { id: "col4", label: "PM Group", width: 120 },
  { id: "col5", label: "Asset No", width: 120 },
  { id: "col6", label: "Frequency Code", width: 120 },
  { id: "col7", label: "LPM Date", width: 170 },
  { id: "col8", label: "LPM Closed Date", width: 180 },
  { id: "col9", label: "Next Create Date", width: 160 },
  { id: "col10", label: "Next Due", width: 150 },
  { id: "col11", label: "Lead DAY", width: 150 },
  { id: "col12", label: "Closed Loop", width: 150 },
  { id: "col13", label: "PM Schedule Date", width: 125 },
  { id: "col14", label: "Disable Flag", width: 125 },
  { id: "col15", label: "Current Work Order", width: 125 },
  { id: "col16", label: "Fault Code", width: 125 },
  { id: "col17", label: "Description", width: 105 },
  { id: "col18", label: "Meter ID", width: 180 },
  { id: "col19", label: "LPM Usage", width: 155 },
  { id: "col20", label: "LPM UOM", width: 135 },
  { id: "col21", label: "Asset/PM Group Description", width: 145 },
  { id: "col22", label: "Shadow Group", width: 100 },
  { id: "col23", label: "Default WO Status", width: 170 },
  { id: "col24", label: "Plan Priority", width: 150 },
  { id: "col25", label: "Charge Cost Center", width: 190 },
  { id: "col26", label: "Asset Location", width: 200 },
  { id: "col27", label: "Originator", width: 200 },
  { id: "col28", label: "Approver", width: 200 },
  { id: "col29", label: "Planner", width: 200 },
  { id: "col30", label: "Credit Cost Center", width: 140 },
  { id: "col31", label: "Labor Account", width: 230 },
  { id: "col32", label: "Material Account", width: 140 },
  { id: "col33", label: "Contract Account", width: 140 },
  { id: "col34", label: "Project ID", width: 140 },
  { id: "col35", label: "Safety", width: 140 },
  { id: "col36", label: "Varchar20", width: 230 },
  { id: "col37", label: "Cause Code", width: 180 },
  { id: "col38", label: "Action Code", width: 180 },
  { id: "col39", label: "Work Area", width: 180 },
  { id: "col40", label: "Work Location", width: 180 },
  { id: "col41", label: "Work Group", width: 180 },
  { id: "col42", label: "Work Type", width: 180 },
  { id: "col43", label: "Work Class", width: 250 },
  { id: "col44", label: "Created By", width: 180 },
  { id: "col45", label: "Created Date", width: 250 },
];

const defaultFilters = {
  name: "",
  publish: [],
  stock: [],
};
// ----------------------------------------------------------------------

export default function WorkOrderList({ onValueChange }) {
  const site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [maxHeight, setMaxHeight] = useState("400px"); // Default maxHeight
  //const DashbordDataGauge = location.state?.GaugeDashbordData || [];

  const [DashbordDataGauge, setDashbordDataGauge] = useState(
    location.state?.GaugeDashbordData
  );
  
  const DashbordDataSrt = location.state?.GaugeDashbordDataSort || [];

  const [DropListIdGet, setDropListIdGet] = useState(
    location.state?.DropListId || []
  );

  console.log("DropListIdGet____",DropListIdGet);
  console.log("DashbordDataGauge____",DashbordDataGauge);
  
  const numberOfColumns = "71";
  const [DashbordDataPrmMst, setDashbordDataPrmMst] = useState(
    location.state?.GetDashbordDataPrmMst || []
  );
  const [ResponceStats, setResponceStats] = useState("");

  const popover = usePopover();
  const router = useRouter();

  const navigate = useNavigate();

  const table = useTable();
  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [TableSearchData, setTableSearchData] = useState([]);
  const [totalRow, setTotalRow] = useState(0);
  const [TotalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedOption, setSelectedOption] = useState("");
  const [workOdrFilterDpd, setWorkOdrFilterDpd] = useState([]);
  const [isInputFocused, setInputFocused] = useState(false);

  const confirm = useBoolean();

  const [currentPage, setCurrentPage] = useState(1);

  const [showDiv1, setShowDiv1] = useState(true);
  const [showDiv2, setShowDiv2] = useState(false);
  const [button1Active, setButton1Active] = useState(true);
  const [button2Active, setButton2Active] = useState(false);

  const [FilterShow, setFilterShow] = useState(false);
  const FilterhandleClose = () => setFilterShow(false);

  const inputRef = useRef(null);
  const [ExportExcelId, setExportExcelId] = useState("");

  const [selectedOptionEmptyError, setSelectedOptionEmptyError] =
    useState(false);
  const [valueptEmptyError, setValueptEmptyError] = useState(false);
  const [logicalEmptyError, setLogicalEmptyError] = useState(false);
  const [wkoFiledname, setwkoFiledname] = useState([]);
  const [selectedOptionEmptyErrorShort, setSelectedOptionEmptyErrorShort] =
    useState(false);

  const [showSave, setShowSave] = useState(false);
  const [AstFiledname, setAstFiledname] = useState([]);

  const [assetFilterDpd, setAssetFilterDpd] = useState([]);
  const [TitleAstReg, setTitleAstReg] = useState("");

  const [showWordOrderQryList, setShowWordOrderQryList] = useState(false);
  const handleShowWorkOrderQryList = () => setShowWordOrderQryList(true);
  const [selectedOptionValue, setselectedOptionValue] = useState();
  const [selectedOptionEmptyErrorQtr, setSelectedOptionEmptyErrorQtr] =
    useState(false);
  const [valueptEmptyErrorQtr, setValueptEmptyErrorQtr] = useState(false);
  const [logicalEmptyErrorQtr, setLogicalEmptyErrorQtr] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [
    selectedOptionEmptyErrorShortQtr,
    setSelectedOptionEmptyErrorShortQtr,
  ] = useState(false);
  const [selectDropRowID, setselectDropRowID] = useState("");

  const [showPromt, setShowPromt] = useState(false);
  const [rowsDropdownPrompt, setRowsDropdownPrompt] = useState([
    {
      selectedOption: "",
      operator: "",
      logical: "",
      valuept: "",
      RowId:"",
      prompt:"",
      siteCd: site_ID,
      queryTypedd: "F",
    },
  ]);


  const [showSaveAs, setShowSaveAs] = useState(false);
  const [firstEffectComplete, setFirstEffectComplete] = useState(false);
  // Get Dropdowwn Value
  const fetchFilterDropdown = useCallback(async () => {
    try {
      const response = await httpCommon.get(
        `/get_workReq_filter_dropdown.php?site_cd=${site_ID}`
      );
      setWorkOdrFilterDpd(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [site_ID]);



  // Get Api data useEffect
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await httpCommon.get(
        `/get_workordermaster-Copy.php?site_cd=${site_ID}&page=${currentPage}`
      );
      setTableData(response.data.data.result);
      setTotalRow(response.data.totalRow);
      Swal.close();
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [site_ID, currentPage]);

  const fetchFilterSubPopupSavedropdon = async () => {
    // Get dropdown value using api
   
    try {
      const response = await httpCommon.get(
        `/get_work_order_subsave_filter_dropdown.php?site_cd=${site_ID}&auditUser=${AuditUser}`
      );
    //  console.log("response____",response);
      setAssetFilterDpd(response.data);
     
      if (DropListIdGet !== "" && DropListIdGet !== null) {
        const matchedItem = response.data.find(
          (item) => item.RowID === DropListIdGet
        );
        if (matchedItem) {
          const cfQueryDescValue = matchedItem.cf_query_title;

          setTitleAstReg(cfQueryDescValue);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //  fetch the data Gauge dashbord
  const fetchDataGaugeDSB = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await httpCommon.post(
        "/get_gauge_dashbord_workorder_data.php?page=" + currentPage,
        {
          rows: DashbordDataGauge,
          rowsort: DashbordDataSrt,
          rowsPrm: DashbordDataPrmMst,
          site_cd: site_ID,
          emp_ID:emp_owner,
        }
      );
    //  console.log("response____workOrder",response);
      if (response.data.status === "SUCCESS") {
        if (response.data.data.result.length > 0) {
          setTableData(response.data.data.result);
          setTotalRow(response.data.total_count);
          setResponceStats(response.data.StatusPRM);
          setTotalCount(response.data.TotalCountPRM);
        }
       
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [site_ID, currentPage]);
//console.log("tableData______",tableData);
  const handleOptionChange = async (event,responseData) => {
  
    const selectedValue = event?.target?.value || selectedOption;
    setCurrentPage(1);
  
    const selectedOptionObjectFilter = assetFilterDpd.find(
      (item) => item.cf_query_title === selectedValue
    );

    let selectedOptionObject;

    if (Array.isArray(responseData) && responseData.length > 0) {
      selectedOptionObject = responseData.find(
        (item) => item.cf_query_title === selectedValue
      );
    }

  
    if (selectedOptionObjectFilter) {
      const GetRowID = selectedOptionObjectFilter.RowID;
      const GetPrompt = selectedOptionObjectFilter.cf_query_list_prompt;
      if(GetPrompt == '1'){
        setShowPromt(true);
        Swal.fire({
          title: "Please Wait !",
          allowOutsideClick: false,
          customClass: {
            container: "swalcontainercustom",
          },
        });
        Swal.showLoading();
        try {
          const response = await httpCommon.get(
            "/get_work_order_filter_query_data.php?site_cd=" +
              site_ID +
              "&RowID=" +
              GetRowID
          );
          
          if (response.data.data && response.data.data.list_typeF && response.data.data.list_typeF.length > 0) {
            const newRows = response.data.data.list_typeF.map((item) => ({
              selectedOption: item.cf_query_list_column,
              operator: item.cf_query_list_operator,
              valuept: item.cf_query_list_value,
              logical: item.cf_query_list_logical,
              siteCd: site_ID,
              RowId: GetRowID,
              prompt:GetPrompt,
              queryTypedd: "F",
            }));
            const timeoutId = setTimeout(() => {
              Swal.close();
              setRowsDropdownPrompt(newRows);
            }, 3000);
            //setShowAssetByDescp(false);
          } else {
            Swal.fire({
              icon: "error",
              customClass: {
                container: "swalcontainercustom",
              },
              title: "Oops...",
              text: "No record found Please try again !",
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        return;
      }
      setExportExcelId(GetRowID);
      setselectDropRowID(GetRowID);
      setCurrentPage(1);
      setDropListIdGet([]);
      setDashbordDataPrmMst([]);
      setDashbordDataGauge([]);
      setTitleAstReg("");
    }else{
      const GetRowID = selectedOptionObject.RowID;
      setExportExcelId(GetRowID);
      setselectDropRowID(GetRowID);
      setCurrentPage(1);
      setDropListIdGet([]);
      setDashbordDataPrmMst([]);
      setDashbordDataGauge([]);
      setTitleAstReg("");
    }
    setSelectedOption(selectedValue);
  };
 
  const getb = useCallback(async () => {
    // Swal.fire({
    //   title: "Please Wait!",
    //   allowOutsideClick: false,
    //   customClass: {
    //     container: "swalcontainercustom",
    //   },
    // });
    // Swal.showLoading();
    setIsLoading(true);
    try {
     
      const response = await httpCommon.post(
        `/get_workorder_list_select_option_data.php?site_cd=${site_ID}&ItemID=${selectDropRowID}&page=${currentPage}&EmpId=${emp_owner}`
      );
       
      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        setTableData(response.data.data.result);
        setTotalRow(response.data.DashbrdCount);
       // Swal.close();
        setIsLoading(false);
      } else {
        setTableData("");
        setTotalRow("");
        setIsLoading(false);
        Swal.fire({
          title: "Opps..!",
          text: "No Record Found!",
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [site_ID, currentPage, selectDropRowID]);


  useEffect(() => {
    const fetchUrlData = async () => {
      try {
        const cancelCurrentPage = location.state?.currentPage || 1;
        const dropdownSelect = location.state?.selectedOption || "";

        if (dropdownSelect !== "" && dropdownSelect !== null) {
          try {
            const response = await httpCommon.get(
              `/get_work_order_subsave_filter_dropdown.php?site_cd=${site_ID}&auditUser=${AuditUser}`
            );
  
            if (response.data.length > 1) {
              setAssetFilterDpd(response.data);
              setFirstEffectComplete(true);
              handleOptionChange({ target: { value: dropdownSelect } }, response.data);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }else{
          setFirstEffectComplete(true);
        }
        setCurrentPage(cancelCurrentPage);
      } catch (error) {
        console.error("Error in the first useEffect:", error);
      }
    };
  
    fetchUrlData(); 
  }, [location.search]);


  useEffect(() => {
    if (firstEffectComplete) {
      if (Array.isArray(DashbordDataGauge) && DashbordDataGauge.length > 0) {
        fetchDataGaugeDSB();
      } else if (
      Array.isArray(DashbordDataPrmMst) &&
      DashbordDataPrmMst.length > 0
    ) {
      fetchDataGaugeDSB();
    } else if (selectDropRowID != "" && selectDropRowID != null) {
      getb();
    } else {
      fetchData();
    }
     fetchFilterSubPopupSavedropdon();
    }
    
  }, [firstEffectComplete, site_ID, currentPage, selectDropRowID, fetchData, getb]);

  useEffect(() => {
    fetchFilterDropdown();
  }, [fetchFilterDropdown,]);

  // set screen revolation set
  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      // Adjust maxHeight based on window height
      const newMaxHeight = Math.floor(windowHeight * 0.6) + "px"; // Adjust this value as needed
      setMaxHeight(newMaxHeight);
    };

    // Call handleResize on initial mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const dataFiltered = applyFilter({
    inputData: Array.isArray(tableData) ? tableData : [],
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  // const handleDeleteRow = useCallback(
  //   (id, row) => {
  //     const deleteRow = tableData.filter((row) => row.id !== id);
  //     setTableData(deleteRow);

  //     table.onUpdatePageDeleteRow(dataInPage.length);
  //   },
  //   [dataInPage.length, table, tableData]
  // );

  const handleDeleteRow = useCallback(async (id, row) => {
    
    const Rowid = id;
    console.log("rowwid____",Rowid);
    console.log("row____",row);
   // const AstNo = row.col1;
    if (Rowid !== '' && Rowid !== 'NULL') {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => { // Add async here if you want to use await inside then
        if (result.isConfirmed) {
          setIsLoading(true);
          if(row.col6 === "CMP"){
            Swal.fire({
                  title: "Warning!",
                  text: "This Work Order can't be Deleted Because it Already Completed.",
                  icon: "info"
                  });
          }else if(row.col6 === "CLO"){
            Swal.fire({
                  title: "Warning!",
                  text: "This Work Order can't be Deleted Because it Already Closed.",
                  icon: "info"
                  });
          }else{
            Swal.close();
          }
          // try {
          //   const response = await httpCommon.get(
          //     `/asset_list_delete_record.php?site_cd=${site_ID}&mst_id=${Rowid}&ast_no=${AstNo}`
          //   );
          //  // console.log("response_____delete___",response);
          //   if(response.data.status == "SUCCESS"){
          //     Swal.fire({
          //     title: "Deleted!",
          //     text: "Asset Record Delete Successfully",
          //     icon: "success"
          //     });
          //     fetchData();
          //   }
          //   if(response.data.status == "ERROR"){
          //     Swal.fire({
          //     title: "Oops!",
          //     text: response.data.message,
          //     icon: "error"
          //     });
          //   }
          //   setIsLoading(false);
          
          // } catch (error) {
          //   console.error('Error fetching data:', error);
          // }
          
        }
      });
    }
  }, [tableData, router, site_ID]);

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.id)
    );
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (row) => {
      navigate(`/dashboard/work/neworder`, {
        state: {
          RowID:row,
          currentPage,
          selectedOption,
        },
      });
    },
    [router,currentPage, selectedOption]
  );

  const handleCompleteRow = useCallback(
    (id,row) => {
  
      const shouldRedirect = tableData.some((item) => {
        return item.col6 === "CMP" && item.col71 === id;
      });

      const shouldRedirectcls = tableData.some((item) => {
        return item.col6 === "CLO" && item.col71 === id;
      });

      if (shouldRedirect) {
       
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: `This Work Order No ${row.col2} Already complete.`,
        });
        return; 
      } else if (shouldRedirectcls) {
        
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: `This Work Order No ${row.col2} Already Close.`,
        });
        return; 
      } else {
        navigate("/dashboard/work/neworder", { state: { completeRowID: id } });
      }
    },
    [tableData, router]
  );

  const handleCloseRow = useCallback(
    (id,row) => {
      const shouldRedirect = tableData.some((item) => {
        return item.col6 === "CLO" && item.col71 === id;
      });

      if (shouldRedirect) {
        
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: `This Work Order No ${row.col2} Already Close.`,
        });
        return; 
      } else {
        navigate("/dashboard/work/neworder", { state: { closeRowID: id } });
      }
    },
    [tableData, router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    inputRef.current.value = "";
    fetchData();
  }, [fetchData]);

  const handleClearButton = () => {
    handleResetFilters();
    inputRef.current.focus();
  };

  const handelSearchButton = async () => {
    const inputValueGet = inputRef.current.value;

    if (inputValueGet !== "" && inputValueGet !== null) {
      Swal.fire({ title: "Please Wait!", allowOutsideClick: false });
      Swal.showLoading();
      try {
        const response = await httpCommon.get(
          `/get_SearchWorkmaster.php?site_cd=${site_ID}&searchTerm=${inputValueGet}`
        );

        if (response.data.data.result.length > 0) {
          setTableSearchData(response.data.data.result);
          setTotalRow(response.data.data.result.length);

          const filteredData = response.data.data.result.filter((item) => {
            const searchString = inputValueGet.toLowerCase();
            const col2 = (item.col2 || "").toLowerCase();
            const col3 = (item.col3 || "").toLowerCase();
            const col4 = (item.col4 || "").toLowerCase();
            const col5 = (item.col5 || "").toLowerCase();
            const col6 = (item.col6 || "").toLowerCase();
            const col7 = (item.col7 || "").toLowerCase();
            const col8 = (item.col8 || "").toLowerCase();
            const col13 = (item.col13 || "").toLowerCase();
            const col15 = (item.col15 || "").toLowerCase();
            const col16 = (item.col16 || "").toLowerCase();
            const col18 = (item.col18 || "").toLowerCase();
            const col19 = (item.col19 || "").toLowerCase();
            const col20 = (item.col20 || "").toLowerCase();
            const col21 = (item.col21 || "").toLowerCase();
            const col22 = (item.col22 || "").toLowerCase();
            const col23 = (item.col23 || "").toLowerCase();
            const col24 = (item.col24 || "").toLowerCase();
            const col25 = (item.col25 || "").toLowerCase();
            const col26 = (item.col26 || "").toLowerCase();
            const col27 = (item.col27 || "").toLowerCase();
            const col28 = (item.col28 || "").toLowerCase();
            const col29 = (item.col29 || "").toLowerCase();
            const col30 = (item.col30 || "").toLowerCase();
            const col33 = (item.col33 || "").toLowerCase();
            const col34 = (item.col34 || "").toLowerCase();
            const col35 = (item.col35 || "").toLowerCase();
            const col39 = (item.col39 || "").toLowerCase();
            const col40 = (item.col40 || "").toLowerCase();
            const col41 = (item.col41 || "").toLowerCase();
            const col42 = (item.col42 || "").toLowerCase();
            const col43 = (item.col43 || "").toLowerCase();
            const col44 = (item.col44 || "").toLowerCase();
            const col45 = (item.col45 || "").toLowerCase();
            const col46 = (item.col46 || "").toLowerCase();
            const col47 = (item.col47 || "").toLowerCase();
            const col48 = (item.col48 || "").toLowerCase();
            const col49 = (item.col49 || "").toLowerCase();
            const col69 = (item.col69 || "").toLowerCase();

            return (
              col2.includes(searchString) ||
              col3.includes(searchString) ||
              col4.includes(searchString) ||
              col5.includes(searchString) ||
              col6.includes(searchString) ||
              col7.includes(searchString) ||
              col8.includes(searchString) ||
              col13.includes(searchString) ||
              col15.includes(searchString) ||
              col16.includes(searchString) ||
              col18.includes(searchString) ||
              col19.includes(searchString) ||
              col20.includes(searchString) ||
              col21.includes(searchString) ||
              col22.includes(searchString) ||
              col23.includes(searchString) ||
              col24.includes(searchString) ||
              col25.includes(searchString) ||
              col26.includes(searchString) ||
              col27.includes(searchString) ||
              col28.includes(searchString) ||
              col29.includes(searchString) ||
              col30.includes(searchString) ||
              col33.includes(searchString) ||
              col34.includes(searchString) ||
              col35.includes(searchString) ||
              col39.includes(searchString) ||
              col40.includes(searchString) ||
              col41.includes(searchString) ||
              col42.includes(searchString) ||
              col43.includes(searchString) ||
              col44.includes(searchString) ||
              col45.includes(searchString) ||
              col46.includes(searchString) ||
              col47.includes(searchString) ||
              col48.includes(searchString) ||
              col49.includes(searchString) ||
              col69.includes(searchString)
            );
          });

          setTableData(filteredData);
          setCurrentPage(1);
          Swal.close();
        } else {
          Swal.close();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No Record Found!",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const inputValue2 = inputRef.current.value;
      const newValue = inputValue2.slice(0, -1);
      inputRef.current.value = newValue;
      if (newValue === "") {
        handleResetFilters();
      }
    }
    if (event.key === 'Enter' && inputRef.current.value.trim() !== '') {

      handelSearchButton();
  
    }
  };
  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  const handleButtonClick = () => {
    setButton1Active(!button1Active);
    setButton2Active(false);
    setShowDiv1(true);
    setShowDiv2(false);
  };
  const handleButtonClick2 = () => {
    setButton2Active(!button2Active);
    setButton1Active(false);
    setShowDiv1(false);
    setShowDiv2(true);
  };
  const handelFilterAction = () => {
    setFilterShow(true);
    getWorkorderLebel();
  };

  const rowOptions = wkoFiledname.map((row) => ({
    value: row.column_name,
    label: `${row.default_label}`,
  }));
  /* Filter Action Button code  */
  const getWorkorderLebel = async () => {
    try {
      const response = await httpCommon.get("/getWorkOrderFilterName.php");
      if (response.data.status == "SUCCESS") {
        setwkoFiledname(response.data.data);
        //setAstdetLabel(response.data.data.ast_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [rows, setRows] = useState([
    {
      selectedOption: "",
      operator: "Like",
      logical: "AND",
      prompt: "0",
      valuept: "",
      siteCd: site_ID,
      queryTypedd: "F",
    },
  ]);
  // Short By State
  const [rowsort, setRowsort] = useState([
    {
      selectedOptionShort: "",
      promptAsd: "ASC",
      siteCd: site_ID,
      queryType: "S",
    },
  ]);

  const isButtonDisabled = rows.some((row) => row.selectedOption === "");
  const Openbracket = [
    { value: "(", label: "(" },
    { value: "", label: "" },
  ];
  const Closebracket = [
    { value: "(", label: ")" },
    { value: "", label: "" },
  ];

  const oprt = [
    { value: "like", label: "Like" },
    { value: "not like", label: "Not Like" },
    { value: "I=", label: "Is" },
    { value: "!=", label: "Is not" },
    { value: "=", label: "Equal to" },
    { value: ">", label: "Greater than" },
    { value: "<", label: "Less than" },
    { value: ">=", label: "Greater than or equal to" },
    { value: "<=", label: "Less than or equal to" },
    { value: "<>", label: "Not equal to" },
  ];
  const Logcl = [
    { value: "And", label: "And" },
    { value: "Or", label: "Or" },
  ];
  const handleOptionChange1 = (index, selectedOption) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedOption = selectedOption;
    setSelectedOptionEmptyError(false);
    setRows(updatedRows);
  };
  const handleOptionChangeOprter = (index, operator) => {
    const updatedRows = [...rows];
    updatedRows[index].operator = operator;
    setRows(updatedRows);
  };
  const handleSelectChange = (index, checked) => {
    const newRows = [...rows];
    newRows[index].prompt = checked ? "1" : "0";
    setRows(newRows);
  };
  const handleInputValueChangeQtr = (index, newValue) => {
    const updatedRowsQtr = [...rows];
    updatedRowsQtr[index].valuept = newValue;
    setValueptEmptyError(false);
    setRows(updatedRowsQtr);
    // Check if the selectedOption and valuept are empty
    if (!newValue && !updatedRowsQtr[index].selectedOption) {
      //  setSelectedOptionEmptyErrorQtr(true);
      //  setValueptEmptyErrorQtr(true);
    } else {
      // setSelectedOptionEmptyErrorQtr(false);
      //  setValueptEmptyErrorQtr(false);
    }
  };
  const handleIncludeChangeLogcil = (index, logical) => {
    const updatedRows = [...rows];
    updatedRows[index].logical = logical.target.value;
    setLogicalEmptyError(false);
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const isLastRowEmpty =
      rows.length > 0 &&
      (!rows[rows.length - 1].selectedOption ||
        rows[rows.length - 1].selectedOption === "");

    if (isLastRowEmpty) {
      setSelectedOptionEmptyError(!isLastRowEmpty.selectedOption);
      setValueptEmptyError(!isLastRowEmpty.valuept);
      setLogicalEmptyError(!isLastRowEmpty.logical);
    } else {
      // Add a new row
      setRows((prevRows) => [
        ...prevRows,
        {
          selectedOption: "",
          operator: "Like",
          logical: "",
          prompt: "0",
          valuept: "",
          siteCd: site_ID,
          queryTypedd: "F",
        },
      ]);
      setSelectedOptionEmptyError(false);
      setValueptEmptyError(false);
      setLogicalEmptyError(false);
    }
  };
  const handleDeleteRowPopup = (index) => {
    if (rows.length > 1) {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    }
  };

  // Short By code

  const handleOptionChange2 = (index, selectedOptionShort) => {
    const updatedRows = [...rowsort];
    updatedRows[index].selectedOptionShort = selectedOptionShort;
    setSelectedOptionEmptyErrorShort(false);
    setRowsort(updatedRows);
  };
  const handleSelectChangeshort = (index, checked) => {
    const newRows = [...rowsort];
    newRows[index].promptAsd = checked ? "ASC" : "DESC";
    setRowsort(newRows);
  };
  const handleAddRowShort = () => {
    if (rowsort[rowsort.length - 1].selectedOptionShort === "") {
      setSelectedOptionEmptyErrorShort(
        rowsort[rowsort.length - 1].selectedOptionShort === ""
      );
    } else {
      const newRow = {
        selectedOptionShort: "",
        promptAsd: "ASC",
      };
      setRowsort([...rowsort, newRow]);
    }
  };
  const handleDeleteRowShort = (index) => {
    if (rowsort.length > 1) {
      const newRows = [...rowsort];
      newRows.splice(index, 1);
      setRowsort(newRows);
    }
  };

  // Retrive button  funcation,setTableData
  const RetriveData = async () => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.post(
        "/get_retrive_popup_filed_data.php?page=" + currentPage,
        {
          rows: rows,
          rowsort: rowsort,
          SiteCD: site_ID,
          admin: emp_owner,
        }
      );
    console.log("check___res__",response);
      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        setTableData(response.data.data.result);
        setTotalRow(response.data.total_count);
        setTitleAstReg(response.data.titleName);

        Swal.close();
        FilterhandleClose();
        const updatedEmptyRows = rows.map((row) => ({
          // empty state data
          ...row,
          selectedOption: "",
          logical: "",
          valuept: "",
        }));
        setRows(updatedEmptyRows);

        const updatedEmptyRowsort = rows.map((rowsort) => ({
          // empty state data
          ...rowsort,
          selectedOptionShort: "",
        }));
        setRowsort(updatedEmptyRowsort);
      } else {
        Swal.fire({
          title: "Opps..!",
          text: "No Record Found!",
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
const RetriveDataAllData = async () =>{
  Swal.fire({
    title: "Please Wait !",
    allowOutsideClick: false,
    customClass: {
      container: "swalcontainercustom",
    },
  });
    Swal.showLoading();
  try {
    const response = await httpCommon.post(
      "/get_retrive_all_data.php?page=" + currentPage,
      {
        SiteCD: site_ID,
        admin: emp_owner,
      }
    );
  
    if (
      response.data.data &&
      response.data.data.result &&
      response.data.data.result.length > 0
    ) {
      setTableData(response.data.data.result);
      setTotalRow(response.data.total_count);
      setTitleAstReg(response.data.titleName);

      Swal.close();
      FilterhandleClose();
      const updatedEmptyRows = rows.map((row) => ({
        // empty state data
        ...row,
        selectedOption: "",
        logical: "",
        valuept: "",
      }));
      setRows(updatedEmptyRows);

      const updatedEmptyRowsort = rows.map((rowsort) => ({
        // empty state data
        ...rowsort,
        selectedOptionShort: "",
      }));
      setRowsort(updatedEmptyRowsort);
    } else {
      Swal.fire({
        title: "Opps..!",
        text: "No Record Found!",
        icon: "success",
        customClass: {
          container: "swalcontainercustom",
        },
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
  const retriveBtn = () => {
    if (rows.some((row) => row.selectedOption !== "")) {
      RetriveData();
    }else{
     // console.log("click to");
      RetriveDataAllData();
    }
  };
  const SaveRegTbl = () => {
    setShowSave(true);
  };


  const handleCloseSave = () => {
    setShowSave(false);
    setFormDataSv({
      queryName: "",
      description: "",
    });
  };

  const [formDataSv, setFormDataSv] = useState([
    {
      queryName: "",
      description: "",
      availability: "G",
      site_cd: site_ID,
      owner: emp_owner,
    },
  ]);

  const handleInputChangeSav = (event) => {
    const { name, value } = event.target;
    setFormDataSv((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Insert Cf_query Api with Query List popup data
  const InsertCf_queryListData = async () => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    const combinedData = {
      formDataSv: formDataSv,
      rowsQrtData: rows,
      rowsortQrtData: rowsort,
      site_cd: site_ID,
      owner: emp_owner,
      availability: "G",
    };

    try {
      const response = await httpCommon.post(
        "/InserWorkOrderFilterSaveData.php",
        combinedData
      );
     
      if (response.data.status == "SUCCESS") {
        setTitleAstReg(response.data.Title);
        fetchFilterSubPopupSavedropdon();
        RetriveData();

        Swal.close();
        handleCloseSave();
        FilterhandleClose();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //Save Button click to
  const handleCFQrySave = () => {
    if (formDataSv.queryName.trim() !== "") {
      const inputValue = formDataSv.queryName;
      const matchingOption = assetFilterDpd.find(
        (option) => option.cf_query_title === inputValue
      );
      if (matchingOption) {
        //setMessage('Input value matches an option in the list.');
        Swal.fire({
          title: "Are you sure?",
          text: "Do you want to overwrite the query" + " " + inputValue,
          icon: "warning",
          customClass: {
            container: "swalcontainercustom",
          },
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            if (
              rows?.selectedOption?.trim() !== "" &&
              rows?.logical?.trim() !== "" &&
              rows?.valuept?.trim() !== "" &&
              rowsort?.selectedOptionShort?.trim() !== ""
            ) {
              InsertCf_queryListData();
            }
          }
        });
      } else {
        InsertCf_queryListData();
      }
    } else {
      console.log("empty__");
    }
  };

  // Handel Query List popup
  const [rowsQrt, setRowsQrt] = useState([
    {
      selectedOption: "",
      operator: "",
      logical: "",
      prompt: "",
      valuept: "",
      siteCd: site_ID,
      queryTypedd: "F",
    },
  ]);
  //Sorting data append rowsQrt rowsortQrt
  const [rowsortQrt, setRowsortQrt] = useState([
    {
      selectedOptionShort: "",
      promptAsd: "",
      siteCd: site_ID,
      queryType: "S",
    },
  ]);

  const RetriveDataQueryList = async () => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.post(
        "/get_retrive_popup_filed_data.php?page=" + currentPage,
        {
          rows: rowsQrt,
          rowsort: rowsortQrt,
          SiteCD:site_ID,
          admin:emp_owner
        }
      );
     
      setTableData(response.data.data.result);
      setTotalRow(response.data.total_count);
      Swal.close();
      FilterhandleClose();
      const updatedEmptyRows = rowsQrt.map((row) => ({
        // empty state data
        ...row,
        selectedOption: "",
        logical: "",
        valuept: "",
      }));
      setRows(updatedEmptyRows);

      const updatedEmptyRowsort = rowsortQrt.map((rowsort) => ({
        // empty state data
        ...rowsort,
        selectedOptionShort: "",
      }));
      setRowsort(updatedEmptyRowsort);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleOptionChangeQtr = (index, selectedOption) => {
    const updatedRowsQtr = [...rowsQrt];
    updatedRowsQtr[index].selectedOption = selectedOption;
    setSelectedOptionEmptyErrorQtr(false);
    setRowsQrt(updatedRowsQtr);
  };

  const handleOptionChangeOprterQtr = (index, operator) => {
    const updatedRowsQtr = [...rowsQrt];
    updatedRowsQtr[index].operator = operator;
    setRowsQrt(updatedRowsQtr);
  };

  const handleSelectChangeQtr = (index, checked) => {
    const newRows = [...rowsQrt];
    newRows[index].prompt = checked ? "1" : "0";
    setRowsQrt(newRows);
  };
  const handleInputValueChangeQtr2 = (index, newValue) => {
    const updatedRowsQtr = [...rowsQrt];
    updatedRowsQtr[index].valuept = newValue;
    //setValueptEmptyErrorQtr(false);
    setRowsQrt(updatedRowsQtr);
  };
  const handleIncludeChangeLogcilQtr = (index, logical) => {
    const updatedRowsQtr = [...rowsQrt];
    updatedRowsQtr[index].logical = logical.target.value;
    setLogicalEmptyErrorQtr(false);
    setRowsQrt(updatedRowsQtr);
  };
  const handelQuryListpopup = () => {
    handleShowWorkOrderQryList();
  };
  const handleCloseWorkQryList = () => {
    setShowWordOrderQryList(false);
    FilterhandleClose();
    handleCloseSave();
    setselectedOptionValue("");
    setRowsQrt([]);
    setRowsortQrt([]);
  };
  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
  };
  // fetch data using dropdon
  const handleClickOption = async (selectedOption) => {
    setselectedOptionValue(selectedOption);

    let cf_query_title, RowID;

    const hyphenCount = selectedOption.split("-").length - 1;

    if(hyphenCount === 1){
       [cf_query_title, RowID] = selectedOption.split("-")
    }else{
      const parts = selectedOption.split("-");
      cf_query_title = parts[0].trim();
      RowID = parts[parts.length - 1].trim();
    }
 
    setTitleAstReg(cf_query_title);

    setRowsQrt([]);
    setRowsortQrt([]);
    if (selectedOption !== "") {
      Swal.fire({
        title: "Please Wait !",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
      Swal.showLoading();
      try {
        const response = await httpCommon.get(
          "/get_work_order_filter_query_data.php?site_cd=" +
            site_ID +
            "&RowID=" +
            RowID
        );
        //  console.log("response____fluter___",response);
        if (response.data.data && response.data.data.list_typeF && response.data.data.list_typeF.length > 0) {
          const newRows = response.data.data.list_typeF.map((item) => ({
            selectedOption: item.cf_query_list_column,
            operator: item.cf_query_list_operator,
            prompt: item.cf_query_list_prompt,
            valuept: item.cf_query_list_value,
            logical: item.cf_query_list_logical,
            siteCd: site_ID,
            queryTypedd: "F",
          }));
          const timeoutId = setTimeout(() => {
            Swal.close();
            setRowsQrt((prevrowsQrt) => [...prevrowsQrt, ...newRows]);
          }, 3000);
          //setShowAssetByDescp(false);
        } else {
          Swal.fire({
            icon: "error",

            customClass: {
              container: "swalcontainercustom",
            },
            title: "Oops...",
            text: "No record found Please try again !",
          });
        }
        if (response.data.data && response.data.data.list_typeS.length > 0) {
          const newRows = response.data.data.list_typeS.map((item) => ({
            selectedOptionShort: item.cf_query_list_column,
            promptAsd: item.cf_query_list_order_by,
            queryType: "S",
            siteCd: site_ID,
          }));

          // Append newRows to the existing tableData

          const timeoutId = setTimeout(() => {
            Swal.close();
            setRowsortQrt((rowsortQrt) => [...rowsortQrt, ...newRows]);
          }, 3000);
          //setShowAssetByDescp(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleOptionChangeSrtQtr = (index, selectedOptionShort) => {
    const updatedRowsQtr = [...rowsortQrt];
    updatedRowsQtr[index].selectedOptionShort = selectedOptionShort;
    setSelectedOptionEmptyErrorShortQtr(false);
    setRowsortQrt(updatedRowsQtr);
  };
  const handleSelectChangeshortQtr = (index, checked) => {
    const newRows = [...rowsortQrt];
    newRows[index].promptAsd = checked ? "ASC" : "DESC";
    setRowsortQrt(newRows);
  };
  const handleAddRowQrt = () => {
    const isLastRowEmpty =
      rowsQrt.length > 0 &&
      (!rowsQrt[rowsQrt.length - 1].selectedOption ||
        rowsQrt[rowsQrt.length - 1].selectedOption === "");

    if (isLastRowEmpty) {
      setSelectedOptionEmptyErrorQtr(!isLastRowEmpty.selectedOption);
      setValueptEmptyErrorQtr(!isLastRowEmpty.valuept);
      setLogicalEmptyErrorQtr(!isLastRowEmpty.logical);
    } else {
      // Add a new row
      setRowsQrt((prevRows) => [
        ...prevRows,
        {
          selectedOption: "",
          operator: "Like",
          logical: "",
          prompt: "0",
          valuept: "",
          siteCd: site_ID,
          queryTypedd: "F",
        },
      ]);
      setSelectedOptionEmptyErrorQtr(false);
      setValueptEmptyErrorQtr(false);
      setLogicalEmptyErrorQtr(false);
    }
  };
  const handleAddRowShortQrt = () => {
    const isLastRowEmpty =
      rowsortQrt.length > 0 &&
      (!rowsortQrt[rowsortQrt.length - 1].selectedOptionShort ||
        rowsortQrt[rowsortQrt.length - 1].selectedOptionShort === "");

    if (isLastRowEmpty) {
      setSelectedOptionEmptyErrorShortQtr(!isLastRowEmpty.selectedOptionShort);
      //  setSelectedCheckEmptyErrorShortQtr(!isLastRowEmpty.promptAsd);
    } else {
      // Add a new row
      setRowsortQrt((prevRows) => [
        ...prevRows,
        {
          selectedOptionShort: "",
          promptAsd: "",
          siteCd: site_ID,
          queryType: "S",
        },
      ]);
      setSelectedOptionEmptyErrorShortQtr(false);
      // setSelectedCheckEmptyErrorShortQtr(false);
    }
  };
  const handleDeleteRowQrt = (index) => {
    if (rowsQrt.length > 1) {
      const newRows = [...rowsQrt];
      newRows.splice(index, 1);
      setRowsQrt(newRows);
    }
  };
  const handleDeleteRowShortQrt = (index) => {
    if (rowsortQrt.length > 1) {
      const newRows = [...rowsortQrt];
      newRows.splice(index, 1);
      setRowsortQrt(newRows);
    }
  };
  const DeleteAssetRegQryList = async () => {
    const [cf_query_title, RowID] = selectedOptionValue.split("-");

    if (selectedOptionValue && RowID !== "") {
      try {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to delete " + cf_query_title + " query!",
          icon: "warning",
          customClass: {
            container: "swalcontainercustom",
          },
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await httpCommon.get(
              "/WorkOrderQueryListDataDelete.php?value=" +
                RowID +
                "&siteId=" +
                site_ID
            );

            if (response.data.status == "SUCCESS") {
              fetchFilterSubPopupSavedropdon();
              //  setErrord(null);
              setselectedOptionValue("");
              setRowsQrt([]);
              setRowsortQrt([]);
              //setSelectedRow([]);
              Swal.fire("Deleted!", "Your query has been deleted.", "success");
            }
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      console.log("empty");
    }
  };
  const SaveWorkOrderQryList = async () => {
    const [cf_query_title, RowID] = selectedOptionValue.split("-");
    const isAnySelectedOptionShortEmpty = rowsortQrt.some(
      (row) => !row.selectedOptionShort
    );
    if (isAnySelectedOptionShortEmpty && RowID != "") {
    } else {
      Swal.fire({
        title: "Please Wait !",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
      Swal.showLoading();
      const combinedData = {
        rowsQrtData: rowsQrt,
        siteCd: site_ID,
        owner: emp_owner,
        mst_RowID: RowID,
        rowsortQrtData: rowsortQrt,
      };
      try {
        const response = await httpCommon.post(
          "/insert_work_order_query_listsave_data.php",
          combinedData
        );
          //console.log("response__SaveBytncf__",response);
        if (response.data.status == "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Success!",
            text: "Your query update successfully.",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              container: "swalcontainercustom",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              setRowsQrt([]);
              setselectedOptionValue("");
              setRowsortQrt([]);
              RetriveDataQueryList();
              handleCloseWorkQryList();
            }
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  const SaveAsworkorderTbl = () => {
    setShowSaveAs(true);
  };
  const handleCloseSaveAs = () => {
    setShowSaveAs(false);
    setFormDataSv({
      queryName: "",
      description: "",
    });
  };
  const handleCFQrySaveAsBtn = () => {
    if (formDataSv.queryName.trim() !== "") {
      const inputValue = formDataSv.queryName;
      const matchingOption = assetFilterDpd.find(
        (option) => option.cf_query_title === inputValue
      );
      if (matchingOption) {
        //setMessage('Input value matches an option in the list.');
        Swal.fire({
          title: "Are you sure?",
          text: "Do you want to overwrite the query" + " " + inputValue,
          icon: "warning",
          customClass: {
            container: "swalcontainercustom",
          },
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            if (
              rowsQrt?.selectedOption?.trim() !== "" &&
              rowsQrt?.logical?.trim() !== "" &&
              rowsQrt?.valuept?.trim() !== "" &&
              rowsortQrt?.selectedOptionShort?.trim() !== ""
            ) {
              InsertCf_queryListDataSavaAs();
            }
          }
        });
      } else {
        InsertCf_queryListDataSavaAs();
      }
    } else {
      console.log("empty__");
    }
  };

  const InsertCf_queryListDataSavaAs = async () => {
    const site_ID = localStorage.getItem("site_ID");
    const emp_owner = localStorage.getItem("emp_mst_empl_id");

    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    const combinedData = {
      formDataSv: formDataSv,
      rowsQrtData: rowsQrt,
      rowsortQrtData: rowsortQrt,
      SITE_CD: site_ID,
      OWNER_ID: emp_owner,
      availability: "G",
    };

    try {
      const response = await httpCommon.post(
        "/InsertWorkOrderQueryListSaveAsData.php",
        combinedData
      );

      if (response.data.status == "SUCCESS") {
        setTitleAstReg(response.data.Title);
        fetchFilterSubPopupSavedropdon();
        RetriveDataQueryList();
        setRowsQrt([]);
        setselectedOptionValue("");
        setRowsortQrt([]);
        Swal.close();
        handleCloseSave();
        FilterhandleClose();
        handleCloseSaveAs();
        handleCloseWorkQryList();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleExportClick = async () => {
    if (ExportExcelId !== "") {
      Swal.fire({
        title: "Please Wait!",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
      Swal.showLoading();
      try {
        const response = await httpCommon.post(
          `/getWorkOrderListExcelData.php?site_cd=${site_ID}&ItemID=${ExportExcelId}`
        );

        Swal.close();
        if (
          response.data.data &&
          response.data.data.result &&
          response.data.data.result.length > 0
        ) {
          ExportWorkOrderlistToExcel({ resultData: response.data.data.result });
          popover.onClose();
          Swal.close();
        } else {
          setTableData("");
          Swal.fire({
            title: "Opps..!",
            text: "No Record Found!",
            icon: "success",
            customClass: {
              container: "swalcontainercustom",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
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
          `/getWorkOrderListAllDataEcxelsheet.php?site_cd=${site_ID}`
        );

        if (
          response.data.data &&
          response.data.data.result &&
          response.data.data.result.length > 0
        ) {
          ExportWorkOrderlistToExcel({ resultData: response.data.data.result });
          popover.onClose();
          Swal.close();
        } else {
          setTableData("");
          Swal.fire({
            title: "Opps..!",
            text: "No Record Found!",
            icon: "success",
            customClass: {
              container: "swalcontainercustom",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleClosePromt = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return; // Do nothing on backdrop click or escape key press
    }
    setRowsDropdownPrompt([
      {
        selectedOption: "",
        operator: "",
        logical: "",
        valuept: "",
        RowId:"",
        prompt:"",
        siteCd: site_ID,
        queryTypedd: "F",
      },
    ]);
    setShowPromt(false);
  };

  const handleInputValueChangePrompt = (index, newValue) => {
    setRowsDropdownPrompt((prevRows) =>
      prevRows.map((row, idx) =>
        idx === index ? { ...row, valuept: newValue } : row
      )
    );
  };
  
  const fetchDataResponse = async (hasRowIdValuept) => {
    try {
  
      const response = await httpCommon.post(
        "/get_work_order_dropdown_prompt_data.php?page=" + currentPage,
        {
          rows: rowsDropdownPrompt,
          rowsort: "",
          SiteCD:site_ID,
          admin:emp_owner,
          RowId:hasRowIdValuept
        }
      );
      //console.log("response____output",response);
      setTableData(response.data.data.result);
      setTotalRow(response.data.total_count);
      setTitleAstReg(response.data.titleName);
      Swal.close();
    
      handleClosePromt();
  
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  
  }
  
  const handleDropDownPromptSaveAsBtn = async () => {
    const hasEmptyValuept = rowsDropdownPrompt.some(row => !row.valuept.trim());
    const hasRowIdValuept = rowsDropdownPrompt.length > 0 ? rowsDropdownPrompt[0].RowId : null;
  
    if (hasEmptyValuept) {
      // Show error message if any valuept field is empty
      Swal.fire({
        icon: 'error',
        title: "Validation Error !",
        text: 'Please fill in value field before saving.',
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
      return; // Exit the function if validation fails
    }else{
      Swal.fire({
        title: "Please Wait !",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
      Swal.showLoading();
      const combinedData = {
        rowsQrtData: rowsDropdownPrompt,
        siteCd: site_ID,
        RowId:  hasRowIdValuept,
        owner: emp_owner,
      };
      try {
        const response = await httpCommon.post(
          "/insert_work_order_query_dropdown_listsave.php",
          combinedData
        );
          
        if (response.data.status == "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Success!",
            text: "Your query update successfully.",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              container: "swalcontainercustom",
            },
          }).then((result) => {
            if (result.isConfirmed) {
             
              fetchDataResponse(hasRowIdValuept);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
  };

  return (
    <>
      <Helmet>
        <title>CMMS System</title>
        <meta name="description" content="Work Order List" />
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div className="CustomBreadAsset">
          <CustomBreadcrumbs
            heading="Work Order List"
            links={[]}
            action={
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  component={RouterLink}
                  variant="contained"
                  className={button1Active ? "active tableView" : "tableView"}
                  onClick={handleButtonClick}
                >
                  <Iconify icon="fluent:table-20-filled" />
                </Button>

                <Button
                  component={RouterLink}
                  variant="contained"
                  className={
                    button2Active ? "active calendarView" : "calendarView"
                  }
                  onClick={handleButtonClick2}
                >
                  <Iconify icon="clarity:calendar-solid" />
                </Button>

                <Button
                  component={Link}
                  variant="contained"
                  className="AddNewButton2"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  to={{
                    pathname: "/dashboard/work/neworder",
                    state: { select: "New_WorkOrder" },
                  }}
                >
                  New
                </Button>
              </div>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        </div>
        <div className="workReqpage">
          {showDiv1 && (
            <Card>
              <Stack
                spacing={2}
                alignItems={{ xs: "flex-end", md: "center" }}
                direction={{
                  xs: "column",
                  md: "row",
                }}
                sx={{
                  p: 2.5,
                  pr: { xs: 2.5, md: 1 },
                  marginTop: "20px",
                }}
              >
                <Button
                  className="AssetFilterBtn"
                  variant="outlined"
                  sx={{
                    flexShrink: 0,
                  }}
                  onClick={handelFilterAction}
                >
                  <Icon
                    icon="fluent:filter-12-filled"
                    style={{ marginRight: "5px" }}
                  />
                  Filter
                </Button>

                <FormControl
                  sx={{
                    flexShrink: 0,
                    width: { xs: 1, md: 300 },
                  }}
                  className="selectOptioncls"
                >
                  <InputLabel id="select-label" className={(TitleAstReg!== "" || selectedOption)? "selectedcss" : ""}>Select an Option</InputLabel>
               
                  <Select
                    labelId="select-label"
                    id="select"
                    input={<OutlinedInput label="Select an option" />}
                    value={TitleAstReg !== "" ? TitleAstReg : selectedOption}
                    // value={selectedOption}
                    onChange={handleOptionChange}
                    
                    sx={{ textTransform: "capitalize" }}
                  >
                    {assetFilterDpd.map((item) => (
                      <MenuItem key={item.RowID} value={item.cf_query_title}>
                        <Iconify
                          icon="mdi:sql-query"
                          style={{
                            display: "inline-flex",
                            verticalAlign: "middle",
                            marginRight: "6px",
                            marginTop: "-5px",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        <span style={{ verticalAlign: "middle" }}>
                          {item.cf_query_title}
                        </span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  flexGrow={1}
                  sx={{ width: 1 }}
                >
                  <div
                    className={`wordkOrdersearchInput ${
                      isInputFocused ? "active" : ""
                    }`}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="text"
                      className="Seachrinput"
                      placeholder="Search.."
                      ref={inputRef}
                      onKeyDown={handleKeyDown}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                    <div>
                      {filters.name && (
                        <IconButton
                          onClick={handleClearButton}
                          className="customclearbutton"
                        >
                          <Iconify icon="ic:outline-clear" />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={handelSearchButton}
                        className="customsearchbutton"
                      >
                        <Iconify icon="eva:search-fill" />
                      </IconButton>
                    </div>
                  </div>
                  <IconButton onClick={popover.onOpen}>
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                </Stack>
              </Stack>

              <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 180 }}
              >
                <MenuItem
                  onClick={() => {
                    handleExportClick();
                  }}
                >
                  <Iconify icon="solar:export-bold" />
                  Export to Excel
                </MenuItem>
              </CustomPopover>
              {canReset && (
                <WorkOrderTableFiltersResult
                  filters={filters}
                  onFilters={handleFilters}
                  //
                  onResetFilters={handleResetFilters}
                  //
                  results={dataFiltered.length}
                  sx={{ p: 2.5, pt: 0 }}
                />
              )}

              <TableContainer sx={{ position: "relative" }}>
                <TableSelectedAction
                  dense={table.dense}
                  numSelected={table.selected?.length || 0}
                  rowCount={tableData?.length || 0}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  action={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={confirm.onTrue}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  }
                />

                <Scrollbar sx={{ overflowX: "auto", maxHeight: maxHeight }}>
                  <Table
                    size={table.dense ? "small" : "medium"}
                    sx={{ minWidth: 960 }}
                  >
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headLabel={
                        DashbordDataPrmMst != "" ? TABLE_HEADDB : TABLE_HEAD
                      }
                      rowCount={tableData?.length}
                      numSelected={table.selected?.length}
                      onSort={table.onSort}
                      className="stickyheader"
                     
                    />

                    <TableBody className="AssetTable">
                        {isLoading ? ( // Assuming isLoading is a boolean state indicating whether data is loading
                         <TableRow>
                         <TableCell colSpan={numberOfColumns} className="NoRecodcls" >
                         <Dialog open={isLoading} aria-labelledby="loading-dialog-title"  PaperProps={{
                                 style: {
                                     backgroundColor: "transparent", // Set your desired background color here
                                 },
                             }}
                             BackdropProps={{
                               className: "yourbackdropclass",
                             }}
                             >
                         <DialogTitle id="loading-dialog-title"  style={{ textAlign: 'center' }}></DialogTitle>
                           <DialogContent>
                           
                             <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                             <ThreeCircles
                               radius="9"
                               visible={true}
                               ariaLabel="three-circles-loading"
                               color="green"
                            
                             />
                               
                             </div>
                           </DialogContent>
                         </Dialog>
                          
                         </TableCell>
                       </TableRow>
                        ) : (
                          <>
                         
                            {tableData.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={numberOfColumns} className="NoRecodcls" >
                                  No Record Found
                                </TableCell>
                              </TableRow>
                            ) : (
                              <>
                             
                                {dataFiltered.map((row) => (
                                  <WorkOrderTableRow
                                    key={row.id}
                                    row={row}
                                    rowStats={ResponceStats}
                                    selected={table.selected.includes(row.id)}
                                    onSelectRow={() => table.onSelectRow(row.id)}
                                    onDeleteRow={() => handleDeleteRow(row.col71,row)}
                                    onEditRow={() => handleEditRow(row.col71,row)}
                                    onCompleteRow={() => handleCompleteRow(row.col71,row)}
                                    onCloseRow={() => handleCloseRow(row.col71,row)}
                                  />
                                ))}
                              </>
                            )}
                          </>
                        )}
                        <TableEmptyRows
                          emptyRows={emptyRows(
                            table.page,
                            table.rowsPerPage,
                            tableData.length
                          )}
                        />
                      </TableBody>

                  </Table>
                </Scrollbar>
              </TableContainer>

              <TablePaginationCustom
                count={TotalCount > 0 ? TotalCount : totalRow}
                page={currentPage - 1}
                rowsPerPage={table.rowsPerPage}
                onPageChange={(event, newPage) => {
                  setCurrentPage(newPage + 1);

                  table.onChangePage(event, newPage);
                }}
                currentPage={currentPage}
                //  onRowsPerPageChange={table.onChangeRowsPerPage}
                onRowsPerPageChange={(rowsPerPage) => {
                  table.onChangeRowsPerPage(rowsPerPage);
                }}
                // dense={table.dense}
                //  onChangeDense={table.onChangeDense}
              />
            </Card>
          )}
        </div>
        {showDiv2 && (
          <div className="clandarV">
            <WorkOrderCalendarView />
          </div>
        )}
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete{" "}
            <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
      {/* =============================== filter model  =================================  */}
      <BootstrapDialog
        onClose={FilterhandleClose}
        aria-labelledby="customized-dialog-title"
        open={FilterShow}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="mdi:sql-query" />
          <span style={{ marginLeft: "2px" }}>Define Query</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={FilterhandleClose}
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
          <div className="queryBtn">
            <Grid container spacing={1}>
              <Grid item>
                <Button variant="outlined" onClick={handelQuryListpopup}>
                  <Iconify icon="carbon:query-queue" /> Query List
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  //disabled={isButtonDisabled}
                  onClick={retriveBtn}
                >
                  <Iconify icon="carbon:data-base" /> Retrive
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={SaveRegTbl}
                  disabled={isButtonDisabled}
                >
                  <Iconify icon="mingcute:save-fill" />
                  Save
                </Button>
              </Grid>
            </Grid>
          </div>
          <div className="filterByorder">
            <fieldset className="short-by-fieldset2">
              <legend>Filter By</legend>
              <table>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}> ( </th>
                    <th>Field Name</th>
                    <th>Operator</th>
                    <th>Prompt</th>
                    <th>Value</th>
                    <th>Logical</th>
                    <th style={{ textAlign: "center" }}> ) </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td style={{ width: "7%" }}>
                        <Select
                          className="custom-Astselect"
                          style={{ width: "100%" }}
                        >
                          {Openbracket.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td style={{ width: "25%" }}>
                        <Select
                          className={`custom-Astselect ${
                            index === rows.length - 1 &&
                            selectedOptionEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          style={{ width: "100%" }}
                          // value={/* add the corresponding value from your state */}
                          onChange={(event) =>
                            handleOptionChange1(index, event.target.value)
                          }
                        >
                          {rowOptions.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>

                      <td style={{ width: "17%" }}>
                        <Select
                          style={{ width: "100%" }}
                          className="custom-Astselect"
                          onChange={(event) =>
                            handleOptionChangeOprter(index, event.target.value)
                          }
                        >
                          {oprt.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td style={{ width: "8%" }}>
                        <input
                          style={{ width: "100%" }}
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckChecked"
                          onChange={(e) =>
                            handleSelectChange(index, e.target.checked)
                          }
                        />
                      </td>
                      <td style={{ width: "26%" }}>
                        <input
                          type="text"
                          style={{ width: "100%" }}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          oninput="handleInput(event)"
                          onChange={(event) =>
                            handleInputValueChangeQtr(index, event.target.value)
                          }
                        />
                      </td>
                      <td style={{ width: "10%" }}>
                        <Select
                          style={{ width: "100%" }}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && logicalEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          // value={/* add the corresponding value from your state */}
                          onChange={(logical) =>
                            handleIncludeChangeLogcil(index, logical)
                          }
                        >
                          {Logcl.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td style={{ width: "7%" }}>
                        <Select
                          style={{ width: "100%" }}
                          className="custom-Astselect"
                          // value={/* add the corresponding value from your state */}
                          //  onChange={(event) => handleOptionChange1(index, event.target.value)}
                        >
                          {Closebracket.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td>
                        <IconButton
                          className="clsBtn"
                          aria-label="delete"
                          size="small"
                          onClick={() => handleDeleteRowPopup(index)}
                        >
                          <Iconify icon="carbon:close" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleAddRow} className="AddFilterBtn">
                  <Iconify
                    icon="material-symbols:add"
                    style={{
                      verticalAlign: "0px",
                      fontSize: "16px",
                      marginRight: "2px",
                    }}
                  />
                  Add new filter
                </Button>
              </div>
            </fieldset>
          </div>
          <div className="filterShort">
            <fieldset className="short-by-fieldset2">
              <legend>Sort By</legend>
              <table>
                <thead>
                  <tr>
                    <th>Field Name</th>
                    <th></th>
                    <th></th>
                    <th>Ascending?</th>
                  </tr>
                </thead>
                <tbody>
                  {rowsort.map((row, index) => (
                    <tr key={index}>
                      <td style={{ width: "60%" }}>
                        <Select
                          style={{ width: "100%" }}
                          className={`custom-Astselect shrt ${
                            index === rowsort.length - 1 &&
                            selectedOptionEmptyErrorShort
                              ? "error-border"
                              : "mammama"
                          }`}
                          // value={/* add the corresponding value from your state */}
                          onChange={(event) =>
                            handleOptionChange2(index, event.target.value)
                          }
                        >
                          {rowOptions.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>

                      <td style={{ width: "15%" }}></td>
                      <td style={{ width: "15%" }}></td>
                      <td style={{ width: "10%" }}>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          checked={rowsort[index].promptAsd === "ASC"}
                          onChange={(e) =>
                            handleSelectChangeshort(index, e.target.checked)
                          }
                          id="flexCheckDefault"
                          style={{
                            width: "65px",
                            height: "15px",
                            marginTop: "-5px",
                          }}
                        />
                      </td>
                      <td></td>
                      <td>
                        <IconButton
                          className="clsBtn"
                          aria-label="delete"
                          size="small"
                          onClick={() => handleDeleteRowShort(index)}
                        >
                          <Iconify icon="carbon:close" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleAddRowShort} className="AddFilterBtn">
                  <Iconify
                    icon="material-symbols:add"
                    style={{
                      verticalAlign: "0px",
                      fontSize: "16px",
                      marginRight: "2px",
                    }}
                  />
                  Add new filter
                </Button>
              </div>
            </fieldset>
          </div>
        </DialogContent>
      </BootstrapDialog>
      {/* =============================== filter model Save Button  =================================  */}
      <BootstrapDialog
        onClose={handleCloseSave}
        aria-labelledby="customized-dialog-title"
        open={showSave}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="material-symbols-light:file-save-sharp" />
          <span style={{ marginLeft: "2px" }}>Save Query</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSave}
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
          <div className="astSubpopup">
            <fieldset className="Subpopup-fieldset">
              <legend>Query name:</legend>
              <div className="form-group ">
                <input
                  type="text"
                  id="customInput"
                  name="queryName"
                  value={formDataSv.queryName}
                  onChange={handleInputChangeSav}
                  className="bsc_sav"
                  list="options"
                  style={{ width: "100%" }}
                />

                <datalist id="options">
                  {assetFilterDpd.map((option, index) => (
                    <option key={index.RowID} value={option.cf_query_title} />
                  ))}
                </datalist>
              </div>
            </fieldset>

            <fieldset className="Subpopup-fieldset">
              <legend>Description:</legend>
              <div className="form-group">
                <textarea
                  id="w3review"
                  name="description"
                  rows="3"
                  value={formDataSv.description}
                  onChange={handleInputChangeSav}
                  cols="70"
                  style={{ width: "100%" }}
                />
              </div>
            </fieldset>

            <fieldset className="Subpopup-fieldset">
              <legend>Availability:</legend>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios1"
                  value="G"
                  checked
                  onChange={handleInputChangeSav}
                />
                <label class="form-check-label" for="exampleRadios1">
                  Global(available to everyone)
                </label>
                <input
                  class="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios2"
                  value="P"
                  onChange={handleInputChangeSav}
                />
                <label class="form-check-label" for="exampleRadios2">
                  Personal
                </label>
              </div>
            </fieldset>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleCFQrySave}>
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* =============================== filter model Query List Button  =================================  */}
      <BootstrapDialog
        onClose={handleCloseWorkQryList}
        aria-labelledby="customized-dialog-title"
        open={showWordOrderQryList}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="mdi:sql-query" />
          <span style={{ marginLeft: "2px" }}> Query List</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseWorkQryList}
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
          <div className="queryBtn">
            <Grid container spacing={1}>
              <Grid item>
                <Button variant="outlined" onClick={DeleteAssetRegQryList}>
                  <Iconify icon="fluent:delete-48-regular" /> Delete
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={SaveWorkOrderQryList}>
                  <Iconify icon="ic:outline-save-as" /> Save
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={SaveAsworkorderTbl}>
                  <Iconify icon="fad:saveas" />
                  Save As
                </Button>
              </Grid>
            </Grid>
          </div>
          <div>
            <div className="shortBydd list mt-4">
              <div className="table-containeR">
                <fieldset className="Query-by-fieldset">
                  <legend>Query Name</legend>
                  <table className="custom-tablE">
                    <thead>
                      <tr>
                        <th style={{ width: "100%" }}>Query Title</th>

                        <th style={{ width: "10%" }}>Default?</th>
                      </tr>
                    </thead>
                    <tbody>
                     
                      <Select
                        id="select"
                        style={{ width: "60%" }}
                        value={selectedOptionValue}
                        // onChange={handleClickOption}
                        onChange={(event) =>
                          handleClickOption(event.target.value)
                        }
                        sx={{ textTransform: "capitalize" }}
                      >
                        {assetFilterDpd.map((item) => (
                          <MenuItem
                            key={item.RowID}
                            value={`${item.cf_query_title}-${item.RowID}`}
                          >
                            {item.cf_query_title}
                          </MenuItem>
                        ))}
                      </Select>
                      <td>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          checked={isChecked}
                          onChange={handleCheckboxClick}
                          style={{
                            width: "65px",
                            height: "15px",
                            marginTop: "-5px",
                          }}
                        />
                      </td>
                    </tbody>
                  </table>
                </fieldset>
              </div>
            </div>
            <div className="FiltrBydd mt-2">
              <div>
                <fieldset className="short-by-fieldset2">
                  <legend>Filter By</legend>
                  <table style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center", width: "7%" }}>(</th>
                        <th style={{ width: "25%" }}>Field Name</th>
                        <th style={{ width: "17%" }}>Operator</th>
                        <th style={{ width: "8%" }}>Prompt</th>
                        <th style={{ width: "26%" }}>Value</th>
                        <th style={{ width: "10%" }}>Logical</th>
                        <th style={{ textAlign: "center", width: "7%" }}>)</th>
                      </tr>
                    </thead>

                    <tbody>
                     
                      {rowsQrt.map((row, index) => (
                        <React.Fragment key={index}>
                          <tr key={index}>
                            <td style={{ width: "7%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className="custom-Astselect"
                              >
                                {Openbracket.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>
                            <td style={{ width: "25%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className={`custom-Astselect ${
                                  index === rowsQrt.length - 1 &&
                                  selectedOptionEmptyErrorQtr
                                    ? "error-border"
                                    : "mammama"
                                }`}
                                value={row.selectedOption || ""}
                                onChange={(event) =>
                                  handleOptionChangeQtr(
                                    index,
                                    event.target.value
                                  )
                                }
                              >
                                {rowOptions.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>
                            <td style={{ width: "17%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className="custom-Astselect"
                                value={row.operator || "Like"}
                                onChange={(event) =>
                                  handleOptionChangeOprterQtr(
                                    index,
                                    event.target.value
                                  )
                                }
                              >
                                {oprt.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>
                            <td style={{ width: "8%" }}>
                              <input
                                class="form-check-input"
                                type="checkbox"
                                onChange={(e) =>
                                  handleSelectChangeQtr(index, e.target.checked)
                                }
                                checked={row.prompt === "1"}
                                id="flexCheckDefault"
                                style={{
                                  width: "65px",
                                  height: "15px",
                                  marginTop: "-5px",
                                }}
                              />
                            </td>
                            <td style={{ width: "26%" }}>
                              <input
                                type="text"
                                style={{ width: "100%" }}
                                className={`custom-Astselect ${
                                  index === rowsQrt.length - 1 &&
                                  valueptEmptyErrorQtr
                                    ? "error-border"
                                    : "mammama"
                                }`}
                                value={row.valuept || ""}
                                oninput="handleInput(event)"
                                onChange={(event) =>
                                  handleInputValueChangeQtr2(
                                    index,
                                    event.target.value
                                  )
                                }
                              />
                            </td>

                            <td style={{ width: "10%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className={`custom-Astselect ${
                                  index === rowsQrt.length - 1 &&
                                  logicalEmptyErrorQtr
                                    ? "error-border"
                                    : "mammama"
                                }`}
                                value={row.logical || ""}
                                // value={/* add the corresponding value from your state */}
                                // onChange={(logical) =>
                                //   handleIncludeChangeLogcilQtr(index, logical)
                                // }
                              >
                                {Logcl.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>

                            <td style={{ width: "7%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className="custom-Astselect"

                                // value={rowOptions.find(option => option.value === row.selectedOption)}
                                //onChange={(selectedOption) => handleOptionChange1(index, selectedOption)}
                              >
                                {Closebracket.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>

                            <td>
                              <IconButton
                                className="clsBtn"
                                aria-label="delete"
                                size="small"
                                onClick={() => handleDeleteRowQrt(index)}
                              >
                                <Iconify icon="carbon:close" />
                              </IconButton>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={handleAddRowQrt} className="AddFilterBtn">
                      <Iconify
                        icon="material-symbols:add"
                        style={{
                          verticalAlign: "0px",
                          fontSize: "16px",
                          marginRight: "2px",
                        }}
                      />
                      Add new filter
                    </Button>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="shortBydd mt-4 shtQtr">
              <div>
                <fieldset className="short-by-fieldset">
                  <legend>Sort By</legend>
                  <table style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th>Field Name</th>
                        <th></th>
                        <th></th>
                        <th>Ascending?</th>
                      </tr>
                    </thead>

                    <tbody>
                      {rowsortQrt.map((row, index) => (
                        <tr key={index}>
                          <td style={{ width: "60%" }}>
                            <Select
                              style={{ width: "100%" }}
                              className={`custom-Astselect sht ${
                                index === rowsortQrt.length - 1 &&
                                selectedOptionEmptyErrorShortQtr
                                  ? "error-border"
                                  : "mammama"
                              }`}
                              // value={/* add the corresponding value from your state */}
                              onChange={(event) =>
                                handleOptionChangeSrtQtr(
                                  index,
                                  event.target.value
                                )
                              }
                              value={row.selectedOptionShort || ""}
                            >
                              {rowOptions.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </td>
                          <td style={{ width: "15%" }}></td>
                          <td style={{ width: "15%" }}></td>
                          <td style={{ width: "8%" }}>
                            <input
                              class="form-check-input"
                              type="checkbox"
                              //checked={row.prompt === '1'}
                              checked={rowsortQrt[index].promptAsd === "ASC"}
                              onChange={(e) =>
                                handleSelectChangeshortQtr(
                                  index,
                                  e.target.checked
                                )
                              }
                              id="flexCheckDefault"
                              style={{
                                width: "65px",
                                height: "15px",
                                marginTop: "-5px",
                              }}
                            />
                          </td>
                          <td></td>
                          <td>
                            <IconButton
                              className="clsBtn"
                              aria-label="delete"
                              size="small"
                              onClick={() => handleDeleteRowShortQrt(index)}
                            >
                              <Iconify icon="carbon:close" />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      onClick={handleAddRowShortQrt}
                      className="AddFilterBtn"
                    >
                      <Iconify
                        icon="material-symbols:add"
                        style={{
                          verticalAlign: "0px",
                          fontSize: "16px",
                          marginRight: "2px",
                        }}
                      />
                      Add new filter
                    </Button>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </DialogContent>
      </BootstrapDialog>

      {/* =============================== filter model Save As Button  =================================  */}
      <BootstrapDialog
        onClose={handleCloseSaveAs}
        aria-labelledby="customized-dialog-title"
        open={showSaveAs}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="material-symbols-light:file-save-sharp" />
          <span style={{ marginLeft: "2px" }}>Save Query As</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSaveAs}
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
          <div className="astSubpopup">
            <fieldset className="Subpopup-fieldset">
              <legend>Query name:</legend>
              <div className="form-group ">
                <input
                  type="text"
                  id="customInput"
                  name="queryName"
                  value={formDataSv.queryName}
                  onChange={handleInputChangeSav}
                  className="bsc_sav"
                  list="options"
                  style={{ width: "100%" }}
                />

                <datalist id="options">
                  {assetFilterDpd.map((option, index) => (
                    <option key={index.RowID} value={option.cf_query_title} />
                  ))}
                </datalist>
              </div>
            </fieldset>

            <fieldset className="Subpopup-fieldset">
              <legend>Description:</legend>
              <div className="form-group">
                <textarea
                  id="w3review"
                  name="description"
                  rows="3"
                  value={formDataSv.description}
                  onChange={handleInputChangeSav}
                  cols="70"
                  style={{ width: "100%" }}
                />
              </div>
            </fieldset>

            <fieldset className="Subpopup-fieldset">
              <legend>Availability:</legend>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios1"
                  value="G"
                  checked
                  onChange={handleInputChangeSav}
                />
                <label class="form-check-label" for="exampleRadios1">
                  Global(available to everyone)
                </label>
                <input
                  class="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios2"
                  value="P"
                  onChange={handleInputChangeSav}
                />
                <label class="form-check-label" for="exampleRadios2">
                  Personal
                </label>
              </div>
            </fieldset>
          </div>
        </DialogContent>
        <DialogActions>
          <Grid item>
            <Button variant="outlined" onClick={handleCFQrySaveAsBtn}>
              <Iconify icon="mingcute:save-line" /> Save
            </Button>
          </Grid>
        </DialogActions>
      </BootstrapDialog>

       {/* =============================== filter DropDown Prompt  =================================  */}
       <BootstrapDialog
        onClose={handleClosePromt}
        aria-labelledby="customized-dialog-title"
        open={showPromt}
        maxWidth="md"
        fullWidth
        disableBackdropClick={true} 
        disableEscapeKeyDown={true}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="material-symbols-light:file-save-sharp" />
          <span style={{ marginLeft: "2px" }}>Query Prompter</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleClosePromt()}
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
          <div className="astSubpopup">
            <fieldset className="Subpopup-fieldset">
              <legend>Please Fill In The Value</legend>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                   
                    <th>Column</th>
                    <th>Operator</th>
                    <th>Value</th>
                    <th>Logical</th>
                
                  </tr>
                </thead>
                <tbody>
                  {rowsDropdownPrompt.map((row, index) => {
                    const isRowEmpty = !row.selectedOption && !row.operator && !row.valuept;
                    return !isRowEmpty ? (
                    <tr key={index}>
                      <td style={{ width: "25%" }}>
                      <input
                          type="text"
                          style={{ width: "100%" }}
                          disabled
                          value={row.selectedOption || ""}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          oninput="handleInput(event)"
                          
                        />
                      </td>

                      <td style={{ width: "25%" }}>
                      <input
                          type="text"
                          style={{ width: "100%" }}
                          value={row.operator || ""}
                          disabled
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          oninput="handleInput(event)"
                          
                        />
                      </td>
                      <td style={{ width: "25%" }}>
                      <input
                          type="text"
                          style={{ width: "100%" }}
                          value={row.valuept || ""}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                         
                          onChange={(event) => handleInputValueChangePrompt(index, event.target.value)}
                        />
                       
                      </td>
                      <td style={{ width: "25%" }}>
                        <input
                          type="text"
                          style={{ width: "100%" }}
                          disabled
                          value={row.logical || ""}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          oninput="handleInput(event)"
                          
                        />
                      </td>
                      
                    </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
             
            </fieldset>

          </div>
        </DialogContent>
        <DialogActions>
          <Grid item>
            <Button variant="outlined" onClick={handleDropDownPromptSaveAsBtn}>
              <Iconify icon="iconoir:submit-document" /> Save
            </Button>
          </Grid>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  //   if (name) {
  //     inputData = inputData.filter(
  //       (tableData) => tableData.col2.toLowerCase().indexOf(col2.toLowerCase()) !== -1
  //     );
  //   }

  return inputData;
}
WorkOrderList.defaultProps = {
  onValueChange: () => {},
};

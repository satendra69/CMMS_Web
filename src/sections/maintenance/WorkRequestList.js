import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// @mui
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Unstable_Grid2";
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from '@mui/material/Stack';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Moment from "moment";
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock

// components
import { useSettingsContext } from 'src/components/settings';
import TextField from '@mui/material/TextField';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import httpCommon from 'src/http-common';
import Swal from 'sweetalert2';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Icon } from '@iconify/react';
import { ThreeCircles } from 'react-loader-spinner';

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import { styled } from "@mui/material/styles";

import WorkReqTableRow from './workrequest-table-row';
import WorkReqTableFiltersResult from './WorkReqTableFiltersResult';
import ExportWorkReqlistToExcel from "./ExportFIle/ExportWorkReqlistToExcel";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
// ----------------------------------------------------------------------



const defaultFilters = {
  col1: '',
  publish: [],
  stock: [],
};
// ----------------------------------------------------------------------

export default function WorkRequestList() {
  const site_ID = localStorage.getItem('site_ID');
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const location = useLocation();

  const [DashbordDataGauge, setDashbordDataGauge] = useState(
    location.state?.GaugeDashbordData
  );
  
  const DashbordDataSrt = location.state?.GaugeDashbordDataSort || [];

  const [isLoading, setIsLoading] = useState(true);
  const popover = usePopover();
  const router = useRouter();
  const navigate = useNavigate();
  const table = useTable();

  const settings = useSettingsContext();
  const [maxHeight, setMaxHeight] = useState("400px");
  const [tableData, setTableData] = useState([]);
  const [totalRow, setTotalRow] = useState();
  const [Headerdata, setheaderData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const { selectedOption: returnedSelectedOption, comeBack } = location.state || {};
  const [selectedOption, setSelectedOption] = useState(returnedSelectedOption || '');
  const [selectedComeBack, setSelectedComeBack] = useState(comeBack || '');

  const confirm = useBoolean();
 
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef(null);
  const numberOfColumns = "71";
  const [FilterShow, setFilterShow] = useState(false);
  const [ResponceStats, setResponceStats] = useState("");
 // const FilterhandleClose = () => setFilterShow(false);
  const [showSave, setShowSave] = useState(false);
  const [AssetFiledname, setAssetFiledname] = useState([]);
  const [WorkReqFiledname, setWordReqFiledname] = useState([]);
  const [selectedOptionEmptyError, setSelectedOptionEmptyError] =
  useState(false);
  const [selectedOptionEmptyErrorShort, setSelectedOptionEmptyErrorShort] =
  useState(false);
  const [valueptEmptyError, setValueptEmptyError] = useState(false);
  const [logicalEmptyError, setLogicalEmptyError] = useState(false);
  const [TitleAstReg, setTitleAstReg] = useState("");

  // const [assetFilterDpd, setAssetFilterDpd] = useState([]);
  const [workReqFilterDpd, setWorkReqFilterDpd] = useState([]);

  const [DropListIdGet, setDropListIdGet] = useState(
    location.state?.DropListId || []
  );
  const [selectedOptionValue, setselectedOptionValue] = useState();
  const [showWordOrderQryList, setShowWordOrderQryList] = useState(false);
  const handleShowWorkOrderQryList = () => setShowWordOrderQryList(true);
  const [showSaveAs, setShowSaveAs] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOptionEmptyErrorQtr, setSelectedOptionEmptyErrorQtr] =
  useState(false);
  const [valueptEmptyErrorQtr, setValueptEmptyErrorQtr] = useState(false);
  const [logicalEmptyErrorQtr, setLogicalEmptyErrorQtr] = useState(false);
  const [
    selectedOptionEmptyErrorShortQtr,
    setSelectedOptionEmptyErrorShortQtr,
  ] = useState(false);
  const [ExportExcelId, setExportExcelId] = useState("");
  const [selectDropRowID, setselectDropRowID] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);
  const [TableSearchData, setTableSearchData] = useState([]);
  const [rowId, setRowId] = useState([]);
  const [showApprove, setShowApprove] = useState(false);
  const handleCloseApprove = () => setShowApprove(false);
  const [Status, setStatus] = useState([]);
  const [selected_Status, setSelected_Status] = useState([]);
  const [Originator, setOriginator] = useState([]);
  const [selected_Originator, setSelected_Originator] = useState([]);
  const [WorkGroup, setWorkGroup] = useState([]);
  const [selected_WorkGroup, setSelected_WorkGroup] = useState([]);
  const [Button_save, setButton_save] = useState("");
  const [errorMessage, setErrorMessage] = useState('');

  const [showDisapprove, setShowDisapprove] = useState(false);
  const handleCloseDisapprove = () => setShowDisapprove(false);
  const [RejectDate, setRejectDate] = useState(new Date());
  const [RejectedDescription, setRejectedDescription] = useState("");

  const [QueryTitleRowId, setQueryTitleRowID] = useState("");
  const [defaultTitle, setDefaultTitle] = useState('');
  const [tempRowID, setTempRowID] = useState(null);
  
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
  
 

  const fetchFilterSubPopupSavedropdon = async () => {
    // Get dropdown value using api
    try {
      const response = await httpCommon.get(
        `/get_workReq_filter_dropdown.php?site_cd=${site_ID}&auditUser=${AuditUser}`
      );
       // console.log("check__-asset__",response);
      setWorkReqFilterDpd(response.data);
  // Swal.close();
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
        "/get_gauge_dashbord_work_request_data.php?page=" + currentPage,
        {
          rows: DashbordDataGauge,
          rowsort: DashbordDataSrt,
          // rowsPrm: DashbordDataPrmMst,
          site_cd: site_ID,
          emp_ID:emp_owner,
        }
      );
     // console.log("response____dashobord",response);
      if (response.data.status === "SUCCESS") {
        if (response.data.data.result.length > 0) {
          setTableData(response.data.data.result);
          setheaderData(response.data.data.header);
          setTotalRow(response.data.total_count);
          setselectDropRowID(DropListIdGet);
          // setResponceStats(response.data.StatusPRM);
          // setTotalCount(response.data.TotalCountPRM);
        }
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [site_ID, currentPage]);

  console.log("selectDropRowID____",selectDropRowID);
   // Get Api data useEffect
  const fetchData = useCallback(async () => {
  
    setIsLoading(true);
    
    try {
      const response = await httpCommon.get(
        `/get_work_request_master_table_data.php?site_cd=${site_ID}&page=${currentPage}`
      );
    //  console.log("response_____fetcha___",response);
       // console.log("selectedOption____",selectedOption);
      if(selectedOption === ""){
        setheaderData(response.data.data.header);
        setTableData(response.data.data.result);
        setTotalRow(response.data.total_count);
       }else{
        setheaderData(response.data.data.header);
       }

      // get Dropdown Title
      const response2 = await httpCommon.get(
        `/get_workReq_filter_dropdown.php?site_cd=${site_ID}&auditUser=${AuditUser}`
      );
    
      if(selectedOption === ""){
        const defaultItem = response2.data.find(item => item.cf_query_default_flag === "1");
         if (defaultItem) {
           setDefaultTitle(defaultItem.cf_query_title);
           setselectDropRowID(defaultItem.RowID);
         }
       }else{
         setDefaultTitle(selectedOption);
      }

      setIsLoading(false);
    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [site_ID, currentPage]);

//console.log("defaultTitle____",defaultTitle);

  useEffect(() => {
    if (defaultTitle) {

      handleOptionTableList({ target: { value: defaultTitle }});

    }
  }, [defaultTitle,site_ID, currentPage]);

  const handleOptionTableList = async (event,responseData) => {
   
    const selectedValue = event?.target?.value || selectedOption;
    setCurrentPage(1);
  
    const selectedOptionObjectFilter = workReqFilterDpd.find(
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
      if (selectedComeBack === "" || selectedComeBack === undefined){
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
       // console.log("firsttime load___",response);
          if (response.data.data && response.data.data.list_typeF && response.data.data.list_typeF.length > 0) {
            const newRows = response.data.data.list_typeF.map((item) => ({
              selectedOption: item.cf_query_list_column,
              operator: item.cf_query_list_operator,
              valuept: item.cf_query_list_value,
              logical: item.cf_query_list_logical,
              siteCd: site_ID,
              RowId: GetRowID,
              prompt:GetPrompt,
              Column:item.customize_header,
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
    }

      setExportExcelId(GetRowID);
      setselectDropRowID(GetRowID);
      setCurrentPage(1);
      setDropListIdGet([]);
      setTitleAstReg("");
    }

    setSelectedOption(selectedValue);
  };
//console.log("tableData_____",tableData);
  const handleOptionChange = async (event,responseData) => {
    const selectedValue = event?.target?.value || selectedOption;

    setDefaultTitle("");
    setSelectedComeBack("");
    setCurrentPage(1);
  
    const selectedOptionObjectFilter = workReqFilterDpd.find(
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
        setTempRowID(GetRowID);
        Swal.fire({
          title: "Please Wait !",
          allowOutsideClick: false,
          customClass: {
            container: "swalcontainercustom",
          },
        });
        Swal.showLoading();
      //  console.log("GetRowID____",GetRowID)
        try {
          const response = await httpCommon.get(
            "/get_work_order_filter_query_data.php?site_cd=" +
              site_ID +
              "&RowID=" +
              GetRowID
          );
         // console.log("response_______selectOption___",response);
          if (response.data.data && response.data.data.list_typeF && response.data.data.list_typeF.length > 0) {
            const newRows = response.data.data.list_typeF.map((item) => ({
              selectedOption: item.cf_query_list_column,
              operator: item.cf_query_list_operator,
              valuept: item.cf_query_list_value,
              logical: item.cf_query_list_logical,
              siteCd: site_ID,
              RowId: GetRowID,
              prompt:GetPrompt,
              Column:item.customize_header,
              queryTypedd: "F",
            }));
            const timeoutId = setTimeout(() => {
              Swal.close();
              setRowsDropdownPrompt(newRows);
              setSelectedOption(selectedValue);
            }, 3000);
            //setShowAssetByDescp(false);
          } else {
            setSelectedOption(selectedValue);
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
      setTitleAstReg("");
    }else{
      const GetRowID = selectedOptionObject.RowID;
      setExportExcelId(GetRowID);
      setselectDropRowID(GetRowID);
      setCurrentPage(1);
      setDropListIdGet([]);
      setTitleAstReg("");
    }
    setSelectedOption(selectedValue);
    await new Promise((resolve) => setTimeout(resolve, 0));
  
  };

  const fetchDataUsingRefreshBtn = useCallback(async () =>{
    getb();
}, [site_ID, currentPage, selectDropRowID]);

  const getb = useCallback(async () => {
  
    setIsLoading(true);
    try {
     
      const response = await httpCommon.post(
        `/get_workreq_option_list_data.php?site_cd=${site_ID}&ItemID=${selectDropRowID}&page=${currentPage}&EmpId=${emp_owner}`
      );
      //  console.log("check___api__data__",response);
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

  const get_dropdown = async () => {
    try {
      const responseJson = await httpCommon.post(
        `/getDropdownApprove.php?site_ID=${site_ID}`
      );
     // console.log("response___dropdown",responseJson);
      if (responseJson.data.status === 'SUCCESS') {
      
       // console.log('get_dropdown____', responseJson.data)
  
         let Status = responseJson.data.data.WorkorderStatus.map(item => ({
             label:  item.wrk_sts_desc,
             value: item.wrk_sts_status +" : "+item.wrk_sts_desc            
             }));
             setStatus(Status);
  
         let Originator = responseJson.data.data.WKO_Originator.map(item => ({
           label: item.emp_mst_empl_id +" : "+ item.emp_mst_name ,
           value: item.emp_mst_empl_id            
           }));                   
           setOriginator(Originator);  
           
         let WorkGroup = responseJson.data.data.WKO_Work_Group.map(item => ({
           label: item.wrk_grp_grp_cd +" : "+ item.wrk_grp_desc ,
           value: item.wrk_grp_grp_cd            
           }));                   
           setWorkGroup(WorkGroup);  

           setButton_save("Approve");
           
     }else{
         Swal.close();
         Swal.fire({
             icon: 'error',
             title: 'Oops...',
             text: responseJson.data.message,
             
           })
     }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

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

  const handleDeleteRow = useCallback(async (id, row) => {
  //  console.log("row++++++____", row);
    const Rowid = row.RowID;
   // console.log("Rowid____", Rowid); row.wkr_mst_wr_status === 'A'
    if (Rowid !== '') {
      if(row.wkr_mst_wr_status === 'A'){
        Swal.fire({
          title: "Warning!",
          text: `You are not allowed to delete the work request. The work request ${row.wkr_mst_wr_no} was approved.`,
          icon: "warning"
          });
          return;
      }else if(row.wkr_mst_wr_status === 'D'){
        Swal.fire({
          title: "Deleted!",
          text: `You are not allowed to delete the work request. The work request ${row.wkr_mst_wr_no} was disapproved.`,
          icon: "warning"
          });
          return;
      }
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
    
          try {
            const response = await httpCommon.get(
              `/work_request_delete_record.php?site_cd=${site_ID}&mst_id=${Rowid}`
            );
            
          //  console.log("response_____delete___",response);
            if(response.data.status == "SUCCESS"){
              Swal.fire({
              title: "Deleted!",
              text: response.data.message,
              icon: "success"
              });
            }
            if(response.data.status == "ERROR"){
              Swal.fire({
              title: "Oops!",
              text: response.data.message,
              icon: "error"
              });
            }
            setIsLoading(false);
          
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          
        }
      });
    }
  }, [tableData, router, site_ID]);
  
  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id,row) => {
  
      const Rowid = row.col31;
      const WorkReqNo = row.col2;
        console.log("click_row_id__",row)
      if (Rowid !== '' && WorkReqNo !== '') {
        navigate(`/dashboard/work/newRequest`, {
          state: {
            RowID:Rowid,
            WorkReqNo:WorkReqNo,
            currentPage,
            selectedOption,
          },
        });
      }
    
    },
    [router,currentPage, selectedOption]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    inputRef.current.value = '';
    fetchData();
  }, [fetchData]);

  const handleFilterName = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, name: value });

    const filteredData = tableData.filter((item) =>
      item.col1.toLowerCase().includes(value.toLowerCase())
    );
    setTableData(filteredData);
  };
 

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

  // Filter funcation
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

  const FilterhandleClose = () => {
    // Call your custom logic here before closing the filter
    if (rows.length > 1) {
      const newRows = [rows[0]]; // Keep only the first row
      setRows(newRows);
    }
  
    // Call handleDeleteRowShort to remove all rowsort except the first one
    if (rowsort.length > 1) {
      const newRowsort = [rowsort[0]]; // Keep only the first row
      setRowsort(newRowsort);
    }
    
    // Close the filter
    setFilterShow(false);
  };
  const handelFilterAction = () => {
    if (rows.length > 1) {
      const newRows = [rows[0]]; // Keep only the first row
      setRows(newRows);
    }
  
    // Call handleDeleteRowShort to remove all rowsort except the first one
    if (rowsort.length > 1) {
      const newRowsort = [rowsort[0]]; // Keep only the first row
      setRowsort(newRowsort);
    }
    setFilterShow(true);
    getWorkReqListLebel();
  };
  const rowOptions = WorkReqFiledname.map((row) => ({
    value: row.column_name,
    label: `${row.default_label}`,
  }));
    /* Filter dropdown value */
    const getWorkReqListLebel = async () => {
      try {
        const response = await httpCommon.get("/getWorkReqFilterName.php");
       // console.log("response___assetList",response);
        if (response.data.status == "SUCCESS") {
          setWordReqFiledname(response.data.data);
          //setAstdetLabel(response.data.data.ast_det);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

      // Retrive button  funcation,setTableData
  const RetriveData = async () => {
    setCurrentPage(1);
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
        "/get_retrive_popup_work_request_filed_data.php?page=" + currentPage,
        {
          rows: rows,
          rowsort: rowsort,
          SiteCD: site_ID,
          admin: emp_owner,
        }
      );
       console.log("response____asset__",response);
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
        "/get_retrive_work_request_all_data.php?page=" + currentPage,
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
       
          RetriveDataAllData();
      }
    };

    const SaveRegTbl = () => {
      setShowSave(true);
      fetchFilterSubPopupSavedropdon();
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
        "/InsertWorkReqFilterQueryListData.php",
        combinedData
      );
   console.log("response___",response);
      if (response.data.status == "SUCCESS") {
        setTitleAstReg(response.data.Title);
        fetchFilterSubPopupSavedropdon();
        RetriveData();
        handleDeleteRowPopup();
        handleDeleteRowShort();
        Swal.close();
        handleCloseSave();
        FilterhandleClose();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Filter Save button funcation click to
    const handleCFQrySave = () => {
     
      if (formDataSv.queryName.trim() !== "") {
        const inputValue = formDataSv.queryName;
        const matchingOption = workReqFilterDpd.find(
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
  // Query button click to funcatio start
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
    const handleCloseWorkQryList = () => {
      setShowWordOrderQryList(false);
      FilterhandleClose();
      handleCloseSave();
      setselectedOptionValue("");
      setRowsQrt([]);
      setRowsortQrt([]);
    };
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
          "/get_retrive_popup_work_request_filed_data.php?page=" + currentPage,
          {
            rows: rowsQrt,
            rowsort: rowsortQrt,
            SiteCD:site_ID,
            admin:emp_owner
          }
        );
      // console.log("response____fliter___",response);
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
                "/WorkReqQueryListDataDelete.php?value=" +
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
          defaultFlag:isChecked,
          rowsortQrtData: rowsortQrt,
        };
        try {
          const response = await httpCommon.post(
            "/insert_work_req_query_listsave_data.php",
            combinedData
          );
          if (response.data.status == "SUCCESS") {
            setselectDropRowID(response.data.ROW_ID);
            Swal.close();
            Swal.fire({
              title: "Success!",
              text: "Your Query Update Successfully.",
              icon: "success",
              confirmButtonText: "OK",
              customClass: {
                container: "swalcontainercustom",
              },
            }).then((result) => {
              if (result.isConfirmed) {
                setIsChecked(false);
                RetriveDataQueryList();
                setRowsQrt([]);
                setselectedOptionValue("");
                setRowsortQrt([]);
                setRowsort([]);
                setRows([]);
               
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
        const matchingOption = workReqFilterDpd.find(
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
    if(RowID !== "" && cf_query_title !==""){
      setQueryTitleRowID(RowID);
   // setIsChecked(true);
    const initialCheckedState = workReqFilterDpd.some(
      item => item.RowID === RowID && item.cf_query_title === cf_query_title && item.cf_query_default_flag === "1"
    );
  
    setIsChecked(initialCheckedState);

  }else{
    setIsChecked(false);
  }

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
 
const handelQuryListpopup = () => {
  fetchFilterSubPopupSavedropdon();
  handleShowWorkOrderQryList();
};

const handleCheckboxClick = () => {
  setIsChecked(!isChecked);
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
  const handleDeleteRowQrt = (index) => {
    if (rowsQrt.length > 1) {
      const newRows = [...rowsQrt];
      newRows.splice(index, 1);
      setRowsQrt(newRows);
    }
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
  const handleDeleteRowShortQrt = (index) => {
    if (rowsortQrt.length > 1) {
      const newRows = [...rowsortQrt];
      newRows.splice(index, 1);
      setRowsortQrt(newRows);
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
        "/insert_work_req_query_list_save_as_data.php",
        combinedData
      );
//console.log("response___id___",response);
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
 
// Search Button Click funcation
const handelSearchButton = async () => {
  const inputValueGet = inputRef.current.value;
  //console.log("inputValueGet_____",inputValueGet);
  
  if (inputValueGet !== "" && inputValueGet !== null) {
    Swal.fire({ title: "Please Wait!", allowOutsideClick: false });
    Swal.showLoading();
   // console.log("call_again___");
    try {
      const response = await httpCommon.get(
        `/get_SearchWorkReqModule.php?site_cd=${site_ID}&searchTerm=${inputValueGet}&page=${currentPage}`
      );
       // console.log("responseSerach_____",response);
      if (response.data.data.result.length > 0) {
        setTableSearchData(response.data.data.result);
        setTotalRow(response.data.total_count);

        const filteredData = response.data.data.result.filter((item) => {
          const searchString = inputValueGet.toLowerCase();
          const wkr_mst_wr_no = (item.wkr_mst_wr_no || "").toLowerCase();
          const wkr_mst_wr_descs = (item.wkr_mst_wr_descs || "").toLowerCase();
          const wkr_mst_wr_status = (item.wkr_mst_wr_status || "").toLowerCase();
          const wkr_mst_assetno = (item.wkr_mst_assetno || "").toLowerCase();
          const wkr_mst_chg_costcenter = (item.wkr_mst_chg_costcenter || "").toLowerCase();
          const wkr_mst_work_area = (item.wkr_mst_work_area || "").toLowerCase();
          const wkr_mst_assetlocn = (item.wkr_mst_assetlocn || "").toLowerCase();
          const wkr_mst_location = (item.wkr_mst_location || "").toLowerCase();
          const wkr_mst_wo_status = (item.wkr_mst_wo_status || "").toLowerCase();
          const wkr_mst_phone = (item.wkr_mst_phone || "").toLowerCase();
          const wkr_det_reject_desc = (item.wkr_det_reject_desc || "").toLowerCase();
          const wkr_mst_fault_code = (item.wkr_mst_fault_code || "").toLowerCase();
          const wkr_mst_create_by = (item.wkr_mst_create_by || "").toLowerCase();
          
          return (
            wkr_mst_wr_no.includes(searchString) ||
            wkr_mst_wr_descs.includes(searchString) ||
            wkr_mst_wr_status.includes(searchString) ||
            wkr_mst_assetno.includes(searchString) ||
            wkr_mst_chg_costcenter.includes(searchString) ||
            wkr_mst_work_area.includes(searchString) ||
            wkr_mst_assetlocn.includes(searchString) ||
            wkr_mst_location.includes(searchString) ||
            wkr_mst_wo_status.includes(searchString) ||
            wkr_mst_phone.includes(searchString) ||
            wkr_det_reject_desc.includes(searchString) ||
            wkr_mst_fault_code.includes(searchString) ||
            wkr_mst_create_by.includes(searchString)
          );
        });
        setTableData(filteredData);
        setTableData(filteredData);
     //   setCurrentPage(1);
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
        `/getWorkReqListExcelData.php?site_cd=${site_ID}&ItemID=${ExportExcelId}`
      );
      Swal.close();
      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        ExportWorkReqlistToExcel({ resultData: response.data.data.result });
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
        `/getWorkReqListAllDataExcelSheet.php?site_cd=${site_ID}`
      );
      
      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        ExportWorkReqlistToExcel({ resultData: response.data.data.result });
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

// Approv and DisApprove funcation
const handleShowApprove = (id,row) => {
  
  if (row.wkr_mst_wr_status === 'A' ) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: `The Work Request No ${row.wkr_mst_wr_no} Already Approve.`,
    });
    return; 
  }else if(row.wkr_mst_wr_status === 'D'){
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: `The Work Request No ${row.wkr_mst_wr_no} Already Disapprove.`,
    });
    return; 
  }else{
    setRowId(row.RowID);
    setShowApprove(true);
  }
};

const onClickApprove = () => {
  if(selected_Status == 0 || selected_Status == null){
    setErrorMessage('Please select a status.');
  
  }else{
      
    if(selected_Originator == 0 || selected_Originator == null){
      setErrorMessage('Please Select the Originator.');

          }else{

            if(selected_WorkGroup == 0 || selected_WorkGroup == null){
              setErrorMessage('Please Select the Work Group.');
              
              }else{

                if(Button_save ==  "Approve"){
                  
                 handleCloseApprove();
                WorkRequest_Approval();
  
                }
                
            }
        }
      }
  }

//Approval
const WorkRequest_Approval = async() => {
  let site_ID = localStorage.getItem("site_ID");
  let EmpID = localStorage.getItem("emp_mst_empl_id");
  let EmpName = localStorage.getItem("emp_mst_name");
  let LOGINID = localStorage.getItem("emp_mst_login_id");
    let Status, setStatus;
    if(selected_Status == '' || selected_Status == null){
        setStatus=''
    }else{
        Status = selected_Status.split(":")
        setStatus = Status[0];
    }
    
    //Select Assign To
    let Originator, setOriginator;
    if(selected_Originator == '' || selected_Originator == null){

        setOriginator=''
    }else{

        Originator = selected_Originator.label.split(":")
        setOriginator = Originator[0];
        console.log("Originator ", Originator[0])
    }

    //Select Work Group
    let WorkGroup, setWorkGroup;
    if(selected_WorkGroup == '' || selected_WorkGroup == null){

        setWorkGroup=''
    }else{

        WorkGroup = selected_WorkGroup.label.split(":")
        setWorkGroup = WorkGroup[0];
        console.log("WorkGroup ", WorkGroup[0])
    }
  var json_workrequest ={

    "site_cd": site_ID,
    "wko_mst_status": setStatus.trim(),
    "wkr_mst_originator": setOriginator.trim(),
    "wkr_mst_work_group":setWorkGroup.trim(),

    "RowID": rowId,
    "EmpID": EmpID,
    "EmpName": EmpName,
    "LOGINID": LOGINID,

  }
  
  Swal.fire({  title: 'Please Wait !', allowOutsideClick: false})
  Swal.showLoading()
  try {
   
    const responseJson = await httpCommon.post(
      "/insert_work_request_approval.php",
      JSON.stringify(json_workrequest)
    );
    
    if (responseJson.data.status === 'SUCCESS') { 
      Swal.close();
      fetchData();
        Swal.fire({
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
          title: responseJson.data.status,
          text: responseJson.data.message,
        }).then(() => {
          navigate(`/dashboard/work/list`);
        });

  }else{
      Swal.close();
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: responseJson.data,
          
        })
  }
  } catch (error) {
    Swal.close();
    console.error("Error fetching data:", error);
    Swal.fire({
            icon: 'error',
            title: 'Oops get_WorkRequest_select...',
            text: error,          
          })
  }

  }

  // DisApprov funcation
  const handleShowDisapprove = (row) => {

    if (row.wkr_mst_wr_status === 'D') {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: `The Work Request No ${row.wkr_mst_wr_no} Already Disapprove.`,
      });
      return; 
    }else if(row.wkr_mst_wr_status === "A"){
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: `The Work Request No ${row.wkr_mst_wr_no} Already Approve.`,
      });
      return;
    }
    setRowId(row.RowID);
    setShowDisapprove(true)

  };
  const onClickDisapprove = () => {
    if(RejectedDescription == ''){
      setErrorMessage('Please Enter the Rejected Description.');
        }else{
  
            handleCloseDisapprove();
            WorkRequest_Disapproval();
            console.log("Disapprove button clicked here!");
              
        }
    }

//Disapproval
  const WorkRequest_Disapproval = async() => {

    let site_ID = localStorage.getItem("site_ID");
  
    let EmpID = localStorage.getItem("emp_mst_empl_id");
  
    let EmpName = localStorage.getItem("emp_mst_name");
    let LOGINID = localStorage.getItem("emp_mst_login_id");
    
    //Select Reject Date
    let date_of_reject = ''
    if (RejectDate == '' || RejectDate == null) {
  
      date_of_reject = '';
    } else {
  
      date_of_reject = Moment(RejectDate).format('yyyy-MM-DD HH:mm:ss').trim();
    }
  
  var json_workrequest ={
  
      "site_cd": site_ID,
      "wkr_det_reject_by": LOGINID,
      "wkr_det_reject_desc": RejectedDescription.trim(),
      "wkr_det_reject_date": date_of_reject,
  
      "RowID": rowId,
      "EmpID": EmpID,
      "EmpName": EmpName,
      "LOGINID": LOGINID,
      
  }
  //console.log("json_workrequest_____disapprove",json_workrequest);

  Swal.fire({  title: 'Please Wait !', allowOutsideClick: false})
  Swal.showLoading()
  try {
   
    const responseJson = await httpCommon.post(
      "/insert_work_request_disapproval.php",
      JSON.stringify(json_workrequest)
    );
    if (responseJson.data.status === 'SUCCESS') { 
        
      Swal.close();
      fetchData();
        Swal.fire({
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
          title: responseJson.data.status,
          text: responseJson.data.message,
        }).then(() => {
          navigate(`/dashboard/work/list`);
        });

  }else{
      Swal.close();
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: responseJson.data,
          
        })

  }
  } catch (error) {
    Swal.close();
    console.error("Error fetching data:", error);
    Swal.fire({
            icon: 'error',
            title: 'Oops get_WorkRequest_select...',
            text: error,          
          })
  }

  
}

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
      "/get_work_request_dropdown_prompt_data.php?page=" + currentPage,
      {
        rows: rowsDropdownPrompt,
        rowsort: "",
        SiteCD:site_ID,
        admin:emp_owner,
        RowId:hasRowIdValuept
      }
    );
    console.log("response____output22",response);
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
      rowsortQrtData:"",
      siteCd: site_ID,
      mst_RowID:  hasRowIdValuept,
      owner: emp_owner,
    };
    try {
      const response = await httpCommon.post(
        "/insert_work_req_query_list_prompt_save_data.php",
        combinedData

      );
        
      if (response.data.status == "SUCCESS") {

        Swal.close();
        setselectDropRowID(tempRowID);
        fetchDataResponse(hasRowIdValuept);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

};

const TABLE_HEAD = Headerdata && Headerdata.map((item, index) => {
  const width = [165, 220, 160, 120, 180, 120,145,100,160,170,120,125,125,125,125,100,180,155,135,145,190,145,150,160,160,140,140,140,140][index]; 
  return {
    id: item.accessor,
    label: item.Header,
    width
  };
});

if (TABLE_HEAD) {
  TABLE_HEAD.unshift({ id: '', label: 'Action', width: 60 });
  TABLE_HEAD.push({ id: 'create_date', label: 'Create Date', width: 140 });
}

useEffect(() => {
    
  if (selectDropRowID != "" && selectDropRowID != null) {
    getb();
  }else if(TableSearchData !="" && TableSearchData != null){
    handelSearchButton();
  }else if(Array.isArray(DashbordDataGauge) && DashbordDataGauge.length > 0){
    fetchDataGaugeDSB();

  }else {
    fetchData();
  }
  fetchFilterSubPopupSavedropdon();
  get_dropdown();
}, [site_ID, currentPage, selectDropRowID,fetchData,getb,fetchDataGaugeDSB]);

  return (
    <>
       <Helmet>
        <title>CMMS System</title>
        <meta name="description" content="Work Request List" />
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <div className="CustomBreadAsset">
          <CustomBreadcrumbs
             heading="Work Request List"
            links={[]}
            action={
              <Button
                component={RouterLink}
                // href={paths.dashboard.product.new}
                variant="contained"
                className='AddNewButton'
                startIcon={<Iconify icon="mingcute:add-line" />}
               
                to={{
                  pathname: '/dashboard/work/newRequest',
                  state: { select: 'New_WorkRequest' }
                }}
              >
               New
              </Button>

            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        </div>
        <div className="workReqpage">
          <Card>
            
            <Stack
              spacing={2}
              alignItems={{ xs: 'flex-end', md: 'center' }}
              direction={{
                xs: 'column',
                md: 'row',
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
                <Icon icon="fluent:filter-12-filled" style={{ marginRight: '5px' }} /> Filter
              </Button>
              <FormControl
                sx={{
                  flexShrink: 0,
                  width: { xs: 1, md: 300 },
                }}
                className="selectOptioncls"
              >
                <InputLabel id="select-label" className={(TitleAstReg!== "" || selectedOption)? "selectedcss" : ""}>Select an Query</InputLabel>
                <Select
                  labelId="select-label"
                  id="select"
                  input={<OutlinedInput label="Select an option" />}
                  value={TitleAstReg !== "" ? TitleAstReg : selectedOption}
                  onChange={handleOptionChange}
                  sx={{ textTransform: 'capitalize' }}
                >
                
                  {workReqFilterDpd.map((item) => (
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
              <Tooltip title="Refresh" placement="top" arrow >
                  <span
                    className="ListDataRefBtn"
                    onClick={fetchDataUsingRefreshBtn}
                    style={{ border: '0px' }}
                  >
                    <Icon icon="icon-park:refresh-one" style={{ width:'23px', height:'23px' }} /> 
                  </span>
                </Tooltip>
              <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                  <div
                    className="wordkOrdersearchInput"
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
              <WorkReqTableFiltersResult
                filters={filters}
                onFilters={handleFilters}
                //
                onResetFilters={handleResetFilters}
                //
                results={dataFiltered.length}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}

            <TableContainer sx={{ position: 'relative'}}>
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
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData?.length || 0}
                    numSelected={table.selected?.length || 0}
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
                        
                            {tableData?.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={numberOfColumns} className="NoRecodcls" >
                                  No Record Found
                                </TableCell>
                              </TableRow>
                            ) : (
                              <>
                        
                                {dataFiltered.map((row) => (

                                  <WorkReqTableRow
                                  
                                    key={row.id}
                                    row={row}
                                    rowStats={ResponceStats}
                                    selected={table.selected.includes(row.col1)}
                                    onSelectRow={() => table.onSelectRow(row.col1)}
                                    onDeleteRow={() => handleDeleteRow(row.col1,row)}
                                    onEditRow={() => handleEditRow(row.col1,row)}
                                    onDisApprove={() => handleShowDisapprove(row)}
                                    onApprove={() => handleShowApprove(row.col1,row)}
                                  //  onViewRow={() => handleViewRow(row.id)}
                                 //   onCompleteRow={() => handleCompleteRow(row.col71)}
                                  //  onCloseRow={() => handleCloseRow(row.col71)}
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
                            tableData?.length
                          )}
                        />
                      </TableBody>

                </Table>
              </Scrollbar>
            </TableContainer>

              <TablePaginationCustom
                count={totalRow > 0 ? totalRow : dataFiltered.length}
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
        </div>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
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
                //  disabled={isButtonDisabled}
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
                  {workReqFilterDpd.map((option, index) => (
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
                        onChange={(event) =>
                          handleClickOption(event.target.value)
                        }
                        sx={{ textTransform: "capitalize" }}
                      >
                       
                        {workReqFilterDpd.map((item) => (
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
                  {workReqFilterDpd.map((option, index) => (
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

       {/******************** Approve Work Request ********************/}
       <BootstrapDialog
        onClose={handleCloseApprove}
        aria-labelledby="customized-dialog-title"
        open={showApprove}
        maxWidth="md"
        fullWidth
        className='approveModel'
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="marketeq:file-folder-approved-2" />
          <span style={{ marginLeft: "2px" }}>Approve Work Request</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseApprove}
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
          

          <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                  <FormControlLabel
                      control={<div />} // Empty control to avoid rendering checkbox or radio button
                      label="Status:"
                  />
              </Grid>
              <Grid item xs={8}>
              {Status.map((status) => (
                    <FormControlLabel
                        key={status.value}
                        value={status.value}
                        control={<Radio />}
                        label={status.label}
                        checked={selected_Status === status.value}
                        onChange={(e) => {
                          setSelected_Status(e.target.value);
                          setErrorMessage('');
                      }}
                    />
                ))}
              </Grid>
          </Grid>


           <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                  <FormControlLabel
                      control={<div />} // Empty control to avoid rendering checkbox or radio button
                      label="Assign to:"
                  />
              </Grid>
              <Grid item xs={8}>
                  <Autocomplete
                      options={Originator}
                      defaultValue={selected_Originator}
                      onChange={(event, value) => {
                          setSelected_Originator(value);
                          setErrorMessage('');
                      }}
                      renderInput={(params) => (
                          <TextField
                              {...params}
                              size="small"
                              placeholder="Select..."
                              variant="outlined"
                              fullWidth // Ensure the TextField takes up full width
                          />
                      )}
                  />
              </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                  <FormControlLabel
                      control={<div />} // Empty control to avoid rendering checkbox or radio button
                      label="Work Group:"
                  />
              </Grid>
              <Grid item xs={8}>
                  <Autocomplete
                      options={WorkGroup}
                      defaultValue={selected_WorkGroup} 
                      onChange={(event, value) => {
                        setSelected_WorkGroup(value);
                        setErrorMessage('');
                      }}
                      renderInput={(params) => (
                          <TextField
                              {...params}
                              size="small"
                              placeholder="Select..."
                              variant="outlined"
                              fullWidth // Ensure the TextField takes up full width
                          />
                      )}
                  />
              </Grid>
          </Grid>
              
        </div>
        </DialogContent>
        <DialogActions>
          {/* <Grid item>
            <Button variant="outlined" onClick={onClickApprove}>
          
              <Iconify icon="mingcute:save-line" /> Approve
            </Button>
          </Grid> */}
          <Grid container spacing={2} alignItems="center">
          {errorMessage && (
            <Grid item>
              <div style={{ color: 'red', marginRight: '10px' }}>{errorMessage}</div>
            </Grid>
          )}
          <Grid item>
            <Button variant="outlined" className="SaveButton" style={{ color: '#fff' }} onClick={onClickApprove}>
              <Iconify icon="mingcute:save-line" /> Approve
            </Button>
          </Grid>
         
        </Grid>
        </DialogActions>
      </BootstrapDialog>
       {/******************** Disapprove Work Request ********************/}
       <BootstrapDialog
        onClose={handleCloseDisapprove}
        aria-labelledby="customized-dialog-title"
        open={showDisapprove}
        maxWidth="md"
        fullWidth
        className='approveModel'
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="material-symbols-light:file-save-sharp" />
          <span style={{ marginLeft: "2px" }}>Disapprove Work Request</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDisapprove}
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
          

          <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                  <FormControlLabel
                      control={<div />} // Empty control to avoid rendering checkbox or radio button
                      label="Reject By:"
                  />
              </Grid>
              <Grid item xs={8}>
              <TextField
                  id="outlined-basic"
                  size="small"
                  variant="outlined"
                  className="Extrasize"
                  fullWidth
                  defaultValue={AuditUser}
                  disabled
                  />
              </Grid>
          </Grid>


           <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                  <FormControlLabel
                      control={<div />} // Empty control to avoid rendering checkbox or radio button
                      label="Reject Date:"
                  />
              </Grid>
              <Grid item xs={8}>
                  <DateTimePicker
                    value={RejectDate}
                    format="dd/MM/yyyy HH:mm"
                    className="Extrasize"
                    onChange={(newDate) => {
                      setRejectDate(newDate); // Update your state with the new value
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
              </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                  <FormControlLabel
                      control={<div />} // Empty control to avoid rendering checkbox or radio button
                      label="Rejected Description:"
                  />
              </Grid>
              <Grid item xs={8}>
                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder=""
                  style={{ width: "100%" }}
                  minRows={6.5}
                  defaultValue={RejectedDescription}
                  onChange={(e) => {
                    setRejectedDescription(e.target.value);
                  }}
                  
                />
              </Grid>
          </Grid>
              
        </div>
        </DialogContent>
        <DialogActions>
          {/* <Grid item>
            <Button variant="outlined" onClick={onClickApprove}>
          
              <Iconify icon="mingcute:save-line" /> Approve
            </Button>
          </Grid> */}
          <Grid container spacing={2} alignItems="center">
          {errorMessage && (
            <Grid item>
              <div style={{ color: 'red', marginRight: '10px' }}>{errorMessage}</div>
            </Grid>
          )}
          <Grid item>
            <Button variant="outlined" onClick={onClickDisapprove}>
              <Iconify icon="mingcute:save-line" /> Disapprove
            </Button>
          </Grid>
         
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
                          style={{ width: "100%", textAlign: 'center' }}
                          disabled
                          value={row.Column || ""}
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
                          style={{ width: "100%", textAlign: 'center' }}
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
                          style={{ width: "100%", textAlign: 'center' }}
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
                          style={{ width: "100%", textAlign: 'center' }}
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

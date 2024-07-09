// @mui
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import { Link, useNavigate } from "react-router-dom";
// hooks
import { useMockedUser } from "src/hooks/use-mocked-user";
// _mock
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from "src/_mock";
// components
import { useSettingsContext } from "src/components/settings";
// assets
//import { SeoIllustration } from "src/assets/illustrations";
//
import AppWidget from "../app-widget";
// import AppWelcome from "../app-welcome";
// import AppFeatured from "../app-featured";
//import AppNewInvoice from "../app-new-invoice";
//import AppTopAuthors from "../app-top-authors";
//import AppTopRelated from "../app-top-related";
//import AppAreaInstalled from "../app-area-installed";
import AppWidgetSummary from "../app-widget-summary";
//import AppCurrentDownload from "../app-current-download";
//import AppTopInstalledCountries from "../app-top-installed-countries";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
//import WorkOrderList from "src/sections/maintenance/WorkOrderList";
import Iconify from "src/components/iconify";
// ----------------------------------------------------------------------

export default function OverviewAppView() {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_loginID = localStorage.getItem("emp_mst_empl_id");

  const navigate = useNavigate();
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [GetAllDashbordData, setDashbordData] = useState([]);
  const [GetAllDashbordDataFltrBy, setDashbordDataFltrBy] = useState([]);
  const [GetAllDashbordDataSortBy, setDashbordDataSortBy] = useState([]);
  const [GetDashbordDataPrmMst, setDashbordDataPrmMst] = useState([]);
  const [GetPRM_MST, setGetPRM_MST] = useState([]);
  const [DashbordTotalNumber, setDashbordTotalNumber] = useState([]);
  const [EditFlagStatus, setEditFlagStatus] = useState(0);


  const [count, setCount] = useState(0);

  const fetchDashBordDataRefresh = async () => {
   
    try {
      const response = await httpCommon.get(
        "/getGaugeDashbordData.php?site_cd=" +
          site_ID +
          "&admin=" +
          emp_mst_loginID
      );
    //  console.log("response____",response);
      if (response.data.status === "SUCCESS") {
        setDashbordData(response.data.data);
        setGetPRM_MST(response.data.PRM_MST);
        setDashbordTotalNumber(response.data.DashbrdCount);
        setDashbordDataFltrBy(response.data.RowDataFltBy);
        setDashbordDataSortBy(response.data.RowDataSortBy);
        setDashbordDataPrmMst(response.data.RowDataSortPrm_mst);
        // Swal.close();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDashBordRefshTime = async () => {
    try {
      const response = await httpCommon.get(
        "/get_dashboardRefshTime.php?site_cd=" + site_ID
      );
      // console.log("response____dash", response);
      if (response.data.status === "SUCCESS") {
        const refreshTimeInMillis = response.data.data[0].RefshTime * 60000;
        return refreshTimeInMillis;
      
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDashBordEditFlagStatus = async () => {
    try {
      const response = await httpCommon.get( 
        "/get_dashboard_edit_flag_status.php?site_cd=" + site_ID
      );
     // console.log("response____refreshEditFlag", response);
      if (response.data.status === "SUCCESS") {
        const refreshEditFlag = response.data.data[0].EditFlag;
        setEditFlagStatus(refreshEditFlag);
      
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const refreshTimeInMillis = await fetchDashBordRefshTime(); // Wait for the refresh time to be fetched
   
      await fetchDashBordData(); // Fetch data after refresh time is fetched
      const refreshTime = refreshTimeInMillis || 5000;
     // console.log("refreshTime____",refreshTime);
      const interval = setInterval(() => {
        setCount((prevCount) => prevCount + 1); 
        fetchDashBordDataRefresh(); 
      }, refreshTime);
      
      return () => clearInterval(interval);
    };
    fetchDashBordEditFlagStatus();
    fetchData(); // Start fetching data
  }, []);
  
  
 // console.log("Page refresh Count:", count);
  // Get Dashbord Data Api
  const fetchDashBordData = async () => {
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
        "/getGaugeDashbordData.php?site_cd=" +
          site_ID +
          "&admin=" +
          emp_mst_loginID
      );
      //  console.log("response____dash__",response);
      if (response.data.status === "SUCCESS") {
        setDashbordData(response.data.data);
        setGetPRM_MST(response.data.PRM_MST);
        setDashbordTotalNumber(response.data.DashbrdCount);
        setDashbordDataFltrBy(response.data.RowDataFltBy);
        setDashbordDataSortBy(response.data.RowDataSortBy);
        setDashbordDataPrmMst(response.data.RowDataSortPrm_mst);
        Swal.close();
      }else{
        Swal.close();
      }
    } catch (error) {
      
      console.error("Error fetching data:", error);
    }
  };

  const handleOnClickDB = async (cfQueryRowID) => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    const cfRowID = cfQueryRowID;

    let newArrayFltr = null;
    let newArraySort = null;
    let newArrayPrm = null;

    Object.keys(GetAllDashbordDataFltrBy).map((key) => {
      if (cfRowID === key) {
        newArrayFltr = GetAllDashbordDataFltrBy[key];
      }
      return null;
    });

    Object.keys(GetAllDashbordDataSortBy).map((key) => {
      if (cfRowID === key) {
        newArraySort = GetAllDashbordDataSortBy[key];
      }
      return null;
    });
    Object.keys(GetDashbordDataPrmMst).map((key) => {
      if (cfRowID === key) {
        newArrayPrm = GetDashbordDataPrmMst[key];
      }
      return null;
    });

    Swal.showLoading();
    //console.log("newArrayFltr____",newArrayFltr);
    if (newArrayFltr && newArrayFltr.length > 0) {

      const firstItem = newArrayFltr[0];
      //console.log("firstItem____",firstItem);
    
      if(firstItem.cf_query_list_table === "ast_mst" || firstItem.cf_query_list_table === "ast_det"){
        navigate(`/dashboard/asset/list`, {
          state: {
            GaugeDashbordData: newArrayFltr,
            GaugeDashbordDataSort: newArraySort,
            DropListId: cfRowID,
          },
        });
        Swal.close();
      }else if(firstItem.cf_query_list_table === "wko_mst" || firstItem.cf_query_list_table === "wko_det"){
        navigate(`/dashboard/work/order`, {
          state: {
            GaugeDashbordData: newArrayFltr,
            GaugeDashbordDataSort: newArraySort,
            DropListId: cfRowID,
          },
        });
        Swal.close();
      }else if(firstItem.cf_query_list_table === "wkr_mst" || firstItem.cf_query_list_table === "wkr_det"){
        navigate(`/dashboard/work/list`, {
          state: {
            GaugeDashbordData: newArrayFltr,
            GaugeDashbordDataSort: newArraySort,
            DropListId: cfRowID,
          },
        });
        Swal.close();
      }else if(firstItem.cf_query_list_table === "itm_mst" || firstItem.cf_query_list_table === "itm_det"){
        navigate(`/dashboard/InventoryMaster/list`, {
          state: {
            GaugeDashbordData: newArrayFltr,
            GaugeDashbordDataSort: newArraySort,
            DropListId: cfRowID,
          },
        });
        Swal.close();
      }else if(firstItem.cf_query_list_table === "prm_mst" || firstItem.cf_query_list_table === "prm_det"){
        
        Swal.close();
        Swal.fire({
          icon:"warning",
          title: "Opps !",
          html: '<b>This Module Is Not Ready To View!</b>',
          allowOutsideClick: false,
          customClass: {
            container: "swalcontainercustom",
          },
        });
      
      }
      
    } else if (newArrayPrm && newArrayPrm.length > 0) {
      navigate(`/dashboard/work/order`, {
        state: {
          GaugeDashbordData: newArrayFltr,
          GaugeDashbordDataSort: newArraySort,
          GetDashbordDataPrmMst: newArrayPrm,
          DropListId: cfRowID,
        },
      });
    }
  };
  const handleOnClickGetdata = () => {
    fetchDashBordData();
  };
  const sortedData = [...GetAllDashbordData].sort((a, b) => {
    return (
      parseInt(a.dsh_mst_display_order) - parseInt(b.dsh_mst_display_order)
    );
  });


 
  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Grid
        container
        justifyContent="flex-end"
        alignItems="center"
        rowSpacing={0}
      >
        <Grid item>
          <button className="RefshBtn" onClick={() => handleOnClickGetdata()}>
          {/* <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
            Last Refreshed <br />
            5:49PM
          </span> */}
            <Iconify
              icon="ic:sharp-refresh"
              width={24}
              height={24}
              style={{ fontSize: "22px", marginRight: "2px" }}
            />
          </button>
        </Grid>
      </Grid>

      <Grid
        container
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        mb={2}
      >
      
        {sortedData.map((item, index) => (
          <Grid item xs={12} md={4} key={index} className={EditFlagStatus === "1" ? "gaugeDBDisable" : EditFlagStatus === "0" ? "gaugeDB" : "gaugeDB"}>
            <AppWidgetSummary
              data={item}
              total={parseInt(DashbordTotalNumber[item.cf_query_RowID])}
              description={item.dsh_mst_desc}
             // onClick={() => handleOnClickDB(item.cf_query_RowID)}
              onClick={EditFlagStatus === "1" ? undefined : () => handleOnClickDB(item.cf_query_RowID)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

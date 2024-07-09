import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";

const WorkOrderAssetNo = ({ onRowClick, onChangePage, onSearchChange }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const startTime = window.performance.now();
  const [viewedRows, setViewedRows] = useState(0);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get("/get_AssetWorkOrderStatus.php?site_cd=" + site_ID)
      .then((response) => {
        //console.log("response__NET", response);
        const endTime = window.performance.now();
        const loadTime = endTime - startTime;
        console.log(`API load time: ${loadTime} milliseconds`);
        Swal.close();
        //setData(response.data.data.result);
        setData(response.data.data.WorkAssetNo);
        onRowClick(response.data.data.WorkAssetNo.length);
        // setTotalData(response.data.data.WorkAssetNo.length);
        const endTime2 = window.performance.now();
        const loadTime2 = endTime2 - startTime;
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //Table colums
  const columns = [
    {
      title: "Asset No",
      field: "ast_mst_asset_no",
      render: (rowData) => renderIcon(rowData),
    },
    { title: "Short Description", field: "ast_mst_asset_shortdesc" },
    { title: "Asset Status", field: "ast_mst_asset_status" },
    { title: "Asset Location", field: "ast_mst_work_area" },
  ];

  const renderIcon = (rowData) => {
    if (rowData.ast_mst_asset_no === selectedRowKeys) {
      return (
        <div>
          <Iconify
            icon="mingcute:save-fill"
            style={{
              marginRight: "0px",
              marginTop: "2px",
              float: "left",
              fontSize: "16px",
              color: "#289e49",
            }}
          />
          {rowData.ast_mst_asset_no}
        </div>
      );
    }
    return <div>{rowData.ast_mst_asset_no}</div>;
  };
  const handleRowClick = (event, rowData) => {
    if (selectedRowKeys && selectedRowKeys === rowData.ast_mst_asset_no) {
      onRowClick(data.length, rowData.ast_mst_asset_no+' : '+rowData.ast_mst_asset_shortdesc, 1);
    }
    setSelectedRowKeys(rowData.ast_mst_asset_no);
    onRowClick(data.length, rowData.ast_mst_asset_no+' : '+rowData.ast_mst_asset_shortdesc);
  };
  const handlePageChange = (page) => {
    const pageSize = 10; // Assuming each page displays 10 rows
    const viewedRowsCount = page * pageSize;
    setViewedRows(viewedRowsCount);
    onChangePage(viewedRowsCount);
  };

  const handleSearch = (searchText) => {
    // Filter the data based on the search text
    const filteredData = data.filter(
      (item) =>
        item.ast_mst_asset_no
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.ast_mst_asset_shortdesc
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.ast_mst_asset_status
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.ast_mst_work_area.toLowerCase().includes(searchText.toLowerCase())
    );

    // setData(filteredData);
    //setSearchedDataCount(filteredData.length);
    onSearchChange(filteredData.length);
  };

  return (
    <>
      <div>
        <div class="container Ordertbl">
          <MaterialTable
            title=""
            data={data}
            columns={columns}
            options={{
              search: true,
              paging: true,
              pageSize: 10,
              pageSizeOptions: false,
              overflowY: "auto",
              paginationPosition: "top",
              toolbarButtonAlignment: "right",
              paginationType: "normal",
              rowStyle: (rowData) => ({
                backgroundColor:
                  rowData.ast_mst_asset_no === selectedRowKeys
                    ? "#a9ebb9"
                    : "#FFF",
                fontSize: "12px !important",
              }),
            }}
            onRowClick={handleRowClick}
            onChangePage={handlePageChange}
            onSearchChange={(searchText) => handleSearch(searchText)}
          />
        </div>
      </div>
    </>
  );
};

export default WorkOrderAssetNo;

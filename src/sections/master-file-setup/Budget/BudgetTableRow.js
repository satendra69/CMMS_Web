import PropTypes from "prop-types";
import { useState, useEffect, useCallback, useRef } from "react";
// @mui

import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";

import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
// utils

// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components

import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import httpCommon from "src/http-common";
import { Checkbox, TableSortLabel } from "@mui/material";

import UserGroupADDDialog from "./BudgetADDDialog";
import { set } from "lodash";
import Swal from "sweetalert2";

import BudgetDialog from "./BudgetDialog";

// ----------------------------------------------------------------------

export default function BudgetTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onDuplicateRow,
  onPrintQrCode,
  groupLabel,
  setRefetch,
}) {
  const {
    costcenter,
    budget_year,
    account,
    per1,
    per2,
    per3,
    per4,
    per5,
    per6,
    per7,
    per8,
    per9,
    per10,
    per11,
    per12,
    approve_by,
    approve_date,
  } = row;
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const site_ID = localStorage.getItem("site_ID");
  const [dialog, setDialog] = useState(false);
  const confirm = useBoolean();

  const popover = usePopover();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, so add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  const [UserPermission, setUserPermission] = useState([]);
  const [dialogNew, setDialogNew] = useState(false);

  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  // get User Permission
  const getUserPermission = async () => {
    try {
      const response = await httpCommon.get(
        `/getAssetUserPermission.php?login_id=${AuditUser}`
      );
      if (response.data.status == "SUCCESS") {
        setUserPermission(response.data.data.UserPermission);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getUserPermission();
  }, []);

  const handleClick = (e, result) => {
    if (result !== "backdropClick") {
      setDialog(!dialog);
    }
  };
  const handleClickNew = (e, result) => {
    if (result !== "backdropClick") {
      setDialogNew(!dialogNew);
    }
  };

  const handleDelete = async () => {
    popover.onClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await httpCommon.post(
            "/delete_new_master_cost_center.php",
            {
              site_cd: site_ID,
              row_id: row.RowID,
            }
          );

          if (response.data.status === "SUCCESS") {
            Swal.fire({
              title: "Sucess",
              text: "Record Deleted Successfully ",
              icon: "success",
              timer: 2000,
            }).then(() => setRefetch(true));
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    });
  };

  return (
    <>
      {dialog && (
        <BudgetDialog
          open={dialog}
          handleClose={handleClick}
          rowData={row}
          setRefetch={setRefetch}
          groupLabel={groupLabel}
        />
      )}

      <TableRow hover selected={selected}>
        <TableCell align="right">
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell sx={{ height: "40px" }}>{budget_year}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{costcenter}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{account}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per1}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per2}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per3}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per4}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per5}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per6}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per7}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per8}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per9}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per10}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per11}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{per12}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{approve_by}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{approve_date}</TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            setDialog(!dialog);
            popover.onClose();
          }}
          disabled={!UserPermission.every((item) => item.edit_flag === "1")}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDelete();
          }}
          sx={{ color: "error.main" }}
          disabled={!UserPermission.every((item) => item.edit_flag === "1")}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}

BudgetTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDuplicateRow: PropTypes.func,
  onPrintQrCode: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  setRefetch: PropTypes.func,
};

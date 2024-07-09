import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";

import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// utils
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

export default function WorkReqTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onApprove,
  onDisApprove,
}) {
 
  const {
    wkr_mst_wr_no,
    wkr_mst_wr_descs,
    wkr_mst_wr_status,
    wkr_mst_assetno,
    wkr_mst_chg_costcenter,
    wkr_mst_work_area,
    wkr_mst_assetlocn,
    wkr_mst_location,
    wkr_mst_temp_asset,
    wkr_mst_email_notification,
    wkr_mst_work_type,
    wkr_mst_work_class,
    wkr_mst_work_group,
    wkr_mst_wo_status,
    wkr_mst_projectid,
    wkr_mst_originator,
    wkr_mst_phone,
    wkr_det_wo,
    wkr_det_approver,
    wkr_appr_date,
    wkr_det_reject_desc,
    wkr_det_reject_by,
    wkr_reject_date,
    wkr_mst_orig_priority,
    wkr_mst_org_date,
    wkr_mst_due_date,
    wkr_mst_fault_code,
    wkr_mst_create_by,
    wkr_mst_create_date,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();
  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // Return empty string if dateString is undefined or null
    }
  
    // Check if dateString starts with "1900-01-01"
    if (dateString.startsWith("1900-01-01")) {
      return ""; // Return empty string if dateString matches the condition
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, so add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const maxCharactersToShow = 30;
  const truncatedDescription =
  wkr_mst_wr_descs && wkr_mst_wr_descs.length > maxCharactersToShow
      ? `${wkr_mst_wr_descs.substring(0, maxCharactersToShow)}...`
      : wkr_mst_wr_descs;
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="right">
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        <TableCell>{wkr_mst_wr_no}</TableCell>
        <TableCell>
        <Tooltip title={wkr_mst_wr_descs} placement="top" arrow >
              <span>{truncatedDescription}</span>
            </Tooltip>
        </TableCell>

        <TableCell>
          {(() => {
            if (wkr_mst_wr_status === "A") {
              return (
                <div>
                  <span
                    style={{
                      backgroundColor: "rgb(0 167 111)",
                      color: "white",
                      padding: "2px 7px 6px 7px",
                      borderRadius: "5px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    Approve ({wkr_mst_wr_status})
                  </span>
                </div>
              );
            }
            if (wkr_mst_wr_status === "D") {
              return (
                <div>
                  <span
                    style={{
                      backgroundColor: "#FF6258",
                      color: "white",
                      padding: "2px 7px 6px 7px",
                      borderRadius: "5px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    Disapprove ({wkr_mst_wr_status})
                  </span>
                </div>
              );
            }
            if (wkr_mst_wr_status === "W") {
              return (
                <div>
                  <span
                    style={{
                      backgroundColor: "#2196F3",
                      color: "white",
                      padding: "2px 7px 6px 7px",
                      borderRadius: "5px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    Awaiting ({wkr_mst_wr_status})
                  </span>
                </div>
              );
            }
            return null; // Return null if none of the conditions match
          })()}
        </TableCell>

        <TableCell>{wkr_mst_assetno}</TableCell>
        <TableCell>{wkr_mst_chg_costcenter}</TableCell>
        <TableCell>{wkr_mst_work_area}</TableCell>
        <TableCell>{wkr_mst_assetlocn}</TableCell>
        <TableCell>{wkr_mst_location}</TableCell>
        <TableCell>
          <Checkbox
            checked={wkr_mst_temp_asset === '1'}
            
            inputProps={{ 'aria-label': 'disabled checkbox' }}
              color="primary" 
            />
        </TableCell>
        
        <TableCell> <Checkbox
            checked={wkr_mst_email_notification === '1'}
            
            inputProps={{ 'aria-label': 'disabled checkbox' }}
              color="primary" 
            />
        </TableCell>
       
        <TableCell>{wkr_mst_work_type}</TableCell>
        <TableCell>{wkr_mst_work_class}</TableCell>
        <TableCell>{wkr_mst_work_group}</TableCell>
        <TableCell>{wkr_mst_wo_status}</TableCell>
        <TableCell>{wkr_mst_projectid}</TableCell>
        <TableCell>{wkr_mst_originator}</TableCell>
        <TableCell>{wkr_mst_phone}</TableCell>
        <TableCell>{wkr_det_wo}</TableCell>
        <TableCell>{wkr_det_approver}</TableCell>
        <TableCell>
          {wkr_appr_date ? formatDate(wkr_appr_date.date) : ""}
        </TableCell>
        <TableCell>{wkr_det_reject_desc}</TableCell>
        <TableCell>{wkr_det_reject_by}</TableCell>
        <TableCell>
          {wkr_reject_date ? formatDate(wkr_reject_date) : ""}
        </TableCell>
        <TableCell>{wkr_mst_orig_priority}</TableCell>
        
        <TableCell>{formatDate(wkr_mst_org_date.date)}</TableCell>
        <TableCell>{formatDate(wkr_mst_due_date.date)}</TableCell>
        <TableCell>{wkr_mst_fault_code}</TableCell>
        <TableCell>{wkr_mst_create_by}</TableCell>
        <TableCell>{formatDate(wkr_mst_create_date.date)}</TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onApprove();
            popover.onClose();
          }}
          sx={{ color: "green" }}
        >
          <Iconify icon="material-symbols:order-approve" />
          Approve
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDisApprove();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="fluent:text-change-reject-20-filled" />
          Disapprove
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteRow();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
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
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

WorkReqTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};

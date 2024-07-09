import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RxCrossCircled } from "react-icons/rx";
import { MdAutoMode } from "react-icons/md";
import {
  Autocomplete,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { MdOutlineStarRate } from "react-icons/md";
import { MdOutlineDescription, MdOutlineGroups } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { MdFormatListNumbered } from "react-icons/md";
import { GrCaretPrevious } from "react-icons/gr";
import { TbBrandDaysCounter } from "react-icons/tb";
import { DateTimePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import moment from "moment";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { GiCrafting } from "react-icons/gi";

function CraftCodeDialog({ open, handleClose, rowData, setRetch }) {
  let site_ID = localStorage.getItem("site_ID");
  const [checkData, setCheckData] = React.useState(
    rowData && rowData.crf_mst_disable_flag
      ? Number(rowData.crf_mst_disable_flag)
      : 0
  );
  const [error, setError] = React.useState(false);
  const formatDate = (dateString) => {
    // Removing the milliseconds part if present

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, so add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const [data, setData] = React.useState({
    crf_mst_crf_cd:
      rowData && rowData.crf_mst_crf_cd ? rowData.crf_mst_crf_cd : "",
    crf_mst_desc: rowData && rowData.crf_mst_desc ? rowData.crf_mst_desc : "",

    crf_mst_crf_est_rate:
      rowData && rowData.crf_mst_crf_est_rate
        ? rowData.crf_mst_crf_est_rate
        : "",

    crf_mst_change_date:
      rowData && rowData.crf_mst_change_date
        ? new Date(rowData.crf_mst_change_date.date)
        : "",
    crf_mst_disable_flag:
      rowData && rowData.crf_mst_disable_flag
        ? rowData.crf_mst_disable_flag
        : "",
  });

  const handleChange = (e) => {
    if (e.target.name === "crf_mst_desc") setError(false);
    setData((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitForm = async () => {
    if (!data.crf_mst_desc) {
      setError(true);
      toast.error(`Please fill the required field: Description`, {
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
      });
    } else {
      try {
        const body = {
          ...data,
          site_ID: rowData.site_cd,

          RowID: rowData.RowID,
          crf_mst_disable_flag: checkData,
          crf_mst_change_date: format(
            data.crf_mst_change_date,
            "yyyy-MM-dd hh:mm"
          ),
        };

        const response = await httpCommon.post(
          `/update_master_craft_code.php`,
          body
        );

        if (response.data.status == "SUCCESS") {
          handleClose();
          Swal.fire({
            title: "Success",
            text: "Updated Successfully",
            icon: "success",
            confirmButtonText: "OK",
            timer: 2000,
          }).then(() => setRetch(true));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", alignItems: "center", gap: 3 }}
      >
        <GiCrafting size={22} />
        {"Master Craft Code"}
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Craft Code</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="crf_mst_crf_cd"
                  size="small"
                  disabled
                  value={data ? data.crf_mst_crf_cd : ""}
                  fullWidth
                  placeholder="Enter Creaft Code..."
                />
              </div>
            </Stack>
          </Grid>
          {/* desc */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{ color: error ? "red" : "black" }}
              >
                Description
              </Typography>
              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  minRows={6.5}
                  name="crf_mst_desc"
                  fullWidth
                  value={data ? data.crf_mst_desc : ""}
                  placeholder="Enter Description..."
                  onChange={handleChange}
                  className="TxtAra"
                  style={{ borderColor: "1px soild gray", width: "100%" }}
                />
              </div>
            </Stack>
          </Grid>

          {/* Estimate Rate */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Estimate Rate</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  name="crf_mst_crf_est_rate"
                  fullWidth
                  type="number"
                  value={data ? data.crf_mst_crf_est_rate : ""}
                  placeholder="Enter Estimate Rate..."
                  onChange={handleChange}
                />
              </div>
            </Stack>
          </Grid>

          {/* Estimate Rate */}
          <Grid item xs={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">Change Date</Typography>

              <DateTimePicker
                name="crf_mst_change_date"
                className="Extrasize"
                format="yyyy-MM-dd hh:mm"
                placeholder="select date"
                value={data.crf_mst_change_date}
                onChange={(newValue) => {
                  console.log("newValue", newValue);
                  setData((pre) => ({
                    ...pre,
                    crf_mst_change_date: newValue,
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} mt={-2}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => setCheckData(e.target.checked ? 1 : 0)}
                    checked={checkData ? 1 : 0}
                  />
                }
                label="Disable"
                sx={{ mt: 1 }}
                // onChange={handleCheckboxChange}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <div
          className="buttons"
          style={{
            marginLeft: "auto",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button
            // component={RouterLink}
            // onClick={onClickChangeComplete}
            variant="contained"
            startIcon={<Iconify icon="mingcute:save-fill" />}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              marginRight: "10px",
            }}
            onClick={handleSubmitForm}
          >
            Save
          </Button>
          <Button
            variant="soft"
            color="error"
            startIcon={<Iconify icon="jam:close" />}
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
}

export default CraftCodeDialog;

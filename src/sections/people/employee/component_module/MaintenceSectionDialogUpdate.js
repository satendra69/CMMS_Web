import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RxCrossCircled } from "react-icons/rx";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { MdOutlineDescription, MdOutlineGroups } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { TbAlignBoxBottomCenter } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import MasterDialogMaintence from "./MasterDialogMaintence"
import { GiStoneCrafting } from "react-icons/gi";
import { template } from "lodash";


export default function MaintenceSectionDialog({
  open,
  handleClose,
  setRefetch,
  setMaintenceResult,
  RowIDProp,
  state,
  rowData,
  MaintenceResult


}) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [textField, setTextField] = React.useState("");
  const [DefaultModal, setDefaultModal] = React.useState(false);
  const [groupLabel, setGroupLabel] = React.useState([]);
  const [buttonSub,setButtonSub]=React.useState("Add")

  const [error, setError] = React.useState("");
  const [data, setData] = React.useState({
    emp_ls1_craft:"",
    emp_ls1_supervisor_id:"",
    emp_ls1_pay_rate:"",
    emp_ls1_charge_rate:"",
    row_id:""
  
  
  });
  const [checkData, setCheckData] = React.useState({
   
  });


React.useEffect(()=>{
const filterResult=MaintenceResult.find((item)=>item.RowID == rowData.RowID)

  if(RowIDProp && state ){
    setData((pre)=>({
      ...pre,
      emp_ls1_craft:filterResult && filterResult.emp_ls1_craft ? filterResult.emp_ls1_craft:"",
      emp_ls1_supervisor_id:filterResult && filterResult.emp_ls1_supervisor_id ? filterResult.emp_ls1_supervisor_id:"",
      emp_ls1_pay_rate:filterResult && filterResult.emp_ls1_pay_rate ? filterResult.emp_ls1_pay_rate:"",
      emp_ls1_charge_rate:filterResult && filterResult.emp_ls1_charge_rate ? filterResult.emp_ls1_charge_rate:"",
      RowID: rowData && rowData.RowID
      ? rowData.RowID
      :""
    }))


 
  }

},[rowData])





  const handleEditClick = (e) => {

    setTextField(e);
  };
  const handleCloseDefault = (e, result) => {
    if (result !== "backdropClick") {
      setTextField("");
      setDefaultModal(false);
    
    }
  };

  React.useEffect(() => {
    if (textField) {
      setDefaultModal(true);
    }
  }, [textField]);

  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_usert_group_mandatoryfiled.php"
        );

        if (response.data.status === "SUCCESS") {
          setGroupLabel(response?.data?.user_group?.MandatoryField);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabel();
  }, []);
  const handleSubmitForm = async () => {
   if (!data.emp_ls1_craft) {
      toast.error(`Please fill the required field: Craft`, {
        position: "top-center",
        autoClose: 3000,
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
    }



     // Check if there is an existing record with the same condition
  const existingRecordIndex = MaintenceResult.findIndex(item => item.RowID)
  console.log("existingRecordIndex",existingRecordIndex)



  if (existingRecordIndex !== -1) {
    // Replace the existing record with the new data
    setMaintenceResult(prev => {
      const updatedResults = [{...prev,mst_RowID:rowData.mst_RowID}];
      updatedResults[existingRecordIndex] = data;
      return updatedResults;
    });
  } else {
    // Add new data if no existing record found
    setMaintenceResult(prev => [...prev, data]);
  }


  handleClose(); // Close the form

  };
  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = groupLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };
  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = groupLabel.find(
      (item) => item.column_name === columnName
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return foundItem.cf_label_required;
    }
    return "";
  };
  const handleData = (e) => {
    const value = e.target.value;
      setData((pre) => ({
        ...pre,
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

      // handle text
const handleText=(e)=>{
    setData((pre)=>({
        ...pre,
        [e.target.name]:e.target.value
    }))

}



  return (
    <>
     <MasterDialogMaintence
        setData={setData}
        handleClose={handleCloseDefault}
        open={DefaultModal}
        name={textField}
      /> 
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", alignItems: "center", gap: 3 }}
      >
    <GiStoneCrafting  />
       Update Craft
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2,p:3 }} >
        <Grid container spacing={2} >
       


          {/* CRAFT */}
          <Grid item xs={12} >
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("emp_ls1_craft") || "Craft"}
                          </Typography>
                          <div>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              name="craft"
                              size="small"
                             
                              fullWidth
                            
                              placeholder="Select..."
                              value={data.emp_ls1_craft}
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
                                      onClick={() => handleCancelClick("emp_ls1_craft")}
                                    />

                                    <Iconify
                                      icon="tabler:edit"
                                      onClick={() => handleEditClick("emp_ls1_craft")}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ),
                              }}
                            />
                          </div>
                          </Grid>
                         {/* Default Language */}
                        <Grid item xs={12} >
                          <Typography variant="subtitle2" >
                            {findCustomizeLabel("emp_ls1_supervisor_id") || "Supervisior ID"}
                          </Typography>
                          <div>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              name="emp_ls1_supervisor_id"
                              size="s_Id"
                              // value={data ? data.LaborAccount : ""}
                              fullWidth
                              // value={Permanent_IDFlag || ""}
                              // disabled
                              placeholder="Select..."
                              value={data.emp_ls1_supervisor_id}
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
                                      onClick={() => handleCancelClick("emp_ls1_supervisor_id")}
                                    />

                                    <Iconify
                                      icon="tabler:edit"
                                      onClick={() => handleEditClick("emp_ls1_supervisor_id")}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ),
                              }}
                            />
                          </div>
                          </Grid>

                         {/* pay rate charge*/}
                          <Grid item xs={12} md={12}>
                          <Typography variant="subtitle2" >
                            {findCustomizeLabel("emp_ls1_pay_rate") || "Pay Rate"}
                          </Typography>
                          <div>
                            <TextField
                              id="outlined-basic"
                              fullWidth
                              variant="outlined"
                              name="emp_ls1_pay_rate"
                              size="small"
                              type="number"
                              placeholder=".000"
                              value={data.emp_ls1_pay_rate}
                              onChange={handleText}
                            
                            />
                          </div>
                          </Grid>



                              {/*charge rate*/}
                              <Grid item xs={12} md={12}>
                          <Typography variant="subtitle2" >
                            {findCustomizeLabel("emp_ls1_charge_rate") || "Charge Rate"}
                          </Typography>
                          <div>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              name="emp_ls1_charge_rate"
                              size="small"
                              fullWidth
                              onChange={handleText}
                              type="number"
                              placeholder=".000"
                              value={data.emp_ls1_charge_rate}
                            
                            />
                          </div>
                          </Grid>
          
        </Grid>
      </DialogContent>
      <Divider style={{ marginTop: "10px" }} />
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
        Update
          </Button>
          <Button
            variant="soft"
            color="error"
            startIcon={<Iconify icon="jam:close" />}
            onClick={(e, r) => {
              setData("");
              handleClose(e, r);
              setError("");
            }}
          >
            Close
          </Button>
        </div>
      </DialogActions>
      <ToastContainer />
    </Dialog>
    </>
  );
}

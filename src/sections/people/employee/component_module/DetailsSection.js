import {
  Autocomplete,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import React from "react";
import Iconify from "src/components/iconify";


function DetailsSection({ findCustomizeLabel, handleChangeText, textFields,handleCancelClick,handleEditClick,data,visible,setVisible,checkboxData,handleCheckboxData,setSelectedShift,shift,selectedShift }) {

  return (
    <Grid container spacing={2} sx={{alignItems:"center"}} >
      <Grid item xs={12} sm={4}>
        {/*Mr Approver */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_mr_approver") ||
              "MR Approver / Global Limit"}
            {/* checked value sent from parent */}
            <Checkbox name="emp_det_mr_approver" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_mr_approver)} />
          </Typography>
        { checkboxData.emp_det_mr_approver &&  checkboxData.emp_det_mr_approver !== "0" ? <TextField
            id="outlined-basic"
            variant="outlined"
            name="emp_det_mr_limit"
            size="small"
      
            type="number"
            value={textFields.emp_det_mr_limit}
            onChange={handleChangeText}
          />:null}
        </Stack>
      </Grid>

      {/*PR Approver */}
      <Grid item xs={12} sm={4}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_pr_approver") || "PR Approval Limit"}

            <Checkbox name="emp_det_pr_approver" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_pr_approver)} />
          </Typography>
          {checkboxData.emp_det_pr_approver && checkboxData.emp_det_pr_approver!=="0" ? <TextField
            id="outlined-basic"
            variant="outlined"
            name="emp_det_pr_approval_limit"
            type="number"
            size="small"
            value={textFields.emp_det_pr_approval_limit}
            
            onChange={handleChangeText}
          />:null}
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/*WO Budget Approver */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_wo_budget_approver") ||
              "WO Budget Approver / Limit"}

        <Checkbox name="emp_det_wo_budget_approver" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_wo_budget_approver)} />
          </Typography>
         {checkboxData.emp_det_wo_budget_approver && checkboxData.emp_det_wo_budget_approver !== "0" ? <TextField
            id="outlined-basic"
            variant="outlined"
            name="emp_det_wo_approval_limit"
            size="small"
            type='number'
            value={textFields.emp_det_wo_approval_limit}
       
            onChange={handleChangeText}
          />:null}
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/*WR Approver */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_wr_approver") || "WR Approver"}
            {/* checked value sent from parent */}
            <Checkbox name="emp_det_wr_approver" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_wr_approver)} />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={4}>
        {/*Planner */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_planner") || "Planner"}

            <Checkbox name="emp_det_planner" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_planner)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Request Parts && Services */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_wo_gen_mr_pr") ||
              "Request Parts && Services"}

<Checkbox name="emp_det_wo_gen_mr_pr" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_wo_gen_mr_pr)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* PM Generator */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_pm_generator") || "PM Generator"}

           
<Checkbox name="emp_det_pm_generator" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_pm_generator)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Enter Time Card */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_time_card_enter") || "Enter Time Card"}

            <Checkbox name="emp_det_time_card_enter" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_time_card_enter)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/*Void Time Card */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_time_card_void") || "Void Time Card"}

            <Checkbox name="emp_det_time_card_void" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_time_card_void)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Core Access */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_core") || "Core Access"}

            <Checkbox name="emp_det_core" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_core)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Mobile Access */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_mobile") || "Mobile Access"}

            <Checkbox name="emp_det_mobile" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_mobile)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Core Access */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_webwork") || "Core Access"}

            <Checkbox name="emp_det_webwork" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_webwork)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Core Access */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_wo_sched") || "Schedule Work Order"}

            <Checkbox name="emp_det_wo_sched" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_wo_sched)} />
          </Typography>
        </Stack>
      </Grid>

     {/* PO Buyer */}
      <Grid item xs={12} sm={4}>
   
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_po_buyer") || "PO Buyer"}

            <Checkbox name="emp_det_po_buyer" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_po_buyer)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Supervisor */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_supervisor") || "Supervisor"}

            <Checkbox name="emp_det_supervisor" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_supervisor)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Technician */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_foreman") || "Technician"}

            <Checkbox name="emp_det_foreman" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_foreman)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Asset Tagging Posting */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_asset_tag_flag") ||
              "Asset Tagging Posting"}

<Checkbox name="emp_det_asset_tag_flag" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_asset_tag_flag)} />
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Add/Delete Check List */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_checklist") || "Add/Delete Check List"}

            <Checkbox name="emp_det_checklist" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_checklist)} />
          </Typography>
        </Stack>
      </Grid>
   {/* Supervisior Id */}
   <Grid item xs={12} sm={4}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_supervisor_id") || "Supervisior Id"}

            <Checkbox name="emp_det_supervisor_id" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_supervisor_id)} />
          </Typography>
        </Stack>
      </Grid>
     

      <Grid item xs={12} sm={4}>
        {/* Email Id */}
        <Stack spacing={1}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("emp_det_email_id") || "Email ID"}
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            name="emp_det_email_id"
            size="small"
            value={textFields && textFields.emp_det_email_id?textFields.emp_det_email_id:""}
     
            onChange={handleChangeText}
            inputProps={{ maxLength: 50 }}
          />
        </Stack>
      </Grid>

      {/* Primary Craft */}
      <Grid item xs={12} sm={4}>
        {/* Primary Craft*/}

        <Stack spacing={1}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("emp_det_craft") || "Primary Craft"}
          </Typography>

          <div>
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="emp_det_craft"
              size="small"
              value={data ? data.emp_det_craft : ""}
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
                      onClick={() => handleCancelClick("emp_det_craft")}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("emp_det_craft")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>
      </Grid>

      {/* Work Area */}
      <Grid item xs={12} sm={4}>
        {/* Work Area */}
        <Stack spacing={1}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("emp_det_work_area") || "Work Area"}
          </Typography>
          <div>
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="emp_det_work_area"
              size="small"
              value={data ? data.emp_det_work_area : ""}
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
                      onClick={() => handleCancelClick("emp_det_work_area")}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("emp_det_work_area")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>
      </Grid>

      {/* Work Group */}
      <Grid item xs={12} sm={4}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("emp_det_work_grp") || "Work Group"}
          </Typography>
          <div>
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="emp_det_work_grp"
              size="small"
              value={data ? data.emp_det_work_grp : ""}
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
                      onClick={() => handleCancelClick("emp_det_work_grp")}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("emp_det_work_grp")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Shift */}
        <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("emp_det_shift") || "Shift"}{" "}
          </Typography>
          
          <Autocomplete
            options={shift}
           value={selectedShift && selectedShift.label?selectedShift.label:""}
            onChange={(event, value) => {
              setSelectedShift(value);
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
      </Grid>

      <Grid item xs={12} sm={4}>
        {/* Supervisor ID*/}

        <Stack spacing={1}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("emp_det_supervisor_id") || "Supervisor ID"}
          </Typography>

          <div>
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="emp_det_supervisor_id"
              size="small"
              value={data && data.emp_det_supervisor_id ? data.emp_det_supervisor_id : ""}
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
                      onClick={() => handleCancelClick("emp_det_supervisor_id")}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("emp_det_supervisor_id")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>
      </Grid>

   

      {/* Mobile User */}
      <Grid item xs={12} sm={4}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginRight:"80px"}}>
            {findCustomizeLabel("emp_det_msetup_mobile_user") || "Mobile User"}

            <Checkbox name="emp_det_msetup_mobile_user" onChange={handleCheckboxData} checked={Number(checkboxData.emp_det_msetup_mobile_user)} />
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default DetailsSection;

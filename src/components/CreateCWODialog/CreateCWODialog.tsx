import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";

interface CreateCWODialogProps {
  open: boolean;
  onClose: () => void;
  alertData?: {
    objectUUID: string;
    description: string;
    location: string;
    assetName: string;
  };
}

export const CreateCWODialog: React.FC<CreateCWODialogProps> = ({
  open,
  onClose,
  alertData,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#141414",
          color: "#ffffff",
          fontFamily: "Chakra Petch, Arial, sans-serif",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontFamily: "Chakra Petch" }}>
          New Work Order
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.72)" }}>
          Provide all relevant information to begin tracking this work order.
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Work Order Details Section */}
          <Typography variant="subtitle2" sx={{ fontFamily: "Chakra Petch" }}>
            Work Order Details
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Building*"
              size="small"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Location*"
              size="small"
              variant="outlined"
              fullWidth
              defaultValue={alertData?.location}
            />
            <TextField
              label="CWO Type*"
              size="small"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Problem Type*"
              size="small"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Service Category*"
              size="small"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Priority*"
              size="small"
              variant="outlined"
              fullWidth
            />
          </Box>

          {/* Additional Information Section */}
          <Typography variant="subtitle2" sx={{ fontFamily: "Chakra Petch", mt: 2 }}>
            Additional Information
          </Typography>

          <TextField
            label="Asset"
            size="small"
            variant="outlined"
            fullWidth
            defaultValue={alertData?.assetName}
          />

          <TextField
            label="Description"
            size="small"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            defaultValue={alertData?.description}
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Requested On"
              size="small"
              variant="outlined"
              fullWidth
              defaultValue={new Date().toLocaleDateString()}
            />
            <TextField
              label="Requester"
              size="small"
              variant="outlined"
              fullWidth
            />
          </Box>

          {/* Attachments section - simplified */}
          <Box
            sx={{
              border: "1px dashed rgba(255, 255, 255, 0.12)",
              borderRadius: 1,
              p: 3,
              textAlign: "center",
              mt: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.72)" }}>
              Browse or drag and drop photo here
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
              Max. photo size: 5MB
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log("Creating CWO...");
            // Add your CWO creation logic here
            onClose();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
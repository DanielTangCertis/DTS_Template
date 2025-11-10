import React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  styled,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { AlertStatus, AlertCategory } from "@/types/digitalTwin.types";

const StyledAlertCard = styled(Box)({
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "1rem 1.25rem",
  borderRadius: "0.5rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.5)",
  minWidth: "20rem",
  maxWidth: "28rem",
  // maxHeight: "50vh",
  overflowY: "auto",
  zIndex: 1000,
  pointerEvents: "auto",
  fontFamily: "General Sans, Arial, sans-serif",
  position: "fixed",

  // Custom scrollbar styling
  "&::-webkit-scrollbar": {
    width: "0.5rem",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "0.25rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "0.25rem",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
  },
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: "0.5rem",
  right: "0.5rem",
  padding: 0,
  width: "1.5rem",
  height: "1.5rem",
  minWidth: "1.5rem",
  color: "#fff",
  transition: "transform 0.3s", // Match Header.tsx transition timing
  "&:hover": {
    transform: "scale(1.2)", // Match Header.tsx 20% scale increase
  },
});

const CloseIcon = styled("img")({
  width: "100%",
  height: "100%",
  display: "block",
});

const DragHandle = styled(Box)({
  position: "absolute",
  top: "0.5rem",
  left: "0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "grab",
  color: "rgba(255, 255, 255, 0.5)",
  transition: "color 0.2s",
  padding: "0.25rem",
  borderRadius: "0.25rem",
  "&:hover": {
    color: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  "&:active": {
    cursor: "grabbing",
    color: "#7afafe",
  },
});

const StatusChip = styled(Box)<{ status: AlertStatus }>(({ status }) => ({
  display: "inline-block",
  padding: "0.25rem 0.75rem",
  borderRadius: "0.25rem",
  fontSize: "0.75rem",
  fontWeight: "bold",
  backgroundColor: status === AlertStatus.UNASSIGNED ? "#ff4444" : "#ff9800",
  color: "#ffffff",
  fontFamily: "General Sans, Arial, sans-serif",
}));

const CategoryBadge = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.25rem 0.5rem",
  borderRadius: "0.25rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  fontSize: "0.6875rem",
  fontWeight: "bold",
  fontFamily: "General Sans, Arial, sans-serif",
});

const CategoryIcon = styled("img")({
  width: "1rem",
  height: "1rem",
  display: "block",
  flexShrink: 0,
});

const AffectedEquipmentButton = styled(Button)<{ selected: boolean }>(
  ({ selected }) => ({
    textTransform: "none",
    fontSize: "0.6875rem",
    padding: "0.375rem 0.625rem",
    margin: "0.25rem",
    backgroundColor: selected ? "#ff9800" : "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    border: selected
      ? "1px solid #ff9800"
      : "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "0.25rem",
    fontFamily: "General Sans, Arial, sans-serif",
    justifyContent: "center",
    textAlign: "center",
    minHeight: "2rem",
    "&:hover": {
      backgroundColor: selected ? "#ff9800" : "rgba(255, 255, 255, 0.2)",
      border: selected
        ? "1px solid #ff9800"
        : "1px solid rgba(255, 255, 255, 0.3)",
    },
  })
);

const RowHeader = styled(Typography)({
  fontSize: "0.75rem",
  fontWeight: "bold",
  color: "rgba(255, 255, 255, 0.9)",
  marginBottom: "0.25rem",
  fontFamily: "General Sans, Arial, sans-serif",
  textAlign: "left",
});

const CreateCWOButton = styled(Button)({
  textTransform: "none",
  fontSize: "0.875rem",
  padding: "0.625rem 1rem",
  marginTop: "1rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "#ffffff",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "0.25rem",
  fontFamily: "General Sans, Arial, sans-serif",
  fontWeight: "bold",
  width: "100%",
  justifyContent: "center",
  textAlign: "center",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
});

export interface AffectedItem {
  objectUUIDs: string[];
  tileLayerID: string;
  assetName: string;
  location: string;
  coordinates: number[];
}

interface AlertData {
  objectUUID: string;
  assetName: string;
  description: string;
  category: AlertCategory;
  status: AlertStatus;
  location: string;
  coordinates: number[];
  tileLayerID: string;
  affected: {
    upstream: AffectedItem[];
    downstream: AffectedItem[];
  };
}

interface AlertCardProps {
  alert: AlertData;
  mainItem: AffectedItem;
  position: { x: number; y: number };
  currentDisplay: {
    assetName: string;
    location: string;
  } | null;
  selectedItem: {
    type: "upstream" | "main" | "downstream";
    index: number;
  } | null;
  onClose?: () => void;
  onAffectedItemClick?: (
    item: AffectedItem,
    type: "upstream" | "main" | "downstream",
    index: number
  ) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onCreateCWO?: () => void;
}

// Helper function to get category icon path
const getCategoryIcon = (category: AlertCategory): string => {
  return `/assets/icons/${category}.svg`;
};

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  mainItem,
  position,
  currentDisplay,
  selectedItem,
  onClose,
  onAffectedItemClick,
  onPositionChange,
  onCreateCWO,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Use currentDisplay if available, otherwise use alert data
  const displayAssetName = currentDisplay?.assetName || alert.assetName;
  const displayLocation = currentDisplay?.location || alert.location;

  // for drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position);

  // Sync position with prop changes
  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  // Handle drag start
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left mouse button

      setIsDragging(true);
      setDragOffset({
        x: e.clientX - currentPosition.x,
        y: e.clientY - currentPosition.y,
      });
      e.stopPropagation();
    },
    [currentPosition]
  );

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      setCurrentPosition(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Save final position
      if (onPositionChange) {
        onPositionChange(currentPosition);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, currentPosition, onPositionChange]);

  return (
    <StyledAlertCard
      ref={cardRef}
      sx={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      <DragHandle onMouseDown={handleMouseDown}>
        <DragIndicatorIcon fontSize="small" />
      </DragHandle>
      <Tooltip title="Return to overview" placement="top">
        <CloseButton
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          aria-label="Close alert"
        >
          <CloseIcon src="/assets/icons/cancel_filled_FFFFFF.svg" alt="Close" />
        </CloseButton>
      </Tooltip>

      {/* Category Badge */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "left",
          marginBottom: "0.75rem",
        }}
      >
        <CategoryBadge>
          <CategoryIcon
            src={getCategoryIcon(alert.category)}
            alt={alert.category}
          />
          <span>{alert.category}</span>
        </CategoryBadge>
      </Box>
      <Box>
        {/* Description */}
        <Typography
          variant="h6"
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            fontFamily: "General Sans, Arial, sans-serif",
            paddingRight: "2rem",
            lineHeight: 1.3,
          }}
        >
          {alert.description}
        </Typography>

        {/* Asset Name */}
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.8125rem",
            color: "#ff9800",
            fontFamily: "General Sans, Arial, sans-serif",
            fontWeight: "500",
            marginBottom: "0.75rem",
          }}
        >
          {displayAssetName}
        </Typography>
      </Box>

      {/* Status and Location Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "0.75rem",
          marginBottom: "1rem",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "General Sans, Arial, sans-serif",
              flexShrink: 1,
              textAlign: "start",
              marginBottom: "0.25rem",
            }}
          >
            status:
          </Typography>
          <StatusChip status={alert.status}>{alert.status}</StatusChip>
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "General Sans, Arial, sans-serif",
              flexShrink: 1,
              textAlign: "start",
              marginBottom: "0.25rem",
            }}
          >
            location:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "General Sans, Arial, sans-serif",
              flexShrink: 1,
              textAlign: "start",
            }}
          >
            {displayLocation}
          </Typography>
        </Box>
      </Box>

      {/* Affected Equipment - 3 Rows Layout */}
      {(alert.affected.upstream.length > 0 ||
        alert.affected.downstream.length > 0) && (
        <Box sx={{ marginTop: "1rem" }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "0.8125rem",
              fontWeight: "bold",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "0.5rem",
              fontFamily: "General Sans, Arial, sans-serif",
            }}
          >
            Affected Equipment
          </Typography>

          <Box
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "0.25rem",
              padding: "0.5rem",
            }}
          >
            {/* Upstream Row */}
            <Box
              sx={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                paddingBottom: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <RowHeader>Upstream</RowHeader>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                {alert.affected.upstream.length > 0 ? (
                  alert.affected.upstream.map((item, index) => (
                    <AffectedEquipmentButton
                      key={`upstream-${index}`}
                      selected={
                        selectedItem?.type === "upstream" &&
                        selectedItem?.index === index
                      }
                      onClick={() =>
                        onAffectedItemClick?.(item, "upstream", index)
                      }
                      size="small"
                    >
                      {item.assetName}
                    </AffectedEquipmentButton>
                  ))
                ) : (
                  <Typography
                    sx={{
                      fontSize: "0.6875rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontFamily: "General Sans, Arial, sans-serif",
                      padding: "0.5rem",
                    }}
                  >
                    None
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Main Row */}
            <Box
              sx={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                paddingBottom: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <RowHeader>Main</RowHeader>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                <AffectedEquipmentButton
                  selected={
                    selectedItem?.type === "main" && selectedItem?.index === 0
                  }
                  onClick={() => onAffectedItemClick?.(mainItem, "main", 0)}
                  size="small"
                >
                  {alert.assetName}
                </AffectedEquipmentButton>
              </Box>
            </Box>

            {/* Downstream Row */}
            <Box>
              <RowHeader>Downstream</RowHeader>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                {alert.affected.downstream.length > 0 ? (
                  alert.affected.downstream.map((item, index) => (
                    <AffectedEquipmentButton
                      key={`downstream-${index}`}
                      selected={
                        selectedItem?.type === "downstream" &&
                        selectedItem?.index === index
                      }
                      onClick={() =>
                        onAffectedItemClick?.(item, "downstream", index)
                      }
                      size="small"
                    >
                      {item.assetName}
                    </AffectedEquipmentButton>
                  ))
                ) : (
                  <Typography
                    sx={{
                      fontSize: "0.6875rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontFamily: "General Sans, Arial, sans-serif",
                      padding: "0.5rem",
                    }}
                  >
                    None
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      <CreateCWOButton
        onClick={() => {
          console.log("Create CWO clicked for alert:", alert.description);
          onCreateCWO?.();
        }}
      >
        CREATE CWO
      </CreateCWOButton>
    </StyledAlertCard>
  );
};

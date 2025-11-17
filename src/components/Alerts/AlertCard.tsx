import React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  styled,
  IconButton,
  Button,
  Tooltip,
  Badge,
  Chip,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { AlertStatus, AlertCategory } from "@/types/digitalTwin.types";
import { CreateCWODialog } from "../CreateCWODialog/CreateCWODialog";

// ==================== CONSTANTS ====================
export const CARD_CONSTANTS = {
  // in rem
  PRIMARY_WIDTH: 24,
  PRIMARY_MIN_WIDTH: 20, // (keep for reference)
  PRIMARY_MAX_WIDTH: 28, // (keep for reference)
  PRIMARY_INITIAL_TOPX: 0.1, // this is a ratio [0-1] of the window width
  PRIMARY_INITIAL_TOPY: 0.15, // this is a ratio [0-1] of the window height
  SECONDARY_WIDTH: 18,
  SECONDARY_MIN_WIDTH: 18, // (keep for reference)
  SECONDARY_MAX_WIDTH: 22, // (keep for reference)
  SECONDARY_HEIGHT: 11.25,
} as const;

// ==================== STYLED COMPONENTS ====================

const StyledAlertCard = styled(Box)({
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "1rem 1.25rem",
  borderRadius: "0.5rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.5)",
  // minWidth: "20rem",
  // maxWidth: "28rem",
  width: `${CARD_CONSTANTS.PRIMARY_WIDTH}rem`,
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

const StyledSecondaryCard = styled(Box)({
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "1rem 1.25rem",
  borderRadius: "0.5rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.5)",
  // minWidth: "18rem",
  // maxWidth: "22rem",
  width: `${CARD_CONSTANTS.SECONDARY_WIDTH}rem`,
  height: `${CARD_CONSTANTS.SECONDARY_HEIGHT}rem`,
  zIndex: 1000,
  pointerEvents: "auto",
  fontFamily: "General Sans, Arial, sans-serif",
  position: "fixed",
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
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.2)",
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

const ActionButton = styled(Button)<{ buttonVariant?: "enabled" | "disabled" }>(
  ({ buttonVariant = "enabled" }) => ({
    textTransform: "none",
    fontSize: "0.875rem",
    padding: "0.625rem 1rem",
    marginTop: "1rem",
    backgroundColor:
      buttonVariant === "enabled" ? "#ff9800" : "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    border:
      buttonVariant === "enabled"
        ? "1px solid #ff9800"
        : "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "0.25rem",
    fontFamily: "General Sans, Arial, sans-serif",
    fontWeight: "bold",
    width: "100%",
    justifyContent: "center",
    textAlign: "center",
    cursor: buttonVariant === "enabled" ? "pointer" : "not-allowed",
    "&:hover": {
      backgroundColor:
        buttonVariant === "enabled" ? "#ff7700" : "rgba(255, 255, 255, 0.1)",
      border:
        buttonVariant === "enabled"
          ? "1px solid #ff7700"
          : "1px solid rgba(255, 255, 255, 0.2)",
    },
  })
);

const MergeButton = styled(Button)<{ mergeType: "yes" | "no" }>(
  ({ mergeType }) => ({
    textTransform: "none",
    fontSize: "0.75rem",
    padding: "0.5rem 1rem",
    backgroundColor:
      mergeType === "yes" ? "#4caf50" : "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    border:
      mergeType === "yes"
        ? "1px solid #4caf50"
        : "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "0.25rem",
    fontFamily: "General Sans, Arial, sans-serif",
    fontWeight: "bold",
    flex: 1,
    "&:hover": {
      backgroundColor:
        mergeType === "yes" ? "#45a049" : "rgba(255, 255, 255, 0.2)",
      border:
        mergeType === "yes"
          ? "1px solid #45a049"
          : "1px solid rgba(255, 255, 255, 0.3)",
    },
  })
);

const NumberedBadge = styled(Box)({
  backgroundColor: "#ff9800",
  color: "#ffffff",
  fontSize: "0.625rem",
  fontWeight: "bold",
  height: "1.25rem",
  minWidth: "1.25rem",
  borderRadius: "50%",
  fontFamily: "General Sans, Arial, sans-serif",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 0.375rem",
});

const MergedChip = styled(Chip)({
  backgroundColor: "rgba(76, 175, 80, 0.2)",
  color: "#ffffff",
  border: "1px solid rgba(76, 175, 80, 0.5)",
  fontSize: "0.6875rem",
  fontFamily: "General Sans, Arial, sans-serif",
  margin: "0.25rem",
  "& .MuiChip-deleteIcon": {
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover": {
      color: "#ffffff",
    },
  },
});

// ==================== INTERFACES ====================

export interface AffectedItem {
  objectUUIDs: string[];
  tileLayerID: string;
  assetName: string;
  location: string;
  coordinates: number[];
  description?: string;
}

export interface AlertData {
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

export interface SecondaryCardData {
  item: AffectedItem;
  type: "upstream" | "downstream";
  index: number;
  position: { x: number; y: number };
  id: string;
}

export interface MergedItemData {
  description: string;
  type: "upstream" | "downstream";
  index: number;
}

interface PrimaryAlertCardProps {
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
  selectedSecurityItems?: Array<{
    type: "upstream" | "downstream";
    index: number;
  }>;
  mergedItems?: MergedItemData[];
  dismissedItems?: Array<{ type: "upstream" | "downstream"; index: number }>;
  onClose?: () => void;
  onAffectedItemClick?: (
    item: AffectedItem,
    type: "upstream" | "main" | "downstream",
    index: number
  ) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSubmitToIncidentManagement?: () => void;
}

interface SecondaryAlertCardProps {
  item: AffectedItem;
  type: "upstream" | "downstream";
  index: number;
  position: { x: number; y: number };
  onYes: (
    item: AffectedItem,
    type: "upstream" | "downstream",
    index: number
  ) => void;
  onNo: (
    item: AffectedItem,
    type: "upstream" | "downstream",
    index: number
  ) => void;
}

// ==================== HELPER FUNCTIONS ====================

const getCategoryIcon = (category: AlertCategory): string => {
  return `/assets/icons/${category}.svg`;
};

// ==================== SECONDARY ALERT CARD COMPONENT ====================

export const SecondaryAlertCard: React.FC<SecondaryAlertCardProps> = ({
  item,
  type,
  index,
  position,
  onYes,
  onNo,
}) => {
  return (
    <StyledSecondaryCard
      sx={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Heading */}
      <Typography
        variant="h6"
        sx={{
          fontSize: "0.875rem",
          fontWeight: "bold",
          fontFamily: "General Sans, Arial, sans-serif",
          textAlign: "center",
          marginBottom: "1rem",
          color: "rgba(255, 255, 255, 0.9)",
        }}
      >
        Merge Alert with Main?
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.8125rem",
          fontWeight: "bold",
          fontFamily: "General Sans, Arial, sans-serif",
          marginBottom: "0.5rem",
          lineHeight: 1.3,
        }}
      >
        {item.description || "Alert"}
      </Typography>

      {/* Asset Name */}
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.75rem",
          color: "#ff9800",
          fontFamily: "General Sans, Arial, sans-serif",
          fontWeight: "500",
          marginBottom: "0.5rem",
        }}
      >
        {item.assetName}
      </Typography>

      {/* Location */}
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.6875rem",
          color: "rgba(255, 255, 255, 0.7)",
          fontFamily: "General Sans, Arial, sans-serif",
          marginBottom: "1rem",
        }}
      >
        {item.location}
      </Typography>

      {/* Yes/No Buttons */}
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <MergeButton mergeType="yes" onClick={() => onYes(item, type, index)}>
          Yes
        </MergeButton>
        <MergeButton mergeType="no" onClick={() => onNo(item, type, index)}>
          No
        </MergeButton>
      </Box>
    </StyledSecondaryCard>
  );
};

// ==================== PRIMARY ALERT CARD COMPONENT ====================

export const PrimaryAlertCard: React.FC<PrimaryAlertCardProps> = ({
  alert,
  mainItem,
  position,
  currentDisplay,
  selectedItem,
  selectedSecurityItems = [],
  mergedItems = [],
  dismissedItems = [],
  onClose,
  onAffectedItemClick,
  onPositionChange,
  onSubmitToIncidentManagement,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isSecurityAlert = alert.category === AlertCategory.SECURITY;

  // Use currentDisplay if available, otherwise use alert data
  const displayAssetName = currentDisplay?.assetName || alert.assetName;
  const displayLocation = currentDisplay?.location || alert.location;

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position);

  // CWO Dialog state (consolidated here)
  const [showCWODialog, setShowCWODialog] = useState(false);

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

  // Calculate counts for security alerts
  const getAllAffectedItems = () => {
    return [...alert.affected.upstream, ...alert.affected.downstream];
  };

  const getPotentiallyRelatedCount = () => {
    if (!isSecurityAlert) return 0;
    const allItems = getAllAffectedItems();
    const addressedCount = mergedItems.length + dismissedItems.length;
    return allItems.length - addressedCount;
  };

  const getMergedCount = () => {
    return mergedItems.length;
  };

  const isSubmitEnabled = () => {
    if (!isSecurityAlert) return false;
    return getPotentiallyRelatedCount() === 0;
  };

  // Check if an item is dismissed
  const isItemDismissed = (type: "upstream" | "downstream", index: number) => {
    return dismissedItems.some((d) => d.type === type && d.index === index);
  };

  // Check if an item is merged
  const isItemMerged = (type: "upstream" | "downstream", index: number) => {
    return mergedItems.some((m) => m.type === type && m.index === index);
  };

  // Check if item should be hidden (dismissed or merged)
  const shouldHideItem = (type: "upstream" | "downstream", index: number) => {
    return isItemDismissed(type, index) || isItemMerged(type, index);
  };

  // Check if an item is selected (for security alerts)
  const isSecurityItemSelected = (
    type: "upstream" | "downstream",
    index: number
  ) => {
    return selectedSecurityItems.some(
      (item) => item.type === type && item.index === index
    );
  };

  return (
    <>
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
            <CloseIcon
              src="/assets/icons/cancel_filled_FFFFFF.svg"
              alt="Close"
            />
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

        {/* Affected Equipment Section - Different layout for Security vs Non-Security */}
        {isSecurityAlert ? (
          // SECURITY ALERT LAYOUT
          <>
            {/* Potentially Related Section */}
            {getPotentiallyRelatedCount() > 0 && (
              <Box sx={{ marginTop: "1rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: "0.8125rem",
                      fontWeight: "bold",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontFamily: "General Sans, Arial, sans-serif",
                    }}
                  >
                    Potentially Related
                  </Typography>
                  <NumberedBadge>{getPotentiallyRelatedCount()}</NumberedBadge>
                </Box>

                <Box
                  sx={{
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "0.25rem",
                    padding: "0.5rem",
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}
                  >
                    {alert.affected.upstream.map((item, index) => {
                      if (shouldHideItem("upstream", index)) return null;
                      return (
                        <AffectedEquipmentButton
                          key={`upstream-${index}`}
                          selected={isSecurityItemSelected("upstream", index)}
                          onClick={() =>
                            onAffectedItemClick?.(item, "upstream", index)
                          }
                          size="small"
                        >
                          {item.assetName}
                        </AffectedEquipmentButton>
                      );
                    })}
                    {alert.affected.downstream.map((item, index) => {
                      if (shouldHideItem("downstream", index)) return null;
                      return (
                        <AffectedEquipmentButton
                          key={`downstream-${index}`}
                          selected={isSecurityItemSelected("downstream", index)}
                          onClick={() =>
                            onAffectedItemClick?.(item, "downstream", index)
                          }
                          size="small"
                        >
                          {item.assetName}
                        </AffectedEquipmentButton>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Merged Section */}
            {getMergedCount() > 0 && (
              <Box sx={{ marginTop: "1rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: "0.8125rem",
                      fontWeight: "bold",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontFamily: "General Sans, Arial, sans-serif",
                    }}
                  >
                    Merged
                  </Typography>
                  <NumberedBadge>{getMergedCount()}</NumberedBadge>
                </Box>

                <Box
                  sx={{
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "0.25rem",
                    padding: "0.5rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.25rem",
                  }}
                >
                  {mergedItems.map((merged, idx) => (
                    <MergedChip
                      key={`merged-${idx}`}
                      label={merged.description}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </>
        ) : (
          // NON-SECURITY ALERT LAYOUT (Original 3-row layout)
          (alert.affected.upstream.length > 0 ||
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
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}
                  >
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
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}
                  >
                    <AffectedEquipmentButton
                      selected={
                        selectedItem?.type === "main" &&
                        selectedItem?.index === 0
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
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}
                  >
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
          )
        )}

        {/* Action Button - Different for Security vs Non-Security */}
        {isSecurityAlert ? (
          <Tooltip
            title={
              isSubmitEnabled()
                ? ""
                : "address Potentially Related Alerts first"
            }
            placement="top"
          >
            <span>
              <ActionButton
                buttonVariant={isSubmitEnabled() ? "enabled" : "disabled"}
                onClick={() => {
                  if (isSubmitEnabled()) {
                    onSubmitToIncidentManagement?.();
                  }
                }}
                disabled={!isSubmitEnabled()}
              >
                Submit to Incident Management
              </ActionButton>
            </span>
          </Tooltip>
        ) : (
          <ActionButton
            buttonVariant="enabled"
            onClick={() => {
              console.log("Create CWO clicked for alert:", alert.description);
              setShowCWODialog(true);
            }}
          >
            CREATE CWO
          </ActionButton>
        )}
      </StyledAlertCard>

      {/* CWO Dialog - Only for non-security alerts */}
      {!isSecurityAlert && (
        <CreateCWODialog
          open={showCWODialog}
          onClose={() => setShowCWODialog(false)}
          alertData={alert}
        />
      )}
    </>
  );
};

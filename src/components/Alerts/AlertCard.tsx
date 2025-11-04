import React from "react";
import { useRef, useEffect, useState } from "react";
import { Box, Typography, styled, IconButton, Button } from "@mui/material";
import { AlertStatus, AlertCategory } from "@/types/digitalTwin.types";

const StyledAlertCard = styled(Box)({
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "16px 20px",
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  minWidth: "320px",
  maxWidth: "450px",
  zIndex: 1000,
  pointerEvents: "auto",
  fontFamily: "General Sans, Arial, sans-serif",
  position: "fixed",
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: "8px",
  right: "8px",
  padding: 0,
  width: "24px",
  height: "24px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

const CloseIcon = styled("img")({
  width: "100%",
  height: "100%",
  display: "block",
});

const StatusChip = styled(Box)<{ status: AlertStatus }>(({ status }) => ({
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "bold",
  backgroundColor: status === AlertStatus.UNASSIGNED ? "#ff4444" : "#ff9800",
  color: "#ffffff",
  fontFamily: "General Sans, Arial, sans-serif",
}));

const CategoryBadge = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 8px",
  borderRadius: "4px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  fontSize: "11px",
  fontWeight: "bold",
  fontFamily: "General Sans, Arial, sans-serif",
});

const CategoryIcon = styled("img")({
  width: "16px",
  height: "16px",
  display: "block",
});

const AffectedEquipmentButton = styled(Button)<{ selected?: boolean }>(
  ({ selected }) => ({
    textTransform: "none",
    fontSize: "11px",
    padding: "6px 10px",
    margin: "4px",
    backgroundColor: selected ? "#ff9800" : "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    border: selected
      ? "1px solid #ff9800"
      : "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "4px",
    fontFamily: "General Sans, Arial, sans-serif",
    justifyContent: "center",
    textAlign: "center",
    "&:hover": {
      backgroundColor: selected ? "#ff9800" : "rgba(255, 255, 255, 0.2)",
      border: selected
        ? "1px solid #ff9800"
        : "1px solid rgba(255, 255, 255, 0.3)",
    },
  })
);

const RowHeader = styled(Typography)({
  fontSize: "12px",
  fontWeight: "bold",
  color: "rgba(255, 255, 255, 0.9)",
  marginBottom: "4px",
  fontFamily: "General Sans, Arial, sans-serif",
  textAlign: "left",
});

interface AffectedItem {
  objectUUIDs: string[];
  tileLayerID: string;
  description: string;
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
    description: string;
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
}

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
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [buttonSize, setButtonSize] = useState(24);

  useEffect(() => {
    if (cardRef.current) {
      const height = cardRef.current.offsetHeight;
      setButtonSize(height * 0.1);
    }
  }, []);

  // Use currentDisplay if available, otherwise fall back to alert data
  const displayDescription = currentDisplay?.description || alert.description;
  const displayLocation = currentDisplay?.location || alert.location;

  return (
    <StyledAlertCard
      ref={cardRef}
      sx={{
        left: `${position.x + 10}px`,
        top: `${position.y + 10}px`,
      }}
    >
      {/* Header with Category and Close Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "top",
        }}
      >
        <CategoryBadge>
          <CategoryIcon
            src={getCategoryIcon(alert.category)}
            alt={alert.category}
          />
          <span>{alert.category}</span>
        </CategoryBadge>
        <CloseButton
          sx={{ width: buttonSize, height: buttonSize }}
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          aria-label="Close alert"
        >
          <CloseIcon src="/assets/icons/cancel_filled_FFFFFF.svg" alt="Close" />
        </CloseButton>
      </Box>

      {/* Description and Asset Name */}
      <Box
        sx={{
          justifyContent: "start",
          alignItems: "center",
          marginTop: "12px",
          marginBottom: "12px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            fontFamily: "General Sans, Arial, sans-serif",
            paddingRight: "32px",
          }}
        >
          {displayDescription}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "13px",
            color: "rgba(255, 255, 255, 0.9)",
            fontFamily: "General Sans, Arial, sans-serif",
            fontWeight: "500",
          }}
        >
          {alert.assetName}
        </Typography>
      </Box>

      {/* Status and Location */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          gap: "12px",
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "General Sans, Arial, sans-serif",
              flexShrink: 1,
              textAlign: "start",
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
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "General Sans, Arial, sans-serif",
              flexShrink: 1,
              textAlign: "start",
            }}
          >
            location:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "12px",
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
        <Box sx={{ marginTop: "16px" }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "8px",
              fontFamily: "General Sans, Arial, sans-serif",
            }}
          >
            Affected Equipment
          </Typography>

          <Box
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              padding: "8px",
            }}
          >
            {/* Upstream Row */}
            <Box
              sx={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                paddingBottom: "8px",
                marginBottom: "8px",
              }}
            >
              <RowHeader>Upstream</RowHeader>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
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
                      {item.description}
                    </AffectedEquipmentButton>
                  ))
                ) : (
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontFamily: "General Sans, Arial, sans-serif",
                      padding: "8px",
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
                paddingBottom: "8px",
                marginBottom: "8px",
              }}
            >
              <RowHeader>Main</RowHeader>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                <AffectedEquipmentButton
                  selected={
                    selectedItem?.type === "main" && selectedItem?.index === 0
                  }
                  onClick={() => onAffectedItemClick?.(mainItem, "main", 0)}
                  size="small"
                >
                  {alert.description}
                </AffectedEquipmentButton>
              </Box>
            </Box>

            {/* Downstream Row */}
            <Box>
              <RowHeader>Downstream</RowHeader>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
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
                      {item.description}
                    </AffectedEquipmentButton>
                  ))
                ) : (
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontFamily: "General Sans, Arial, sans-serif",
                      padding: "8px",
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
    </StyledAlertCard>
  );
};

import { useEffect } from "react";
import { useDigitalTwinService } from "@/services/DigitalTwinService";
import { useDigitalTwinContext } from "@/contexts/DigitalTwinContext";

export const useAlertCardSync = () => {
  const { onAlertCardShow } = useDigitalTwinService();
  const { dispatch } = useDigitalTwinContext();

  useEffect(() => {
    const unsubscribe = onAlertCardShow((alertKey, position) => {
      dispatch({
        type: "SHOW_ALERT_CARD",
        payload: { alertKey, position },
      });
    });

    return unsubscribe;
  }, [onAlertCardShow, dispatch]);
};
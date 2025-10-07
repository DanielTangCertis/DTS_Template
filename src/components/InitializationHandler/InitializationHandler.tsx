import React, { useEffect } from "react";
import { useDigitalTwinContext } from "@/contexts/DigitalTwinContext";
import { useDigitalTwinApi } from "@/hooks/useDigitalTwinApi";

const InitializationHandler: React.FC = () => {
  const { state, dispatch } = useDigitalTwinContext();
  const { startCameraOrbit } = useDigitalTwinApi();
  const { coordsForCameraOrbit, playerIsReady } = state;
  useEffect(() => {
    if (playerIsReady) {
      //start orbit by default
      startCameraOrbit(coordsForCameraOrbit, [-30, 90, 0], 300
        , 90) // 90 seconds per rotation
        .then(() => {
          dispatch({ type: "SET_CAMERA_ORBIT", payload: true });
        })
        .catch((error) => {
          // Log any error if the camera orbit API fails to execute
          console.error(
            "Initialization failed: Camera orbit could not start.",
            error
          );
        });
    }
  }, [coordsForCameraOrbit, playerIsReady, startCameraOrbit]); //don't include dispatch here

  return null; // This component doesn't render anything
};

export default InitializationHandler;

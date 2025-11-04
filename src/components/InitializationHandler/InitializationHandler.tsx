import React, { useEffect } from "react";
import { useDigitalTwinContext } from "@/contexts/DigitalTwinContext";
import { useDigitalTwinApi } from "@/hooks/useDigitalTwinApi";
import { alertData } from "@/data/alertData";
import * as CameraData from "@/data/cameraData";

const InitializationHandler: React.FC = () => {
  const { state, dispatch } = useDigitalTwinContext();
  const { startCameraOrbit, createMarker, MarkerType } = useDigitalTwinApi();
  const { coordsForCameraOrbit, playerIsReady } = state;
  useEffect(() => {
    if (playerIsReady) {
      //start orbit by default
      startCameraOrbit(coordsForCameraOrbit, [-15, 90, 0], 350, 90) // 90 seconds per rotation
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

      /***
       * CREATE MARKERS FOR ALERTS
       */
      createMarker(window.fdapi, MarkerType.ALERT, alertData);
      let alertIDs = alertData.map((item: any) => "alert_" + item.objectUUID);
      dispatch({ type: "SET_ALERT_IDs", payload: alertIDs });
      dispatch({ type: "SET_ALERT_MARKERS", payload: true });

      /***
       * CREATE MARKERS FOR CCTVs
       */
      // Get all camera data as an array of arrays
      const allCameras = Object.values(CameraData);
      createMarker(window.fdapi, MarkerType.CAMERA, allCameras);
      let cameraUUIDs = allCameras.flat().map((item: any) => "camera_" + item.UUID);
      window.fdapi.marker.hide(cameraUUIDs);
      dispatch({ type: "SET_CCTV_IDs", payload: cameraUUIDs });
    }
  }, [coordsForCameraOrbit, playerIsReady, startCameraOrbit]); //don't include dispatch here

  return null; // This component doesn't render anything
};

export default InitializationHandler;

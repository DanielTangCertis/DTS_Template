import React, { useEffect } from "react";
import { useDigitalTwinContext } from "@/contexts/DigitalTwinContext";
import { useDigitalTwinApi } from "@/hooks/useDigitalTwinApi";
import { getCCTVData } from "@/utils/getCCTVDataFrom3DT";
import { Coordinates } from "@/types/digitalTwin.types";
import { alertData } from "@/data/sampleData";
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

      // // set alert coordinates
      // let allAlertCoords: Coordinates[] = [];
      // let allAlertIDs: string[] = [];
      // Object.entries(alertData).forEach(([key, value]) => {
      //   allAlertIDs.push(key);
      //   allAlertCoords.push(value.location);
      // });
      // dispatch({ type: "SET_ALERT_COORDINATES", payload: allAlertCoords });
      // dispatch({ type: "SET_ALERT_IDs", payload: allAlertIDs });

      // // create alert markers

      // createMarker(window.fdapi, MarkerType.ALERT, C2_1ST);
      // dispatch({ type: "SET_ALERT_MARKERS", payload: true });

      /***
       * CREATE MARKERS FOR CCTVs
       */
      // Get all camera data as an array of arrays
      const allCameras = Object.values(CameraData);
      createMarker(window.fdapi, MarkerType.CAMERA, allCameras);
      let cameraUUIDs = allCameras.flat().map((item: any) => item.UUID);
      window.fdapi.marker.hide(cameraUUIDs);
      dispatch({ type: "SET_CCTV_IDs", payload:cameraUUIDs});
      // getCCTVData("7090E62544F150327872C98578844D70").then((result) => {
      //   // tilelayer id for C2 North CG
      //   let allCCTVCoords: Coordinates[] = [];
      //   let allCCTVAssetNames: string[] = [];
      //   let allCCTVIDs: string[] = [];
      //   result.map((item: any) => {
      //     let loc: number[] = item.CoordinateInformation.location;
      //     let coords: Coordinates = { x: loc[0], y: loc[1], z: loc[2] };
      //     allCCTVCoords.push(coords);
      //     allCCTVAssetNames.push(item.data.Properties[143].Mark); // the asset name is labelled as "Mark" inside the BIM model
      //     allCCTVIDs.push(item.data.UUID);
      //   });
      //   console.log("allCCTVAssetNames", allCCTVAssetNames);
      //   dispatch({ type: "SET_CCTV_COORDINATES", payload: allCCTVCoords });
      //   dispatch({ type: "SET_CCTV_IDs", payload: allCCTVIDs });
      //   // create all CCTV markers

      //   // createMarker(window.fdapi, MarkerType.ALERT, C2_1ST);
      //   // for (let i = 0; i < allCCTVCoords.length; i++) {
      //   //   createMarker(
      //   //     window.fdapi,
      //   //     MarkerType.CAMERA,
      //   //     i,
      //   //     allCCTVCoords[i],
      //   //     allCCTVIDs[i],
      //   //     allCCTVAssetNames[i]
      //   //   );
      //   // }
      //   dispatch({ type: "SET_CCTV_MARKERS", payload: true });
      // });
    }
  }, [coordsForCameraOrbit, playerIsReady, startCameraOrbit]); //don't include dispatch here

  return null; // This component doesn't render anything
};

export default InitializationHandler;

/**
 * 从 BIM 数据中过滤出 Properties 中包含 "CAMERA Symbol" 且该值包含 "CCTV" 的完整元素对象。
 * @param data 原始 JSON 数据（即文件中的 data 对象）
 * @returns 满足条件的完整元素对象数组
 */
/**
 * Filters BIM data for complete element objects whose Properties contain "CAMERA Symbol" and whose value contains "CCTV".
 * @param data: The original JSON data (i.e., the data object in the file)
 * @returns: An array of complete element objects that meet the criteria
 */
function getCCTVCameraElements(data: Record<string, Record<string, any>>) {
  const result: any[] = [];
  for (const modelKey in data) {
    const model = data[modelKey];
    for (const elementKey in model) {
      const element = model[elementKey];
      const properties = element?.Properties;
      if (!Array.isArray(properties)) continue;
      const hasCCTVCamera = properties.some((prop) =>
        Object.entries(prop).some(
          ([key, value]) =>
            key.includes("CAMERA Symbol") &&
            typeof value === "string" &&
            value.toUpperCase().includes("CCTV")
        )
      );
      if (hasCCTVCamera) result.push(element);
    }
  }
  return result;
}
/**
 * 获取所有 CCTV 摄像头元素的 UUID 数组。
 * @param data 原始 JSON 数据（即文件中的 data 对象）
 * @returns UUID 数组
 */
/**
 * Get an array of UUIDs for all CCTV camera elements.
 * @param data: raw JSON data (i.e., the data object in the file)
 * @returns an array of UUIDs
 */
function getCCTVCameraUUIDs(cameraElements: any[]): string[] {
  // const cameraElements = getCCTVCameraElements(data);
  return cameraElements
    .map((el) => el.UUID)
    .filter(
      (uuid): uuid is string => typeof uuid === "string" && uuid.length > 0
    );
}

// 分层相关方法
/**
 * 为每条数据添加 LevelKey 字段（提取自 data.Properties.LevelName）
 * 返回完整数据数组，不丢弃任何项
 */
export function attachLevelKeyToAllData(items: any[] | any): any[] {
  const list = Array.isArray(items) ? items : [items];

  return list.map((item) => {
    const properties = item?.data?.Properties;
    if (!Array.isArray(properties)) {
      return { ...item, LevelKey: "UNKNOWN" };
    }

    // 查找 LevelName 或 Level
    const levelObj =
      properties.find((p) => typeof p.LevelName === "string") ||
      properties.find((p) => typeof p.Level === "string");

    const rawLevel = (levelObj?.LevelName || levelObj?.Level || "").trim();

    // 提取楼层标识，例如 1ST / 2ND / 3RD / 4TH
    const match = rawLevel.match(/(\d+(?:ST|ND|RD|TH))/i);
    const levelKey = match ? match[1].toUpperCase() : rawLevel || "UNKNOWN";

    // 在原数据上新增 LevelKey 字段
    return { ...item, LevelKey: levelKey };
  });
}
/**
 * 根据楼层标识（LevelKey）筛选出对应的所有完整数据
 * @param items 已通过 attachLevelKeyToAllData() 处理后的数据
 * @param levelKey 要筛选的楼层标识（如 "1ST", "2ND", "3RD"）
 * @returns 对应楼层的完整数据数组
 */
export function filterDataByLevel(items: any[], levelKey: string): any[] {
  if (!Array.isArray(items)) return [];

  const key = levelKey.trim().toUpperCase();
  const result = items.filter((item) => item.LevelKey?.toUpperCase() === key);

  // 返回该层所有完整数据
  return result;
}

// 添加marker的方法
// Method to add marker
const addMarkerByCCTVFun = async (data: any) => {
  const cctvMarkerData = await data.map((item: any, index: number) => {
    return {
      id: item.data.UUID,
      groupId: "MarkerByCCTV",
      coordinate: item.CoordinateInformation.location, //坐标位置
      coordinateType: 0, //默认0是投影坐标系，也可以设置为经纬度空间坐标系值为1
      anchors: [-10, 20], //锚点，设置Marker的整体偏移，取值规则和imageSize设置的宽高有关，图片的左上角会对准标注点的坐标位置。示例设置规则：x=-imageSize.width/2，y=imageSize.height
      imageSize: [20, 20], //图片的尺寸
      range: [1, 100000], //可视范围
      viewHeightRange: [0, 10000], // 可见高度范围
      rangeRatio: 0.01, //可见高度范围的调整系数
      imagePath: "/locale/zh/images/vp.png", //显示图片路径
      fixedSize: true, //图片固定尺寸，取值范围：false 自适应，近大远小，true 固定尺寸，默认值：false

      text: "", //显示的文字
      useTextAnimation: false, //关闭文字展开动画效果 打开会影响效率
      textRange: [1, 1000], //文本可视范围[近裁距离, 远裁距离]
      textOffset: [0, 0], // 文本偏移
      fontSize: 24, //字体大小
      fontOutlineSize: 1, //字体轮廓线大小
      fontColor: "#ffffff", //字体颜色
      fontOutlineColor: "#000000", //字体轮廓线颜色

      popupURL: "/locale/zh/popup_interact.html", //弹窗HTML链接
      popupBackgroundColor: [1.0, 1.0, 1.0, 0.5], //弹窗背景颜色
      popupSize: [300, 300], //弹窗大小
      popupOffset: [0, 0], //弹窗偏移

      showLine: false, //标注点下方是否显示垂直牵引线
      autoHidePopupWindow: true, //失去焦点后是否自动关闭弹出窗口
      autoHeight: false, // 自动判断下方是否有物体
      displayMode: 4, //智能显示模式  开发过程中请根据业务需求判断使用四种显示模式
      clusterByImage: true, // 聚合时是否根据图片路径分类，即当多个marker的imagePath路径参数相同时按路径对marker分类聚合
      priority: 0, //避让优先级
      occlusionCull: false, //是否参与遮挡剔除
    };
  });
  console.log("cctvMarkerData", cctvMarkerData);
  window.fdapi.marker.add(cctvMarkerData);
};

// 将3dt的id传入该方法
// Pass the id of 3dt into this method
export const getCCTVData = async (id: string) => {
  // 获取指定tilelayer包含的所有Actor对象的id；
  // Get the IDs of all Actor objects contained in the specified tilelayer;
  const tileLayerObjectId = await window.fdapi.tileLayer.getObjectIDs(id);
  console.log("tileLayerObjectId:", tileLayerObjectId.data);
  // 查询控件库的Actor信息
  // Query the Actor information of the control library
  const ActorInfoFromDBData = await window.fdapi.tileLayer.getActorInfoFromDB([
    {
      tileLayerId: id,
      objectIds: tileLayerObjectId.data[0].objectIds,
    },
  ]);
  console.log("ActorInfoFromDBData:", ActorInfoFromDBData);
  // 过滤CAMERA Symbol中包含CCTV的数据
  // Filter data containing CCTV in CAMERA Symbol
  const CCTVElements = getCCTVCameraElements(ActorInfoFromDBData.data);
  console.log("CCTVElements:", CCTVElements);
  // 获取所有 CCTV 摄像头元素的 UUID 数组
  // Get the UUID array of all CCTV camera elements
  const CCTVCameraUUIDs = getCCTVCameraUUIDs(
    CCTVElements
  );
  console.log("CCTVCameraUUIDs", CCTVCameraUUIDs);
  // 获取这些Actor的信息（包含坐标等）
  // Get the information of these Actors (including coordinates, etc.)
  const actorInfoData = await window.fdapi.tileLayer.getActorInfo({
    id: id,
    objectIds: CCTVCameraUUIDs,
  });
  console.log("actorInfoData", actorInfoData.data);
  
  // 将id及其参数和对应的坐标信息拼接起来
  // Concatenate the id and its parameters with the corresponding coordinate information
  const finalData = CCTVElements.map((a, i) => ({
    data: a,
    CoordinateInformation: actorInfoData.data[i],
  }));
  console.log("finalData", finalData);
  return finalData;

  // 获取指定楼层的数据
  // // ① 先为所有数据附加 LevelKey
  // const allDataWithLevel = await attachLevelKeyToAllData(finalData);
  // console.log(allDataWithLevel.length); // 输出数据总数
  // console.log(allDataWithLevel, 'allDataWithLevel');

  // // ② 获取指定楼层的全部数据
  // const firstFloorData = filterDataByLevel(allDataWithLevel, "1ST");
  // console.log("1ST 层完整数据：",firstFloorData);

  // 根据筛选过滤的数据添加marker
  // Add marker based on filtered data
  // addMarkerByCCTVFun(finalData)
};

// // 示例函数调用
// // Example function call
// searchDataFun('43D347F64576A7C26CCECFAFBDCB52F4')
// searchDataFun('09C6E3D141B93B64E70BDD8F97045711')

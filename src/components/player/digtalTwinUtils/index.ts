import { useDigitalTwinStore } from '@/stores/digitalTwinStore'
import { ElLoading } from 'element-plus'

const DigitalTwinStore = useDigitalTwinStore()
// 全局加载中动画
const loading  = ElLoading.service({
    lock:true,
    text:'Loading',
    spinner:'Loading',
    background:'rgba(1,1,1,0.3)'
  })
// 获取图层树数据
const getLayerTree = async () => {
    const info = await fdapi.infoTree.get();
    DigitalTwinStore.setLayerTree(info.infotree)
}
// 获取导览数据
const getAnimationList = async () => {
    const animationList = []
    const { data } = await fdapi.camera.getAnimationList()
    data.forEach(async (item) => {
        const obj = {
            id: item.id,
            name: item.name,
            img: ''
        }
        const { image } = await fdapi.camera.getAnimationImage(item.name)
        obj.img = 'data:image/png;base64,' + image
        animationList.push(obj)
    })
    DigitalTwinStore.setAnimationList(animationList)
}
// 对三维场景执行重置操作
const resetPlayer = async () => {
    await fdapi.reset(1 | 2 | 4)// 对三维场景执行重置操作
}

export const _onReady = async () => {
    resetPlayer();
    getLayerTree();
    getAnimationList();
    DigitalTwinStore.setReadyState(true);// 页面初始化完成
    loading.close();
}

export const _onEvent = () => {
    console.log('_onEvent')
}
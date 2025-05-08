export const formatInfoTree = (data) => {
    const fixedArr = data.map((item) => {
        return {
            label: item.name,
            id: item.iD,
            visiblity: item.visiblity,
            index: item.index,
            parentIndex: item.parentIndex,
            color: item.color
                ? item.color.replace("RGB", "rgb")
                : "rgb(255, 255, 255)",
            style: item.style ? item.style : 0,
            type: item.type,
        }
        // delete item.children
    })
    const map = {}
    fixedArr.forEach(function (item) {
        map[item.index] = item
    })
    const val = []
    fixedArr.forEach(function (item) {
        const parent = map[item.parentIndex]
        if (parent) {
            (parent.children || (parent.children = [])).push(item)
        } else {
            val.push(item)
        }
    })
    return val
}
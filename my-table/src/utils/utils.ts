import { DataType } from "../components/table";

export const setTransferedDate = (resultArray: DataType[]) => {
    for (let item of resultArray) {
        let itemDate = new Date(item.deliveryDate);
        item.deliveryDate = `${itemDate.getDate()}.${itemDate.getMonth()+1}.${itemDate.getFullYear()}`
    }
}
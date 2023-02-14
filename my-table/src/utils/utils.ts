import { ColumnsType } from "antd/es/table";
import { DataType } from "../components/table";

export const setTransferedDate = (resultArray: DataType[]) => {
    for (let item of resultArray) {
        let itemDate = new Date(item.deliveryDate);
        item.deliveryDate = `${itemDate.getDate()}.${itemDate.getMonth()+1}.${itemDate.getFullYear()}`
    }
}

export const tableColumns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => {
          let A = a.name.toUpperCase();
          let B = b.name.toUpperCase();
          
          if (A < B) {
              return -1;
            }
            if (A > B) {
              return 1;
            }
            return 0;
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Delivery date',
      dataIndex: 'deliveryDate',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => {
          let A = new Date(a.deliveryDate.split('.').reverse().join('-')).getTime();
          let B = new Date(b.deliveryDate.split('.').reverse().join('-')).getTime();
  
          if (A < B) {
              return -1;
            }
            if (A > B) {
              return 1;
            }
            return 0;
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: {
          compare:(a, b) => a.price - b.price,
          multiple: 1,
      }
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      sorter: {
          compare: (a, b) => {
          if (a.currency < b.currency) {
              return -1;
            }
            if (a.currency > b.currency) {
              return 1;
            }
            return 0;
          },  
          multiple: 2,
      },
    },
  ];
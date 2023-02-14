import React, { useEffect, useState } from 'react';
import { Button, Table, Typography, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './style.css';
import { setTransferedDate } from '../../utils/utils';

const { Text } = Typography;

export interface DataType {
  key: string;
  name: string;
  quantity: number;
  deliveryDate: string;
  price: number;
  currency: 'USD' | 'RUB';
}

const columns: ColumnsType<DataType> = [
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

let currentSelectedRows: DataType[] = [];

export const AppTable = () => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(false);


    const fetchData = () => {
        setLoading(true);
        fetch('http://localhost:9001/documents1')
        .then(res => res.json())
        .then(
          (result: DataType[]) => {
            setTransferedDate(result);
            // for(let item of result) {
            //     let itemDate = new Date(item.deliveryDate);
            //     item.deliveryDate = `${itemDate.getFullYear()}-${itemDate.getMonth()}-${itemDate.getDate()}`
            //     console.log(item.deliveryDate)
            // }
            setData(result)
            setLoading(false);          
          },
          (error) => {
            console.log(error)
          }
        )

        fetch('http://localhost:9001/documents2')
        .then(res => res.json())
        .then(
          (result: DataType[]) => {
            setTransferedDate(result);
            setData((prevData) => [...prevData, ...result]);
            setLoading(false);          
          },
          (error) => {
            console.log(error)
          }
        )
      };
    
      useEffect(() => {
        fetchData();
      }, []);

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
          currentSelectedRows = selectedRows;
          selectedRows.length>0? setIsDisabled(false):setIsDisabled(true);
        },
        getCheckboxProps: (record: DataType) => ({
          name: record.name,
        }),
      };

    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleOk = () => {
    setIsModalOpen(false);
    };
    
    const handleCancel = () => {
    setIsModalOpen(false);
    };

  return (
    <>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        bordered
        loading={loading}

        summary={(pageData) => {
            let totalQuantity = 0;
    
            pageData.forEach(({ quantity }) => {
              totalQuantity += quantity;
            });
    
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>Total quantity</Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <Text type="danger">{totalQuantity}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
        }}
        />
        <>
            <Button 
            className='annul-button'
            type="primary" 
            onClick={showModal} 
            disabled={isDisabled}
            >
                Аннулировать
            </Button>
            <Modal
            open={isModalOpen}
            title=""
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
            <Button key="back" onClick={handleCancel}>
                Отклонить
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
                Применить
            </Button>,
            ]}
            >
                <p>Вы уверены, что хотите аннулировать 
                    товар{currentSelectedRows.length>1?'ы: ':': '} 
                    {currentSelectedRows.map(item=> item.name).join(', ')}
                    ?</p>
            </Modal>
        </>
    </>
  );
};

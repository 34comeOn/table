import React, { useEffect, useState } from 'react';
import { Button, Table, Typography, Modal } from 'antd';
import { setTransferedDate, tableColumns } from '../../utils/utils';
import './style.css';

const { Text } = Typography;

export interface DataType {
  key: string;
  name: string;
  quantity: number;
  deliveryDate: string;
  price: number;
  currency: 'USD' | 'RUB';
}

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
            setData(result)
            setLoading(false);          
          })
        .catch((error) => console.log(error))

        fetch('http://localhost:9001/documents2')
        .then(res => res.json())
        .then(
          (result: DataType[]) => {
            setTransferedDate(result);
            setData((prevData) => [...prevData, ...result]);
            setLoading(false);          
          })
        .catch((error) => console.log(error))
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

        fetch('http://localhost:9001/cancel',
        {
            method: 'DELETE',
            body: JSON.stringify(currentSelectedRows)
        })
        .then(() => alert('Вы успешно аннулировали товары'))
        .catch((error) => console.log(error))
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
        columns={tableColumns}
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

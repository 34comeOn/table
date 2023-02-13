import React from 'react';
import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface DataType {
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
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
  },
  {
    title: 'Delivery date',
    dataIndex: 'deliveryDate',
  },
  {
    title: 'Price',
    dataIndex: 'price',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'Tent',
    quantity: 1,
    deliveryDate: '20.02.2023',
    price: 10000,
    currency: 'RUB',
  },
  {
    key: '2',
    name: 'Map',
    quantity: 1,
    deliveryDate: '18.02.2023',
    price: 10,
    currency: 'USD',
  },
  {
    key: '3',
    name: 'Pot',
    quantity: 3,
    deliveryDate: '21.02.2023',
    price: 17,
    currency: 'USD',
  },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: DataType) => ({
    name: record.name,
  }),
};

export const AppTable = () => {

  return (
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered


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
  );
};

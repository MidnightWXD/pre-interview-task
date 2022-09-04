import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Button, Table } from 'antd';
import "../styles/SearchTable.css";
import { ACTIONS } from '../App.js';

const columns = [
  {
    title: 'Location',
    dataIndex: 'location',
  },
  {
    title: 'Latitude',
    dataIndex: 'latitude',
  },
  {
    title: 'Longitude',
    dataIndex: 'longitude',
  },
];

const SearchTable = (props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const data = [];

  for (let i = 0; i < props.state.length; i++) {
    data.push({
      key: props.state[i].id,
      location: props.state[i].location,
      latitude: props.state[i].lat,
      longitude: props.state[i].lng,
    });
  }

  function handleDeleteLocation () {
    selectedRowKeys.forEach((key) => {
      props.dispatch({type: ACTIONS.REMOVE_LOCATION, payload: { id: key }});
    });
    console.log(selectedRowKeys);
  }

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <div className='search-table'>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button type="primary" onClick={handleDeleteLocation} danger className = "delete-btn">
          Delete selected
        </Button>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  );
};

export default SearchTable;
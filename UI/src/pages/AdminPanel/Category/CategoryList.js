// CategoryList.js

import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton } from 'react-admin';

const CategoryList = (props) => {
  return (
    <List {...props} title="Categories">
      <Datagrid>
        <TextField source="id" label="ID" />
        <TextField source="name" label="Category Name" />
        <EditButton basePath="/categories" />
        <DeleteButton basePath="/categories" />
      </Datagrid>
    </List>
  );
};

export default CategoryList;

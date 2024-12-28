import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";

const CategoryEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="name" label="Name" />
      </SimpleForm>
    </Edit>
  );
};

export default CategoryEdit;

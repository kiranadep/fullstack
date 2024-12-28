import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ImageField,
  ReferenceField,
  EditButton,
  DeleteButton,
} from "react-admin";

const ProductList = (props) => (
  <List {...props}>
    <Datagrid>
      {/* Display product fields */}
      <TextField source="name" label="Product Name" />
      <NumberField source="price" label="Price" />
      <TextField source="description" label="Description" />
      <TextField source="size" label="Size" />

      {/* Image field */}
      <ImageField
        source="imagePath"
        title="Product Image"
        // Construct the image URL using the backend URL and the image file name
        src={(record) =>
          record.imagePath
            ? `http://localhost:8080/upload_imges/${record.imagePath.split('/').pop()}`
            : "https://via.placeholder.com/150" // Fallback image if the product image is missing
        }
      />

      {/* ReferenceField for category - This will show the category name */}
      <ReferenceField label="Category" source="categoryId" reference="categories" allowEmpty>
        <TextField source="name" />
      </ReferenceField>

      {/* Action buttons */}
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default ProductList;

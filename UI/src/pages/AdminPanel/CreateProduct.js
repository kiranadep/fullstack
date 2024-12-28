import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ImageInput,
  ImageField,
  ReferenceInput,
  SelectInput,
} from "react-admin";

const CreateProduct = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        {/* Product Name */}
        <TextInput source="name" label="Product Name" />

        {/* Product Price */}
        <NumberInput source="price" label="Product Price" />

        {/* Category Reference */}
        <ReferenceInput label="Category" source="categoryId" reference="categories">
          <SelectInput optionText="name" /> {/* Display category name */}
        </ReferenceInput>

        {/* Product Image with Preview */}
        <ImageInput 
          source="imageFile" 
          label="Product Image" 
          accept="image/*" 
          placeholder={<p>Drag & drop an image or click to select</p>}
        >
          <ImageField 
            source="imageFile" 
            title="Product Image" 
            style={{ maxWidth: "100%", height: "auto" }} // Ensuring the image scales proportionally
          />
        </ImageInput>

        {/* New fields: Description and Size */}
        <TextInput source="description" label="Product Description" multiline />
        <TextInput source="size" label="Product Size" />
      </SimpleForm>
    </Create>
  );
};

export default CreateProduct;

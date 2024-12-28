import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ImageInput,
  ImageField,
  ReferenceInput,
  SelectInput,
  required,  // Import the required validator
} from 'react-admin';  // Import components from react-admin
import CategoryTypeInput from './Category/CategoryTypeInput';

const EditProduct = () => {
  return (
    <Edit>
      <SimpleForm>
        {/* Product Name */}
        <TextInput label="Product Name" source='name' validate={[required()]} />
        
        {/* Product Price */}
        <NumberInput label="Price" source='price' type="number" validate={[required()]} />
        
        {/* Category Reference Input */}
        <ReferenceInput label="Category" source='categoryId' reference='categories' allowEmpty>
          <SelectInput optionText="name" />
        </ReferenceInput>

        {/* Product Image Input */}
        <ImageInput source='imagePath' label="Product Image" accept="image/*">
          <ImageField source="imagePath" title="Product Image" />
        </ImageInput>

        {/* Additional Fields if necessary */}
        {/* <NumberInput source='rating' label="Rating" /> */}
        {/* <BooleanInput source='newArrival' label="New Arrival" /> */}
        <TextInput source="description" label="Product Description" multiline />
        <TextInput source="size" label="Product Size" />
      </SimpleForm>
    </Edit>
  );
};

export default EditProduct;

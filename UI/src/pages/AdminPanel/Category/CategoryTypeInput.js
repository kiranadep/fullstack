import React from 'react';
import { SelectInput } from 'react-admin';

const CategoryTypeInput = ({ record, ...props }) => {
  const category = record ? record.category : null;

  if (!category) {
    return <div>No category available</div>;
  }

  return (
    <SelectInput
      source="categoryId"
      choices={category}
      {...props}
    />
  );
};

export default CategoryTypeInput;

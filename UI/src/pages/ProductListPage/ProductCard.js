import React from "react";
import { Link } from "react-router-dom"; // Import Link
import { useDispatch } from "react-redux";
import { addItemToCartAction } from "../../store/actions/cartAction";
import { isTokenValid } from "../../utils/jwt-helper";

const ProductCard = ({ id, name, price, imagePath, categoryName }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col hover:scale-105 relative border rounded-lg p-4">
      <div className="flex justify-center items-center h-[300px] w-[300px]">
        <img
          className="object-cover h-full w-full rounded-lg"
          src={`http://localhost:8080/upload_imges/${imagePath.split("/").pop()}`} // Extract file name from path
          alt={name}
        />
      </div>

      <div className="flex flex-col pt-2 mt-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-500 text-sm">Category: {categoryName}</p>
        <p className="text-green-600 font-bold">Price: ₹{price}</p>
      </div>

        {/* Button Container */}
        <div className="flex justify-end">
          <Link
            to={`/products/${id}`}
            className="bg-black text-white py-2 px-5 rounded-md hover:bg-gray-700 text-sm"
          >
            View Product
          </Link>
        </div>
    </div>
  );
};

export default ProductCard;

import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { addAddressAPI, updateAddressAPI } from "../../api/userInfo"; // Import updateAddressAPI
import { saveAddress, selectUserInfo } from "../../store/features/user";
import { getAddressAPI } from "../../api/userInfo";  // Import the new function

const AddAddress = ({ onCancel, address, onSave }) => {
  const [values, setValues] = useState({
    street: address ? address.street : "", // Initialize with existing address if editing
    city: address ? address.city : "",
    state: address ? address.state : "",
    pincode: address ? address.pincode : "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const onSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      setError(""); // Reset error message
      dispatch(setLoading(true));

      const apiCall = address
        ? updateAddressAPI(values, userInfo?.id) // Use update API if editing
        : addAddressAPI(values, userInfo?.id); // Use add API if adding new address

      apiCall
        .then(() => {
          // Fetch updated user address data after add or update
          return getAddressAPI(userInfo?.id); // Fetch updated address list
        })
        .then((data) => {
          // Dispatch the updated user address data to Redux
          dispatch(saveAddress(data));
          console.log("User address updated:", data);

          // Close the form after success
          onCancel && onCancel();
        })
        .catch((err) => {
          const errorMsg =
            err.message || "Failed to save address. Please try again.";
          console.error("Error saving address:", err);
          setError(errorMsg);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, onCancel, address, userInfo?.id, values]
  );

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <p className="text-xl pt-4">{address ? "Edit" : "Add"} Address</p>
      <form onSubmit={onSubmit} className="pt-2 mb-2 md:w-[420px] w-full">
        <label>Address</label>
        <input
          type="text"
          name="street"
          value={values.street}
          onChange={handleOnChange}
          placeholder="Street"
          className="w-full border p-2 my-2 border-gray-400"
          required
        />
        <div className="flex gap-4">
          <input
            type="text"
            name="city"
            value={values.city}
            onChange={handleOnChange}
            placeholder="City"
            className="w-full border p-2 my-2 border-gray-400"
            required
          />
          <input
            type="text"
            name="state"
            value={values.state}
            onChange={handleOnChange}
            placeholder="State"
            className="w-full border p-2 my-2 border-gray-400"
            required
          />
        </div>
        <input
          type="text"
          name="pincode"
          value={values.pincode}
          onChange={handleOnChange}
          placeholder="Pincode"
          className="w-full border p-2 my-2 border-gray-400"
          required
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={onCancel}
            type="button"
            className="border-2 border-gray-400 rounded-lg w-[120px] h-[42px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-black rounded-lg w-[120px] h-[42px] text-white"
          >
            Save
          </button>
        </div>
      </form>
      {error && <p className="text-lg text-red-700">{error}</p>}
    </div>
  );
};

export default AddAddress;

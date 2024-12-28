import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { fetchUserDetails, deleteAddressAPI, updateAddressAPI } from "../../api/userInfo";
import { loadUserInfo } from "../../store/features/user";
import AddAddress from "./AddAddress";

const UserProfile = () => {
  const userInfo = useSelector((state) => state.userState?.userInfo || {});
  const [addAddress, setAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo.id) return;

    dispatch(setLoading(true));

    fetchUserDetails(userInfo.id)
      .then((data) => {
        dispatch(loadUserInfo(data));
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch, userInfo.id]);

  const onDeleteAddress = async () => {
    console.log("Deleting addresses for User ID:", userInfo.id); // Debugging
    try {
      dispatch(setLoading(true));
      await deleteAddressAPI(userInfo.id); // Pass only the userId
      console.log("Addresses deleted successfully");
      const updatedUserInfo = await fetchUserDetails(userInfo.id); // Fetch updated data
      console.log("Updated User Info:", updatedUserInfo);
      dispatch(loadUserInfo(updatedUserInfo)); // Update Redux state
    } catch (error) {
      console.error("Error deleting addresses:", error.response || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  

  const onUpdateAddress = async (data) => {
    try {
      dispatch(setLoading(true));
  
      // Include userId when calling updateAddressAPI
      await updateAddressAPI(data, userInfo.id);  // Pass both the updated data and userId
  
      const updatedUserInfo = await fetchUserDetails(userInfo.id);
      dispatch(loadUserInfo(updatedUserInfo));
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  

  const onEditAddress = (address) => {
    setEditingAddress(address); // Set the address to be edited
    setAddAddress(true); // Open the form
  };

  if (!userInfo?.firstName) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl">User Profile</h1>
      <div className="mt-4">
        <h2 className="text-xl">Contact Details</h2>
        <div className="pt-4">
        <h2 className="text-xl">Full Name</h2>
          <p>{userInfo.firstName} {userInfo.lastName}</p>
          <h2 className="text-xl pt-2">Mobile Number</h2>
          <p>{userInfo.mobile || "Not Available"}</p>
          <h2 className="text-xl pt-2">Email</h2>
          <p>{userInfo.email}</p>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex gap-12">
          <h3 className="text-lg font-bold">Address</h3>
          {/* Conditionally render "Add New Address" button */}
          {!userInfo.addresses?.length && (
            <button className="underline text-blue-900" onClick={() => setAddAddress(true)}>
              Add New Address
            </button>
          )}
        </div>
        <div className="pt-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-8 pb-10 mb-8">
          {userInfo.addresses?.length ? (
            userInfo.addresses.map((address) => (
              <div key={address.id} className="bg-gray-200 border rounded-lg p-4">
                <p>
                  {address.street}, {address.city}, {address.state}
                </p>
                <p>{address.pincode}</p>
                <div className="flex gap-4 mt-2">
                  <button className="underline text-blue-900" onClick={() => onEditAddress(address)}>
                    Update
                  </button>
                  <button className="underline text-blue-900" onClick={() => onDeleteAddress(address.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No addresses found.</p>
          )}
        </div>
      </div>


      {addAddress && (
      <AddAddress
        onCancel={() => {
          setAddAddress(false);
          setEditingAddress(null);
        }}
        address={editingAddress} // Pass the address to edit
        onSave={(updatedData) => {
          onUpdateAddress(updatedData); // Update the address when save
          setAddAddress(false);
        }}
      />
    )}
    </div>
  );
};

export default UserProfile;

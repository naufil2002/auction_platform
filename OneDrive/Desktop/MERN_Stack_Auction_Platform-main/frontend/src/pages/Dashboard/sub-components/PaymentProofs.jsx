import { deletePaymentProof, getSinglePaymentProofDetail } from "@/store/slices/superAdminSlice";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import Drawer from './Drawer'; // Import the Drawer component

const PaymentProofs = () => {
  const { paymentProofs, singlePaymentProof } = useSelector((state) => state.superAdmin);
  const [openDrawer, setOpenDrawer] = useState(false); // State to control Drawer visibility
  const dispatch = useDispatch();

  const handlePaymentProofDelete = (id) => {
    dispatch(deletePaymentProof(id));
  };

  const handleFetchPaymentDetail = (id) => {
    dispatch(getSinglePaymentProofDetail(id));
    setOpenDrawer(true); // Open drawer when Update button is clicked
  };

  useEffect(() => {
    if (singlePaymentProof && Object.keys(singlePaymentProof).length > 0) {
      // Drawer should only open when singlePaymentProof is available
      setOpenDrawer(true);
    }
  }, [singlePaymentProof]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white mt-5">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 py-2">User ID</th>
              <th className="w-1/3 py-2">Status</th>
              <th className="w-1/3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {paymentProofs.length > 0 ? (
              paymentProofs.map((element, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 text-center">{element.userId}</td>
                  <td className="py-2 px-4 text-center">{element.status}</td>
                  <td className="flex items-center py-4 justify-center gap-3">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition-all duration-300"
                      onClick={() => handleFetchPaymentDetail(element._id)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition-all duration-300"
                      onClick={() => handlePaymentProofDelete(element._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center text-xl text-sky-600 py-3">
                <td>No payment proofs are found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Only show Drawer if openDrawer is true */}
      {openDrawer && <Drawer setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />}
    </>
  );
};

export default PaymentProofs;

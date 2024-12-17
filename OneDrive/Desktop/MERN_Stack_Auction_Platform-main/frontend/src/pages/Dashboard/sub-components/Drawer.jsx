// Drawer Component (create this below PaymentProofs or in a separate file)
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePaymentProof } from "@/store/slices/superAdminSlice"; // Import your updatePaymentProof action

// eslint-disable-next-line react/prop-types
const Drawer = ({ setOpenDrawer, openDrawer }) => {
  const { singlePaymentProof, loading } = useSelector((state) => state.superAdmin);
  const [amount, setAmount] = useState(singlePaymentProof.amount || "");
  const [status, setStatus] = useState(singlePaymentProof.status || "");

  const dispatch = useDispatch();

  const handlePaymentProofUpdate = () => {
    dispatch(updatePaymentProof(singlePaymentProof._id, status, amount));
  };

  return (
    <section
      className={`fixed ${openDrawer && singlePaymentProof.userId ? "bottom-0" : "-bottom-full"} left-0 w-full transition-all duration-300 h-full bg-[#00000087] flex items-end`}
    >
      <div className="bg-white h-fit transition-all duration-300 w-full">
        <div className="w-full px-5 py-8 sm:max-w-[640px] sm:m-auto">
          <h3 className="text-[#D6482B] text-3xl font-semibold text-center mb-1">
            Update Payment Proof
          </h3>
          <p className="text-stone-600">
            You can update payment status and amount.
          </p>
          <form className="flex flex-col gap-5 my-5">
            <div className="flex flex-col gap-3">
              <label className="text-[16px] text-stone-600">User ID</label>
              <input
                type="text"
                value={singlePaymentProof.userId || ""}
                disabled
                className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600 rounded-md focus:outline-none text-stone-600"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[16px] text-stone-600">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[16px] text-stone-600">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600 rounded-md focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Settled">Settled</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[16px] text-stone-600">Comment</label>
              <textarea
                rows={5}
                value={singlePaymentProof.comment || ""}
                disabled
                className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600 rounded-md focus:outline-none text-stone-600"
              />
            </div>
            <div>
              <button
                type="button"
                className="bg-blue-500 flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-blue-700"
                onClick={handlePaymentProofUpdate}
              >
                {loading ? "Updating Payment Proof" : "Update Payment Proof"}
              </button>
            </div>
            <div>
              <button
                type="button"
                className="bg-yellow-500 flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-yellow-700"
                onClick={() => setOpenDrawer(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Drawer;

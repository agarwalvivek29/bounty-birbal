import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dispurse from "../Components/Dispurse";
import History from "../Components/History";
import { OrderData } from "../interfaces";
import { RootState } from "../store/store";
import { addHistory } from "../store/auth/authslice";

const Home: React.FC = () => {
  const [activeContent, setActiveContent] = useState<string>("dispense");
  const history = useSelector((state: RootState) => state.auth.history);
  const dispatch = useDispatch();

  const renderContent = () => {
    if (activeContent === "dispense") {
      return (
        <Dispurse
          setActiveTab={setActiveContent}
          setHistory={(order: OrderData) => dispatch(addHistory(order))}
        />
      );
    } else if (activeContent === "history") {
      return <History history={history} />;
    }
  };

  return (
    <div className="md:mx-40">
      <div className="bg-[#F5F6FE] px-2 w-[24%] py-1 rounded-lg flex ">
        <button
          className={`px-3 py-2 rounded-sm ${
            activeContent === "dispense" ? "bg-white" : ""
          }`}
          onClick={() => setActiveContent("dispense")}
        >
          Dispense
        </button>
        <button
          className={`px-3 py-2 rounded-sm ${
            activeContent === "history" ? "bg-white" : ""
          }`}
          onClick={() => setActiveContent("history")}
        >
          History
        </button>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default Home;

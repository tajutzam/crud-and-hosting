import Header from "../../Header";
import HistoryCard from "./HistoryCard";
import "./History.css";

function History() {
  return (
    <div>
      <Header></Header>
      {/* faq */}
      <div className="faq-section pt-5 pb-4">
        <div className="container-xl d-flex flex-column pt-5 mt-5">
          <div>
            <div className="w-80 m-auto"></div>
            <HistoryCard></HistoryCard>
            <HistoryCard></HistoryCard>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default History;

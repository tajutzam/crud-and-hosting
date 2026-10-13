import "./History.css";

type HistoryProps = {
  readonly status: string;
  readonly number: string;
  readonly date: string;
  readonly total: string;
};

function HistoryCard({
  status = "undefined",
  number = "XXXXXXXXXXXX",
  date = "XXXXXXXXXXXX",
  total = "XXXXXXXXX",
}: HistoryProps) {
  return (
    <div className="faq mx-auto mb-5">
      <div className="container-lg pt-5 ps-5 pe-5 pb-5">
        <div className="row">
          <div className="col-12 col-md-7">
            <div className="row">
              <div className="col-9 col-sm-6 col-lg-5 ">Nomor Pesanan</div>
              <div className="col-1">:</div>
              <div className="col-12 col-sm-4 pt-2 pt-sm-0 pb-2 pb-sm-0">{number}</div>
            </div>
            <div className="row">
              <div className=" col-9 col-sm-6 col-lg-5 ">Tanggal Pesanan</div>
              <div className="col-1">:</div>
              <div className="col-12 col-sm-4 pt-2 pt-sm-0 pb-2 pb-sm-0">{date}</div>
            </div>
            <div className="row">
              <div className=" col-9 col-sm-6 col-lg-5 ">Total Pembayaran</div>
              <div className="col-1">:</div>
              <div className="col-12 col-sm-4 pt-2 pt-sm-0 pb-2 pb-sm-0">{total}</div>
            </div>
          </div>
          <div className="col-12 col-md-5 mt-md-0 mt-3 d-flex justify-content-center align-items-center">
            <div className="status">{status}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryCard;

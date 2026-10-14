
import "./MyAccount.css";

import Baris from "../../Baris";

import Guest from "../../assets/Guest.png";

type ProfileProps = {
  readonly name: string;
  readonly dateOfBirth: string;
  readonly imageUrl: string;
  readonly memberSince: string;
};

function MyAccount({
  name = "Placeholder Name",
  dateOfBirth = "20 November 2005",
  imageUrl = Guest,
  memberSince = "20 November 2025",
}: ProfileProps) {
  return (
    <div>
      <div className="container-xl d-flex flex-column pt-5">
        <p className="fs-1 fw-bold text-light text-center mt-5">My Account</p>
        <div className="profile m-auto mb-5 d-none d-md-flex">
          <div className="col-5">
            <div className="profile-picture p-0">
              <img src={imageUrl} alt="profile picture" />
            </div>
          </div>
          <div className="col-7 d-flex flex-column p-2">
            <p>{name}</p>
            <p>{dateOfBirth}</p>
            <p className="mt-auto"> Member Since: {memberSince}</p>
          </div>
        </div>
        <div className="profile-small m-auto mb-5 d-flex d-md-none">
          <div className="row">
            <div className="col-12 col-sm-5">
              <div className="profile-picture p-0 ps-5">
                <img src={imageUrl} alt="profile picture" />
              </div>
            </div>
            <div className="col-12 col-sm-7 d-flex flex-column p-5 p-sm-1">
              <p>{name}</p>
              <p>{dateOfBirth}</p>
              <p className="mt-auto"> Member Since: {memberSince}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 d-flex flex-column align-items-center">
            <p className=" fs-4 fw-semibold text-light mb-2">
              Alamat Tersimpan
            </p>
            <div className="whitefield mb-5 p-2">
              <Baris title="Alamat"></Baris>
              <Baris></Baris>
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex flex-column align-items-center">
            <p className=" fs-4 fw-semibold text-light mb-2">
              Riwayat Transaksi
            </p>
            <div className="whitefield mb-5 p-2">
              <Baris title="Transaksi1"></Baris>
              <Baris></Baris>
              <Baris></Baris>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;

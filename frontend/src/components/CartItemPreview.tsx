import "../styles/CartItemPreview.css";

type ItemProps = {
  readonly name: string;
  readonly size: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly alt: string;
};

function CartItemPreview({
  name = "Placeholder Name",
  size = "Placeholder S",
  price = 1,
  imageUrl,
  alt,
}: ItemProps) {
  return (
    <div className="ps-3">
      <div className="card-preview row mt-4">
        <img className="card-image col-6" src={imageUrl} alt={alt} />
        <div className="col-6 d-flex flex-column pt-4 ps-4">
          <p>{name}</p>
          <p>Size : {size}</p>
          <p className="mt-auto">Rp. {price}</p>
        </div>
      </div>
    </div>
  );
}

export default CartItemPreview;

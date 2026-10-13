import "./ProductCard.css";
import PlaceholderImg from "../../../assets/Placeholder.png";

type CardProps = {
  readonly name: string;
  readonly price: string;
  readonly imgUrl: string;
  readonly alt: string;
};

function ProductCard({
  name = "Placeholder Name",
  price = "120000",
  imgUrl = PlaceholderImg,
  alt,
}: CardProps) {
  return (
    <div className="col-6 col-md-4 col-xl-3 pb-4">
      <div className="product-card">
        
        {/* Image Section */}
        <div className="img-wrapper">
          <img src={imgUrl} alt={alt} />
        </div>

        {/* Content Section */}
        <div className="bg-light d-flex flex-column flex-grow-1">
          <div className="p-3 product-details">
            {/* Added 'product-name' class here for ellipsis */}
            <p className="mb-1 product-name" title={name}>
              {name}
            </p>
            <p className="mb-0 fs-5 fw-semibold">Rp. {price}</p>
          </div>

          {/* Buttons */}
          <div className="row g-0">
            <button className="bg-warning col-6">edit</button>
            <button className="bg-danger col-6">delete</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;
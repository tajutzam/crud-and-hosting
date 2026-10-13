import guestPic from '../assets/Guest.png'

type CardProps = {
  readonly name: string;
  readonly job : string;
  readonly cardImage: string;
  readonly alt: string;
}

function Card({name = "Guest", job = "Working", cardImage = guestPic, alt }: CardProps) {
    return(
        <div className="card">
            <img className='card-image' src={cardImage} alt={alt} />
            <h2 className='card-title'>{name}</h2>
            <p className='card-text'>{job}</p>
        </div>
    );
}

export default Card
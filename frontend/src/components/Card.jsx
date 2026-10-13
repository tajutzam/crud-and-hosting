import profilePic from '../assets/furina.png'

function Card(){
    return(
        <div className="card">
            <img className='card-image' src={profilePic} alt="" />
            <h2 className='card-title'>Habibi</h2>
            <p className='card-text'>IPB University</p>
        </div>
    )
}

export default Card
const TeamItem = ({ imgMember, name, position }) => {
    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="our-team">
                <div className="picture">
                    <img className="img-fluid"
                    style={{ width: 130, height: 130, objectFit: "cover"}}
                    src={imgMember}></img>
                </div>
                <div className="team-content">
                    <h3 className="name">{name}</h3>
                    <h4 className="title">{position}</h4>
                </div>
            </div>
        </div>
    );
}

export default TeamItem;

const MenuSection = () => {
    return (
        <section className="py-5">
        <div className="container my-5 whiteColor">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <h2 className="big-text">Menu</h2>
                    <h3 className="larger-text">Polievky</h3>
                    <div id="polievky" className="medium-text"></div>
                    <h3 className="larger-text">Hlavné jedlá</h3>
                    <div id="hlavneJedla" className="medium-text"></div>
                    <h3 className="larger-text">Prílohy</h3>
                    <div id="prilohy" className="medium-text"></div>
                </div>
            </div>
        </div>
        </section>
    );
}

export default MenuSection;
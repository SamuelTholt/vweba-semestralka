import TeamItem from "../components/TeamItem";
import useInViewAnim from "../hooks/useInViewAnimation";

import lukasImg from "../assets/images/lukas.jpg"
import jozefImg from "../assets/images/jozef.jpg"

import karelImg from "../assets/images/karel.jpeg"
import vladoImg from "../assets/images/vlado.jpg"

const TeamSection = () => {
    const [ref, isVisible] = useInViewAnim();

    return (
        <section className="shapedivider-dripping"
        style={{ backgroundColor:"#3A4F50"}}>
        <div ref={ref} 
        className={`container ${isVisible ? "grow-animation" : "hidden"}`}>
        <h2 className="display-5 custom-heading text-shadow text-center whiteColor" style={{ marginTop: 200 }}> <span style={{ fontWeight: 'bold'}}>NÁŠ TÍM KUCHÁROV</span></h2>
            <div className="row" style={{ marginTop: 50 }}>
                <TeamItem
                    imgMember={lukasImg}
                    name="Lukáš Kamenický"
                    position="Hlavný šéfkuchár"/>

                <TeamItem
                    imgMember={jozefImg}
                    name="Jozef Sliacky"
                    position="Šéfkuchár"/>

                <TeamItem
                    imgMember={karelImg}
                    name="Karel Novotný"
                    position="Šéfkuchár"/>

                <TeamItem
                    imgMember={vladoImg}
                    name="Vladimír Nazarecký"
                    position="Šéfkuchár"/>
            </div>
        </div>
    </section>
    );
}

export default TeamSection;
import { useEffect, useState } from "react"
import useInViewAnim from "../hooks/useInViewAnimation";

const WelcomeSection = () => {
    const paragraphs = [
        "Vitajte v LK Pizzerii, mieste, kde sa vášeň pre poctivú pizzu a pohostinnosť spájajú, aby vytvorili nezabudnuteľný zážitok pre našich hostí. S hrdosťou sme sa stali klenotom našej komunity a jednou z najobľúbenejších pizzérií v okolí. Od našich skromných začiatkov sme rástli a rozvíjali sa s jediným cieľom: priniesť vám to najlepšie z talianskej kuchyne a ponúknuť výnimočnú službu. Naša láska k pizze je zjavná v každom jednom kúsku, ktorý pripravujeme, a v každom úsmeve našich zamestnancov.",
        "Pri výbere surovín dbáme na kvalitu a čerstvosť, pretože vieme, že to je základ každej výnimočnej pizze. Naši pizzamajstri majú bohaté skúsenosti a s vášňou vytvárajú jedinečné kombinácie chutí, ktoré vás zaručene očaria. Naša ponuka zahŕňa tradičné talianske pizze, ako aj originálne recepty, ktoré uspokoja aj tých najnáročnejších milovníkov tejto obľúbenej pochúťky.",
        "Naši zamestnanci sú srdcom našej pizzérie – ich pozornosť k detailom a ochota poskytnúť vynikajúcu obsluhu robia z návštevy LK Pizzerie skutočný zážitok. Naše útulné a priateľské prostredie vám umožní relaxovať a užiť si výnimočnú atmosféru, či už prídete na večeru s priateľmi, rodinné posedenie alebo rýchly obed počas pracovného dňa.",
        "Tešíme sa na to, že vás privítame v LK Pizzerii a umožníme vám objaviť svet výbornej pizze a srdečnej pohostinnosti. Vaša spokojnosť je pre nás prioritou a sme hrdí, že môžeme byť súčasťou vašich chutných zážitkov. Ďakujeme, že nás podporujete a že ste s nami!"
    ]

    const [currentParagraph, setCurrentParagraph] = useState(0);
    const [ref, isVisible] = useInViewAnim();

    const showNextParagraph = () => {
        setCurrentParagraph((prevParagraph) => (prevParagraph + 1) % paragraphs.length);
    };

    useEffect(() => {
        const interval = setInterval(showNextParagraph, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-5">
        <div ref={ref} 
        className={`container my-5 whiteColor ${isVisible ? "grow-animation" : "hidden"}`}>
            <div className="row justify-content-center text-center">
            <div className="col-lg-6">
                <h2 className="display-4 custom-heading"><span style={{ fontWeight: 'bold'}}>Vitajte</span></h2>
                <h2 className="custom-heading"><span style={{ fontWeight: 'normal'}}>V LK Pizzeria</span></h2>

                <p className="lead" onClick={showNextParagraph} style={{ cursor: 'pointer', textAlign: 'justify' }}>
                {paragraphs[currentParagraph]}
                </p>

                <p>
                [Klikni na odstavec, ak chceš prejsť na ďalší] <br />
                [Alebo čakaj 30 sekúnd, kým sa zobrazí ďalší]
                </p>
            </div>
            </div>
        </div>
        </section>
    );
}

export default WelcomeSection;
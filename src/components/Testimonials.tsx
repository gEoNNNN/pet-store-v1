import Reveal from "./Reveal";
import {
  TestimonialsColumn,
  type Testimonial,
} from "./ui/testimonials-columns-1";
import styles from "./Testimonials.module.css";

const testimonials: Testimonial[] = [
  {
    name: "Ștefan Crețu",
    initials: "ȘC",
    role: "Local Guide · 27 de recenzii · 153 de fotografii",
    date: "acum 4 ani",
    text: "Totul pentru animale. Pentru animale de companie este o gamă largă de mâncăruri la cel mai ieftin preț din țară.",
    image: "/img/reviews/client1.png",
  },
  {
    name: "Veaceslav",
    initials: "V",
    role: "Local Guide · 34 de recenzii · 189 de fotografii",
    date: "acum 5 ani",
    text: "Produse calitative la preț accesibil și deservire rapidă.",
    image: "/img/reviews/client2.png",
  },
  {
    name: "Victor Pîslaru",
    initials: "VP",
    role: "Local Guide · 49 de recenzii · 54 de fotografii",
    date: "acum 6 ani",
    text: "Un loc unde găsești o gamă variată de medicamente de uz veterinar.",
    image: "/img/reviews/client3.png",
  },
  {
    name: "Nicolai Demeaniuc",
    initials: "ND",
    role: "Local Guide · 154 de recenzii · 408 fotografii",
    date: "acum o lună",
    text: "Cele mai mici prețuri la hrana pentru câini din Chișinău, printre magazinele de unde am cumpărat sau verificat prețurile anterior. Întotdeauna există un loc de parcare!",
    image: "/img/reviews/client4.png",
  },
  {
    name: "Constantin Sirbu",
    initials: "CS",
    role: "9 recenzii · O fotografie",
    date: "acum 6 ani",
    text: "Puteți găsi aici tot felul de medicamente la prețuri bune. Clădirea este frumoasă, personalul este prietenos și explică totul clar. Recomand!",
    image: "/img/reviews/client5.png",
  },
  {
    name: "Evghenia Zeleniuc",
    initials: "EZ",
    role: "Local Guide · 126 de recenzii · 798 de fotografii",
    date: "acum 6 ani",
    text: "Cumpărăm doar mâncare, vitamine și dulciuri de acolo. Cele mai bune prețuri, servicii excelente, mereu mulțumiți! Recomand cu căldură!",
    image: "/img/reviews/client6.png",
  },
  {
    name: "Mihail Amurov",
    initials: "MA",
    role: "Local Guide · 6 recenzii · 132 de fotografii",
    date: "acum 7 ani",
    text: "Mulțumesc pentru sfaturi și ajutor. Ieftin și de înaltă calitate!",
    image: "/img/reviews/client7.png",
  },
  {
    name: "Veaceslav Grigoriev",
    initials: "VG",
    role: "Local Guide · 21 de recenzii · 2 fotografii",
    date: "acum 6 ani",
    text: "Mulțumim angajaților pentru profesionalism și efortul depus pentru deservirea clienților.",
    image: "/img/reviews/client8.png",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6);

export default function Testimonials() {
  return (
    <section className={styles.section} aria-labelledby="testimonials-heading">
      <div className="container">
        <Reveal className={styles.header}>
          <h2 id="testimonials-heading">
            Ce spun oamenii despre <em>Farmavet</em>
          </h2>
          <div className={styles.rating}>
            <span className={styles.ratingScore}>4,8</span>
            <span className={styles.ratingStars} aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg key={index} viewBox="0 0 24 24">
                  <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.3 5.9 20.4l1.5-6.8L2.2 9l6.9-.7L12 2z" />
                </svg>
              ))}
            </span>
            <span className={styles.ratingLabel}>Notă generală pe Google</span>
          </div>
          <p className={styles.intro}>
            Experiențe împărtășite de clienții care ne-au vizitat magazinul.
          </p>
          <a
            href="https://maps.app.goo.gl/zbrmi44MwjviSwvc6"
            target="_blank"
            rel="noreferrer"
            className={styles.googleLink}
          >
            Vezi locația pe Google Maps
          </a>
        </Reveal>

        <div className={styles.columns}>
          <TestimonialsColumn testimonials={firstColumn} duration={17} />
          <TestimonialsColumn
            testimonials={secondColumn}
            duration={21}
            className={styles.secondColumn}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            duration={18}
            className={styles.thirdColumn}
          />
        </div>
      </div>
    </section>
  );
}

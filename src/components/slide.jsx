import React from "react";
import SlideImage from "./slideImage.jsx";
import SlideInfo from "./slideInfo.jsx";
import styles from "../style/main.less";
import "../style/slide.css";

const Slide = props => (
  <div className="container">
    <div className="row">
  <div className={styles["slide"]}>
    <SlideImage
      src={props.image.src}
      alt={props.image.alt}
      id={props.image.id}
      handleClick={props.handleClick}
    />
    <SlideInfo
      name={props.image.name}
      sale={props.sale}
      id={props.image.id}
      price={props.price}
      reviews={props.reviews}
      handleClick={props.handleClick}
    />
  </div>
  </div>
  </div>
);

export default Slide;

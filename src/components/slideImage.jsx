import React from "react";
import styles from "../style/main.less";

const SlideImage = props => (
  <div className={styles["slide-image"]} onClick={props.handleClick}>
    <img src={props.src} alt={props.alt} id={`item${props.id}`} />
  </div>
);

export default SlideImage;

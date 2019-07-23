import React from "react";
import styles from "../style/main.less";

const SlideInfo = props => (
  <div className={styles["slide-info"]}>
    <h5
      className={styles["three-line-fade"]}
      id={`name-item${props.id}`}
      onClick={props.handleClick}
    >
      {props.name}
    </h5>
    <h6>
      <span className={styles["review-stars"]}>
        {renderStars(props.reviews[1])}
      </span>
      <span className={styles["small-text"]}>({props.reviews[0]})</span>
    </h6>
    <h6 className={styles["price-text"]}>
      {props.price.toLocaleString("en-EN", {
        style: "currency",
        currency: "USD"
      })}
    </h6>
  </div>
);

const renderStars = starCount => {
  let result = "";
  let fullStar = "\uECE2";
  let halfStar = "\uECE1";
  let emptyStar = "\uECE0";
  for (let i = 1; i < 6; i++) {
    let diff = starCount - i;
    if (diff >= -0.4) {
      result += fullStar;
    } else if (diff <= -0.4 && diff > -1) {
      result += halfStar;
    } else {
      result += emptyStar;
    }
  }
  return result;
};

export default SlideInfo;

import React from "react";
import Slide from "./slide.jsx";
import Slider from "react-slick";
import styles from "../style/main.less";
import "../style/slick.css";
import "../style/slick-theme.css";
import "../style/carousel.css";

class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.slider = React.createRef();
    this.resetCarousels = this.resetCarousels.bind(this);
  }

  componentDidUpdate() {
    this.resetCarousels();
  }

  resetCarousels() {
    this.slider.current.slickGoTo(0);
  }

  render() {
    const settings = {
      dots: true,
      infinite: false,
      speed: 600,
      slidesToShow: 4.5,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3.5,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 2,
            arrows: false,
            speed: 500
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            arrows: false,
            speed: 450
          }
        },
        {
          breakpoint: 300,
          settings: {
            slidesToShow: 1,
            arrows: false,
            dots: false
          }
        }
      ]
    };

    return (
      <div className={styles["total-carousel-container"]}>
        <h2>{this.props.name}</h2>
        <Slider ref={this.slider} {...settings}>
          {this.props.images.map((image, index) => {
            {
              if (image.id.toString().length === 1) {
                image.id = "00" + image.id;
              } else if (image.id.toString().length === 2) {
                image.id = "0" + image.id;
              }
            }
            return (
              <Slide
                image={image}
                reviews={this.props.reviews[index] || [0, 0]}
                price={this.props.prices[index] || 0}
                key={`item${image.id}`}
                handleClick={this.props.handleClick}
              />
            );
          })}
        </Slider>
      </div>
    );
  }
}

export default Carousel;
